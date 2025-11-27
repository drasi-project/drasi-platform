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
	"drasi.io/cli/sdk"
	"drasi.io/cli/testutil"
	"errors"
	"github.com/stretchr/testify/assert"
	"testing"
)


func TestDescribeCommand(t *testing.T) {
	t.Run("Success case - describe source", func(t *testing.T) {
		// Setup Mock
		mockClient := new(testutil.MockDrasiClient)
		expectedResource := &api.Resource{
			Id: "my-source",
			Status: map[string]interface{}{
				"available": true,
				"messages":  nil,
			},
			Spec: map[string]interface{}{
				"kind":   "PostgreSQL",
				"dbhost": "localhost",
				"dbport": 5432,
			},
		}
		mockClient.On("GetResource", "source", "my-source").Return(expectedResource, nil)
		mockClient.On("Close").Return()

		mockPlatformClient := testutil.NewMockPlatformClient(mockClient)

		// Create the command with injected factory
		testOpts := &describeCmdOptions{
			platformClientFactory: func(namespace string) (sdk.PlatformClient, error) {
				return mockPlatformClient, nil
			},
		}
		describeCmd := NewDescribeCommand(testOpts)
		describeCmd.Flags().StringP("namespace", "n", "", "namespace")

		// Execute
		output, err := executeCommand(describeCmd, "source", "my-source")

		// Assert
		assert.NoError(t, err)
		assert.Contains(t, output, "id: my-source")
		assert.Contains(t, output, "available: true")
		assert.Contains(t, output, "kind: PostgreSQL")
		assert.Contains(t, output, "dbhost: localhost")
		mockClient.AssertExpectations(t)
	})

	t.Run("Success case - describe source with ingress URL", func(t *testing.T) {
		// Setup Mock
		mockClient := new(testutil.MockDrasiClient)
		expectedResource := &api.Resource{
			Id: "postgres-source",
			Status: map[string]interface{}{
				"available":   true,
				"messages":    nil,
				"ingress_url": "http://postgres-source.drasi.example.com",
			},
			Spec: map[string]interface{}{
				"kind":   "PostgreSQL",
				"dbhost": "postgres.default.svc.cluster.local",
				"dbport": 5432,
			},
		}
		mockClient.On("GetResource", "source", "postgres-source").Return(expectedResource, nil)
		mockClient.On("Close").Return()

		mockPlatformClient := testutil.NewMockPlatformClient(mockClient)

		// Create the command with injected factory
		testOpts := &describeCmdOptions{
			platformClientFactory: func(namespace string) (sdk.PlatformClient, error) {
				return mockPlatformClient, nil
			},
		}
		describeCmd := NewDescribeCommand(testOpts)
		describeCmd.Flags().StringP("namespace", "n", "", "namespace")

		// Execute
		output, err := executeCommand(describeCmd, "source", "postgres-source")

		// Assert
		assert.NoError(t, err)
		assert.Contains(t, output, "id: postgres-source")
		assert.Contains(t, output, "available: true")
		assert.Contains(t, output, "ingress_url: http://postgres-source.drasi.example.com")
		assert.Contains(t, output, "kind: PostgreSQL")
		mockClient.AssertExpectations(t)
	})

	t.Run("Success case - describe query", func(t *testing.T) {
		// Setup Mock
		mockClient := new(testutil.MockDrasiClient)
		expectedResource := &api.Resource{
			Id: "test-query",
			Status: map[string]interface{}{
				"available": true,
			},
			Spec: map[string]interface{}{
				"query": "SELECT * FROM Users",
			},
		}
		mockClient.On("GetResource", "query", "test-query").Return(expectedResource, nil)
		mockClient.On("Close").Return()

		mockPlatformClient := testutil.NewMockPlatformClient(mockClient)

		// Create the command with injected factory
		testOpts := &describeCmdOptions{
			platformClientFactory: func(namespace string) (sdk.PlatformClient, error) {
				return mockPlatformClient, nil
			},
		}
		describeCmd := NewDescribeCommand(testOpts)
		describeCmd.Flags().StringP("namespace", "n", "", "namespace")

		// Execute
		output, err := executeCommand(describeCmd, "query", "test-query")

		// Assert
		assert.NoError(t, err)
		assert.Contains(t, output, "id: test-query")
		assert.Contains(t, output, "query: SELECT * FROM Users")
		mockClient.AssertExpectations(t)
	})

	t.Run("Error case - resource not found", func(t *testing.T) {
		// Setup Mock
		mockClient := new(testutil.MockDrasiClient)
		mockClient.On("GetResource", "source", "nonexistent").Return(nil, errors.New("404 Not Found"))
		mockClient.On("Close").Return()

		mockPlatformClient := testutil.NewMockPlatformClient(mockClient)

		// Create the command with injected factory
		testOpts := &describeCmdOptions{
			platformClientFactory: func(namespace string) (sdk.PlatformClient, error) {
				return mockPlatformClient, nil
			},
		}
		describeCmd := NewDescribeCommand(testOpts)
		describeCmd.Flags().StringP("namespace", "n", "", "namespace")

		// Execute
		_, err := executeCommand(describeCmd, "source", "nonexistent")

		// Assert
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "404 Not Found")
		mockClient.AssertExpectations(t)
	})

	t.Run("Error case - platform client creation failure", func(t *testing.T) {
		// Create the command with a factory that returns an error
		testOpts := &describeCmdOptions{
			platformClientFactory: func(namespace string) (sdk.PlatformClient, error) {
				return nil, errors.New("failed to create platform client")
			},
		}
		describeCmd := NewDescribeCommand(testOpts)
		describeCmd.Flags().StringP("namespace", "n", "", "namespace")

		// Execute
		_, err := executeCommand(describeCmd, "source", "my-source")

		// Assert
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "failed to create platform client")
	})

	t.Run("Error case - API client creation failure", func(t *testing.T) {
		// Setup Mock
		mockPlatformClient := new(testutil.MockPlatformClient)
		mockPlatformClient.On("CreateDrasiClient").Return(nil, errors.New("failed to create API client"))

		// Create the command with injected factory
		testOpts := &describeCmdOptions{
			platformClientFactory: func(namespace string) (sdk.PlatformClient, error) {
				return mockPlatformClient, nil
			},
		}
		describeCmd := NewDescribeCommand(testOpts)
		describeCmd.Flags().StringP("namespace", "n", "", "namespace")

		// Execute
		_, err := executeCommand(describeCmd, "source", "my-source")

		// Assert
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "failed to create API client")
		mockPlatformClient.AssertExpectations(t)
	})

	t.Run("Invalid arguments - missing name", func(t *testing.T) {
		// Create the command
		describeCmd := NewDescribeCommand()
		describeCmd.Flags().StringP("namespace", "n", "", "namespace")

		// Execute with only kind
		_, err := executeCommand(describeCmd, "source")

		// Assert
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "requires at least 2 arg")
	})

	t.Run("Invalid arguments - no arguments", func(t *testing.T) {
		// Create the command
		describeCmd := NewDescribeCommand()
		describeCmd.Flags().StringP("namespace", "n", "", "namespace")

		// Execute without arguments
		_, err := executeCommand(describeCmd)

		// Assert
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "requires at least 2 arg")
	})

	t.Run("Success case - describe reaction with ingress URL", func(t *testing.T) {
		// Setup Mock
		mockClient := new(testutil.MockDrasiClient)
		expectedResource := &api.Resource{
			Id: "signalr-reaction",
			Status: map[string]interface{}{
				"available":   true,
				"messages":    nil,
				"ingress_url": "http://signalr-reaction.drasi.example.com",
			},
			Spec: map[string]interface{}{
				"kind": "SignalR",
				"queries": map[string]interface{}{
					"my-query": map[string]interface{}{
						"hubs": []interface{}{"myHub"},
					},
				},
			},
		}
		mockClient.On("GetResource", "reaction", "signalr-reaction").Return(expectedResource, nil)
		mockClient.On("Close").Return()

		mockPlatformClient := testutil.NewMockPlatformClient(mockClient)

		// Create the command with injected factory
		testOpts := &describeCmdOptions{
			platformClientFactory: func(namespace string) (sdk.PlatformClient, error) {
				return mockPlatformClient, nil
			},
		}
		describeCmd := NewDescribeCommand(testOpts)
		describeCmd.Flags().StringP("namespace", "n", "", "namespace")

		// Execute
		output, err := executeCommand(describeCmd, "reaction", "signalr-reaction")

		// Assert
		assert.NoError(t, err)
		assert.Contains(t, output, "id: signalr-reaction")
		assert.Contains(t, output, "available: true")
		assert.Contains(t, output, "ingress_url: http://signalr-reaction.drasi.example.com")
		assert.Contains(t, output, "kind: SignalR")
		mockClient.AssertExpectations(t)
	})

	t.Run("Success case - resource with complex status", func(t *testing.T) {
		// Setup Mock
		mockClient := new(testutil.MockDrasiClient)
		expectedResource := &api.Resource{
			Id: "complex-resource",
			Status: map[string]interface{}{
				"available": false,
				"messages": map[string]interface{}{
					"error":   "Connection timeout",
					"details": "Failed to connect to database",
				},
				"retryCount": 3,
			},
			Spec: map[string]interface{}{
				"type": "test",
			},
		}
		mockClient.On("GetResource", "source", "complex-resource").Return(expectedResource, nil)
		mockClient.On("Close").Return()

		mockPlatformClient := testutil.NewMockPlatformClient(mockClient)

		// Create the command with injected factory
		testOpts := &describeCmdOptions{
			platformClientFactory: func(namespace string) (sdk.PlatformClient, error) {
				return mockPlatformClient, nil
			},
		}
		describeCmd := NewDescribeCommand(testOpts)
		describeCmd.Flags().StringP("namespace", "n", "", "namespace")

		// Execute
		output, err := executeCommand(describeCmd, "source", "complex-resource")

		// Assert
		assert.NoError(t, err)
		assert.Contains(t, output, "id: complex-resource")
		assert.Contains(t, output, "available: false")
		assert.Contains(t, output, "error: Connection timeout")
		assert.Contains(t, output, "details: Failed to connect to database")
		assert.Contains(t, output, "retryCount: 3")
		mockClient.AssertExpectations(t)
	})
}