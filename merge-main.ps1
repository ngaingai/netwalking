# Script to merge main into seo-aeo branch
$env:GIT_PAGER = ""
$env:GIT_EDITOR = "true"

Write-Host "Checking current branch..."
$currentBranch = git rev-parse --abbrev-ref HEAD
Write-Host "Current branch: $currentBranch"

if ($currentBranch -ne "seo-aeo") {
    Write-Host "Checking out seo-aeo branch..."
    git checkout seo-aeo
}

Write-Host "Fetching latest changes from origin..."
git fetch origin 2>&1 | Out-Null

Write-Host "Merging origin/main into seo-aeo..."
$mergeResult = git merge origin/main -m "Merge main into seo-aeo" 2>&1
Write-Host $mergeResult

Write-Host "`nChecking merge status..."
$status = git status --short
if ($status) {
    Write-Host "Status:"
    Write-Host $status
} else {
    Write-Host "Working tree is clean"
}

Write-Host "`nIf merge was successful, you can now push with:"
Write-Host "  git push origin seo-aeo"

