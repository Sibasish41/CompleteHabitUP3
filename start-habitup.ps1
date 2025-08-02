# HabitUP Application Startup Script
Write-Host "🚀 Starting HabitUP Application..." -ForegroundColor Green

# Start Backend Server
Write-Host "🔧 Starting Backend Server on port 3000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\sb097\Downloads\CompleteHabiUP2-master\HabitUPMigration247-master'; Write-Host '🚀 Backend Server Started' -ForegroundColor Green; node index.js"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start Frontend Server
Write-Host "🎨 Starting Frontend Server on port 3001..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\sb097\Downloads\CompleteHabiUP2-master\HabitUP-master'; Write-Host '🎨 Frontend Server Started' -ForegroundColor Green; npm run dev"

# Wait a moment
Start-Sleep -Seconds 2

Write-Host "✅ HabitUP Application is starting up!" -ForegroundColor Green
Write-Host "🌐 Backend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🌐 Frontend: http://localhost:3001" -ForegroundColor Cyan
Write-Host "💡 Health Check: http://localhost:3000/health" -ForegroundColor Cyan

Write-Host "`n📝 Login Credentials:" -ForegroundColor Magenta
Write-Host "👤 Regular Users (from AuthContext):" -ForegroundColor White
Write-Host "   - Adult: adult@habitup.com / password123" -ForegroundColor Gray
Write-Host "   - Child: child@habitup.com / password123" -ForegroundColor Gray
Write-Host "   - Elder: elder@habitup.com / password123" -ForegroundColor Gray
Write-Host "   - Doctor: doctor@habitup.com / password123" -ForegroundColor Gray
Write-Host "👑 Admin: superuser@habitup.com / SuperUser@2024!" -ForegroundColor Yellow

Write-Host "`nPress any key to close this window..." -ForegroundColor DarkGray
$null = $Host.UI.ReadLine()
