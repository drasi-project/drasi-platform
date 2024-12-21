# Drasi Kubernetes Source

## Configuration

This source requires a Kubernetes configuration context that specifies the cluster to connect to and the credentials to use.  The best way to do this is to extract and store this configuration is a secret.  The following scripts can be used to extract and store this config in a secret called `k8s-context` with the key of `context`, depending on your environment.

### Extract and store kube context

#### Using Kind

```shell
kind get kubeconfig | sed 's/127.0.0.1.*/kubernetes.default.svc/g' | kubectl create secret generic k8s-context --from-file=context=/dev/stdin -n drasi-system
```

#### Using k3d

```shell
k3d kubeconfig get k3s-default | sed 's/0.0.0.0.*/kubernetes.default.svc/g' | kubectl create secret generic k8s-context --from-file=context=/dev/stdin -n drasi-system
```

#### Using AKS

```shell
az aks get-credentials --resource-group <resource-group> --name <cluster-name> --file - | kubectl create secret generic k8s-context --from-file=context=/dev/stdin -n drasi-system
```

### Permissions

The credentials supplied by the kube context should have the following permissions:

| Resource               | Verbs       |
|------------------------|-------------|
| Pod                    | list, watch |
| Deployment             | list, watch |
| ReplicaSet             | list, watch |
| StatefulSet            | list, watch |
| DaemonSet              | list, watch |
| Job                    | list, watch |
| Service                | list, watch |
| ServiceAccount         | list, watch |
| Node                   | list, watch |
| Ingress                | list, watch |
| PersistentVolume       | list, watch |
| PersistentVolumeClaim  | list, watch |


### Create a source using the secret

```yaml
apiVersion: v1
kind: Source
name: k8s
spec:
  kind: Kubernetes 
  properties:
  kubeConfig: 
    kind: Secret
    name: k8s-context
    key: context
```