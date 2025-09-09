// Copyright 2025 The Drasi Authors.
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

package ingress

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"drasi.io/cli/output"
	"drasi.io/cli/sdk"
	"helm.sh/helm/v3/pkg/action"
	helm "helm.sh/helm/v3/pkg/action"
	"helm.sh/helm/v3/pkg/chart/loader"
	"helm.sh/helm/v3/pkg/cli"
	"helm.sh/helm/v3/pkg/registry"

	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/cli-runtime/pkg/genericclioptions"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/clientcmd"
)

const (
	contourHelmRepoURL      = "https://charts.bitnami.com/bitnami"
	contourChartName        = "contour"
	contourDefaultNamespace = "projectcontour"
)

type ContourInstaller struct {
	platformClient *sdk.KubernetesPlatformClient
	kubeClient     *kubernetes.Clientset
}

func MakeContourInstaller(platformClient *sdk.KubernetesPlatformClient) (*ContourInstaller, error) {
	kubeConfig := platformClient.GetKubeConfig()
	kubeClient, err := kubernetes.NewForConfig(kubeConfig)
	if err != nil {
		return nil, err
	}

	return &ContourInstaller{
		platformClient: platformClient,
		kubeClient:     kubeClient,
	}, nil
}

func (ci *ContourInstaller) Install(drasiNamespace string, output output.TaskOutput) error {
	return ci.InstallWithOptions(drasiNamespace, false, output)
}

func (ci *ContourInstaller) InstallWithOptions(drasiNamespace string, localCluster bool, output output.TaskOutput) error {
	contourInstalled, err := ci.checkContourInstallation(output)
	if err != nil {
		return err
	}

	if !contourInstalled {
		if err = ci.installContour(localCluster, output); err != nil {
			return err
		}
	}

	return nil
}

func (ci *ContourInstaller) checkContourInstallation(output output.TaskOutput) (bool, error) {
	output.AddTask("Contour-Check", "Checking for Contour...")

	podsClient := ci.kubeClient.CoreV1().Pods("projectcontour")

	pods, err := podsClient.List(context.TODO(), metav1.ListOptions{
		LabelSelector: "app.kubernetes.io/instance=contour",
	})
	if err != nil {
		output.FailTask("Contour-Check", fmt.Sprintf("Error checking for Contour: %v", err.Error()))
		return false, err
	}

	if len(pods.Items) > 0 {
		output.InfoTask("Contour-Check", "Contour already installed")
		return true, nil
	} else {
		output.InfoTask("Contour-Check", "Contour not installed")
		return false, nil
	}
}

func (ci *ContourInstaller) installContour(localCluster bool, output output.TaskOutput) error {
	output.AddTask("Contour-Install", "Installing Contour...")
	ns := "projectcontour"
	kubeContextFile, err := ci.saveKubeConfigToTemp()
	if err != nil {
		return err
	}

	defer os.Remove(kubeContextFile)

	flags := genericclioptions.ConfigFlags{
		Namespace:  &ns,
		KubeConfig: &kubeContextFile,
	}
	helmConfig := helm.Configuration{}

	err = helmConfig.Init(&flags, "projectcontour", "secret", func(format string, v ...any) {})
	if err != nil {
		output.FailTask("Contour-Install", fmt.Sprintf("Error initializing Helm: %v", err.Error()))
		return err
	}

	registryClient, err := registry.NewClient()
	if err != nil {
		output.FailTask("Contour-Install", "Failed to initialize Helm registry client")
		return err
	}
	helmConfig.RegistryClient = registryClient

	if err != nil {
		output.FailTask("Contour-Install", fmt.Sprintf("Error installing Contour: %v", err.Error()))
		return err
	}

	// Use OCI registry for Bitnami charts or official Contour chart
	pull := action.NewPullWithOpts(action.WithConfig(&helmConfig))
	pull.Settings = cli.New()
	pull.Devel = true

	dir, err := os.MkdirTemp("", "contour")
	if err != nil {
		output.FailTask("Contour-Install", fmt.Sprintf("Error installing Contour: %v", err.Error()))
		return err
	}
	defer os.RemoveAll(dir)

	pull.DestDir = dir

	// Use Bitnami Contour chart from OCI registry
	_, err = pull.Run("oci://registry-1.docker.io/bitnamicharts/contour")
	if err != nil {
		output.FailTask("Contour-Install", fmt.Sprintf("Error pulling Contour chart: %v", err.Error()))
		return err
	}

	file, err := os.ReadDir(dir)
	if err != nil {
		output.FailTask("Contour-Install", fmt.Sprintf("Error installing Contour: %v", err.Error()))
		return err
	}

	if len(file) == 0 {
		output.FailTask("Contour-Install", "No chart files found")
		return fmt.Errorf("no chart files found in directory")
	}

	dirPath := filepath.Join(dir, file[0].Name())

	helmChart, err := loader.Load(dirPath)
	if err != nil {
		output.FailTask("Contour-Install", fmt.Sprintf("Error installing Contour: %v", err.Error()))
		return err
	}

	installClient := helm.NewInstall(&helmConfig)
	if installClient == nil {
		output.FailTask("Contour-Install", "Failed to create Helm install client")
		return fmt.Errorf("failed to create Helm install client")
	}

	installClient.ReleaseName = "contour"
	installClient.Namespace = "projectcontour"
	// Don't wait for LoadBalancer services in local clusters since they never get external IPs
	installClient.Wait = !localCluster
	installClient.CreateNamespace = true
	installClient.Timeout = time.Duration(300) * time.Second

	// Configure Contour values
	serviceType := "LoadBalancer"
	serviceValues := map[string]interface{}{
		"type": serviceType,
	}

	// For local clusters (like kind), use NodePort with specific ports for extraPortMappings
	if localCluster {
		serviceType = "NodePort"
		serviceValues = map[string]interface{}{
			"type": serviceType,
			"nodePorts": map[string]interface{}{
				"http":  30080,
				"https": 30443,
			},
		}
	}

	values := map[string]interface{}{
		"contour": map[string]interface{}{
			"configFileContents": map[string]interface{}{
				"debug": false,
			},
		},
		"envoy": map[string]interface{}{
			"service": serviceValues,
		},
	}

	if helmChart == nil {
		output.FailTask("Contour-Install", "Helm chart is nil")
		return fmt.Errorf("helm chart is nil")
	}

	_, err = installClient.Run(helmChart, values)
	if err != nil {
		output.FailTask("Contour-Install", fmt.Sprintf("Error installing Contour: %v", err.Error()))
		return err
	}

	output.SucceedTask("Contour-Install", "Contour installed successfully")

	return nil
}

func (ci *ContourInstaller) saveKubeConfigToTemp() (string, error) {
	if ci.platformClient == nil {
		return "", fmt.Errorf("platformClient is nil")
	}

	clientConfig := ci.platformClient.GetClientConfig()
	if clientConfig == nil {
		return "", fmt.Errorf("clientConfig is nil")
	}

	rawConfig, err := clientConfig.RawConfig()
	if err != nil {
		return "", err
	}

	configBytes, err := clientcmd.Write(rawConfig)
	if err != nil {
		return "", err
	}

	tmpFile, err := os.CreateTemp("", ".contour-*")
	if err != nil {
		return "", err
	}
	defer tmpFile.Close()

	// Set file permissions to 0600 (read/write for user only)
	if err := os.Chmod(tmpFile.Name(), 0600); err != nil {
		return "", err
	}

	tmpFile.Write(configBytes)

	return tmpFile.Name(), nil
}
