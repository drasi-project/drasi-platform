: ${DRASI_INSTALL_DIR:="/usr/local/bin"}
: ${USE_SUDO:="false"}


DRASI_HTTP_REQUEST_CLI=curl
GITHUB_ORG=project-drasi
GITHUB_REPO=drasi-platform
GITHUB_TOKEN=$1 

DRASI_CLI_FILENAME=drasi
DRASI_CLI_FILE="${DRASI_INSTALL_DIR}/${DRASI_CLI_FILENAME}"

getSystemInfo() {
    ARCH=$(uname -m)
    case $ARCH in
        armv7*) ARCH="arm";;
        aarch64) ARCH="arm64";;
        x86_64) ARCH="x64";;
    esac


    OS=$(echo `uname`|tr '[:upper:]' '[:lower:]')


    if [[ ("$OS" == "linux" || ( "$OS" == "darwin" && ( "$ARCH" == "arm" || "$ARCH" == "arm64" ))) && "$DRASI_INSTALL_DIR" == "/usr/local/bin"  ]];
    then
        USE_SUDO="true"
    fi
}

verifySupported() {
    local supported=(darwin-x64 darwin-arm64 linux-x64 linux-arm64)
    local current_osarch="${OS}-${ARCH}"

    for osarch in "${supported[@]}"; do
        if [ "$osarch" == "$current_osarch" ]; then
            echo "Your system is ${OS}_${ARCH}"
            return
        fi
    done

    echo "No prebuilt binary for ${current_osarch}"
    exit 1
}

runAsRoot() {
    local CMD="$*"

    if [ $EUID -ne 0 -a $USE_SUDO = "true" ]; then
        echo "Additional permissions needed. Please enter your sudo password..."
        CMD="sudo $CMD"
    fi

    $CMD
}

getLatestRelease() {
    local releaseUrl="https://api.github.com/repos/${GITHUB_ORG}/${GITHUB_REPO}/releases"

    local latest_release=""

    if [ $DRASI_HTTP_REQUEST_CLI == "curl" ]; then
        latest_release=$(curl -s -H "Authorization: Bearer ${GITHUB_TOKEN}" $releaseUrl | grep \"tag_name\" | grep -v rc | awk 'NR==1{print $2}' |  sed -n 's/\"\(.*\)\",/\1/p')
    else
        latest_release=$(wget -q --header="Accept: application/json" --header="Authorization: Bearer ${GITHUB_TOKEN}" -O - $releaseUrl | grep \"tag_name\" | grep -v rc | awk 'NR==1{print $2}' |  sed -n 's/\"\(.*\)\",/\1/p')
    fi

    ret_val=$latest_release
}

getAssetId() {
    # To download the asset using Github API, we need to find the asset id
    local VERSION=$1
    OS_ARCH="${OS}-${ARCH}"
    DRASI_ARTIFACT="drasi-${OS_ARCH}"

   # Fetch the releases
    response=$(curl -s -H "Authorization: token ${GITHUB_TOKEN}" https://api.github.com/repos/${GITHUB_ORG}/${GITHUB_REPO}/releases/tags/${VERSION})
    # Extract the URL of the asset
    eval $(echo "$response" | grep -C3 "name.:.\+${DRASI_ARTIFACT}" | grep -w id | tr : = | tr -cd '[[:alnum:]]=')
    [ "$id" ] || { echo "Error: Failed to get asset id, response: $response" | awk 'length($0)<100' >&2; exit 1; }
    
    ASSET_ID=$id
}

checkHttpRequestCLI() {
    if type "curl" > /dev/null; then
        DRASI_HTTP_REQUEST_CLI=curl
    elif type "wget" > /dev/null; then
        DRASI_HTTP_REQUEST_CLI=wget
    else
        echo "Either curl or wget is required"
        exit 1
    fi
}

checkExistingInstallation() {
    if [ -f "DRASI_CLI_FILE" ]; then
        echo "Drasi CLI is already installed in $DRASI_CLI_FILE"
        echo "Reinstalling Drasi CLI...\n"
    else
        echo "Installing Drasi CLI...\n"
    fi
}

cleanup() {
    if [[ -d "${DRASI_TMP_ROOT:-}" ]]; then
        rm -rf "$DRASI_TMP_ROOT"
    fi
}

downloadFile() {
    local ASSET_ID=$1
    OS_ARCH="${OS}-${ARCH}"
    DRASI_CLI_ARTIFACT="drasi-${OS_ARCH}"

    DOWNLOAD_URL="https://api.github.com/repos/${GITHUB_ORG}/${GITHUB_REPO}/releases/assets/${ASSET_ID}"

    DRASI_TMP_ROOT=$(mktemp -dt Drasi-install-XXXXXX)
    ARTIFACT_TMP_FILE="$DRASI_TMP_ROOT/$DRASI_CLI_ARTIFACT"


    echo "Downloading the Drasi CLI"
    if [ "$DRASI_HTTP_REQUEST_CLI" == "curl" ]; then
        curl -SsL -H "Accept: application/octet-stream" -H "Authorization: Bearer ${GITHUB_TOKEN}" "$DOWNLOAD_URL" -o "$ARTIFACT_TMP_FILE"
    else
        wget -q --header="Accept: application/octet-stream" --header="Authorization: Bearer ${GITHUB_TOKEN}" -O "$ARTIFACT_TMP_FILE" "$DOWNLOAD_URL"
    fi

    if [ ! -f "$ARTIFACT_TMP_FILE" ]; then
        echo "failed to download ${DOWNLOAD_URL}..."
        exit 1
    fi
}


installFile() {
    OS_ARCH="${OS}-${ARCH}"
    DRASI_CLI_ARTIFACT="drasi-${OS_ARCH}"
    local tmp_root_Drasi_cli="$DRASI_TMP_ROOT/$DRASI_CLI_ARTIFACT"

    if [ ! -f "$tmp_root_Drasi_cli" ]; then
        echo "Failed to download Drasi CLI executable."
        exit 1
    fi
    
    chmod a+x $tmp_root_Drasi_cli

    mkdir -p "$DRASI_INSTALL_DIR"
    runAsRoot cp "$tmp_root_Drasi_cli" "$DRASI_INSTALL_DIR"
    runAsRoot mv "${DRASI_INSTALL_DIR}/${DRASI_CLI_FILENAME}-${OS}-${ARCH}" "${DRASI_INSTALL_DIR}/${DRASI_CLI_FILENAME}"

    if [ -f "$DRASI_CLI_FILE" ]; then
        echo "Drasi CLI was installed successfully to $DRASI_CLI_FILE"

    else
        echo "Failed to install Drasi CLI"
        exit 1
    fi
}

fail_trap() {
    result=$?
    if [ "$result" != "0" ]; then
        echo "Failed to install Drasi CLI"
    fi
    cleanup
    exit $result
}


trap "fail_trap" EXIT

getSystemInfo
checkHttpRequestCLI

if [ -z "$2" ]; then
    echo "Getting the latest Drasi CLI..."
    getLatestRelease
else
    ret_val=v$2
fi

getAssetId $ret_val

verifySupported
checkExistingInstallation

downloadFile $ASSET_ID
installFile
cleanup

echo "Drasi CLI was installed successfully. Run 'drasi --help' to get started"