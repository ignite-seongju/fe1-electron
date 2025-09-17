# FE팀 Jira 동기화 도구 - 배포 가이드

## 📦 배포된 파일들

패키징이 완료되면 `release/` 폴더에 다음과 같은 파일들이 생성됩니다:

### macOS
- `release/FE팀-Jira동기화도구-darwin-x64/FE팀-Jira동기화도구.app/`
  - 바로 실행 가능한 macOS 앱

### Windows  
- `release/FE팀-Jira동기화도구-win32-x64/FE팀-Jira동기화도구.exe`
  - 바로 실행 가능한 Windows 실행 파일

### Linux
- `release/FE팀-Jira동기화도구-linux-x64/FE팀-Jira동기화도구`
  - 바로 실행 가능한 Linux 실행 파일

## 🚀 다른 PC에 설치하는 방법

### 1. 간단한 복사 방식 (권장)

**macOS:**
```bash
# release 폴더를 다른 Mac으로 복사
scp -r release/FE팀-Jira동기화도구-darwin-x64/ user@target-mac:/Applications/
```

**Windows:**
```bash
# release 폴더를 다른 Windows PC로 복사
# 또는 USB/네트워크 드라이브를 통해 복사
```

### 2. 압축 파일로 배포

```bash
# macOS용 압축
cd release
zip -r FE팀-Jira동기화도구-macOS.zip FE팀-Jira동기화도구-darwin-x64/

# Windows용 압축
zip -r FE팀-Jira동기화도구-Windows.zip FE팀-Jira동기화도구-win32-x64/
```

## 💻 사용자 설치 가이드

### macOS 사용자
1. `FE팀-Jira동기화도구.app`을 Applications 폴더로 이동
2. 처음 실행 시 "개발자를 확인할 수 없습니다" 경고가 나올 수 있음
3. 시스템 환경설정 > 보안 및 개인 정보 보호 > 일반 > "확인 없이 열기" 클릭

### Windows 사용자
1. `FE팀-Jira동기화도구.exe` 파일을 원하는 폴더에 복사
2. 바로 실행 가능 (설치 불필요)
3. Windows Defender에서 경고가 나올 수 있음 → "추가 정보" > "실행" 클릭

### Linux 사용자
1. 실행 권한 부여: `chmod +x FE팀-Jira동기화도구`
2. 실행: `./FE팀-Jira동기화도구`

## 🔧 개발자용 빌드 명령어

```bash
# 개발 환경 실행
npm run dev

# 현재 플랫폼용 패키징
npm run package

# 특정 플랫폼용 패키징
npm run package:win    # Windows
npm run package:linux  # Linux

# 모든 플랫폼용 (크로스 플랫폼 빌드)
npm run package:win && npm run package:linux
```

## 📋 필요 조건

### 사용자 PC
- **macOS**: macOS 10.13 이상
- **Windows**: Windows 10 이상 (64-bit)
- **Linux**: Ubuntu 18.04 이상 또는 동등한 배포판

### 네트워크
- Jira API 접근을 위한 인터넷 연결
- 회사 VPN 연결 (필요한 경우)

## 🚨 주의사항

1. **API 토큰 보안**: 
   - 현재 코드에 하드코딩된 API 토큰이 있습니다
   - 배포 전에 환경변수나 설정 파일로 분리 권장

2. **사용자별 설정**:
   - 각 사용자는 자신의 Jira 계정 정보로 설정 필요
   - 사용자 매핑 정보 업데이트 필요할 수 있음

3. **권한**:
   - Jira 프로젝트에 대한 읽기/쓰기 권한 필요
   - 동기화할 필드들에 대한 편집 권한 필요

## 🔄 업데이트 방법

1. 새 버전 빌드 후 기존 파일 교체
2. 사용자에게 새 버전 배포
3. 설정이나 데이터는 보통 유지됨

## 📞 지원

문제 발생 시:
1. 개발자 콘솔 확인 (Cmd/Ctrl + Shift + I)
2. 네트워크 연결 상태 확인
3. Jira API 토큰 유효성 확인
4. FE팀에 문의
