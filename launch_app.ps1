$ErrorActionPreference = "SilentlyContinue"
$projectDir = "C:\Users\ABHIJIT\.gemini\antigravity\scratch\divyajyoti2050"
$port = 5273
$url = "http://127.0.0.1:5273/"

# Make sure node is on PATH
if (-not ($env:PATH -like "*nodejs*")) {
    $env:PATH += ";C:\Program Files\nodejs;C:\Program Files (x86)\nodejs"
}

Set-Location $projectDir

# If production build is missing, build it once (first run only)
if (-not (Test-Path "$projectDir\dist\index.html")) {
    $npm = Get-Command npm.cmd -ErrorAction SilentlyContinue
    if ($npm) { & npm.cmd run build *> "$projectDir\build_autogen.log" }
}

# Start the tiny static server only if the port is not already served
$conn = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
if (-not $conn) {
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = "node.exe"
    $psi.Arguments = ".\serve_dist.cjs"
    $psi.WorkingDirectory = $projectDir
    $psi.WindowStyle = [System.Diagnostics.ProcessWindowStyle]::Hidden
    $psi.CreateNoWindow = $true
    $psi.UseShellExecute = $false
    [System.Diagnostics.Process]::Start($psi) | Out-Null

    # Wait up to 10 seconds for the server
    for ($i = 0; $i -lt 50; $i++) {
        Start-Sleep -Milliseconds 200
        $check = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
        if ($check) { break }
    }
    Start-Sleep -Milliseconds 300
}

# Open as a REAL desktop app: Chrome App Mode (no tabs, no address bar — app-window only)
$chromeCandidates = @(
    "C:\Program Files\Google\Chrome\Application\chrome.exe",
    "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
)
$chrome = $chromeCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1

if ($chrome) {
    # Dedicated profile folder keeps the app window separate from normal Chrome browsing
    $appProfile = "$env:LOCALAPPDATA\DivyaJyoti2050\ChromeAppProfile"
    Start-Process -FilePath $chrome -ArgumentList @(
        "--app=$url",
        "--user-data-dir=`"$appProfile`"",
        "--window-size=1280,860",
        "--no-first-run",
        "--no-default-browser-check"
    )
} else {
    # Fallback: Edge App Mode, then plain browser
    $edge = @(
        "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
    ) | Where-Object { Test-Path $_ } | Select-Object -First 1
    if ($edge) {
        Start-Process -FilePath $edge -ArgumentList @("--app=$url", "--window-size=1280,860")
    } else {
        Start-Process $url
    }
}
