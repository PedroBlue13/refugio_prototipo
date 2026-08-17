$Source = Split-Path -Parent $MyInvocation.MyCommand.Path
$Target = Join-Path $HOME ".claude\skills"
New-Item -ItemType Directory -Force -Path $Target | Out-Null

Get-ChildItem $Source -Directory | ForEach-Object {
    if ($_.Name -ne "__MACOSX") {
        Copy-Item $_.FullName -Destination $Target -Recurse -Force
        Write-Host "Installed: $($_.Name)"
    }
}

Write-Host ""
Write-Host "Claude frontend skills installed in: $Target"
