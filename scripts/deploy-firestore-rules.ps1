# Deploy Firestore rules for the ROCO pilot database.
# Requires the Google account that OWNS project: gen-lang-client-0165508640

$ErrorActionPreference = "Stop"
$ProjectId = "gen-lang-client-0165508640"
$DatabaseId = "ai-studio-b58e2972-8cd4-40af-a237-2b2a3536e7a3"
$Root = Split-Path $PSScriptRoot -Parent

Set-Location $Root

if (-not (Test-Path "firebase.json")) {
  Write-Host "firebase.json not found. Run: git pull" -ForegroundColor Red
  exit 1
}

Write-Host "Logged in as:" -ForegroundColor Cyan
firebase login:list

Write-Host "`nTrying deploy to $ProjectId (database: $DatabaseId)..." -ForegroundColor Cyan
firebase deploy --only "firestore:$DatabaseId" --project $ProjectId

if ($LASTEXITCODE -ne 0) {
  Write-Host "`nCLI deploy failed (usually wrong Google account or expired login)." -ForegroundColor Yellow
  Write-Host "1. firebase logout" -ForegroundColor White
  Write-Host "2. firebase login   (use the Google account that created the AI Studio / Firebase project)" -ForegroundColor White
  Write-Host "3. Re-run this script`n" -ForegroundColor White
  Write-Host "Manual fallback — paste firestore.rules in Firebase Console:" -ForegroundColor Cyan
  $consoleUrl = "https://console.firebase.google.com/project/$ProjectId/firestore/databases/$DatabaseId/rules"
  Write-Host $consoleUrl -ForegroundColor Green
  Write-Host "`nRules file: $Root\firestore.rules" -ForegroundColor White
  exit $LASTEXITCODE
}

Write-Host "`nFirestore rules deployed successfully." -ForegroundColor Green
