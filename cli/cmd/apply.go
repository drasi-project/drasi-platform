package cmd

import (
	"fmt"
	"os"

	"drasi.io/cli/api"
	"drasi.io/cli/service"
	"github.com/spf13/cobra"
)

func NewApplyCommand(output *os.File) *cobra.Command {
	var applyCommand = &cobra.Command{
		Use:   "apply -f [files]",
		Short: "Apply resources",
		Long:  `Creates or updates resources from provided manifests`,
		Args:  cobra.MinimumNArgs(0),
		RunE: func(cmd *cobra.Command, args []string) error {
			var err error
			var manifests *[]api.Manifest

			if manifests, err = loadManifests(cmd, args); err != nil {
				output.WriteString(fmt.Sprintf("Error reading manifest: %v\n", err.Error()))
				return nil
			}

			if len(*manifests) == 0 {
				output.WriteString(fmt.Sprintf("no manifests found. Did you forget to specify the '-f' flag\n"))
				return nil
			}

			var namespace string
			if namespace, err = cmd.Flags().GetString("namespace"); err != nil {
				return err
			}

			// If a namespace is not provided, use the one from the config file
			if cmd.Flags().Changed("namespace") == false {
				cfg := readConfig()
				namespace = cfg.DrasiNamespace
			}

			client, err := service.MakeApiClient(namespace)
			if err != nil {
				return err
			}
			defer client.Close()

			client.Apply(manifests, output)

			return nil
		},
	}

	applyCommand.Flags().BoolP("files", "f", false, "apply -f file1.yaml file2.yaml")

	return applyCommand
}
