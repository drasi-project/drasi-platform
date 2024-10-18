package cmd

import (
	"fmt"

	"drasi.io/cli/config"
	"github.com/spf13/cobra"
)

func NewVersionCommand() *cobra.Command {
	var versionCommand = &cobra.Command{
		Use:   "version",
		Short: "Show the Drasi CLI version",
		Long: `Show the Drasi CLI version. 
By default, this is the version of Drasi that the 'init' command will install when run.

Usage examples:
  drasi version
`,
		Args: cobra.MinimumNArgs(0),
		RunE: func(cmd *cobra.Command, args []string) error {
			fmt.Println("Drasi CLI version: " + config.Version)
			return nil
		},
	}

	return versionCommand
}
