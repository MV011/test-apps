# Check if npm is installed
try {
    $npmVersion = npm -v
    Write-Host "Found npm version $npmVersion"
}
catch {
    Write-Error "Error: npm is not installed. Please install Node.js and npm first."
    exit 1
}

Write-Host "Installing frontend dependencies..."

# Install dependencies
npm install

# Install specific shadcn components
Write-Host "Installing shadcn components..."
npx shadcn@latest add card
npx shadcn@latest add alert
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add textarea
npx shadcn@latest add select

Write-Host "Installation complete!" -ForegroundColor Green