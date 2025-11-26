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
	"drasi.io/cli/api"
	"drasi.io/cli/sdk"
	"github.com/spf13/cobra"
	"gopkg.in/yaml.v3"
)

// describeCmdOptions holds dependencies for the describe command
type describeCmdOptions struct {
	platformClientFactory func(namespace string) (sdk.PlatformClient, error)
}

// NewDescribeCommand creates the describe command with optional dependency injection
func NewDescribeCommand(opts ...*describeCmdOptions) *cobra.Command {
	// Use the real implementation by default
	opt := &describeCmdOptions{
		platformClientFactory: defaultPlatformClientFactory,
	}
	// If options are provided (from tests), use them instead
	if len(opts) > 0 && opts[0] != nil {
		opt = opts[0]
	}
	var describeCommand = &cobra.Command{
		Use:   "describe kind name",
		Short: "Show the definition and status of a resource",
		Long: `Show the definition and current status of a specified resource.
		
Arguments:
  kind  The kind of resource to describe. Available kinds are (case-insensitive):
          - ContinuousQuery (or 'Query' for short)
          - QueryContainer
          - Reaction
          - ReactionProvider
          - Source
          - SourceProvider
  name  The name of the resource to describe.

Usage examples:
  drasi describe continuousquery my-query
  drasi describe source my-source -n my-namespace
`,

		Args: cobra.MinimumNArgs(2),
		RunE: func(cmd *cobra.Command, args []string) error {
			var result *api.Resource
			var err error

			var namespace string
			if namespace, err = cmd.Flags().GetString("namespace"); err != nil {
				return err
			}

			platformClient, err := opt.platformClientFactory(namespace)
			if err != nil {
				return err
			}

			client, err := platformClient.CreateDrasiClient()
			if err != nil {
				return err
			}
			defer client.Close()

			if result, err = client.GetResource(args[0], args[1]); err != nil {
				return err
			}

			var outp []byte
			if outp, err = yaml.Marshal(result); err != nil {
				return err
			}

			cmd.Println(string(outp))

			return nil
		},
	}

	return describeCommand
}
