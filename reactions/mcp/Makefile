# Makefile for MCP Reaction

.PHONY: build run clean test docker-build

# Build the TypeScript project
build:
	npm run build

# Run the built application
run: build
	npm start

# Clean build artifacts
clean:
	rm -rf dist/
	rm -rf node_modules/

# Install dependencies
install:
	npm install

# Run tests (when available)
test:
	npm test

# Build Docker image
docker-build:
	docker build -f Dockerfile.default -t drasi-mcp-reaction .

# Build Docker image for Azure Linux
docker-build-azure:
	docker build -f Dockerfile.azure-linux -t drasi-mcp-reaction:azure-linux .