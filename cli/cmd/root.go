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
	"github.com/spf13/cobra"
)

func MakeRootCommand() *cobra.Command {
	var rootCommand = &cobra.Command{Use: "drasi", SilenceUsage: true}

	rootCommand.AddCommand(
		NewInitCommand(),
		NewApplyCommand(),
		NewDeleteCommand(),
		NewDescribeCommand(),
		NewListCommand(),
		NewWaitCommand(),
		NewNamespaceCommand(),
		NewUninstallCommand(),
		NewVersionCommand(),
		NewWatchCommand(),
		NewTunnelCommand(),
		NewEnvCommand(),
		NewSecretCommand(),
	)

	// Declare the 'help' persistent flag so we can hide the default flag from the help output text.
	// It is redundant given the default template that is used for the help output.
	rootCommand.PersistentFlags().BoolP("help", "h", false, "Show help for the command.")
	rootCommand.PersistentFlags().MarkHidden("help")

	rootCommand.PersistentFlags().StringP("namespace", "n", "", `The Drasi environment to target with the command, identified by the Kubernetes namespace in which the Drasi environment is installed.
If not provided, the current default Drasi environment is the target. 
See the 'namespace' command for a description of how to set the default environment.`)

	return rootCommand
}
