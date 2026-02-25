# auto-git.ps1
Write-Host "🔄 Auto Git Sync Started - Press Ctrl+C to stop" -ForegroundColor Green

while ($true) {
    # Check for changes
    $status = git status --porcelain
    if ($status) {
        Write-Host "📝 Changes detected at $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Yellow
        git add .
        git commit -m "Auto-update: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        git push origin main
        Write-Host "✅ Changes pushed to GitHub" -ForegroundColor Green
    }
    Start-Sleep -Seconds 60  # Check every minute
}