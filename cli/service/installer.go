package service

import (
	"bytes"
	"embed"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
	"time"

	drasiapi "drasi.io/cli/api"
	"golang.org/x/net/context"
	"gopkg.in/yaml.v3"
	helm "helm.sh/helm/v3/pkg/action"
	"helm.sh/helm/v3/pkg/chart/loader"
	"helm.sh/helm/v3/pkg/cli"
	v1 "k8s.io/api/apps/v1"
	corev1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/meta"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
	"k8s.io/apimachinery/pkg/runtime/schema"
	k8syaml "k8s.io/apimachinery/pkg/runtime/serializer/yaml"
	"k8s.io/apimachinery/pkg/watch"
	"k8s.io/cli-runtime/pkg/genericclioptions"
	corev1apply "k8s.io/client-go/applyconfigurations/core/v1"
	"k8s.io/client-go/discovery"
	"k8s.io/client-go/discovery/cached/memory"
	"k8s.io/client-go/dynamic"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/restmapper"
	"k8s.io/client-go/tools/clientcmd"
)

var (
	//go:embed resources
	resources            embed.FS
	DAPR_RUNTIME_VERSION = "1.10.0"
	DAPR_SIDECAR_VERSION = "1.9.0"
	Namespace            string
)

type Installer struct {
	kubeClient    *kubernetes.Clientset
	kubeConfig    *rest.Config
	kubeNamespace string
	stopCh        chan struct{}
}

func MakeInstaller(namespace string) (*Installer, error) {
	result := Installer{
		stopCh: make(chan struct{}, 1),
	}

	configLoadingRules := clientcmd.NewDefaultClientConfigLoadingRules()
	configOverrides := &clientcmd.ConfigOverrides{}

	config := clientcmd.NewNonInteractiveDeferredLoadingClientConfig(configLoadingRules, configOverrides)

	restConfig, err := config.ClientConfig()

	if err != nil {
		panic(err.Error())
	}

	CreateNamespace(restConfig, namespace)
	Namespace = namespace
	result.kubeNamespace = namespace

	// create the clientset
	result.kubeClient, err = kubernetes.NewForConfig(restConfig)
	if err != nil {
		return nil, err
	}

	result.kubeConfig = restConfig

	return &result, nil
}

func (t *Installer) Install(localMode bool, acr string, version string, statusUpdates chan StatusUpdate, namespace string) {
	if !t.checkDaprInstallation() {
		t.installDapr(statusUpdates)
	}
	t.createConfig(localMode, acr, version)
	t.installInfrastructure(statusUpdates)
	t.installControlPlane(localMode, acr, version, statusUpdates)
	t.installQueryContainer(statusUpdates, namespace)
	t.applyDefaultSourceProvider(statusUpdates, namespace)
	t.applyDefaultReactionProvider(statusUpdates, namespace)
	close(statusUpdates)
}

func (t *Installer) installInfrastructure(statusUpdates chan StatusUpdate) {
	if _, err := t.kubeClient.CoreV1().Namespaces().Get(context.TODO(), "dapr-system", metav1.GetOptions{}); err != nil {
		panic("dapr not installed")
	}

	var err error
	var raw []byte
	var infraManifests []*unstructured.Unstructured

	if raw, err = resources.ReadFile("resources/infra.yaml"); err != nil {
		panic(err)
	}

	if infraManifests, err = readK8sManifests(raw); err != nil {
		panic(err)
	}

	statusUpdates <- StatusUpdate{
		Subject: "Install",
		Message: "Deploying infrastructure",
		Success: true,
	}

	t.applyManifests(err, infraManifests)

	statusUpdates <- StatusUpdate{
		Subject: "Install",
		Message: "Waiting for infrastructure to be ready",
		Success: true,
	}

	t.waitForStatefulset("app=rg-redis", statusUpdates)
	t.waitForStatefulset("app=rg-mongo", statusUpdates)
}

func (t *Installer) installControlPlane(localMode bool, acr string, version string, statusUpdates chan StatusUpdate) {
	var err error
	var raw []byte
	var svcAcctManifests []*unstructured.Unstructured
	var apiManifests []*unstructured.Unstructured

	if raw, err = resources.ReadFile("resources/service-account.yaml"); err != nil {
		panic(err)
	}

	if svcAcctManifests, err = readK8sManifests(raw); err != nil {
		panic(err)
	}

	statusUpdates <- StatusUpdate{
		Subject: "Install",
		Message: "Creating service account",
		Success: true,
	}

	t.applyManifests(err, svcAcctManifests)

	if raw, err = resources.ReadFile("resources/control-plane.yaml"); err != nil {
		panic(err)
	}

	rawStr := strings.Replace(string(raw), "%TAG%", version, -1)
	if localMode {
		rawStr = strings.Replace(rawStr, "%ACR%", "", -1)
		rawStr = strings.Replace(rawStr, "%IMAGE_PULL_POLICY%", "IfNotPresent", -1)
	} else {
		rawStr = strings.Replace(rawStr, "%ACR%", acr+"/", -1)
		rawStr = strings.Replace(rawStr, "%IMAGE_PULL_POLICY%", "Always", -1)
	}

	daprVersionString := "daprio/daprd:" + DAPR_SIDECAR_VERSION
	rawStr = strings.Replace(rawStr, "%DAPRD_VERSION%", daprVersionString, -1)
	raw = []byte(rawStr)

	if apiManifests, err = readK8sManifests(raw); err != nil {
		panic(err)
	}

	statusUpdates <- StatusUpdate{
		Subject: "Install",
		Message: "Installing control plane",
		Success: true,
	}

	t.applyManifests(err, apiManifests)

	statusUpdates <- StatusUpdate{
		Subject: "Install",
		Message: "Waiting for control plane to be ready",
		Success: true,
	}

	t.waitForDeployment("drasi/infra=api", statusUpdates)
	t.waitForDeployment("drasi/infra=resource-provider", statusUpdates)
	time.Sleep(time.Second * 3)

	statusUpdates <- StatusUpdate{
		Subject: "Install",
		Message: "control plane is online",
		Success: true,
	}
}

func (t *Installer) createConfig(localMode bool, acr string, version string) {

	cfg := map[string]string{}

	clusterConfig := readConfig()
	DAPR_SIDECAR_VERSION = clusterConfig.DaprSidecarVersion
	if localMode {
		cfg["IMAGE_PULL_POLICY"] = "IfNotPresent"
	} else {
		cfg["ACR"] = acr
		cfg["IMAGE_VERSION_TAG"] = version
		cfg["IMAGE_PULL_POLICY"] = "Always"
	}

	cfg["DAPR_SIDECAR"] = "daprio/daprd:" + DAPR_SIDECAR_VERSION
	configMap := corev1apply.ConfigMap("drasi-config", t.kubeNamespace).WithData(cfg)

	if _, err := t.kubeClient.CoreV1().ConfigMaps(t.kubeNamespace).Apply(context.TODO(), configMap, metav1.ApplyOptions{
		FieldManager: "drasi-installer",
	}); err != nil {
		panic(err)
	}
}

func (t *Installer) applyManifests(err error, infraManifests []*unstructured.Unstructured) {
	var dynClient *dynamic.DynamicClient

	if dynClient, err = dynamic.NewForConfig(t.kubeConfig); err != nil {
		panic(err)
	}

	for _, obj := range infraManifests {
		var mapping *meta.RESTMapping

		gvk := obj.GroupVersionKind()
		mapping, err = findGVR(&gvk, t.kubeConfig)

		var client dynamic.ResourceInterface
		if mapping.Scope.Name() == meta.RESTScopeNameNamespace {
			// namespaced resources should specify the namespace
			client = dynClient.Resource(mapping.Resource).Namespace(t.kubeNamespace)
		} else {
			// for cluster-wide resources
			client = dynClient.Resource(mapping.Resource)
		}

		if _, err = client.Apply(context.TODO(), obj.GetName(), obj, metav1.ApplyOptions{
			FieldManager: "drasi-installer",
		}); err != nil {
			panic(err)
		}
	}
}

func (t *Installer) installQueryContainer(statusUpdates chan StatusUpdate, namespace string) {
	var err error
	var manifests *[]drasiapi.Manifest

	var qc []byte

	if qc, err = resources.ReadFile("resources/default-container.yaml"); err != nil {
		panic(err)
	}

	manifests, err = drasiapi.ReadManifests(qc)

	statusUpdates <- StatusUpdate{
		Subject: "Install",
		Message: "Creating default query container",
		Success: true,
	}

	var clusterConfig ClusterConfig
	clusterConfig.DrasiNamespace = namespace

	saveConfig(clusterConfig)
	drasiClient := MakeApiClient(namespace)
	defer drasiClient.Close()

	applyResults := make(chan StatusUpdate)

	go drasiClient.Apply(manifests, applyResults)

	for r := range applyResults {
		statusUpdates <- r
	}

	waitResults := make(chan StatusUpdate)

	go drasiClient.ReadyWait(manifests, 120, waitResults)

	for r := range waitResults {
		statusUpdates <- r
	}
}

func (t *Installer) applyDefaultSourceProvider(statusUpdates chan StatusUpdate, namespace string) {
	var err error
	var manifests *[]drasiapi.Manifest

	var qc []byte

	if qc, err = resources.ReadFile("resources/default-source-providers.yaml"); err != nil {
		panic(err)
	}

	manifests, err = drasiapi.ReadManifests(qc)

	statusUpdates <- StatusUpdate{
		Subject: "Install",
		Message: "Creating default source providers",
		Success: true,
	}

	var clusterConfig ClusterConfig
	clusterConfig.DrasiNamespace = namespace

	saveConfig(clusterConfig)
	drasiClient := MakeApiClient(namespace)
	defer drasiClient.Close()

	applyResults := make(chan StatusUpdate)

	go drasiClient.Apply(manifests, applyResults)

	for r := range applyResults {
		statusUpdates <- r
	}
}

func (t *Installer) applyDefaultReactionProvider(statusUpdates chan StatusUpdate, namespace string) {
	var err error
	var manifests *[]drasiapi.Manifest

	var qc []byte

	if qc, err = resources.ReadFile("resources/default-reaction-providers.yaml"); err != nil {
		panic(err)
	}

	manifests, err = drasiapi.ReadManifests(qc)

	statusUpdates <- StatusUpdate{
		Subject: "Install",
		Message: "Creating default reaction providers",
		Success: true,
	}

	var clusterConfig ClusterConfig
	clusterConfig.DrasiNamespace = namespace

	saveConfig(clusterConfig)
	drasiClient := MakeApiClient(namespace)
	defer drasiClient.Close()

	applyResults := make(chan StatusUpdate)

	go drasiClient.Apply(manifests, applyResults)

	for r := range applyResults {
		statusUpdates <- r
	}
}

func readK8sManifests(data []byte) ([]*unstructured.Unstructured, error) {
	var result []*unstructured.Unstructured
	var yamlDocs [][]byte
	var err error

	if yamlDocs, err = splitYAML(data); err != nil {
		return nil, err
	}

	//decoder := scheme.Codecs.UniversalDeserializer()
	decoder := k8syaml.NewDecodingSerializer(unstructured.UnstructuredJSONScheme)
	for _, yamlDoc := range yamlDocs {
		obj := &unstructured.Unstructured{}

		if _, _, err = decoder.Decode(yamlDoc, nil, obj); err != nil {

			// Break when there are no more documents to decode
			if err != io.EOF {
				return nil, err
			}
			break
		}

		result = append(result, obj)
	}
	return result, nil
}

func splitYAML(resources []byte) ([][]byte, error) {

	dec := yaml.NewDecoder(bytes.NewReader(resources))

	var res [][]byte
	for {
		var value interface{}
		err := dec.Decode(&value)
		if err == io.EOF {
			break
		}
		if err != nil {
			return nil, err
		}
		valueBytes, err := yaml.Marshal(value)
		if err != nil {
			return nil, err
		}
		res = append(res, valueBytes)
	}
	return res, nil
}

func findGVR(gvk *schema.GroupVersionKind, cfg *rest.Config) (*meta.RESTMapping, error) {

	// DiscoveryClient queries API server about the resources
	dc, err := discovery.NewDiscoveryClientForConfig(cfg)
	if err != nil {
		return nil, err
	}
	mapper := restmapper.NewDeferredDiscoveryRESTMapper(memory.NewMemCacheClient(dc))

	return mapper.RESTMapping(gvk.GroupKind(), gvk.Version)
}

func (t *Installer) waitForStatefulset(selector string, statusChannel chan StatusUpdate) {
	var timeout int64 = 120
	var resourceWatch watch.Interface
	var err error

	resourceWatch, err = t.kubeClient.AppsV1().StatefulSets(t.kubeNamespace).Watch(context.TODO(), metav1.ListOptions{
		LabelSelector:  selector,
		Watch:          true,
		TimeoutSeconds: &timeout,
	})

	if err != nil {
		panic(err)
	}

	for evt := range resourceWatch.ResultChan() {
		ss, ok := evt.Object.(*v1.StatefulSet)
		if !ok {
			continue
		}
		if ss.Status.ReadyReplicas > 0 {
			statusChannel <- StatusUpdate{
				Subject: "Install",
				Message: ss.GetName() + " is ready",
				Success: true,
			}
			resourceWatch.Stop()
		}
	}
}

func (t *Installer) waitForDeployment(selector string, statusChannel chan StatusUpdate) {
	var timeout int64 = 90
	var resourceWatch watch.Interface
	var err error

	resourceWatch, err = t.kubeClient.AppsV1().Deployments(t.kubeNamespace).Watch(context.TODO(), metav1.ListOptions{
		LabelSelector:  selector,
		Watch:          true,
		TimeoutSeconds: &timeout,
	})

	if err != nil {
		panic(err)
	}

	for evt := range resourceWatch.ResultChan() {
		ss, ok := evt.Object.(*v1.Deployment)
		if !ok {
			continue
		}
		if ss.Status.AvailableReplicas > 0 {
			statusChannel <- StatusUpdate{
				Subject: "Install",
				Message: ss.GetName() + " is ready",
				Success: true,
			}
			resourceWatch.Stop()
		}
	}
}

func (t *Installer) installDapr(statusUpdates chan StatusUpdate) {
	statusUpdates <- StatusUpdate{
		Subject: "Install",
		Message: "Installing Dapr",
		Success: true,
	}
	ns := "dapr-system"
	flags := genericclioptions.ConfigFlags{
		Namespace: &ns,
	}

	helmConfig := helm.Configuration{}

	err := helmConfig.Init(&flags, "dapr-system", "secret", func(format string, v ...any) {})
	if err != nil {
		panic(err)
	}

	cfg := readConfig()
	DAPR_RUNTIME_VERSION = cfg.DaprRuntimeVersion

	//Loading helm chart
	pull := helm.NewPull()
	pull.RepoURL = "https://dapr.github.io/helm-charts/"
	pull.Settings = &cli.EnvSettings{}
	pull.Version = DAPR_RUNTIME_VERSION
	pull.Devel = true
	pullopt := helm.WithConfig(&helmConfig)
	pullopt(pull)

	dir, err := os.MkdirTemp("", "drasi")
	if err != nil {
		panic(err)
	}
	defer os.RemoveAll(dir)

	pull.DestDir = dir

	_, err = pull.Run("dapr")
	if err != nil {
		panic(err)
	}
	file, err := os.ReadDir(dir)
	if err != nil {
		panic(err)
	}
	dirPath := filepath.Join(dir, file[0].Name())
	helmChart, err := loader.Load(dirPath)
	if err != nil {
		panic(err)
	}

	installClient := helm.NewInstall(&helmConfig)
	installClient.ReleaseName = "dapr"
	installClient.Namespace = "dapr-system"
	installClient.Wait = true
	installClient.CreateNamespace = true
	installClient.Timeout = time.Duration(120) * time.Second

	helmChart.Values["dapr_operator"] = make(map[string]interface{})
	if daprOperator, ok := helmChart.Values["dapr_operator"].(map[string]interface{}); ok {
		daprOperator["watchInterval"] = "10s"
	}
	_, err = installClient.Run(helmChart, helmChart.Values)
	if err != nil {
		panic(err)
	}

	statusUpdates <- StatusUpdate{
		Subject: "Install",
		Message: "Dapr is ready",
		Success: true,
	}
}

func (t *Installer) checkDaprInstallation() bool {
	podsClient := t.kubeClient.CoreV1().Pods("dapr-system")

	pods, err := podsClient.List(context.TODO(), metav1.ListOptions{
		LabelSelector: "app.kubernetes.io/name=dapr",
	})
	if err != nil {
		panic(err)
	}

	return len(pods.Items) > 0
}

func CreateNamespace(config *rest.Config, namespace string) error {
	clientset, err := kubernetes.NewForConfig(config)
	if err != nil {
		return err
	}

	// check if namespace exists
	list, err := clientset.CoreV1().Namespaces().List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return err
	}
	for _, ns := range list.Items {
		if ns.Name == namespace {
			fmt.Printf("Found namesepace %s \n", namespace)
			return nil
		}
	}

	fmt.Printf("Namespace %s does not exist, creating it...\n", namespace)
	newNamespace := &corev1.Namespace{
		ObjectMeta: metav1.ObjectMeta{
			Name: namespace,
			Labels: map[string]string{
				"drasi.io/namespace": "true",
			},
		},
	}

	_, err = clientset.CoreV1().Namespaces().Create(context.Background(), newNamespace, metav1.CreateOptions{})
	if err != nil {
		return err
	}

	fmt.Printf("Namespace %s created.\n", namespace)
	return nil
}
