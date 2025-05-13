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
	"errors"
	"strconv"

	"drasi.io/cli/sdk"
	"drasi.io/cli/sdk/registry"
	"github.com/spf13/cobra"
)

func NewTunnelCommand() *cobra.Command {
	var tunnelCommand = &cobra.Command{
		Use:   "tunnel kind name port",
		Short: "Create a tunnel to a Drasi resource",
		Long: `Create a secure tunnel to a specific Drasi resource.
		
Arguments:
  kind  The kind of resource to create a tunnel for. Available kinds are (case-insensitive):
        - Source      
        - Reaction         

  name  The name of the resource to create a tunnel for.
  port  The local port to use for the tunnel.

Usage examples:
  drasi tunnel reaction my-reaction 8080
`,

		Args: cobra.MinimumNArgs(3),
		RunE: func(cmd *cobra.Command, args []string) error {
			var err error

			var namespace string
			if namespace, err = cmd.Flags().GetString("namespace"); err != nil {
				return err
			}

			reg, err := registry.LoadCurrentRegistrationWithNamespace(namespace)
			if err != nil {
				return err
			}

			platformClient, err := sdk.NewPlatformClient(reg)
			if err != nil {
				return err
			}
			localPort, err := strconv.ParseUint(args[2], 10, 16)
			if err != nil {
				return errors.New("invalid port: must be a number between 0 and 65535")
			}

			return platformClient.CreateTunnel(args[0], args[1], uint16(localPort))
		},
	}

	return tunnelCommand
}
