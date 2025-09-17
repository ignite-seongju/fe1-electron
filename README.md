# FE팀 Electron 도구

FE팀의 개발 효율성을 높이기 위한 Electron 기반 데스크톱 애플리케이션입니다.

## 🚀 시작하기

### 필요 사항

- Node.js (v18 이상 권장)
- npm 또는 yarn

### 설치

```bash
# 의존성 설치
npm install

# 또는 yarn 사용
yarn install
```

### 환경변수 설정

Jira API 토큰이 필요합니다. 프로젝트 루트에 `.env` 파일을 생성하세요:

```bash
# .env 파일 생성
touch .env
```

`.env` 파일에 다음 내용을 추가:

```env
# Jira API 토큰들
JIRA_API_TOKEN=your_jira_api_token_here
ATLASSIAN_TOKEN=your_atlassian_token_here
```

**토큰 발급 방법:**
1. [Atlassian 계정 설정](https://id.atlassian.com/manage-profile/security/api-tokens)에 접속
2. "API 토큰 생성" 클릭
3. 토큰 이름 입력 후 생성
4. 생성된 토큰을 `.env` 파일에 입력

⚠️ **중요:** `.env` 파일은 Git에 커밋되지 않으므로 각 PC에서 별도로 설정해야 합니다.

### 개발 모드 실행

```bash
# Hot Reloading과 함께 개발 모드 실행
npm run dev

# 또는 기본 개발 모드
npm run start
```

### 빌드

```bash
# TypeScript 빌드
npm run build

# 빌드 후 실행
npm run start
```

## 🛠️ 프로젝트 구조

```
fe1-electron/
├── src/                    # TypeScript 소스 코드
│   ├── main.ts            # 메인 프로세스
│   └── preload.ts         # Preload 스크립트
├── renderer/              # 렌더러 프로세스 (UI)
│   ├── index.html         # 메인 HTML
│   ├── styles.css         # 스타일시트
│   └── renderer.js        # 렌더러 스크립트
├── dist/                  # 빌드된 파일들
├── package.json           # 프로젝트 설정
└── tsconfig.json          # TypeScript 설정
```

## 🔧 주요 기능

- ✅ TypeScript 지원
- ✅ Hot Reloading (개발 모드)
- ✅ 보안이 강화된 IPC 통신
- ✅ 모던한 UI/UX
- ✅ 개발자 도구 자동 열기 (개발 모드)

## 📝 개발 가이드

### 새로운 기능 추가

1. **메인 프로세스**: `src/main.ts`에서 IPC 핸들러 추가
2. **렌더러 프로세스**: `renderer/renderer.js`에서 UI 로직 추가
3. **스타일링**: `renderer/styles.css`에서 스타일 수정

### Hot Reloading

개발 모드에서는 파일 변경 시 자동으로 애플리케이션이 재시작됩니다:

- TypeScript 파일 변경: 자동 컴파일 후 재시작
- HTML/CSS/JS 파일 변경: 즉시 재로드

## 🎯 다음 단계

- [ ] 팀 전용 기능 추가
- [ ] 설정 관리 시스템
- [ ] 플러그인 시스템
- [ ] 자동 업데이트 기능

## 🐛 문제 해결

### Node.js가 설치되지 않은 경우

1. [Node.js 공식 웹사이트](https://nodejs.org/)에서 최신 LTS 버전 다운로드
2. 설치 후 터미널에서 `node --version` 및 `npm --version` 확인

### 빌드 오류가 발생하는 경우

```bash
# 의존성 재설치
rm -rf node_modules package-lock.json
npm install

# 빌드 디렉토리 정리
npm run clean
npm run build
```
