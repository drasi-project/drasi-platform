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

	"drasi.io/cli/sdk/registry"
	"github.com/phayes/freeport"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/client-go/tools/portforward"
	"k8s.io/client-go/transport/spdy"
)

type PlatformClient interface {
	CreateDrasiClient() (*ApiClient, error)
	CreateTunnel(resourceName string, endpoint string, localPort uint16, remotePort uint16) error
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

func (t *KubernetesPlatformClient) CreateTunnel(resourceName string, endpoint string, localPort uint16, remotePort uint16) error {
	podName, err := t.getServicePodName(resourceName + "-" + endpoint)
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

	stopCh := make(chan struct{}, 1)
	pf, err := portforward.New(dialer, []string{fmt.Sprintf("%d:%d", localPort, remotePort)}, stopCh, readyCh, os.Stdout, os.Stderr)
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

func (t *KubernetesPlatformClient) getServicePodName(serviceName string) (string, error) {
	namespace := t.kubeNamespace
	ep, err := t.kubeClient.CoreV1().Endpoints(namespace).Get(context.TODO(), serviceName, v1.GetOptions{})
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
	return "", errors.New(serviceName + " not available")
}
