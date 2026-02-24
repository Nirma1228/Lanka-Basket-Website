# Lanka Basket - Quick Start Script (PowerShell)
# This script will test your Docker setup

Write-Host "🚀 Lanka Basket Quick Start" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed
$dockerInstalled = Get-Command docker -ErrorAction SilentlyContinue
if (-not $dockerInstalled) {
    Write-Host "❌ Docker is not installed. Please install Docker Desktop first." -ForegroundColor Red
    Write-Host "   Download from: https://www.docker.com/products/docker-desktop/" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Docker is installed" -ForegroundColor Green

# Check if Docker is running
$dockerRunning = docker ps 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker Desktop is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Docker Desktop is running" -ForegroundColor Green

# Check if Docker Compose is available
$composeInstalled = Get-Command docker-compose -ErrorAction SilentlyContinue
if (-not $composeInstalled) {
    # Try docker compose (new syntax)
    docker compose version 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Docker Compose is not available." -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Docker Compose is available" -ForegroundColor Green
Write-Host ""

# Start Docker Compose
Write-Host "🔨 Building and starting containers..." -ForegroundColor Yellow
Write-Host "   This may take a few minutes on first run..." -ForegroundColor Gray
Write-Host ""

docker-compose up --build -d

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Containers started successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Container Status:" -ForegroundColor Cyan
    docker-compose ps
    Write-Host ""
    Write-Host "🌐 Access your application:" -ForegroundColor Cyan
    Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
    Write-Host "   Backend:  http://localhost:5000" -ForegroundColor White
    Write-Host "   MongoDB:  mongodb://admin:password@localhost:27017" -ForegroundColor White
    Write-Host ""
    Write-Host "📝 Useful Commands:" -ForegroundColor Cyan
    Write-Host "   View logs:        docker-compose logs -f" -ForegroundColor Gray
    Write-Host "   Stop containers:  docker-compose down" -ForegroundColor Gray
    Write-Host "   Restart:          docker-compose restart" -ForegroundColor Gray
    Write-Host ""
    Write-Host "📚 Next Steps:" -ForegroundColor Cyan
    Write-Host "   1. Open http://localhost:3000 in your browser" -ForegroundColor White
    Write-Host "   2. Read DEVOPS_LEARNING_PATH.md for the full guide" -ForegroundColor White
    Write-Host "   3. Follow KUBERNETES_SETUP.md for Phase 2" -ForegroundColor White
    Write-Host ""
    
    # Optionally open browser
    $openBrowser = Read-Host "Would you like to open the application in your browser? (Y/N)"
    if ($openBrowser -eq 'Y' -or $openBrowser -eq 'y') {
        Start-Process "http://localhost:3000"
    }
} else {
    Write-Host ""
    Write-Host "❌ Failed to start containers" -ForegroundColor Red
    Write-Host "   Check the logs with: docker-compose logs" -ForegroundColor Yellow
    exit 1
}
