package cmd

import (
	"fmt"

	"drasi.io/cli/config"
	"drasi.io/cli/service"
	"github.com/spf13/cobra"
)

var Namespace string

func NewInitCommand() *cobra.Command {
	var initCommand = &cobra.Command{
		Use:   "init",
		Short: "Install Drasi",
		Long:  `Install Drasi`,
		Args:  cobra.MinimumNArgs(0),
		RunE: func(cmd *cobra.Command, args []string) error {
			var installer *service.Installer
			results := make(chan service.StatusUpdate)
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

			if installer, err = service.MakeInstaller(namespace); err != nil {
				return err
			}

			fmt.Println("Installing Drasi with version " + version + " from registry " + registry)
			go installer.Install(local, registry, version, results, namespace)

			for r := range results {
				fmt.Println(r.Subject + ": " + r.Message)
			}

			return nil
		},
	}

	initCommand.Flags().Bool("local", false, "Do not use a container registry, only locally available images")
	initCommand.Flags().String("registry", config.Registry, "Container registry to pull images from")
	initCommand.Flags().String("version", config.Version, "Container image version tag")
	initCommand.Flags().StringP("namespace", "n", "drasi-system", "Kubernetes namespace to install Drasi into")
	initCommand.Flags().String("dapr-runtime-version", "1.10.0", "Dapr runtime version to install")
	initCommand.Flags().String("dapr-sidecar-version", "1.9.0", "Dapr sidecar (daprd) version to install")
	return initCommand
}
