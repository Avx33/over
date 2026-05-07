# EduMaroc Setup Script (PowerShell)
# Run: .\setup.ps1

Write-Host "🎓 EduMaroc — Setup" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan

# Check Node.js
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "❌ Node.js not found. Please install it from https://nodejs.org (LTS version)" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green

# Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) { Write-Host "❌ npm install failed" -ForegroundColor Red; exit 1 }

# Create .env.local from example
if (-not (Test-Path ".env.local")) {
    Copy-Item ".env.local.example" ".env.local"
    Write-Host "`n📝 Created .env.local — please fill in your Supabase credentials" -ForegroundColor Yellow
} else {
    Write-Host "`n✅ .env.local already exists" -ForegroundColor Green
}

Write-Host "`n✅ Setup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Fill in .env.local with your Supabase credentials" -ForegroundColor White
Write-Host "2. Run the SQL migration in Supabase: supabase/migrations/001_initial.sql" -ForegroundColor White
Write-Host "3. Run the seed data: supabase/seed.sql" -ForegroundColor White
Write-Host "4. Start the dev server: npm run dev" -ForegroundColor White
Write-Host "5. Open http://localhost:3000" -ForegroundColor White
