# Configura Cortex OS + Supabase (Windows PowerShell)
# Uso: .\scripts\setup-supabase.ps1

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$envFile = Join-Path $root 'apps\web\.env.local'

Write-Host ''
Write-Host '=== Cortex OS - Setup Supabase ===' -ForegroundColor Cyan
Write-Host ''

Write-Host '1. Crie um projeto em https://supabase.com/dashboard' -ForegroundColor Yellow
Write-Host '2. Em Settings - API, copie Project URL e anon public key' -ForegroundColor Yellow
Write-Host ''

$url = (Read-Host 'Project URL (ex: https://abcdefgh.supabase.co)').Trim().TrimEnd('/')
$key = (Read-Host 'anon public key (eyJ...)').Trim()

if (-not $url -or -not $key) {
  Write-Host 'URL e chave sao obrigatorios.' -ForegroundColor Red
  exit 1
}

if ($url -notmatch '^https://[a-z0-9-]+\.supabase\.co$') {
  Write-Host ''
  Write-Host 'URL invalida.' -ForegroundColor Red
  Write-Host 'Copie em Settings - API o campo "Project URL".' -ForegroundColor Yellow
  Write-Host 'Formato correto: https://SEU_REF.supabase.co' -ForegroundColor Yellow
  Write-Host 'Nao use o link do dashboard nem /auth/v1 nem /rest/v1.' -ForegroundColor Yellow
  exit 1
}

if ($key -notmatch '^eyJ') {
  Write-Host ''
  Write-Host 'Chave anon invalida. Use a "anon public" key (comeca com eyJ).' -ForegroundColor Red
  exit 1
}

$lines = @(
  '# Gerado por scripts/setup-supabase.ps1'
  "NEXT_PUBLIC_SUPABASE_URL=$url"
  "NEXT_PUBLIC_SUPABASE_ANON_KEY=$key"
)
Set-Content -Path $envFile -Value $lines -Encoding utf8

Write-Host ''
Write-Host 'Gravado em apps/web/.env.local' -ForegroundColor Green
Write-Host ''

$push = Read-Host 'Ligar projeto e enviar migrations agora? (s/N)'
if ($push -match '^[sSyY]') {
  $ref = Read-Host 'Project ref (Settings - General - Reference ID)'
  if (-not $ref) {
    Write-Host 'Project ref obrigatorio para db push.' -ForegroundColor Red
    exit 1
  }

  Set-Location $root
  Write-Host 'A executar: npx supabase login (abra o browser se pedido)' -ForegroundColor Cyan
  npx supabase login
  npx supabase link --project-ref $ref
  npx supabase db push
  Write-Host ''
  Write-Host 'Migrations enviadas.' -ForegroundColor Green
}

Write-Host ''
Write-Host 'No painel Supabase - Authentication - URL Configuration:' -ForegroundColor Yellow
Write-Host '  Site URL: http://localhost:3000'
Write-Host '  Redirect URLs: http://localhost:3000/auth/callback'
Write-Host ''
Write-Host 'Arranque: npm run dev:web' -ForegroundColor Cyan
Write-Host 'Registo: http://localhost:3000/signup' -ForegroundColor Cyan
Write-Host 'Login: http://localhost:3000/login' -ForegroundColor Cyan
Write-Host ''
