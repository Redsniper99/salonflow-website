Write-Host "Starting Project Environment Check..." -ForegroundColor Cyan

# Check Node.js
try {
    $nodeVersion = node -v
    Write-Host "Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: Node.js is not installed or not in PATH." -ForegroundColor Red
    exit 1
}

# Check NPM
try {
    $npmVersion = npm -v
    Write-Host "NPM is installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: NPM is not installed or not in PATH." -ForegroundColor Red
    exit 1
}

# Check node_modules
if (Test-Path "node_modules") {
    Write-Host "node_modules directory exists." -ForegroundColor Green
} else {
    Write-Host "Warning: node_modules not found. You need to install dependencies." -ForegroundColor Yellow
    Write-Host "Run 'npm install' to install dependencies."
}

# Check .env.local
if (Test-Path ".env.local") {
    Write-Host ".env.local exists." -ForegroundColor Green
} else {
    Write-Host "Warning: .env.local file not found. You might need it for environment variables." -ForegroundColor Yellow
}

Write-Host "Basic checks passed. You can try running the project with 'npm run dev'." -ForegroundColor Cyan
