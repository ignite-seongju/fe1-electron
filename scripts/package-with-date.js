#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// 현재 날짜를 YYYYMMDD 형식으로 생성
function getCurrentDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

// 현재 시간을 HHMM 형식으로 생성 (선택사항)
function getCurrentTimeString() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}${minutes}`;
}

async function packageWithDate() {
  try {
    const dateString = getCurrentDateString();
    const timeString = getCurrentTimeString();
    
    // 앱 이름에 날짜 포함
    const appName = `FE팀-Jira동기화도구-${dateString}`;
    const releaseDir = `release/${dateString}`;
    
    console.log(`🚀 패키징 시작: ${appName}`);
    console.log(`📅 날짜: ${dateString}`);
    console.log(`⏰ 시간: ${timeString}`);
    console.log(`📁 출력 디렉토리: ${releaseDir}`);
    
    // release/날짜 디렉토리 생성
    const releasePath = path.join(process.cwd(), releaseDir);
    if (!fs.existsSync(releasePath)) {
      fs.mkdirSync(releasePath, { recursive: true });
      console.log(`📁 디렉토리 생성: ${releasePath}`);
    }
    
    // Intel Mac용 패키징 (x64)
    console.log('\n🔧 Intel Mac (x64) 패키징 중...');
    const packageCommandX64 = `electron-packager . "${appName}" --platform=darwin --arch=x64 --out="${releaseDir}" --overwrite --app-version=1.0.${dateString}`;
    execSync(packageCommandX64, { stdio: 'inherit' });
    
    // Apple Silicon Mac용 패키징 (arm64) - 선택사항
    console.log('\n🔧 Apple Silicon Mac (arm64) 패키징 중...');
    const packageCommandArm64 = `electron-packager . "${appName}" --platform=darwin --arch=arm64 --out="${releaseDir}" --overwrite --app-version=1.0.${dateString}`;
    execSync(packageCommandArm64, { stdio: 'inherit' });
    
    // 패키징 완료 후 정보 출력
    console.log('\n✅ 패키징 완료!');
    console.log(`📦 패키지 위치:`);
    console.log(`   - Intel Mac: ${releaseDir}/${appName}-darwin-x64/`);
    console.log(`   - Apple Silicon Mac: ${releaseDir}/${appName}-darwin-arm64/`);
    
    // ZIP 파일 생성 (배포 편의성)
    console.log('\n📦 ZIP 파일 생성 중...');
    
    const zipCommandX64 = `cd "${releaseDir}" && zip -r "${appName}-intel-mac.zip" "${appName}-darwin-x64"`;
    const zipCommandArm64 = `cd "${releaseDir}" && zip -r "${appName}-apple-silicon-mac.zip" "${appName}-darwin-arm64"`;
    
    execSync(zipCommandX64, { stdio: 'inherit' });
    execSync(zipCommandArm64, { stdio: 'inherit' });
    
    console.log('\n🎉 모든 패키징 작업 완료!');
    console.log(`📁 최종 결과물 위치: ${releaseDir}/`);
    console.log(`📋 배포용 ZIP 파일:`);
    console.log(`   - ${appName}-intel-mac.zip (Intel Mac용)`);
    console.log(`   - ${appName}-apple-silicon-mac.zip (Apple Silicon Mac용)`);
    
    // 버전 정보 파일 생성
    const versionInfo = {
      version: `1.0.${dateString}`,
      buildDate: new Date().toISOString(),
      buildTime: `${dateString}-${timeString}`,
      appName: appName,
      description: 'FE팀 Jira 동기화 도구',
      author: 'FE Team',
      platforms: ['darwin-x64', 'darwin-arm64']
    };
    
    fs.writeFileSync(
      path.join(releaseDir, 'version.json'), 
      JSON.stringify(versionInfo, null, 2)
    );
    
    console.log(`📄 버전 정보 파일 생성: ${releaseDir}/version.json`);
    
  } catch (error) {
    console.error('❌ 패키징 실패:', error.message);
    process.exit(1);
  }
}

// 스크립트 실행
if (require.main === module) {
  packageWithDate();
}

module.exports = { packageWithDate, getCurrentDateString };
