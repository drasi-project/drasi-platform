// Copyright 2024 The Drasi Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package cmd

import (
	"drasi.io/cli/service/output/query_results"
	"fmt"

	"drasi.io/cli/service"
	"github.com/spf13/cobra"
)

func NewWatchCommand() *cobra.Command {
	var watchCommand = &cobra.Command{
		Use:   "watch [query name]",
		Short: "Watch the result set of a query",
		Long:  `Watch the result set of a query`,
		Args:  cobra.MinimumNArgs(1),
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
			var initError = make(chan error)

			go client.Watch("query", args[0], out, initError)

			err = <-initError
			if err != nil {
				return err
			}

			ui := query_results.NewQueryResults(func() {
				close(out)
			})

			for item := range out {
				data, err := query_results.CreateChangeMsg(item)
				if err != nil {
					return err
				}
				ui.Change(*data)
			}

			ui.Close()

			return nil
		},
	}

	return watchCommand
}
