package cmd

import (
	"drasi.io/cli/api"
	"drasi.io/cli/service"
	"drasi.io/cli/service/output"
	"fmt"
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
				fmt.Printf("Error reading manifest: %v", err.Error())
				return nil
			}

			if len(*manifests) == 0 {
				fmt.Printf("no manifests found. Did you forget to specify the '-f' flag")
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

			client, err := service.MakeApiClient(namespace)
			if err != nil {
				fmt.Println("Error: " + err.Error())
				return nil
			}
			defer client.Close()

			p, output := output.NewTaskOutput()
			defer p.Wait()
			defer output.Quit()

			client.Delete(manifests, output)

			return nil
		},
	}

	deleteCommand.Flags().BoolP("files", "f", false, "delete -f file1.yaml file2.yaml")

	return deleteCommand
}
