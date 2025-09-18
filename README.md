# FE팀 Jira 동기화 도구

FE팀의 Jira 티켓 동기화를 위한 Electron 기반 데스크톱 애플리케이션입니다.

## 🚀 빠른 시작

### 1. 저장소 클론

```bash
git clone <repository-url>
cd fe1-electron
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 설정 (중요!)

`src/utils/env.ts` 파일을 생성하고 다음 내용을 입력하세요:

```typescript
export const IGNORE_API_TOKENS = {
  JIRA_API_TOKEN: 'your_jira_api_token_here',
  ATLASSIAN_TOKEN: 'your_atlassian_token_here',
  HMG_JIRA_TOKEN: 'your_hmg_jira_token_here',
}
```

> **왜 `.env` 파일이 아닌 `env.ts` 파일인가요?**  
> Electron 환경에서 `.env` 파일을 제대로 읽지 못하는 문제가 있어서 TypeScript 파일로 직접 import하는 방식을 사용합니다.

### 4. API 토큰 발급 방법

#### JIRA_API_TOKEN & ATLASSIAN_TOKEN

1. [Atlassian 계정 설정](https://id.atlassian.com/manage-profile/security/api-tokens) 접속
2. "API 토큰 생성" 클릭
3. 토큰 이름 입력 후 생성
4. 생성된 토큰을 `src/utils/env.ts`에 입력

#### HMG_JIRA_TOKEN

1. HMG Jira 개인 설정 페이지 접속
2. API 토큰 생성
3. 생성된 토큰을 `src/utils/env.ts`에 입력

### 5. 개발 모드 실행

```bash
npm run dev
```

앱이 실행되면 자동으로 개발자 도구가 열리고 Hot Reloading이 활성화됩니다.

## 🔧 주요 기능

### Jira 티켓 동기화

- **FEHG → KQ**: FEHG 프로젝트에서 KQ 프로젝트로 동기화
- **FEHG → HB**: FEHG 프로젝트에서 HB 프로젝트로 동기화
- **FEHG → AUTOWAY(HMG)**: FEHG 프로젝트에서 AUTOWAY 프로젝트로 동기화

### 동기화되는 필드

- ✅ 제목 (Summary)
- ✅ 마감일 (Due Date)
- ✅ 시작일 (Start Date)
- ✅ 담당자 (Assignee)
- ✅ 시간 추적 (Time Tracking)
- ✅ 스프린트 (Sprint) - 매핑 가능한 경우

### 슬랙 템플릿

- CPO BO 배포 템플릿
- 소프티어 배포 템플릿
- 원클릭 복사 기능

## 🛠️ 프로젝트 구조

```
fe1-electron/
├── src/                    # TypeScript 소스 코드
│   ├── main.ts            # 메인 프로세스
│   ├── preload.ts         # Preload 스크립트
│   ├── services/          # 서비스 로직
│   └── types/             # 타입 정의
├── renderer/              # 렌더러 프로세스 (UI)
│   ├── index.html         # 메인 HTML
│   ├── styles.css         # 스타일시트
│   └── renderer.js        # 렌더러 스크립트
│   └── utils/             # 유틸리티 함수들
│       └── env.ts         # 환경 변수 (직접 생성)
└── package.json           # 프로젝트 설정
```

## 📋 사용법

### 1. 사용자 선택

1. 앱 실행 후 왼쪽 드롭다운에서 본인 이름 선택
2. 사용 가능한 사용자: 김가빈, 손현지, 박성찬, 서성주, 조한빈, 한준호, 김찬영, 이미진

### 2. 동기화 실행

1. 원하는 동기화 버튼 클릭 (FEHG → KQ/HB/AUTOWAY)
2. 진행 상황을 실시간으로 확인
3. 완료 후 상세 결과 리포트 확인

## 🚨 문제 해결

### "사용자를 선택해주세요" 오류

- 해결: 왼쪽 드롭다운에서 사용자를 먼저 선택하세요

### "Jira API 연결 실패"

- 해결: 인터넷 연결 및 VPN 연결 확인
- `src/utils/env.ts` 파일의 API 토큰이 올바른지 확인

### "연결된 티켓이 없습니다"

- 해결: FEHG 티켓과 대상 티켓이 "Blocks" 관계로 연결되어 있는지 확인

### Node.js 설치 오류

1. [Node.js 공식 웹사이트](https://nodejs.org/)에서 최신 LTS 버전 다운로드
2. 설치 후 `node --version` 및 `npm --version`으로 확인

### 빌드 오류 시

```bash
# 의존성 재설치
rm -rf node_modules package-lock.json
npm install

# 다시 실행
npm run dev
```

## ⚠️ 중요 사항

- **src/utils/env.ts 파일 보안**: API 토큰이 포함된 파일이므로 Git에 커밋하지 마세요
- **Blocks 관계**: 동기화할 티켓들은 반드시 "Blocks" 관계로 연결되어 있어야 합니다
- **권한 필요**: 대상 프로젝트 티켓에 대한 편집 권한이 필요합니다
- **VPN 연결**: HMG Jira 접근 시 회사 VPN 연결 필요

## 🔧 기술 스택

- **Electron**: 크로스 플랫폼 데스크톱 앱
- **TypeScript**: 타입 안전성
- **Jira REST API**: 티켓 조회 및 업데이트
- **Hot Reloading**: 개발 편의성

---

**개발**: FE팀  
**문의**: 문제 발생 시 FE팀으로 연락주세요
