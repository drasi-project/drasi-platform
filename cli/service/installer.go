package service

import (
	"bytes"
	"embed"
	"errors"
	"fmt"
	"github.com/briandowns/spinner"
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
		return nil, err
	}

	if err = CreateNamespace(restConfig, namespace); err != nil {
		return nil, err
	}
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

func (t *Installer) Install(localMode bool, acr string, version string, output *os.File, namespace string) error {
	daprInstalled, err := t.checkDaprInstallation(output)
	if err != nil {
		return err
	}
	if !daprInstalled {
		if err = t.installDapr(output); err != nil {
			return err
		}
	}

	if err = t.createConfig(localMode, acr, version); err != nil {
		return err
	}

	if err = t.installInfrastructure(output); err != nil {
		return err
	}

	if err = t.installControlPlane(localMode, acr, version, output); err != nil {
		return err
	}

	if err = t.installQueryContainer(output, namespace); err != nil {
		return err
	}

	if err = t.applyDefaultSourceProvider(output, namespace); err != nil {
		return err
	}

	if err = t.applyDefaultReactionProvider(output, namespace); err != nil {
		return err
	}

	return nil
}

func (t *Installer) installInfrastructure(output *os.File) error {
	if _, err := t.kubeClient.CoreV1().Namespaces().Get(context.TODO(), "dapr-system", metav1.GetOptions{}); err != nil {
		return errors.New("dapr not installed")
	}

	var err error
	var raw []byte
	var infraManifests []*unstructured.Unstructured

	if raw, err = resources.ReadFile("resources/infra.yaml"); err != nil {
		return err
	}

	if infraManifests, err = readK8sManifests(raw); err != nil {
		return err
	}

	spin := spinner.New(spinner.CharSets[9], 100*time.Millisecond, spinner.WithWriterFile(output))
	spin.Suffix = "Deploying Infrastructure..."
	spin.Start()

	if err = t.applyManifests(infraManifests); err != nil {
		spin.FinalMSG = "Error deploying infrastructure\n"
		spin.Stop()
		return err
	}
	spin.FinalMSG = "Infrastructure deployed\n"
	spin.Stop()

	if err = t.waitForStatefulset("app=rg-redis", output); err != nil {
		return err
	}

	if err = t.waitForStatefulset("app=rg-mongo", output); err != nil {
		return err
	}

	return nil
}

func (t *Installer) installControlPlane(localMode bool, acr string, version string, output *os.File) error {
	var err error
	var raw []byte
	var svcAcctManifests []*unstructured.Unstructured
	var apiManifests []*unstructured.Unstructured

	if raw, err = resources.ReadFile("resources/service-account.yaml"); err != nil {
		return err
	}

	if svcAcctManifests, err = readK8sManifests(raw); err != nil {
		return err
	}

	spin := spinner.New(spinner.CharSets[9], 100*time.Millisecond, spinner.WithWriterFile(output))
	spin.Suffix = "Installing Control Plane..."
	spin.Start()
	defer spin.Stop()

	if err = t.applyManifests(svcAcctManifests); err != nil {
		spin.FinalMSG = "Error creating service account\n"
		return err
	}

	if raw, err = resources.ReadFile("resources/control-plane.yaml"); err != nil {
		return err
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
		return err
	}

	if err = t.applyManifests(apiManifests); err != nil {
		spin.FinalMSG = "Error installing control plane\n"
		return err
	}

	spin.FinalMSG = "Control plane deployed\n"
	spin.Stop()

	if err = t.waitForDeployment("drasi/infra=api", output); err != nil {
		return err
	}

	if err = t.waitForDeployment("drasi/infra=resource-provider", output); err != nil {
		return err
	}

	time.Sleep(time.Second * 3)

	output.WriteString("Control plane is online\n")

	return nil
}

func (t *Installer) createConfig(localMode bool, acr string, version string) error {

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
		return err
	}

	return nil
}

func (t *Installer) applyManifests(infraManifests []*unstructured.Unstructured) error {
	var dynClient *dynamic.DynamicClient
	var err error

	if dynClient, err = dynamic.NewForConfig(t.kubeConfig); err != nil {
		return err
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
			return err
		}
	}
	return nil
}

func (t *Installer) installQueryContainer(output *os.File, namespace string) error {
	var err error
	var manifests *[]drasiapi.Manifest

	var qc []byte

	if qc, err = resources.ReadFile("resources/default-container.yaml"); err != nil {
		return err
	}

	manifests, err = drasiapi.ReadManifests(qc)
	if err != nil {
		return err
	}

	output.WriteString("Deploying Query Container...\n")

	var clusterConfig ClusterConfig
	clusterConfig.DrasiNamespace = namespace

	saveConfig(clusterConfig)
	drasiClient, err := MakeApiClient(namespace)
	if err != nil {
		return err
	}
	defer drasiClient.Close()

	drasiClient.Apply(manifests, output)
	drasiClient.ReadyWait(manifests, 120, output)
	output.WriteString("Query Container deployed\n")

	return nil
}

func (t *Installer) applyDefaultSourceProvider(output *os.File, namespace string) error {
	var err error
	var manifests *[]drasiapi.Manifest

	var qc []byte

	if qc, err = resources.ReadFile("resources/default-source-providers.yaml"); err != nil {
		return err
	}

	manifests, err = drasiapi.ReadManifests(qc)
	if err != nil {
		return err
	}

	output.WriteString("Creating default source providers...\n")

	var clusterConfig ClusterConfig
	clusterConfig.DrasiNamespace = namespace

	saveConfig(clusterConfig)
	drasiClient, err := MakeApiClient(namespace)
	if err != nil {
		return err
	}
	defer drasiClient.Close()

	drasiClient.Apply(manifests, os.Stdout)

	return nil
}

func (t *Installer) applyDefaultReactionProvider(output *os.File, namespace string) error {
	var err error
	var manifests *[]drasiapi.Manifest

	var qc []byte

	if qc, err = resources.ReadFile("resources/default-reaction-providers.yaml"); err != nil {
		return err
	}

	manifests, err = drasiapi.ReadManifests(qc)
	if err != nil {
		return err
	}

	output.WriteString("Creating default reaction providers...\n")

	var clusterConfig ClusterConfig
	clusterConfig.DrasiNamespace = namespace

	saveConfig(clusterConfig)
	drasiClient, err := MakeApiClient(namespace)
	if err != nil {
		return err
	}
	defer drasiClient.Close()

	drasiClient.Apply(manifests, os.Stdout)

	return nil
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

func (t *Installer) waitForStatefulset(selector string, output *os.File) error {
	var timeout int64 = 120
	var resourceWatch watch.Interface
	var err error

	spin := spinner.New(spinner.CharSets[9], 100*time.Millisecond, spinner.WithWriterFile(output))
	spin.Suffix = fmt.Sprintf("Waiting for %s to be ready", selector)
	spin.FinalMSG = fmt.Sprintf("Timed out waiting for %s\n", selector)
	spin.Start()
	defer spin.Stop()

	resourceWatch, err = t.kubeClient.AppsV1().StatefulSets(t.kubeNamespace).Watch(context.TODO(), metav1.ListOptions{
		LabelSelector:  selector,
		Watch:          true,
		TimeoutSeconds: &timeout,
	})

	if err != nil {
		spin.FinalMSG = fmt.Sprintf("Error waiting for %s: %v\n", selector, err.Error())
		return err
	}

	for evt := range resourceWatch.ResultChan() {
		ss, ok := evt.Object.(*v1.StatefulSet)
		if !ok {
			continue
		}
		if ss.Status.ReadyReplicas > 0 {
			spin.FinalMSG = fmt.Sprintf("%s is ready\n", selector)
			resourceWatch.Stop()
		}
	}
	return nil
}

func (t *Installer) waitForDeployment(selector string, output *os.File) error {
	var timeout int64 = 90
	var resourceWatch watch.Interface
	var err error

	spin := spinner.New(spinner.CharSets[9], 100*time.Millisecond, spinner.WithWriterFile(output))
	spin.Suffix = fmt.Sprintf("Waiting for %s to be ready", selector)
	spin.FinalMSG = fmt.Sprintf("Timed out waiting for %s\n", selector)
	spin.Start()
	defer spin.Stop()

	resourceWatch, err = t.kubeClient.AppsV1().Deployments(t.kubeNamespace).Watch(context.TODO(), metav1.ListOptions{
		LabelSelector:  selector,
		Watch:          true,
		TimeoutSeconds: &timeout,
	})

	if err != nil {
		spin.FinalMSG = fmt.Sprintf("Error waiting for %s: %v\n", selector, err.Error())
		return err
	}

	for evt := range resourceWatch.ResultChan() {
		ss, ok := evt.Object.(*v1.Deployment)
		if !ok {
			continue
		}
		if ss.Status.AvailableReplicas > 0 {
			spin.FinalMSG = fmt.Sprintf("%s is ready\n", selector)
			resourceWatch.Stop()
		}
	}
	return nil
}

func (t *Installer) installDapr(output *os.File) error {
	spin := spinner.New(spinner.CharSets[9], 100*time.Millisecond, spinner.WithWriterFile(output))
	spin.Suffix = "Installing Dapr..."
	spin.Start()
	defer spin.Stop()

	ns := "dapr-system"
	flags := genericclioptions.ConfigFlags{
		Namespace: &ns,
	}

	helmConfig := helm.Configuration{}

	err := helmConfig.Init(&flags, "dapr-system", "secret", func(format string, v ...any) {})
	if err != nil {
		spin.FinalMSG = fmt.Sprintf("Error intalling Dapr: %v\n", err.Error())
		return err
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
		spin.FinalMSG = fmt.Sprintf("Error intalling Dapr: %v\n", err.Error())
		return err
	}
	defer os.RemoveAll(dir)

	pull.DestDir = dir

	_, err = pull.Run("dapr")
	if err != nil {
		spin.FinalMSG = fmt.Sprintf("Error intalling Dapr: %v\n", err.Error())
		return err
	}
	file, err := os.ReadDir(dir)
	if err != nil {
		spin.FinalMSG = fmt.Sprintf("Error intalling Dapr: %v\n", err.Error())
		return err
	}
	dirPath := filepath.Join(dir, file[0].Name())
	helmChart, err := loader.Load(dirPath)
	if err != nil {
		spin.FinalMSG = fmt.Sprintf("Error intalling Dapr: %v\n", err.Error())
		return err
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
		spin.FinalMSG = fmt.Sprintf("Error intalling Dapr: %v\n", err.Error())
		return err
	}
	spin.FinalMSG = "Dapr installed\n"

	return nil
}

func (t *Installer) checkDaprInstallation(output *os.File) (bool, error) {
	spin := spinner.New(spinner.CharSets[9], 100*time.Millisecond, spinner.WithWriterFile(output))
	spin.Suffix = "Checking for Dapr..."
	spin.Start()
	defer spin.Stop()

	podsClient := t.kubeClient.CoreV1().Pods("dapr-system")

	pods, err := podsClient.List(context.TODO(), metav1.ListOptions{
		LabelSelector: "app.kubernetes.io/name=dapr",
	})
	if err != nil {
		return false, err
	}

	return len(pods.Items) > 0, nil
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
