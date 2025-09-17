# 📱 Electron 앱 업데이트 가이드

## 🤔 **A 버전에서 B 버전으로 업데이트할 때 어떻게 해야 하나요?**

### 현재 상황 (수동 업데이트 방식)

현재 우리 앱은 **수동 업데이트 방식**을 사용합니다. 즉, 새 버전이 나오면:

1. **기존 앱 삭제**: A 버전을 Applications 폴더에서 휴지통으로 이동
2. **새 앱 설치**: B 버전을 다운로드하여 Applications 폴더에 설치

### 🔄 **업데이트 프로세스**

#### **개발자 (배포자) 작업**
```bash
# 1. 새 버전 패키징 (날짜 포함)
npm run package:dated

# 2. 생성된 ZIP 파일을 팀원들에게 공유
# release/20240917/FE팀-Jira동기화도구-20240917-intel-mac.zip
# release/20240917/FE팀-Jira동기화도구-20240917-apple-silicon-mac.zip
```

#### **팀원 (사용자) 작업**
1. **기존 앱 종료**: 실행 중인 앱 완전 종료
2. **기존 앱 삭제**: Applications 폴더에서 기존 앱 삭제
3. **새 앱 설치**: 
   - ZIP 파일 다운로드
   - 압축 해제
   - `.app` 파일을 Applications 폴더로 드래그
4. **새 앱 실행**: Applications에서 새 버전 실행

---

## 🚀 **자동 업데이트 구현 방법 (향후 개선)**

### **Option 1: electron-updater 사용**
```bash
npm install electron-updater
```

**장점**: 
- GitHub Releases와 연동 가능
- 백그라운드 다운로드
- 자동 설치 및 재시작

**단점**: 
- 코드 서명 필요 (Apple Developer 계정 필요)
- 초기 설정 복잡

### **Option 2: 간단한 알림 시스템**
```bash
# 새 버전 확인 API 구현
# 사용자에게 업데이트 알림만 표시
# 다운로드 링크 제공
```

**장점**: 
- 구현이 간단
- 코드 서명 불필요

**단점**: 
- 여전히 수동 설치 필요

---

## 📋 **현재 버전 관리 시스템**

### **버전 명명 규칙**
- **형식**: `FE팀-Jira동기화도구-YYYYMMDD`
- **예시**: `FE팀-Jira동기화도구-20240917`

### **생성되는 파일들**
```
release/20240917/
├── FE팀-Jira동기화도구-20240917-darwin-x64/          # Intel Mac 앱
├── FE팀-Jira동기화도구-20240917-darwin-arm64/        # Apple Silicon Mac 앱
├── FE팀-Jira동기화도구-20240917-intel-mac.zip        # Intel Mac ZIP
├── FE팀-Jira동기화도구-20240917-apple-silicon-mac.zip # Apple Silicon ZIP
└── version.json                                        # 버전 정보
```

### **version.json 내용**
```json
{
  "version": "1.0.20240917",
  "buildDate": "2024-09-17T08:30:00.000Z",
  "buildTime": "20240917-0830",
  "appName": "FE팀-Jira동기화도구-20240917",
  "description": "FE팀 Jira 동기화 도구",
  "author": "FE Team",
  "platforms": ["darwin-x64", "darwin-arm64"]
}
```

---

## 🛠️ **배포 명령어**

### **기본 패키징**
```bash
npm run package         # 기본 패키징 (덮어쓰기)
npm run package:dated   # 날짜 포함 패키징 (권장)
```

### **플랫폼별 패키징**
```bash
npm run package:mac-universal  # Intel + Apple Silicon 동시
```

---

## 💡 **팀원들을 위한 설치 가이드**

### **처음 설치**
1. 개발자로부터 ZIP 파일 받기
2. ZIP 파일 더블클릭하여 압축 해제
3. `.app` 파일을 Applications 폴더로 드래그
4. Applications에서 앱 실행
5. "신뢰할 수 없는 개발자" 경고 시 → 시스템 환경설정 → 보안 및 개인정보보호 → "확인 없이 열기"

### **업데이트 설치**
1. 기존 앱 완전 종료
2. Applications에서 기존 앱 삭제 (휴지통으로)
3. 새 ZIP 파일 다운로드 및 압축 해제
4. 새 `.app` 파일을 Applications로 이동
5. 새 버전 실행

### **Mac별 다운로드 파일**
- **Intel Mac (2019년 이전)**: `*-intel-mac.zip`
- **Apple Silicon Mac (M1/M2/M3)**: `*-apple-silicon-mac.zip`
- **확인 방법**: Apple 메뉴 → 이 Mac에 관하여 → 프로세서 확인

---

## 🔮 **향후 개선 계획**

1. **자동 업데이트 시스템 구축**
   - electron-updater 도입
   - GitHub Releases 연동

2. **코드 서명 적용**
   - Apple Developer 계정 필요
   - 보안 경고 없는 설치

3. **업데이트 알림 기능**
   - 앱 내에서 새 버전 확인
   - 원클릭 업데이트

4. **설정 데이터 보존**
   - 업데이트 시 사용자 설정 유지
   - 데이터 마이그레이션

---

## ❓ **FAQ**

**Q: 업데이트하면 기존 설정이 사라지나요?**
A: 현재는 앱 내부에 설정을 저장하지 않으므로 문제없습니다. 향후 설정 기능 추가 시 별도 처리 예정입니다.

**Q: Intel Mac과 Apple Silicon Mac을 구분해야 하나요?**
A: 네, 성능 최적화를 위해 각각의 아키텍처에 맞는 버전을 사용하는 것이 좋습니다.

**Q: 이전 버전을 삭제하지 않고 새 버전을 설치하면?**
A: 두 버전이 모두 Applications에 존재하게 되어 혼란을 야기할 수 있습니다. 이전 버전은 삭제하는 것을 권장합니다.
