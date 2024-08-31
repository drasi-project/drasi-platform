package cmd

import (
	"github.com/spf13/cobra"
	"os"
)

var RootCommand = &cobra.Command{Use: "drasi"}

func init() {

	RootCommand.AddCommand(
		NewInitCommand(os.Stdout),
		NewApplyCommand(os.Stdout),
		NewDeleteCommand(),
		NewDescribeCommand(),
		NewListCommand(),
		NewWaitCommand(os.Stdout),
		NewNamespaceCommand(),
		NewUninstallCommand(),
		NewVersionCommand(),
	)

	RootCommand.PersistentFlags().StringP("namespace", "n", "drasi-system", "Kubernetes namespace to install Drasi into")
}
