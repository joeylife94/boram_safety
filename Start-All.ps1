<#
Start-All.ps1
PowerShell helper to build & start the project's Docker Compose services (db, backend, frontend).
Run this script from anywhere; it will change directory to the script location.
#>

param()

try {
    $ScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
    Set-Location $ScriptRoot
} catch {
    Write-Error "Unable to set working directory to script location: $_"
    exit 1
}

# Check Docker availability
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Error "Docker is not available in PATH. Please install Docker Desktop and ensure 'docker' is on PATH."
    exit 1
}

Write-Host "Using working directory: $ScriptRoot"
Write-Host "Building and starting services via docker-compose..."

# Build and start in detached mode
docker-compose up --build -d
if ($LASTEXITCODE -ne 0) {
    Write-Error "docker-compose up failed with exit code $LASTEXITCODE"
    exit $LASTEXITCODE
}

Write-Host "Services started. Showing container status:"
docker-compose ps

Write-Host "
Access the frontend: http://localhost:3000
Access the backend health: http://localhost:8000/health
Open API docs: http://localhost:8000/docs
Use 'docker-compose logs -f' to follow logs." -ForegroundColor Green
