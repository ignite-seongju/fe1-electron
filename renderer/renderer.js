// Jira 사용자 매핑
const JIRA_USER_MAP = {
    한준호: '712020:f4f9e56c-4b40-41ac-af83-5d2f774a72d5', // 한준호
    손현지: '639a6767f134138b5a5132f6', // 손현지
    김가빈: '637426199e48f2b9a6108c25', // 김가빈
    박성찬: '638d49155fce844d606c7682', // 박성찬
    서성주: '639fa03f2c70aae1e6f79806', // 서성주
    김찬영: '712020:11fff4cb-cb95-457e-95a2-6cf9045c53b2', // 김찬영
    조한빈: '712020:403a306e-0eff-4d57-9fda-2f517158d40f', // 조한빈
    이미진: '712020:96cf8ab5-20ff-4d6b-960d-5d38b7a46a39', // 이미진
};

// 앱 상태 관리
const appState = {
    selectedTemplate: null,
    selectedUser: null,
    selectedUserId: null,
    templateData: {
        'cpo-bo': {
            name: 'CPO BO',
            // 슬랙 복사용 원본 텍스트
            rawContent: '<  *Gitlab*  >\n1. 배포 승인 대기\n2. release -> main 머지 <https://gitlab.hmc.co.kr/kia-cpo/kia-cpo-bo-web/-/merge_requests|BO> / <https://gitlab.hmc.co.kr/kia-cpo/kia-pricing-bo-web/-/merge_requests|프라이싱> / <https://gitlab.hmc.co.kr/kia-cpo/kia-cpo-partner-web/-/merge_requests|평가사>\n\t- 담당 PR건들 release 브랜치로 머지 - <!subteam^S05SK5F8Z5J> 완료시 따봉\n\t- 릴리즈 발행 (`{release-yyyyMMdd}`) - <@U04D5SP327J>\n\t- 릴리즈 노트: `{맨 아래 링크 참고하여 릴리즈 노트 링크 복붙}`\n3. main 로컬구동 모니터링 - <!subteam^S05SK5F8Z5J>\n4. 배포 전 할 일 확인 - <!subteam^S05SK5F8Z5J>\n5. 운영 배포 trigger - <@U04D5SP327J>\n6. main -> stage, stage2 현행화/배포\n\ta. BO `{담당자 태그}`\n\tb. 프라이싱 `{담당자 태그}`\n\tc. 평가사 `{담당자 태그}`\n7. 배포 후 모니터링 - <!subteam^S05SK5F8Z5J>\n8. 배포 후 할 일 확인 - <!subteam^S05SK5F8Z5J>\n9. 운영 모니터링 - `{모니터링 순서 작성}`\n10. 배포 완료',
            // 화면 표시용 포맷된 텍스트
            displayContent: `🔧 **Gitlab 배포 프로세스**

1️⃣ **배포 승인 대기**

2️⃣ **release → main 머지**
   • BO: gitlab.hmc.co.kr/kia-cpo/kia-cpo-bo-web/-/merge_requests
   • 프라이싱: gitlab.hmc.co.kr/kia-cpo/kia-pricing-bo-web/-/merge_requests
   • 평가사: gitlab.hmc.co.kr/kia-cpo/kia-cpo-partner-web/-/merge_requests
   
   ↳ 담당 PR건들 release 브랜치로 머지 - @frontend-team 완료시 따봉
   ↳ 릴리즈 발행 (\`release-yyyyMMdd\`) - @배포담당자
   ↳ 릴리즈 노트: \`{맨 아래 링크 참고하여 릴리즈 노트 링크 복붙}\`

3️⃣ **main 로컬구동 모니터링** - @frontend-team

4️⃣ **배포 전 할 일 확인** - @frontend-team

5️⃣ **운영 배포 trigger** - @배포담당자

6️⃣ **main → stage, stage2 현행화/배포**
   a. BO \`{담당자 태그}\`
   b. 프라이싱 \`{담당자 태그}\`
   c. 평가사 \`{담당자 태그}\`

7️⃣ **배포 후 모니터링** - @frontend-team

8️⃣ **배포 후 할 일 확인** - @frontend-team

9️⃣ **운영 모니터링** - \`{모니터링 순서 작성}\`

🔟 **배포 완료** ✅`
        },
        'softeer': {
            name: '소프티어',
            // 슬랙 복사용 원본 텍스트
            rawContent: '< *소프티어 배포* >\n1. 팀즈 배포 승인 대기\n2. release/hotfix -> main 머지 <https://gitlab.hmc.co.kr/ignite-hmg-developers/hmg-developers/-/merge_requests|Gitlab MR>\n3. main 로컬구동 모니터링 - <!subteam^S067AHD9MFZ>\n4. 배포 전 할 일 확인 - <https://ignitecorp.atlassian.net/wiki/spaces/HDS/pages/839024722/Dev|Dev) 배포관리> <!subteam^S067AHD9MFZ>\n5. main 검증계 배포 (staging 태그 발행)\n6. 검증계 배포 완료 대기\n\t- <https://gitlab.hmc.co.kr/ignite-hmg-developers/hmg-developers/-/pipelines|gitlab pipeline> 확인\n\t- <https://argo.hmc.co.kr/|argo> 업데이트 확인\n7. main 운영계 배포 (release 태그 발행)\n8. 배포 후 모니터링 - <!subteam^S067AHD9MFZ>\n9. 배포 후 할 일 확인 - <https://ignitecorp.atlassian.net/wiki/spaces/HDS/pages/839024722/Dev|Dev) 배포관리> <!subteam^S067AHD9MFZ>\n10. 팀즈 배포 완료 공유',
            // 화면 표시용 포맷된 텍스트
            displayContent: `🚗 **소프티어 배포**

1️⃣ **팀즈 배포 승인 대기**

2️⃣ **release/hotfix → main 머지**
   • Gitlab MR: gitlab.hmc.co.kr/ignite-hmg-developers/hmg-developers/-/merge_requests

3️⃣ **main 로컬구동 모니터링** - @dev-team

4️⃣ **배포 전 할 일 확인**
   • Dev 배포관리: ignitecorp.atlassian.net/wiki/spaces/HDS/pages/839024722/Dev
   • 담당: @dev-team

5️⃣ **main 검증계 배포** (staging 태그 발행)

6️⃣ **검증계 배포 완료 대기**
   ↳ gitlab pipeline 확인: gitlab.hmc.co.kr/ignite-hmg-developers/hmg-developers/-/pipelines
   ↳ argo 업데이트 확인: argo.hmc.co.kr

7️⃣ **main 운영계 배포** (release 태그 발행)

8️⃣ **배포 후 모니터링** - @dev-team

9️⃣ **배포 후 할 일 확인**
   • Dev 배포관리: ignitecorp.atlassian.net/wiki/spaces/HDS/pages/839024722/Dev
   • 담당: @dev-team

🔟 **팀즈 배포 완료 공유** ✅`
        }
    }
};

// DOM이 로드되면 실행
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Renderer process started');
    
    // 버튼 이벤트 리스너 설정
    setupButtonEvents();
    
    // 사용자 선택 dropdown 이벤트 설정
    setupUserSelection();
    
    // 복사 기능 초기화
    setupCopyFunction();
});

// 템플릿 표시 함수
function showTemplate(templateKey) {
    const template = appState.templateData[templateKey];
    if (!template) {
        console.error(`템플릿을 찾을 수 없습니다: ${templateKey}`);
        return;
    }

    // 선택된 템플릿 저장
    appState.selectedTemplate = templateKey;

    // 빈 상태 숨기기
    const emptyState = document.querySelector('.empty-state');
    emptyState.classList.add('hidden');

    // 결과 내용 표시 (화면용 포맷 사용)
    const resultContent = document.getElementById('result-content');
    const resultActions = document.getElementById('result-actions');
    
    // displayContent가 있으면 사용, 없으면 기본 content 사용
    const displayText = template.displayContent || template.content;
    resultContent.textContent = displayText;
    resultContent.classList.remove('hidden');
    resultActions.classList.remove('hidden');

    console.log(`템플릿 표시: ${template.name}`);
    showNotification(`✅ ${template.name} 템플릿이 로드되었습니다!`, 'success');
}

// 사용자 선택 설정 함수
function setupUserSelection() {
    const userSelect = document.getElementById('user-select');
    if (userSelect) {
        userSelect.addEventListener('change', (event) => {
            const selectedUser = event.target.value;
            if (selectedUser) {
                appState.selectedUser = selectedUser;
                appState.selectedUserId = JIRA_USER_MAP[selectedUser];
                console.log(`사용자 선택: ${selectedUser} (ID: ${appState.selectedUserId})`);
                showNotification(`👤 ${selectedUser}님이 선택되었습니다.`, 'success');
            } else {
                appState.selectedUser = null;
                appState.selectedUserId = null;
                console.log('사용자 선택 해제');
            }
        });
    }
}

// Jira 동기화 표시 함수
async function showJiraSync(syncType) {
    // 사용자가 선택되지 않은 경우 경고
    if (!appState.selectedUser) {
        showNotification('⚠️ 먼저 사용자를 선택해주세요!', 'error');
        return;
    }

    const syncInfo = {
        'fehg-kq': {
            name: 'FEHG → KQ',
            description: 'FEHG 프로젝트에서 KQ 프로젝트로 티켓을 동기화합니다.',
            boardKey: 'FEHG'
        },
        'fehg-hb': {
            name: 'FEHG → HB',
            description: 'FEHG 프로젝트에서 HB 프로젝트로 티켓을 동기화합니다.',
            boardKey: 'FEHG'
        },
        'fehg-autoway': {
            name: 'FEHG → AUTOWAY(HMG)',
            description: 'FEHG 프로젝트에서 AUTOWAY(HMG) 프로젝트로 티켓을 동기화합니다.',
            boardKey: 'FEHG'
        }
    };

    const sync = syncInfo[syncType];
    if (!sync) {
        console.error(`동기화 정보를 찾을 수 없습니다: ${syncType}`);
        return;
    }

    // 동기화 진행 중 상태 설정
    setAppDisabled(true);
    
    // 빈 상태 숨기기
    const emptyState = document.querySelector('.empty-state');
    emptyState.classList.add('hidden');

    // 결과 내용 표시
    const resultContent = document.getElementById('result-content');
    const resultActions = document.getElementById('result-actions');
    
    // 결과 화면 표시 설정
    resultContent.classList.remove('hidden');
    resultActions.classList.remove('hidden');
    const copyButton = document.getElementById('copy-button');
    copyButton.classList.add('hidden');

    try {
        // 1단계: 연결 확인 및 조회
        let displayText = `🔄 **${sync.name} 동기화 진행 중**

👤 **선택된 사용자**
${appState.selectedUser} (${appState.selectedUserId})

📋 **동기화 정보**
${sync.description}

⏳ **진행 상황**
1️⃣ Jira API 연결 확인 중...`;

        resultContent.textContent = displayText;

        // Jira API 연결 테스트
        const testResult = await window.electronAPI.testJiraConnection();
        if (!testResult.success) {
            throw new Error(testResult.message);
        }

        // 2단계: 연결된 티켓 조회
        const targetProject = sync.name.includes('KQ') ? 'KQ' : 
                             sync.name.includes('HB') ? 'HB' : 'AUTOWAY';
        
        displayText += `\n✅ Jira API 연결 성공!\n2️⃣ ${appState.selectedUser} 담당 FEHG 티켓과 연결된 ${targetProject} 티켓 조회 중...`;
        resultContent.textContent = displayText;

        const linkedResult = await window.electronAPI.findLinkedTargetIssues(sync.boardKey, appState.selectedUserId, targetProject);
        
        if (!linkedResult.success) {
            throw new Error(linkedResult.message);
        }

        if (linkedResult.totalLinkedKqIssues === 0) {
            displayText += `\n⚠️ 연결된 ${targetProject} 티켓이 없습니다.\n동기화할 항목이 없어 작업을 완료합니다.`;
            resultContent.textContent = displayText;
            resultContent.classList.remove('hidden');
            showNotification(`⚠️ 연결된 ${targetProject} 티켓이 없습니다`, 'warning');
            return;
        }

        // 3단계: 동기화 실행
        displayText += `\n✅ 연결된 티켓 조회 완료!\n• FEHG 티켓: ${linkedResult.totalFehgIssues}개\n• 연결된 ${targetProject} 티켓: ${linkedResult.totalLinkedKqIssues}개\n\n3️⃣ 동기화 실행 중...`;
        resultContent.textContent = displayText;

        const syncResult = await window.electronAPI.syncFehgToTarget(sync.boardKey, appState.selectedUserId, targetProject);

        // 4단계: 결과 표시
        if (syncResult.success) {
            const successResults = syncResult.results.filter(r => r.status === 'success');
            const failedResults = syncResult.results.filter(r => r.status === 'failed');
            
            const successSummary = successResults.length > 0 ? 
                successResults.map(r => 
                    `✅ ${r.sourceKey} → ${r.targetKey}`
                ).join('\n') : '';
            
            const failedSummary = failedResults.length > 0 ? 
                failedResults.map(r => 
                    `❌ ${r.sourceKey} → ${r.targetKey}: ${r.error || '알 수 없는 오류'}`
                ).join('\n') : '';

            displayText = `✅ **${sync.name} 동기화 완료**

👤 **선택된 사용자**
${appState.selectedUser} (${appState.selectedUserId})

📊 **동기화 결과**
• 총 처리: ${syncResult.totalProcessed}개
• 성공: ${syncResult.totalSuccess}개
• 실패: ${syncResult.totalFailed}개
• 성공률: ${syncResult.totalProcessed > 0 ? Math.round((syncResult.totalSuccess / syncResult.totalProcessed) * 100) : 0}%

${successSummary ? `🎯 **성공한 동기화**\n${successSummary}\n\n` : ''}${failedSummary ? `⚠️ **실패한 동기화**\n${failedSummary}\n\n` : ''}📝 **동기화된 필드**
• 제목 (Summary)
• 마감일 (Due Date)  
• 시작일 (Start Date)
• 담당자 (Assignee)
• 시간 추적 (Time Tracking)
• 스프린트 (Sprint) - 매핑 가능한 경우

🕐 **완료 시간**
${new Date().toLocaleString('ko-KR')}`;

            resultContent.textContent = displayText;
            resultContent.classList.remove('hidden');
            showNotification(`✅ ${sync.name} 동기화 완료! (성공: ${syncResult.totalSuccess}/${syncResult.totalProcessed})`, 'success');
        } else {
            displayText = `❌ **${sync.name} 동기화 실패**

👤 **선택된 사용자**
${appState.selectedUser} (${appState.selectedUserId})

❌ **오류 정보**
${syncResult.message}

🔧 **문제 해결 방법**
1. 네트워크 연결 상태를 확인하세요
2. Jira 토큰이 유효한지 확인하세요
3. 사용자 권한을 확인하세요

📞 **지원**
문제가 계속되면 개발팀에 문의하세요.`;

            resultContent.textContent = displayText;
            resultContent.classList.remove('hidden');
            showNotification(`❌ 동기화 실패: ${syncResult.message}`, 'error');
        }

    } catch (error) {
        console.error('Jira 동기화 오류:', error);
        
        const displayText = `❌ **${sync.name} 동기화 실패**

👤 **선택된 사용자**
${appState.selectedUser} (${appState.selectedUserId})

❌ **시스템 오류**
${error.message || '알 수 없는 오류가 발생했습니다'}

🔧 **문제 해결 방법**
1. 네트워크 연결 상태를 확인하세요
2. Jira 토큰이 유효한지 확인하세요
3. 보드 ID가 올바른지 확인하세요
4. 사용자 권한을 확인하세요

📞 **지원**
문제가 계속되면 개발팀에 문의하세요.`;

        resultContent.textContent = displayText;
        resultContent.classList.remove('hidden');
        showNotification(`❌ ${sync.name} 동기화 실패: ${error.message}`, 'error');
    } finally {
        // 동기화 완료 후 앱 상태 복원
        setAppDisabled(false);
    }
}

// 복사 기능 설정
function setupCopyFunction() {
    const copyButton = document.getElementById('copy-button');
    if (copyButton) {
        copyButton.addEventListener('click', async () => {
            if (appState.selectedTemplate) {
                const template = appState.templateData[appState.selectedTemplate];
                if (template) {
                    try {
                        // rawContent가 있으면 사용, 없으면 기본 content 사용
                        const copyText = template.rawContent || template.content;
                        await navigator.clipboard.writeText(copyText);
                        showNotification('📋 슬랙 형식으로 클립보드에 복사되었습니다!', 'success');
                        
                        // 버튼 텍스트 일시적 변경
                        const originalText = copyButton.textContent;
                        copyButton.textContent = '✅ 복사됨!';
                        setTimeout(() => {
                            copyButton.textContent = originalText;
                        }, 2000);
                    } catch (error) {
                        console.error('복사 실패:', error);
                        showNotification('❌ 복사에 실패했습니다.', 'error');
                    }
                }
            }
        });
    }
}

// 버튼 이벤트 설정
function setupButtonEvents() {
    // 슬랙 템플릿 버튼들
    const cpoBoButton = document.getElementById('cpo-bo-button');
    if (cpoBoButton) {
        cpoBoButton.addEventListener('click', () => {
            console.log('CPO BO 버튼 클릭');
            showTemplate('cpo-bo');
        });
    }
    
    const softeerButton = document.getElementById('softeer-button');
    if (softeerButton) {
        softeerButton.addEventListener('click', () => {
            console.log('소프티어 버튼 클릭');
            showTemplate('softeer');
        });
    }

    // Jira 동기화 버튼들
    const fehgKqButton = document.getElementById('fehg-kq-button');
    if (fehgKqButton) {
        fehgKqButton.addEventListener('click', () => {
            console.log('FEHG → KQ 동기화 버튼 클릭');
            showJiraSync('fehg-kq');
        });
    }

    const fehgHbButton = document.getElementById('fehg-hb-button');
    if (fehgHbButton) {
        fehgHbButton.addEventListener('click', () => {
            console.log('FEHG → HB 동기화 버튼 클릭');
            showJiraSync('fehg-hb');
        });
    }

    const fehgAutowayButton = document.getElementById('fehg-autoway-button');
    if (fehgAutowayButton) {
        fehgAutowayButton.addEventListener('click', () => {
            console.log('FEHG → AUTOWAY(HMG) 동기화 버튼 클릭');
            showJiraSync('fehg-autoway');
        });
    }
}

// 앱 비활성화/활성화 함수
function setAppDisabled(disabled) {
    const buttons = document.querySelectorAll('button');
    const selects = document.querySelectorAll('select');
    
    buttons.forEach(button => {
        button.disabled = disabled;
        if (disabled) {
            button.classList.add('disabled');
        } else {
            button.classList.remove('disabled');
        }
    });
    
    selects.forEach(select => {
        select.disabled = disabled;
        if (disabled) {
            select.classList.add('disabled');
        } else {
            select.classList.remove('disabled');
        }
    });
    
    // 동기화 상태 표시 (오버레이 제거하고 자연스러운 표시)
    const appLayout = document.querySelector('.app-layout');
    if (disabled) {
        appLayout.classList.add('syncing');
    } else {
        appLayout.classList.remove('syncing');
    }
}

// 간단한 알림 함수
function showNotification(message, type = 'info') {
    // 기존 알림 제거
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 새 알림 생성
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // 스타일 적용
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '600',
        zIndex: '9999',
        opacity: '0',
        transition: 'opacity 0.3s ease',
        backgroundColor: type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#4299e1'
    });
    
    // DOM에 추가
    document.body.appendChild(notification);
    
    // 페이드인 효과
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);
    
    // 3초 후 자동 제거
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// 키보드 단축키 설정
document.addEventListener('keydown', (event) => {
    // Cmd+R (Mac) 또는 Ctrl+R (Windows/Linux)로 새로고침
    if ((event.metaKey || event.ctrlKey) && event.key === 'r') {
        event.preventDefault();
        location.reload();
    }
    
    // Cmd+Shift+I (Mac) 또는 Ctrl+Shift+I (Windows/Linux)로 개발자 도구 토글
    if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === 'I') {
        event.preventDefault();
        // 개발자 도구는 메인 프로세스에서 관리되므로 여기서는 로그만 출력
        console.log('개발자 도구 토글 단축키가 눌렸습니다.');
    }
});

// 전역 오류 핸들러
window.addEventListener('error', (event) => {
    console.error('전역 오류:', event.error);
    showNotification('예상치 못한 오류가 발생했습니다.', 'error');
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('처리되지 않은 Promise 거부:', event.reason);
    showNotification('비동기 작업 중 오류가 발생했습니다.', 'error');
});

