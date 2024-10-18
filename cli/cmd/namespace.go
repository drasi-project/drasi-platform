package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

func NewNamespaceCommand() *cobra.Command {
	var namespaceCommand = &cobra.Command{
		Use:   "namespace",
		Short: "Manage CLI namespace settings",
		Long:  `Manage the default Kubernetes namespace used by the Drasi CLI.`,
	}
	namespaceCommand.AddCommand(setNamespaceCommand())
	namespaceCommand.AddCommand(getNamespaceCommand())
	namespaceCommand.AddCommand(listNamespaceCommand())
	return namespaceCommand
}

func setNamespaceCommand() *cobra.Command {
	var setNamespaceCommand = &cobra.Command{
		Use:   "set [namespace]",
		Short: "Set the default Drasi environment",
		Long: `Set the default namespace used as the target for all Drasi CLI commands. 
This namespace is used as the target for all future Drasi CLI commands unless overridden using the '-n' flag.
If both a default namespace is configured and the '-n' flag is used, the '-n' flag takes precedence.

If a default namespace is never set, the Drasi CLI will use the default namespace 'drasi-system'.

Arguments:
  namespace  The name of the Kubernetes namespace to configure as the default Drasi environment.
             This commands assumes that Drasi has been installed to the namespace specified and does not verify it is there.

Usage examples:
  drasi namespace get
  drasi namespace set my-namespace
  drasi namespace list
`,
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
		Short: "Show the current default Drasi environment",
		Long:  `Get the current default namespace used for all Drasi CLI commands.`,
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
		Short: "List all Drasi environments",
		Long:  `List all namespaces on the default Kubernetes cluster that have Drasi installed in them.`,
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
