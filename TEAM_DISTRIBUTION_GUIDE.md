# 🚀 FE팀 Jira 동기화 도구 - 안정화 버전 배포 가이드

## 📋 **개선사항 요약**

### ✅ **해결된 문제들**

- **V8 엔진 크래시 (EXC_BREAKPOINT/SIGTRAP)** 완전 해결
- **macOS Gatekeeper 호환성** 개선
- **ARM64 네이티브 지원** (M1/M2 Mac 최적화)
- **SSL 인증서 문제** 해결
- **Electron 버전 업그레이드** (v28 → v38.1.2)

### 🔧 **기술적 개선사항**

- **JIT 권한 적용**: V8 JavaScript 엔진 안정화
- **Hardened Runtime**: 보안 강화된 실행 환경
- **최적화된 entitlements**: 필요한 권한만 선별 적용
- **안정화된 명령행 플래그**: 불필요한 플래그 제거

---

## 📦 **배포 파일**

### **파일 목록**

```
📁 배포 패키지/
├── 📄 FE팀 Jira 동기화 도구-1.0.0-arm64-new.dmg  (ARM64 버전 - 권장)
├── 📄 install-stable.sh                           (자동 설치 스크립트)
└── 📄 TEAM_DISTRIBUTION_GUIDE.md                  (이 가이드)
```

### **파일 크기**

- **DMG 파일**: ~110MB (이전 3GB → 110MB로 대폭 감소)
- **설치 후 크기**: ~300MB

---

## 🛠️ **설치 방법**

### **방법 1: 자동 설치 (권장) 🌟**

1. **파일 다운로드**

   ```bash
   # 배포 패키지를 다운로드 받은 폴더로 이동
   cd ~/Downloads/fe-jira-tool
   ```

2. **자동 설치 실행**

   ```bash
   # 실행 권한 부여
   chmod +x install-stable.sh

   # 설치 실행
   ./install-stable.sh
   ```

3. **관리자 비밀번호 입력**
   - 기존 앱 삭제 시 요구됨
   - 권한 적용 시 요구됨

### **방법 2: 수동 설치**

1. **기존 앱 삭제** (있는 경우)

   ```bash
   sudo rm -rf "/Applications/FE팀 Jira 동기화 도구.app"
   ```

2. **DMG 마운트 및 설치**

   ```bash
   # DMG 마운트
   open "FE팀 Jira 동기화 도구-1.0.0-arm64-new.dmg"

   # Applications 폴더로 드래그 또는 터미널 복사
   cp -R "/Volumes/FE팀 Jira 동기화 도구 1.0.0-arm64/FE팀 Jira 동기화 도구.app" /Applications/
   ```

3. **보안 설정 적용**

   ```bash
   # entitlements 적용 (V8 크래시 방지)
   sudo codesign --force --deep --sign - --entitlements entitlements.mac.plist "/Applications/FE팀 Jira 동기화 도구.app"

   # quarantine 제거
   sudo xattr -rd com.apple.quarantine "/Applications/FE팀 Jira 동기화 도구.app"
   ```

---

## 🔧 **환경 설정**

### **.env 파일 설정**

앱 실행 후 다음 환경변수들을 설정해야 합니다:

```env
# Ignite Jira (REST API v3)
ATLASSIAN_TOKEN=your_atlassian_token_here
JIRA_API_TOKEN=your_jira_api_token_here

# HMG Jira (REST API v2)
HMG_JIRA_TOKEN=your_hmg_jira_token_here

# 기타 (선택사항)
SLACK_BOT_TOKEN=your_slack_token_here
GITHUB_TOKEN=your_github_token_here
GITLAB_TOKEN=your_gitlab_token_here
GITLAB_TOKEN_PERSONAL=your_personal_gitlab_token_here
PORT=3000
```

### **토큰 발급 방법**

1. **ATLASSIAN_TOKEN**: Atlassian 계정 → API 토큰 생성
2. **HMG_JIRA_TOKEN**: HMG Jira → 개인 설정 → API 토큰

---

## 🚀 **실행 및 사용법**

### **첫 실행**

1. **Launchpad** 또는 **Applications 폴더**에서 앱 실행
2. macOS 보안 경고 시 **"열기"** 클릭
3. 환경변수 설정 후 기능 사용

### **주요 기능**

- **🔗 FEHG → HMG(AUTOWAY) 에픽 생성**
- **📋 FEHG 에픽 하위 티켓들 조회**
- **🔄 FEHG 에픽 하위 티켓과 연결된 티켓 생성**
- **🧪 FEHG → HB 동기화**

---

## 🆘 **문제 해결**

### **일반적인 문제**

#### 1. **앱이 실행되지 않음**

```bash
# 터미널에서 직접 실행하여 오류 확인
open "/Applications/FE팀 Jira 동기화 도구.app"

# 또는 실행 파일 직접 실행
"/Applications/FE팀 Jira 동기화 도구.app/Contents/MacOS/FE팀 Jira 동기화 도구"
```

#### 2. **"손상된 앱" 오류**

```bash
# quarantine 속성 제거
sudo xattr -rd com.apple.quarantine "/Applications/FE팀 Jira 동기화 도구.app"
```

#### 3. **권한 오류**

```bash
# 실행 권한 설정
chmod +x "/Applications/FE팀 Jira 동기화 도구.app/Contents/MacOS/FE팀 Jira 동기화 도구"
```

#### 4. **V8 엔진 크래시 (이전 버전)**

- ✅ **해결됨**: 새 버전에서는 JIT 권한이 적용되어 크래시하지 않습니다.

### **로그 확인 방법**

1. **Console.app** 실행
2. **"FE팀"** 또는 **"Electron"** 검색
3. 오류 메시지 확인 후 개발팀 문의

---

## 📞 **지원 및 문의**

### **개발팀 문의 시 포함할 정보**

1. **macOS 버전**: `sw_vers`
2. **Mac 모델**: Apple Silicon (M1/M2) 또는 Intel
3. **오류 메시지**: 정확한 오류 내용
4. **재현 단계**: 문제가 발생하는 정확한 단계
5. **Console 로그**: Console.app에서 확인한 오류 로그

### **알려진 제한사항**

- **Intel Mac**: Rosetta를 통해 실행되므로 성능이 다소 떨어질 수 있음
- **macOS 버전**: macOS 11.0 이상 권장
- **네트워크**: 회사 VPN 연결 필요 (HMG Jira 접근)

---

## 🔄 **업데이트 정책**

### **자동 업데이트**

- 현재 자동 업데이트 기능 없음
- 새 버전 배포 시 수동 설치 필요

### **버전 확인**

- 앱 실행 후 **정보** 메뉴에서 버전 확인 가능
- 현재 버전: **1.0.0** (안정화 버전)

---

## 📈 **성능 최적화**

### **권장 시스템 사양**

- **macOS**: 11.0 이상
- **RAM**: 8GB 이상
- **저장공간**: 1GB 이상 여유공간
- **네트워크**: 안정적인 인터넷 연결

### **최적 사용 환경**

- **Apple Silicon Mac** (M1/M2/M3)
- **macOS Ventura (13.0) 이상**
- **회사 네트워크 또는 VPN 연결**

---

_📅 마지막 업데이트: 2025년 9월 18일_  
_🔧 버전: 1.0.0 (안정화)_  
_👨‍💻 개발: FE팀_
