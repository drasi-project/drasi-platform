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

	"drasi.io/cli/output"
	"drasi.io/cli/sdk"
	"drasi.io/cli/sdk/ingress"
	"drasi.io/cli/sdk/registry"
	"github.com/spf13/cobra"
)

func NewIngressCommand() *cobra.Command {
	var ingressCommand = &cobra.Command{
		Use:   "ingress",
		Short: "Manage Contour ingress for Drasi Sources and Reactions",
		Long:  `Manage Contour ingress configuration to expose Drasi Sources and Reactions deployed in your namespace. Contour will be installed to the projectcontour namespace.`,
	}

	ingressCommand.AddCommand(ingressInitCommand())

	return ingressCommand
}

func ingressInitCommand() *cobra.Command {
	return &cobra.Command{
		Use:   "init",
		Short: "Initialize Contour ingress for Drasi Sources and Reactions",
		Long: `Initialize Contour ingress controller to expose Drasi Sources and Reactions.
This command installs Contour to the projectcontour namespace and configures ingress resources 
to enable external access to Drasi Sources and Reactions deployed in your namespace.

Usage examples:
  drasi ingress init
  drasi ingress init -n my-namespace`,
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

			// Create and use Contour installer
			contourInstaller, err := ingress.MakeContourInstaller(k8sPlatformClient)
			if err != nil {
				return err
			}

			fmt.Printf("Installing Contour ingress controller to projectcontour namespace...\n")

			if err := contourInstaller.Install(namespace, output); err != nil {
				return err
			}

			fmt.Println("Contour ingress initialization completed successfully!")

			return nil
		},
	}
}
