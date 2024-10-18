package cmd

import (
	"fmt"
	"os"
	"reflect"
	"sort"
	"strings"

	"drasi.io/cli/api"
	"drasi.io/cli/service"
	"github.com/olekukonko/tablewriter"
	"github.com/spf13/cobra"
)

func NewListCommand() *cobra.Command {
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

						switch val.Elem().Kind() {
						case reflect.Map:
							var builder strings.Builder
							iter := val.Elem().MapRange()
							for iter.Next() {
								builder.WriteString(iter.Key().String())
								builder.WriteString(" - ")
								builder.WriteString(iter.Value().Elem().String())
								builder.WriteString("\n")
							}
							item[statusFieldName] = builder.String()
						default:
							item[statusFieldName] = fmt.Sprintf(" %v", val.Elem())
						}
					}
				}
				items = append(items, item)
			}

			table := tablewriter.NewWriter(os.Stdout)
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
