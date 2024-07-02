param (
    [string]$Version,
    [string]$DrasiRoot = "$env:LOCALAPPDATA\drasi"
)

Write-Output ""
$ErrorActionPreference = 'stop'

$DrasiRoot = $DrasiRoot -replace ' ', '` '

$DrasiCliFileName = "drasi.exe"
$DrasiCliFilePath = "${DrasiRoot}\${DrasiCliFileName}"
$OsArch = "windows-x64"
$BaseDownloadUrl = "https://drasi.blob.core.windows.net/installs"

if ((Get-ExecutionPolicy) -gt 'RemoteSigned' -or (Get-ExecutionPolicy) -eq 'ByPass') {
    Write-Output "PowerShell requires an execution policy of 'RemoteSigned'."
    Write-Output "To make this change please run:"
    Write-Output "'Set-ExecutionPolicy RemoteSigned -scope CurrentUser'"
    break
}

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

$urlParts = @(
    $BaseDownloadUrl,
    $OsArch,
    $DrasiCliFileName
)
$binaryUrl = $urlParts -join "/"
Write-Output "Downloading $binaryUrl"
$binaryFilePath = $DrasiRoot + "\" + $DrasiCliFileName

try {
    $ProgressPreference = "SilentlyContinue" # Do not show progress bar
    Invoke-WebRequest -Uri $binaryUrl -OutFile $binaryFilePath -UseBasicParsing
    if (!(Test-Path $binaryFilePath -PathType Leaf)) {
        throw "Failed to download Drasi Cli binary - $binaryFilePath"
    }
}
catch [Net.WebException] {
    throw "ERROR: The specified release version does not exist."
}


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

Write-Output "Drasi CLI has been successfully installed"

