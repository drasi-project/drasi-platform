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

	"drasi.io/cli/config"
	"drasi.io/cli/installers"
	"drasi.io/cli/output"
	"drasi.io/cli/sdk/registry"
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
  drasi init --docker
  drasi init --docker my-container
  drasi init --registry myregistry.io/drasi --version 0.1.0
  drasi init -n my-namespace
  drasi init --manifest
  drasi init --manifest ./manifests
`,
		Args: cobra.MinimumNArgs(0),
		RunE: func(cmd *cobra.Command, args []string) error {
			var installer installers.Installer
			local := false
			useDocker := false
			var containerRegistry string
			var version string
			var manifestOutput string
			useManifest := false

			var err error

			output := output.NewTaskOutput()
			defer output.Close()

			if local, err = cmd.Flags().GetBool("local"); err != nil {
				return err
			}

			if version, err = cmd.Flags().GetString("version"); err != nil {
				return err
			}

			if manifestOutput, err = cmd.Flags().GetString("manifest"); err != nil {
				return err
			}
			useManifest = manifestOutput != ""

			if useDocker, err = cmd.Flags().GetBool("docker"); err != nil {
				return err
			}

			var dd *installers.DockerizedDeployer
			if useDocker {
				dockerName := "docker"
				if len(args) > 0 {
					dockerName = args[0]
				}

				if dd, err = installers.MakeDockerizedDeployer(); err != nil {
					return err
				}

				reg, err := dd.Build(dockerName, local, version, output)
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

			if containerRegistry, err = cmd.Flags().GetString("registry"); err != nil {
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

			if useManifest {
				// Use manifest installer
				outputDir := manifestOutput
				if outputDir == "" {
					outputDir = "."
				}
				if installer, err = installers.MakeKubernetesManifestInstaller(outputDir); err != nil {
					return err
				}
			} else {
				reg, err := registry.LoadCurrentRegistrationWithNamespace(namespace)
				if err != nil {
					return err
				}

				if installer, err = installers.MakeInstaller(reg); err != nil {
					return err
				}
			}

			installer.SetDaprRuntimeVersion(daprRuntimeVersion)
			installer.SetDaprSidecarVersion(daprSidecarVersion)

			if useManifest {
				fmt.Printf("Generating Drasi manifests version %s to directory: %s\n", version, manifestOutput)
			} else if local {
				fmt.Printf("Installing Drasi version %s with local images\n", version)
			} else {
				fmt.Printf("Installing Drasi with version %s from registry %s\n", version, containerRegistry)
			}

			daprRegistry, err := cmd.Flags().GetString("dapr-registry")
			if err != nil {
				return err
			}

			observabilityLevel, err := cmd.Flags().GetString("observability-level")
			if err != nil {
				return err
			}
			// Validate observability-level
			validLevels := []string{"none", "metrics", "tracing", "full"}
			isValid := false
			for _, level := range validLevels {
				if strings.ToLower(observabilityLevel) == level {
					isValid = true
					break
				}
			}
			if !isValid {
				return fmt.Errorf("invalid observability-level '%s'; must be one of: none, metrics, tracing, full", observabilityLevel)
			}
			if err := installer.Install(local, containerRegistry, version, output, daprRegistry, observabilityLevel); err != nil {
				return err
			}

			if useDocker {
				if err := dd.ConfigureTraefikForDocker("drasi-system", output); err != nil {
					return fmt.Errorf("failed to configure Traefik for Docker: %w", err)
				}
			}

			return nil
		},
	}

	initCommand.Flags().Bool("local", false, "Do not use a container registry, only locally available images.")
	initCommand.Flags().Bool("docker", false, "Build a docker container and install Drasi into it.")
	initCommand.Flags().String("registry", config.Registry, "Container registry to pull images from.")
	initCommand.Flags().String("version", config.Version, "Container image version tag.")
	initCommand.Flags().StringP("namespace", "n", "drasi-system", "Kubernetes namespace to install Drasi into.")
	initCommand.Flags().String("dapr-runtime-version", "1.4.5", "Dapr runtime version to install.")
	initCommand.Flags().String("dapr-sidecar-version", "1.4.5", "Dapr sidecar (daprd) version to install.")
	initCommand.Flags().String("dapr-registry", "docker.io/daprio", "Container registry to pull Dapr images from.")
	initCommand.Flags().String("observability-level", "none", "Observability level to install. Options: none, metrics, tracing, full.")
	initCommand.Flags().String("manifest", "", "Generate manifests to files instead of installing. Optional parameter specifies output directory (default: current directory).")

	return initCommand
}
