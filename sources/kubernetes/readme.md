# Kind

```
kind get kubeconfig | sed 's/127.0.0.1.*/kubernetes.default.svc/g' > .kubeconfig
```

```
kubectl create secret generic k8s-context --from-file=.kubeconfig
```

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
    key: .kubeconfig
```