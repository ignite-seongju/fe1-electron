import axios, { AxiosInstance } from 'axios';
import { 
  JiraIssueDetail, 
  JiraApiResponse, 
  JiraBoardIds,
  JiraIssueUpdatePayload,
  SyncType,
  SyncUpdateResult 
} from '../types/jira';
import { JIRA_BASE_URL, JIRA_BOARD_IDS, API_TOKENS, SYNC_STATUSES, SYNC_FIELD_CONFIG, SPRINT_CACHE_CONFIG, findMatchingSprint } from '../utils/constants';

// 스프린트 캐시 인터페이스
interface SprintCacheEntry {
  sprints: Array<{ name: string; id: number }>;
  timestamp: number;
}

// 스프린트 캐시 저장소
const sprintCache = new Map<number, SprintCacheEntry>();

class JiraApiClient {
  private client: AxiosInstance;
  private auth: { username: string; password: string };

  constructor() {
    this.auth = {
      username: 'ssj@ignite.co.kr', // 실제 이메일로 교체 필요
      password: API_TOKENS.ATLASSIAN_TOKEN
    };

    this.client = axios.create({
      baseURL: JIRA_BASE_URL,
      auth: this.auth,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * 담당자의 In Progress, To Do 상태 티켓들을 조회
   */
  async getInProgressAndPlannedIssues(
    boardKey: keyof JiraBoardIds,
    assigneeId: string
  ): Promise<JiraIssueDetail[]> {
    try {
      const jql = `assignee IN (${assigneeId}) AND status IN ("In Progress", "To Do")`;
      
      const boardId = JIRA_BOARD_IDS[boardKey];
      const apiUrl = `/rest/agile/1.0/board/${boardId}/issue`;
      
      console.log(`Fetching issues for board: ${boardKey} (${boardId})`);
      console.log(`JQL: ${jql}`);

      const response = await this.client.get<JiraApiResponse>(apiUrl, {
        params: {
          jql: jql,
          expand: 'issuelinks'
        }
      });

      if (!response?.data?.issues || response.data.issues.length === 0) {
        console.log('No issues found');
        return [];
      }

      console.log(`Found ${response.data.issues.length} issues`);
      return response.data.issues;

    } catch (error) {
      console.error('Error fetching in-progress and planned issues:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
      }
      throw error;
    }
  }

  /**
   * 특정 이슈의 연결된 이슈들을 조회 (blocks 관계)
   */
  async getLinkedIssues(issueKey: string): Promise<JiraIssueDetail[]> {
    try {
      const apiUrl = `/rest/api/3/issue/${issueKey}`;
      
      const response = await this.client.get(apiUrl, {
        params: {
          expand: 'issuelinks'
        }
      });

      const issue = response.data;
      const linkedIssues: JiraIssueDetail[] = [];

      if (issue.fields.issuelinks) {
        for (const link of issue.fields.issuelinks) {
          // outward 관계 (현재 이슈가 다른 이슈를 blocks)
          if (link.outwardIssue && link.type.name === 'Blocks') {
            const linkedIssue = await this.getIssueDetails(link.outwardIssue.key);
            linkedIssues.push(linkedIssue);
          }
        }
      }

      return linkedIssues;
    } catch (error) {
      console.error(`Error fetching linked issues for ${issueKey}:`, error);
      throw error;
    }
  }

  /**
   * FEHG 이슈들의 blocks 관계로 연결된 대상 프로젝트 티켓들을 찾기
   */
  async findLinkedTargetIssues(
    fehgIssues: JiraIssueDetail[], 
    targetProject: 'KQ' | 'HB' | 'AUTOWAY'
  ): Promise<{
    fehgKey: string;
    fehgSummary: string;
    linkedKqIssues: Array<{
      key: string;
      summary: string;
      status: string;
    }>;
  }[]> {
    const results = [];

    for (const fehgIssue of fehgIssues) {
      try {
        console.log(`🔍 ${fehgIssue.key}의 연결된 이슈 조회 중...`);
        
        // blocks로 연결된 대상 프로젝트 이슈들 찾기
        const issuelinks = fehgIssue.fields.issuelinks || [];
        const linkedTargetIssues = this.findBlocksIssues(issuelinks, targetProject);
        
        if (linkedTargetIssues.length > 0) {
          // 연결된 대상 프로젝트 이슈들의 상세 정보 조회
          const targetIssueDetails = [];
          for (const targetKey of linkedTargetIssues) {
            try {
              const targetIssue = await this.getIssueDetails(targetKey);
              targetIssueDetails.push({
                key: targetIssue.key,
                summary: targetIssue.fields.summary,
                status: targetIssue.fields.status.name
              });
            } catch (error) {
              console.error(`${targetProject} 이슈 ${targetKey} 조회 실패:`, error);
            }
          }

          results.push({
            fehgKey: fehgIssue.key,
            fehgSummary: fehgIssue.fields.summary,
            linkedKqIssues: targetIssueDetails
          });

          console.log(`  📎 ${fehgIssue.key} → ${targetProject} 이슈 ${linkedTargetIssues.length}개 발견`);
        } else {
          console.log(`  ⚠️  ${fehgIssue.key}에 연결된 ${targetProject} 이슈 없음`);
        }
      } catch (error) {
        console.error(`${fehgIssue.key} 처리 중 오류:`, error);
      }
    }

    return results;
  }

  /**
   * blocks 관계의 특정 프로젝트 이슈들을 찾기
   */
  private findBlocksIssues(issueLinks: any[], targetProjectKey: string): string[] {
    const blocksIssueKeys: string[] = [];

    issueLinks.forEach((link) => {
      // Blocks 관계 확인 (inward 또는 outward)
      if (
        link.type.name.toLowerCase().includes('blocks') ||
        link.type.inward.toLowerCase().includes('blocks') ||
        link.type.outward.toLowerCase().includes('blocks')
      ) {
        // outward 관계 (현재 이슈가 다른 이슈를 blocks)
        if (
          link.outwardIssue &&
          link.outwardIssue.key.startsWith(targetProjectKey)
        ) {
          blocksIssueKeys.push(link.outwardIssue.key);
        }
      }
    });

    return [...new Set(blocksIssueKeys)]; // 중복 제거
  }

  /**
   * 싱크 타입에 따른 업데이트 페이로드 생성
   */
  private async createUpdatePayload(
    issue: JiraIssueDetail,
    syncType: SyncType,
    targetBoardId?: number
  ): Promise<JiraIssueUpdatePayload> {
    const config = SYNC_FIELD_CONFIG[syncType];
    const fields: Partial<JiraIssueUpdatePayload['fields']> = {};

    for (const fieldName of config.fields) {
      switch (fieldName) {
        case 'summary':
          fields.summary = issue.fields.summary;
          break;
        case 'duedate':
          fields.duedate = (issue.fields as any).duedate;
          break;
        case 'customfield_10015':
          fields.customfield_10015 = (issue.fields as any).customfield_10015;
          break;
        case 'assignee':
          fields.assignee = issue.fields.assignee;
          break;
        case 'timetracking':
          fields.timetracking = (issue.fields as any).timetracking;
          break;
        case 'customfield_10020':
          // 스프린트 매핑 처리
          if (targetBoardId && (issue.fields as any).customfield_10020) {
            const sourceSprintField = (issue.fields as any).customfield_10020;

            // 디버깅: 실제 데이터 구조 확인
            console.log(`🔍 Sprint field type: ${typeof sourceSprintField}`);
            console.log(`🔍 Sprint field value:`, sourceSprintField);

            // 스프린트 이름 추출
            let sourceSprintName: string | null = null;

            if (typeof sourceSprintField === 'string') {
              sourceSprintName = sourceSprintField;
            } else if (Array.isArray(sourceSprintField)) {
              // 배열인 경우 첫 번째 스프린트의 name 사용
              if (sourceSprintField.length > 0 && sourceSprintField[0].name) {
                sourceSprintName = sourceSprintField[0].name;
              }
            } else if (
              sourceSprintField &&
              typeof sourceSprintField === 'object'
            ) {
              const sprintObj = sourceSprintField as any;
              sourceSprintName = sprintObj.name || sprintObj.value || null;
            }

            if (!sourceSprintName) {
              console.warn(
                `⚠️ 스프린트 이름을 추출할 수 없음:`,
                sourceSprintField
              );
              break; // 스프린트 필드 처리 건너뛰기
            }

            const targetSprints = await this.getCachedBoardSprints(targetBoardId);
            const matchingSprint = findMatchingSprint(
              sourceSprintName,
              targetSprints,
              syncType
            );

            if (matchingSprint) {
              // 스프린트 업데이트 시 ID를 사용
              fields.customfield_10020 = [matchingSprint.id];
              console.log(
                `✅ 스프린트 매핑 성공: ${sourceSprintName} → ${matchingSprint.name} (ID: ${matchingSprint.id})`
              );
            } else {
              console.log(
                `⚠️ 스프린트 매핑 실패: ${sourceSprintName}에 대응하는 스프린트가 없습니다.`
              );
              // 매핑되는 스프린트가 없으면 스프린트 필드를 업데이트하지 않음
            }
          }
          break;
      }
    }

    return { fields };
  }

  /**
   * 이슈 업데이트 (API 사용량 제한 처리 포함)
   */
  private async updateIssue(
    issueKey: string,
    updatePayload: JiraIssueUpdatePayload
  ): Promise<void> {
    try {
      const apiUrl = `/rest/api/3/issue/${issueKey}`;

      await this.client.put(apiUrl, updatePayload);

      // API 사용량 제한을 위한 지연 (초당 10개 요청 제한)
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error: any) {
      if (error.response?.status === 429) {
        console.error(`API 사용량 제한 도달: ${issueKey}`);
        throw new Error(`API 사용량 제한으로 인한 실패: ${issueKey}`);
      } else if (error.response?.status === 403) {
        console.error(`권한 없음: ${issueKey}`);
        throw new Error(`권한 없음: ${issueKey}`);
      } else if (error.response?.status === 400) {
        console.error(`Bad Request for ${issueKey}:`, {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          errors: error.response.data?.errors,
          errorMessages: error.response.data?.errorMessages,
        });
        throw new Error(
          `Bad Request for ${issueKey}: ${JSON.stringify(error.response.data)}`
        );
      } else {
        console.error(`Error updating issue ${issueKey}:`, error);
        throw error;
      }
    }
  }

  /**
   * FEHG → 대상 프로젝트 동기화 실행 (KQ, HB, AUTOWAY 지원)
   */
  async syncFehgToTarget(
    boardKey: keyof JiraBoardIds,
    assigneeId: string,
    targetProject: 'KQ' | 'HB' | 'AUTOWAY'
  ): Promise<{
    success: boolean;
    message: string;
    results: SyncUpdateResult[];
    totalProcessed: number;
    totalSuccess: number;
    totalFailed: number;
  }> {
    const results: SyncUpdateResult[] = [];
    let totalProcessed = 0;
    let totalSuccess = 0;
    let totalFailed = 0;

    try {
      console.log(`🚀 FEHG → ${targetProject} 동기화 시작`);
      
      // 1. FEHG 담당자 티켓과 연결된 대상 프로젝트 이슈들 조회
      const linkedResults = await this.findLinkedTargetIssues(
        await this.getInProgressAndPlannedIssues(boardKey, assigneeId),
        targetProject
      );

      if (linkedResults.length === 0) {
        return {
          success: true,
          message: `동기화할 연결된 ${targetProject} 티켓이 없습니다.`,
          results: [],
          totalProcessed: 0,
          totalSuccess: 0,
          totalFailed: 0,
        };
      }

      // 동기화 타입 결정
      const syncType: SyncType = `FEHG_TO_${targetProject}` as SyncType;
      const targetBoardId = JIRA_BOARD_IDS[targetProject];

      // 2. 각 FEHG → 대상 프로젝트 연결에 대해 동기화 실행
      for (const linkedResult of linkedResults) {
        const { fehgKey, fehgSummary, linkedKqIssues: linkedTargetIssues } = linkedResult;
        
        try {
          console.log(`\n🔍 처리 중: ${fehgKey} - ${fehgSummary}`);
          
          // FEHG 이슈 상세 정보 조회
          const fehgIssue = await this.getIssueDetails(fehgKey);
          
          // 업데이트 페이로드 생성
          const updatePayload = await this.createUpdatePayload(
            fehgIssue,
            syncType,
            targetBoardId
          );

          console.log(`  📝 업데이트할 내용:`, updatePayload.fields);

          // 연결된 대상 프로젝트 이슈들 업데이트
          for (const targetIssue of linkedTargetIssues) {
            totalProcessed++;
            
            try {
              console.log(`    🔄 ${targetIssue.key} 업데이트 중...`);
              await this.updateIssue(targetIssue.key, updatePayload);
              
              results.push({
                sourceKey: fehgKey,
                sourceSummary: fehgSummary,
                targetKey: targetIssue.key,
                status: 'success'
              });
              
              totalSuccess++;
              console.log(`    ✅ ${targetIssue.key} 업데이트 성공`);
            } catch (error) {
              console.error(`    ❌ Failed to update ${targetIssue.key}:`, error);
              
              results.push({
                sourceKey: fehgKey,
                sourceSummary: fehgSummary,
                targetKey: targetIssue.key,
                status: 'failed',
                error: error instanceof Error ? error.message : String(error)
              });
              
              totalFailed++;
            }
          }
        } catch (error) {
          console.error(`❌ Error processing issue ${fehgKey}:`, error);
          totalFailed++;
        }
      }

      const successRate = totalProcessed > 0 ? (totalSuccess / totalProcessed * 100).toFixed(1) : '0';
      
      return {
        success: totalFailed === 0,
        message: `동기화 완료: ${totalSuccess}/${totalProcessed} 성공 (${successRate}%)`,
        results,
        totalProcessed,
        totalSuccess,
        totalFailed,
      };

    } catch (error) {
      console.error(`FEHG → ${targetProject} 동기화 실패:`, error);
      return {
        success: false,
        message: `동기화 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
        results,
        totalProcessed,
        totalSuccess,
        totalFailed,
      };
    }
  }

  /**
   * 보드의 스프린트 목록을 캐시와 함께 조회
   */
  private async getCachedBoardSprints(boardId: number): Promise<Array<{ name: string; id: number }>> {
    const now = Date.now();
    const cached = sprintCache.get(boardId);

    // 캐시가 유효한 경우 반환
    if (cached && (now - cached.timestamp) < SPRINT_CACHE_CONFIG.TTL) {
      console.log(`📦 스프린트 캐시 사용 (보드 ${boardId})`);
      return cached.sprints;
    }

    // 캐시가 없거나 만료된 경우 API 호출
    console.log(`🔍 스프린트 목록 조회 중... (보드 ${boardId})`);
    
    try {
      const response = await this.client.get(`/rest/agile/1.0/board/${boardId}/sprint`);
      const sprints = response.data.values.map((sprint: any) => ({
        name: sprint.name,
        id: sprint.id
      }));

      // 캐시에 저장
      sprintCache.set(boardId, {
        sprints,
        timestamp: now
      });

      console.log(`✅ 스프린트 ${sprints.length}개 조회 완료 (보드 ${boardId})`);
      return sprints;

    } catch (error) {
      console.error(`❌ 스프린트 조회 실패 (보드 ${boardId}):`, error);
      
      // 실패 시 캐시된 데이터라도 반환 (만료되었어도)
      if (cached) {
        console.log(`⚠️ 만료된 캐시 사용 (보드 ${boardId})`);
        return cached.sprints;
      }
      
      return [];
    }
  }

  /**
   * 특정 이슈의 상세 정보 조회
   */
  async getIssueDetails(issueKey: string): Promise<JiraIssueDetail> {
    try {
      const apiUrl = `/rest/api/3/issue/${issueKey}`;
      
      const response = await this.client.get(apiUrl, {
        params: {
          expand: 'issuelinks'
        }
      });

      return response.data;
    } catch (error) {
      console.error(`Error fetching issue details for ${issueKey}:`, error);
      throw error;
    }
  }

  /**
   * 이슈 상태 업데이트
   */
  async updateIssueStatus(issueKey: string, statusId: string): Promise<boolean> {
    try {
      const apiUrl = `/rest/api/3/issue/${issueKey}/transitions`;
      
      await this.client.post(apiUrl, {
        transition: {
          id: statusId
        }
      });

      console.log(`Successfully updated status for ${issueKey}`);
      return true;
    } catch (error) {
      console.error(`Error updating status for ${issueKey}:`, error);
      throw error;
    }
  }

  /**
   * API 연결 테스트
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.client.get('/rest/api/3/myself');
      console.log('Jira API connection successful:', response.data.displayName);
      return true;
    } catch (error) {
      console.error('Jira API connection failed:', error);
      return false;
    }
  }
}

// 싱글톤 인스턴스
export const jiraApiClient = new JiraApiClient();
