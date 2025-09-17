import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as dotenv from 'dotenv';

// 환경변수 로드
dotenv.config();

// Hot reload를 위한 설정 (개발 환경에서만)
if (process.env.NODE_ENV === 'development') {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '..', 'node_modules', '.bin', 'electron'),
    hardResetMethod: 'exit'
  });
}

class ElectronApp {
  private mainWindow: BrowserWindow | null = null;

  constructor() {
    this.initializeApp();
  }

  private initializeApp(): void {
    // 앱이 준비되면 윈도우 생성
    app.whenReady().then(() => {
      this.createMainWindow();

      // macOS에서 dock 아이콘 클릭 시 윈도우 재생성
      app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          this.createMainWindow();
        }
      });
    });

    // 모든 윈도우가 닫히면 앱 종료 (macOS 제외)
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    // IPC 핸들러 설정
    this.setupIpcHandlers();
  }

  private createMainWindow(): void {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js')
      },
      titleBarStyle: 'default',
      show: false // 준비되면 보이도록 설정
    });

    // HTML 파일 로드
    this.mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

    // 윈도우가 준비되면 보이기
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show();
      
      // 개발 환경에서는 DevTools 자동 열기
      if (process.env.NODE_ENV === 'development') {
        this.mainWindow?.webContents.openDevTools();
      }
    });

    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });
  }

  private setupIpcHandlers(): void {
    // 간단한 버튼 클릭 핸들러
    ipcMain.handle('button-clicked', async () => {
      console.log('버튼이 클릭되었습니다!');
      return {
        success: true,
        message: '안녕하세요! FE팀 도구입니다.',
        timestamp: new Date().toISOString()
      };
    });

    // 앱 정보 가져오기
    ipcMain.handle('get-app-info', async () => {
      return {
        name: app.getName(),
        version: app.getVersion(),
        electronVersion: process.versions.electron,
        nodeVersion: process.versions.node
      };
    });

    // Jira API 테스트
    ipcMain.handle('test-jira-connection', async () => {
      try {
        const { jiraApiClient } = await import('./services/jiraApi');
        const isConnected = await jiraApiClient.testConnection();
        return {
          success: isConnected,
          message: isConnected ? 'Jira API 연결 성공!' : 'Jira API 연결 실패'
        };
      } catch (error) {
        console.error('Jira connection test failed:', error);
        return {
          success: false,
          message: `Jira API 연결 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
        };
      }
    });

    // 담당자 티켓 조회
    ipcMain.handle('get-assignee-issues', async (event, boardKey: string, assigneeId: string) => {
      try {
        const { jiraApiClient } = await import('./services/jiraApi');
        const issues = await jiraApiClient.getInProgressAndPlannedIssues(boardKey as any, assigneeId);
        
        return {
          success: true,
          issues: issues,
          count: issues.length,
          message: `${issues.length}개의 티켓을 찾았습니다.`
        };
      } catch (error) {
        console.error('Failed to fetch assignee issues:', error);
        return {
          success: false,
          issues: [],
          count: 0,
          message: `티켓 조회 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
        };
      }
    });

    // FEHG → 대상 프로젝트 연결된 이슈들 조회 (범용)
    ipcMain.handle('find-linked-target-issues', async (event, boardKey: string, assigneeId: string, targetProject: 'KQ' | 'HB' | 'AUTOWAY') => {
      try {
        const { jiraApiClient } = await import('./services/jiraApi');
        
        // 1. FEHG 담당자 티켓 조회
        console.log(`1️⃣ FEHG 담당자 티켓 조회 중...`);
        const fehgIssues = await jiraApiClient.getInProgressAndPlannedIssues(boardKey as any, assigneeId);
        
        if (fehgIssues.length === 0) {
          return {
            success: true,
            fehgIssues: [],
            linkedResults: [],
            totalFehgIssues: 0,
            totalLinkedKqIssues: 0,
            message: 'FEHG 담당 티켓이 없습니다.'
          };
        }

        // 2. 연결된 대상 프로젝트 이슈들 찾기
        console.log(`2️⃣ 연결된 ${targetProject} 이슈들 조회 중...`);
        const linkedResults = await jiraApiClient.findLinkedTargetIssues(fehgIssues, targetProject);
        
        const totalLinkedTargetIssues = linkedResults.reduce((sum, result) => sum + result.linkedKqIssues.length, 0);
        
        return {
          success: true,
          fehgIssues: fehgIssues,
          linkedResults: linkedResults,
          totalFehgIssues: fehgIssues.length,
          totalLinkedKqIssues: totalLinkedTargetIssues,
          message: `FEHG ${fehgIssues.length}개 → 연결된 ${targetProject} ${totalLinkedTargetIssues}개 티켓 발견`
        };
      } catch (error) {
        console.error(`Failed to find linked ${targetProject} issues:`, error);
        return {
          success: false,
          fehgIssues: [],
          linkedResults: [],
          totalFehgIssues: 0,
          totalLinkedKqIssues: 0,
          message: `연결된 이슈 조회 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
        };
      }
    });

    // 하위 호환성을 위한 KQ 전용 핸들러
    ipcMain.handle('find-linked-kq-issues', async (event, boardKey: string, assigneeId: string) => {
      try {
        const { jiraApiClient } = await import('./services/jiraApi');
        
        console.log('1️⃣ FEHG 담당자 티켓 조회 중... (호환 모드)');
        const fehgIssues = await jiraApiClient.getInProgressAndPlannedIssues(boardKey as any, assigneeId);
        
        if (fehgIssues.length === 0) {
          return {
            success: true,
            fehgIssues: [],
            linkedResults: [],
            totalFehgIssues: 0,
            totalLinkedKqIssues: 0,
            message: 'FEHG 담당 티켓이 없습니다.'
          };
        }

        console.log('2️⃣ 연결된 KQ 이슈들 조회 중... (호환 모드)');
        const linkedResults = await jiraApiClient.findLinkedTargetIssues(fehgIssues, 'KQ');
        
        const totalLinkedKqIssues = linkedResults.reduce((sum, result) => sum + result.linkedKqIssues.length, 0);
        
        return {
          success: true,
          fehgIssues: fehgIssues,
          linkedResults: linkedResults,
          totalFehgIssues: fehgIssues.length,
          totalLinkedKqIssues: totalLinkedKqIssues,
          message: `FEHG ${fehgIssues.length}개 → 연결된 KQ ${totalLinkedKqIssues}개 티켓 발견`
        };
      } catch (error) {
        console.error('Failed to find linked KQ issues:', error);
        return {
          success: false,
          fehgIssues: [],
          linkedResults: [],
          totalFehgIssues: 0,
          totalLinkedKqIssues: 0,
          message: `연결된 이슈 조회 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
        };
      }
    });

    // FEHG → 대상 프로젝트 동기화 실행 (범용)
    ipcMain.handle('sync-fehg-to-target', async (event, boardKey: string, assigneeId: string, targetProject: 'KQ' | 'HB' | 'AUTOWAY') => {
      try {
        const { jiraApiClient } = await import('./services/jiraApi');
        
        console.log(`🚀 FEHG → ${targetProject} 동기화 시작 (IPC)`);
        const syncResult = await jiraApiClient.syncFehgToTarget(boardKey as any, assigneeId, targetProject);
        
        return {
          success: syncResult.success,
          message: syncResult.message,
          results: syncResult.results,
          totalProcessed: syncResult.totalProcessed,
          totalSuccess: syncResult.totalSuccess,
          totalFailed: syncResult.totalFailed,
        };
      } catch (error) {
        console.error(`Failed to sync FEHG to ${targetProject}:`, error);
        return {
          success: false,
          message: `동기화 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
          results: [],
          totalProcessed: 0,
          totalSuccess: 0,
          totalFailed: 0,
        };
      }
    });

    // 하위 호환성을 위한 KQ 전용 핸들러 (기존 코드와 호환)
    ipcMain.handle('sync-fehg-to-kq', async (event, boardKey: string, assigneeId: string) => {
      try {
        const { jiraApiClient } = await import('./services/jiraApi');
        
        console.log('🚀 FEHG → KQ 동기화 시작 (IPC - 호환모드)');
        const syncResult = await jiraApiClient.syncFehgToTarget(boardKey as any, assigneeId, 'KQ');
        
        return {
          success: syncResult.success,
          message: syncResult.message,
          results: syncResult.results,
          totalProcessed: syncResult.totalProcessed,
          totalSuccess: syncResult.totalSuccess,
          totalFailed: syncResult.totalFailed,
        };
      } catch (error) {
        console.error('Failed to sync FEHG to KQ:', error);
        return {
          success: false,
          message: `동기화 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
          results: [],
          totalProcessed: 0,
          totalSuccess: 0,
          totalFailed: 0,
        };
      }
    });
  }
}

// 앱 인스턴스 생성
new ElectronApp();
