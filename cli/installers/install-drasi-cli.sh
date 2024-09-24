: ${DRASI_INSTALL_DIR:="/usr/local/bin"}
: ${USE_SUDO:="false"}

GITHUB_ORG=drasi-project
GITHUB_REPO=drasi-platform

# HTTP request CLI
DRASI_HTTP_REQUEST_CLI=curl

# DRASI CLI filename
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


    if [[ "$OS" == "linux" || "$OS" == "darwin" ]] && [ "$DRASI_INSTALL_DIR" == "/usr/local/bin" ]; then
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
        CMD="sudo $CMD"
    fi

    $CMD
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
    echo "Checking for existing Drasi CLI installation... in $DRASI_CLI_FILE"
    if [ -f "DRASI_CLI_FILE" ]; then
        echo "Drasi CLI is already installed in $DRASI_CLI_FILE"
        echo -e "Reinstalling Drasi CLI...\n"
    else
        echo -e "Installing Drasi CLI...\n"
    fi
}

cleanup() {
    if [[ -d "${DRASI_TMP_ROOT:-}" ]]; then
        rm -rf "$DRASI_TMP_ROOT"
    fi
}

getLatestRelease() {
    local cliReleaseUrl="https://api.github.com/repos/${GITHUB_ORG}/${GITHUB_REPO}/releases"

    local latest_release=""

    if [ "$DRASI_HTTP_REQUEST_CLI" == "curl" ]; then
        latest_release=$(curl -s $cliReleaseUrl | grep \"tag_name\" | grep -v rc | awk 'NR==1{print $2}' |  sed -n 's/\"\(.*\)\",/\1/p')
    else
        latest_release=$(wget -q --header="Accept: application/json" -O - $cliReleaseUrl | grep \"tag_name\" | grep -v rc | awk 'NR==1{print $2}' |  sed -n 's/\"\(.*\)\",/\1/p')
    fi

    ret_val=$latest_release
}



downloadFile() {
    RELEASE_TAG=$1

    DRASI_CLI_ARTIFACT="${DRASI_CLI_FILENAME}-${OS}-${ARCH}"

    echo "Downloading Drasi CLI from the release $RELEASE_TAG..."
    DOWNLOAD_BASE="https://github.com/${GITHUB_ORG}/${GITHUB_REPO}/releases/download"
    DOWNLOAD_URL="${DOWNLOAD_BASE}/${RELEASE_TAG}/${DRASI_CLI_ARTIFACT}"

    DRASI_TMP_ROOT=$(mktemp -dt Drasi-install-XXXXXX)
    ARTIFACT_TMP_FILE="$DRASI_TMP_ROOT/$DRASI_CLI_ARTIFACT"

    echo "Downloading $DOWNLOAD_URL ..."
    if [ "$DRASI_HTTP_REQUEST_CLI" == "curl" ]; then
        curl -SsL "$DOWNLOAD_URL" -o "$ARTIFACT_TMP_FILE"
    else
        wget -q -O "$ARTIFACT_TMP_FILE" "$DOWNLOAD_URL"
    fi

    if [ ! -f "$ARTIFACT_TMP_FILE" ]; then
        echo "failed to download $DOWNLOAD_URL ..."
        exit 1
    fi
}


installFile() {
    DRASI_CLI_ARTIFACT="${DRASI_CLI_FILENAME}-${OS}-${ARCH}"
    local tmp_root_Drasi_cli="$DRASI_TMP_ROOT/$DRASI_CLI_ARTIFACT"

    if [ ! -f "$tmp_root_Drasi_cli" ]; then
        echo "Failed to download Drasi CLI executable."
        exit 1
    fi

    if [ -f "$DRASI_CLI_FILE" ]; then
        rm "$DRASI_CLI_FILE"
    fi

    chmod a+x $tmp_root_Drasi_cli
    mkdir -p "$DRASI_INSTALL_DIR"
    runAsRoot cp "$tmp_root_Drasi_cli" "$DRASI_INSTALL_DIR"
    runAsRoot mv "${DRASI_INSTALL_DIR}/${DRASI_CLI_ARTIFACT}" "${DRASI_INSTALL_DIR}/${DRASI_CLI_FILENAME}"

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

installCompleted() {
    echo -e "\nDrasi is installed!"
}


# -----------------------------------------------------------------------------
# main
# -----------------------------------------------------------------------------
trap "fail_trap" EXIT

getSystemInfo
checkHttpRequestCLI

if [ -z "$1" ]; then
    echo "Getting the latest Drasi CLI..."
    getLatestRelease
else
    ret_val=$1
fi 


verifySupported $ret_val 
checkExistingInstallation

echo "Installing $ret_val Drasi CLI..."

downloadFile $ret_val
installFile
cleanup

echo "Drasi CLI was installed successfully. Run 'drasi --help' to get started"