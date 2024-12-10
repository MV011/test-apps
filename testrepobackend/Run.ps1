if (Test-Path -Path "tests.db") {
    Write-Host "Removing existing database..." -ForegroundColor Yellow
    Remove-Item -Path "tests.db"
}

# Check if tests.db exists in test-data directory and copy it
if (Test-Path -Path "test-data\tests.db") {
    Write-Host "Copying test database..." -ForegroundColor Green
    Copy-Item -Path "test-data\tests.db" -Destination "."
} else {
    Write-Host "Warning: No test database found in test-data directory. A new database will be created." -ForegroundColor Yellow
}

# Run the FastAPI application
Write-Host "Starting the application..." -ForegroundColor Green
uvicorn main:app --reload --host 0.0.0.0 --port 8000