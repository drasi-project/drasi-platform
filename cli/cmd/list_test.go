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
	"github.com/stretchr/testify/mock"
	"testing"
)


func TestListCommand(t *testing.T) {
	t.Run("Success case - list sources", func(t *testing.T) {
		// Setup Mock
		mockClient := new(testutil.MockDrasiClient)
		mockClient.On("ListResources", "source").Return([]api.Resource{
			{Id: "my-source-1", Status: map[string]interface{}{"available": true, "messages": nil}},
			{Id: "my-source-2", Status: map[string]interface{}{"available": false, "messages": "error: failed"}},
		}, nil)
		mockClient.On("Close").Return()

		mockPlatformClient := testutil.NewMockPlatformClient(mockClient)

		// Create the command with injected factory
		testOpts := &listCmdOptions{
			platformClientFactory: func(namespace string) (sdk.PlatformClient, error) {
				return mockPlatformClient, nil
			},
		}
		listCmd := NewListCommand(testOpts)
		// Add the namespace flag that's normally added by root command
		listCmd.Flags().StringP("namespace", "n", "", "namespace")

		// Execute
		output, err := executeCommand(listCmd, "source")

		// Assert
		assert.NoError(t, err)
		assert.Contains(t, output, "my-source-1")
		assert.Contains(t, output, "my-source-2")
		assert.Contains(t, output, "true")
		assert.Contains(t, output, "false")
		assert.Contains(t, output, "error: failed")
		mockClient.AssertExpectations(t)
	})

	t.Run("Success case - list sources with ingress URLs", func(t *testing.T) {
		// Setup Mock
		mockClient := new(testutil.MockDrasiClient)
		mockClient.On("ListResources", "source").Return([]api.Resource{
			{
				Id: "postgres-source",
				Status: map[string]interface{}{
					"available":   true,
					"messages":    nil,
					"ingress_url": "http://postgres-source.drasi.example.com",
				},
			},
			{
				Id: "mysql-source",
				Status: map[string]interface{}{
					"available":   true,
					"messages":    nil,
					"ingress_url": "http://mysql-source.drasi.example.com",
				},
			},
		}, nil)
		mockClient.On("Close").Return()

		mockPlatformClient := testutil.NewMockPlatformClient(mockClient)

		// Create the command with injected factory
		testOpts := &listCmdOptions{
			platformClientFactory: func(namespace string) (sdk.PlatformClient, error) {
				return mockPlatformClient, nil
			},
		}
		listCmd := NewListCommand(testOpts)
		listCmd.Flags().StringP("namespace", "n", "", "namespace")

		// Execute
		output, err := executeCommand(listCmd, "source")

		// Assert
		assert.NoError(t, err)
		assert.Contains(t, output, "postgres-source")
		assert.Contains(t, output, "mysql-source")
		assert.Contains(t, output, "postgres-source.drasi.example.com")
		assert.Contains(t, output, "mysql-source.drasi.example.com")
		// Verify ingress_url column header is present (displayed as "INGRESS URL" with space)
		assert.Contains(t, output, "INGRESS URL")
		mockClient.AssertExpectations(t)
	})

	t.Run("Success case - list queries", func(t *testing.T) {
		// Setup Mock
		mockClient := new(testutil.MockDrasiClient)
		mockClient.On("ListResources", "query").Return([]api.Resource{
			{Id: "test-query", Status: map[string]interface{}{"available": true}},
		}, nil)
		mockClient.On("Close").Return()

		mockPlatformClient := testutil.NewMockPlatformClient(mockClient)

		// Create the command with injected factory
		testOpts := &listCmdOptions{
			platformClientFactory: func(namespace string) (sdk.PlatformClient, error) {
				return mockPlatformClient, nil
			},
		}
		listCmd := NewListCommand(testOpts)
		listCmd.Flags().StringP("namespace", "n", "", "namespace")

		// Execute
		output, err := executeCommand(listCmd, "query")

		// Assert
		assert.NoError(t, err)
		assert.Contains(t, output, "test-query")
		assert.Contains(t, output, "true")
		mockClient.AssertExpectations(t)
	})

	t.Run("Error case - API client error", func(t *testing.T) {
		// Setup Mock
		mockClient := new(testutil.MockDrasiClient)
		mockClient.On("ListResources", "source").Return(nil, errors.New("connection failed"))
		mockClient.On("Close").Return()

		mockPlatformClient := testutil.NewMockPlatformClient(mockClient)

		// Create the command with injected factory
		testOpts := &listCmdOptions{
			platformClientFactory: func(namespace string) (sdk.PlatformClient, error) {
				return mockPlatformClient, nil
			},
		}
		listCmd := NewListCommand(testOpts)
		listCmd.Flags().StringP("namespace", "n", "", "namespace")

		// Execute
		_, err := executeCommand(listCmd, "source")

		// Assert
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "connection failed")
		mockClient.AssertExpectations(t)
	})

	t.Run("Error case - platform client creation failure", func(t *testing.T) {
		// Create the command with a factory that returns an error
		testOpts := &listCmdOptions{
			platformClientFactory: func(namespace string) (sdk.PlatformClient, error) {
				return nil, errors.New("failed to create platform client")
			},
		}
		listCmd := NewListCommand(testOpts)
		listCmd.Flags().StringP("namespace", "n", "", "namespace")

		// Execute
		_, err := executeCommand(listCmd, "source")

		// Assert
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "failed to create platform client")
	})

	t.Run("Success case - list reactions with ingress URLs", func(t *testing.T) {
		// Setup Mock
		mockClient := new(testutil.MockDrasiClient)
		mockClient.On("ListResources", "reaction").Return([]api.Resource{
			{
				Id: "signalr-reaction",
				Status: map[string]interface{}{
					"available":   true,
					"messages":    nil,
					"ingress_url": "http://signalr-reaction.drasi.example.com",
				},
			},
			{
				Id: "webhook-reaction",
				Status: map[string]interface{}{
					"available":   true,
					"messages":    nil,
					"ingress_url": "http://webhook-reaction.drasi.example.com",
				},
			},
		}, nil)
		mockClient.On("Close").Return()

		mockPlatformClient := testutil.NewMockPlatformClient(mockClient)

		// Create the command with injected factory
		testOpts := &listCmdOptions{
			platformClientFactory: func(namespace string) (sdk.PlatformClient, error) {
				return mockPlatformClient, nil
			},
		}
		listCmd := NewListCommand(testOpts)
		listCmd.Flags().StringP("namespace", "n", "", "namespace")

		// Execute
		output, err := executeCommand(listCmd, "reaction")

		// Assert
		assert.NoError(t, err)
		assert.Contains(t, output, "signalr-reaction")
		assert.Contains(t, output, "webhook-reaction")
		assert.Contains(t, output, "signalr-reaction.drasi.example.com")
		assert.Contains(t, output, "webhook-reaction.drasi.example.com")
		// Verify ingress_url column header is present (displayed as "INGRESS URL" with space)
		assert.Contains(t, output, "INGRESS URL")
		mockClient.AssertExpectations(t)
	})

	t.Run("Success case - empty list", func(t *testing.T) {
		// Setup Mock
		mockClient := new(testutil.MockDrasiClient)
		mockClient.On("ListResources", "reaction").Return([]api.Resource{}, nil)
		mockClient.On("Close").Return()

		mockPlatformClient := testutil.NewMockPlatformClient(mockClient)

		// Create the command with injected factory
		testOpts := &listCmdOptions{
			platformClientFactory: func(namespace string) (sdk.PlatformClient, error) {
				return mockPlatformClient, nil
			},
		}
		listCmd := NewListCommand(testOpts)
		listCmd.Flags().StringP("namespace", "n", "", "namespace")

		// Execute
		output, err := executeCommand(listCmd, "reaction")

		// Assert
		assert.NoError(t, err)
		// Empty list still shows table headers
		assert.Contains(t, output, "ID")
		mockClient.AssertExpectations(t)
	})

	t.Run("Invalid arguments - no kind specified", func(t *testing.T) {
		// Create the command
		listCmd := NewListCommand()

		// Execute without arguments
		_, err := executeCommand(listCmd)

		// Assert
		assert.Error(t, err)
		// Cobra will return an error for minimum arguments not met
		assert.Contains(t, err.Error(), "requires at least 1 arg")
	})

	t.Run("API client creation failure", func(t *testing.T) {
		// Setup Mock
		mockPlatformClient := new(testutil.MockPlatformClient)
		mockPlatformClient.On("CreateDrasiClient").Return(nil, errors.New("failed to create API client"))

		// Create the command with injected factory
		testOpts := &listCmdOptions{
			platformClientFactory: func(namespace string) (sdk.PlatformClient, error) {
				return mockPlatformClient, nil
			},
		}
		listCmd := NewListCommand(testOpts)
		listCmd.Flags().StringP("namespace", "n", "", "namespace")

		// Execute
		_, err := executeCommand(listCmd, "source")

		// Assert
		if assert.Error(t, err) {
			assert.Contains(t, err.Error(), "failed to create API client")
		}
		mockPlatformClient.AssertExpectations(t)
	})
}

func TestListCommandWithDifferentResourceTypes(t *testing.T) {
	resourceTypes := []string{
		"continuousquery",
		"query",
		"querycontainer",
		"reaction",
		"reactionprovider",
		"source",
		"sourceprovider",
	}

	for _, resourceType := range resourceTypes {
		t.Run("List "+resourceType, func(t *testing.T) {
			// Setup Mock
			mockClient := new(testutil.MockDrasiClient)
			mockClient.On("ListResources", mock.AnythingOfType("string")).Return([]api.Resource{
				{Id: "test-" + resourceType, Status: map[string]interface{}{"available": true}},
			}, nil)
			mockClient.On("Close").Return()

			mockPlatformClient := testutil.NewMockPlatformClient(mockClient)

			// Create the command with injected factory
			testOpts := &listCmdOptions{
				platformClientFactory: func(namespace string) (sdk.PlatformClient, error) {
					return mockPlatformClient, nil
				},
			}
			listCmd := NewListCommand(testOpts)
			listCmd.Flags().StringP("namespace", "n", "", "namespace")

			// Execute
			output, err := executeCommand(listCmd, resourceType)

			// Assert
			assert.NoError(t, err)
			assert.Contains(t, output, "test-"+resourceType)
			mockClient.AssertExpectations(t)
		})
	}
}