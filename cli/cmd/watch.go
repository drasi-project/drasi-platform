package cmd

import (
	"fmt"

	"drasi.io/cli/service"
	"drasi.io/cli/service/output"
	"github.com/spf13/cobra"
)

func NewWatchCommand() *cobra.Command {
	var watchCommand = &cobra.Command{
		Use:   "watch [kind] [name]",
		Short: "Watch a resource",
		Long:  `Watch a resource`,
		Args:  cobra.MinimumNArgs(2),
		RunE: func(cmd *cobra.Command, args []string) error {
			var err error

			var namespace string
			if namespace, err = cmd.Flags().GetString("namespace"); err != nil {
				return err
			}

			if cmd.Flags().Changed("namespace") == false {
				cfg := readConfig()
				namespace = cfg.DrasiNamespace
			}

			client, err := service.MakeApiClient(namespace)
			if err != nil {
				fmt.Println("Error: " + err.Error())
				return nil
			}
			defer client.Close()

			var out = make(chan map[string]interface{}, 10)

			go client.Watch(args[0], args[1], out)

			ui := output.NewQueryResults()

			for item := range out {
				//fmt.Printf("Received ITEM: %+v\n", item)
				data, _ := output.CreateChangeMsg(item)
				ui.Change(*data)
			}

			return nil
		},
	}

	return watchCommand
}
