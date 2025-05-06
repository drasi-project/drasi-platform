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

	"drasi.io/cli/sdk/registry"
	"github.com/phayes/freeport"
	corev1 "k8s.io/api/core/v1"
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
	CreateTunnel(resourceType string, resourceName string, localPort uint16) error
	SetSecret(name string, key string, value []byte) error
	DeleteSecret(name string, key string) error
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
