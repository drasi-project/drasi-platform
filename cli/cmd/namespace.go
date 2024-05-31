package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

func NewNamespaceCommand() *cobra.Command {
	var namespaceCommand = &cobra.Command{
		Use:   "namespace",
		Short: "Manage namespaces",
		Long:  `Configure the namespace settings for Drasi`,
	}
	namespaceCommand.AddCommand(setNamespaceCommand())
	return namespaceCommand
}

func setNamespaceCommand() *cobra.Command {
	var setNamespaceCommand = &cobra.Command{
		Use:   "set [namespace]",
		Short: "Set the namespace",
		Long: `Set the default namespace for Drasi. 
This commands assumes that Drasi has been installed to the namespace specified.`,
		Args: cobra.MinimumNArgs(0),
		RunE: func(cmd *cobra.Command, args []string) error {
			if len(args) > 1 {
				return fmt.Errorf("Too many arguments")
			}
			var err error
			var namespace string
			var clusterConfig ClusterConfig

			if len(args) == 1 {
				namespace = args[0]
			}

			if cmd.Flags().Changed("namespace") {
				if namespace, err = cmd.Flags().GetString("namespace"); err != nil {
					return err
				}
			}

			if namespace != "" {
				clusterConfig.DrasiNamespace = namespace
				saveConfig(clusterConfig)
			} else {
				return fmt.Errorf("Namespace cannot be empty")
			}

			cfg := readConfig()
			fmt.Println("Namespace set to " + cfg.DrasiNamespace)

			return nil
		},
	}
	return setNamespaceCommand
}
