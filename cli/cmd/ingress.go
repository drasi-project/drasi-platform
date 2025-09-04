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
	"fmt"
	"strings"

	"drasi.io/cli/output"
	"drasi.io/cli/sdk"
	"drasi.io/cli/sdk/ingress"
	"drasi.io/cli/sdk/registry"
	"github.com/spf13/cobra"
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
	var ingressIPAddress string
	var ingressServiceName string
	var ingressNamespace string
	var ingressClassName string
	var ingressAnnotations []string

	cmd := &cobra.Command{
		Use:   "init",
		Short: "Initialize ingress configuration for Drasi Sources and Reactions",
		Long: `Initialize ingress configuration to expose Drasi Sources and Reactions.
By default, installs Contour ingress controller to the projectcontour namespace.
Organizations with existing ingress controllers can use --use-existing to configure 
Drasi to work with their existing controller instead.

Usage examples:
  drasi ingress init                                                           # Install and configure Contour (default)
  drasi ingress init --ingress-annotation "projectcontour.io/websocket-routes=/ws"  # Install Contour with custom annotations
  drasi ingress init --use-existing --ingress-service-name ingress-nginx-controller --ingress-namespace ingress-nginx --ingress-class-name nginx    # Use existing NGINX controller
  drasi ingress init --use-existing --ingress-service-name traefik --ingress-namespace traefik-system --ingress-class-name traefik         # Use existing Traefik controller
  drasi ingress init --use-existing --ingress-class-name azure-application-gateway --ingress-ip-address <ip-address>                       # Use Azure Application Gateway Ingress Controller (AGIC)
  drasi ingress init --use-existing --ingress-class-name alb --ingress-annotation "alb.ingress.kubernetes.io/scheme=internet-facing" --ingress-annotation "alb.ingress.kubernetes.io/target-type=ip"  # Use AWS Load Balancer Controller with annotations`,
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

			// Validate that required flags are provided when using --use-existing
			if useExisting {
				if ingressClassName == "" {
					return fmt.Errorf("--ingress-class-name is required when using --use-existing")
				}
			}

			// Parse annotations from command line flags (common to both paths)
			annotationsMap := make(map[string]string)
			for _, annotation := range ingressAnnotations {
				if key, value, found := strings.Cut(annotation, "="); found {
					annotationsMap[strings.TrimSpace(key)] = strings.TrimSpace(value)
				}
			}

			if useExisting {
				output.InfoMessage("Configuring Drasi to use existing ingress controller")
				output.InfoMessage(fmt.Sprintf("IngressClass: %s", ingressClassName))

				config := &sdk.IngressConfig{
					IngressClassName:   ingressClassName,
					IngressService:     ingressServiceName,
					IngressNamespace:   ingressNamespace,
					GatewayIPAddress:   ingressIPAddress,
					IngressAnnotations: annotationsMap,
				}
				if err := k8sPlatformClient.UpdateIngressConfig(config, output); err != nil {
					return err
				}

				output.InfoMessage("Drasi configured to use existing ingress controller")
				return nil
			} else {
				// Create ingress installer (defaults to Contour)
				ingressInstaller, err := ingress.NewIngressInstaller("contour", k8sPlatformClient)
				if err != nil {
					return err
				}

				output.InfoMessage("Installing Contour ingress controller to projectcontour namespace...")

				if err := ingressInstaller.Install(namespace, output); err != nil {
					return err
				}

				// Get configuration from the installer
				installerConfig := ingressInstaller.GetIngressConfig()
				config := &sdk.IngressConfig{
					IngressClassName:   installerConfig.ClassName,
					IngressService:     installerConfig.ServiceName,
					IngressNamespace:   installerConfig.Namespace,
					GatewayIPAddress:   "",
					IngressAnnotations: annotationsMap, // Include annotations for Contour too
				}
				if err := k8sPlatformClient.UpdateIngressConfig(config, output); err != nil {
					return err
				}

				return nil
			}

		},
	}

	cmd.Flags().BoolVar(&useExisting, "use-existing", false, "Use existing ingress controller instead of installing Contour")
	cmd.Flags().StringVar(&ingressIPAddress, "ingress-ip-address", "", "Public IP address for the ingress controller (use with --use-existing for controllers like AGIC)")
	cmd.Flags().StringVar(&ingressServiceName, "ingress-service-name", "", "Name of the existing ingress controller LoadBalancer service (required with --use-existing for regular controllers)")
	cmd.Flags().StringVar(&ingressNamespace, "ingress-namespace", "", "Namespace where the existing ingress controller is installed (required with --use-existing for regular controllers)")
	cmd.Flags().StringVar(&ingressClassName, "ingress-class-name", "", "IngressClassName to use in ingress resources (required with --use-existing)")
	cmd.Flags().StringSliceVar(&ingressAnnotations, "ingress-annotation", []string{}, "Ingress annotations in key=value format (can be specified multiple times)")

	return cmd
}
