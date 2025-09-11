# Drasi Ingress Support Design Document

## Overview

This design document outlines the approach for adding ingress controller support to Drasi, enabling users to easily configure ingress controllers (starting with Contour) through the Drasi CLI. This enhancement will provide a streamlined way to expose Drasi services and set up external access patterns for Drasi deployments.

## Problem Statement

Currently, users need to manually configure ingress controllers and ingress resources when deploying Drasi in Kubernetes environments where external access is required. This manual configuration can be error-prone and creates additional operational overhead. 

Key challenges:
- Complex manual setup of ingress controllers like Contour, NGINX, or Traefik
- Lack of standardized ingress configuration for Drasi services
- No built-in validation or troubleshooting for ingress configurations
- Inconsistent approaches across different deployment environments

## Goals

1. **Simplified Installation**: Provide a simple CLI command to install and configure ingress controllers
2. **Standardized Configuration**: Ensure consistent ingress setup across different environments
3. **Validation and Troubleshooting**: Include built-in validation and troubleshooting capabilities
4. **Extensibility**: Design with support for multiple ingress controllers in mind

## Phase 1: CLI Foundation

### Scope

The first phase focuses on establishing the CLI infrastructure and support for Contour ingress controller.

### CLI Command Structure

```bash
drasi ingress install contour [options]
```

### Command Options

- `--namespace`: Specify the Kubernetes namespace for installation (default: drasi-system)
- `--config-file`: Path to custom configuration file for advanced settings
- `--wait`: Wait for ingress controller to be ready before returning
- `--timeout`: Timeout for wait operations (default: 300s)
- `--dry-run`: Preview the installation without applying changes
- `--version`: Specify the Contour version to install

### Features

1. **Automated Installation**: Install Contour ingress controller with appropriate RBAC and service configurations
2. **Configuration Management**: Support for custom configuration files and common configuration options
3. **Status Validation**: Verify successful installation and readiness
4. **Integration**: Automatically configure ingress resources for existing Drasi services

### Implementation Details

#### Installation Process

1. **Prerequisites Check**: Validate Kubernetes cluster compatibility and permissions
2. **Namespace Setup**: Create or validate the target namespace
3. **Contour Deployment**: Install Contour using Helm charts or YAML manifests
4. **Service Configuration**: Configure Contour to work with Drasi services
5. **Validation**: Verify installation success and service readiness

#### Configuration File Format

Support for YAML configuration files with the following structure:

```yaml
apiVersion: drasi.io/v1
kind: IngressConfig
metadata:
  name: contour-config
spec:
  contour:
    version: "1.28.0"
    envoy:
      service:
        type: LoadBalancer
    replicas: 2
  drasi:
    services:
      - name: management-api
        port: 8080
        host: drasi-api.example.com
      - name: query-container
        port: 8081
        host: drasi-query.example.com
```

## Future Phases

### Phase 2: Multi-Controller Support
- Add support for NGINX Ingress Controller
- Add support for Traefik
- Implement controller selection and comparison

### Phase 3: Advanced Features
- TLS/SSL certificate management integration
- Advanced routing rules and configuration
- Monitoring and observability integration
- Multi-cluster ingress support

## Success Criteria

1. Users can install Contour with a single CLI command
2. Installation includes proper validation and error handling
3. Configuration is standardized and repeatable
4. Troubleshooting information is readily available
5. Integration with existing Drasi workflow is seamless

## Dependencies

- Kubernetes cluster with appropriate RBAC permissions
- Helm 3.x (if using Helm-based installation)
- Drasi CLI infrastructure for command registration and execution

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Kubernetes version compatibility | High | Test across supported K8s versions, provide version matrix |
| Permission requirements | Medium | Clear documentation of required RBAC permissions |
| Network policy conflicts | Medium | Provide network policy templates and troubleshooting |
| Resource constraints | Low | Resource requirement documentation and validation |

## Testing Strategy

1. **Unit Tests**: CLI command parsing and validation logic
2. **Integration Tests**: Full installation workflow in test clusters
3. **E2E Tests**: End-to-end scenarios with Drasi services and ingress
4. **Compatibility Tests**: Multiple Kubernetes versions and ingress controller versions

## Documentation Requirements

1. **User Guide**: Step-by-step installation and configuration guide
2. **Reference Documentation**: Complete CLI command reference
3. **Troubleshooting Guide**: Common issues and resolution steps
4. **Examples**: Common configuration patterns and use cases

---

*This design document is a living document and will be updated as implementation progresses and requirements evolve.*