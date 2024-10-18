package cmd

import (
	"errors"

	"drasi.io/cli/api"
	"drasi.io/cli/service"
	"drasi.io/cli/service/output"
	"github.com/spf13/cobra"
)

func NewDeleteCommand() *cobra.Command {
	var deleteCommand = &cobra.Command{
		Use:   "delete [kind name] |",
		Short: "Delete resources",
		Long: `Deletes a resource based on a specified kind and name, or use the '-f' flag to specify one or more YAML files containing the definitions of one or more resources to delete.
		
Arguments:
  kind  The kind of resource to delete. Available kinds are (case-insensitive):
          - ContinuousQuery (or 'Query' for short)
          - QueryContainer
          - Reaction
          - ReactionProvider
          - Source
          - SourceProvider
  name  The name of the resource to delete.

Usage examples:
  drasi delete continuousquery my-query
  drasi delete -f sources.yaml queries.yaml reactions.yaml
  drasi delete -f resources.yaml -n my-namespace
`,
		Args: cobra.MinimumNArgs(0),
		RunE: func(cmd *cobra.Command, args []string) error {
			var err error
			var manifests *[]api.Manifest

			if manifests, err = loadManifests(cmd, args); err != nil {
				return err
			}

			if len(*manifests) == 0 {
				return errors.New("no resource specified, specify a resource KIND and NAME or use the '-f' flag to specify a file")
			}

			var namespace string
			if namespace, err = cmd.Flags().GetString("namespace"); err != nil {
				return err
			}

			if !cmd.Flags().Changed("namespace") {
				cfg := readConfig()
				namespace = cfg.DrasiNamespace
			}

			client, err := service.MakeApiClient(namespace)
			if err != nil {
				return err
			}
			defer client.Close()

			output := output.NewTaskOutput()
			defer output.Close()

			err = client.Delete(manifests, output)
			if err != nil {
				return err
			}

			return nil
		},
	}

	deleteCommand.Flags().BoolP("files", "f", false, "delete -f file1.yaml file2.yaml")

	return deleteCommand
}
