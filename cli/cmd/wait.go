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
	"drasi.io/cli/service"
	"drasi.io/cli/service/output"
	"github.com/spf13/cobra"
)

func NewWaitCommand() *cobra.Command {
	var waitCommand = &cobra.Command{
		Use:   "wait [kind name] |",
		Short: "Wait for resources to be ready",
		Long: `Wait for a resource to be ready based on a specified kind and name, or use the '-f' flag to specify one or more YAML files containing the definitions of resources to wait for.

Will not return until all resources are ready or the specified timeout is reached.

Arguments:
  kind  The kind of resource to wait for. Available kinds are (case-insensitive):
          - Reaction
          - Source
  name  The name of the resource to wait for.

Usage examples:
  drasi wait source my-source
  drasi wait -f sources.yaml reactions.yaml
  drasi wait -f resources.yaml -n my-namespace
`,

		Args: cobra.MinimumNArgs(0),
		RunE: func(cmd *cobra.Command, args []string) error {
			var err error
			var manifests *[]api.Manifest
			var timeout int32

			if manifests, err = loadManifests(cmd, args); err != nil {
				return err
			}

			if timeout, err = cmd.Flags().GetInt32("timeout"); err != nil {
				return err
			}

			var namespace string
			if namespace, err = cmd.Flags().GetString("namespace"); err != nil {
				return err
			}

			if namespace != "" {
				cfg := readConfig()
				namespace = cfg.DrasiNamespace
			}

			client, err := service.MakeApiClient(namespace)
			if err != nil {
				return err
			}
			defer client.Close()

			output := output.NewTaskOutput()
			defer output.Close()

			err = client.ReadyWait(manifests, timeout, output)
			if err != nil {
				return err
			}

			return nil
		},
	}

	waitCommand.Flags().BoolP("files", "f", false, "wait -f file1.yaml file2.yaml")
	waitCommand.Flags().Int32P("timeout", "t", 60, "wait -t 60")

	return waitCommand
}
