@echo off
echo.
echo ========================================
echo   City Real Space - Git Push + Deploy
echo ========================================
echo.

:: Stage all changes
git add -A

:: Commit with message (use argument or default)
if "%~1"=="" (
  git commit -m "update: site changes"
) else (
  git commit -m "%~1"
)

:: Push to GitHub
echo.
echo [1/2] Pushing to GitHub...
git push https://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@github.com/dalsaniyameet/city-real-space.git main

:: Trigger Vercel Deploy Hook
echo.
echo [2/2] Triggering Vercel Deploy...
curl -X POST "https://api.vercel.com/v1/integrations/deploy/prj_vAw1NwdDz11QMX0fu4giTVv3GAEb/yAVK36SiFY"

echo.
echo ========================================
echo   Done! Live in 2-3 minutes
echo   https://city-real-space.vercel.app
echo ========================================
echo.
pause
