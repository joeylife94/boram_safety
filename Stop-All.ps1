<#
Stop-All.ps1
PowerShell helper to stop and remove Docker Compose services for this project.
It will remove containers and volumes created by docker-compose.
#>

param()

try {
    $ScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
    Set-Location $ScriptRoot
} catch {
    Write-Error "Unable to set working directory to script location: $_"
    exit 1
}

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Error "Docker is not available in PATH. Please install Docker Desktop and ensure 'docker' is on PATH."
    exit 1
}

Write-Host "Stopping and removing docker-compose services (containers, networks, volumes)..."
docker-compose down -v --remove-orphans
if ($LASTEXITCODE -ne 0) {
    Write-Error "docker-compose down failed with exit code $LASTEXITCODE"
    exit $LASTEXITCODE
}

Write-Host "Services stopped and removed." -ForegroundColor Green
