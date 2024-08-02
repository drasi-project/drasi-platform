
# Get the currently used golang install path (in GOPATH/bin, unless GOBIN is set)
ifeq (,$(shell go env GOBIN))
	GOBIN=$(shell go env GOPATH)/bin
else
	GOBIN=$(shell go env GOBIN)
endif

VERSION ?= latest

# Setting SHELL to bash allows bash commands to be executed by recipes.
# Options are set to exit when a recipe line exits non-zero or a piped command fails.
SHELL = /usr/bin/env bash -o pipefail
.SHELLFLAGS = -ec

.PHONY: all
all: build

.PHONY: fmt
fmt: ## Run go fmt against code.
	go fmt ./...

.PHONY: vet
vet: ## Run go vet against code.
	go vet ./...

##@ Build

.PHONY: build
build: fmt vet
	go build -ldflags "-X drasi.io/cli/config.Version=$(VERSION)" -o bin/drasi main.go

.PHONY: all
all: fmt vet
	GOOS=windows GOARCH=amd64 go build -ldflags "-X drasi.io/cli/config.version=$(VERSION)" -o bin/windows-x64/drasi.exe main.go
	GOOS=linux GOARCH=amd64 go build -ldflags "-X drasi.io/cli/config.version=$(VERSION)" -o bin/linux-x64/drasi main.go
	GOOS=linux GOARCH=arm64 go build -ldflags "-X drasi.io/cli/config.version=$(VERSION)" -o bin/linux-arm64/drasi main.go
	GOOS=darwin GOARCH=amd64 go build -ldflags "-X drasi.io/cli/config.version=$(VERSION)" -o bin/darwin-x64/drasi main.go
	GOOS=darwin GOARCH=arm64 go build -ldflags "-X drasi.io/cli/config.version=$(VERSION)" -o bin/darwin-arm64/drasi main.go
	