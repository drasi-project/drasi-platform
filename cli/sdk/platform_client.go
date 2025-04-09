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

	"github.com/phayes/freeport"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/client-go/tools/portforward"
	"k8s.io/client-go/transport/spdy"

	"drasi.io/cli/sdk/registry"
)

type PlatformClient interface {
	CreateDrasiClient() (*ApiClient, error)
}

func NewPlatformClient(registration registry.Registration) (PlatformClient, error) {
	switch registration.GetKind() {
	case registry.Kubernetes:
		k8sConfig, ok := registration.(*registry.KubernetesConfig)
		if !ok {
			return nil, errors.New("invalid Kubernetes config")
		}
		return MakeKubernetesPlatformClient(k8sConfig)
	default:
		return nil, fmt.Errorf("unsupported platform kind: %s", registration.GetKind())
	}
}

type KubernetesPlatformClient struct {
	kubeClient    *kubernetes.Clientset
	kubeConfig    *rest.Config
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

	err = t.createTunnel(&result)
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

func (t *KubernetesPlatformClient) GetKubeClient() *kubernetes.Clientset {
	return t.kubeClient
}

func (t *KubernetesPlatformClient) createTunnel(apiClient *ApiClient) error {
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
