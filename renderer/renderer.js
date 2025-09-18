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
}

const JIRA_ASSINEE_MAP = {
  ['712020:f4f9e56c-4b40-41ac-af83-5d2f774a72d5']: 'ZS17249', // 한준호
  ['639a6767f134138b5a5132f6']: 'ZS11269', // 손현지
  ['637426199e48f2b9a6108c25']: 'ZS11185', // 김가빈
  ['638d49155fce844d606c7682']: 'ZS11241', // 박성찬
  ['639fa03f2c70aae1e6f79806']: 'ZS11262', // 서성주
  ['712020:11fff4cb-cb95-457e-95a2-6cf9045c53b2']: 'Z204225', // 김찬영
  ['712020:403a306e-0eff-4d57-9fda-2f517158d40f']: 'Z204285', // 조한빈
  ['712020:96cf8ab5-20ff-4d6b-960d-5d38b7a46a39']: 'ZS18620', // 이미진
}

// 앱 상태 관리
const appState = {
  selectedTemplate: null,
  selectedUser: null,
  selectedUserId: null,
  templateData: {
    'cpo-bo': {
      name: 'CPO BO',
      // 슬랙 복사용 원본 텍스트
      rawContent:
        '<  *Gitlab*  >\n1. 배포 승인 대기\n2. release -> main 머지 <https://gitlab.hmc.co.kr/kia-cpo/kia-cpo-bo-web/-/merge_requests|BO> / <https://gitlab.hmc.co.kr/kia-cpo/kia-pricing-bo-web/-/merge_requests|프라이싱> / <https://gitlab.hmc.co.kr/kia-cpo/kia-cpo-partner-web/-/merge_requests|평가사>\n\t- 담당 PR건들 release 브랜치로 머지 - <!subteam^S05SK5F8Z5J> 완료시 따봉\n\t- 릴리즈 발행 (`{release-yyyyMMdd}`) - <@U04D5SP327J>\n\t- 릴리즈 노트: `{맨 아래 링크 참고하여 릴리즈 노트 링크 복붙}`\n3. main 로컬구동 모니터링 - <!subteam^S05SK5F8Z5J>\n4. 배포 전 할 일 확인 - <!subteam^S05SK5F8Z5J>\n5. 운영 배포 trigger - <@U04D5SP327J>\n6. main -> stage, stage2 현행화/배포\n\ta. BO `{담당자 태그}`\n\tb. 프라이싱 `{담당자 태그}`\n\tc. 평가사 `{담당자 태그}`\n7. 배포 후 모니터링 - <!subteam^S05SK5F8Z5J>\n8. 배포 후 할 일 확인 - <!subteam^S05SK5F8Z5J>\n9. 운영 모니터링 - `{모니터링 순서 작성}`\n10. 배포 완료',
      // 화면 표시용 포맷된 텍스트
      displayContent: `🔧 <strong>Gitlab 배포 프로세스</strong>

1️⃣ <strong>배포 승인 대기</strong>

2️⃣ <strong>release → main 머지</strong>
   • BO: gitlab.hmc.co.kr/kia-cpo/kia-cpo-bo-web/-/merge_requests
   • 프라이싱: gitlab.hmc.co.kr/kia-cpo/kia-pricing-bo-web/-/merge_requests
   • 평가사: gitlab.hmc.co.kr/kia-cpo/kia-cpo-partner-web/-/merge_requests
   
   ↳ 담당 PR건들 release 브랜치로 머지 - @frontend-team 완료시 따봉
   ↳ 릴리즈 발행 (\`release-yyyyMMdd\`) - @배포담당자
   ↳ 릴리즈 노트: \`{맨 아래 링크 참고하여 릴리즈 노트 링크 복붙}\`

3️⃣ <strong>main 로컬구동 모니터링</strong> - @frontend-team

4️⃣ <strong>배포 전 할 일 확인</strong> - @frontend-team

5️⃣ <strong>운영 배포 trigger</strong> - @배포담당자

6️⃣ <strong>main → stage, stage2 현행화/배포</strong>
   a. BO \`{담당자 태그}\`
   b. 프라이싱 \`{담당자 태그}\`
   c. 평가사 \`{담당자 태그}\`

7️⃣ <strong>배포 후 모니터링</strong> - @frontend-team

8️⃣ <strong>배포 후 할 일 확인</strong> - @frontend-team

9️⃣ <strong>운영 모니터링</strong> - \`{모니터링 순서 작성}\`

🔟 <strong>배포 완료</strong> ✅`,
    },
    softeer: {
      name: '소프티어',
      // 슬랙 복사용 원본 텍스트
      rawContent:
        '< *소프티어 배포* >\n1. 팀즈 배포 승인 대기\n2. release/hotfix -> main 머지 <https://gitlab.hmc.co.kr/ignite-hmg-developers/hmg-developers/-/merge_requests|Gitlab MR>\n3. main 로컬구동 모니터링 - <!subteam^S067AHD9MFZ>\n4. 배포 전 할 일 확인 - <https://ignitecorp.atlassian.net/wiki/spaces/HDS/pages/839024722/Dev|Dev) 배포관리> <!subteam^S067AHD9MFZ>\n5. main 검증계 배포 (staging 태그 발행)\n6. 검증계 배포 완료 대기\n\t- <https://gitlab.hmc.co.kr/ignite-hmg-developers/hmg-developers/-/pipelines|gitlab pipeline> 확인\n\t- <https://argo.hmc.co.kr/|argo> 업데이트 확인\n7. main 운영계 배포 (release 태그 발행)\n8. 배포 후 모니터링 - <!subteam^S067AHD9MFZ>\n9. 배포 후 할 일 확인 - <https://ignitecorp.atlassian.net/wiki/spaces/HDS/pages/839024722/Dev|Dev) 배포관리> <!subteam^S067AHD9MFZ>\n10. 팀즈 배포 완료 공유',
      // 화면 표시용 포맷된 텍스트
      displayContent: `🚗 <strong>소프티어 배포</strong>

1️⃣ <strong>팀즈 배포 승인 대기</strong>

2️⃣ <strong>release/hotfix → main 머지</strong>
   • Gitlab MR: gitlab.hmc.co.kr/ignite-hmg-developers/hmg-developers/-/merge_requests

3️⃣ <strong>main 로컬구동 모니터링</strong> - @dev-team

4️⃣ <strong>배포 전 할 일 확인</strong>
   • Dev 배포관리: ignitecorp.atlassian.net/wiki/spaces/HDS/pages/839024722/Dev
   • 담당: @dev-team

5️⃣ <strong>main 검증계 배포</strong> (staging 태그 발행)

6️⃣ <strong>검증계 배포 완료 대기</strong>
   ↳ gitlab pipeline 확인: gitlab.hmc.co.kr/ignite-hmg-developers/hmg-developers/-/pipelines
   ↳ argo 업데이트 확인: argo.hmc.co.kr

7️⃣ <strong>main 운영계 배포</strong> (release 태그 발행)

8️⃣ <strong>배포 후 모니터링</strong> - @dev-team

9️⃣ <strong>배포 후 할 일 확인</strong>
   • Dev 배포관리: ignitecorp.atlassian.net/wiki/spaces/HDS/pages/839024722/Dev
   • 담당: @dev-team

🔟 <strong>팀즈 배포 완료 공유</strong> ✅`,
    },
  },
}

// DOM이 로드되면 실행
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Renderer process started')

  // 버튼 이벤트 리스너 설정
  setupButtonEvents()

  // 사용자 선택 dropdown 이벤트 설정
  setupUserSelection()

  // 복사 기능 초기화
  setupCopyFunction()
})

// 템플릿 표시 함수
function showTemplate(templateKey) {
  const template = appState.templateData[templateKey]
  if (!template) {
    console.error(`템플릿을 찾을 수 없습니다: ${templateKey}`)
    return
  }

  // 선택된 템플릿 저장
  appState.selectedTemplate = templateKey

  // 빈 상태 숨기기
  const emptyState = document.querySelector('.empty-state')
  emptyState.classList.add('hidden')

  // 결과 내용 표시 (화면용 포맷 사용)
  const resultContent = document.getElementById('result-content')
  const resultActions = document.getElementById('result-actions')

  // displayContent가 있으면 사용, 없으면 기본 content 사용
  const displayText = template.displayContent || template.content
  resultContent.textContent = displayText
  resultContent.classList.remove('hidden')
  resultActions.classList.remove('hidden')

  console.log(`템플릿 표시: ${template.name}`)
  showNotification(`✅ ${template.name} 템플릿이 로드되었습니다!`, 'success')
}

// 사용자 선택 설정 함수
function setupUserSelection() {
  const userSelect = document.getElementById('user-select')
  if (userSelect) {
    userSelect.addEventListener('change', (event) => {
      const selectedUser = event.target.value
      if (selectedUser) {
        appState.selectedUser = selectedUser
        appState.selectedUserId = JIRA_USER_MAP[selectedUser]
        console.log(
          `사용자 선택: ${selectedUser} (ID: ${appState.selectedUserId})`
        )
        showNotification(`👤 ${selectedUser}님이 선택되었습니다.`, 'success')
      } else {
        appState.selectedUser = null
        appState.selectedUserId = null
        console.log('사용자 선택 해제')
      }
    })
  }
}

// Jira 동기화 표시 함수
async function showJiraSync(syncType) {
  // 사용자가 선택되지 않은 경우 경고
  if (!appState.selectedUser) {
    showNotification('⚠️ 먼저 사용자를 선택해주세요!', 'error')
    return
  }

  const syncInfo = {
    'fehg-kq': {
      name: 'FEHG → KQ',
      description: 'FEHG 프로젝트에서 KQ 프로젝트로 티켓을 동기화합니다.',
      boardKey: 'FEHG',
    },
    'fehg-hb': {
      name: 'FEHG → HB',
      description: 'FEHG 프로젝트에서 HB 프로젝트로 티켓을 동기화합니다.',
      boardKey: 'FEHG',
    },
    'fehg-autoway': {
      name: 'FEHG → AUTOWAY(HMG)',
      description:
        'FEHG 프로젝트에서 AUTOWAY(HMG) 프로젝트로 티켓을 동기화합니다.',
      boardKey: 'FEHG',
    },
  }

  const sync = syncInfo[syncType]
  if (!sync) {
    console.error(`동기화 정보를 찾을 수 없습니다: ${syncType}`)
    return
  }

  // 동기화 진행 중 상태 설정
  setAppDisabled(true)

  // 빈 상태 숨기기
  const emptyState = document.querySelector('.empty-state')
  emptyState.classList.add('hidden')

  // 결과 내용 표시
  const resultContent = document.getElementById('result-content')
  const resultActions = document.getElementById('result-actions')

  // 결과 화면 표시 설정
  resultContent.classList.remove('hidden')
  resultActions.classList.remove('hidden')
  const copyButton = document.getElementById('copy-button')
  copyButton.classList.add('hidden')

  try {
    // 1단계: 연결 확인 및 조회
    let displayText = `🔄 <strong>${sync.name} 동기화 진행 중</strong>

👤 <strong>선택된 사용자</strong>
${appState.selectedUser} (${appState.selectedUserId})

📋 <strong>동기화 정보</strong>
${sync.description}

⏳ <strong>진행 상황</strong>
1️⃣ Jira API 연결 확인 중...`

    resultContent.innerHTML = displayText

    // Jira API 연결 테스트
    const testResult = await window.electronAPI.testIgniteJiraConnection()
    if (!testResult.success) {
      // testIgniteJiraConnection에서 반환된 상세 오류 정보를 그대로 전달
      const errorMessage = testResult.message || 'Jira API 연결 실패'
      throw new Error(errorMessage)
    }

    // 2단계: 연결된 티켓 조회
    const targetProject = sync.name.includes('KQ')
      ? 'KQ'
      : sync.name.includes('HB')
        ? 'HB'
        : 'AUTOWAY'

    displayText += `\n✅ Jira API 연결 성공!\n2️⃣ ${appState.selectedUser} 담당 FEHG 티켓과 연결된 ${targetProject} 티켓 조회 중...`
    resultContent.innerHTML = displayText

    const linkedResult = await window.electronAPI.findLinkedTargetIssues(
      sync.boardKey,
      appState.selectedUserId,
      targetProject
    )

    if (!linkedResult.success) {
      throw new Error(linkedResult.message)
    }

    if (linkedResult.totalLinkedKqIssues === 0) {
      displayText += `\n⚠️ 연결된 ${targetProject} 티켓이 없습니다.\n동기화할 항목이 없어 작업을 완료합니다.`
      resultContent.innerHTML = displayText
      resultContent.classList.remove('hidden')
      showNotification(`⚠️ 연결된 ${targetProject} 티켓이 없습니다`, 'warning')
      return
    }

    // 3단계: 동기화 실행
    displayText += `\n✅ 연결된 티켓 조회 완료!\n• FEHG 티켓: ${linkedResult.totalFehgIssues}개\n• 연결된 ${targetProject} 티켓: ${linkedResult.totalLinkedKqIssues}개\n\n3️⃣ 동기화 실행 중...`
    resultContent.innerHTML = displayText

    const syncResult = await window.electronAPI.syncFehgToTarget(
      sync.boardKey,
      appState.selectedUserId,
      targetProject
    )

    // 4단계: 결과 표시
    if (syncResult.success) {
      const successResults = syncResult.results.filter(
        (r) => r.status === 'success'
      )
      const failedResults = syncResult.results.filter(
        (r) => r.status === 'failed'
      )

      const successSummary =
        successResults.length > 0
          ? successResults
              .map((r) => `✅ ${r.sourceKey} → ${r.targetKey}`)
              .join('\n')
          : ''

      const failedSummary =
        failedResults.length > 0
          ? failedResults
              .map(
                (r) =>
                  `❌ ${r.sourceKey} → ${r.targetKey}: ${r.error || '알 수 없는 오류'}`
              )
              .join('\n')
          : ''

      displayText = `✅ <strong>${sync.name} 동기화 완료</strong>

👤 <strong>선택된 사용자</strong>
${appState.selectedUser} (${appState.selectedUserId})

📊 <strong>동기화 결과</strong>
• 총 처리: ${syncResult.totalProcessed}개
• 성공: ${syncResult.totalSuccess}개
• 실패: ${syncResult.totalFailed}개
• 성공률: ${syncResult.totalProcessed > 0 ? Math.round((syncResult.totalSuccess / syncResult.totalProcessed) * 100) : 0}%

${successSummary ? `🎯 <strong>성공한 동기화</strong>\n${successSummary}\n\n` : ''}${failedSummary ? `⚠️ <strong>실패한 동기화</strong>\n${failedSummary}\n\n` : ''}📝 <strong>동기화된 필드</strong>
• 제목 (Summary)
• 마감일 (Due Date)  
• 시작일 (Start Date)
• 담당자 (Assignee)
• 시간 추적 (Time Tracking)
• 스프린트 (Sprint) - 매핑 가능한 경우

🕐 <strong>완료 시간</strong>
${new Date().toLocaleString('ko-KR')}`

      resultContent.innerHTML = displayText
      resultContent.classList.remove('hidden')
      showNotification(
        `✅ ${sync.name} 동기화 완료! (성공: ${syncResult.totalSuccess}/${syncResult.totalProcessed})`,
        'success'
      )
    } else {
      displayText = `❌ <strong>${sync.name} 동기화 실패</strong>

👤 <strong>선택된 사용자</strong>
${appState.selectedUser} (${appState.selectedUserId})

❌ <strong>오류 정보</strong>
${syncResult.message}

🔧 <strong>문제 해결 방법</strong>
1. 네트워크 연결 상태를 확인하세요
2. Jira 토큰이 유효한지 확인하세요
3. 사용자 권한을 확인하세요

📞 <strong>지원</strong>
문제가 계속되면 개발팀에 문의하세요.`

      resultContent.innerHTML = displayText
      resultContent.classList.remove('hidden')
      showNotification(`❌ 동기화 실패: ${syncResult.message}`, 'error')
    }
  } catch (error) {
    console.error('Jira 동기화 오류:', error)

    // 상세한 오류 정보 표시
    const errorMessage = error.message || '알 수 없는 오류가 발생했습니다'
    const isDetailedError = errorMessage.includes('디버깅 정보:')

    const displayText = `❌ <strong>${sync.name} 동기화 실패</strong>

👤 <strong>선택된 사용자</strong>
${appState.selectedUser} (${appState.selectedUserId})

❌ <strong>시스템 오류</strong>
${isDetailedError ? errorMessage : `Jira API 연결 실패`}

${
  isDetailedError
    ? `📋 <strong>상세 디버깅 정보</strong>
<pre style="background: #f5f5f5; padding: 10px; border-radius: 5px; font-size: 12px; white-space: pre-wrap; overflow-x: auto;">${errorMessage}</pre>`
    : ''
}

🔧 <strong>문제 해결 방법</strong>
1. 네트워크 연결 상태를 확인하세요
2. Jira 토큰이 유효한지 확인하세요
3. 보드 ID가 올바른지 확인하세요
4. 사용자 권한을 확인하세요

📞 <strong>지원</strong>
문제가 계속되면 개발팀에 문의하세요.`

    resultContent.innerHTML = displayText
    resultContent.classList.remove('hidden')
    showNotification(`❌ ${sync.name} 동기화 실패: ${error.message}`, 'error')
  } finally {
    // 동기화 완료 후 앱 상태 복원
    setAppDisabled(false)
  }
}

// FEHG → HMG(AUTOWAY) 에픽 생성 모달 표시 함수
async function showFehgAutowayEpicCreation() {
  await showEpicSelectionModal(
    'FEHG → HMG(AUTOWAY) 에픽 생성',
    '생성할 FEHG 에픽을 선택하세요:',
    executeAutowayEpicCreation
  )
}

// AUTOWAY 에픽 생성 실행 함수
async function executeAutowayEpicCreation(epicIdNum) {

  // 에픽 생성 진행 중 상태 설정
  setAppDisabled(true)

  // 빈 상태 숨기기
  const emptyState = document.querySelector('.empty-state')
  emptyState.classList.add('hidden')

  // 결과 내용 표시
  const resultContent = document.getElementById('result-content')
  const resultActions = document.getElementById('result-actions')

  // 진행 중 메시지 표시
  resultContent.innerHTML = '<div class="loading-message">📋 FEHG → HMG(AUTOWAY) 에픽 생성 진행 중입니다...</div>'
  resultContent.classList.remove('hidden')

  // 결과 화면 표시 설정
  resultActions.classList.remove('hidden')
  const copyButton = document.getElementById('copy-button')
  copyButton.classList.add('hidden')

  try {
    // 1단계: FEHG 에픽 조회
    let displayText = `🧪 <strong>FEHG → HMG(AUTOWAY) 에픽 생성</strong>

📋 <strong>입력된 에픽 ID</strong>
FEHG-${epicIdNum}

⏳ <strong>진행 상황</strong>
1️⃣ FEHG 에픽 정보 조회 중...`

    resultContent.innerHTML = displayText

    // FEHG 에픽 조회 및 AUTOWAY 에픽 생성
    const result = await window.electronAPI.createHmgJiraEpicFromFehg(epicIdNum)

    if (!result.success) {
      throw new Error(result.message)
    }

    // 2단계: 결과 표시
    if (result.alreadyExists) {
      // 이미 연결된 에픽이 있는 경우
      displayText = `ℹ️ <strong>이미 연결된 AUTOWAY 에픽이 있습니다</strong>

📋 <strong>FEHG 에픽 정보</strong>
<strong>에픽</strong>: <a href="https://ignitecorp.atlassian.net/browse/${result.fehgEpic.key}" target="_blank">${result.fehgEpic.key}</a>
<strong>제목</strong>: ${result.fehgEpic.fields.summary}

🔗 <strong>연결된 AUTOWAY 에픽</strong>
<strong>에픽</strong>: <a href="${result.existingAutowayUrl}" target="_blank">${result.existingAutowayKey}</a>
<strong>URL</strong>: <a href="${result.existingAutowayUrl}" target="_blank">${result.existingAutowayUrl}</a>

✅ <strong>연결 상태</strong>
이미 FEHG 에픽과 AUTOWAY 에픽이 연결되어 있습니다.

🕐 <strong>확인 시간</strong>
${new Date().toLocaleString('ko-KR')}`

      resultContent.innerHTML = displayText
      resultContent.classList.remove('hidden')
      showNotification(
        `ℹ️ 이미 연결된 에픽이 있습니다 (${result.existingAutowayKey})`,
        'info'
      )
    } else if (result.linkSuccess) {
      // 새로 생성한 경우
      displayText = `🎉 <strong>FEHG → HMG(AUTOWAY) 에픽 생성 완료</strong>

📋 <strong>FEHG 에픽 정보</strong>
<strong>에픽</strong>: <a href="https://ignitecorp.atlassian.net/browse/${result.fehgEpic.key}" target="_blank">${result.fehgEpic.key}</a>
<strong>제목</strong>: ${result.fehgEpic.fields.summary}

🚀 <strong>AUTOWAY 에픽 생성 결과</strong>
• <strong>티켓</strong>: <a href="https://jira.hmg-corp.io/browse/${result.autowayEpic.key}" target="_blank">${result.autowayEpic.key}</a>
• <strong>URL</strong>: <a href="${result.autowayUrl}" target="_blank">${result.autowayUrl}</a>

✅ <strong>연결 완료</strong>
<a href="https://ignitecorp.atlassian.net/browse/${result.fehgEpic.key}" target="_blank">${result.fehgEpic.key}</a>의 customfield_10306에 AUTOWAY URL 저장됨

📝 <strong>매핑된 필드들</strong>
• summary (티켓명) ✅

🕐 <strong>완료 시간</strong>
${new Date().toLocaleString('ko-KR')}`

      resultContent.innerHTML = displayText
      resultContent.classList.remove('hidden')
      showNotification(
        `✅ AUTOWAY 에픽 생성 완료! (${result.autowayEpic.key})`,
        'success'
      )
    } else {
      displayText = `⚠️ <strong>AUTOWAY 에픽 생성 완료 (링크 업데이트 실패)</strong>

📋 <strong>FEHG 에픽 정보</strong>
${result.fehgInfo}

🚀 <strong>AUTOWAY 에픽 생성 결과</strong>
• <strong>티켓</strong>: <a href="https://jira.hmg-corp.io/browse/${result.autowayEpic.key}" target="_blank">${result.autowayEpic.key}</a>
• <strong>URL</strong>: <a href="${result.autowayUrl}" target="_blank">${result.autowayUrl}</a>

❌ <strong>링크 업데이트 실패</strong>
FEHG 티켓의 customfield_10306 업데이트에 실패했습니다.

📝 <strong>수동 작업 필요</strong>
수동으로 <a href="https://ignitecorp.atlassian.net/browse/FEHG-${result.fehgEpic.key}" target="_blank">FEHG-${result.fehgEpic.key}</a>에 다음 URL을 추가해주세요:
${result.autowayUrl}

🕐 <strong>완료 시간</strong>
${new Date().toLocaleString('ko-KR')}`

      resultContent.innerHTML = displayText
      resultContent.classList.remove('hidden')
      showNotification(
        `⚠️ AUTOWAY 에픽 생성 완료, 링크 업데이트 실패`,
        'warning'
      )
    }
  } catch (error) {
    console.error('AUTOWAY 에픽 생성 오류:', error)

    const displayText = `❌ <strong>FEHG → HMG(AUTOWAY) 에픽 생성 실패</strong>

📋 <strong>입력된 에픽 ID</strong>
FEHG-${epicIdNum}

❌ <strong>오류 정보</strong>
${error.message || '알 수 없는 오류가 발생했습니다'}

🔧 <strong>문제 해결 방법</strong>
1. FEHG 에픽 ID가 올바른지 확인하세요
2. 네트워크 연결 상태를 확인하세요
3. Jira 토큰이 유효한지 확인하세요
4. 사용자 권한을 확인하세요

📞 <strong>지원</strong>
문제가 계속되면 개발팀에 문의하세요.`

    resultContent.innerHTML = displayText
    resultContent.classList.remove('hidden')
    showNotification(`❌ AUTOWAY 에픽 생성 실패: ${error.message}`, 'error')
  } finally {
    // 에픽 생성 완료 후 앱 상태 복원
    setAppDisabled(false)
  }
}

// 복사 기능 설정
function setupCopyFunction() {
  const copyButton = document.getElementById('copy-button')
  if (copyButton) {
    copyButton.addEventListener('click', async () => {
      if (appState.selectedTemplate) {
        const template = appState.templateData[appState.selectedTemplate]
        if (template) {
          try {
            // rawContent가 있으면 사용, 없으면 기본 content 사용
            const copyText = template.rawContent || template.content
            await navigator.clipboard.writeText(copyText)
            showNotification(
              '📋 슬랙 형식으로 클립보드에 복사되었습니다!',
              'success'
            )

            // 버튼 텍스트 일시적 변경
            const originalText = copyButton.textContent
            copyButton.textContent = '✅ 복사됨!'
            setTimeout(() => {
              copyButton.textContent = originalText
            }, 2000)
          } catch (error) {
            console.error('복사 실패:', error)
            showNotification('❌ 복사에 실패했습니다.', 'error')
          }
        }
      }
    })
  }
}

// 버튼 이벤트 설정
function setupButtonEvents() {
  // 슬랙 템플릿 버튼들
  const cpoBoButton = document.getElementById('cpo-bo-button')
  if (cpoBoButton) {
    cpoBoButton.addEventListener('click', () => {
      console.log('CPO BO 버튼 클릭')
      showTemplate('cpo-bo')
    })
  }

  const softeerButton = document.getElementById('softeer-button')
  if (softeerButton) {
    softeerButton.addEventListener('click', () => {
      console.log('소프티어 버튼 클릭')
      showTemplate('softeer')
    })
  }

  // Jira 동기화 버튼들
  const fehgKqButton = document.getElementById('fehg-kq-button')
  if (fehgKqButton) {
    fehgKqButton.addEventListener('click', () => {
      console.log('FEHG → KQ 동기화 버튼 클릭')
      showJiraSync('fehg-kq')
    })
  }

  const fehgHbButton = document.getElementById('fehg-hb-button')
  if (fehgHbButton) {
    fehgHbButton.addEventListener('click', () => {
      console.log('FEHG → HB 동기화 버튼 클릭')
      showJiraSync('fehg-hb')
    })
  }

  const fehgAutowayButton = document.getElementById('fehg-autoway-button')
  if (fehgAutowayButton) {
    fehgAutowayButton.addEventListener('click', () => {
      console.log('FEHG → AUTOWAY(HMG) 동기화 버튼 클릭')
      showJiraSync('fehg-autoway')
    })
  }

  // FEHG → HMG(AUTOWAY) 에픽 생성 버튼
  const fehgAutowayEpicButton = document.getElementById(
    'fehg-autoway-epic-button'
  )
  if (fehgAutowayEpicButton) {
    fehgAutowayEpicButton.addEventListener('click', () => {
      console.log('FEHG → HMG(AUTOWAY) 에픽 생성 버튼 클릭')
      showFehgAutowayEpicCreation()
    })
  }

  // FEHG 에픽 하위 티켓들 조회 버튼
  const fehgEpicTicketsButton = document.getElementById(
    'fehg-epic-tickets-button'
  )
  if (fehgEpicTicketsButton) {
    fehgEpicTicketsButton.addEventListener('click', () => {
      console.log('FEHG 에픽 하위 티켓들 조회 버튼 클릭')
      showFehgEpicTickets()
    })
  }

  // FEHG 에픽 하위 티켓과 연결된 티켓 생성 버튼
  const fehgAutowayTicketsButton = document.getElementById(
    'fehg-autoway-tickets-button'
  )
  if (fehgAutowayTicketsButton) {
    fehgAutowayTicketsButton.addEventListener('click', () => {
      console.log('FEHG 에픽 하위 티켓과 연결된 티켓 생성 버튼 클릭')
      showFehgAutowayTicketsCreation()
    })
  }
}

// 앱 비활성화/활성화 함수
function setAppDisabled(disabled) {
  const buttons = document.querySelectorAll('button')
  const selects = document.querySelectorAll('select')

  buttons.forEach((button) => {
    button.disabled = disabled
    if (disabled) {
      button.classList.add('disabled')
    } else {
      button.classList.remove('disabled')
    }
  })

  selects.forEach((select) => {
    select.disabled = disabled
    if (disabled) {
      select.classList.add('disabled')
    } else {
      select.classList.remove('disabled')
    }
  })

  // 동기화 상태 표시 (오버레이 제거하고 자연스러운 표시)
  const appLayout = document.querySelector('.app-layout')
  if (disabled) {
    appLayout.classList.add('syncing')
  } else {
    appLayout.classList.remove('syncing')
  }
}

// 간단한 알림 함수
function showNotification(message, type = 'info') {
  // 기존 알림 제거
  const existingNotification = document.querySelector('.notification')
  if (existingNotification) {
    existingNotification.remove()
  }

  // 새 알림 생성
  const notification = document.createElement('div')
  notification.className = `notification notification-${type}`
  notification.textContent = message

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
    backgroundColor:
      type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#4299e1',
  })

  // DOM에 추가
  document.body.appendChild(notification)

  // 페이드인 효과
  setTimeout(() => {
    notification.style.opacity = '1'
  }, 10)

  // 3초 후 자동 제거
  setTimeout(() => {
    notification.style.opacity = '0'
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove()
      }
    }, 300)
  }, 3000)
}

// 키보드 단축키 설정
document.addEventListener('keydown', (event) => {
  // Cmd+R (Mac) 또는 Ctrl+R (Windows/Linux)로 새로고침
  if ((event.metaKey || event.ctrlKey) && event.key === 'r') {
    event.preventDefault()
    location.reload()
  }

  // Cmd+Shift+I (Mac) 또는 Ctrl+Shift+I (Windows/Linux)로 개발자 도구 토글
  if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === 'I') {
    event.preventDefault()
    // 개발자 도구는 메인 프로세스에서 관리되므로 여기서는 로그만 출력
    console.log('개발자 도구 토글 단축키가 눌렸습니다.')
  }
})

// 전역 오류 핸들러
window.addEventListener('error', (event) => {
  console.error('전역 오류:', event.error)
  showNotification('예상치 못한 오류가 발생했습니다.', 'error')
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('처리되지 않은 Promise 거부:', event.reason)
  showNotification('비동기 작업 중 오류가 발생했습니다.', 'error')
})

// 공통 에픽 선택 모달 함수
async function showEpicSelectionModal(title, description, onConfirm) {
  const modal = document.getElementById('epic-modal')
  const modalTitle = document.getElementById('modal-title')
  const modalDescription = document.getElementById('modal-description')
  const dropdown = document.getElementById('epic-dropdown')
  const epicInfo = document.getElementById('epic-info')
  const epicSummary = document.getElementById('epic-summary')
  const confirmBtn = document.getElementById('confirm-modal')
  const cancelBtn = document.getElementById('cancel-modal')
  const closeBtn = document.getElementById('close-modal')

  // 모달 설정
  modalTitle.textContent = title
  modalDescription.textContent = description
  confirmBtn.disabled = true

  // 에픽 데이터 로드
  let epicData = null
  try {
    const result = await window.electronAPI.getAllowedFehgEpics()
    if (result.success) {
      epicData = result.epics
      
      // 드롭다운 초기화
      dropdown.innerHTML = '<option value="">에픽을 선택하세요...</option>'
      
      // 에픽 옵션 추가
      epicData.forEach(epic => {
        const option = document.createElement('option')
        option.value = epic.id
        option.textContent = `FEHG-${epic.id}: ${epic.summary}`
        dropdown.appendChild(option)
      })
    }
  } catch (error) {
    console.error('에픽 데이터 로드 실패:', error)
    showNotification('에픽 데이터를 불러올 수 없습니다.', 'error')
    return
  }

  // 드롭다운 변경 이벤트
  const handleDropdownChange = () => {
    try {
      const selectedEpicId = dropdown.value
      if (selectedEpicId && epicData) {
        confirmBtn.disabled = false
      } else {
        confirmBtn.disabled = true
      }
    } catch (error) {
      console.error('드롭다운 변경 처리 오류:', error)
      showNotification('에픽 선택 중 오류가 발생했습니다.', 'error')
    }
  }

  // 이벤트 리스너 정리 함수
  const cleanup = () => {
    dropdown.removeEventListener('change', handleDropdownChange)
    confirmBtn.removeEventListener('click', handleConfirm)
    cancelBtn.removeEventListener('click', handleCancel)
    closeBtn.removeEventListener('click', handleCancel)
  }

  // 확인 버튼 클릭
  const handleConfirm = async () => {
    try {
      const selectedEpicId = dropdown.value
      if (!selectedEpicId) {
        showNotification('에픽을 선택해주세요.', 'error')
        return
      }

      modal.classList.add('hidden')
      cleanup()
      
      // 진행 중 메시지 표시
      const resultContent = document.getElementById('result-content')
      const emptyState = document.querySelector('.empty-state')
      if (resultContent && emptyState) {
        emptyState.classList.add('hidden')
        resultContent.innerHTML = '<div class="loading-message">📋 작업 진행 중입니다...</div>'
        resultContent.classList.remove('hidden')
      }
      
      if (onConfirm) {
        await onConfirm(parseInt(selectedEpicId))
      }
    } catch (error) {
      console.error('확인 버튼 처리 오류:', error)
      showNotification('처리 중 오류가 발생했습니다.', 'error')
      modal.classList.add('hidden')
      cleanup()
    }
  }

  // 취소/닫기 버튼 클릭
  const handleCancel = () => {
    modal.classList.add('hidden')
    cleanup()
  }

  // 이벤트 리스너 등록
  dropdown.addEventListener('change', handleDropdownChange)
  confirmBtn.addEventListener('click', handleConfirm)
  cancelBtn.addEventListener('click', handleCancel)
  closeBtn.addEventListener('click', handleCancel)

  // 모달 표시
  modal.classList.remove('hidden')
}

// FEHG 에픽 하위 티켓들 조회 함수
function showFehgEpicTickets() {
  showEpicSelectionModal(
    '📋 FEHG 에픽 하위 티켓들 조회',
    '조회할 FEHG 에픽을 선택하세요:',
    executeFehgEpicTicketsQuery
  )
}

// 실제 FEHG 에픽 하위 티켓들 조회 실행 함수
async function executeFehgEpicTicketsQuery(epicIdNum) {
  // 진행 중 상태 설정
  setAppDisabled(true)

  // empty-state 숨기기
  const emptyState = document.querySelector('.empty-state')
  emptyState.classList.add('hidden')

  const resultContent = document.getElementById('result-content')
  const copyButton = document.getElementById('copy-button')
  copyButton.classList.add('hidden')

  try {
    // 1단계: FEHG 에픽 하위 티켓들 조회
    let displayText = `📋 <strong>FEHG 에픽 하위 티켓들 조회</strong>

📋 <strong>입력된 에픽 ID</strong>
FEHG-${epicIdNum}

⏳ <strong>진행 상황</strong>
1️⃣ FEHG 에픽 하위 티켓들 조회 중...`

    resultContent.innerHTML = displayText

    // FEHG 에픽 하위 티켓들 조회
    const result = await window.electronAPI.getFehgEpicTickets(epicIdNum)

    if (!result.success) {
      // 화이트리스트 오류 처리
      if (result.error === 'WHITELIST_ERROR') {
        const allowedIds = result.allowedEpicIds.join(', ')
        throw new Error(`${result.message}\n\n허용된 에픽 ID 목록:\n${allowedIds}`)
      }
      throw new Error(result.message)
    }

    // 2단계: 결과 표시
    if (result.tickets && result.tickets.length > 0) {
      const ticketsList = result.tickets
        .map(
          (ticket) =>
            `• <strong>${ticket.key}</strong>: ${ticket.fields.summary} (${ticket.fields.status.name})`
        )
        .join('\n')

      displayText = `✅ <strong>FEHG 에픽 하위 티켓들 조회 완료</strong>

📋 <strong>에픽 정보</strong>
<strong>에픽</strong>: ${result.epic.key}
<strong>제목</strong>: ${result.epic.fields.summary}
<strong>상태</strong>: ${result.epic.fields.status.name}

📊 <strong>하위 티켓 목록</strong> (총 ${result.tickets.length}개)
${ticketsList}

🕐 <strong>완료 시간</strong>
${new Date().toLocaleString('ko-KR')}`

      resultContent.innerHTML = displayText
      resultContent.classList.remove('hidden')
      showNotification(
        `✅ FEHG 에픽 하위 티켓들 조회 완료! (${result.tickets.length}개)`,
        'success'
      )
    } else {
      displayText = `⚠️ <strong>FEHG 에픽 하위 티켓들 조회 완료</strong>

📋 <strong>에픽 정보</strong>
<strong>에픽</strong>: ${result.epic.key}
<strong>제목</strong>: ${result.epic.fields.summary}
<strong>상태</strong>: ${result.epic.fields.status.name}

📊 <strong>하위 티켓 목록</strong>
하위 티켓이 없습니다.

🕐 <strong>완료 시간</strong>
${new Date().toLocaleString('ko-KR')}`

      resultContent.innerHTML = displayText
      resultContent.classList.remove('hidden')
      showNotification(`⚠️ FEHG 에픽에 하위 티켓이 없습니다.`, 'warning')
    }
  } catch (error) {
    console.error('FEHG 에픽 하위 티켓들 조회 오류:', error)

    const displayText = `❌ <strong>FEHG 에픽 하위 티켓들 조회 실패</strong>

📋 <strong>입력된 에픽 ID</strong>
FEHG-${epicIdNum}

❌ <strong>오류 정보</strong>
${error.message || '알 수 없는 오류가 발생했습니다'}

🔧 <strong>문제 해결 방법</strong>
1. FEHG 에픽 ID가 올바른지 확인하세요
2. 네트워크 연결 상태를 확인하세요
3. Jira 토큰이 유효한지 확인하세요
4. 사용자 권한을 확인하세요

📞 <strong>지원</strong>
문제가 계속되면 개발팀에 문의하세요.`

    resultContent.innerHTML = displayText
    resultContent.classList.remove('hidden')
    showNotification(
      `❌ FEHG 에픽 하위 티켓들 조회 실패: ${error.message}`,
      'error'
    )
  } finally {
    // 진행 완료 후 상태 복원
    setAppDisabled(false)
  }
}

// FEHG 에픽 하위 티켓과 연결된 티켓 생성 함수
function showFehgAutowayTicketsCreation() {
  showEpicSelectionModal(
    '🔗 FEHG 에픽 하위 티켓과 연결된 티켓 생성',
    '처리할 FEHG 에픽을 선택하세요:',
    executeFehgAutowayTicketsCreation
  )
}

// 실제 FEHG 에픽 하위 티켓과 연결된 티켓 생성 실행 함수
async function executeFehgAutowayTicketsCreation(epicIdNum) {
  // 진행 중 상태 설정
  setAppDisabled(true)

  // empty-state 숨기기
  const emptyState = document.querySelector('.empty-state')
  emptyState.classList.add('hidden')

  const resultContent = document.getElementById('result-content')
  const copyButton = document.getElementById('copy-button')
  copyButton.classList.add('hidden')

  try {
    // 1단계: FEHG 에픽 하위 티켓과 연결된 티켓 생성
    let displayText = `🔗 <strong>FEHG 에픽 하위 티켓과 연결된 티켓 생성</strong>

📋 <strong>입력된 에픽 ID</strong>
FEHG-${epicIdNum}

⏳ <strong>진행 상황</strong>
1️⃣ FEHG 에픽 정보 조회 중...
2️⃣ AUTOWAY 에픽 연결 확인 중...
3️⃣ FEHG 하위 티켓 조회 중...
4️⃣ AUTOWAY 티켓 생성 중...`

    resultContent.innerHTML = displayText

    // FEHG 에픽 하위 티켓과 연결된 티켓 생성
    const result =
      await window.electronAPI.createHmgJiraTicketsFromFehg(epicIdNum)

    if (!result.success) {
      // 화이트리스트 에러인 경우 특별 처리
      if (result.errorType === 'WHITELIST_ERROR') {
        displayText = `❌ <strong>허용되지 않은 에픽 ID</strong>

📋 <strong>입력된 에픽 ID</strong>
FEHG-${result.epicId}

❌ <strong>오류 정보</strong>
허용되지 않은 에픽 ID입니다.

📝 <strong>허용된 에픽 ID 목록</strong>
${result.allowedEpicIds.map((id) => `• FEHG-${id}`).join('\n')}

🔧 <strong>문제 해결 방법</strong>
1. 위 목록에 있는 에픽 ID를 사용하세요
2. 새로운 에픽을 추가하려면 개발팀에 문의하세요

📞 <strong>지원</strong>
문제가 계속되면 개발팀에 문의하세요.`

        resultContent.innerHTML = displayText
        resultContent.classList.remove('hidden')
        showNotification(
          `❌ 허용되지 않은 에픽 ID: FEHG-${result.epicId}`,
          'error'
        )
        return
      }

      throw new Error(result.message)
    }

    // 2단계: 결과 표시
    if (result.results) {
      displayText = `✅ <strong>FEHG 에픽 하위 티켓과 연결된 티켓 생성 완료</strong>

📋 <strong>FEHG 에픽 정보</strong>
<strong>에픽</strong>: <a href="https://ignitecorp.atlassian.net/browse/${result.fehgEpic.key}" target="_blank">${result.fehgEpic.key}</a>
<strong>제목</strong>: ${result.fehgEpic.fields.summary}

🔗 <strong>AUTOWAY 에픽 정보</strong>
<strong>에픽</strong>: <a href="https://jira.hmg-corp.io/browse/${result.autowayEpicKey}" target="_blank">${result.autowayEpicKey}</a>
<strong>URL</strong>: <a href="${result.autowayEpicUrl}" target="_blank">${result.autowayEpicUrl}</a>

📊 <strong>처리 결과</strong>
<strong>총 티켓 수</strong>: ${(result.results.updated?.length || 0) + result.results.newlyCreated.length + result.results.failed.length}개

${
  result.results.updated && result.results.updated.length > 0
    ? `🔄 <strong>업데이트된 티켓 (${result.results.updated.length}개)</strong>
${result.results.updated.map((item) => `• ${item.ticket.key}: <a href="${item.autowayUrl}" target="_blank">${item.autowayUrl}</a>`).join('\n')}

`
    : ''
}${
        result.results.newlyCreated.length > 0
          ? `🆕 <strong>새로 생성된 티켓 (${result.results.newlyCreated.length}개)</strong>
${result.results.newlyCreated.map((item) => `• ${item.ticket.key}: <a href="${item.autowayUrl}" target="_blank">${item.autowayUrl}</a>`).join('\n')}

`
          : ''
      }${
        result.results.failed.length > 0
          ? `❌ <strong>생성 실패한 티켓 (${result.results.failed.length}개)</strong>
${result.results.failed.map((item) => `• ${item.ticket.key}: ${item.error}`).join('\n')}

`
          : ''
      }🔗 <strong>연동 정보</strong>
• FEHG 티켓에 AUTOWAY 링크 자동 업데이트 ✅
• 원본 FEHG 에픽: <a href="https://ignitecorp.atlassian.net/browse/${result.fehgEpic.key}" target="_blank">${result.fehgEpic.key}</a>
• 대상 AUTOWAY 에픽: <a href="https://jira.hmg-corp.io/browse/${result.autowayEpicKey}" target="_blank">${result.autowayEpicKey}</a>

🕐 <strong>완료 시간</strong>
${new Date().toLocaleString('ko-KR')}`

      resultContent.innerHTML = displayText
      resultContent.classList.remove('hidden')

      const totalProcessed =
        (result.results.updated?.length || 0) +
        result.results.newlyCreated.length +
        result.results.failed.length
      const successCount =
        (result.results.updated?.length || 0) +
        result.results.newlyCreated.length
      showNotification(
        `✅ 처리 완료! (${successCount}/${totalProcessed} 성공)`,
        'success'
      )
    } else {
      displayText = `⚠️ <strong>FEHG 에픽 하위 티켓과 연결된 티켓 생성 완료</strong>

📋 <strong>FEHG 에픽 정보</strong>
<strong>에픽</strong>: <a href="https://ignitecorp.atlassian.net/browse/${result.fehgEpic.key}" target="_blank">${result.fehgEpic.key}</a>
<strong>제목</strong>: ${result.fehgEpic.fields.summary}

🔗 <strong>AUTOWAY 에픽 정보</strong>
<strong>에픽</strong>: <a href="https://jira.hmg-corp.io/browse/${result.autowayEpicKey}" target="_blank">${result.autowayEpicKey}</a>
<strong>URL</strong>: <a href="${result.autowayEpicUrl}" target="_blank">${result.autowayEpicUrl}</a>

📊 <strong>생성된 티켓</strong>
생성할 하위 티켓이 없습니다.

🕐 <strong>완료 시간</strong>
${new Date().toLocaleString('ko-KR')}`

      resultContent.innerHTML = displayText
      resultContent.classList.remove('hidden')
      showNotification(`⚠️ FEHG 에픽에 하위 티켓이 없습니다.`, 'warning')
    }
  } catch (error) {
    console.error('FEHG 에픽 하위 티켓과 연결된 티켓 생성 오류:', error)

    const displayText = `❌ <strong>FEHG 에픽 하위 티켓과 연결된 티켓 생성 실패</strong>

📋 <strong>입력된 에픽 ID</strong>
FEHG-${epicIdNum}

❌ <strong>오류 정보</strong>
${error.message || '알 수 없는 오류가 발생했습니다'}

🔧 <strong>문제 해결 방법</strong>
1. FEHG 에픽 ID가 올바른지 확인하세요
2. FEHG 에픽이 AUTOWAY 에픽과 연결되어 있는지 확인하세요
3. 네트워크 연결 상태를 확인하세요
4. Jira 토큰이 유효한지 확인하세요
5. 사용자 권한을 확인하세요

📞 <strong>지원</strong>
문제가 계속되면 개발팀에 문의하세요.`

    resultContent.innerHTML = displayText
    resultContent.classList.remove('hidden')
    showNotification(
      `❌ FEHG 에픽 하위 티켓과 연결된 티켓 생성 실패: ${error.message}`,
      'error'
    )
  } finally {
    // 진행 완료 후 상태 복원
    setAppDisabled(false)
  }
}

// 외부 링크를 기본 브라우저로 열기
document.addEventListener('DOMContentLoaded', () => {
  // 모든 외부 링크에 클릭 이벤트 추가
  document.addEventListener('click', (event) => {
    const target = event.target
    
    // a 태그이고 href가 http로 시작하는 경우
    if (target.tagName === 'A' && target.href && target.href.startsWith('http')) {
      event.preventDefault()
      
      // Electron의 shell.openExternal을 통해 기본 브라우저로 열기
      if (window.electronAPI && window.electronAPI.openExternal) {
        window.electronAPI.openExternal(target.href)
      } else {
        // fallback: 새 창으로 열기
        window.open(target.href, '_blank')
      }
    }
  })
})
