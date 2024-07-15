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
	namespaceCommand.AddCommand(getNamespaceCommand())
	namespaceCommand.AddCommand(listNamespaceCommand())
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
				return fmt.Errorf("too many arguments")
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
				return fmt.Errorf("namespace cannot be empty")
			}

			cfg := readConfig()
			fmt.Println("Namespace set to " + cfg.DrasiNamespace)

			return nil
		},
	}
	return setNamespaceCommand
}

func getNamespaceCommand() *cobra.Command {
	return &cobra.Command{
		Use:   "get",
		Short: "Get the current namespace",
		Long:  `Retrieve the current Drasi namespace`,
		RunE: func(cmd *cobra.Command, args []string) error {
			cfg := readConfig()
			fmt.Println("Current namespace: " + cfg.DrasiNamespace)
			return nil
		},
	}
}

func listNamespaceCommand() *cobra.Command {
	return &cobra.Command{
		Use:   "list",
		Short: "List all namespaces",
		Long:  `List all namespaces that have Drasi installed.`,
		RunE: func(cmd *cobra.Command, args []string) error {
			// Logic to list all namespaces
			namespaces, err := listNamespaces()
			if err != nil {
				return err
			}

			fmt.Println("Namespaces:")
			for _, ns := range namespaces {
				fmt.Println(ns)
			}

			return nil
		},
	}
}
