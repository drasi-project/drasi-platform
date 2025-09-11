# Drasi Contour Ingress Installation Examples

This document provides examples for using the new `drasi ingress install contour` command.

## Basic Usage

### Install with default settings
```bash
# Install Contour into the default namespace (projectcontour)
drasi ingress install contour
```

### Install into custom namespace
```bash
# Install into a specific namespace
drasi ingress install contour --namespace contour-system

# Or using the short flag
drasi ingress install contour -n ingress-system
```

### Install with wait for readiness
```bash
# Wait for Contour to be ready before completing
drasi ingress install contour --wait
```

## Advanced Configuration

### Using Custom Helm Values

Create a `values.yaml` file with your custom configuration:

```yaml
# contour-values.yaml
contour:
  replicas: 2
  service:
    type: LoadBalancer
    annotations:
      service.beta.kubernetes.io/aws-load-balancer-type: "nlb"

envoy:
  service:
    type: LoadBalancer
    externalTrafficPolicy: Local
  
  hostNetwork: false
  dnsPolicy: ClusterFirst

# Enable metrics
contour:
  prometheus:
    enabled: true
    port: 8000

envoy:
  prometheus:
    enabled: true
    port: 8002
```

Then install with the custom values:

```bash
drasi ingress install contour --config-file contour-values.yaml --wait
```

### Complete Example with All Options

```bash
# Install Contour with custom config, specific namespace, and wait for completion
drasi ingress install contour \
  --namespace production-ingress \
  --config-file production-contour-values.yaml \
  --wait
```

## Prerequisites

Before running the command, ensure:

1. **Kubernetes Access**: Configure kubectl with cluster access
   ```bash
   kubectl cluster-info
   ```

2. **Drasi Environment**: Set up Drasi environment configuration
   ```bash
   drasi env kube
   ```

3. **Permissions**: Ensure you have sufficient cluster permissions:
   - Create namespaces
   - Deploy workloads (Deployments, DaemonSets)
   - Create RBAC resources (ServiceAccounts, Roles, RoleBindings)
   - Create Services and ConfigMaps

## Verification

After installation, verify Contour is running:

```bash
# Check pods in the Contour namespace
kubectl get pods -n projectcontour

# Check services
kubectl get svc -n projectcontour

# Check ingress class
kubectl get ingressclass
```

## Troubleshooting

### Common Issues

1. **Permission Denied**
   - Ensure your kubectl context has cluster-admin or sufficient permissions
   - Check: `kubectl auth can-i create namespaces`

2. **Chart Pull Failure**
   - Verify internet connectivity to https://charts.bitnami.com/bitnami
   - Check firewall/proxy settings

3. **Installation Timeout**
   - Use `--wait` flag to see detailed progress
   - Check pod logs: `kubectl logs -n projectcontour deployment/contour`

### Getting Help

```bash
# View command help
drasi ingress install contour --help

# View all ingress commands  
drasi ingress --help
```