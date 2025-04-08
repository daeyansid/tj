@echo off
cd frontend
echo Installing Tailwind CSS and dependencies...
npm install -D tailwindcss postcss autoprefixer
echo Creating Tailwind configuration files...
npx tailwindcss init -p
echo Done! Restart your development server now.
pause
