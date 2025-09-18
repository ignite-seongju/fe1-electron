#!/bin/bash

echo "🗑️  FE팀 Jira 동기화 도구 완전 삭제 및 재설치 스크립트"
echo "=================================================="

# 1. 기존 앱 삭제
echo "1️⃣  기존 앱 파일 삭제 중..."
sudo rm -rf "/Applications/FE팀 Jira 동기화 도구.app"
echo "✅ 앱 파일 삭제 완료"

# 2. 캐시 및 설정 파일 삭제
echo "2️⃣  캐시 및 설정 파일 삭제 중..."
rm -rf ~/Library/Caches/com.feteam.jira-sync-tool
rm -rf ~/Library/Preferences/com.feteam.jira-sync-tool.plist
rm -rf ~/Library/Application\ Support/FE팀\ Jira\ 동기화\ 도구
rm -rf ~/Library/Application\ Support/fe1-electron-tool
sudo rm -rf /Library/Caches/com.feteam.jira-sync-tool
echo "✅ 캐시 및 설정 파일 삭제 완료"

# 3. LaunchServices 데이터베이스 재구축
echo "3️⃣  시스템 앱 목록 갱신 중..."
/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister -kill -r -domain local -domain system -domain user > /dev/null 2>&1
echo "✅ 시스템 앱 목록 갱신 완료"

# 4. DMG 파일 확인
DMG_FILE="FE팀 Jira 동기화 도구-1.0.0-arm64.dmg"
if [ -f "$DMG_FILE" ]; then
    echo "4️⃣  새 앱 설치 중..."
    
    # DMG 마운트
    hdiutil attach "$DMG_FILE" -quiet
    
    # 앱 복사
    cp -R "/Volumes/FE팀 Jira 동기화 도구 1.0.0/FE팀 Jira 동기화 도구.app" /Applications/
    
    # DMG 언마운트
    hdiutil detach "/Volumes/FE팀 Jira 동기화 도구 1.0.0" -quiet
    
    echo "✅ 새 앱 설치 완료"
else
    echo "⚠️  DMG 파일을 찾을 수 없습니다: $DMG_FILE"
    echo "   현재 디렉토리에 DMG 파일이 있는지 확인해주세요."
fi

# 5. 보안 설정 해제
echo "5️⃣  보안 설정 해제 중..."
if [ -d "/Applications/FE팀 Jira 동기화 도구.app" ]; then
    sudo xattr -rd com.apple.quarantine "/Applications/FE팀 Jira 동기화 도구.app" 2>/dev/null
    chmod +x "/Applications/FE팀 Jira 동기화 도구.app/Contents/MacOS/FE팀 Jira 동기화 도구" 2>/dev/null
    sudo xattr -cr "/Applications/FE팀 Jira 동기화 도구.app" 2>/dev/null
    echo "✅ 보안 설정 해제 완료"
else
    echo "❌ 앱이 설치되지 않았습니다."
    exit 1
fi

# 6. 완료
echo ""
echo "🎉 설치가 완료되었습니다!"
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
fi