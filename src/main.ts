import * as dotenv from 'dotenv'
import { BrowserWindow, app, ipcMain, shell } from 'electron'
import * as path from 'path'

// 최신 Electron v38용 최적화된 안정화 플래그
app.commandLine.appendSwitch('--no-sandbox')
app.commandLine.appendSwitch('--disable-web-security')
app.commandLine.appendSwitch('--disable-dev-shm-usage')
app.commandLine.appendSwitch('--js-flags', '--max-old-space-size=4096')

// 환경변수 로드
dotenv.config()

// Hot reload를 위한 설정 (개발 환경에서만)
if (process.env.NODE_ENV === 'development') {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '..', 'node_modules', '.bin', 'electron'),
    hardResetMethod: 'exit',
  })
}

class ElectronApp {
  private mainWindow: BrowserWindow | null = null

  constructor() {
    this.initializeApp()
  }

  private initializeApp(): void {
    // 앱이 준비되면 윈도우 생성
    app.whenReady().then(() => {
      this.createMainWindow()

      // macOS에서 dock 아이콘 클릭 시 윈도우 재생성
      app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          this.createMainWindow()
        }
      })
    })

    // 모든 윈도우가 닫히면 앱 종료 (macOS 제외)
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })

    // IPC 핸들러 설정
    this.setupIpcHandlers()
  }

  private createMainWindow(): void {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'),
        sandbox: false,
        webSecurity: false,
        allowRunningInsecureContent: true,
        spellcheck: false,
      },
      titleBarStyle: 'default',
      show: false, // 준비되면 보이도록 설정
    })

    // HTML 파일 로드
    this.mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))

    // 외부 링크를 기본 브라우저로 열기
    this.mainWindow.webContents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url)
      return { action: 'deny' }
    })

    // 새 창에서 열리는 링크도 기본 브라우저로 처리 (deprecated 이벤트 대신 setWindowOpenHandler 사용)

    // 윈도우가 준비되면 보이기
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show()

      // 개발 환경에서는 DevTools 자동 열기
      if (process.env.NODE_ENV === 'development') {
        this.mainWindow?.webContents.openDevTools()
      }
    })

    this.mainWindow.on('closed', () => {
      this.mainWindow = null
    })
  }

  private setupIpcHandlers(): void {
    // 간단한 버튼 클릭 핸들러
    ipcMain.handle('button-clicked', async () => {
      console.log('버튼이 클릭되었습니다!')
      return {
        success: true,
        message: '안녕하세요! FE팀 도구입니다.',
        timestamp: new Date().toISOString(),
      }
    })

    // 앱 정보 가져오기
    ipcMain.handle('get-app-info', async () => {
      return {
        name: app.getName(),
        version: app.getVersion(),
        electronVersion: process.versions.electron,
        nodeVersion: process.versions.node,
      }
    })

    // 외부 링크를 기본 브라우저로 열기
    ipcMain.handle('open-external', async (event, url: string) => {
      try {
        await shell.openExternal(url)
        return { success: true }
      } catch (error) {
        console.error('외부 링크 열기 실패:', error)
        return {
          success: false,
          error: error instanceof Error ? error.message : String(error),
        }
      }
    })

    // ========================================
    // 공통 유틸리티 함수들
    // ========================================

    /**
     * 허용된 FEHG 에픽 ID 목록
     */
    const ALLOWED_FEHG_EPIC_IDS = [
      1519, 1637, 1617, 1618, 1619, 1620, 1621, 1622, 1623, 1624, 1625, 1626,
      1627, 1628, 1629, 1630, 1631, 1632, 1633, 1634, 1635, 1640, 1748,
    ]

    /**
     * 허용된 FEHG 에픽 데이터 (ID 순서와 일치)
     */
    const ALLOWED_FEHG_EPIC_DATA = [
      { id: 1519, summary: '[GW] 디자인 QA(FO/BO) - 수시 업무' },
      { id: 1637, summary: '[GW] 메인터넌스, DevOps - 수시 업무' },
      { id: 1617, summary: '[GW] [오픈 신규 스펙] F&B(11월 오픈 스펙아웃)' },
      {
        id: 1618,
        summary: '[GW] [오픈 신규 스펙] 게시판 확장 변수(11월 오픈 스펙아웃)',
      },
      { id: 1619, summary: '[GW] [오픈 신규 스펙] 홈 UX/디자인 개선' },
      { id: 1620, summary: '[GW] [오픈 신규 스펙] 협력사 외부망 접속 허용' },
      {
        id: 1621,
        summary:
          '[GW] [오픈 신규 스펙] 회사별 접속 차단 권한 개선 : url 리다이렉트',
      },
      { id: 1622, summary: '[GW] [오픈 신규 스펙] 메뉴 4depth까지 제공' },
      {
        id: 1623,
        summary: '[GW] [오픈 신규 스펙] 홈 진입시 팝업 공지 기능 제공',
      },
      { id: 1624, summary: '[GW] [오픈 신규 스펙] 블라인드 정책 개선' },
      { id: 1625, summary: '[GW] [오픈 신규 스펙] 임직원 보직 정렬 순서 변경' },
      { id: 1626, summary: '[GW] [오픈 신규 스펙] 이미지 뷰어 기능 제공' },
      {
        id: 1627,
        summary: '[GW] [오픈 신규 스펙] 게시글 작성 최대 글자수 조정',
      },
      {
        id: 1628,
        summary: '[GW] [오픈 신규 스펙] 태그 기능 개선 : 최대 5개 지정',
      },
      { id: 1629, summary: '[GW] [오픈 신규 스펙] 모바일 뷰어 제공' },
      { id: 1630, summary: '[GW] [오픈 신규 스펙] 에디터 개선' },
      {
        id: 1631,
        summary:
          '[GW] [오픈 신규 스펙] BO : 영문 필드 최대 글자수 점검 및 개선',
      },
      {
        id: 1632,
        summary: '[GW] [오픈 신규 스펙] BO : 뉴스 컴포넌트 PC/Mo 동기화',
      },
      {
        id: 1633,
        summary: '[GW] [오픈 신규 스펙] BO : 배너 하이퍼링크 동작 개선',
      },
      {
        id: 1634,
        summary: '[GW] [오픈 신규 스펙] BO : 권한 설정 내 조직 검색 방식 개선',
      },
      { id: 1635, summary: '[GW] [오픈 신규 스펙] BO : 인원수 호출 UX 개선' },
      {
        id: 1640,
        summary: '[GW] [오픈 신규 스펙] 메일 알림 뱃지 숫자 정책 개선',
      },
      { id: 1748, summary: '[GW] [오픈 신규 스펙] 중복 로그인' },
    ]

    /**
     * 에픽 ID 화이트리스트 검증
     */
    function validateEpicIdWhitelist(epicId: number) {
      if (!ALLOWED_FEHG_EPIC_IDS.includes(epicId)) {
        return {
          success: false,
          error: 'WHITELIST_ERROR',
          message: '허용되지 않은 에픽 ID입니다.',
          allowedEpicIds: ALLOWED_FEHG_EPIC_IDS,
        }
      }
      return { success: true }
    }

    /**
     * FEHG 에픽 정보 조회 (공통)
     */
    async function getFehgEpicWithValidation(epicId: number) {
      const { jiraApiClient } = await import('./services/jiraApi')

      const fehgEpic = await jiraApiClient.getIgniteJiraFEHGEpicInfo(epicId)
      if (!fehgEpic) {
        return {
          success: false,
          message: `FEHG-${epicId} 에픽을 찾을 수 없습니다.`,
        }
      }

      return {
        success: true,
        epic: fehgEpic,
      }
    }

    /**
     * FEHG 에픽 하위 티켓들 조회 (공통)
     */
    async function getFehgEpicTickets(epicId: number) {
      const { jiraApiClient } = await import('./services/jiraApi')
      return await jiraApiClient.getIgniteJiraFEHGEpicTickets(epicId)
    }

    // ========================================
    // IPC 핸들러들
    // ========================================

    // 허용된 FEHG 에픽 데이터 조회
    ipcMain.handle('get-allowed-fehg-epics', async () => {
      return {
        success: true,
        epics: ALLOWED_FEHG_EPIC_DATA,
      }
    })

    // Jira API 테스트
    ipcMain.handle('test-ignite-jira-connection', async () => {
      try {
        const { jiraApiClient } = await import('./services/jiraApi')
        const isConnected = await jiraApiClient.testIgniteJiraConnection()
        return {
          success: isConnected,
          message: isConnected ? 'Jira API 연결 성공!' : 'Jira API 연결 실패',
        }
      } catch (error) {
        console.error('Jira connection test failed:', error)

        // 상세한 오류 정보 포함
        const errorMessage =
          error instanceof Error ? error.message : '알 수 없는 오류'
        const debugInfo =
          error instanceof Error && error.message.includes('디버깅 정보:')
            ? error.message
            : `Jira API 연결 실패: ${errorMessage}`

        return {
          success: false,
          message: debugInfo,
        }
      }
    })

    // 담당자 티켓 조회
    ipcMain.handle(
      'get-assignee-issues',
      async (event, boardKey: string, assigneeId: string) => {
        try {
          const { jiraApiClient } = await import('./services/jiraApi')
          const issues = await jiraApiClient.getInProgressAndPlannedIssues(
            boardKey as any,
            assigneeId
          )

          return {
            success: true,
            issues: issues,
            count: issues.length,
            message: `${issues.length}개의 티켓을 찾았습니다.`,
          }
        } catch (error) {
          console.error('Failed to fetch assignee issues:', error)
          return {
            success: false,
            issues: [],
            count: 0,
            message: `티켓 조회 실패: ${
              error instanceof Error ? error.message : '알 수 없는 오류'
            }`,
          }
        }
      }
    )

    // FEHG → 대상 프로젝트 연결된 이슈들 조회 (범용)
    ipcMain.handle(
      'find-linked-target-issues',
      async (
        event,
        boardKey: string,
        assigneeId: string,
        targetProject: 'KQ' | 'HB' | 'AUTOWAY'
      ) => {
        try {
          const { jiraApiClient } = await import('./services/jiraApi')

          // 1. FEHG 담당자 티켓 조회
          console.log(`1️⃣ FEHG 담당자 티켓 조회 중...`)
          const fehgIssues = await jiraApiClient.getInProgressAndPlannedIssues(
            boardKey as any,
            assigneeId
          )

          if (fehgIssues.length === 0) {
            return {
              success: true,
              fehgIssues: [],
              linkedResults: [],
              totalFehgIssues: 0,
              totalLinkedKqIssues: 0,
              message: 'FEHG 담당 티켓이 없습니다.',
            }
          }

          // 2. 연결된 대상 프로젝트 이슈들 찾기
          console.log(`2️⃣ 연결된 ${targetProject} 이슈들 조회 중...`)
          const linkedResults = await jiraApiClient.findLinkedTargetIssues(
            fehgIssues,
            targetProject
          )

          const totalLinkedTargetIssues = linkedResults.reduce(
            (sum, result) => sum + result.linkedKqIssues.length,
            0
          )

          return {
            success: true,
            fehgIssues: fehgIssues,
            linkedResults: linkedResults,
            totalFehgIssues: fehgIssues.length,
            totalLinkedKqIssues: totalLinkedTargetIssues,
            message: `FEHG ${fehgIssues.length}개 → 연결된 ${targetProject} ${totalLinkedTargetIssues}개 티켓 발견`,
          }
        } catch (error) {
          console.error(`Failed to find linked ${targetProject} issues:`, error)
          return {
            success: false,
            fehgIssues: [],
            linkedResults: [],
            totalFehgIssues: 0,
            totalLinkedKqIssues: 0,
            message: `연결된 이슈 조회 실패: ${
              error instanceof Error ? error.message : '알 수 없는 오류'
            }`,
          }
        }
      }
    )

    // 하위 호환성을 위한 KQ 전용 핸들러
    ipcMain.handle(
      'find-linked-kq-issues',
      async (event, boardKey: string, assigneeId: string) => {
        try {
          const { jiraApiClient } = await import('./services/jiraApi')

          console.log('1️⃣ FEHG 담당자 티켓 조회 중... (호환 모드)')
          const fehgIssues = await jiraApiClient.getInProgressAndPlannedIssues(
            boardKey as any,
            assigneeId
          )

          if (fehgIssues.length === 0) {
            return {
              success: true,
              fehgIssues: [],
              linkedResults: [],
              totalFehgIssues: 0,
              totalLinkedKqIssues: 0,
              message: 'FEHG 담당 티켓이 없습니다.',
            }
          }

          console.log('2️⃣ 연결된 KQ 이슈들 조회 중... (호환 모드)')
          const linkedResults = await jiraApiClient.findLinkedTargetIssues(
            fehgIssues,
            'KQ'
          )

          const totalLinkedKqIssues = linkedResults.reduce(
            (sum, result) => sum + result.linkedKqIssues.length,
            0
          )

          return {
            success: true,
            fehgIssues: fehgIssues,
            linkedResults: linkedResults,
            totalFehgIssues: fehgIssues.length,
            totalLinkedKqIssues: totalLinkedKqIssues,
            message: `FEHG ${fehgIssues.length}개 → 연결된 KQ ${totalLinkedKqIssues}개 티켓 발견`,
          }
        } catch (error) {
          console.error('Failed to find linked KQ issues:', error)
          return {
            success: false,
            fehgIssues: [],
            linkedResults: [],
            totalFehgIssues: 0,
            totalLinkedKqIssues: 0,
            message: `연결된 이슈 조회 실패: ${
              error instanceof Error ? error.message : '알 수 없는 오류'
            }`,
          }
        }
      }
    )

    // FEHG → 대상 프로젝트 동기화 실행 (범용)
    ipcMain.handle(
      'sync-fehg-to-target',
      async (
        event,
        boardKey: string,
        assigneeId: string,
        targetProject: 'KQ' | 'HB' | 'AUTOWAY'
      ) => {
        try {
          const { jiraApiClient } = await import('./services/jiraApi')

          console.log(`🚀 FEHG → ${targetProject} 동기화 시작 (IPC)`)
          const syncResult = await jiraApiClient.syncFehgToTarget(
            boardKey as any,
            assigneeId,
            targetProject
          )

          return {
            success: syncResult.success,
            message: syncResult.message,
            results: syncResult.results,
            totalProcessed: syncResult.totalProcessed,
            totalSuccess: syncResult.totalSuccess,
            totalFailed: syncResult.totalFailed,
          }
        } catch (error) {
          console.error(`Failed to sync FEHG to ${targetProject}:`, error)

          // 상세한 오류 정보 포함
          const errorMessage =
            error instanceof Error ? error.message : '알 수 없는 오류'
          const debugInfo =
            error instanceof Error && error.message.includes('디버깅 정보:')
              ? error.message
              : `기본 오류: ${errorMessage}`

          return {
            success: false,
            message: `동기화 실패: ${debugInfo}`,
            results: [],
            totalProcessed: 0,
            totalSuccess: 0,
            totalFailed: 0,
          }
        }
      }
    )

    // 하위 호환성을 위한 KQ 전용 핸들러 (기존 코드와 호환)
    ipcMain.handle(
      'sync-fehg-to-kq',
      async (event, boardKey: string, assigneeId: string) => {
        try {
          const { jiraApiClient } = await import('./services/jiraApi')

          console.log('🚀 FEHG → KQ 동기화 시작 (IPC - 호환모드)')
          const syncResult = await jiraApiClient.syncFehgToTarget(
            boardKey as any,
            assigneeId,
            'KQ'
          )

          return {
            success: syncResult.success,
            message: syncResult.message,
            results: syncResult.results,
            totalProcessed: syncResult.totalProcessed,
            totalSuccess: syncResult.totalSuccess,
            totalFailed: syncResult.totalFailed,
          }
        } catch (error) {
          console.error('Failed to sync FEHG to KQ:', error)
          return {
            success: false,
            message: `동기화 실패: ${
              error instanceof Error ? error.message : '알 수 없는 오류'
            }`,
            results: [],
            totalProcessed: 0,
            totalSuccess: 0,
            totalFailed: 0,
          }
        }
      }
    )

    // IgniteJira FEHG → HmgJira AUTOWAY 에픽 생성 핸들러
    ipcMain.handle(
      'create-hmgjira-epic-from-fehg',
      async (event, epicId: number) => {
        try {
          const { jiraApiClient } = await import('./services/jiraApi')

          console.log(`🧪 FEHG-${epicId} 에픽 테스트를 시작합니다...`)

          // 1. FEHG 에픽 정보 조회
          console.log(`🔍 FEHG-${epicId} 에픽 정보 조회 중...`)
          const fehgEpic = await jiraApiClient.getIgniteJiraFEHGEpicInfo(epicId)

          if (!fehgEpic) {
            return {
              success: false,
              message: `❌ FEHG-${epicId} 에픽을 찾을 수 없습니다.`,
              fehgEpic: null,
              autowayEpic: null,
              linkSuccess: false,
            }
          }

          // 2. 이미 연결된 AUTOWAY 에픽이 있는지 확인
          if (
            fehgEpic.fields.customfield_10306 &&
            fehgEpic.fields.customfield_10306.includes('AUTOWAY-')
          ) {
            const existingAutowayUrl = fehgEpic.fields.customfield_10306
            const autowayKeyMatch = existingAutowayUrl.match(/AUTOWAY-\d+/)
            const autowayKey = autowayKeyMatch ? autowayKeyMatch[0] : 'Unknown'

            return {
              success: true,
              alreadyExists: true,
              message: `ℹ️ 이미 연결된 AUTOWAY 에픽이 있습니다.`,
              fehgEpic: fehgEpic,
              existingAutowayKey: autowayKey,
              existingAutowayUrl: existingAutowayUrl,
              linkSuccess: true,
            }
          }

          // FEHG 에픽 정보 상세 출력
          const fehgInfo = [
            `**제목**: ${fehgEpic.fields.summary}`,
            `**상태**: ${fehgEpic.fields.status.name}`,
            `**시작일**: ${fehgEpic.fields.customfield_10015 || 'N/A'}`,
            `**마감일**: ${fehgEpic.fields.duedate || 'N/A'}`,
          ].join('\n')

          // 3. AUTOWAY에 동일한 에픽 생성
          console.log('🚀 AUTOWAY 에픽 생성 중...')
          const autowayEpic = await jiraApiClient.createHmgJiraEpic(fehgEpic)

          if (!autowayEpic) {
            return {
              success: false,
              message: '❌ AUTOWAY 에픽 생성에 실패했습니다.',
              fehgEpic: fehgEpic,
              autowayEpic: null,
              linkSuccess: false,
            }
          }

          // 4. FEHG 에픽에 AUTOWAY 링크 추가
          console.log('🔗 FEHG 에픽에 AUTOWAY 링크 추가 중...')
          const autowayEpicUrl = `https://jira.hmg-corp.io/browse/${autowayEpic.key}`
          const linkSuccess =
            await jiraApiClient.updateIgniteJiraFEHGTicketWithHmgJiraLink(
              fehgEpic.key,
              autowayEpicUrl
            )

          if (linkSuccess) {
            return {
              success: true,
              message: `🎉 테스트 완료!\n\n**FEHG 에픽**: [${fehgEpic.key}](https://ignitecorp.atlassian.net/browse/${fehgEpic.key})\n**AUTOWAY 에픽**: [${autowayEpic.key}](${autowayEpicUrl})\n\n✅ **연결 완료**: ${fehgEpic.key}의 customfield_10306에 AUTOWAY URL 저장됨`,
              fehgEpic: fehgEpic,
              autowayEpic: autowayEpic,
              linkSuccess: true,
              fehgInfo: fehgInfo,
              autowayUrl: autowayEpicUrl,
            }
          } else {
            return {
              success: false,
              message: `⚠️ AUTOWAY 에픽은 생성되었지만 FEHG 티켓의 customfield_10306 업데이트에 실패했습니다.\n**AUTOWAY 에픽**: [${autowayEpic.key}](${autowayEpicUrl})\n\n❌ 수동으로 FEHG-${fehgEpic.key}에 링크를 추가해주세요.`,
              fehgEpic: fehgEpic,
              autowayEpic: autowayEpic,
              linkSuccess: false,
              fehgInfo: fehgInfo,
              autowayUrl: autowayEpicUrl,
            }
          }
        } catch (error) {
          console.error('테스트 에픽 생성 오류:', error)
          return {
            success: false,
            message: '❌ 테스트 중 오류가 발생했습니다. 로그를 확인해주세요.',
            fehgEpic: null,
            autowayEpic: null,
            linkSuccess: false,
            error: error instanceof Error ? error.message : String(error),
          }
        }
      }
    )

    // FEHG 에픽 하위 티켓들 조회
    ipcMain.handle(
      'get-fehg-epic-tickets',
      async (event, epicId: number): Promise<any> => {
        try {
          console.log(`🔍 FEHG 에픽 하위 티켓들 조회 시작: FEHG-${epicId}`)

          // 1. 화이트리스트 검증
          const whitelistResult = validateEpicIdWhitelist(epicId)
          if (!whitelistResult.success) {
            return whitelistResult
          }

          // 2. FEHG 에픽 정보 조회
          const epicResult = await getFehgEpicWithValidation(epicId)
          if (!epicResult.success) {
            return epicResult
          }

          // 3. FEHG 에픽 하위 티켓들 조회
          const tickets = await getFehgEpicTickets(epicId)

          return {
            success: true,
            epic: epicResult.epic,
            tickets: tickets,
            message: `FEHG-${epicId} 에픽 하위 티켓들 조회 완료`,
          }
        } catch (error) {
          console.error('FEHG 에픽 하위 티켓들 조회 오류:', error)
          return {
            success: false,
            message: error instanceof Error ? error.message : String(error),
          }
        }
      }
    )

    // FEHG 에픽 하위 티켓과 연결된 티켓 생성
    ipcMain.handle(
      'create-hmgjira-tickets-from-fehg',
      async (event, epicId: number): Promise<any> => {
        try {
          console.log(
            `🔗 FEHG 에픽 하위 티켓과 연결된 티켓 생성 시작: FEHG-${epicId}`
          )

          // 1. 화이트리스트 검증
          const whitelistResult = validateEpicIdWhitelist(epicId)
          if (!whitelistResult.success) {
            return {
              success: false,
              message: `❌ 허용되지 않은 에픽 ID입니다.`,
              errorType: 'WHITELIST_ERROR',
              epicId: epicId,
              allowedEpicIds: whitelistResult.allowedEpicIds,
            }
          }

          // 2. FEHG 에픽 정보 조회
          const epicResult = await getFehgEpicWithValidation(epicId)
          if (!epicResult.success) {
            return epicResult
          }
          const fehgEpic = epicResult.epic!

          // 2. FEHG 에픽의 customfield_10306에서 AUTOWAY 에픽 URL 추출
          const autowayUrl = fehgEpic.fields.customfield_10306
          if (!autowayUrl || !autowayUrl.includes('AUTOWAY-')) {
            return {
              success: false,
              message: `FEHG-${epicId} 에픽이 AUTOWAY 에픽과 연결되어 있지 않습니다.`,
            }
          }

          // AUTOWAY 에픽 키 추출 (예: @https://jira.hmg-corp.io/browse/AUTOWAY-1963 -> AUTOWAY-1963)
          const autowayEpicKeyMatch = autowayUrl.match(/AUTOWAY-\d+/)
          if (!autowayEpicKeyMatch) {
            return {
              success: false,
              message: `AUTOWAY 에픽 키를 추출할 수 없습니다: ${autowayUrl}`,
            }
          }
          const autowayEpicKey = autowayEpicKeyMatch[0]

          // 3. FEHG 에픽 하위 티켓들 조회
          const fehgTickets = await getFehgEpicTickets(epicId)
          if (!fehgTickets || fehgTickets.length === 0) {
            return {
              success: true,
              fehgEpic: fehgEpic,
              autowayEpicKey: autowayEpicKey,
              autowayEpicUrl: autowayUrl,
              createdTicket: null,
              message: `FEHG-${epicId} 에픽에 하위 티켓이 없습니다.`,
            }
          }

          // 4. 모든 하위 티켓들을 순회하면서 처리
          const results = {
            updated: [] as Array<{ ticket: any; autowayUrl: string }>,
            newlyCreated: [] as Array<{ ticket: any; autowayUrl: string }>,
            failed: [] as Array<{ ticket: any; error: string }>,
          }

          for (const ticket of fehgTickets) {
            console.log(`🔍 티켓 처리 중: ${ticket.key}`)

            // customfield_10306가 이미 있는지 확인
            if (
              ticket.fields.customfield_10306 &&
              ticket.fields.customfield_10306.includes('AUTOWAY-')
            ) {
              // 이미 생성된 티켓 - 업데이트 수행
              console.log(`🔄 기존 티켓 업데이트: ${ticket.key}`)

              try {
                // AUTOWAY 티켓 키 추출
                const autowayTicketKeyMatch =
                  ticket.fields.customfield_10306.match(/AUTOWAY-\d+/)
                if (!autowayTicketKeyMatch) {
                  results.failed.push({
                    ticket: ticket,
                    error: `AUTOWAY 티켓 키를 추출할 수 없습니다: ${ticket.fields.customfield_10306}`,
                  })
                  continue
                }
                const autowayTicketKey = autowayTicketKeyMatch[0]

                const { jiraApiClient } = await import('./services/jiraApi')
                const updateSuccess =
                  await jiraApiClient.updateHmgJiraTicketFromFehg(
                    ticket,
                    autowayTicketKey
                  )

                if (updateSuccess) {
                  results.updated.push({
                    ticket: ticket,
                    autowayUrl: ticket.fields.customfield_10306,
                  })
                  console.log(`✅ 티켓 업데이트 완료: ${autowayTicketKey}`)
                } else {
                  results.failed.push({
                    ticket: ticket,
                    error: 'AUTOWAY 티켓 업데이트 실패',
                  })
                  console.log(`❌ 티켓 업데이트 실패: ${ticket.key}`)
                }
              } catch (error) {
                results.failed.push({
                  ticket: ticket,
                  error: error instanceof Error ? error.message : String(error),
                })
                console.log(`❌ 티켓 업데이트 오류: ${ticket.key} - ${error}`)
              }
            } else {
              // 새로 생성해야 하는 티켓
              console.log(`🆕 새로 생성할 티켓: ${ticket.key}`)

              try {
                const { jiraApiClient } = await import('./services/jiraApi')
                const createdTicket =
                  await jiraApiClient.createHmgJiraTicketFromFehg(
                    ticket,
                    autowayEpicKey
                  )

                if (createdTicket) {
                  const createdTicketUrl = `https://jira.hmg-corp.io/browse/${createdTicket.key}`
                  results.newlyCreated.push({
                    ticket: ticket,
                    autowayUrl: createdTicketUrl,
                  })
                  console.log(`✅ 새 티켓 생성 완료: ${createdTicket.key}`)
                } else {
                  results.failed.push({
                    ticket: ticket,
                    error: 'AUTOWAY 티켓 생성 실패',
                  })
                  console.log(`❌ 티켓 생성 실패: ${ticket.key}`)
                }
              } catch (error) {
                results.failed.push({
                  ticket: ticket,
                  error: error instanceof Error ? error.message : String(error),
                })
                console.log(`❌ 티켓 생성 오류: ${ticket.key} - ${error}`)
              }
            }
          }

          return {
            success: true,
            fehgEpic: fehgEpic,
            autowayEpicKey: autowayEpicKey,
            autowayEpicUrl: autowayUrl,
            results: results,
            message: `처리 완료: 업데이트됨 ${results.updated.length}개, 새로 생성 ${results.newlyCreated.length}개, 실패 ${results.failed.length}개`,
          }
        } catch (error) {
          console.error('FEHG 에픽 하위 티켓과 연결된 티켓 생성 오류:', error)
          return {
            success: false,
            message: error instanceof Error ? error.message : String(error),
          }
        }
      }
    )
  }
}

// 앱 인스턴스 생성
new ElectronApp()
