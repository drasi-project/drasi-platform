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

package cmd

import (
	"context"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
	"time"

	"drasi.io/cli/output"
	"drasi.io/cli/sdk"
	"drasi.io/cli/sdk/registry"
	"github.com/spf13/cobra"
	"gopkg.in/yaml.v3"
	helm "helm.sh/helm/v3/pkg/action"
	"helm.sh/helm/v3/pkg/chart/loader"
	"helm.sh/helm/v3/pkg/cli"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/cli-runtime/pkg/genericclioptions"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/clientcmd"
)

func NewIngressCommand() *cobra.Command {
	var ingressCommand = &cobra.Command{
		Use:   "ingress",
		Short: "Manage ingress controllers",
		Long:  `Manage ingress controllers for Drasi environments.`,
	}
	ingressCommand.AddCommand(newIngressInstallCommand())
	return ingressCommand
}

func newIngressInstallCommand() *cobra.Command {
	var installCommand = &cobra.Command{
		Use:   "install",
		Short: "Install ingress controllers",
		Long:  `Install ingress controllers for Drasi environments.`,
	}
	installCommand.AddCommand(newIngressInstallContourCommand())
	return installCommand
}

func newIngressInstallContourCommand() *cobra.Command {
	var namespace string
	var configFile string
	var wait bool

	var contourCommand = &cobra.Command{
		Use:   "contour",
		Short: "Install Contour ingress controller",
		Long: `Install the Contour ingress controller using the official Helm chart.

Contour is a high-performance ingress controller for Kubernetes that uses Envoy proxy.
This command will install Contour into the specified namespace.

Usage examples:
  drasi ingress install contour
  drasi ingress install contour --namespace contour-system
  drasi ingress install contour --config-file values.yaml --wait
`,
		RunE: func(cmd *cobra.Command, args []string) error {
			// Get namespace from flag or use default
			targetNamespace := namespace
			if targetNamespace == "" {
				// Check if global namespace flag was set
				if cmd.Parent().Parent().Parent().PersistentFlags().Lookup("namespace").Changed {
					targetNamespace, _ = cmd.Parent().Parent().Parent().PersistentFlags().GetString("namespace")
				}
				if targetNamespace == "" {
					targetNamespace = "projectcontour"
				}
			}

			// Create output handler
			taskOutput := output.NewTaskOutput()

			// Load current environment
			current, err := registry.LoadCurrentRegistration()
			if err != nil {
				return fmt.Errorf("unable to load current environment: %w", err)
			}

			// Create platform client
			platformClient, err := sdk.NewPlatformClient(current)
			if err != nil {
				return fmt.Errorf("unable to create platform client: %w", err)
			}

			kubeClient, ok := platformClient.(*sdk.KubernetesPlatformClient)
			if !ok {
				return fmt.Errorf("contour installation is only supported on Kubernetes environments")
			}

			return installContour(kubeClient, targetNamespace, configFile, wait, taskOutput)
		},
	}

	contourCommand.Flags().StringVarP(&namespace, "namespace", "n", "", "Namespace to install Contour into (default: projectcontour)")
	contourCommand.Flags().StringVarP(&configFile, "config-file", "f", "", "Path to custom Helm values file")
	contourCommand.Flags().BoolVarP(&wait, "wait", "w", false, "Wait for Contour to be ready before returning")

	return contourCommand
}

func installContour(platformClient *sdk.KubernetesPlatformClient, namespace string, configFile string, waitForReady bool, output output.TaskOutput) error {
	// Start task
	output.AddTask("Contour-Install", "Installing Contour ingress controller")

	// Get Kubernetes client
	kubeConfig := platformClient.GetKubeConfig()
	kubeClient, err := kubernetes.NewForConfig(kubeConfig)
	if err != nil {
		output.FailTask("Contour-Install", fmt.Sprintf("Error creating Kubernetes client: %v", err))
		return err
	}

	// Verify cluster permissions
	err = verifyClusterPermissions(kubeClient, output)
	if err != nil {
		output.FailTask("Contour-Install", fmt.Sprintf("Insufficient cluster permissions: %v", err))
		return err
	}

	// Get kubeconfig file path for Helm by saving to temp file
	kubeContextFile, err := saveKubeConfigToTemp(platformClient)
	if err != nil {
		output.FailTask("Contour-Install", fmt.Sprintf("Error saving kubeconfig: %v", err))
		return err
	}
	defer os.Remove(kubeContextFile)

	// Setup Helm configuration
	flags := genericclioptions.ConfigFlags{
		Namespace:  &namespace,
		KubeConfig: &kubeContextFile,
	}
	helmConfig := helm.Configuration{}

	err = helmConfig.Init(&flags, namespace, "secret", func(format string, v ...any) {})
	if err != nil {
		output.FailTask("Contour-Install", fmt.Sprintf("Error initializing Helm: %v", err))
		return err
	}

	// Pull Contour Helm chart from official repository
	pull := helm.NewPull()
	pull.RepoURL = "https://charts.bitnami.com/bitnami"
	pull.Settings = &cli.EnvSettings{}
	pull.Devel = true
	pullopt := helm.WithConfig(&helmConfig)
	pullopt(pull)

	dir, err := os.MkdirTemp("", "drasi-contour")
	if err != nil {
		output.FailTask("Contour-Install", fmt.Sprintf("Error creating temp directory: %v", err))
		return err
	}
	defer os.RemoveAll(dir)

	pull.DestDir = dir
	pull.ChartPathOptions.RepoURL = pull.RepoURL
	pull.ChartPathOptions.Version = ""

	_, err = pull.Run("contour")
	if err != nil {
		output.FailTask("Contour-Install", fmt.Sprintf("Error pulling Contour chart: %v", err))
		return err
	}

	// Find the chart directory
	files, err := os.ReadDir(dir)
	if err != nil {
		output.FailTask("Contour-Install", fmt.Sprintf("Error reading temp directory: %v", err))
		return err
	}

	var chartDir string
	for _, file := range files {
		if file.IsDir() && strings.HasPrefix(file.Name(), "contour") {
			chartDir = filepath.Join(dir, file.Name())
			break
		}
	}

	if chartDir == "" {
		output.FailTask("Contour-Install", "Contour chart directory not found")
		return fmt.Errorf("contour chart directory not found")
	}

	// Load the chart
	helmChart, err := loader.Load(chartDir)
	if err != nil {
		output.FailTask("Contour-Install", fmt.Sprintf("Error loading Contour chart: %v", err))
		return err
	}

	// Setup install client
	installClient := helm.NewInstall(&helmConfig)
	installClient.ReleaseName = "contour"
	installClient.Namespace = namespace
	installClient.Wait = waitForReady
	installClient.CreateNamespace = true
	installClient.Timeout = time.Duration(300) * time.Second

	// Load custom values if provided
	values := helmChart.Values
	if configFile != "" {
		customValues, err := loadCustomValues(configFile)
		if err != nil {
			output.FailTask("Contour-Install", fmt.Sprintf("Error loading config file: %v", err))
			return err
		}
		// Merge custom values with default values
		values = mergeValues(values, customValues)
	}

	// Install Contour
	_, err = installClient.Run(helmChart, values)
	if err != nil {
		output.FailTask("Contour-Install", fmt.Sprintf("Error installing Contour: %v", err))
		return err
	}

	// Verify installation
	err = verifyContourInstallation(kubeClient, namespace, output)
	if err != nil {
		output.FailTask("Contour-Install", fmt.Sprintf("Contour installation verification failed: %v", err))
		return err
	}

	output.SucceedTask("Contour-Install", "Contour installed successfully")
	return nil
}

func verifyClusterPermissions(kubeClient *kubernetes.Clientset, output output.TaskOutput) error {
	// Check if we can create namespaces
	_, err := kubeClient.CoreV1().Namespaces().List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return fmt.Errorf("cannot list namespaces: %w", err)
	}
	return nil
}

func loadCustomValues(configFile string) (map[string]interface{}, error) {
	file, err := os.Open(configFile)
	if err != nil {
		return nil, fmt.Errorf("failed to open config file %s: %w", configFile, err)
	}
	defer file.Close()

	data, err := io.ReadAll(file)
	if err != nil {
		return nil, fmt.Errorf("failed to read config file %s: %w", configFile, err)
	}

	var values map[string]interface{}
	err = yaml.Unmarshal(data, &values)
	if err != nil {
		return nil, fmt.Errorf("failed to parse YAML config file %s: %w", configFile, err)
	}

	return values, nil
}

func mergeValues(base, custom map[string]interface{}) map[string]interface{} {
	if custom == nil {
		return base
	}

	result := make(map[string]interface{})

	// Copy base values
	for k, v := range base {
		result[k] = v
	}

	// Override with custom values
	for k, v := range custom {
		result[k] = v
	}

	return result
}

func verifyContourInstallation(kubeClient *kubernetes.Clientset, namespace string, output output.TaskOutput) error {
	// Check if Contour deployments are ready
	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	// Wait for contour deployment to be ready
	for {
		select {
		case <-ctx.Done():
			return fmt.Errorf("timeout waiting for Contour to be ready")
		default:
			deployments, err := kubeClient.AppsV1().Deployments(namespace).List(context.TODO(), metav1.ListOptions{
				LabelSelector: "app.kubernetes.io/name=contour",
			})
			if err != nil {
				return fmt.Errorf("error checking Contour deployments: %w", err)
			}

			if len(deployments.Items) > 0 {
				ready := true
				for _, deployment := range deployments.Items {
					if deployment.Status.ReadyReplicas < deployment.Status.Replicas {
						ready = false
						break
					}
				}
				if ready {
					return nil
				}
			}
			time.Sleep(5 * time.Second)
		}
	}
}

func saveKubeConfigToTemp(platformClient *sdk.KubernetesPlatformClient) (string, error) {
	rawConfig, err := platformClient.GetClientConfig().RawConfig()
	if err != nil {
		return "", err
	}
	configBytes, err := clientcmd.Write(rawConfig)
	if err != nil {
		return "", err
	}

	tmpFile, err := os.CreateTemp("", "kubeconfig")
	if err != nil {
		return "", err
	}
	defer tmpFile.Close()

	_, err = tmpFile.Write(configBytes)
	if err != nil {
		return "", err
	}

	return tmpFile.Name(), nil
}
