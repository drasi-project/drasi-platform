package service

import (
	"fmt"
	"github.com/charmbracelet/bubbles/spinner"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
	"strings"
	"sync"
)

type TaskOutput interface {
	AddTask(name, message string)
	FailTask(name, message string)
	SucceedTask(name, message string)
	InfoTask(name, message string)
	InfoMessage(message string)
	Error(message string)
	Quit()
	GetChildren(name string) TaskOutput
}

func NewTaskOutput() (*tea.Program, TaskOutput) {
	m := taskOutputBubbleTea{
		lock:  &sync.RWMutex{},
		tasks: make(map[string]*task),
		queue: make(chan interface{}, 10),
	}
	p := tea.NewProgram(m)
	go func() {
		_, e := p.Run()
		if e != nil {
			panic(e)
		}
	}()
	return p, &m
}

type childTaskOutput struct {
	parentName string
	parent     TaskOutput
	queue      chan interface{}
}

func (m childTaskOutput) AddTask(name, message string) {
	m.queue <- taskAddedMsg{name, message, m.parentName}
}

func (m childTaskOutput) FailTask(name, message string) {
	m.queue <- taskFailedMsg{name, message, m.parentName}
}

func (m childTaskOutput) SucceedTask(name, message string) {
	m.queue <- taskSucceededMsg{name, message, m.parentName}
}

func (m childTaskOutput) InfoTask(name, message string) {
	m.queue <- taskInfoMsg{name, message, m.parentName}
}

func (m childTaskOutput) InfoMessage(message string) {
	m.queue <- infoMsg{message, m.parentName}
}

func (m childTaskOutput) Error(message string) {
	m.queue <- errorMsg{message, m.parentName}
}

func (m childTaskOutput) Quit() {
	m.parent.Quit()
}

func (m childTaskOutput) GetChildren(name string) TaskOutput {
	r := childTaskOutput{
		parentName: name,
		parent:     m,
		queue:      m.queue,
	}
	return r
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
	infoStyle    = lipgloss.NewStyle().Foreground(lipgloss.Color("#ADD8E6")).Render
)

type taskAddedMsg struct {
	name    string
	message string
	parent  string
}

type taskFailedMsg struct {
	name    string
	message string
	parent  string
}

type taskSucceededMsg struct {
	name    string
	message string
	parent  string
}

type taskInfoMsg struct {
	name    string
	message string
	parent  string
}

type infoMsg struct {
	message string
	parent  string
}

type errorMsg struct {
	message string
	parent  string
}

type task struct {
	status   itemStatus
	message  string
	spinner  spinner.Model
	parent   string
	children []string
}

type taskOutputBubbleTea struct {
	lock  *sync.RWMutex
	tasks map[string]*task
	keys  []string
	queue chan interface{}
}

func (m taskOutputBubbleTea) AddTask(name, message string) {
	m.queue <- taskAddedMsg{name, message, ""}
}

func (m taskOutputBubbleTea) FailTask(name, message string) {
	m.queue <- taskFailedMsg{name, message, ""}
}

func (m taskOutputBubbleTea) SucceedTask(name, message string) {
	m.queue <- taskSucceededMsg{name, message, ""}
}

func (m taskOutputBubbleTea) InfoTask(name, message string) {
	m.queue <- taskInfoMsg{name, message, ""}
}

func (m taskOutputBubbleTea) InfoMessage(message string) {
	m.queue <- infoMsg{message, ""}
}

func (m taskOutputBubbleTea) Error(message string) {
	m.queue <- errorMsg{message, ""}
}

func (m taskOutputBubbleTea) Quit() {
	m.queue <- tea.Quit()
}

func (m taskOutputBubbleTea) GetChildren(name string) TaskOutput {
	r := childTaskOutput{
		parentName: name,
		parent:     m,
		queue:      m.queue,
	}
	return r
}

func (m taskOutputBubbleTea) waitForQueueItem() tea.Cmd {
	return func() tea.Msg {
		item := <-m.queue
		return item
	}
}

func (m taskOutputBubbleTea) Init() tea.Cmd {
	return m.waitForQueueItem()
}

func (m taskOutputBubbleTea) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	var cmds []tea.Cmd
	m.lock.Lock()
	defer m.lock.Unlock()

	switch msg := msg.(type) {
	case taskAddedMsg:
		sp := spinner.New()
		sp.Spinner = spinner.Points
		sp.Style = spinnerStyle
		m.keys = append(m.keys, msg.name)
		m.tasks[msg.name] = &task{
			status:  Busy,
			message: msg.message,
			spinner: sp,
			parent:  msg.parent,
		}
		if msg.parent != "" {
			p := m.tasks[msg.parent]
			p.children = append(p.children, msg.name)
		}
		return m, tea.Batch(sp.Tick, m.waitForQueueItem())
	case taskFailedMsg:
		t := m.tasks[msg.name]
		t.message = msg.message
		t.status = Failed
		return m, m.waitForQueueItem()
	case taskSucceededMsg:
		t := m.tasks[msg.name]
		t.message = msg.message
		t.status = Success
		return m, m.waitForQueueItem()
	case taskInfoMsg:
		t := m.tasks[msg.name]
		t.message = msg.message
		t.status = Info
		return m, m.waitForQueueItem()
	case infoMsg:
		key := fmt.Sprintf("info-%d", len(m.keys))
		m.keys = append(m.keys, key)
		m.tasks[key] = &task{
			status:  Info,
			message: msg.message,
		}
		return m, m.waitForQueueItem()
	case errorMsg:
		key := fmt.Sprintf("error-%d", len(m.keys))
		m.keys = append(m.keys, key)
		m.tasks[key] = &task{
			status:  Error,
			message: msg.message,
		}
		return m, m.waitForQueueItem()
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

func (m taskOutputBubbleTea) View() string {
	s := ""
	m.lock.RLock()
	defer m.lock.RUnlock()

	for _, taskId := range m.keys {
		item, exists := m.tasks[taskId]
		if !exists {
			continue
		}
		if item.parent != "" {
			continue
		}

		s += m.buildItemView(item, 0)
	}

	return s
}

func (m taskOutputBubbleTea) buildItemView(item *task, depth int) string {
	s := ""
	s += strings.Repeat("  ", depth)
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
		s += infoStyle("ℹ")
		s += fmt.Sprintf(" %s\n", item.message)
	case Error:
		s += errorStyle("✗")
		s += fmt.Sprintf(" %s\n", item.message)
	}

	for _, cid := range item.children {
		child, exists := m.tasks[cid]
		if !exists {
			continue
		}
		s += m.buildItemView(child, depth+1)
	}

	return s
}
