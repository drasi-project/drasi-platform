# Drasi CLI Ingress Commands

The Drasi CLI provides commands to install and manage ingress controllers for exposing Drasi services externally in Kubernetes environments.

## Overview

Ingress controllers are essential for providing external access to Drasi services in Kubernetes clusters. The `drasi ingress` command simplifies the installation and configuration of popular ingress controllers, starting with Contour.

## Commands

### `drasi ingress install contour`

Installs and configures the Contour ingress controller for use with Drasi services.

#### Synopsis

```bash
drasi ingress install contour [flags]
```

#### Description

This command automates the installation of the Contour ingress controller, including:
- Deploying Contour components (Contour controller and Envoy proxy)
- Setting up appropriate RBAC permissions
- Configuring ingress resources for Drasi services
- Validating the installation

#### Options

| Flag | Description | Default | Required |
|------|-------------|---------|----------|
| `--namespace` | Kubernetes namespace for installation | `drasi-system` | No |
| `--config-file` | Path to custom configuration file | | No |
| `--wait` | Wait for ingress controller to be ready | `false` | No |
| `--timeout` | Timeout for wait operations | `300s` | No |
| `--dry-run` | Preview installation without applying changes | `false` | No |
| `--version` | Contour version to install | `latest` | No |

#### Examples

**Basic installation:**
```bash
drasi ingress install contour
```

**Install in custom namespace:**
```bash
drasi ingress install contour --namespace my-drasi-system
```

**Install with custom configuration:**
```bash
drasi ingress install contour --config-file ./contour-config.yaml
```

**Install and wait for readiness:**
```bash
drasi ingress install contour --wait --timeout 600s
```

**Preview installation (dry run):**
```bash
drasi ingress install contour --dry-run
```

**Install specific version:**
```bash
drasi ingress install contour --version 1.28.0
```

## Configuration File Format

When using the `--config-file` option, provide a YAML file with the following structure. See [examples/contour-config.yaml](examples/contour-config.yaml) for a complete example configuration.

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
        annotations:
          service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
    replicas: 2
    resources:
      requests:
        cpu: 100m
        memory: 128Mi
      limits:
        cpu: 500m
        memory: 512Mi
  drasi:
    services:
      - name: management-api
        port: 8080
        host: drasi-api.example.com
        path: /
        tls:
          enabled: true
          secretName: drasi-api-tls
      - name: query-container
        port: 8081
        host: drasi-query.example.com
        path: /
```

### Configuration Options

#### Contour Section
- `version`: Contour version to install
- `envoy.service.type`: Kubernetes service type (ClusterIP, NodePort, LoadBalancer)
- `envoy.service.annotations`: Service annotations for cloud provider integration
- `replicas`: Number of Contour controller replicas
- `resources`: Resource requests and limits

#### Drasi Services Section
- `name`: Drasi service name
- `port`: Service port
- `host`: Hostname for external access
- `path`: URL path (default: "/")
- `tls.enabled`: Enable TLS termination
- `tls.secretName`: Kubernetes secret containing TLS certificates

## Prerequisites

Before installing an ingress controller, ensure:

1. **Kubernetes Cluster**: Running Kubernetes cluster (version 1.21+)
2. **RBAC Permissions**: Cluster admin or appropriate RBAC permissions
3. **Drasi Installation**: Drasi platform is already installed
4. **Network Access**: Cluster can pull container images from public registries

### Required Permissions

The CLI requires the following Kubernetes permissions:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: drasi-ingress-installer
rules:
- apiGroups: [""]
  resources: ["namespaces", "services", "configmaps", "secrets"]
  verbs: ["get", "list", "create", "update", "patch"]
- apiGroups: ["apps"]
  resources: ["deployments", "daemonsets"]
  verbs: ["get", "list", "create", "update", "patch"]
- apiGroups: ["rbac.authorization.k8s.io"]
  resources: ["clusterroles", "clusterrolebindings", "roles", "rolebindings"]
  verbs: ["get", "list", "create", "update", "patch"]
- apiGroups: ["networking.k8s.io"]
  resources: ["ingresses", "ingressclasses"]
  verbs: ["get", "list", "create", "update", "patch"]
- apiGroups: ["projectcontour.io"]
  resources: ["httpproxies", "tlscertificatedelegations"]
  verbs: ["get", "list", "create", "update", "patch"]
```

## Validation and Status

After installation, you can verify the ingress controller status:

### Check Ingress Controller Pods
```bash
kubectl get pods -n drasi-system -l app=contour
kubectl get pods -n drasi-system -l app=envoy
```

### Check Services
```bash
kubectl get services -n drasi-system -l app=envoy
```

### Check Ingress Resources
```bash
kubectl get ingress -n drasi-system
kubectl get httpproxy -n drasi-system  # For Contour HTTPProxy resources
```

## Troubleshooting

### Common Issues

#### 1. Installation Fails with Permission Errors

**Symptoms:**
```
Error: failed to create ClusterRole: clusterroles.rbac.authorization.k8s.io is forbidden
```

**Solution:**
Ensure you have cluster admin privileges or the required RBAC permissions listed above.

```bash
kubectl auth can-i create clusterroles
kubectl auth can-i create clusterrolebindings
```

#### 2. Ingress Controller Pods Not Starting

**Symptoms:**
```bash
$ kubectl get pods -n drasi-system
NAME                       READY   STATUS    RESTARTS   AGE
contour-7b8c4d4f5b-xxxxx   0/1     Pending   0          5m
```

**Solution:**
Check resource availability and node selectors:

```bash
kubectl describe pod -n drasi-system -l app=contour
kubectl get nodes
kubectl top nodes  # Check resource usage
```

#### 3. External Access Not Working

**Symptoms:**
- Services are running but not accessible externally
- DNS resolution fails

**Solution:**
1. Verify LoadBalancer service has external IP:
```bash
kubectl get service -n drasi-system envoy
```

2. Check DNS configuration:
```bash
nslookup drasi-api.example.com
```

3. Verify ingress resources:
```bash
kubectl get ingress -n drasi-system
kubectl describe ingress -n drasi-system <ingress-name>
```

#### 4. TLS Certificate Issues

**Symptoms:**
- SSL/TLS errors when accessing services
- Certificate warnings in browsers

**Solution:**
1. Verify TLS secret exists:
```bash
kubectl get secret -n drasi-system <tls-secret-name>
```

2. Check certificate validity:
```bash
kubectl get secret -n drasi-system <tls-secret-name> -o yaml
```

3. For self-signed certificates, ensure proper CA configuration

#### 5. Configuration File Validation Errors

**Symptoms:**
```
Error: invalid configuration file: unknown field "xyz"
```

**Solution:**
- Verify YAML syntax and indentation
- Check against the configuration file format documentation above
- Use `--dry-run` to validate configuration before applying

### Getting Help

For additional troubleshooting:

1. **Enable Debug Logging:**
```bash
drasi ingress install contour --verbose --dry-run
```

2. **Check Contour Logs:**
```bash
kubectl logs -n drasi-system -l app=contour
kubectl logs -n drasi-system -l app=envoy
```

3. **Validate Cluster State:**
```bash
kubectl cluster-info
kubectl get nodes
kubectl get namespaces
```

## Advanced Configuration

### Custom Resource Limits

For production environments, consider setting appropriate resource limits:

```yaml
spec:
  contour:
    resources:
      requests:
        cpu: 200m
        memory: 256Mi
      limits:
        cpu: 1000m
        memory: 1Gi
    envoy:
      resources:
        requests:
          cpu: 200m
          memory: 256Mi
        limits:
          cpu: 1000m
          memory: 1Gi
```

### Network Policies

If using network policies, ensure proper communication between components:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: contour-ingress
  namespace: drasi-system
spec:
  podSelector:
    matchLabels:
      app: contour
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: envoy
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: drasi
```

## Related Documentation

- [Ingress Support Design Document](../../ingress-support.md)
- [Contour Project Documentation](https://projectcontour.io/docs/)
- [Kubernetes Ingress Documentation](https://kubernetes.io/docs/concepts/services-networking/ingress/)
- [Drasi Getting Started Guide](https://drasi.io/getting-started/)

## Next Steps

After successfully installing the ingress controller:

1. Configure DNS records to point to the ingress controller's external IP
2. Set up TLS certificates for secure communication
3. Configure monitoring and alerting for the ingress controller
4. Review and adjust resource limits based on usage patterns