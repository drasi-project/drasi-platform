package cmd

import (
	"os"

	"drasi.io/cli/api"
	"drasi.io/cli/service"
	"github.com/spf13/cobra"
)

func NewWaitCommand(output *os.File) *cobra.Command {
	var waitCommand = &cobra.Command{
		Use:   "wait (-f [files] | KIND NAME)",
		Short: "Wait for resources to be ready",
		Long:  `Waits for resources from provided manifests`,
		Args:  cobra.MinimumNArgs(0),
		RunE: func(cmd *cobra.Command, args []string) error {
			var err error
			var manifests *[]api.Manifest
			var timeout int32

			if manifests, err = loadManifests(cmd, args); err != nil {
				return err
			}

			if timeout, err = cmd.Flags().GetInt32("timeout"); err != nil {
				return err
			}

			var namespace string
			if namespace, err = cmd.Flags().GetString("namespace"); err != nil {
				return err
			}

			if namespace != "" {
				cfg := readConfig()
				namespace = cfg.DrasiNamespace
			}

			client, err := service.MakeApiClient(namespace)
			if err != nil {
				return err
			}
			defer client.Close()

			client.ReadyWait(manifests, timeout, output)

			return nil
		},
	}

	waitCommand.Flags().BoolP("files", "f", false, "wait -f file1.yaml file2.yaml")
	waitCommand.Flags().Int32P("timeout", "t", 60, "wait -t 60")

	return waitCommand
}
