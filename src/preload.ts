import { contextBridge, ipcRenderer } from 'electron'

// 렌더러 프로세스에서 사용할 수 있는 API 정의
const electronAPI = {
  // 버튼 클릭 이벤트
  onButtonClick: () => ipcRenderer.invoke('button-clicked'),

  // 앱 정보 가져오기
  getAppInfo: () => ipcRenderer.invoke('get-app-info'),

  // 허용된 FEHG 에픽 데이터 조회
  getAllowedFehgEpics: () => ipcRenderer.invoke('get-allowed-fehg-epics'),

  // Jira API 연결 테스트
  testIgniteJiraConnection: () =>
    ipcRenderer.invoke('test-ignite-jira-connection'),

  // 담당자 티켓 조회
  getAssigneeIssues: (boardKey: string, assigneeId: string) =>
    ipcRenderer.invoke('get-assignee-issues', boardKey, assigneeId),

  // FEHG → KQ 연결된 이슈들 조회 (하위 호환)
  findLinkedKqIssues: (boardKey: string, assigneeId: string) =>
    ipcRenderer.invoke('find-linked-kq-issues', boardKey, assigneeId),

  // FEHG → 대상 프로젝트 연결된 이슈들 조회 (범용)
  findLinkedTargetIssues: (
    boardKey: string,
    assigneeId: string,
    targetProject: 'KQ' | 'HB' | 'AUTOWAY'
  ) =>
    ipcRenderer.invoke(
      'find-linked-target-issues',
      boardKey,
      assigneeId,
      targetProject
    ),

  // FEHG → KQ 동기화 실행 (하위 호환)
  syncFehgToKq: (boardKey: string, assigneeId: string) =>
    ipcRenderer.invoke('sync-fehg-to-kq', boardKey, assigneeId),

  // FEHG → 대상 프로젝트 동기화 실행 (범용)
  syncFehgToTarget: (
    boardKey: string,
    assigneeId: string,
    targetProject: 'KQ' | 'HB' | 'AUTOWAY'
  ) =>
    ipcRenderer.invoke(
      'sync-fehg-to-target',
      boardKey,
      assigneeId,
      targetProject
    ),

  // IgniteJira FEHG → HmgJira AUTOWAY 에픽 생성
  createHmgJiraEpicFromFehg: (epicId: number) =>
    ipcRenderer.invoke('create-hmgjira-epic-from-fehg', epicId),

  // FEHG 에픽 하위 티켓들 조회
  getFehgEpicTickets: (epicId: number) =>
    ipcRenderer.invoke('get-fehg-epic-tickets', epicId),

  // FEHG 에픽 하위 티켓과 연결된 티켓 생성
  createHmgJiraTicketsFromFehg: (epicId: number) =>
    ipcRenderer.invoke('create-hmgjira-tickets-from-fehg', epicId),

  // 외부 링크를 기본 브라우저로 열기
  openExternal: (url: string) => ipcRenderer.invoke('open-external', url),
}

// contextBridge를 통해 안전하게 API 노출
contextBridge.exposeInMainWorld('electronAPI', electronAPI)

// TypeScript를 위한 타입 정의
declare global {
  interface Window {
    electronAPI: typeof electronAPI
  }
}
