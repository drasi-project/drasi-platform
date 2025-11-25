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
	"drasi.io/cli/output"
	"drasi.io/cli/sdk"
	"drasi.io/cli/testutil"
	"errors"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"os"
	"testing"
)


func TestApplyCommand(t *testing.T) {
	t.Run("Success case - apply single manifest", func(t *testing.T) {
		// Create a temp file with manifest
		tempFile, err := os.CreateTemp("", "test-manifest-*.yaml")
		assert.NoError(t, err)
		defer os.Remove(tempFile.Name())

		manifestContent := `apiVersion: v1
kind: Source
name: test-source
spec:
  kind: PostgreSQL
  dbhost: localhost
  dbport: 5432`
		_, err = tempFile.WriteString(manifestContent)
		assert.NoError(t, err)
		tempFile.Close()

		// Setup Mock
		mockClient := new(testutil.MockDrasiClient)
		mockOutput := new(testutil.MockTaskOutput)

		// Set up expectations for Apply
		mockClient.On("Apply", mock.AnythingOfType("*[]api.Manifest"), mock.Anything).Return(nil).Run(func(args mock.Arguments) {
			manifests := args.Get(0).(*[]api.Manifest)
			taskOutput := args.Get(1).(output.TaskOutput)

			// Verify manifest content
			assert.Equal(t, 1, len(*manifests))
			assert.Equal(t, "Source", (*manifests)[0].Kind)
			assert.Equal(t, "test-source", (*manifests)[0].Name)

			// Simulate task output calls
			taskOutput.AddTask("Apply: Source/test-source", "Apply: Source/test-source")
			taskOutput.SucceedTask("Apply: Source/test-source", "Apply: Source/test-source: complete")
		})
		mockClient.On("Close").Return()

		mockOutput.On("AddTask", "Apply: Source/test-source", "Apply: Source/test-source").Return()
		mockOutput.On("SucceedTask", "Apply: Source/test-source", "Apply: Source/test-source: complete").Return()
		mockOutput.On("Close").Return()

		mockPlatformClient := testutil.NewMockPlatformClient(mockClient)

		// Create the command with injected factories
		testOpts := &applyCmdOptions{
			platformClientFactory: func(namespace string) (sdk.PlatformClient, error) {
				return mockPlatformClient, nil
			},
			outputFactory: func() output.TaskOutput {
				return mockOutput
			},
		}
		applyCmd := NewApplyCommand(testOpts)
		applyCmd.Flags().StringP("namespace", "n", "", "namespace")

		// Execute
		_, err = executeCommand(applyCmd, "-f", tempFile.Name())

		// Assert
		assert.NoError(t, err)
		mockClient.AssertExpectations(t)
		mockOutput.AssertExpectations(t)
	})

	t.Run("Success case - apply multiple manifests", func(t *testing.T) {
		// Create a temp file with multiple manifests
		tempFile, err := os.CreateTemp("", "test-manifests-*.yaml")
		assert.NoError(t, err)
		defer os.Remove(tempFile.Name())

		manifestContent := `apiVersion: v1
kind: Source
name: test-source
spec:
  kind: PostgreSQL
---
apiVersion: v1
kind: ContinuousQuery
name: test-query
spec:
  query: SELECT * FROM Users`
		_, err = tempFile.WriteString(manifestContent)
		assert.NoError(t, err)
		tempFile.Close()

		// Setup Mock
		mockClient := new(testutil.MockDrasiClient)
		mockOutput := new(testutil.MockTaskOutput)

		mockClient.On("Apply", mock.AnythingOfType("*[]api.Manifest"), mock.Anything).Return(nil).Run(func(args mock.Arguments) {
			manifests := args.Get(0).(*[]api.Manifest)
			taskOutput := args.Get(1).(output.TaskOutput)

			// Verify we have 2 manifests
			assert.Equal(t, 2, len(*manifests))

			// Simulate task output for both
			for _, mf := range *manifests {
				subject := "Apply: " + mf.Kind + "/" + mf.Name
				taskOutput.AddTask(subject, subject)
				taskOutput.SucceedTask(subject, subject+": complete")
			}
		})
		mockClient.On("Close").Return()

		mockOutput.On("AddTask", mock.AnythingOfType("string"), mock.AnythingOfType("string")).Return()
		mockOutput.On("SucceedTask", mock.AnythingOfType("string"), mock.AnythingOfType("string")).Return()
		mockOutput.On("Close").Return()

		mockPlatformClient := testutil.NewMockPlatformClient(mockClient)

		// Create the command with injected factories
		testOpts := &applyCmdOptions{
			platformClientFactory: func(namespace string) (sdk.PlatformClient, error) {
				return mockPlatformClient, nil
			},
			outputFactory: func() output.TaskOutput {
				return mockOutput
			},
		}
		applyCmd := NewApplyCommand(testOpts)
		applyCmd.Flags().StringP("namespace", "n", "", "namespace")

		// Execute
		_, err = executeCommand(applyCmd, "-f", tempFile.Name())

		// Assert
		assert.NoError(t, err)
		mockClient.AssertExpectations(t)
		mockOutput.AssertExpectations(t)
	})

	t.Run("Error case - apply fails", func(t *testing.T) {
		// Create a temp file with manifest
		tempFile, err := os.CreateTemp("", "test-manifest-*.yaml")
		assert.NoError(t, err)
		defer os.Remove(tempFile.Name())

		manifestContent := `apiVersion: v1
kind: Source
name: test-source
spec:
  kind: PostgreSQL`
		_, err = tempFile.WriteString(manifestContent)
		assert.NoError(t, err)
		tempFile.Close()

		// Setup Mock
		mockClient := new(testutil.MockDrasiClient)
		mockOutput := new(testutil.MockTaskOutput)

		applyError := errors.New("Failed to apply resource: connection refused")
		mockClient.On("Apply", mock.AnythingOfType("*[]api.Manifest"), mock.Anything).Return(applyError)
		mockClient.On("Close").Return()

		mockOutput.On("Close").Return()

		mockPlatformClient := testutil.NewMockPlatformClient(mockClient)

		// Create the command with injected factories
		testOpts := &applyCmdOptions{
			platformClientFactory: func(namespace string) (sdk.PlatformClient, error) {
				return mockPlatformClient, nil
			},
			outputFactory: func() output.TaskOutput {
				return mockOutput
			},
		}
		applyCmd := NewApplyCommand(testOpts)
		applyCmd.Flags().StringP("namespace", "n", "", "namespace")

		// Execute
		_, err = executeCommand(applyCmd, "-f", tempFile.Name())

		// Assert
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "Failed to apply resource")
		mockClient.AssertExpectations(t)
		mockOutput.AssertExpectations(t)
	})

	t.Run("Error case - no manifests provided", func(t *testing.T) {
		// Create the command
		applyCmd := NewApplyCommand()
		applyCmd.Flags().StringP("namespace", "n", "", "namespace")

		// Execute without -f flag
		_, err := executeCommand(applyCmd)

		// Assert
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "no manifests found")
	})

	t.Run("Error case - invalid manifest file", func(t *testing.T) {
		// Create the command
		applyCmd := NewApplyCommand()
		applyCmd.Flags().StringP("namespace", "n", "", "namespace")

		// Execute with non-existent file
		_, err := executeCommand(applyCmd, "-f", "nonexistent.yaml")

		// Assert
		assert.Error(t, err)
	})

	t.Run("Error case - platform client creation failure", func(t *testing.T) {
		// Create a temp file with manifest
		tempFile, err := os.CreateTemp("", "test-manifest-*.yaml")
		assert.NoError(t, err)
		defer os.Remove(tempFile.Name())

		manifestContent := `apiVersion: v1
kind: Source
name: test-source`
		_, err = tempFile.WriteString(manifestContent)
		assert.NoError(t, err)
		tempFile.Close()

		// Create the command with a factory that returns an error
		testOpts := &applyCmdOptions{
			platformClientFactory: func(namespace string) (sdk.PlatformClient, error) {
				return nil, errors.New("failed to create platform client")
			},
			outputFactory: func() output.TaskOutput {
				return nil
			},
		}
		applyCmd := NewApplyCommand(testOpts)
		applyCmd.Flags().StringP("namespace", "n", "", "namespace")

		// Execute
		_, err = executeCommand(applyCmd, "-f", tempFile.Name())

		// Assert
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "failed to create platform client")
	})

	t.Run("Error case - API client creation failure", func(t *testing.T) {
		// Create a temp file with manifest
		tempFile, err := os.CreateTemp("", "test-manifest-*.yaml")
		assert.NoError(t, err)
		defer os.Remove(tempFile.Name())

		manifestContent := `apiVersion: v1
kind: Source
name: test-source`
		_, err = tempFile.WriteString(manifestContent)
		assert.NoError(t, err)
		tempFile.Close()

		// Setup Mock
		mockPlatformClient := new(testutil.MockPlatformClient)
		mockPlatformClient.On("CreateDrasiClient").Return(nil, errors.New("failed to create API client"))

		// Create the command with injected factory
		testOpts := &applyCmdOptions{
			platformClientFactory: func(namespace string) (sdk.PlatformClient, error) {
				return mockPlatformClient, nil
			},
			outputFactory: func() output.TaskOutput {
				return nil
			},
		}
		applyCmd := NewApplyCommand(testOpts)
		applyCmd.Flags().StringP("namespace", "n", "", "namespace")

		// Execute
		_, err = executeCommand(applyCmd, "-f", tempFile.Name())

		// Assert
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "failed to create API client")
		mockPlatformClient.AssertExpectations(t)
	})
}