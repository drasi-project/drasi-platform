package cmd

import (
	"fmt"

	"drasi.io/cli/api"
	"drasi.io/cli/service"
	"github.com/spf13/cobra"
)

func NewWaitCommand() *cobra.Command {
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

			client := service.MakeApiClient(namespace)
			defer client.Close()
			results := make(chan service.StatusUpdate)
			go client.ReadyWait(manifests, timeout, results)
			for r := range results {
				fmt.Println(r.Subject + ": " + r.Message)
			}

			return nil
		},
	}

	waitCommand.Flags().BoolP("files", "f", false, "wait -f file1.yaml file2.yaml")
	waitCommand.Flags().Int32P("timeout", "t", 60, "wait -t 60")

	return waitCommand
}
