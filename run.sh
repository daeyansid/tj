#!/bin/bash

# Start backend server
start_backend() {
  echo "Starting FastAPI backend server..."
  cd backend
  if [ -d "venv" ]; then
    source venv/bin/activate || source venv/Scripts/activate
  else
    echo "Virtual environment not found, please create it first"
  fi
  python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 &
  BACKEND_PID=$!
  echo "Backend server started with PID: $BACKEND_PID"
  echo "Backend available at: http://localhost:8000"
  cd ..
}

# Start frontend development server
start_frontend() {
  echo "Starting Vite React frontend server..."
  cd frontend
  npm run dev -- --host 0.0.0.0 &
  FRONTEND_PID=$!
  echo "Frontend server started with PID: $FRONTEND_PID"
  echo "Frontend available at: http://localhost:5173"
  cd ..
}

# Handle script termination
cleanup() {
  echo "Stopping servers..."
  if [ ! -z "$BACKEND_PID" ]; then
    kill $BACKEND_PID
  fi
  if [ ! -z "$FRONTEND_PID" ]; then
    kill $FRONTEND_PID
  fi
  exit 0
}

# Set up trap for cleanup on script termination
trap cleanup SIGINT SIGTERM

# Start both servers
start_backend
start_frontend

echo "Both servers are running. Press Ctrl+C to stop."

# Keep script running
wait
