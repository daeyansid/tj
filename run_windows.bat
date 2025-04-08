@echo off
REM Windows batch script for running the token-based authentication system

echo Starting Token-Based Authentication System...
echo.

REM Set up backend environment if needed
echo Checking backend environment...
cd backend

IF NOT EXIST venv (
  echo Creating virtual environment...
  python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing requirements...
pip install -r requirements.txt
echo.

REM Create two separate command windows for frontend and backend
echo Starting FastAPI backend server...
start cmd /k "cd backend && call venv\Scripts\activate.bat && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000"

echo Starting Vite React frontend server...
start cmd /k "cd frontend && npm run dev"

echo.
echo Both servers should be starting in separate windows.
echo Backend will be available at: http://localhost:8000
echo Frontend will be available at: http://localhost:5173
echo.
echo Press any key to exit this window...
pause > nul
