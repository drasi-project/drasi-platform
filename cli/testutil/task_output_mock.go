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
	"github.com/stretchr/testify/mock"
)

// MockTaskOutput is a mock implementation of the TaskOutput interface
type MockTaskOutput struct {
	mock.Mock
}

func (m *MockTaskOutput) AddTask(name, message string) {
	m.Called(name, message)
}

func (m *MockTaskOutput) FailTask(name, message string) {
	m.Called(name, message)
}

func (m *MockTaskOutput) SucceedTask(name, message string) {
	m.Called(name, message)
}

func (m *MockTaskOutput) InfoTask(name, message string) {
	m.Called(name, message)
}

func (m *MockTaskOutput) InfoMessage(message string) {
	m.Called(message)
}

func (m *MockTaskOutput) Error(message string) {
	m.Called(message)
}

func (m *MockTaskOutput) Close() {
	m.Called()
}

func (m *MockTaskOutput) GetChildren(name string) output.TaskOutput {
	args := m.Called(name)
	if res := args.Get(0); res != nil {
		return res.(output.TaskOutput)
	}
	return nil
}