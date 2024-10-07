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

			client, err := service.MakeApiClient(namespace)
			if err != nil {
				fmt.Println("Error: " + err.Error())
				return nil
			}
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
