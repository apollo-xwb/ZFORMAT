# Publish this workspace to a GitHub fork named ZFORMAT.
# Upstream apollo-xwb/ROCO main branch is not modified.

$ErrorActionPreference = "Stop"

Set-Location (Resolve-Path (Join-Path $PSScriptRoot ".."))

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  throw "GitHub CLI (gh) is required. Install from https://cli.github.com/"
}

gh auth status | Out-Null

$login = gh api user --jq .login
$forkUrl = "https://github.com/$login/ZFORMAT.git"

if (gh repo view "$login/ZFORMAT" 2>$null) {
  Write-Host "Repository $login/ZFORMAT already exists."
} else {
  Write-Host "Creating separate ZFORMAT repository (upstream ROCO main stays untouched)..."
  gh repo create "$login/ZFORMAT" --public --description "ZFORMAT — Z-format manual ops line from ROCO" --source=. --remote=origin --push
  exit $LASTEXITCODE
}

if (git remote | Select-String -Pattern "^origin$" -Quiet) {
  git remote set-url origin $forkUrl
} else {
  git remote add origin $forkUrl
}

Write-Host "Pushing main branch to $forkUrl ..."
git branch -M main
git push -u origin main --force

Write-Host "Done. Fork URL: https://github.com/$login/ZFORMAT"
