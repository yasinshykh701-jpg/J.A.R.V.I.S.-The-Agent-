param([switch]$Force)

$ErrorActionPreference = "Continue"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

$env:JARVIS_WORKSPACE = if ($env:JARVIS_WORKSPACE) { $env:JARVIS_WORKSPACE } else { Split-Path -Parent $Root }
$env:JARVIS_HUB_URL = if ($env:JARVIS_HUB_URL) { $env:JARVIS_HUB_URL } else { "http://127.0.0.1:8000" }
$env:JARVIS_HUB_SECRET = if ($env:JARVIS_HUB_SECRET) { $env:JARVIS_HUB_SECRET } else { "change-me-in-production" }
$env:ZEVORIX_API_BASE = if ($env:ZEVORIX_API_BASE) { $env:ZEVORIX_API_BASE } else { "http://127.0.0.1:8001" }
$env:ZEVORIX_API_KEY = if ($env:ZEVORIX_API_KEY) { $env:ZEVORIX_API_KEY } else { "zevorix-local-dev-key" }
$env:IMAGE_RAG_URL = if ($env:IMAGE_RAG_URL) { $env:IMAGE_RAG_URL } else { "http://127.0.0.1:8002" }
$supabaseUrl = if ($env:VITE_SUPABASE_URL) { $env:VITE_SUPABASE_URL } else { "https://ttojsmjktgafkjzaczdb.supabase.co" }
$logRoot = Join-Path $Root "logs"
New-Item -ItemType Directory -Path $logRoot -Force | Out-Null

function Info($message) { Write-Host "  -> $message" -ForegroundColor DarkGray }
function Ok($message) { Write-Host "  OK $message" -ForegroundColor Green }
function Warn($message) { Write-Host "  WARNING $message" -ForegroundColor Yellow }

Write-Host ""
Write-Host "  J.A.R.V.I.S - Full Backend Startup" -ForegroundColor Cyan
Write-Host "  Gateway 8000 | Zevorix 8001 | Image RAG 8002 | IoT API 8010 | Vite 5173" -ForegroundColor Cyan
Write-Host ""

$pythonExe = $null
foreach ($candidate in @(
    "$Root\.venv\Scripts\python.exe",
    "D:\J.A.R.V.I.S\.venv\Scripts\python.exe",
    "E:\python\python.exe",
    "python",
    "py"
)) {
    if ((Test-Path $candidate) -or (Get-Command $candidate -ErrorAction SilentlyContinue)) {
        try {
            & $candidate -c "import fastapi, uvicorn" 2>$null
            if ($LASTEXITCODE -eq 0) {
                $pythonExe = $candidate
                break
            }
        } catch {
            Info "Skipping Python without FastAPI/Uvicorn: $candidate"
        }
    }
}
if (-not $pythonExe) {
    throw "Python with FastAPI and Uvicorn was not found. Install with: python -m pip install -r `"$Root\requirements.txt`""
}
Info "Python: $pythonExe"

function Test-TcpOpen($port) {
    try {
        $client = New-Object System.Net.Sockets.TcpClient
        $iar = $client.BeginConnect("127.0.0.1", [int]$port, $null, $null)
        $ok = $iar.AsyncWaitHandle.WaitOne(400)
        $connected = $ok -and $client.Connected
        $client.Close()
        return [bool]$connected
    } catch {
        return $false
    }
}

function Test-Port($port) {
    try {
        $response = Invoke-WebRequest -Uri "http://127.0.0.1:$port/health" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
        return ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500)
    } catch {
        return (Test-TcpOpen $port)
    }
}

function Test-SupabaseFunctions {
    try {
        $response = Invoke-WebRequest -Uri "$supabaseUrl/functions/v1/chat-llm" -Method Options -Headers @{
            "apikey" = "supabase-preflight"
            "Authorization" = "Bearer supabase-preflight"
        } -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
        return ($response.StatusCode -ge 200 -and $response.StatusCode -lt 400)
    } catch {
        return $false
    }
}

function Wait-ForPort($port, $name, $seconds) {
    for ($i = 0; $i -lt $seconds; $i++) {
        if (Test-Port $port) { return $true }
        Start-Sleep -Seconds 1
        Write-Host "  waiting for $name ($($i + 1)/$seconds)"
    }
    return $false
}

function Start-PythonService($name, $argLine, $workdir, $outLog, $errLog) {
    $proc = Start-Process -FilePath $pythonExe -ArgumentList $argLine -WorkingDirectory $workdir -PassThru -WindowStyle Minimized `
        -RedirectStandardOutput $outLog `
        -RedirectStandardError $errLog
    return $proc
}

if (Test-SupabaseFunctions) {
    Ok "Supabase Edge Functions reachable at $supabaseUrl"
} else {
    Warn "Supabase Edge Functions are not reachable at $supabaseUrl"
}

$processes = @{}
$keepServicesRunning = $false

if (Test-Port 8000) {
    Ok "Gateway already running at http://127.0.0.1:8000"
} else {
    $gateway = Start-PythonService "gateway" "-u `"$Root\server\jarvis_unified.py`"" $Root (Join-Path $logRoot "gateway.out.log") (Join-Path $logRoot "gateway.err.log")
    $processes["gateway"] = $gateway.Id
    if (Wait-ForPort 8000 "gateway" 30) { Ok "Gateway ready" } else { Warn "Gateway did not become ready — see logs\gateway.err.log" }
}

$zevorixRoot = Join-Path $env:JARVIS_WORKSPACE "Zevorix LLM Engine 1.0"
$zevorixServer = Join-Path $zevorixRoot "server.py"
if (-not (Test-Path -LiteralPath $zevorixServer)) {
    Warn "Zevorix server.py was not found at $zevorixServer"
} elseif (Test-Port 8001) {
    Ok "Zevorix already running at http://127.0.0.1:8001"
} else {
    $forceArg = if ($Force) { " --force-ingest" } else { "" }
    $zevorix = Start-PythonService "zevorix" "-u `"$zevorixServer`" --host 127.0.0.1 --port 8001$forceArg" $zevorixRoot (Join-Path $logRoot "zevorix.out.log") (Join-Path $logRoot "zevorix.err.log")
    $processes["zevorix"] = $zevorix.Id
    if (Wait-ForPort 8001 "Zevorix" 45) { Ok "Zevorix API ready" } else { Warn "Zevorix is still initializing; first-time ingestion may take several minutes" }
}

$imageRoot = Join-Path $env:JARVIS_WORKSPACE "image egeneration\image-rag-pipeline"
if (-not (Test-Path -LiteralPath (Join-Path $imageRoot "app\main.py"))) {
    Warn "Image RAG pipeline was not found at $imageRoot"
} elseif (Test-Port 8002) {
    Ok "Image RAG already running at http://127.0.0.1:8002"
} else {
    $image = Start-PythonService "image-rag" "-u -m uvicorn app.main:app --host 127.0.0.1 --port 8002" $imageRoot (Join-Path $logRoot "image-rag.out.log") (Join-Path $logRoot "image-rag.err.log")
    $processes["image-rag"] = $image.Id
    if (Wait-ForPort 8002 "Image RAG" 40) { Ok "Image RAG ready" } else { Warn "Image RAG did not become ready — see logs\image-rag.err.log" }
}

$iotRoot = Join-Path $env:JARVIS_WORKSPACE "SYSTEM CONTROL ON VOICE\Jarvis\iot_server"
if (-not (Test-Path -LiteralPath (Join-Path $iotRoot "main.py"))) {
    Warn "IoT FastAPI server was not found"
} elseif (Test-Port 8010) {
    Ok "IoT API already running at http://127.0.0.1:8010"
} else {
    $iot = Start-PythonService "iot" "-u -m uvicorn main:app --host 127.0.0.1 --port 8010" $iotRoot (Join-Path $logRoot "iot.out.log") (Join-Path $logRoot "iot.err.log")
    $processes["iot"] = $iot.Id
    if (Wait-ForPort 8010 "IoT API" 45) {
        Ok "IoT API ready"
    } else {
        Warn "IoT API did not become ready"
        if (Test-Path (Join-Path $logRoot "iot.err.log")) {
            Info "IoT log: $logRoot\iot.err.log"
        }
    }
}

Write-Host ""
Write-Host "  Backend services are running. Starting Vite..." -ForegroundColor Cyan
Write-Host "  Press Ctrl+C to stop the frontend and child services." -ForegroundColor Yellow
try {
    if (Test-TcpOpen 5173) {
        Ok "Vite already running at http://127.0.0.1:5173"
        Write-Host "  Existing Vite process will be reused." -ForegroundColor DarkGray
        Write-Host "  Full J.A.R.V.I.S stack is ready." -ForegroundColor Green
        $keepServicesRunning = $true
        return
    } else {
        npm run dev -- --host 127.0.0.1 --port 5173
    }
} finally {
    if (-not $keepServicesRunning) {
        foreach ($name in $processes.Keys) {
            $processId = $processes[$name]
            if (Get-Process -Id $processId -ErrorAction SilentlyContinue) {
                Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                Info "Stopped $name (PID $processId)"
            }
        }
        Ok "Managed child services stopped after startup failure."
    }
}
