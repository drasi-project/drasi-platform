: ${DRASI_INSTALL_DIR:="/usr/local/bin"}
: ${USE_SUDO:="false"}


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


    # if [ "$OS" == "darwin" ]; then
    #     OS="macos"
    # fi

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
    OS_ARCH="${OS}-${ARCH}"
    DRASI_CLI_ARTIFACT="drasi"

    DOWNLOAD_BASE="https://drasi.blob.core.windows.net/installs"
    DOWNLOAD_URL="${DOWNLOAD_BASE}/${OS_ARCH}/${DRASI_CLI_ARTIFACT}"

    DRASI_TMP_ROOT=$(mktemp -dt Drasi-install-XXXXXX)
    ARTIFACT_TMP_FILE="$DRASI_TMP_ROOT/$DRASI_CLI_ARTIFACT"


    if [ "$DRASI_HTTP_REQUEST_CLI" == "curl" ]; then
        if ! curl --output /dev/null --silent --head --fail "$DOWNLOAD_URL"; then
            echo $DOWNLOAD_URL
            echo "ERROR: The specified version of the Drasi CLI does not exist."
            exit 1
        fi
    else
        if ! wget --spider "$DOWNLOAD_URL" 2>/dev/null; then
            echo "ERROR: The specified version of the Drasi CLI does not exist."
            exit 1
        fi
    fi

    echo "Downloading ${DOWNLOAD_URL}"
    if [ "$DRASI_HTTP_REQUEST_CLI" == "curl" ]; then
        curl -SsL "$DOWNLOAD_URL" -o "$ARTIFACT_TMP_FILE"
    else
        wget -q -O "$ARTIFACT_TMP_FILE" "$DOWNLOAD_URL"
    fi

    if [ ! -f "$ARTIFACT_TMP_FILE" ]; then
        echo "failed to download ${DOWNLOAD_URL}..."
        exit 1
    fi
}


installFile() {
    local tmp_root_Drasi_cli="$DRASI_TMP_ROOT/$DRASI_CLI_FILENAME"

    if [ ! -f "$tmp_root_Drasi_cli" ]; then
        echo "Failed to download Drasi CLI executable."
        exit 1
    fi

    chmod a+x $tmp_root_Drasi_cli
    runAsRoot cp "$tmp_root_Drasi_cli" "$DRASI_INSTALL_DIR"

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
verifySupported
checkExistingInstallation
checkHttpRequestCLI

downloadFile
installFile
cleanup

echo "Drasi CLI was installed successfully. Run 'drasi --help' to get started"