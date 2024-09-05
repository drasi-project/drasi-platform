package cmd

import (
	"drasi.io/cli/api"
	"drasi.io/cli/service"
	"drasi.io/cli/service/output"
	"errors"
	"github.com/spf13/cobra"
)

func NewApplyCommand() *cobra.Command {
	var applyCommand = &cobra.Command{
		Use:   "apply -f [files]",
		Short: "Apply resources",
		Long:  `Creates or updates resources from provided manifests`,
		Args:  cobra.MinimumNArgs(0),
		RunE: func(cmd *cobra.Command, args []string) error {
			var err error
			var manifests *[]api.Manifest

			if manifests, err = loadManifests(cmd, args); err != nil {
				return err
			}

			if len(*manifests) == 0 {
				return errors.New("no manifests found. Did you forget to specify the '-f' flag")
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

			p, output := output.NewTaskOutput()
			defer p.Wait()
			defer output.Quit()

			err = client.Apply(manifests, output)
			if err != nil {
				return err
			}

			return nil
		},
	}

	applyCommand.Flags().BoolP("files", "f", false, "apply -f file1.yaml file2.yaml")

	return applyCommand
}
