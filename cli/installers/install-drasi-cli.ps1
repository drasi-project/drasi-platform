param (
    [string]$Version,
    [string]$DrasiRoot = "$env:ProgramFiles/drasi"
)

Write-Output ""
$ErrorActionPreference = 'stop'

$DrasiRoot = $DrasiRoot -replace ' ', '` '

$DrasiCliFileName = "drasi.exe"
$DrasiCliFilePath = "${DrasiRoot}\${DrasiCliFileName}"
$OS = "windows"
$Arch = "x64"
$GitHubOrg = "drasi-project"
$GitHubRepo = "drasi-platform"
$GitHubReleaseJsonUrl = "https://api.github.com/repos/${GitHubOrg}/${GitHubRepo}/releases"


function GetVersionInfo {
    param (
        [string]$Version,
        $Releases
    )
    # Filter windows binary and download archive
    if (!$Version) {
        $release = $Releases | Where-Object { $_.tag_name -notlike "*rc*" } | Select-Object -First 1
    }
    else {
        $release = $Releases | Where-Object { $_.tag_name -eq "$Version" } | Select-Object -First 1
    }

    return $release
}


function GetWindowsAsset {
    param (
        $Release
    )
    $windowsAsset = $Release | Select-Object -ExpandProperty assets | Where-Object { $_.name -Like "*${OS}-${Arch}.exe" }
    if (!$windowsAsset) {
        throw "Cannot find the Windows drasi CLI binary"
    }
    [hashtable]$return = @{}
    $return.url = $windowsAsset.url
    $return.name = $windowsAsset.name
 
    return $return
}



if ((Get-ExecutionPolicy) -gt 'RemoteSigned' -or (Get-ExecutionPolicy) -eq 'ByPass') {
    Write-Output "PowerShell requires an execution policy of 'RemoteSigned'."
    Write-Output "To make this change please run:"
    Write-Output "'Set-ExecutionPolicy RemoteSigned -scope CurrentUser'"
    break
}

# Change security protocol to support TLS 1.2 / 1.1 / 1.0 - old powershell uses TLS 1.0 as a default protocol
[Net.ServicePointManager]::SecurityProtocol = "tls12, tls11, tls"

if (Test-Path $DrasiCliFilePath -PathType Leaf) {
    Write-Output "Previous Drasi CLI detected"
    Write-Output "Reinstalling Drasi CLI..."
}
else {
    Write-Output "Installing Drasi CLI..."
}

if (-Not (Test-Path $DrasiRoot -PathType Container)) {
    Write-Output "Creating $DrasiRoot directory..."
    New-Item -ErrorAction Ignore -Path $DrasiRoot -ItemType "directory" | Out-Null
    if (!(Test-Path $DrasiRoot -PathType Container)) {
        throw "Cannot create $DrasiRoot"
    }
}

$releases = Invoke-RestMethod -Uri $GitHubReleaseJsonUrl -Headers $githubHeader -Method Get
if ($releases.Count -eq 0) {
    throw "No releases from github.com/${GitHubOrg}/${GitHubRepo}"
}

$release = GetVersionInfo -Version $Version -Releases $releases
if (!$release) {
    throw "Cannot find the specified drasi CLI binary version"
}

$asset = GetWindowsAsset -Release $release
$assetName = $asset.name
$exeFileUrl = $asset.url
$exeFilePath = "${DrasiRoot}\${assetName}"

Write-Output "path $exeFilePath"
try {
    Write-Output "Downloading $exeFileUrl"
    $githubHeader = @{
        Accept = "application/octet-stream"
    }
    $oldProgressPreference = $ProgressPreference
    $ProgressPreference = "SilentlyContinue" # Do not show progress bar
    Invoke-WebRequest -Headers $githubHeader -Uri $exeFileUrl -OutFile $exeFilePath
}
catch [Net.WebException] {
    throw "ERROR: The specified release version: $Version does not exist."
}
finally {
    $ProgressPreference = $oldProgressPreference;
}

if (!(Test-Path $exeFilePath -PathType Leaf)) {
    throw "Failed to download drasi CLI binary - $exeFilePath"
}

# Remove old drasi CLI if exists
if (Test-Path $DrasiCliFilePath -PathType Leaf) {
    Remove-Item -Recurse -Force $DrasiCliFilePath
}

# Rename the downloaded drasi CLI binary
Rename-Item -Path $exeFilePath -NewName $DrasiCliFilePath -Force

if (!(Test-Path $DrasiCliFilePath -PathType Leaf)) {
  throw "Failed to download drasi CLI binary - $exeFilePath"
}

# Version string
Write-Output "drasi CLI version: $($release.tag_name)"


$UserPathEnvironmentVar = (Get-Item -Path HKCU:\Environment).GetValue(
    'PATH', # the registry-value name
    $null, # the default value to return if no such value exists.
    'DoNotExpandEnvironmentNames' # the option that suppresses expansion
)

if (-Not ($UserPathEnvironmentVar -like '*drasi*')) {
    Write-Output "Adding $DrasiRoot to User Path..."
    # [Environment]::SetEnvironmentVariable sets the value kind as REG_SZ, use the function below to set a value of kind REG_EXPAND_SZ
    Set-ItemProperty HKCU:\Environment "PATH" "$UserPathEnvironmentVar;$DrasiRoot" -Type ExpandString
    # Also add the path to the current session
    $env:PATH += ";$DrasiRoot"
}

Write-Output "drasi CLI has been successfully installed"