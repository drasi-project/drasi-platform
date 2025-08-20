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

package ingress

import (
	"context"
	"fmt"

	"drasi.io/cli/output"
	"drasi.io/cli/sdk"
	rbacv1 "k8s.io/api/rbac/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	corev1apply "k8s.io/client-go/applyconfigurations/core/v1"
	"k8s.io/client-go/kubernetes"
)

// IngressInstaller defines the interface for installing and configuring ingress controllers
type IngressInstaller interface {
	// Install installs the ingress controller and configures it for Drasi usage
	Install(drasiNamespace string, output output.TaskOutput) error

	// GetIngressConfig returns the configuration details for this ingress controller
	GetIngressConfig() IngressConfig
}

// IngressConfig contains the configuration details for an ingress controller
type IngressConfig struct {
	ClassName   string // The IngressClass name to use in ingress resources
	ServiceName string // The LoadBalancer service name for IP discovery
	Namespace   string // The namespace where the ingress controller is installed
}

// NewIngressInstaller creates a new IngressInstaller based on the specified type
func NewIngressInstaller(installerType string, platformClient *sdk.KubernetesPlatformClient) (IngressInstaller, error) {
	switch installerType {
	case "contour":
		return MakeContourInstaller(platformClient)
	default:
		return nil, fmt.Errorf("unsupported ingress installer type: %s", installerType)
	}
}

// GetIngressConfig returns the Contour ingress controller configuration
func (ci *ContourInstaller) GetIngressConfig() IngressConfig {
	return IngressConfig{
		ClassName:   "contour",
		ServiceName: "contour-envoy",
		Namespace:   "projectcontour",
	}
}

// UpdateIngressConfig updates the drasi-config ConfigMap with ingress controller configuration
func UpdateIngressConfig(platformClient *sdk.KubernetesPlatformClient, drasiNamespace string, ingressClassName, ingressService, ingressNamespace string, output output.TaskOutput) error {
	output.AddTask("Ingress-Config", "Updating ingress configuration")

	kubeConfig := platformClient.GetKubeConfig()
	kubeClient, err := kubernetes.NewForConfig(kubeConfig)
	if err != nil {
		output.FailTask("Ingress-Config", fmt.Sprintf("Error creating Kubernetes client: %v", err))
		return err
	}

	currentConfigMap, err := kubeClient.CoreV1().ConfigMaps(drasiNamespace).Get(context.TODO(), "drasi-config", metav1.GetOptions{})
	if err != nil {
		output.FailTask("Ingress-Config", fmt.Sprintf("Error getting drasi-config ConfigMap: %v", err))
		return err
	}

	// Update the ConfigMap data with ingress configuration
	cfg := currentConfigMap.Data
	if cfg == nil {
		cfg = make(map[string]string)
	}

	cfg["INGRESS_CLASS_NAME"] = ingressClassName
	cfg["INGRESS_LOAD_BALANCER_SERVICE"] = ingressService
	cfg["INGRESS_LOAD_BALANCER_NAMESPACE"] = ingressNamespace

	// Clear previous AGIC configuration if it exists
	delete(cfg, "INGRESS_AZURE_APPLICATION_GATEWAY")
	delete(cfg, "INGRESS_AZURE_APPLICATION_GATEWAY_NAMESPACE")

	// Apply the updated ConfigMap
	configMap := corev1apply.ConfigMap("drasi-config", drasiNamespace).WithData(cfg)
	if _, err := kubeClient.CoreV1().ConfigMaps(drasiNamespace).Apply(context.TODO(), configMap, metav1.ApplyOptions{
		FieldManager: "drasi-ingress",
	}); err != nil {
		output.FailTask("Ingress-Config", fmt.Sprintf("Error updating ConfigMap: %v", err))
		return err
	}

	output.SucceedTask("Ingress-Config", "Ingress configuration updated")
	return nil
}

// UpdateClusterRolePermissions updates the ClusterRole to grant service access in the specified namespace
func UpdateClusterRolePermissions(platformClient *sdk.KubernetesPlatformClient, output output.TaskOutput) error {
	output.AddTask("RBAC-Update", "Updating ClusterRole permissions for ingress namespace")

	kubeConfig := platformClient.GetKubeConfig()
	kubeClient, err := kubernetes.NewForConfig(kubeConfig)
	if err != nil {
		output.FailTask("RBAC-Update", fmt.Sprintf("Error creating Kubernetes client: %v", err))
		return err
	}

	clusterRoleName := "drasi-resource-provider-cluster-role"

	// Get current ClusterRole
	currentClusterRole, err := kubeClient.RbacV1().ClusterRoles().Get(context.TODO(), clusterRoleName, metav1.GetOptions{})
	if err != nil {
		output.FailTask("RBAC-Update", fmt.Sprintf("Error getting ClusterRole: %v", err))
		return err
	}

	// Check if we already have generic service permissions
	hasGenericServiceAccess := false
	for _, rule := range currentClusterRole.Rules {
		for _, apiGroup := range rule.APIGroups {
			if apiGroup == "" { // Core API group
				for _, resource := range rule.Resources {
					if resource == "services" {
						hasGet := false
						hasList := false
						for _, verb := range rule.Verbs {
							if verb == "get" {
								hasGet = true
							}
							if verb == "list" {
								hasList = true
							}
						}
						if hasGet && hasList && len(rule.ResourceNames) == 0 {
							hasGenericServiceAccess = true
							break
						}
					}
				}
			}
		}
		if hasGenericServiceAccess {
			break
		}
	}

	if hasGenericServiceAccess {
		output.InfoTask("RBAC-Update", "ClusterRole already has generic service access")
		output.SucceedTask("RBAC-Update", "No ClusterRole update needed")
		return nil
	}

	// Update the ClusterRole to have generic service access
	var updatedRules []rbacv1.PolicyRule
	for _, rule := range currentClusterRole.Rules {
		// Skip service rules with resourceNames (e.g., contour-envoy specific rule)
		isServiceRuleWithNames := false
		for _, apiGroup := range rule.APIGroups {
			if apiGroup == "" {
				for _, resource := range rule.Resources {
					if resource == "services" && len(rule.ResourceNames) > 0 {
						isServiceRuleWithNames = true
						break
					}
				}
			}
		}
		if !isServiceRuleWithNames {
			updatedRules = append(updatedRules, rule)
		}
	}

	updatedRules = append(updatedRules, rbacv1.PolicyRule{
		APIGroups: []string{""},
		Resources: []string{"services"},
		Verbs:     []string{"get", "list"},
	})

	// Update the ClusterRole
	currentClusterRole.Rules = updatedRules
	_, err = kubeClient.RbacV1().ClusterRoles().Update(context.TODO(), currentClusterRole, metav1.UpdateOptions{})
	if err != nil {
		output.FailTask("RBAC-Update", fmt.Sprintf("Error updating ClusterRole: %v", err))
		return err
	}

	output.SucceedTask("RBAC-Update", "ClusterRole updated")
	return nil
}

// UpdateIngressConfigForAgic updates the drasi-config ConfigMap for AGIC configuration
func UpdateIngressConfigForAgic(platformClient *sdk.KubernetesPlatformClient, drasiNamespace string, ingressClassName string, gatewayIPAddress string, output output.TaskOutput) error {
	output.AddTask("AGIC-Config", "Configuring Drasi for Azure Application Gateway Ingress Controller")

	kubeConfig := platformClient.GetKubeConfig()
	kubeClient, err := kubernetes.NewForConfig(kubeConfig)
	if err != nil {
		output.FailTask("AGIC-Config", fmt.Sprintf("Error creating Kubernetes client: %v", err))
		return err
	}

	currentConfigMap, err := kubeClient.CoreV1().ConfigMaps(drasiNamespace).Get(context.TODO(), "drasi-config", metav1.GetOptions{})
	if err != nil {
		output.FailTask("AGIC-Config", fmt.Sprintf("Error getting drasi-config ConfigMap: %v", err))
		return err
	}

	cfg := currentConfigMap.Data
	if cfg == nil {
		cfg = make(map[string]string)
	}

	// Clear previous ingress configuration
	delete(cfg, "INGRESS_LOAD_BALANCER_SERVICE")
	delete(cfg, "INGRESS_LOAD_BALANCER_NAMESPACE")

	cfg["INGRESS_CLASS_NAME"] = ingressClassName
	cfg["INGRESS_TYPE"] = "agic"
	cfg["AGIC_GATEWAY_IP"] = gatewayIPAddress

	configMap := corev1apply.ConfigMap("drasi-config", drasiNamespace).WithData(cfg)
	if _, err := kubeClient.CoreV1().ConfigMaps(drasiNamespace).Apply(context.TODO(), configMap, metav1.ApplyOptions{
		FieldManager: "drasi-ingress",
		Force:        true,
	}); err != nil {
		output.FailTask("AGIC-Config", fmt.Sprintf("Error updating ConfigMap: %v", err))
		return err
	}

	output.SucceedTask("AGIC-Config", "AGIC configuration updated")
	return nil
}
