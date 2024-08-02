package cmd

import (
	"fmt"

	"drasi.io/cli/config"
	"github.com/spf13/cobra"
)

func NewVersionCommand() *cobra.Command {
	var versionCommand = &cobra.Command{
		Use:   "version",
		Short: "Get Drasi CLI version",
		Long:  `Get Drasi CLI version`,
		Args:  cobra.MinimumNArgs(0),
		RunE: func(cmd *cobra.Command, args []string) error {
			fmt.Println("Drasi CLI version: " + config.Version)
			return nil
		},
	}

	return versionCommand
}
