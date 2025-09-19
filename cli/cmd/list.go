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
	"reflect"
	"sort"
	"strings"

	"drasi.io/cli/api"
	"drasi.io/cli/sdk"
	"github.com/olekukonko/tablewriter"
	"github.com/spf13/cobra"
)

// listCmdOptions holds dependencies for the list command
type listCmdOptions struct {
	platformClientFactory func(namespace string) (sdk.PlatformClient, error)
}

// NewListCommand creates the list command with optional dependency injection
func NewListCommand(opts ...*listCmdOptions) *cobra.Command {
	// Use the real implementation by default
	opt := &listCmdOptions{
		platformClientFactory: defaultPlatformClientFactory,
	}
	// If options are provided (from tests), use them instead
	if len(opts) > 0 && opts[0] != nil {
		opt = opts[0]
	}
	var listCommand = &cobra.Command{
		Use:   "list [kind]",
		Short: "Show a list of available resources",
		Long: `Show a list of available resources of a specified kind along with their current status.

Arguments:
  kind  The kind of resource to list. Available kinds are (case-insensitive):
          - ContinuousQuery (or 'Query' for short)
          - QueryContainer
          - Reaction
          - ReactionProvider
          - Source
          - SourceProvider

Usage examples:
  drasi list continuousquery
  drasi list source -n my-namespace
`,
		Args: cobra.MinimumNArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			var result []api.Resource
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

			if result, err = client.ListResources(args[0]); err != nil {
				return err
			}

			var statusFields = make(map[string]any)
			var items []map[string]string

			for i := 0; i < len(result); i++ {
				item := make(map[string]string)
				item["id"] = result[i].Id
				if result[i].Status != nil {
					itemStatus := reflect.ValueOf(result[i].Status).MapKeys()
					for k := 0; k < len(itemStatus); k++ {
						statusFieldName := itemStatus[k].String()
						statusFields[statusFieldName] = nil
						val := reflect.ValueOf(result[i].Status).MapIndex(itemStatus[k])

						// Check if the value is valid and not null
						if !val.IsValid() || val.IsNil() {
							item[statusFieldName] = ""
							continue
						}

						elem := val.Elem()
						if !elem.IsValid() {
							item[statusFieldName] = ""
							continue
						}

						switch elem.Kind() {
						case reflect.Map:
							var builder strings.Builder
							iter := elem.MapRange()
							for iter.Next() {
								builder.WriteString(iter.Key().String())
								builder.WriteString(" - ")
								builder.WriteString(iter.Value().Elem().String())
								builder.WriteString("\n")
							}
							item[statusFieldName] = builder.String()
						default:
							item[statusFieldName] = fmt.Sprintf(" %v", elem)
						}
					}
				}

				items = append(items, item)
			}

			table := tablewriter.NewWriter(cmd.OutOrStdout())
			headers := []string{}
			for col := range statusFields {
				headers = append(headers, col)
			}
			sort.Strings(headers)
			headers = append([]string{"id"}, headers...)
			table.SetHeader(headers)
			for _, item := range items {
				var row []string
				for _, col := range headers {
					row = append(row, strings.TrimSpace(item[col]))
				}
				table.Append(row)
			}

			table.SetBorder(false)
			table.Render()

			return nil
		},
	}

	return listCommand
}
