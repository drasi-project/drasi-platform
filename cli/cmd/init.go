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

	"drasi.io/cli/config"
	"drasi.io/cli/service"
	"drasi.io/cli/service/output"
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
			var installer *service.Installer
			local := false
			var registry string
			var version string

			var err error

			if local, err = cmd.Flags().GetBool("local"); err != nil {
				return err
			}

			if registry, err = cmd.Flags().GetString("registry"); err != nil {
				return err
			}

			if version, err = cmd.Flags().GetString("version"); err != nil {
				return err
			}

			var namespace string
			var clusterConfig ClusterConfig
			if namespace, err = cmd.Flags().GetString("namespace"); err != nil {
				return err
			}

			var runtimeVersion string
			var sidecarVersion string
			if runtimeVersion, err = cmd.Flags().GetString("dapr-runtime-version"); err != nil {
				return err
			}

			if sidecarVersion, err = cmd.Flags().GetString("dapr-sidecar-version"); err != nil {
				return err
			}

			clusterConfig.DrasiNamespace = namespace
			clusterConfig.DaprRuntimeVersion = runtimeVersion
			clusterConfig.DaprSidecarVersion = sidecarVersion
			saveConfig(clusterConfig)

			var skipDaprInstall bool
			if skipDaprInstall, err = cmd.Flags().GetBool("skip-dapr-install"); err != nil {
				return err
			}

			if installer, err = service.MakeInstaller(namespace); err != nil {
				return err
			}

			if local {
				fmt.Printf("Installing Drasi version %s with local images\n", version)
			} else {
				fmt.Printf("Installing Drasi with version %s from registry %s\n", version, registry)
			}

			output := output.NewTaskOutput()
			defer output.Close()

			if err := installer.Install(local, registry, version, output, namespace, skipDaprInstall); err != nil {
				return err
			}

			return nil
		},
	}

	initCommand.Flags().Bool("local", false, "Do not use a container registry, only locally available images.")
	initCommand.Flags().String("registry", config.Registry, "Container registry to pull images from.")
	initCommand.Flags().String("version", config.Version, "Container image version tag.")
	initCommand.Flags().StringP("namespace", "n", "drasi-system", "Kubernetes namespace to install Drasi into.")
	initCommand.Flags().String("dapr-runtime-version", "1.10.0", "Dapr runtime version to install.")
	initCommand.Flags().String("dapr-sidecar-version", "1.9.0", "Dapr sidecar (daprd) version to install.")
	initCommand.Flags().Bool("skip-dapr-install", false, "Skip installing Dapr runtime and sidecar.")
	return initCommand
}
