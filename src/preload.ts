import { contextBridge, ipcRenderer } from 'electron';

// 렌더러 프로세스에서 사용할 수 있는 API 정의
const electronAPI = {
  // 버튼 클릭 이벤트
  onButtonClick: () => ipcRenderer.invoke('button-clicked'),
  
  // 앱 정보 가져오기
  getAppInfo: () => ipcRenderer.invoke('get-app-info'),
  
  // Jira API 연결 테스트
  testJiraConnection: () => ipcRenderer.invoke('test-jira-connection'),
  
  // 담당자 티켓 조회
  getAssigneeIssues: (boardKey: string, assigneeId: string) => 
    ipcRenderer.invoke('get-assignee-issues', boardKey, assigneeId),
  
  // FEHG → KQ 연결된 이슈들 조회 (하위 호환)
  findLinkedKqIssues: (boardKey: string, assigneeId: string) => 
    ipcRenderer.invoke('find-linked-kq-issues', boardKey, assigneeId),
  
  // FEHG → 대상 프로젝트 연결된 이슈들 조회 (범용)
  findLinkedTargetIssues: (boardKey: string, assigneeId: string, targetProject: 'KQ' | 'HB' | 'AUTOWAY') => 
    ipcRenderer.invoke('find-linked-target-issues', boardKey, assigneeId, targetProject),
  
  // FEHG → KQ 동기화 실행 (하위 호환)
  syncFehgToKq: (boardKey: string, assigneeId: string) => 
    ipcRenderer.invoke('sync-fehg-to-kq', boardKey, assigneeId),
  
  // FEHG → 대상 프로젝트 동기화 실행 (범용)
  syncFehgToTarget: (boardKey: string, assigneeId: string, targetProject: 'KQ' | 'HB' | 'AUTOWAY') => 
    ipcRenderer.invoke('sync-fehg-to-target', boardKey, assigneeId, targetProject),
};

// contextBridge를 통해 안전하게 API 노출
contextBridge.exposeInMainWorld('electronAPI', electronAPI);

// TypeScript를 위한 타입 정의
declare global {
  interface Window {
    electronAPI: typeof electronAPI;
  }
}
