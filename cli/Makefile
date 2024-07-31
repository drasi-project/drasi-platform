
# Get the currently used golang install path (in GOPATH/bin, unless GOBIN is set)
ifeq (,$(shell go env GOBIN))
	GOBIN=$(shell go env GOPATH)/bin
else
	GOBIN=$(shell go env GOBIN)
endif

# Setting SHELL to bash allows bash commands to be executed by recipes.
# Options are set to exit when a recipe line exits non-zero or a piped command fails.
SHELL = /usr/bin/env bash -o pipefail
.SHELLFLAGS = -ec

DRASI_LOCATION ?= /usr/local/bin/drasi

.PHONY: all
all: fmt vet
	GOOS=windows GOARCH=amd64 go build -o bin/windows-x64/drasi.exe main.go
	GOOS=linux GOARCH=amd64 go build -o bin/linux-x64/drasi main.go
	GOOS=linux GOARCH=arm64 go build -o bin/linux-arm64/drasi main.go
	GOOS=darwin GOARCH=amd64 go build -o bin/darwin-x64/drasi main.go
	GOOS=darwin GOARCH=arm64 go build -o bin/darwin-arm64/drasi main.go
	
.PHONY: fmt
fmt:
	go fmt ./...

.PHONY: vet
vet:
	go vet ./...

.PHONY: build
build: fmt vet
	go build -o bin/drasi main.go

.PHONY: install
install: build ## Installs a local build for development
	@echo "Installing Drasi"
	cp ./bin/drasi $(DRASI_LOCATION)