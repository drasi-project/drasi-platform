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

# Pin oapi-codegen version for reproducible builds and supply chain security
OAPI_CODEGEN_VERSION = v2.5.1

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
## Note: Some schemas with oneOf discriminators are excluded due to missing mappings in the spec.
## These are defined manually in sdk/generated/types_extra.go
.PHONY: generate-api-client
generate-api-client:
	@echo "--> Generating Drasi API client..."
	@if [ ! -f "$(GOBIN)/oapi-codegen" ]; then \
		echo "oapi-codegen not found at $(GOBIN)/oapi-codegen"; \
		echo "Installing oapi-codegen@$(OAPI_CODEGEN_VERSION)..."; \
		go install github.com/oapi-codegen/oapi-codegen/v2/cmd/oapi-codegen@$(OAPI_CODEGEN_VERSION); \
	fi
	@mkdir -p sdk/generated
	$(GOBIN)/oapi-codegen --generate "types,client" --package="generated" \
		--exclude-schemas "ConfigValueDto,ServiceIdentityDto,StorageSpecDto,ResultEventDto,ControlMessage" \
		-o "$(GENERATED_CLIENT)" "$(SPEC_FILE)"
	@echo "--> API client generated successfully at $(GENERATED_CLIENT)"
	@echo "--> Note: Excluded schemas are defined in sdk/generated/types_extra.go"

## verify-generated: Verifies that generated code is up to date with the OpenAPI spec
## Use this in CI to catch drift between the spec and generated code
.PHONY: verify-generated
verify-generated: generate-api-client
	@git diff --exit-code $(GENERATED_CLIENT) || \
		(echo "ERROR: Generated code is out of date. Run 'make generate-api-client' and commit the changes." && exit 1)
	@echo "--> Generated code is up to date"

