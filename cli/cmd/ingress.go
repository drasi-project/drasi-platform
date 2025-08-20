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

	"drasi.io/cli/output"
	"drasi.io/cli/sdk"
	"drasi.io/cli/sdk/ingress"
	"drasi.io/cli/sdk/registry"
	"github.com/spf13/cobra"
	rbacv1 "k8s.io/api/rbac/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	corev1apply "k8s.io/client-go/applyconfigurations/core/v1"
	"k8s.io/client-go/kubernetes"
)

func NewIngressCommand() *cobra.Command {
	var ingressCommand = &cobra.Command{
		Use:   "ingress",
		Short: "Manage ingress controllers for Drasi Sources and Reactions",
		Long:  `Manage ingress controller configuration to expose Drasi Sources and Reactions deployed in your namespace. Supports multiple ingress controllers including Contour (default), Nginx, and others.`,
	}

	ingressCommand.AddCommand(ingressInitCommand())

	return ingressCommand
}

func ingressInitCommand() *cobra.Command {
	var useExisting bool
	var useAgic bool
	var gatewayIPAddress string
	var ingressServiceName string
	var ingressNamespace string
	var ingressClassName string

	cmd := &cobra.Command{
		Use:   "init",
		Short: "Initialize ingress configuration for Drasi Sources and Reactions",
		Long: `Initialize ingress configuration to expose Drasi Sources and Reactions.
By default, installs Contour ingress controller to the projectcontour namespace.
Organizations with existing ingress controllers can use --use-existing to configure 
Drasi to work with their existing controller instead.
For Azure Application Gateway Ingress Controller (AGIC), use --use-agic.

Usage examples:
  drasi ingress init                                                           # Install and configure Contour (default)
  drasi ingress init --use-existing --ingress-service-name ingress-nginx-controller --ingress-namespace ingress-nginx --ingress-class-name nginx    # Use existing NGINX controller
  drasi ingress init --use-existing --ingress-service-name traefik --ingress-namespace traefik-system --ingress-class-name traefik         # Use existing Traefik controller
  drasi ingress init --use-agic --ingress-class-name azure-application-gateway --gateway-ip-address <ip-address? # Use Azure Application Gateway Ingress Controller`,
		Args: cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			var namespace string
			var err error

			if namespace, err = cmd.Flags().GetString("namespace"); err != nil {
				return err
			}

			if namespace == "" {
				namespace = "drasi-system"
			}

			output := output.NewTaskOutput()
			defer output.Close()

			// Get current registry configuration
			reg, err := registry.LoadCurrentRegistrationWithNamespace(namespace)
			if err != nil {
				return err
			}

			// Create platform client
			platformClient, err := sdk.NewPlatformClient(reg)
			if err != nil {
				return err
			}

			// Ensure we have a Kubernetes platform client
			k8sPlatformClient, ok := platformClient.(*sdk.KubernetesPlatformClient)
			if !ok {
				return fmt.Errorf("ingress command only supports Kubernetes environments")
			}

			// Validate mutually exclusive flags
			if useExisting && useAgic {
				return fmt.Errorf("--use-existing and --use-agic are mutually exclusive")
			}

			// Validate that required flags are provided when using --use-existing
			if useExisting {
				if ingressServiceName == "" {
					return fmt.Errorf("--ingress-service-name is required when using --use-existing")
				}
				if ingressNamespace == "" {
					return fmt.Errorf("--ingress-namespace is required when using --use-existing")
				}
				if ingressClassName == "" {
					return fmt.Errorf("--ingress-class-name is required when using --use-existing")
				}
			}

			// Validate that required flags are provided when using --use-agic
			if useAgic {
				if ingressClassName == "" {
					return fmt.Errorf("--ingress-class-name is required when using --use-agic")
				}
				if gatewayIPAddress == "" {
					return fmt.Errorf("--gateway-ip-address is required when using --use-agic")
				}
			}

			if useExisting {
				output.InfoMessage("Configuring Drasi to use existing ingress controller")
				output.InfoMessage(fmt.Sprintf("Service: %s in namespace: %s", ingressServiceName, ingressNamespace))
				output.InfoMessage(fmt.Sprintf("IngressClass: %s", ingressClassName))

				if err := UpdateIngressConfig(k8sPlatformClient, namespace, ingressClassName, ingressServiceName, ingressNamespace, output); err != nil {
					return err
				}

				if err := UpdateClusterRolePermissions(k8sPlatformClient, output); err != nil {
					return err
				}

				output.InfoMessage("Drasi configured to use existing ingress controller")
				return nil
			} else if useAgic {
				output.InfoMessage("Configuring Drasi to use Azure Application Gateway Ingress Controller (AGIC)")
				output.InfoMessage(fmt.Sprintf("IngressClass: %s", ingressClassName))
				output.InfoMessage(fmt.Sprintf("Gateway IP: %s", gatewayIPAddress))

				// For AGIC, we store the gateway IP for hostname generation
				if err := UpdateIngressConfigForAgic(k8sPlatformClient, namespace, ingressClassName, gatewayIPAddress, output); err != nil {
					return err
				}

				output.InfoMessage("Drasi configured to use Azure Application Gateway Ingress Controller")
				return nil
			} else {
				// Create and use Contour installer
				contourInstaller, err := ingress.MakeContourInstaller(k8sPlatformClient)
				if err != nil {
					return err
				}

				output.InfoMessage("Installing Contour ingress controller to projectcontour namespace...")

				if err := contourInstaller.Install(namespace, output); err != nil {
					return err
				}

				if err := UpdateIngressConfig(k8sPlatformClient, namespace, "contour", "contour-envoy", "projectcontour", output); err != nil {
					return err
				}

				return nil
			}

		},
	}

	cmd.Flags().BoolVar(&useExisting, "use-existing", false, "Use existing ingress controller instead of installing Contour")
	cmd.Flags().BoolVar(&useAgic, "use-agic", false, "Use Azure Application Gateway Ingress Controller (AGIC)")
	cmd.Flags().StringVar(&gatewayIPAddress, "gateway-ip-address", "", "Public IP address of the Application Gateway (required with --use-agic)")
	cmd.Flags().StringVar(&ingressServiceName, "ingress-service-name", "", "Name of the existing ingress controller LoadBalancer service (required with --use-existing)")
	cmd.Flags().StringVar(&ingressNamespace, "ingress-namespace", "", "Namespace where the existing ingress controller is installed (required with --use-existing)")
	cmd.Flags().StringVar(&ingressClassName, "ingress-class-name", "", "IngressClassName to use in ingress resources (required with --use-existing or --use-agic)")

	return cmd
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
