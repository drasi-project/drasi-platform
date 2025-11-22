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
	"drasi.io/cli/output"
	"drasi.io/cli/sdk"
	"drasi.io/cli/sdk/registry"
)

// defaultPlatformClientFactory creates a PlatformClient from the current registry configuration.
// This is the standard factory used by commands in production. Tests can override it to inject mocks.
func defaultPlatformClientFactory(namespace string) (sdk.PlatformClient, error) {
	reg, err := registry.LoadCurrentRegistrationWithNamespace(namespace)
	if err != nil {
		return nil, err
	}
	return sdk.NewPlatformClient(reg)
}

// defaultOutputFactory creates a new TaskOutput for rendering command progress.
// This is the standard factory used by commands in production. Tests can override it to inject mocks.
func defaultOutputFactory() output.TaskOutput {
	return output.NewTaskOutput()
}
