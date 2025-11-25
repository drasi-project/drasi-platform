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

package testutil

import (
	"drasi.io/cli/output"
	"drasi.io/cli/sdk"
	"github.com/stretchr/testify/mock"
)

// MockPlatformClient is a mock implementation of the PlatformClient interface.
type MockPlatformClient struct {
	mock.Mock
	mockDrasiClient sdk.DrasiClient
}

// NewMockPlatformClient creates a new MockPlatformClient with a given DrasiClient
func NewMockPlatformClient(drasiClient sdk.DrasiClient) *MockPlatformClient {
	return &MockPlatformClient{
		mockDrasiClient: drasiClient,
	}
}

func (m *MockPlatformClient) CreateDrasiClient() (sdk.DrasiClient, error) {
	if m.mockDrasiClient != nil {
		return m.mockDrasiClient, nil
	}
	args := m.Called()
	if res := args.Get(0); res != nil {
		return res.(sdk.DrasiClient), args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockPlatformClient) CreateTunnel(resourceType string, resourceName string, localPort uint16) error {
	args := m.Called(resourceType, resourceName, localPort)
	return args.Error(0)
}

func (m *MockPlatformClient) SetSecret(name string, key string, value []byte) error {
	args := m.Called(name, key, value)
	return args.Error(0)
}

func (m *MockPlatformClient) DeleteSecret(name string, key string) error {
	args := m.Called(name, key)
	return args.Error(0)
}

// UpdateIngressConfig mocks the UpdateIngressConfig method
func (m *MockPlatformClient) UpdateIngressConfig(config *sdk.IngressConfig, output output.TaskOutput) error {
	args := m.Called(config, output)
	return args.Error(0)
}

// GetIngressURL mocks the GetIngressURL method
func (m *MockPlatformClient) GetIngressURL(resourceName string) string {
	args := m.Called(resourceName)
	return args.String(0)
}

// DisplayIngressInfo mocks the DisplayIngressInfo method
func (m *MockPlatformClient) DisplayIngressInfo(resourceName string, spec interface{}, output output.TaskOutput) {
	m.Called(resourceName, spec, output)
}