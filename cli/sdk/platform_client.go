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
	generated "drasi.io/cli/sdk/generated"
	"drasi.io/cli/sdk/registry"
	"github.com/phayes/freeport"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	corev1apply "k8s.io/client-go/applyconfigurations/core/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/client-go/tools/portforward"
	"k8s.io/client-go/transport/spdy"
)

// IngressConfig holds ingress controller configuration parameters
type IngressConfig struct {
	IngressClassName   string
	IngressService     string
	IngressNamespace   string
	GatewayIPAddress   string
	IngressAnnotations map[string]string
}

type PlatformClient interface {
	CreateDrasiClient() (DrasiClient, error)
	CreateTunnel(resourceType string, resourceName string, localPort uint16) error
	SetSecret(name string, key string, value []byte) error
	DeleteSecret(name string, key string) error

	// Ingress management methods
	UpdateIngressConfig(config *IngressConfig, output output.TaskOutput) error
	GetIngressURL(resourceName string) string
	DisplayIngressInfo(resourceName string, spec interface{}, output output.TaskOutput)
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

func (t *KubernetesPlatformClient) CreateDrasiClient() (DrasiClient, error) {
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

	// Initialize the generated OpenAPI client
	genClient, err := generated.NewClient(result.prefix, generated.WithHTTPClient(result.client))
	if err != nil {
		return nil, fmt.Errorf("failed to initialize OpenAPI client: %w", err)
	}
	result.generatedClient = genClient

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
	secret, err := t.kubeClient.CoreV1().Secrets(t.kubeNamespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		if apierrors.IsNotFound(err) {
			secret = &corev1.Secret{
				ObjectMeta: metav1.ObjectMeta{
					Name:      name,
					Namespace: t.kubeNamespace,
				},
				Data: map[string][]byte{
					key: value,
				},
			}
			_, err = t.kubeClient.CoreV1().Secrets(t.kubeNamespace).Create(context.TODO(), secret, metav1.CreateOptions{})
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

	_, err = t.kubeClient.CoreV1().Secrets(t.kubeNamespace).Update(context.TODO(), secret, metav1.UpdateOptions{})
	if err != nil {
		return err
	}

	return nil
}

func (t *KubernetesPlatformClient) DeleteSecret(name string, key string) error {
	secret, err := t.kubeClient.CoreV1().Secrets(t.kubeNamespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		return err
	}

	if secret.Data == nil {
		return nil
	}

	delete(secret.Data, key)

	_, err = t.kubeClient.CoreV1().Secrets(t.kubeNamespace).Update(context.TODO(), secret, metav1.UpdateOptions{})
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
	endpointSlices, err := t.kubeClient.DiscoveryV1().EndpointSlices(namespace).List(context.TODO(), metav1.ListOptions{
		LabelSelector: "kubernetes.io/service-name=drasi-api",
	})
	if err != nil {
		return "", err
	}

	for _, endpointSlice := range endpointSlices.Items {
		for _, endpoint := range endpointSlice.Endpoints {
			if endpoint.TargetRef != nil && endpoint.TargetRef.Kind == "Pod" {
				return endpoint.TargetRef.Name, nil
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
	endpointSlices, err := t.kubeClient.DiscoveryV1().EndpointSlices(namespace).List(context.TODO(), metav1.ListOptions{
		LabelSelector: fmt.Sprintf("drasi/type=%s,drasi/resource=%s", resourceType, resourceName),
	})
	if err != nil {
		return nil, err
	}

	for _, endpointSlice := range endpointSlices.Items {
		for _, endpoint := range endpointSlice.Endpoints {
			if endpoint.TargetRef != nil && endpoint.TargetRef.Kind == "Pod" {
				if len(endpointSlice.Ports) == 1 {
					return &ResourcePodPort{
						Pod:  endpoint.TargetRef.Name,
						Port: *endpointSlice.Ports[0].Port,
					}, nil
				}
			}
		}
	}

	return nil, errors.New(resourceName + " not available")
}

// UpdateIngressConfig updates the drasi-config ConfigMap with ingress controller configuration
// For regular ingress controllers, provide IngressService and IngressNamespace, leave GatewayIPAddress empty
// For controllers that need a specific IP (like AGIC), provide GatewayIPAddress
func (k *KubernetesPlatformClient) UpdateIngressConfig(config *IngressConfig, output output.TaskOutput) error {
	taskName := "Ingress-Config"
	output.AddTask(taskName, "Updating ingress configuration")

	kubeClient := k.kubeClient
	drasiNamespace := k.kubeNamespace

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
	delete(cfg, "INGRESS_IP")
	delete(cfg, "INGRESS_ANNOTATIONS")

	// Add values only if they are not empty strings
	if config.IngressClassName != "" {
		cfg["INGRESS_CLASS_NAME"] = config.IngressClassName
	}
	if config.IngressService != "" {
		cfg["INGRESS_LOAD_BALANCER_SERVICE"] = config.IngressService
	}
	if config.IngressNamespace != "" {
		cfg["INGRESS_LOAD_BALANCER_NAMESPACE"] = config.IngressNamespace
	}
	if config.GatewayIPAddress != "" {
		cfg["INGRESS_IP"] = config.GatewayIPAddress
	}

	// Add annotations if provided
	if len(config.IngressAnnotations) > 0 {
		var annotationPairs []string
		for key, value := range config.IngressAnnotations {
			annotationPairs = append(annotationPairs, fmt.Sprintf("%s=%s", key, value))
		}
		cfg["INGRESS_ANNOTATIONS"] = strings.Join(annotationPairs, ",")
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

	if config.GatewayIPAddress != "" {
		output.SucceedTask(taskName, "Ingress configuration with IP address updated")
	} else {
		output.SucceedTask(taskName, "Ingress configuration updated")
	}
	return nil
}

// GetIngressURL gets the ingress URL for a specific resource using the platform client's Kubernetes connection
func (k *KubernetesPlatformClient) GetIngressURL(resourceName string) string {
	// Find ingress by label selector
	labelSelector := fmt.Sprintf("drasi/resource=%s", resourceName)
	ingressList, err := k.kubeClient.NetworkingV1().Ingresses(k.kubeNamespace).List(context.TODO(), metav1.ListOptions{
		LabelSelector: labelSelector,
	})
	if err != nil {
		return ""
	}
	if len(ingressList.Items) == 0 {
		return ""
	}

	ingress := ingressList.Items[0]

	if len(ingress.Spec.Rules) > 0 {
		rule := ingress.Spec.Rules[0]

		// If host is set and not "*", use the hostname
		if rule.Host != "" && rule.Host != "*" {
			return fmt.Sprintf("http://%s", rule.Host)
		}

		// If host is "*" or empty, use the ingress address directly
		if rule.Host == "*" || rule.Host == "" {
			if len(ingress.Status.LoadBalancer.Ingress) > 0 {
				address := ""
				if ingress.Status.LoadBalancer.Ingress[0].IP != "" {
					address = ingress.Status.LoadBalancer.Ingress[0].IP
				} else if ingress.Status.LoadBalancer.Ingress[0].Hostname != "" {
					address = ingress.Status.LoadBalancer.Ingress[0].Hostname
				}
				if address != "" {
					return fmt.Sprintf("http://%s", address)
				}
			}
		}
	}

	return ""
}

func (k *KubernetesPlatformClient) DisplayIngressInfo(resourceName string, spec interface{}, output output.TaskOutput) {
	specMap, ok := spec.(map[string]interface{})
	if !ok {
		return
	}

	services, ok := specMap["services"].(map[string]interface{})
	if !ok {
		return
	}

	var hasExternalEndpoint bool
	for _, serviceData := range services {
		serviceMap, ok := serviceData.(map[string]interface{})
		if !ok {
			continue
		}

		endpoints, ok := serviceMap["endpoints"].(map[string]interface{})
		if !ok {
			continue
		}

		for _, endpointData := range endpoints {
			endpointMap, ok := endpointData.(map[string]interface{})
			if !ok {
				continue
			}

			setting, ok := endpointMap["setting"].(string)
			if ok && strings.ToLower(setting) == "external" {
				hasExternalEndpoint = true
				break
			}
		}
		if hasExternalEndpoint {
			break
		}
	}

	if hasExternalEndpoint {
		ingressUrl := k.GetIngressURL(resourceName)
		if ingressUrl != "" {
			output.InfoMessage(fmt.Sprintf("Ingress URL: %s", ingressUrl))
		}
	}
}
