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

import (
	"fmt"
	tea "github.com/charmbracelet/bubbletea"
	"golang.org/x/term"
	"os"
	"sync"
)

type TaskOutput interface {
	AddTask(name, message string)
	FailTask(name, message string)
	SucceedTask(name, message string)
	InfoTask(name, message string)
	InfoMessage(message string)
	Error(message string)
	Close()
	GetChildren(name string) TaskOutput
}

func NewTaskOutput() TaskOutput {
	if term.IsTerminal(int(os.Stdout.Fd())) {
		m := taskOutputBubbleTea{
			lock:  &sync.RWMutex{},
			tasks: make(map[string]*task),
			queue: make(chan interface{}, 10),
		}
		p := tea.NewProgram(m)
		m.program = p
		go func() {
			_, e := p.Run()
			if e != nil {
				fmt.Println("Error: " + e.Error())
			}
		}()
		return &m
	} else {
		return taskOutputNoTerm{}
	}
}
