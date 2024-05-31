package cmd

import (
	"fmt"

	"drasi.io/cli/api"
	"drasi.io/cli/service"
	"github.com/spf13/cobra"
)

func NewDeleteCommand() *cobra.Command {
	var deleteCommand = &cobra.Command{
		Use:   "delete (-f [files] | KIND NAME)",
		Short: "Delete resources",
		Long:  `Deletes resources from provided manifests`,
		Args:  cobra.MinimumNArgs(0),
		RunE: func(cmd *cobra.Command, args []string) error {
			var err error
			var manifests *[]api.Manifest

			if manifests, err = loadManifests(cmd, args); err != nil {
				return err
			}

			var namespace string
			if namespace, err = cmd.Flags().GetString("namespace"); err != nil {
				return err
			}

			if cmd.Flags().Changed("namespace") == false {
				cfg := readConfig()
				namespace = cfg.DrasiNamespace
			}

			client := service.MakeApiClient(namespace)
			defer client.Close()
			results := make(chan service.StatusUpdate)
			go client.Delete(manifests, results)
			for r := range results {
				fmt.Println(r.Subject + ": " + r.Message)
			}

			return nil
		},
	}

	deleteCommand.Flags().BoolP("files", "f", false, "delete -f file1.yaml file2.yaml")

	return deleteCommand
}
