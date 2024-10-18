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

	// Declare the 'help' persistent flag so we can hide the default flag from the help output text.
	// It is redundant given the default template that is used for the help output.
	rootCommand.PersistentFlags().BoolP("help", "h", false, "Show help for the command.")
	rootCommand.PersistentFlags().MarkHidden("help")

	rootCommand.PersistentFlags().StringP("namespace", "n", "", `The Drasi environment to target with the command, identified by the Kubernetes namespace in which the Drasi environment is installed.
If not provided, the current default Drasi environment is the target. 
See the 'namespace' command for a description of how to set the default environment.`)

	return rootCommand
}
