package cmd

import (
	"github.com/spf13/cobra"
)

func MakeRootCommand() *cobra.Command {
	var rootCommand = &cobra.Command{Use: "drasi", SilenceUsage: true}

	rootCommand.AddCommand(
		NewInitCommand(),
		NewApplyCommand(),
		NewDeleteCommand(),
		NewDescribeCommand(),
		NewListCommand(),
		NewWaitCommand(),
		NewNamespaceCommand(),
		NewUninstallCommand(),
		NewVersionCommand(),
	)

	rootCommand.PersistentFlags().StringP("namespace", "n", "drasi-system", "Kubernetes namespace to install Drasi into")

	return rootCommand
}
