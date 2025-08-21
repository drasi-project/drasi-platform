package sdk

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	apierrors "k8s.io/apimachinery/pkg/api/errors"

	"drasi.io/cli/output"
	"drasi.io/cli/sdk/registry"
	"github.com/phayes/freeport"
	corev1 "k8s.io/api/core/v1"
	rbacv1 "k8s.io/api/rbac/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	corev1apply "k8s.io/client-go/applyconfigurations/core/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/client-go/tools/portforward"
	"k8s.io/client-go/transport/spdy"
)

type PlatformClient interface {
	CreateDrasiClient() (*ApiClient, error)
	CreateTunnel(resourceType string, resourceName string, localPort uint16) error
	SetSecret(name string, key string, value []byte) error
	DeleteSecret(name string, key string) error

	// Ingress management methods
	UpdateIngressConfig(drasiNamespace string, ingressClassName, ingressService, ingressNamespace, gatewayIPAddress string, output output.TaskOutput) error
	UpdateClusterRolePermissions(output output.TaskOutput) error
}

func NewPlatformClient(registration registry.Registration) (PlatformClient, error) {
	switch registration.GetKind() {
	case registry.Kubernetes:
		k8sConfig, ok := registration.(*registry.KubernetesConfig)
		if !ok {
			return nil, errors.New("invalid Kubernetes config")
		}
		return MakeKubernetesPlatformClient(k8sConfig)
	case registry.Docker:
		dockerConfig, ok := registration.(*registry.DockerConfig)
		if !ok {
			return nil, errors.New("invalid Docker config")
		}
		return NewPlatformClient(dockerConfig.InternalConfig)
	default:
		return nil, fmt.Errorf("unsupported platform kind: %s", registration.GetKind())
	}
}

type KubernetesPlatformClient struct {
	kubeClient    *kubernetes.Clientset
	kubeConfig    *rest.Config
	clientConfig  clientcmd.ClientConfig
	kubeNamespace string
}

func MakeKubernetesPlatformClient(configuration *registry.KubernetesConfig) (*KubernetesPlatformClient, error) {

	config, err := clientcmd.NewClientConfigFromBytes(configuration.KubeConfig)
	if err != nil {
		return nil, err
	}

	restConfig, err := config.ClientConfig()

	if err != nil {
		return nil, err
	}

	kubeClient, err := kubernetes.NewForConfig(restConfig)
	if err != nil {
		return nil, err
	}

	return &KubernetesPlatformClient{
		kubeClient:    kubeClient,
		kubeConfig:    restConfig,
		kubeNamespace: configuration.Namespace,
		clientConfig:  config,
	}, nil

}

func (t *KubernetesPlatformClient) CreateDrasiClient() (*ApiClient, error) {
	port, err := freeport.GetFreePort()
	if err != nil {
		return nil, err
	}
	result := ApiClient{
		port:   int32(port),
		stopCh: make(chan struct{}, 1),
	}

	err = t.createManagementApiTunnel(&result)
	if err != nil {
		return nil, err
	}

	result.prefix = fmt.Sprintf("http://localhost:%d", result.port)
	result.client = &http.Client{
		Timeout: 30 * time.Second,
	}
	result.streamClient = &http.Client{}

	return &result, nil
}

func (t *KubernetesPlatformClient) GetNamespace() string {
	return t.kubeNamespace
}

func (t *KubernetesPlatformClient) GetKubeConfig() *rest.Config {
	return t.kubeConfig
}

func (t *KubernetesPlatformClient) GetClientConfig() clientcmd.ClientConfig {
	return t.clientConfig
}

func (t *KubernetesPlatformClient) GetKubeClient() *kubernetes.Clientset {
	return t.kubeClient
}

// Retrieve the name of all namespaces that have the label
// "drasi.io/namespace": "true"
func (t *KubernetesPlatformClient) ListNamespaces() ([]string, error) {
	namespaces, err := t.kubeClient.CoreV1().Namespaces().List(context.TODO(), metav1.ListOptions{
		LabelSelector: "drasi.io/namespace=true",
	})
	if err != nil {
		return nil, err
	}

	var nsList []string
	for _, ns := range namespaces.Items {
		nsList = append(nsList, ns.Name)
	}

	return nsList, nil
}

func (t *KubernetesPlatformClient) CreateTunnel(resourceType string, resourceName string, localPort uint16) error {
	pod, err := t.getResourcePod(resourceType, resourceName)
	if err != nil {
		return err
	}

	namespace := t.kubeNamespace
	proxyURL := &url.URL{
		Scheme: "https",
		Path:   fmt.Sprintf("/api/v1/namespaces/%s/pods/%s/portforward", namespace, pod.Pod),
		Host:   strings.TrimPrefix(t.kubeConfig.Host, "https://"),
	}

	transport, upgrader, err := spdy.RoundTripperFor(t.kubeConfig)
	if err != nil {
		return err
	}

	dialer := spdy.NewDialer(upgrader, &http.Client{Transport: transport}, http.MethodPost, proxyURL)

	readyCh := make(chan struct{})

	stopCh := make(chan struct{}, 1)
	pf, err := portforward.New(dialer, []string{fmt.Sprintf("%d:%d", localPort, pod.Port)}, stopCh, readyCh, os.Stdout, os.Stderr)
	if err != nil {
		return err
	}

	go func() {
		err = pf.ForwardPorts()
		if err != nil {
			panic(err)
		}
	}()

	<-readyCh

	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)
	<-c
	close(stopCh)

	return nil
}

func (t *KubernetesPlatformClient) SetSecret(name string, key string, value []byte) error {
	secret, err := t.kubeClient.CoreV1().Secrets(t.kubeNamespace).Get(context.TODO(), name, v1.GetOptions{})
	if err != nil {
		if apierrors.IsNotFound(err) {
			secret = &corev1.Secret{
				ObjectMeta: v1.ObjectMeta{
					Name:      name,
					Namespace: t.kubeNamespace,
				},
				Data: map[string][]byte{
					key: value,
				},
			}
			_, err = t.kubeClient.CoreV1().Secrets(t.kubeNamespace).Create(context.TODO(), secret, v1.CreateOptions{})
			if err != nil {
				return err
			}
			return nil
		}
		return err
	}

	// Secret exists, update it
	if secret.Data == nil {
		secret.Data = make(map[string][]byte)
	}

	secret.Data[key] = value

	_, err = t.kubeClient.CoreV1().Secrets(t.kubeNamespace).Update(context.TODO(), secret, v1.UpdateOptions{})
	if err != nil {
		return err
	}

	return nil
}

func (t *KubernetesPlatformClient) DeleteSecret(name string, key string) error {
	secret, err := t.kubeClient.CoreV1().Secrets(t.kubeNamespace).Get(context.TODO(), name, v1.GetOptions{})
	if err != nil {
		return err
	}

	if secret.Data == nil {
		return nil
	}

	delete(secret.Data, key)

	_, err = t.kubeClient.CoreV1().Secrets(t.kubeNamespace).Update(context.TODO(), secret, v1.UpdateOptions{})
	if err != nil {
		return err
	}

	return nil
}

func (t *KubernetesPlatformClient) createManagementApiTunnel(apiClient *ApiClient) error {
	podName, err := t.getApiPodName()
	if err != nil {
		return err
	}

	namespace := t.kubeNamespace
	proxyURL := &url.URL{
		Scheme: "https",
		Path:   fmt.Sprintf("/api/v1/namespaces/%s/pods/%s/portforward", namespace, podName),
		Host:   strings.TrimPrefix(t.kubeConfig.Host, "https://"),
	}

	transport, upgrader, err := spdy.RoundTripperFor(t.kubeConfig)
	if err != nil {
		return err
	}

	dialer := spdy.NewDialer(upgrader, &http.Client{Transport: transport}, http.MethodPost, proxyURL)

	readyCh := make(chan struct{})

	sigs := make(chan os.Signal, 1)
	signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM)
	go func() {
		<-sigs
		close(apiClient.stopCh)
	}()

	pf, err := portforward.New(dialer, []string{fmt.Sprintf("%d:%d", apiClient.port, 8080)}, apiClient.stopCh, readyCh, nil, os.Stderr)
	if err != nil {
		return err
	}

	go func() {
		err = pf.ForwardPorts()
		if err != nil {
			panic(err)
		}
	}()

	<-readyCh

	return nil
}

func (t *KubernetesPlatformClient) getApiPodName() (string, error) {
	namespace := t.kubeNamespace
	ep, err := t.kubeClient.CoreV1().Endpoints(namespace).Get(context.TODO(), "drasi-api", v1.GetOptions{})
	if err != nil {
		return "", err
	}

	for _, subset := range ep.Subsets {
		for _, addr := range subset.Addresses {
			if addr.TargetRef.Kind == "Pod" {
				return addr.TargetRef.Name, nil
			}
		}
	}
	return "", errors.New("drasi API not available")
}

type ResourcePodPort struct {
	Pod  string
	Port int32
}

func (t *KubernetesPlatformClient) getResourcePod(resourceType string, resourceName string) (*ResourcePodPort, error) {
	namespace := t.kubeNamespace
	endpoints, err := t.kubeClient.CoreV1().Endpoints(namespace).List(context.TODO(), v1.ListOptions{
		LabelSelector: fmt.Sprintf("drasi/type=%s,drasi/resource=%s", resourceType, resourceName),
	})
	if err != nil {
		return nil, err
	}

	for _, ep := range endpoints.Items {
		for _, subset := range ep.Subsets {
			for _, addr := range subset.Addresses {
				if addr.TargetRef.Kind == "Pod" {
					if len(subset.Ports) == 1 {
						return &ResourcePodPort{
							Pod:  addr.TargetRef.Name,
							Port: subset.Ports[0].Port,
						}, nil
					}
				}
			}
		}
	}

	return nil, errors.New(resourceName + " not available")
}

// UpdateIngressConfig updates the drasi-config ConfigMap with ingress controller configuration
// For regular ingress controllers, provide ingressService and ingressNamespace, leave gatewayIPAddress empty
// For AGIC, provide ingressClassName and gatewayIPAddress, leave ingressService and ingressNamespace empty
func (k *KubernetesPlatformClient) UpdateIngressConfig(drasiNamespace string, ingressClassName, ingressService, ingressNamespace, gatewayIPAddress string, output output.TaskOutput) error {
	taskName := "Ingress-Config"

	kubeConfig := k.GetKubeConfig()
	kubeClient, err := kubernetes.NewForConfig(kubeConfig)
	if err != nil {
		output.FailTask(taskName, fmt.Sprintf("Error creating Kubernetes client: %v", err))
		return err
	}

	currentConfigMap, err := kubeClient.CoreV1().ConfigMaps(drasiNamespace).Get(context.TODO(), "drasi-config", metav1.GetOptions{})
	if err != nil {
		output.FailTask(taskName, fmt.Sprintf("Error getting drasi-config ConfigMap: %v", err))
		return err
	}

	// Update the ConfigMap data with ingress configuration
	cfg := currentConfigMap.Data
	if cfg == nil {
		cfg = make(map[string]string)
	}

	// Clear all ingress-related configuration first
	delete(cfg, "INGRESS_CLASS_NAME")
	delete(cfg, "INGRESS_LOAD_BALANCER_SERVICE")
	delete(cfg, "INGRESS_LOAD_BALANCER_NAMESPACE")
	delete(cfg, "INGRESS_TYPE")
	delete(cfg, "AGIC_GATEWAY_IP")

	// Add values only if they are not empty strings
	if ingressClassName != "" {
		cfg["INGRESS_CLASS_NAME"] = ingressClassName
	}
	if ingressService != "" {
		cfg["INGRESS_LOAD_BALANCER_SERVICE"] = ingressService
	}
	if ingressNamespace != "" {
		cfg["INGRESS_LOAD_BALANCER_NAMESPACE"] = ingressNamespace
	}
	if gatewayIPAddress != "" {
		cfg["INGRESS_TYPE"] = "agic"
		cfg["AGIC_GATEWAY_IP"] = gatewayIPAddress
	}

	// Apply the updated ConfigMap
	configMap := corev1apply.ConfigMap("drasi-config", drasiNamespace).WithData(cfg)
	if _, err := kubeClient.CoreV1().ConfigMaps(drasiNamespace).Apply(context.TODO(), configMap, metav1.ApplyOptions{
		FieldManager: "drasi-ingress",
		Force:        true,
	}); err != nil {
		output.FailTask(taskName, fmt.Sprintf("Error updating ConfigMap: %v", err))
		return err
	}

	if gatewayIPAddress != "" {
		output.SucceedTask(taskName, "AGIC configuration updated")
	} else {
		output.SucceedTask(taskName, "Ingress configuration updated")
	}
	return nil
}

// UpdateClusterRolePermissions updates the ClusterRole to grant service access in the specified namespace
func (k *KubernetesPlatformClient) UpdateClusterRolePermissions(output output.TaskOutput) error {
	output.AddTask("RBAC-Update", "Updating ClusterRole permissions for ingress namespace")

	kubeConfig := k.GetKubeConfig()
	kubeClient, err := kubernetes.NewForConfig(kubeConfig)
	if err != nil {
		output.FailTask("RBAC-Update", fmt.Sprintf("Error creating Kubernetes client: %v", err))
		return err
	}

	clusterRoleName := "drasi-resource-provider-cluster-role"

	// Get current ClusterRole
	currentClusterRole, err := kubeClient.RbacV1().ClusterRoles().Get(context.TODO(), clusterRoleName, metav1.GetOptions{})
	if err != nil {
		output.FailTask("RBAC-Update", fmt.Sprintf("Error getting ClusterRole: %v", err))
		return err
	}

	// Check if we already have generic service permissions
	hasGenericServiceAccess := false
	for _, rule := range currentClusterRole.Rules {
		for _, apiGroup := range rule.APIGroups {
			if apiGroup == "" { // Core API group
				for _, resource := range rule.Resources {
					if resource == "services" {
						hasGet := false
						hasList := false
						for _, verb := range rule.Verbs {
							if verb == "get" {
								hasGet = true
							}
							if verb == "list" {
								hasList = true
							}
						}
						if hasGet && hasList && len(rule.ResourceNames) == 0 {
							hasGenericServiceAccess = true
							break
						}
					}
				}
			}
		}
		if hasGenericServiceAccess {
			break
		}
	}

	if hasGenericServiceAccess {
		output.InfoTask("RBAC-Update", "ClusterRole already has generic service access")
		output.SucceedTask("RBAC-Update", "No ClusterRole update needed")
		return nil
	}

	// Update the ClusterRole to have generic service access
	var updatedRules []rbacv1.PolicyRule
	for _, rule := range currentClusterRole.Rules {
		// Skip service rules with resourceNames (e.g., contour-envoy specific rule)
		isServiceRuleWithNames := false
		for _, apiGroup := range rule.APIGroups {
			if apiGroup == "" {
				for _, resource := range rule.Resources {
					if resource == "services" && len(rule.ResourceNames) > 0 {
						isServiceRuleWithNames = true
						break
					}
				}
			}
		}
		if !isServiceRuleWithNames {
			updatedRules = append(updatedRules, rule)
		}
	}

	updatedRules = append(updatedRules, rbacv1.PolicyRule{
		APIGroups: []string{""},
		Resources: []string{"services"},
		Verbs:     []string{"get", "list"},
	})

	// Update the ClusterRole
	currentClusterRole.Rules = updatedRules
	_, err = kubeClient.RbacV1().ClusterRoles().Update(context.TODO(), currentClusterRole, metav1.UpdateOptions{})
	if err != nil {
		output.FailTask("RBAC-Update", fmt.Sprintf("Error updating ClusterRole: %v", err))
		return err
	}

	output.SucceedTask("RBAC-Update", "ClusterRole updated")
	return nil
}
