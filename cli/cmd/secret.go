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
	"bufio"
	"errors"
	"io"
	"os"

	"drasi.io/cli/sdk"
	"drasi.io/cli/sdk/registry"
	"github.com/spf13/cobra"
)

func NewSecretCommand() *cobra.Command {
	var secretCommand = &cobra.Command{
		Use:   "secret",
		Short: "Manage secrets",
		Long:  ``,
	}

	secretCommand.AddCommand(NewSetSecretCommand())
	secretCommand.AddCommand(NewDeleteSecretCommand())

	return secretCommand
}

func NewSetSecretCommand() *cobra.Command {
	var secretCommand = &cobra.Command{
		Use:   "set [name] [key] [value]",
		Short: "Set a secret",
		Long:  ``,

		Args: cobra.MinimumNArgs(2),
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

			var value []byte

			if len(args) == 3 {
				value = []byte(args[2])
			} else {
				stat, err := os.Stdin.Stat()
				if err != nil {
					return err
				}
				if (stat.Mode() & os.ModeCharDevice) == 0 {
					reader := bufio.NewReader(os.Stdin)
					value, err = io.ReadAll(reader)
					if err != nil {
						return err
					}
				} else {
					return errors.New("no value provided")
				}
			}

			return platformClient.SetSecret(args[0], args[1], value)
		},
	}

	return secretCommand
}

func NewDeleteSecretCommand() *cobra.Command {
	var secretCommand = &cobra.Command{
		Use:   "delete [name] [key]",
		Short: "Delete a secret",
		Long:  ``,

		Args: cobra.MinimumNArgs(2),
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

			return platformClient.DeleteSecret(args[0], args[1])
		},
	}

	return secretCommand
}
