import { IGNORE_API_TOKENS } from '../../env'
import { JiraBoardIds } from '../types/jira'
// Jira 기본 설정
import type { SyncType } from '../types/jira'

export const JIRA_BASE_URL = 'https://ignitecorp.atlassian.net'

// Jira 보드 ID 매핑
export const JIRA_BOARD_IDS: JiraBoardIds = {
  FEHG: 251,
  KQ: 20,
  HB: 350,
  AUTOWAY: 37, // HDD를 AUTOWAY로 매핑
}

// Jira 사용자 매핑 (기존에 있던 것)
export const JIRA_USER_MAP: Record<string, string> = {
  한준호: '712020:f4f9e56c-4b40-41ac-af83-5d2f774a72d5',
  손현지: '639a6767f134138b5a5132f6',
  김가빈: '637426199e48f2b9a6108c25',
  박성찬: '638d49155fce844d606c7682',
  서성주: '639fa03f2c70aae1e6f79806',
  김찬영: '712020:11fff4cb-cb95-457e-95a2-6cf9045c53b2',
  조한빈: '712020:403a306e-0eff-4d57-9fda-2f517158d40f',
  이미진: '712020:96cf8ab5-20ff-4d6b-960d-5d38b7a46a39',
}

export const JIRA_ASSINEE_MAP: Record<string, string> = {
  ['712020:f4f9e56c-4b40-41ac-af83-5d2f774a72d5']: 'ZS17249', // 한준호
  ['639a6767f134138b5a5132f6']: 'ZS11269', // 손현지
  ['637426199e48f2b9a6108c25']: 'ZS11185', // 김가빈
  ['638d49155fce844d606c7682']: 'ZS11241', // 박성찬
  ['639fa03f2c70aae1e6f79806']: 'ZS11262', // 서성주
  ['712020:11fff4cb-cb95-457e-95a2-6cf9045c53b2']: 'Z204225', // 김찬영
  ['712020:403a306e-0eff-4d57-9fda-2f517158d40f']: 'Z204285', // 조한빈
  ['712020:96cf8ab5-20ff-4d6b-960d-5d38b7a46a39']: 'ZS18620', // 이미진
}

// 싱크 대상별 업데이트 필드 설정
export const SYNC_FIELD_CONFIG = {
  FEHG_TO_KQ: {
    description: 'FEHG → KQ 싱크 시 업데이트할 필드들',
    fields: [
      'summary',
      'duedate',
      'customfield_10015', // 시작일
      'assignee',
      'timetracking',
      'customfield_10020', // 스프린트 필드
    ] as const,
  },
  FEHG_TO_HB: {
    description: 'FEHG → HB 싱크 시 업데이트할 필드들',
    fields: [
      'summary',
      'duedate',
      'customfield_10015', // 시작일
      'assignee',
      'timetracking',
      'customfield_10020', // 스프린트 필드 - 매핑 로직 구현 완료
    ] as const,
  },
  FEHG_TO_AUTOWAY: {
    description: 'IgniteJira FEHG → HmgJira AUTOWAY 싱크 시 업데이트할 필드들',
    fields: [
      'summary',
      'duedate',
      'customfield_10015', // 시작일
      'assignee',
      'timetracking',
      'customfield_10020', // 스프린트 필드
    ] as const,
  },
} as const

// API 토큰들 (환경변수에서 로드)
export const API_TOKENS = {
  JIRA_API_TOKEN:
    process.env.JIRA_API_TOKEN || IGNORE_API_TOKENS.JIRA_API_TOKEN,
  ATLASSIAN_TOKEN:
    process.env.ATLASSIAN_TOKEN || IGNORE_API_TOKENS.ATLASSIAN_TOKEN,
  HMG_JIRA_TOKEN:
    process.env.HMG_JIRA_TOKEN || IGNORE_API_TOKENS.HMG_JIRA_TOKEN,
}

// HmgJira 설정 (REST API v2, HMG_JIRA_TOKEN 사용)
export const HMG_JIRA_CONFIG = {
  BASE_URL: 'https://jira.hmg-corp.io',
  PROJECT_KEY: 'AUTOWAY', // HmgJira 내부의 AUTOWAY 프로젝트
  USERNAME: 'ssj@ignite.co.kr',
}

// 스프린트 캐시 설정
export const SPRINT_CACHE_CONFIG = {
  TTL: 5 * 60 * 1000, // 5분 (밀리초)
  MAX_RETRIES: 3, // 최대 재시도 횟수
  RETRY_DELAY: 1000, // 재시도 간격 (밀리초)
} as const

// 스프린트 매핑 설정
export const SPRINT_MAPPING = {
  FEHG_TO_HB: {
    description: 'FEHG → HB 스프린트 매핑',
    pattern: /^FEHG\s+(\d{2})(\d{2})$/,
    targetFormat: 'HB 20$1$2',
  },
  FEHG_TO_KQ: {
    description: 'FEHG → KQ 스프린트 매핑',
    pattern: /^FEHG\s+(\d{2})(\d{2})$/,
    targetFormat: 'KQ 20$1$2',
  },
} as const

// 스프린트 매핑 함수
export function mapSprintName(
  sourceSprintName: string,
  syncType: SyncType
): string | null {
  const mapping = SPRINT_MAPPING[syncType as keyof typeof SPRINT_MAPPING]
  if (!mapping) {
    return null
  }

  const match = sourceSprintName.match(mapping.pattern)
  if (!match) {
    return null
  }

  const year = match[1] // 25
  const month = match[2] // 08
  return mapping.targetFormat.replace('$1', year).replace('$2', month)
}

// 스프린트 존재 여부 확인 함수 (대상 프로젝트 스프린트 목록에서 확인)
export function findMatchingSprint(
  sourceSprintName: string | null,
  targetSprints: Array<{ name: string; id: number }>,
  _syncType: SyncType
): { id: number; name: string } | null {
  if (!sourceSprintName || typeof sourceSprintName !== 'string') {
    console.warn(`⚠️ 유효하지 않은 스프린트 이름:`, sourceSprintName)
    return null
  }

  const mappedSprintName = mapSprintName(sourceSprintName, _syncType)
  if (!mappedSprintName) {
    return null
  }

  const matchingSprint = targetSprints.find(
    (sprint) => sprint.name === mappedSprintName
  )
  return matchingSprint
    ? { id: matchingSprint.id, name: matchingSprint.name }
    : null
}
