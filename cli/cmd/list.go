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
						val := reflect.ValueOf(result[i].Status).MapIndex(itemStatus[k])

						switch val.Elem().Kind() {
						case reflect.Slice:
							item[statusFieldName] = buildSubTable(val.Elem())
						default:
							item[statusFieldName] = fmt.Sprintf("%v", val.Elem())

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

func buildSubTable(data reflect.Value) string {

	var fields = make(map[string]any)
	var items []map[string]string

	if data.Kind() != reflect.Slice {
		return ""
	}

	for i := 0; i < data.Len(); i++ {

		if data.Index(i).Elem().Kind() != reflect.Map {
			continue
		}

		item := make(map[string]string)

		fieldNames := data.Index(i).Elem().MapKeys()
		for k := 0; k < len(fieldNames); k++ {
			fieldName := fieldNames[k].String()
			fields[fieldName] = nil
			val := data.Index(i).Elem().MapIndex(fieldNames[k])
			switch val.Elem().Kind() {
			case reflect.Slice:
				item[fieldName] = buildSubTable(val.Elem())
			default:
				switch val.Elem().Kind() {
				case reflect.String:
					item[fieldName] = fmt.Sprintf("%v", reflect.ValueOf(val.Elem()))
				case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:
					item[fieldName] = fmt.Sprintf("%d", val.Elem().Int())
				case reflect.Uint, reflect.Uint8, reflect.Uint16, reflect.Uint32, reflect.Uint64, reflect.Uintptr:
					item[fieldName] = fmt.Sprintf("%d", val.Elem().Uint())
				case reflect.Float32, reflect.Float64:
					item[fieldName] = fmt.Sprintf("%g", val.Elem().Float())
				case reflect.Bool:
					item[fieldName] = fmt.Sprintf("%t", val.Elem().Bool())
				}

			}
		}
		items = append(items, item)
	}
	tableString := &strings.Builder{}
	table := tablewriter.NewWriter(tableString)
	headers := []string{}
	for col := range fields {
		headers = append(headers, col)
	}
	sort.Strings(headers)
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

	return tableString.String()
}
