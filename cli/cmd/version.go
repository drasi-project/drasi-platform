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

	"drasi.io/cli/config"
	"github.com/spf13/cobra"
)

func NewVersionCommand() *cobra.Command {
	var versionCommand = &cobra.Command{
		Use:   "version",
		Short: "Get Drasi CLI version",
		Long:  `Get Drasi CLI version`,
		Args:  cobra.MinimumNArgs(0),
		RunE: func(cmd *cobra.Command, args []string) error {
			fmt.Println("Drasi CLI version: " + config.Version)
			return nil
		},
	}

	return versionCommand
}
