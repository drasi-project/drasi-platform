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

	"drasi.io/cli/output"

	"drasi.io/cli/api"
	"drasi.io/cli/sdk"
	"drasi.io/cli/sdk/registry"
	"github.com/spf13/cobra"
)

func NewApplyCommand() *cobra.Command {
	var applyCommand = &cobra.Command{
		Use:   "apply",
		Short: "Create or update resources",
		Long: `Create or update resources based on definitions contained in one or more YAML files.
		
Usage examples:
  drasi apply -f resources.yaml
  drasi apply -f sources.yaml queries.yaml reactions.yaml
  drasi apply -f resources.yaml -n my-namespace
`,

		Args: cobra.MinimumNArgs(0),
		RunE: func(cmd *cobra.Command, args []string) error {
			var err error
			var manifests *[]api.Manifest

			if manifests, err = loadManifests(cmd, args); err != nil {
				return err
			}

			if len(*manifests) == 0 {
				return errors.New("no manifests found. Did you forget to specify the '-f' flag")
			}

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

			client, err := platformClient.CreateDrasiClient()
			if err != nil {
				return err
			}
			defer client.Close()

			output := output.NewTaskOutput()
			defer output.Close()

			err = client.Apply(manifests, output)
			if err != nil {
				return err
			}

			return nil
		},
	}

	applyCommand.Flags().BoolP("files", "f", false, "apply -f file1.yaml file2.yaml")

	return applyCommand
}
