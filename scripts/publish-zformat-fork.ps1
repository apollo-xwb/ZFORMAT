# Publish this workspace to a GitHub fork named ZFORMAT.
# Upstream apollo-xwb/ROCO main branch is not modified.

$ErrorActionPreference = "Stop"

Set-Location (Resolve-Path (Join-Path $PSScriptRoot ".."))

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  throw "GitHub CLI (gh) is required. Install from https://cli.github.com/"
}

gh auth status | Out-Null

Write-Host "Creating fork apollo-xwb/ROCO -> ZFORMAT (if it does not already exist)..."
gh repo fork apollo-xwb/ROCO --fork-name ZFORMAT --remote=false 2>$null

$login = gh api user --jq .login
$forkUrl = "https://github.com/$login/ZFORMAT.git"

if (git remote | Select-String -Pattern "^origin$" -Quiet) {
  git remote set-url origin $forkUrl
} else {
  git remote add origin $forkUrl
}

Write-Host "Pushing main branch to $forkUrl ..."
git branch -M main
git push -u origin main --force

Write-Host "Done. Fork URL: https://github.com/$login/ZFORMAT"
