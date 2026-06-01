<#
.SYNOPSIS
    EXERCICIO 3 - Registra um self-hosted runner do GitHub Actions no Windows.

.DESCRIPTION
    Baixa, configura e inicia o GitHub Actions Runner na sua maquina para
    executar a pipeline .github/workflows/ci-self-hosted.yml.

    O TOKEN e obtido em:
      Repositorio > Settings > Actions > Runners > "New self-hosted runner"
    (o token e temporario e expira em ~1h).

.PARAMETER RepoUrl
    URL do repositorio. Ex.: https://github.com/JoaoVRBastos/desafio-programacao-pos

.PARAMETER Token
    Token de registro exibido na tela "New self-hosted runner".

.PARAMETER Version
    Versao do runner (opcional). Padrao: 2.321.0

.EXAMPLE
    ./setup-github-runner.ps1 -RepoUrl "https://github.com/JoaoVRBastos/desafio-programacao-pos" -Token "AXXX...".
#>
param(
    [Parameter(Mandatory = $true)] [string] $RepoUrl,
    [Parameter(Mandatory = $true)] [string] $Token,
    [string] $Version = "2.321.0"
)

$ErrorActionPreference = "Stop"

$runnerDir = Join-Path $PSScriptRoot "actions-runner"
if (-not (Test-Path $runnerDir)) { New-Item -ItemType Directory -Path $runnerDir | Out-Null }
Set-Location $runnerDir

$zip = "actions-runner-win-x64-$Version.zip"
$url = "https://github.com/actions/runner/releases/download/v$Version/$zip"

if (-not (Test-Path $zip)) {
    Write-Host "Baixando GitHub Actions Runner v$Version..." -ForegroundColor Cyan
    Invoke-WebRequest -Uri $url -OutFile $zip
}

Write-Host "Extraindo..." -ForegroundColor Cyan
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::ExtractToDirectory((Resolve-Path $zip), (Get-Location))

Write-Host "Configurando o runner..." -ForegroundColor Cyan
& ./config.cmd --url $RepoUrl --token $Token --labels "self-hosted,windows,x64" --unattended

Write-Host "Iniciando o runner (Ctrl+C para parar)..." -ForegroundColor Green
& ./run.cmd
