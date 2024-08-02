package cmd

import (
	"github.com/spf13/cobra"
)

var RootCommand = &cobra.Command{Use: "drasi"}

func init() {
	RootCommand.AddCommand(
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

	RootCommand.PersistentFlags().StringP("namespace", "n", "drasi-system", "Kubernetes namespace to install Drasi into")
}
