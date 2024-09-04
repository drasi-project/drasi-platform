package service

import (
	"fmt"
	"github.com/charmbracelet/bubbles/spinner"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
	"sync"
)

type TaskUI interface {
	AddTask(name, message string)
	FailTask(name, message string)
	SucceedTask(name, message string)
	Info(message string)
	Error(message string)
	Quit()
}

func NewTaskOutput() (*tea.Program, TaskOutput) {
	m := TaskOutput{
		lock:  &sync.RWMutex{},
		tasks: make(map[string]*Task),
		queue: make(chan interface{}, 10),
	}
	p := tea.NewProgram(m)
	go func() {
		_, e := p.Run()
		if e != nil {
			panic(e)
		}
	}()
	return p, m
}

type itemStatus = int

const (
	Busy itemStatus = iota
	Failed
	Success
	Info
	Error
)

var (
	spinnerStyle = lipgloss.NewStyle().Foreground(lipgloss.Color("69"))
	successStyle = lipgloss.NewStyle().Foreground(lipgloss.Color("#04B575")).Render
	errorStyle   = lipgloss.NewStyle().Foreground(lipgloss.Color("#FF0000")).Render
)

type taskAddedMsg struct {
	name    string
	message string
}

type taskFailedMsg struct {
	name    string
	message string
}

type taskSucceededMsg struct {
	name    string
	message string
}

type infoMsg struct {
	message string
}

type errorMsg struct {
	message string
}

type Task struct {
	status  itemStatus
	message string
	spinner spinner.Model
}

type TaskOutput struct {
	lock  *sync.RWMutex
	tasks map[string]*Task
	keys  []string
	queue chan interface{}
}

func (m *TaskOutput) AddTask(name, message string) {
	m.queue <- taskAddedMsg{name, message}
}

func (m *TaskOutput) FailTask(name, message string) {
	m.queue <- taskFailedMsg{name, message}
}

func (m *TaskOutput) SucceedTask(name, message string) {
	m.queue <- taskSucceededMsg{name, message}
}

func (m *TaskOutput) Info(message string) {
	m.queue <- infoMsg{message}
}

func (m *TaskOutput) Error(message string) {
	m.queue <- errorMsg{message}
}

func (m *TaskOutput) Quit() {
	m.queue <- tea.Quit()
}

func waitForQueueItem(queue chan interface{}) tea.Cmd {
	return func() tea.Msg {
		item := <-queue // Wait for an item to be available
		return item
	}
}

func (m TaskOutput) Init() tea.Cmd {
	return waitForQueueItem(m.queue)
}

func (m TaskOutput) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	var cmds []tea.Cmd
	m.lock.Lock()
	defer m.lock.Unlock()

	switch msg := msg.(type) {
	case taskAddedMsg:
		sp := spinner.New()
		sp.Spinner = spinner.Points
		sp.Style = spinnerStyle
		m.keys = append(m.keys, msg.name)
		m.tasks[msg.name] = &Task{
			status:  Busy,
			message: msg.message,
			spinner: sp,
		}
		return m, tea.Batch(sp.Tick, waitForQueueItem(m.queue))
	case taskFailedMsg:
		t := m.tasks[msg.name]
		t.message = msg.message
		t.status = Failed
		return m, waitForQueueItem(m.queue)
	case taskSucceededMsg:
		t := m.tasks[msg.name]
		t.message = msg.message
		t.status = Success
		return m, waitForQueueItem(m.queue)
	case infoMsg:
		key := fmt.Sprintf("info-%d", len(m.keys))
		m.keys = append(m.keys, key)
		m.tasks[key] = &Task{
			status:  Info,
			message: msg.message,
		}
		return m, waitForQueueItem(m.queue)
	case errorMsg:
		key := fmt.Sprintf("error-%d", len(m.keys))
		m.keys = append(m.keys, key)
		m.tasks[key] = &Task{
			status:  Error,
			message: msg.message,
		}
		return m, waitForQueueItem(m.queue)
	case spinner.TickMsg:
		for _, task := range m.tasks {
			if task.status == Busy {
				var cmd tea.Cmd
				task.spinner, cmd = task.spinner.Update(msg)
				cmds = append(cmds, cmd)
			}
		}
	case tea.KeyMsg:
		if msg.String() == "ctrl+c" {
			return m, tea.Quit
		}
	}

	return m, tea.Batch(cmds...)
}

func (m TaskOutput) View() string {
	s := ""
	m.lock.RLock()
	defer m.lock.RUnlock()

	for _, taskId := range m.keys {
		item, exists := m.tasks[taskId]
		if !exists {
			continue
		}
		switch item.status {
		case Busy:
			s += fmt.Sprintf("%s %s\n", item.spinner.View(), item.message)
		case Failed:
			s += errorStyle("✗")
			s += fmt.Sprintf(" %s\n", item.message)
		case Success:
			s += successStyle("✓")
			s += fmt.Sprintf(" %s\n", item.message)
		case Info:
			s += fmt.Sprintf("ℹ %s\n", item.message)
		case Error:
			s += errorStyle("✗")
			s += fmt.Sprintf(" %s\n", item.message)
		}
	}

	return s
}
