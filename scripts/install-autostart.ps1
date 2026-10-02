# ============================================================
# J.A.R.V.I.S — install-autostart.ps1
# Registers the backend as a Windows Startup task so it
# starts automatically when the user logs in.
# Run once as Administrator: .\scripts\install-autostart.ps1
# To remove: .\scripts\install-autostart.ps1 -Remove
# ============================================================

param([switch]$Remove)

$Root    = Split-Path -Parent $PSScriptRoot
$TaskName = "JARVIS-Backend-AutoStart"

if ($Remove) {
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue
    Write-Host "Auto-start task removed." -ForegroundColor Yellow
    exit 0
}

# Find python
$pythonExe = "python"
$venvPy    = "$Root\.venv\Scripts\python.exe"
if (Test-Path $venvPy) { $pythonExe = $venvPy }

$scriptPath = "$Root\server\jarvis_unified.py"

$action  = New-ScheduledTaskAction `
    -Execute $pythonExe `
    -Argument "-u `"$scriptPath`"" `
    -WorkingDirectory $Root

$trigger = New-ScheduledTaskTrigger -AtLogOn
$settings = New-ScheduledTaskSettingsSet `
    -ExecutionTimeLimit (New-TimeSpan -Hours 0) `
    -RestartCount 3 `
    -RestartInterval (New-TimeSpan -Minutes 1)

$principal = New-ScheduledTaskPrincipal `
    -UserId ([System.Security.Principal.WindowsIdentity]::GetCurrent().Name) `
    -LogonType Interactive `
    -RunLevel Highest

Register-ScheduledTask `
    -TaskName $TaskName `
    -Action   $action `
    -Trigger  $trigger `
    -Settings $settings `
    -Principal $principal `
    -Force | Out-Null

Write-Host "" 
Write-Host "  J.A.R.V.I.S backend auto-start registered!" -ForegroundColor Green
Write-Host "  Task: $TaskName" -ForegroundColor Cyan
Write-Host "  Will start on next login. To start now:" -ForegroundColor Gray
Write-Host "  Start-ScheduledTask -TaskName '$TaskName'" -ForegroundColor Cyan
Write-Host ""
