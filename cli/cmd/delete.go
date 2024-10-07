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
	"errors"
	"github.com/spf13/cobra"
)

func NewDeleteCommand() *cobra.Command {
	var deleteCommand = &cobra.Command{
		Use:   "delete (-f [files] | KIND NAME)",
		Short: "Delete resources",
		Long:  `Deletes resources from provided manifests`,
		Args:  cobra.MinimumNArgs(0),
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

			if cmd.Flags().Changed("namespace") == false {
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

			err = client.Delete(manifests, output)
			if err != nil {
				return err
			}

			return nil
		},
	}

	deleteCommand.Flags().BoolP("files", "f", false, "delete -f file1.yaml file2.yaml")

	return deleteCommand
}
