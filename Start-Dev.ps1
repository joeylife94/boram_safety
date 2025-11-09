<#
Start-Dev.ps1
PowerShell helper for local development.
What it does:
 - If needed, copies .env.example -> .env
 - Starts only the `db` service via docker-compose
 - Creates/activates backend virtualenv and installs Python deps (if needed)
 - Opens two new PowerShell windows:
    * Backend: activates venv and runs uvicorn --reload
    * Frontend: runs `npm run dev` in `frontend`

Run this script from anywhere. It will switch to the repository root automatically.
#>

param()

function Abort($msg) {
    Write-Error $msg
    exit 1
}

try {
    $ScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
    Set-Location $ScriptRoot
} catch {
    Abort "Unable to set working directory to script location: $_"
}

Write-Host "Working directory: $ScriptRoot"

# Ensure .env exists
if (-not (Test-Path "$ScriptRoot\.env")) {
    if (Test-Path "$ScriptRoot\.env.example") {
        Copy-Item "$ScriptRoot\.env.example" "$ScriptRoot\.env"
        Write-Host ".env not found — copied from .env.example. Edit .env if you want to change credentials." -ForegroundColor Yellow
    } else {
        Write-Host ".env and .env.example not found. Creating minimal .env." -ForegroundColor Yellow
        @"
DB_USER=postgres
DB_PASSWORD=postgrespassword
DB_NAME=boram_safety
DB_HOST=localhost
DB_PORT=5434
ENVIRONMENT=development
FRONTEND_URL=http://localhost:3000
"@ | Out-File -Encoding utf8 .env
    }
} else {
    Write-Host ".env file exists. Using it." -ForegroundColor Green
}

# Check Docker
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Warning "Docker not found in PATH. Docker is required to start the Postgres DB service."
} else {
    Write-Host "Starting Postgres (docker-compose db)..."
    docker-compose up -d db
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "docker-compose up returned exit code $LASTEXITCODE. You can start DB manually with 'docker-compose up -d db'."
    }
}

# Backend setup
$BackendPath = Join-Path $ScriptRoot 'backend'
if (-not (Test-Path $BackendPath)) { Abort "Backend folder not found at $BackendPath" }

# Create venv if missing
if (-not (Test-Path (Join-Path $BackendPath '.venv'))) {
    if (-not (Get-Command python -ErrorAction SilentlyContinue)) { Write-Warning "Python not found in PATH. Please install Python 3.11+ or adjust PATH." }
    else {
        Write-Host "Creating virtualenv for backend..."
        Push-Location $BackendPath
        python -m venv .venv
        Pop-Location
    }
}

# Install requirements (runs in-place; may take time)
Write-Host "Installing backend Python dependencies (if needed)..."
try {
    Push-Location $BackendPath
    $Activate = Join-Path $BackendPath ".venv\Scripts\Activate.ps1"
    if (Test-Path $Activate) {
        # Use a temporary process to run pip install so main script doesn't stall
        $pipCmd = "& '${Activate}'; pip install --upgrade pip; pip install -r requirements.txt"
        Write-Host "Running python dependency install in a new pwsh window (visible)."
        Start-Process -FilePath powershell -ArgumentList '-NoExit','-Command', $pipCmd -WindowStyle Normal
        Start-Sleep -Seconds 2
    } else {
        Write-Warning "Virtualenv activate script not found. Skipping pip install."
    }
} finally { Pop-Location }

# Start backend in new PowerShell window
Write-Host "Starting backend (uvicorn) in new PowerShell window..."
$backendCmd = "Set-Location '$BackendPath'; & '.\\.venv\\Scripts\\Activate.ps1'; uvicorn main:app --reload --host 0.0.0.0 --port 8000"
Start-Process -FilePath powershell -ArgumentList '-NoExit','-Command', $backendCmd -WindowStyle Normal

# Frontend setup and start
$FrontendPath = Join-Path $ScriptRoot 'frontend'
if (-not (Test-Path $FrontendPath)) { Abort "Frontend folder not found at $FrontendPath" }

Write-Host "Preparing frontend (npm install if needed) and starting dev server in new PowerShell window..."
try {
    Push-Location $FrontendPath
    if (-not (Test-Path (Join-Path $FrontendPath 'node_modules'))) {
        if (-not (Get-Command npm -ErrorAction SilentlyContinue)) { Write-Warning "npm not found in PATH. Please install Node.js/npm." }
        else {
            # Run npm install in its own window so user can watch progress
            $npmInstallCmd = "Set-Location '$FrontendPath'; npm install"
            Start-Process -FilePath powershell -ArgumentList '-NoExit','-Command', $npmInstallCmd -WindowStyle Normal
            Start-Sleep -Seconds 2
        }
    }
} finally { Pop-Location }

# Start frontend dev server in new window
$frontendCmd = "Set-Location '$FrontendPath'; npm run dev"
Start-Process -FilePath powershell -ArgumentList '-NoExit','-Command', $frontendCmd -WindowStyle Normal

Write-Host "Started backend and frontend in new windows. Backend: http://localhost:8000 (docs /health). Frontend: http://localhost:3000" -ForegroundColor Green
