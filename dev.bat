@echo off

where npm --version >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo npm not found!
  exit /b 1
)

where mosquitto -h >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo mosquitto not found!
  exit /b 1
)

echo Starting MQTT broker (RED)
start cmd /k "color 4F && mosquitto.exe -v"
echo Starting development server (BLUE)
start cmd /k "color 1F && npm run server-dev"
echo Starting development web app (PURPLE)
start cmd /k "color 5F && npm run app-dev"

echo Success
