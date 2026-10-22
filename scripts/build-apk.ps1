# NagrikSeva AI - 1-Click Android APK Builder
# Builds signed release APK using D-drive Android environment

$ErrorActionPreference = "Stop"

$appDir = Resolve-Path "$PSScriptRoot\.."
$androidDir = Join-Path $appDir "android"
$jdkPath = "D:\Movies and Web se\android-env\Java\jdk-17"
$sdkPath = "D:\Movies and Web se\android-env\Android\Sdk"
$gradlePath = "D:\Movies and Web se\android-env\Gradle"

$env:JAVA_HOME = $jdkPath
$env:ANDROID_HOME = $sdkPath
$env:ANDROID_SDK_ROOT = $sdkPath
$env:GRADLE_USER_HOME = $gradlePath
$env:Path = "$jdkPath\bin;$sdkPath\cmdline-tools\latest\bin;$sdkPath\platform-tools;$env:Path"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " NagrikSeva AI - Android APK Generator   " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

Set-Location $appDir
Write-Host "[1/4] Syncing Capacitor Android assets..." -ForegroundColor Yellow
npx cap sync android

Set-Location $androidDir
Write-Host "[2/4] Compiling Signed Release APK with Gradle..." -ForegroundColor Yellow
.\gradlew.bat assembleRelease

$outputApk = Join-Path $androidDir "app\build\outputs\apk\release\app-release.apk"
$publicApk = Join-Path $appDir "public\download\nagrik-seva-ai.apk"
$rootApk = Join-Path (Split-Path $appDir -Parent) "nagrik-seva-ai.apk"

if (Test-Path $outputApk) {
    Write-Host "[3/4] Copying APK to public download directory..." -ForegroundColor Yellow
    Copy-Item $outputApk $publicApk -Force
    Copy-Item $outputApk $rootApk -Force

    $sizeMb = [math]::Round(((Get-Item $outputApk).Length / 1MB), 2)
    Write-Host "=========================================" -ForegroundColor Green
    Write-Host " BUILD SUCCESSFUL! ($sizeMb MB)         " -ForegroundColor Green
    Write-Host " APK Locations:                         " -ForegroundColor Green
    Write-Host "  -> $publicApk" -ForegroundColor White
    Write-Host "  -> $rootApk" -ForegroundColor White
    Write-Host "=========================================" -ForegroundColor Green
} else {
    Write-Error "Release APK build failed or output not found at: $outputApk"
}
