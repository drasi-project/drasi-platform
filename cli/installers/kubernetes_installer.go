// Copyright 2024 The Drasi Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package installers

import (
	"bytes"
	"embed"
	"errors"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
	"time"

	"drasi.io/cli/output"
	"drasi.io/cli/sdk"

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
	resources embed.FS
	Namespace string
)

type KubernetesInstaller struct {
	kubeClient         *kubernetes.Clientset
	kubeConfig         *rest.Config
	kubeNamespace      string
	stopCh             chan struct{}
	platformClient     sdk.KubernetesPlatformClient
	daprRuntimeVersion string
	daprSidecarVersion string
}

func MakeKubernetesInstaller(platformClient *sdk.KubernetesPlatformClient) (*KubernetesInstaller, error) {
	result := KubernetesInstaller{
		platformClient:     *platformClient,
		daprRuntimeVersion: DAPR_RUNTIME_VERSION,
		daprSidecarVersion: DAPR_SIDECAR_VERSION,
		stopCh:             make(chan struct{}, 1),
	}

	restConfig := platformClient.GetKubeConfig()

	if err := CreateNamespace(restConfig, platformClient.GetNamespace()); err != nil {
		return nil, err
	}
	result.kubeNamespace = platformClient.GetNamespace()

	var err error
	result.kubeClient, err = kubernetes.NewForConfig(restConfig)
	if err != nil {
		return nil, err
	}

	result.kubeConfig = restConfig

	return &result, nil
}

func (t *KubernetesInstaller) SetDaprRuntimeVersion(version string) {
	t.daprRuntimeVersion = version
}

func (t *KubernetesInstaller) SetDaprSidecarVersion(version string) {
	t.daprSidecarVersion = version
}

func (t *KubernetesInstaller) Install(localMode bool, acr string, version string, output output.TaskOutput, daprRegistry string, observabilityLevel string) error {
	daprInstalled, err := t.checkDaprInstallation(output)
	if err != nil {
		return err
	}

	if !daprInstalled {
		if err = t.installDapr(output, daprRegistry); err != nil {
			return err
		}
	}

	if err = t.createConfig(localMode, acr, version); err != nil {
		return err
	}

	if err = t.installInfrastructure(output); err != nil {
		return err
	}

	if err = t.installObservabilityTools(output, observabilityLevel); err != nil {
		return err
	}

	if err = t.installControlPlane(localMode, acr, version, output); err != nil {
		return err
	}

	if err = t.installQueryContainer(output); err != nil {
		return err
	}

	if err = t.applyDefaultSourceProvider(output); err != nil {
		return err
	}

	if err = t.applyDefaultReactionProvider(output); err != nil {
		return err
	}

	return nil
}

func (t *KubernetesInstaller) installInfrastructure(output output.TaskOutput) error {
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

	output.AddTask("Infrastructure", "Deploying infrastructure...")

	if err = t.applyManifests(infraManifests); err != nil {
		output.FailTask("Infrastructure", "Error deploying infrastructure")
		return err
	}
	subOutput := output.GetChildren("Infrastructure")

	if err = t.waitForStatefulset("app=drasi-redis", subOutput); err != nil {
		return err
	}

	if err = t.waitForStatefulset("app=drasi-mongo", subOutput); err != nil {
		return err
	}
	output.SucceedTask("Infrastructure", "Infrastructure deployed")

	return nil
}

func (t *KubernetesInstaller) installObservabilityTools(output output.TaskOutput, observabilityLevel string) error {
	var err error
	var raw []byte
	var observabilityManifests []*unstructured.Unstructured

	if observabilityLevel == "none" {
		return nil
	}
	fileName := map[string]string{
		"tracing": "tracing.yaml",
		"metrics": "metrics.yaml",
		"full":    "full-observability.yaml",
	}[observabilityLevel]

	if raw, err = resources.ReadFile("resources/observability/" + fileName); err != nil {
		return err
	}

	if observabilityManifests, err = readK8sManifests(raw); err != nil {
		return err
	}
	output.AddTask("Observability", "Deploying observability infrastructure...")

	if err = t.applyManifests(observabilityManifests); err != nil {
		output.FailTask("Observability", "Error deploying observability infrastructure")
		return err
	}

	subOutput := output.GetChildren("Observability")
	if observabilityLevel == "tracing" || observabilityLevel == "full" {
		if err = t.waitForDeployment("app=tempo", subOutput); err != nil {
			return err
		}
	}
	if observabilityLevel == "metrics" || observabilityLevel == "full" {
		if err = t.waitForDeployment("app=prometheus", subOutput); err != nil {
			return err
		}
	}

	if err = t.waitForDeployment("app=grafana", subOutput); err != nil {
		return err
	}

	// Otel-collector
	if raw, err = resources.ReadFile("resources/observability/otel-collector.yaml"); err != nil {
		return err
	}
	if observabilityManifests, err = readK8sManifests(raw); err != nil {
		return err
	}

	if err = t.applyManifests(observabilityManifests); err != nil {
		output.FailTask("Observability", "Error deploying Otel collector")
		return err
	}
	if err = t.waitForDeployment("app=otel-collector", subOutput); err != nil {
		return err
	}

	output.SucceedTask("Observability", "Observability infrastructure deployed")

	return nil
}

func (t *KubernetesInstaller) installControlPlane(localMode bool, acr string, version string, output output.TaskOutput) error {
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

	output.AddTask("Control-Plane", "Installing control plane...")
	subOutput := output.GetChildren("Control-Plane")

	if err = t.applyManifests(svcAcctManifests); err != nil {
		output.FailTask("Control-Plane", "Error creating service account")
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

	daprVersionString := "daprio/daprd:" + t.daprSidecarVersion
	rawStr = strings.Replace(rawStr, "%DAPRD_VERSION%", daprVersionString, -1)
	raw = []byte(rawStr)

	if apiManifests, err = readK8sManifests(raw); err != nil {
		return err
	}

	if err = t.applyManifests(apiManifests); err != nil {
		output.FailTask("Control-Plane", "Error installing control plane")
		return err
	}

	if err = t.waitForDeployment("drasi/infra=api", subOutput); err != nil {
		return err
	}

	if err = t.waitForDeployment("drasi/infra=resource-provider", subOutput); err != nil {
		return err
	}

	time.Sleep(time.Second * 3)

	output.SucceedTask("Control-Plane", "Control plane is online")

	return nil
}

func (t *KubernetesInstaller) createConfig(localMode bool, acr string, version string) error {

	cfg := map[string]string{}

	if localMode {
		cfg["IMAGE_PULL_POLICY"] = "IfNotPresent"
		cfg["IMAGE_VERSION_TAG"] = version
	} else {
		cfg["ACR"] = acr
		cfg["IMAGE_VERSION_TAG"] = version
		cfg["IMAGE_PULL_POLICY"] = "IfNotPresent"
	}

	cfg["DAPR_SIDECAR"] = "daprio/daprd:" + t.daprSidecarVersion
	configMap := corev1apply.ConfigMap("drasi-config", t.kubeNamespace).WithData(cfg)

	if _, err := t.kubeClient.CoreV1().ConfigMaps(t.kubeNamespace).Apply(context.TODO(), configMap, metav1.ApplyOptions{
		FieldManager: "drasi-installer",
	}); err != nil {
		return err
	}

	return nil
}

func (t *KubernetesInstaller) applyManifests(infraManifests []*unstructured.Unstructured) error {
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

func (t *KubernetesInstaller) installQueryContainer(output output.TaskOutput) error {
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

	output.AddTask("Query-Container", "Creating query container...")
	subOutput := output.GetChildren("Query-Container")

	drasiClient, err := t.platformClient.CreateDrasiClient()
	if err != nil {
		return err
	}
	defer drasiClient.Close()

	if err := drasiClient.Apply(manifests, subOutput); err != nil {
		return err
	}

	if err := drasiClient.ReadyWait(manifests, 240, subOutput); err != nil {
		return err
	}
	output.SucceedTask("Query-Container", "Query container created")

	return nil
}

func (t *KubernetesInstaller) applyDefaultSourceProvider(output output.TaskOutput) error {
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

	output.AddTask("Default-Source-Providers", "Creating default source providers...")
	subOutput := output.GetChildren("Default-Source-Providers")

	drasiClient, err := t.platformClient.CreateDrasiClient()
	if err != nil {
		output.FailTask("Default-Source-Providers", fmt.Sprintf("Error creating default source providers: %v", err.Error()))
		return err
	}
	defer drasiClient.Close()

	if err := drasiClient.Apply(manifests, subOutput); err != nil {
		return err
	}

	output.SucceedTask("Default-Source-Providers", "Default source providers created")

	return nil
}

func (t *KubernetesInstaller) applyDefaultReactionProvider(output output.TaskOutput) error {
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

	output.AddTask("Default-Reaction-Providers", "Creating default reaction providers...")
	subOutput := output.GetChildren("Default-Reaction-Providers")

	drasiClient, err := t.platformClient.CreateDrasiClient()
	if err != nil {
		output.FailTask("Default-Reaction-Providers", fmt.Sprintf("Error creating default reaction providers: %v", err.Error()))
		return err
	}
	defer drasiClient.Close()

	if err := drasiClient.Apply(manifests, subOutput); err != nil {
		return err
	}

	output.SucceedTask("Default-Reaction-Providers", "Default reaction providers created")

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

func (t *KubernetesInstaller) waitForStatefulset(selector string, output output.TaskOutput) error {
	var timeout int64 = 120
	var resourceWatch watch.Interface
	var err error

	output.AddTask("Wait-"+selector, fmt.Sprintf("Waiting for %s to come online", selector))

	resourceWatch, err = t.kubeClient.AppsV1().StatefulSets(t.kubeNamespace).Watch(context.TODO(), metav1.ListOptions{
		LabelSelector:  selector,
		Watch:          true,
		TimeoutSeconds: &timeout,
	})

	if err != nil {
		output.FailTask("Wait-"+selector, fmt.Sprintf("Error waiting for %s: %v", selector, err.Error()))
		return err
	}

	for evt := range resourceWatch.ResultChan() {
		ss, ok := evt.Object.(*v1.StatefulSet)
		if !ok {
			continue
		}
		if ss.Status.ReadyReplicas > 0 {
			output.SucceedTask("Wait-"+selector, fmt.Sprintf("%s is online", selector))
			resourceWatch.Stop()
			return nil
		}
	}
	output.FailTask("Wait-"+selector, fmt.Sprintf("Timed out waiting for %s", selector))
	return nil
}

func (t *KubernetesInstaller) waitForDeployment(selector string, output output.TaskOutput) error {
	var timeout int64 = 90
	var resourceWatch watch.Interface
	var err error

	output.AddTask("Wait-"+selector, fmt.Sprintf("Waiting for %s to come online", selector))

	resourceWatch, err = t.kubeClient.AppsV1().Deployments(t.kubeNamespace).Watch(context.TODO(), metav1.ListOptions{
		LabelSelector:  selector,
		Watch:          true,
		TimeoutSeconds: &timeout,
	})

	if err != nil {
		output.FailTask("Wait-"+selector, fmt.Sprintf("Error waiting for %s: %v", selector, err.Error()))
		return err
	}

	for evt := range resourceWatch.ResultChan() {
		ss, ok := evt.Object.(*v1.Deployment)
		if !ok {
			continue
		}
		if ss.Status.AvailableReplicas > 0 {
			output.SucceedTask("Wait-"+selector, fmt.Sprintf("%s is online", selector))
			resourceWatch.Stop()
			return nil
		}
	}
	output.FailTask("Wait-"+selector, fmt.Sprintf("Timed out waiting for %s", selector))
	return nil
}

func (t *KubernetesInstaller) saveKubeConfigToTemp() (string, error) {
	rawConfig, err := t.platformClient.GetClientConfig().RawConfig()
	if err != nil {
		return "", err
	}
	configBytes, err := clientcmd.Write(rawConfig)
	if err != nil {
		return "", err
	}

	tmpFile, err := os.CreateTemp("", ".drasi-*")
	if err != nil {
		panic(err)
	}
	defer tmpFile.Close()

	// Set file permissions to 0600 (read/write for user only)
	if err := os.Chmod(tmpFile.Name(), 0600); err != nil {
		panic(err)
	}
	tmpFile.Write(configBytes)

	return tmpFile.Name(), nil
}

func (t *KubernetesInstaller) installDapr(output output.TaskOutput, daprRegistry string) error {
	output.AddTask("Dapr-Install", "Installing Dapr...")
	ns := "dapr-system"

	kubeContextFile, err := t.saveKubeConfigToTemp()
	if err != nil {
		return err
	}

	defer os.Remove(kubeContextFile)

	flags := genericclioptions.ConfigFlags{
		Namespace:  &ns,
		KubeConfig: &kubeContextFile,
	}
	helmConfig := helm.Configuration{}

	err = helmConfig.Init(&flags, "dapr-system", "secret", func(format string, v ...any) {})

	if err != nil {
		output.FailTask("Dapr-Install", fmt.Sprintf("Error installing Dapr: %v", err.Error()))
		return err
	}

	//Loading helm chart
	pull := helm.NewPull()
	pull.RepoURL = "https://dapr.github.io/helm-charts/"
	pull.Settings = &cli.EnvSettings{}
	pull.Version = t.daprRuntimeVersion
	pull.Devel = true
	pullopt := helm.WithConfig(&helmConfig)
	pullopt(pull)

	dir, err := os.MkdirTemp("", "drasi")
	if err != nil {
		output.FailTask("Dapr-Install", fmt.Sprintf("Error installing Dapr: %v", err.Error()))
		return err
	}
	defer os.RemoveAll(dir)

	pull.DestDir = dir

	_, err = pull.Run("dapr")
	if err != nil {
		output.FailTask("Dapr-Install", fmt.Sprintf("Error installing Dapr: %v", err.Error()))
		return err
	}
	file, err := os.ReadDir(dir)
	if err != nil {
		output.FailTask("Dapr-Install", fmt.Sprintf("Error installing Dapr: %v", err.Error()))
		return err
	}
	dirPath := filepath.Join(dir, file[0].Name())
	helmChart, err := loader.Load(dirPath)
	if err != nil {
		output.FailTask("Dapr-Install", fmt.Sprintf("Error installing Dapr: %v", err.Error()))
		return err
	}

	installClient := helm.NewInstall(&helmConfig)
	installClient.ReleaseName = "dapr"
	installClient.Namespace = "dapr-system"
	installClient.Wait = true
	installClient.CreateNamespace = true
	installClient.Timeout = time.Duration(120) * time.Second

	helmChart.Values["global"].(map[string]interface{})["registry"] = daprRegistry

	helmChart.Values["dapr_operator"] = make(map[string]interface{})
	if daprOperator, ok := helmChart.Values["dapr_operator"].(map[string]interface{}); ok {
		daprOperator["watchInterval"] = "10s"
	}
	_, err = installClient.Run(helmChart, helmChart.Values)
	if err != nil {
		output.FailTask("Dapr-Install", fmt.Sprintf("Error installing Dapr: %v", err.Error()))
		return err
	}
	output.SucceedTask("Dapr-Install", "Dapr installed successfully")

	return nil
}

func (t *KubernetesInstaller) checkDaprInstallation(output output.TaskOutput) (bool, error) {
	output.AddTask("Dapr-Check", "Checking for Dapr...")

	podsClient := t.kubeClient.CoreV1().Pods("dapr-system")

	pods, err := podsClient.List(context.TODO(), metav1.ListOptions{
		LabelSelector: "app.kubernetes.io/part-of=dapr",
	})
	if err != nil {
		output.FailTask("Dapr-Check", fmt.Sprintf("Error checking for Dapr: %v", err.Error()))
		return false, err
	}

	if len(pods.Items) > 0 {
		output.InfoTask("Dapr-Check", "Dapr already installed")
		return true, nil
	} else {
		output.InfoTask("Dapr-Check", "Dapr not installed")
		return false, nil
	}
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
			return nil
		}
	}

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

	return nil
}
