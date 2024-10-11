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

package output

import "fmt"

type taskOutputNoTerm struct {
}

func (m taskOutputNoTerm) AddTask(name, message string) {
	fmt.Printf("[BUSY] %s: %s", name, message)
}

func (m taskOutputNoTerm) FailTask(name, message string) {
	fmt.Printf("[FAILED] %s: %s", name, message)
}

func (m taskOutputNoTerm) SucceedTask(name, message string) {
	fmt.Printf("[SUCCESS] %s: %s", name, message)
}

func (m taskOutputNoTerm) InfoTask(name, message string) {
	fmt.Printf("[INFO] %s: %s", name, message)
}

func (m taskOutputNoTerm) InfoMessage(message string) {
	fmt.Printf("[INFO] %s", message)
}

func (m taskOutputNoTerm) Error(message string) {
	fmt.Printf("[ERROR] %s", message)
}

func (m taskOutputNoTerm) Close() {
}

func (m taskOutputNoTerm) GetChildren(name string) TaskOutput {
	return &m
}
