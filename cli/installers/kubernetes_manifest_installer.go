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
	"fmt"
	"os"
	"path/filepath"
	"strings"

	drasiapi "drasi.io/cli/api"
	"drasi.io/cli/output"
	"gopkg.in/yaml.v3"
	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
)

type KubernetesManifestInstaller struct {
	outputDir          string
	kubernetesFilename string
	drasiFilename      string
	daprRuntimeVersion string
	daprSidecarVersion string
}

func MakeKubernetesManifestInstaller(outputDir string) (*KubernetesManifestInstaller, error) {
	result := KubernetesManifestInstaller{
		outputDir:          outputDir,
		kubernetesFilename: "kubernetes-resources.yaml",
		drasiFilename:      "drasi-resources.yaml",
		daprRuntimeVersion: DAPR_RUNTIME_VERSION,
		daprSidecarVersion: DAPR_SIDECAR_VERSION,
	}

	// Ensure output directory exists
	if err := os.MkdirAll(outputDir, 0755); err != nil {
		return nil, fmt.Errorf("failed to create output directory: %w", err)
	}

	return &result, nil
}

func (t *KubernetesManifestInstaller) SetDaprRuntimeVersion(version string) {
	t.daprRuntimeVersion = version
}

func (t *KubernetesManifestInstaller) SetDaprSidecarVersion(version string) {
	t.daprSidecarVersion = version
}

func (t *KubernetesManifestInstaller) Install(localMode bool, acr string, version string, output output.TaskOutput, daprRegistry string, observabilityLevel string) error {
	var kubernetesManifests []string
	var drasiManifests []string

	output.AddTask("Manifest-Generation", "Generating Kubernetes and Drasi manifests...")

	// Generate namespace manifest
	namespaceManifest := t.generateNamespaceManifest()
	kubernetesManifests = append(kubernetesManifests, namespaceManifest)

	// Generate ConfigMap manifest
	configMapManifest, err := t.generateConfigMapManifest(localMode, acr, version)
	if err != nil {
		output.FailTask("Manifest-Generation", fmt.Sprintf("Error generating ConfigMap: %v", err))
		return err
	}
	kubernetesManifests = append(kubernetesManifests, configMapManifest)

	// Generate Dapr manifests (this would typically be handled differently)
	daprManifest := t.generateDaprPlaceholder(daprRegistry)
	kubernetesManifests = append(kubernetesManifests, daprManifest)

	// Generate infrastructure manifests
	infraManifests, err := t.generateInfrastructureManifests()
	if err != nil {
		output.FailTask("Manifest-Generation", fmt.Sprintf("Error generating infrastructure manifests: %v", err))
		return err
	}
	kubernetesManifests = append(kubernetesManifests, infraManifests...)

	// Generate observability manifests
	observabilityManifests, err := t.generateObservabilityManifests(observabilityLevel)
	if err != nil {
		output.FailTask("Manifest-Generation", fmt.Sprintf("Error generating observability manifests: %v", err))
		return err
	}
	kubernetesManifests = append(kubernetesManifests, observabilityManifests...)

	// Generate service account manifests
	svcAcctManifests, err := t.generateServiceAccountManifests()
	if err != nil {
		output.FailTask("Manifest-Generation", fmt.Sprintf("Error generating service account manifests: %v", err))
		return err
	}
	kubernetesManifests = append(kubernetesManifests, svcAcctManifests...)

	// Generate control plane manifests
	controlPlaneManifests, err := t.generateControlPlaneManifests(localMode, acr, version)
	if err != nil {
		output.FailTask("Manifest-Generation", fmt.Sprintf("Error generating control plane manifests: %v", err))
		return err
	}
	kubernetesManifests = append(kubernetesManifests, controlPlaneManifests...)

	// Generate Drasi resource manifests
	queryContainerManifests, err := t.generateQueryContainerManifests()
	if err != nil {
		output.FailTask("Manifest-Generation", fmt.Sprintf("Error generating query container manifests: %v", err))
		return err
	}
	drasiManifests = append(drasiManifests, queryContainerManifests...)

	sourceProviderManifests, err := t.generateSourceProviderManifests()
	if err != nil {
		output.FailTask("Manifest-Generation", fmt.Sprintf("Error generating source provider manifests: %v", err))
		return err
	}
	drasiManifests = append(drasiManifests, sourceProviderManifests...)

	reactionProviderManifests, err := t.generateReactionProviderManifests()
	if err != nil {
		output.FailTask("Manifest-Generation", fmt.Sprintf("Error generating reaction provider manifests: %v", err))
		return err
	}
	drasiManifests = append(drasiManifests, reactionProviderManifests...)

	// Write Kubernetes manifests to file
	if err := t.writeManifestsToFile(kubernetesManifests, t.kubernetesFilename); err != nil {
		output.FailTask("Manifest-Generation", fmt.Sprintf("Error writing Kubernetes manifests: %v", err))
		return err
	}

	// Write Drasi manifests to file
	if err := t.writeManifestsToFile(drasiManifests, t.drasiFilename); err != nil {
		output.FailTask("Manifest-Generation", fmt.Sprintf("Error writing Drasi manifests: %v", err))
		return err
	}

	output.SucceedTask("Manifest-Generation", fmt.Sprintf("Manifests generated successfully:\n  - %s\n  - %s",
		filepath.Join(t.outputDir, t.kubernetesFilename),
		filepath.Join(t.outputDir, t.drasiFilename)))

	return nil
}

func (t *KubernetesManifestInstaller) generateNamespaceManifest() string {
	return `apiVersion: v1
kind: Namespace
metadata:
  name: drasi-system
  labels:
    drasi.io/namespace: "true"`
}

func (t *KubernetesManifestInstaller) generateConfigMapManifest(localMode bool, acr string, version string) (string, error) {
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

	configMap := map[string]interface{}{
		"apiVersion": "v1",
		"kind":       "ConfigMap",
		"metadata": map[string]string{
			"name":      "drasi-config",
			"namespace": "drasi-system",
		},
		"data": cfg,
	}

	yamlBytes, err := yaml.Marshal(configMap)
	if err != nil {
		return "", err
	}

	return string(yamlBytes), nil
}

func (t *KubernetesManifestInstaller) generateDaprPlaceholder(daprRegistry string) string {
	return fmt.Sprintf(`# Dapr installation placeholder
# Install Dapr using Helm with registry: %s
# Version: %s
# Command: helm install dapr dapr/dapr --version %s --namespace dapr-system --create-namespace --set global.registry=%s --set dapr_operator.watchInterval=10s`,
		daprRegistry, t.daprRuntimeVersion, t.daprRuntimeVersion, daprRegistry)
}

func (t *KubernetesManifestInstaller) generateInfrastructureManifests() ([]string, error) {
	raw, err := resources.ReadFile("resources/infra.yaml")
	if err != nil {
		return nil, err
	}

	manifests, err := readK8sManifests(raw)
	if err != nil {
		return nil, err
	}

	return t.convertUnstructuredToYAML(manifests)
}

func (t *KubernetesManifestInstaller) generateObservabilityManifests(observabilityLevel string) ([]string, error) {
	if observabilityLevel == "none" {
		return []string{}, nil
	}

	fileName := map[string]string{
		"tracing": "tracing.yaml",
		"metrics": "metrics.yaml",
		"full":    "full-observability.yaml",
	}[observabilityLevel]

	if fileName == "" {
		return []string{}, nil
	}

	raw, err := resources.ReadFile("resources/observability/" + fileName)
	if err != nil {
		return nil, err
	}

	manifests, err := readK8sManifests(raw)
	if err != nil {
		return nil, err
	}

	result, err := t.convertUnstructuredToYAML(manifests)
	if err != nil {
		return nil, err
	}

	// Add otel-collector
	otelRaw, err := resources.ReadFile("resources/observability/otel-collector.yaml")
	if err != nil {
		return nil, err
	}

	otelManifests, err := readK8sManifests(otelRaw)
	if err != nil {
		return nil, err
	}

	otelYAML, err := t.convertUnstructuredToYAML(otelManifests)
	if err != nil {
		return nil, err
	}

	result = append(result, otelYAML...)
	return result, nil
}

func (t *KubernetesManifestInstaller) generateServiceAccountManifests() ([]string, error) {
	raw, err := resources.ReadFile("resources/service-account.yaml")
	if err != nil {
		return nil, err
	}

	manifests, err := readK8sManifests(raw)
	if err != nil {
		return nil, err
	}

	return t.convertUnstructuredToYAML(manifests)
}

func (t *KubernetesManifestInstaller) generateControlPlaneManifests(localMode bool, acr string, version string) ([]string, error) {
	raw, err := resources.ReadFile("resources/control-plane.yaml")
	if err != nil {
		return nil, err
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

	manifests, err := readK8sManifests(raw)
	if err != nil {
		return nil, err
	}

	return t.convertUnstructuredToYAML(manifests)
}

func (t *KubernetesManifestInstaller) generateQueryContainerManifests() ([]string, error) {
	raw, err := resources.ReadFile("resources/default-container.yaml")
	if err != nil {
		return nil, err
	}

	manifests, err := drasiapi.ReadManifests(raw)
	if err != nil {
		return nil, err
	}

	return t.convertDrasiManifestsToYAML(*manifests)
}

func (t *KubernetesManifestInstaller) generateSourceProviderManifests() ([]string, error) {
	raw, err := resources.ReadFile("resources/default-source-providers.yaml")
	if err != nil {
		return nil, err
	}

	manifests, err := drasiapi.ReadManifests(raw)
	if err != nil {
		return nil, err
	}

	return t.convertDrasiManifestsToYAML(*manifests)
}

func (t *KubernetesManifestInstaller) generateReactionProviderManifests() ([]string, error) {
	raw, err := resources.ReadFile("resources/default-reaction-providers.yaml")
	if err != nil {
		return nil, err
	}

	manifests, err := drasiapi.ReadManifests(raw)
	if err != nil {
		return nil, err
	}

	return t.convertDrasiManifestsToYAML(*manifests)
}

func (t *KubernetesManifestInstaller) convertUnstructuredToYAML(manifests []*unstructured.Unstructured) ([]string, error) {
	var result []string

	for _, manifest := range manifests {
		// Set namespace for namespaced resources
		if t.isNamespacedResource(manifest) {
			if manifest.GetNamespace() == "" {
				manifest.SetNamespace("drasi-system")
			}
		}

		yamlBytes, err := yaml.Marshal(manifest.Object)
		if err != nil {
			return nil, err
		}
		result = append(result, string(yamlBytes))
	}

	return result, nil
}

func (t *KubernetesManifestInstaller) isNamespacedResource(manifest *unstructured.Unstructured) bool {
	// List of cluster-scoped resources that should not have a namespace
	clusterScopedKinds := []string{
		"Namespace",
		"ClusterRole",
		"ClusterRoleBinding",
		"PersistentVolume",
		"StorageClass",
		"PriorityClass",
		"CustomResourceDefinition",
		"Node",
	}

	kind := manifest.GetKind()
	for _, clusterKind := range clusterScopedKinds {
		if kind == clusterKind {
			return false
		}
	}

	return true
}

func (t *KubernetesManifestInstaller) convertDrasiManifestsToYAML(manifests []drasiapi.Manifest) ([]string, error) {
	var result []string

	for _, manifest := range manifests {
		yamlBytes, err := yaml.Marshal(manifest)
		if err != nil {
			return nil, err
		}
		result = append(result, string(yamlBytes))
	}

	return result, nil
}

func (t *KubernetesManifestInstaller) writeManifestsToFile(manifests []string, filename string) error {
	filePath := filepath.Join(t.outputDir, filename)

	var buffer bytes.Buffer
	for i, manifest := range manifests {
		if i > 0 {
			buffer.WriteString("---\n")
		}
		buffer.WriteString(manifest)
		if !strings.HasSuffix(manifest, "\n") {
			buffer.WriteString("\n")
		}
	}

	return os.WriteFile(filePath, buffer.Bytes(), 0644)
}
