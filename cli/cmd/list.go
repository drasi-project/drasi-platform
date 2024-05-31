package cmd

import (
	"fmt"
	"os"
	"reflect"
	"sort"

	"drasi.io/cli/api"
	"drasi.io/cli/service"
	"github.com/olekukonko/tablewriter"
	"github.com/spf13/cobra"
)

func NewListCommand() *cobra.Command {
	var listCommand = &cobra.Command{
		Use:   "list [kind]",
		Short: "Get status of all resources of a type",
		Long: `Get status of all resources of a type.
This command retrieves and displays the status of all resources of the specified type. The status includes various fields that provide information about the current state of the resource.

Arguments:
	kind   The type of resource for which to retrieve the status. 
	
Available types:
	Source
	Continuousquery (or query for short)
	Reaction
	Querycontainer
	SourceProvider
	ReactionProvider

Example:
	drasi list source
	drasi list continuousquery
	drasi list query
	drasi list sourceprovider
	drasi list reactionprovider
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

			client := service.MakeApiClient(namespace)
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
						item[statusFieldName] = fmt.Sprintf("%v", reflect.ValueOf(result[i].Status).MapIndex(itemStatus[k]).Elem())
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
					row = append(row, item[col])
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