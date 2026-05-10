$ErrorActionPreference = "Stop"

$projectDir = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$taskName = "GlobalTechFinanceIntelDailyUpdate"
$npmPath = (Get-Command npm.cmd).Source

$action = New-ScheduledTaskAction -Execute $npmPath -Argument "run update:public" -WorkingDirectory $projectDir
$trigger = New-ScheduledTaskTrigger -Daily -At 7:30am
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Description "Fetch news and generate the daily intelligence report." -Force | Out-Null
Write-Host "Registered Windows scheduled task: $taskName"
