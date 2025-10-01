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


func TestDeleteCommand(t *testing.T) {
	t.Run("Success case - delete by kind and name", func(t *testing.T) {
		// Setup Mock
		mockClient := new(testutil.MockDrasiClient)
		mockOutput := new(testutil.MockTaskOutput)

		// Set up expectations for Delete
		mockClient.On("Delete", mock.AnythingOfType("*[]api.Manifest"), mock.Anything).Return(nil).Run(func(args mock.Arguments) {
			manifests := args.Get(0).(*[]api.Manifest)
			taskOutput := args.Get(1).(output.TaskOutput)

			// Verify manifest content
			assert.Equal(t, 1, len(*manifests))
			assert.Equal(t, "source", (*manifests)[0].Kind)
			assert.Equal(t, "test-source", (*manifests)[0].Name)

			// Simulate task output calls
			taskOutput.AddTask("Delete: source/test-source", "Delete: source/test-source")
			taskOutput.SucceedTask("Delete: source/test-source", "Delete: source/test-source: complete")
		})
		mockClient.On("Close").Return()

		mockOutput.On("AddTask", "Delete: source/test-source", "Delete: source/test-source").Return()
		mockOutput.On("SucceedTask", "Delete: source/test-source", "Delete: source/test-source: complete").Return()
		mockOutput.On("Close").Return()

		mockPlatformClient := testutil.NewMockPlatformClient(mockClient)

		// Create the command with injected factories
		testOpts := &deleteCmdOptions{
			platformClientFactory: func(namespace string) (sdk.PlatformClient, error) {
				return mockPlatformClient, nil
			},
			outputFactory: func() output.TaskOutput {
				return mockOutput
			},
		}
		deleteCmd := NewDeleteCommand(testOpts)
		deleteCmd.Flags().StringP("namespace", "n", "", "namespace")

		// Execute
		_, err := executeCommand(deleteCmd, "source", "test-source")

		// Assert
		assert.NoError(t, err)
		mockClient.AssertExpectations(t)
		mockOutput.AssertExpectations(t)
	})

	t.Run("Success case - delete from file", func(t *testing.T) {
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

		mockClient.On("Delete", mock.AnythingOfType("*[]api.Manifest"), mock.Anything).Return(nil).Run(func(args mock.Arguments) {
			manifests := args.Get(0).(*[]api.Manifest)
			taskOutput := args.Get(1).(output.TaskOutput)

			// Verify manifest content
			assert.Equal(t, 1, len(*manifests))
			assert.Equal(t, "Source", (*manifests)[0].Kind)
			assert.Equal(t, "test-source", (*manifests)[0].Name)

			// Simulate task output calls
			subject := "Delete: Source/test-source"
			taskOutput.AddTask(subject, subject)
			taskOutput.SucceedTask(subject, subject+": complete")
		})
		mockClient.On("Close").Return()

		mockOutput.On("AddTask", "Delete: Source/test-source", "Delete: Source/test-source").Return()
		mockOutput.On("SucceedTask", "Delete: Source/test-source", "Delete: Source/test-source: complete").Return()
		mockOutput.On("Close").Return()

		mockPlatformClient := testutil.NewMockPlatformClient(mockClient)

		// Create the command with injected factories
		testOpts := &deleteCmdOptions{
			platformClientFactory: func(namespace string) (sdk.PlatformClient, error) {
				return mockPlatformClient, nil
			},
			outputFactory: func() output.TaskOutput {
				return mockOutput
			},
		}
		deleteCmd := NewDeleteCommand(testOpts)
		deleteCmd.Flags().StringP("namespace", "n", "", "namespace")

		// Execute
		_, err = executeCommand(deleteCmd, "-f", tempFile.Name())

		// Assert
		assert.NoError(t, err)
		mockClient.AssertExpectations(t)
		mockOutput.AssertExpectations(t)
	})

	t.Run("Success case - delete multiple resources from file", func(t *testing.T) {
		// Create a temp file with multiple manifests
		tempFile, err := os.CreateTemp("", "test-manifests-*.yaml")
		assert.NoError(t, err)
		defer os.Remove(tempFile.Name())

		manifestContent := `apiVersion: v1
kind: Source
name: test-source
---
apiVersion: v1
kind: ContinuousQuery
name: test-query`
		_, err = tempFile.WriteString(manifestContent)
		assert.NoError(t, err)
		tempFile.Close()

		// Setup Mock
		mockClient := new(testutil.MockDrasiClient)
		mockOutput := new(testutil.MockTaskOutput)

		mockClient.On("Delete", mock.AnythingOfType("*[]api.Manifest"), mock.Anything).Return(nil).Run(func(args mock.Arguments) {
			manifests := args.Get(0).(*[]api.Manifest)
			taskOutput := args.Get(1).(output.TaskOutput)

			// Verify we have 2 manifests
			assert.Equal(t, 2, len(*manifests))

			// Simulate task output for both
			for _, mf := range *manifests {
				subject := "Delete: " + mf.Kind + "/" + mf.Name
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
		testOpts := &deleteCmdOptions{
			platformClientFactory: func(namespace string) (sdk.PlatformClient, error) {
				return mockPlatformClient, nil
			},
			outputFactory: func() output.TaskOutput {
				return mockOutput
			},
		}
		deleteCmd := NewDeleteCommand(testOpts)
		deleteCmd.Flags().StringP("namespace", "n", "", "namespace")

		// Execute
		_, err = executeCommand(deleteCmd, "-f", tempFile.Name())

		// Assert
		assert.NoError(t, err)
		mockClient.AssertExpectations(t)
		mockOutput.AssertExpectations(t)
	})

	t.Run("Error case - delete fails", func(t *testing.T) {
		// Setup Mock
		mockClient := new(testutil.MockDrasiClient)
		mockOutput := new(testutil.MockTaskOutput)

		deleteError := errors.New("Failed to delete resource: not found")
		mockClient.On("Delete", mock.AnythingOfType("*[]api.Manifest"), mock.Anything).Return(deleteError)
		mockClient.On("Close").Return()

		mockOutput.On("Close").Return()

		mockPlatformClient := testutil.NewMockPlatformClient(mockClient)

		// Create the command with injected factories
		testOpts := &deleteCmdOptions{
			platformClientFactory: func(namespace string) (sdk.PlatformClient, error) {
				return mockPlatformClient, nil
			},
			outputFactory: func() output.TaskOutput {
				return mockOutput
			},
		}
		deleteCmd := NewDeleteCommand(testOpts)
		deleteCmd.Flags().StringP("namespace", "n", "", "namespace")

		// Execute
		_, err := executeCommand(deleteCmd, "source", "test-source")

		// Assert
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "Failed to delete resource")
		mockClient.AssertExpectations(t)
		mockOutput.AssertExpectations(t)
	})

	t.Run("Error case - no resource specified", func(t *testing.T) {
		// Create the command
		deleteCmd := NewDeleteCommand()
		deleteCmd.Flags().StringP("namespace", "n", "", "namespace")

		// Execute without arguments or -f flag
		_, err := executeCommand(deleteCmd)

		// Assert
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "no resource specified")
	})

	t.Run("Error case - invalid manifest file", func(t *testing.T) {
		// Create the command
		deleteCmd := NewDeleteCommand()
		deleteCmd.Flags().StringP("namespace", "n", "", "namespace")

		// Execute with non-existent file
		_, err := executeCommand(deleteCmd, "-f", "nonexistent.yaml")

		// Assert
		assert.Error(t, err)
	})

	t.Run("Error case - platform client creation failure", func(t *testing.T) {
		// Create the command with a factory that returns an error
		testOpts := &deleteCmdOptions{
			platformClientFactory: func(namespace string) (sdk.PlatformClient, error) {
				return nil, errors.New("failed to create platform client")
			},
			outputFactory: func() output.TaskOutput {
				return nil
			},
		}
		deleteCmd := NewDeleteCommand(testOpts)
		deleteCmd.Flags().StringP("namespace", "n", "", "namespace")

		// Execute
		_, err := executeCommand(deleteCmd, "source", "test-source")

		// Assert
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "failed to create platform client")
	})

	t.Run("Error case - API client creation failure", func(t *testing.T) {
		// Setup Mock
		mockPlatformClient := new(testutil.MockPlatformClient)
		mockPlatformClient.On("CreateDrasiClient").Return(nil, errors.New("failed to create API client"))

		// Create the command with injected factory
		testOpts := &deleteCmdOptions{
			platformClientFactory: func(namespace string) (sdk.PlatformClient, error) {
				return mockPlatformClient, nil
			},
			outputFactory: func() output.TaskOutput {
				return nil
			},
		}
		deleteCmd := NewDeleteCommand(testOpts)
		deleteCmd.Flags().StringP("namespace", "n", "", "namespace")

		// Execute
		_, err := executeCommand(deleteCmd, "source", "test-source")

		// Assert
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "failed to create API client")
		mockPlatformClient.AssertExpectations(t)
	})

	t.Run("Success case - delete different resource types", func(t *testing.T) {
		resourceTypes := [][]string{
			{"continuousquery", "my-query"},
			{"query", "my-query"},
			{"querycontainer", "my-container"},
			{"reaction", "my-reaction"},
			{"source", "my-source"},
		}

		for _, resource := range resourceTypes {
			t.Run("Delete "+resource[0], func(t *testing.T) {
				// Setup Mock
				mockClient := new(testutil.MockDrasiClient)
				mockOutput := new(testutil.MockTaskOutput)

				mockClient.On("Delete", mock.AnythingOfType("*[]api.Manifest"), mock.Anything).Return(nil).Run(func(args mock.Arguments) {
					manifests := args.Get(0).(*[]api.Manifest)
					taskOutput := args.Get(1).(output.TaskOutput)

					// Verify manifest
					assert.Equal(t, 1, len(*manifests))
					assert.Equal(t, resource[0], (*manifests)[0].Kind)
					assert.Equal(t, resource[1], (*manifests)[0].Name)

					// Simulate task output
					subject := "Delete: " + (*manifests)[0].Kind + "/" + (*manifests)[0].Name
					taskOutput.AddTask(subject, subject)
					taskOutput.SucceedTask(subject, subject+": complete")
				})
				mockClient.On("Close").Return()

				mockOutput.On("AddTask", mock.AnythingOfType("string"), mock.AnythingOfType("string")).Return()
				mockOutput.On("SucceedTask", mock.AnythingOfType("string"), mock.AnythingOfType("string")).Return()
				mockOutput.On("Close").Return()

				mockPlatformClient := testutil.NewMockPlatformClient(mockClient)

				// Create the command with injected factories
				testOpts := &deleteCmdOptions{
					platformClientFactory: func(namespace string) (sdk.PlatformClient, error) {
						return mockPlatformClient, nil
					},
					outputFactory: func() output.TaskOutput {
						return mockOutput
					},
				}
				deleteCmd := NewDeleteCommand(testOpts)
				deleteCmd.Flags().StringP("namespace", "n", "", "namespace")

				// Execute
				_, err := executeCommand(deleteCmd, resource[0], resource[1])

				// Assert
				assert.NoError(t, err)
				mockClient.AssertExpectations(t)
				mockOutput.AssertExpectations(t)
			})
		}
	})
}