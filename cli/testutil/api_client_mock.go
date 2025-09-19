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
	"drasi.io/cli/api"
	"drasi.io/cli/output"
	"github.com/stretchr/testify/mock"
)

// MockDrasiClient is a mock implementation of the DrasiClient interface.
type MockDrasiClient struct {
	mock.Mock
}

func (m *MockDrasiClient) Apply(manifests *[]api.Manifest, output output.TaskOutput) error {
	args := m.Called(manifests, output)
	return args.Error(0)
}

func (m *MockDrasiClient) Delete(manifests *[]api.Manifest, output output.TaskOutput) error {
	args := m.Called(manifests, output)
	return args.Error(0)
}

func (m *MockDrasiClient) GetResource(kind string, name string) (*api.Resource, error) {
	args := m.Called(kind, name)
	if res := args.Get(0); res != nil {
		return res.(*api.Resource), args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockDrasiClient) ListResources(kind string) ([]api.Resource, error) {
	args := m.Called(kind)
	if res := args.Get(0); res != nil {
		return res.([]api.Resource), args.Error(1)
	}
	return nil, args.Error(1)
}

func (m *MockDrasiClient) ReadyWait(manifests *[]api.Manifest, timeout int32, output output.TaskOutput) error {
	args := m.Called(manifests, timeout, output)
	return args.Error(0)
}

func (m *MockDrasiClient) Watch(kind string, name string, output chan map[string]interface{}, initErr chan error) {
	m.Called(kind, name, output, initErr)
}

func (m *MockDrasiClient) Close() {
	m.Called()
}