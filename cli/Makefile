ifeq (,$(shell go env GOBIN))
	GOBIN=$(shell go env GOPATH)/bin
else
	GOBIN=$(shell go env GOBIN)
endif

ifeq ($(OS),Windows_NT)
    IS_WINDOWS := true
else
    IS_WINDOWS := false
endif

ifeq ($(OS),Windows_NT)
    SHELL := powershell.exe
    DELIM := ;
else
    SHELL := /usr/bin/env bash -o pipefail
    .SHELLFLAGS := -ec
    DELIM := :
endif

VERSION ?= latest

DRASI_LOCATION ?= $(if $(filter $(OS),Windows_NT),$(shell $$Env:ProgramFiles)\drasi\,/usr/local/bin/)

# Path to the OpenAPI specification file
SPEC_FILE = ../control-planes/mgmt_api/openapi.yaml

# Output path for the generated client
GENERATED_CLIENT = sdk/generated/api.gen.go

.PHONY: all
all: fmt vet
ifeq ($(IS_WINDOWS),true)
	$$env:GOOS = "windows"; $$env:GOARCH = "amd64"; go build -ldflags "-X drasi.io/cli/config.Version=$(VERSION)" -o bin/windows-x64/drasi.exe main.go
	$$env:GOOS = "linux"; $$env:GOARCH = "amd64"; go build -ldflags "-X drasi.io/cli/config.Version=$(VERSION)" -o bin/linux-x64/drasi main.go
	$$env:GOOS = "linux"; $$env:GOARCH = "arm64"; go build -ldflags "-X drasi.io/cli/config.Version=$(VERSION)" -o bin/linux-arm64/drasi main.go
	$$env:GOOS = "darwin"; $$env:GOARCH = "amd64"; go build -ldflags "-X drasi.io/cli/config.Version=$(VERSION)" -o bin/darwin-x64/drasi main.go
	$$env:GOOS = "darwin"; $$env:GOARCH = "arm64"; go build -ldflags "-X drasi.io/cli/config.Version=$(VERSION)" -o bin/darwin-arm64/drasi main.go
else
	GOOS=windows GOARCH=amd64 go build -ldflags "-X drasi.io/cli/config.Version=$(VERSION)" -o bin/windows-x64/drasi.exe main.go
	GOOS=linux GOARCH=amd64 go build -ldflags "-X drasi.io/cli/config.Version=$(VERSION)" -o bin/linux-x64/drasi main.go
	GOOS=linux GOARCH=arm64 go build -ldflags "-X drasi.io/cli/config.Version=$(VERSION)" -o bin/linux-arm64/drasi main.go
	GOOS=darwin GOARCH=amd64 go build -ldflags "-X drasi.io/cli/config.Version=$(VERSION)" -o bin/darwin-x64/drasi main.go
	GOOS=darwin GOARCH=arm64 go build -ldflags "-X drasi.io/cli/config.Version=$(VERSION)" -o bin/darwin-arm64/drasi main.go
endif
	
.PHONY: fmt
fmt:
	go fmt ./...

.PHONY: vet
vet:
	go vet ./...

.PHONY: build
build: fmt vet
ifeq ($(IS_WINDOWS),true)
	go build -ldflags "-X drasi.io/cli/config.Version=$(VERSION)" -o bin/drasi.exe main.go
else
	go build -ldflags "-X drasi.io/cli/config.Version=$(VERSION)" -o bin/drasi main.go
endif

.PHONY: install
install: build ## Installs a local build for development
	
ifeq ($(IS_WINDOWS),true)
	@echo "Installing the Drasi CLI";
	New-Item -ItemType Directory -Path "$(DRASI_LOCATION)" -Force; Copy-Item -Path bin\drasi.exe -Destination "$(DRASI_LOCATION)" -Force; $$currentPath = (Get-Item -Path HKCU:\Environment).GetValue('Path', $$null, 'DoNotExpandEnvironmentNames'); if (-Not ($$currentPath -like '*$(DRASI_LOCATION)*')) { Set-ItemProperty HKCU:\Environment "PATH" "$$currentPath;$(DRASI_LOCATION)" -Type ExpandString; $$env:PATH += ";$(DRASI_LOCATION)" }
else
	@echo "Installing the Drasi CLI"
	cp ./bin/drasi $(DRASI_LOCATION)
endif

## generate-api-client: Generates the Drasi API client from the OpenAPI spec
.PHONY: generate-api-client
generate-api-client:
	@echo "--> Generating Drasi API client..."
	@if ! command -v oapi-codegen &> /dev/null; then \
		echo "oapi-codegen not found. Please run: go install github.com/oapi-codegen/oapi-codegen/v2/cmd/oapi-codegen@latest"; \
		exit 1; \
	fi
	@mkdir -p sdk/generated
	oapi-codegen --generate "types,client" --package="generated" -o "$(GENERATED_CLIENT)" "$(SPEC_FILE)"
	@echo "--> API client generated successfully at $(GENERATED_CLIENT)"

