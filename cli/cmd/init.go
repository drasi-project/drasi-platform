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

	"drasi.io/cli/installers"
	"drasi.io/cli/output"
	"drasi.io/cli/sdk"
	"drasi.io/cli/sdk/registry"

	"drasi.io/cli/config"
	"github.com/spf13/cobra"
)

var Namespace string

func NewInitCommand() *cobra.Command {
	var initCommand = &cobra.Command{
		Use:   "init",
		Short: "Install Drasi",
		Long: `Install Drasi on the Kubernetes cluster that is the current context in kubectl.
		
Usage examples:
  drasi init
  drasi init --local
  drasi init --registry myregistry.io/drasi --version 0.1.0
  drasi init -n my-namespace
`,
		Args: cobra.MinimumNArgs(0),
		RunE: func(cmd *cobra.Command, args []string) error {
			var installer installers.Installer
			local := false
			var dockerName string
			var containerRegistry string
			var version string

			var err error

			output := output.NewTaskOutput()
			defer output.Close()

			if dockerName, err = cmd.Flags().GetString("docker"); err != nil {
				return err
			}

			if dockerName != "" {
				var dd *sdk.DockerizedDeployer
				if dd, err = sdk.MakeDockerizedDeployer(); err != nil {
					return err
				}

				reg, err := dd.Build(dockerName, output)
				if err != nil {
					return err
				}
				if err := registry.SaveRegistration(dockerName, reg); err != nil {
					return err
				}
				if err := registry.SetCurrentRegistration(dockerName); err != nil {
					return err
				}
			}

			if local, err = cmd.Flags().GetBool("local"); err != nil {
				return err
			}

			if containerRegistry, err = cmd.Flags().GetString("registry"); err != nil {
				return err
			}

			if version, err = cmd.Flags().GetString("version"); err != nil {
				return err
			}

			var namespace string
			if namespace, err = cmd.Flags().GetString("namespace"); err != nil {
				return err
			}

			var daprRuntimeVersion string
			var daprSidecarVersion string
			if daprRuntimeVersion, err = cmd.Flags().GetString("dapr-runtime-version"); err != nil {
				return err
			}

			if daprSidecarVersion, err = cmd.Flags().GetString("dapr-sidecar-version"); err != nil {
				return err
			}

			reg, err := registry.LoadCurrentRegistrationWithNamespace(namespace)
			if err != nil {
				return err
			}

			if installer, err = installers.MakeInstaller(reg); err != nil {
				return err
			}

			installer.SetDaprRuntimeVersion(daprRuntimeVersion)
			installer.SetDaprSidecarVersion(daprSidecarVersion)

			if local {
				fmt.Printf("Installing Drasi version %s with local images\n", version)
			} else {
				fmt.Printf("Installing Drasi with version %s from registry %s\n", version, containerRegistry)
			}

			daprRegistry, err := cmd.Flags().GetString("dapr-registry")
			if err != nil {
				return err
			}
			if err := installer.Install(local, containerRegistry, version, output, daprRegistry); err != nil {
				return err
			}

			return nil
		},
	}

	initCommand.Flags().Bool("local", false, "Do not use a container registry, only locally available images.")
	initCommand.Flags().String("docker", "", "")
	initCommand.Flags().String("registry", config.Registry, "Container registry to pull images from.")
	initCommand.Flags().String("version", config.Version, "Container image version tag.")
	initCommand.Flags().StringP("namespace", "n", "drasi-system", "Kubernetes namespace to install Drasi into.")
	initCommand.Flags().String("dapr-runtime-version", "", "Dapr runtime version to install.")
	initCommand.Flags().String("dapr-sidecar-version", "latest", "Dapr sidecar (daprd) version to install.")
	initCommand.Flags().String("dapr-registry", "docker.io/daprio", "Container registry to pull Dapr images from.")
	return initCommand
}
