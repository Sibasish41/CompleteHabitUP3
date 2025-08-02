# HabitUP Application Test Script
param(
    [switch]$Docker,
    [switch]$Local
)

Write-Host "🚀 HabitUP Application Testing Script" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

$backendPath = "C:\Users\sb097\Downloads\HabitUP1-main\HabitUPMigration247-master (1)\HabitUPMigration247-master"
$frontendPath = "C:\Users\sb097\Downloads\HabitUP1-main\HabitUP-master\HabitUP-master"

function Test-Backend {
    Write-Host "`n🔧 Testing Backend..." -ForegroundColor Yellow
    
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3001/health" -Method Get -TimeoutSec 5
        Write-Host "✅ Backend is running:" -ForegroundColor Green
        Write-Host "   Status: $($response.status)" -ForegroundColor White
        Write-Host "   Message: $($response.message)" -ForegroundColor White
        Write-Host "   Mock DB: $($response.mockDatabase)" -ForegroundColor White
        return $true
    }
    catch {
        Write-Host "❌ Backend is not responding" -ForegroundColor Red
        return $false
    }
}

function Test-Frontend {
    Write-Host "`n🎨 Testing Frontend..." -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method Get -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Frontend is running and accessible" -ForegroundColor Green
            return $true
        }
    }
    catch {
        Write-Host "❌ Frontend is not responding" -ForegroundColor Red
        return $false
    }
    return $false
}

function Test-API-Endpoints {
    Write-Host "`n🔌 Testing API Endpoints..." -ForegroundColor Yellow
    
    # Test basic API endpoint
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3001/api/test" -Method Get -TimeoutSec 5
        Write-Host "✅ API Test endpoint working:" -ForegroundColor Green
        Write-Host "   Message: $($response.message)" -ForegroundColor White
    }
    catch {
        Write-Host "❌ API Test endpoint failed" -ForegroundColor Red
    }
}

function Start-Backend {
    Write-Host "`n🔥 Starting Backend Server..." -ForegroundColor Yellow
    Set-Location $backendPath
    
    $env:USE_MOCK_DB = "true"
    $env:NODE_ENV = "development"
    $env:JWT_SECRET = "test_jwt_secret_key_for_testing"
    $env:PORT = "3001"
    $env:CLIENT_URL = "http://localhost:3000"
    
    Write-Host "Starting backend with mock database..." -ForegroundColor White
    Start-Process -NoNewWindow -FilePath "node" -ArgumentList "test-server.js"
    
    # Wait for backend to start
    Write-Host "Waiting for backend to initialize..." -ForegroundColor White
    Start-Sleep -Seconds 8
}

function Start-Frontend {
    Write-Host "`n🎨 Starting Frontend Server..." -ForegroundColor Yellow
    Set-Location $frontendPath
    
    $env:VITE_API_URL = "http://localhost:3001/api"
    $env:VITE_USE_REAL_API = "true"
    
    Write-Host "Starting frontend development server..." -ForegroundColor White
    Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run", "dev"
    
    # Wait for frontend to start
    Write-Host "Waiting for frontend to initialize..." -ForegroundColor White
    Start-Sleep -Seconds 10
}

function Test-Docker {
    Write-Host "`n🐳 Testing Docker Setup..." -ForegroundColor Yellow
    Set-Location "C:\Users\sb097\Downloads\HabitUP1-main"
    
    if (Get-Command docker -ErrorAction SilentlyContinue) {
        Write-Host "✅ Docker is available" -ForegroundColor Green
        
        Write-Host "Building and starting containers..." -ForegroundColor White
        try {
            docker-compose up --build -d
            Start-Sleep -Seconds 15
            
            # Test containerized services
            Test-Backend
            Test-Frontend
            Test-API-Endpoints
        }
        catch {
            Write-Host "❌ Docker setup failed: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    else {
        Write-Host "❌ Docker is not available" -ForegroundColor Red
    }
}

function Show-Results {
    Write-Host "`n📊 Test Results Summary" -ForegroundColor Green
    Write-Host "======================" -ForegroundColor Green
    
    $backendStatus = Test-Backend
    $frontendStatus = Test-Frontend
    
    if ($backendStatus) {
        Test-API-Endpoints
    }
    
    Write-Host "`n🌐 Application URLs:" -ForegroundColor Cyan
    Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
    Write-Host "   Backend Health: http://localhost:3001/health" -ForegroundColor White
    Write-Host "   API Test: http://localhost:3001/api/test" -ForegroundColor White
    
    if ($backendStatus -and $frontendStatus) {
        Write-Host "`n🎉 Application is ready for testing!" -ForegroundColor Green
    } else {
        Write-Host "`n⚠️  Some components need attention" -ForegroundColor Yellow
    }
}

# Main execution
if ($Docker) {
    Test-Docker
} elseif ($Local) {
    Start-Backend
    Start-Frontend
    Show-Results
} else {
    # Default: Test existing running services
    Show-Results
}
