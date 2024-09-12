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
	@echo "Installing Drasi";
	New-Item -ItemType Directory -Path "$(DRASI_LOCATION)" -Force; Copy-Item -Path bin\drasi.exe -Destination "$(DRASI_LOCATION)" -Force; $$currentPath = (Get-Item -Path HKCU:\Environment).GetValue('Path', $$null, 'DoNotExpandEnvironmentNames'); if (-Not ($$currentPath -like '*$(DRASI_LOCATION)*')) { Set-ItemProperty HKCU:\Environment "PATH" "$$currentPath;$(DRASI_LOCATION)" -Type ExpandString; $$env:PATH += ";$(DRASI_LOCATION)" }
else
	@echo "Installing Drasi"
	cp ./bin/drasi $(DRASI_LOCATION)
endif

