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
