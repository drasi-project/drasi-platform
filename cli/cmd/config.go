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
	"os"
	"strings"

	"drasi.io/cli/sdk"
	"drasi.io/cli/sdk/registry"
	"github.com/olekukonko/tablewriter"
	"github.com/spf13/cobra"
)

func NewConfigCommand() *cobra.Command {
	var cfgCommand = &cobra.Command{
		Use:   "config [command]",
		Short: "Manage Drasi configurations",
		Long:  ``,
	}

	cfgCommand.AddCommand(newListConfigCommand())
	cfgCommand.AddCommand(newUseConfigCommand())
	cfgCommand.AddCommand(newCurrentConfigCommand())
	cfgCommand.AddCommand(newDeleteConfigCommand())
	cfgCommand.AddCommand(newAddKubernetesConfigCommand())

	return cfgCommand
}

func newListConfigCommand() *cobra.Command {
	var listCommand = &cobra.Command{
		Use:   "all",
		Short: "List all Drasi configurations.",
		Long:  ``,
		Args:  cobra.MinimumNArgs(0),
		RunE: func(cmd *cobra.Command, args []string) error {

			reg, err := registry.ListRegistrations()
			if err != nil {
				return err
			}

			current, err := registry.GetCurrentRegistration()
			if err != nil {
				return err
			}

			table := tablewriter.NewWriter(os.Stdout)
			headers := []string{"", "Name", "Platform"}
			table.SetHeader(headers)
			for _, item := range reg {
				currentStr := " "
				if item.GetId() == current {
					currentStr = "*"
				}
				table.Append([]string{currentStr, item.GetId(), string(item.GetKind())})
			}
			table.SetBorder(false)
			table.Render()

			return nil
		},
	}

	return listCommand
}

func newCurrentConfigCommand() *cobra.Command {
	var currentCommand = &cobra.Command{
		Use:   "current",
		Short: "Print the current Drasi configuration.",
		Long:  ``,
		Args:  cobra.MinimumNArgs(0),
		RunE: func(cmd *cobra.Command, args []string) error {

			current, err := registry.GetCurrentRegistration()
			if err != nil {
				return err
			}

			if current == "" {
				fmt.Println("No current configuration set")
				return nil
			}

			reg, err := registry.LoadRegistration(current)
			if err != nil {
				return err
			}
			fmt.Println("Current configuration:")
			fmt.Println("  Name: ", reg.GetId())
			fmt.Println("  Platform: ", string(reg.GetKind()))

			return nil
		},
	}

	return currentCommand
}

func newUseConfigCommand() *cobra.Command {
	var useCommand = &cobra.Command{
		Use:   "use [name]",
		Short: "Select a Drasi configuration to use.",
		Long:  ``,
		Args:  cobra.MinimumNArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {

			configName := args[0]

			exists, err := registry.RegistrationExists(configName)
			if err != nil {
				return err
			}
			if !exists {
				return fmt.Errorf("configuration %s does not exist", configName)
			}
			err = registry.SetCurrentRegistration(configName)
			if err != nil {
				return err
			}

			fmt.Printf("Configuration %s is now set as the current configuration\n", configName)

			return nil
		},
	}

	return useCommand
}

func newDeleteConfigCommand() *cobra.Command {
	var deleteCommand = &cobra.Command{
		Use:   "delete [name]",
		Short: "Delete a Drasi configuration.",
		Long:  ``,
		Args:  cobra.MinimumNArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {

			configName := args[0]

			exists, err := registry.RegistrationExists(configName)
			if err != nil {
				return err
			}
			if !exists {
				return fmt.Errorf("configuration %s does not exist", configName)
			}

			reg, err := registry.LoadRegistration(configName)
			if err != nil {
				return err
			}

			if reg.GetKind() == registry.Docker {
				var confirm string
				fmt.Print("This will delete the Docker container, are you sure you want to continue? (y/N): ")
				fmt.Scanln(&confirm)

				if strings.ToLower(confirm) != "y" {
					return nil
				}

				dockerReg, ok := reg.(*registry.DockerConfig)
				if !ok {
					return fmt.Errorf("configuration %s is not a Docker configuration", configName)
				}
				fmt.Printf("Deleting Docker container %s...\n", dockerReg.GetId())
				dd, err := sdk.MakeDockerizedDeployer()
				if err != nil {
					return err
				}
				err = dd.Delete(dockerReg)
				if err != nil {
					fmt.Printf("Error deleting Docker container %s: %s\n", dockerReg.GetId(), err)
				}
			}

			err = registry.DeleteRegistration(configName)
			if err != nil {
				return err
			}

			fmt.Printf("Configuration %s deleted\n", configName)

			return nil
		},
	}

	return deleteCommand
}

func newAddKubernetesConfigCommand() *cobra.Command {
	var kubeCommand = &cobra.Command{
		Use:   "kube",
		Short: "Add the current Kubernetes context as a Drasi configuration and set it as the current config.",
		Long:  ``,
		Args:  cobra.MinimumNArgs(0),
		RunE: func(cmd *cobra.Command, args []string) error {
			reg, err := registry.SaveKubecontextAsCurrent()
			if err != nil {
				return err
			}

			fmt.Printf("Configuration %s added\n", reg.GetId())
			fmt.Printf("Configuration %s set as current\n", reg.GetId())

			return nil
		},
	}

	return kubeCommand
}
