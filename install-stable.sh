#!/bin/bash

echo "🚀 FE팀 Jira 동기화 도구 - 안정화 버전 설치 스크립트"
echo "=================================================="
echo "✨ V8 크래시 문제가 해결된 최신 안정화 버전입니다."
echo ""

# 1. 기존 앱 삭제
echo "1️⃣  기존 앱 파일 삭제 중..."
sudo rm -rf "/Applications/FE팀 Jira 동기화 도구.app"
echo "✅ 기존 앱 삭제 완료"

# 2. 캐시 및 설정 파일 삭제
echo "2️⃣  캐시 및 설정 파일 삭제 중..."
rm -rf ~/Library/Caches/com.feteam.jira-sync-tool
rm -rf ~/Library/Preferences/com.feteam.jira-sync-tool.plist
rm -rf ~/Library/Application\ Support/FE팀\ Jira\ 동기화\ 도구
rm -rf ~/Library/Application\ Support/fe1-electron-tool
sudo rm -rf /Library/Caches/com.feteam.jira-sync-tool 2>/dev/null
echo "✅ 캐시 및 설정 파일 삭제 완료"

# 3. LaunchServices 데이터베이스 재구축
echo "3️⃣  시스템 앱 목록 갱신 중..."
/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister -kill -r -domain local -domain system -domain user > /dev/null 2>&1
echo "✅ 시스템 앱 목록 갱신 완료"

# 4. DMG 파일 확인 및 설치
DMG_FILE="FE팀 Jira 동기화 도구-1.0.0-arm64-new.dmg"
if [ -f "$DMG_FILE" ]; then
    echo "4️⃣  새 앱 설치 중..."
    
    # DMG 마운트
    MOUNT_POINT=$(hdiutil attach "$DMG_FILE" | grep "/Volumes" | awk '{print $3}')
    
    if [ -z "$MOUNT_POINT" ]; then
        echo "❌ DMG 마운트 실패"
        exit 1
    fi
    
    # 앱 복사
    cp -R "$MOUNT_POINT/FE팀 Jira 동기화 도구.app" /Applications/
    
    # DMG 언마운트
    hdiutil detach "$MOUNT_POINT" -quiet
    
    echo "✅ 새 앱 설치 완료"
else
    echo "⚠️  DMG 파일을 찾을 수 없습니다: $DMG_FILE"
    echo "   현재 디렉토리에 DMG 파일이 있는지 확인해주세요."
    exit 1
fi

# 5. entitlements 적용 (V8 크래시 방지를 위한 핵심 단계)
echo "5️⃣  V8 엔진 안정화 권한 적용 중..."
if [ -d "/Applications/FE팀 Jira 동기화 도구.app" ]; then
    # entitlements 파일 생성
    cat > /tmp/entitlements.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.security.app-sandbox</key><false/>
    <key>com.apple.security.cs.allow-jit</key><true/>
    <key>com.apple.security.cs.allow-unsigned-executable-memory</key><true/>
    <key>com.apple.security.cs.disable-library-validation</key><true/>
    <key>com.apple.security.network.client</key><true/>
    <key>com.apple.security.network.server</key><true/>
    <key>com.apple.security.files.user-selected.read-only</key><true/>
    <key>com.apple.security.files.user-selected.read-write</key><true/>
    <key>com.apple.security.files.downloads.read-write</key><true/>
    <key>com.apple.security.automation.apple-events</key><true/>
</dict>
</plist>
EOF
    
    # entitlements를 포함한 ad-hoc 서명 적용
    sudo codesign --force --deep --sign - --entitlements /tmp/entitlements.plist "/Applications/FE팀 Jira 동기화 도구.app" 2>/dev/null
    
    # quarantine 속성 제거
    sudo xattr -rd com.apple.quarantine "/Applications/FE팀 Jira 동기화 도구.app" 2>/dev/null
    
    # 실행 권한 설정
    chmod +x "/Applications/FE팀 Jira 동기화 도구.app/Contents/MacOS/FE팀 Jira 동기화 도구" 2>/dev/null
    
    # 임시 파일 정리
    rm -f /tmp/entitlements.plist
    
    echo "✅ V8 엔진 안정화 권한 적용 완료"
else
    echo "❌ 앱이 설치되지 않았습니다."
    exit 1
fi

# 6. 설치 완료
echo ""
echo "🎉 설치가 완료되었습니다!"
echo ""
echo "📋 주요 개선사항:"
echo "   ✅ Electron v38.1.2로 업그레이드 (macOS 호환성 개선)"
echo "   ✅ V8 JIT 권한 적용 (크래시 방지)"
echo "   ✅ ARM64 네이티브 지원 (M1/M2 Mac 최적화)"
echo "   ✅ SSL 인증서 문제 해결"
echo "   ✅ 최적화된 안정화 플래그 적용"
echo ""
echo "📋 다음 단계:"
echo "   1. Launchpad 또는 Applications 폴더에서 앱을 실행하세요"
echo "   2. 처음 실행 시 '열기' 버튼을 클릭하세요"
echo "   3. 이후부터는 정상적으로 실행됩니다"
echo ""

# 7. 앱 실행 옵션
read -p "🚀 지금 앱을 실행하시겠습니까? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🎯 앱을 실행합니다..."
    open "/Applications/FE팀 Jira 동기화 도구.app"
    
    # 3초 후 실행 상태 확인
    sleep 3
    if pgrep -f "FE팀 Jira 동기화 도구" > /dev/null; then
        echo "✅ 앱이 성공적으로 실행되었습니다!"
    else
        echo "⚠️  앱 실행을 확인할 수 없습니다. 수동으로 확인해주세요."
    fi
fi

echo ""
echo "🔧 문제가 발생하면:"
echo "   - 터미널에서 앱 실행: open '/Applications/FE팀 Jira 동기화 도구.app'"
echo "   - 로그 확인: Console.app에서 'FE팀' 검색"
echo "   - 개발팀 문의: 상세한 오류 메시지와 함께"