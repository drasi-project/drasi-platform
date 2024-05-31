package cmd

import (
	"fmt"

	"drasi.io/cli/api"
	"drasi.io/cli/service"
	"github.com/spf13/cobra"
	"gopkg.in/yaml.v3"
)

func NewDescribeCommand() *cobra.Command {
	var describeCommand = &cobra.Command{
		Use:   "describe [kind] [name]",
		Short: "Get spec and status of a resource",
		Long:  `Get spec and status of a resource`,
		Args:  cobra.MinimumNArgs(2),
		RunE: func(cmd *cobra.Command, args []string) error {
			var result *api.Resource
			var err error

			var namespace string
			if namespace, err = cmd.Flags().GetString("namespace"); err != nil {
				return err
			}

			if cmd.Flags().Changed("namespace") == false {
				cfg := readConfig()
				namespace = cfg.DrasiNamespace
			}

			client := service.MakeApiClient(namespace)
			defer client.Close()

			if result, err = client.GetResource(args[0], args[1]); err != nil {
				return err
			}

			var outp []byte
			if outp, err = yaml.Marshal(result); err != nil {
				return err
			}

			fmt.Println(string(outp))

			return nil
		},
	}

	return describeCommand
}
