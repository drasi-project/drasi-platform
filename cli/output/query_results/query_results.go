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

package query_results

import (
	"fmt"
	"github.com/charmbracelet/bubbles/table"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
	"golang.org/x/term"
	"os"
	"sync"
)

var baseStyle = lipgloss.NewStyle().
	BorderStyle(lipgloss.NormalBorder()).
	BorderForeground(lipgloss.Color("240"))

func NewQueryResults(onClose func()) QueryResults {
	t := table.New(
		table.WithFocused(true),
	)

	termWidth, termHeight, _ := getTerminalSize()
	if termHeight > 20 {
		t.SetHeight(termHeight - 7)
	}
	if termWidth > 0 {
		t.SetWidth(termWidth - 5)
	}

	t.SetCursor(-1)
	s := table.DefaultStyles()
	s.Selected = s.Selected.
		Foreground(lipgloss.Color("229")).
		Background(lipgloss.Color("57")).
		Bold(false)
	s.Header = s.Header.
		BorderStyle(lipgloss.NormalBorder()).
		BorderForeground(lipgloss.Color("240")).
		BorderBottom(true).
		Bold(true)
	t.SetStyles(s)

	m := QueryResults{
		lock: &sync.RWMutex{},
		results: &resultContainer{
			resultKeys: make(map[[32]byte]int),
			results:    make([]map[string]interface{}, 100),
		},
		queue:   make(chan interface{}, 10),
		table:   &t,
		headers: make(map[string]int),
	}
	p := tea.NewProgram(m)
	m.program = p
	go func() {
		_, e := p.Run()
		if e != nil {
			fmt.Println("Error: " + e.Error())
		}
		onClose()
	}()
	return m
}

type QueryResults struct {
	lock    *sync.RWMutex
	results *resultContainer
	headers map[string]int
	queue   chan interface{}
	table   *table.Model
	program *tea.Program
}

func (m QueryResults) Change(change ChangeMsg) {
	m.queue <- change
}

func (m QueryResults) Close() {
	m.queue <- tea.Quit()
	m.program.Wait()
}

func (m QueryResults) waitForQueueItem() tea.Cmd {
	return func() tea.Msg {
		item := <-m.queue
		return item
	}
}

func (m QueryResults) Init() tea.Cmd {
	return tea.Batch(m.waitForQueueItem(), tea.EnterAltScreen)
}

func (m QueryResults) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	var cmd tea.Cmd
	m.lock.Lock()
	defer m.lock.Unlock()

	switch msg := msg.(type) {

	case ChangeMsg:
		m.applyChanges(msg)
		return m, m.waitForQueueItem()
	case tea.KeyMsg:
		switch msg.Type {
		case tea.KeyCtrlC:
			return m, tea.Quit
		case tea.KeyRunes:
			switch string(msg.Runes) {
			case "q":
				return m, tea.Quit
			}
		}
	}
	*m.table, cmd = m.table.Update(msg)
	return m, cmd
}

func (m QueryResults) applyChanges(chg ChangeMsg) {
	for _, result := range chg.AddedResults {
		m.results.Add(result)
	}

	for _, update := range chg.UpdatedResults {
		m.results.Update(update)
	}

	for _, result := range chg.DeletedResults {
		m.results.Delete(result)
	}

	cols := m.table.Columns()
	rows := make([]table.Row, 0, 10)

	for _, result := range m.results.Iter() {
		if result == nil {
			continue
		}

		row := make([]string, len(result), len(result))

		for k, v := range result {
			colIdx, exists := m.headers[k]
			if !exists {
				colIdx = len(m.headers)
				m.headers[k] = colIdx
				cols = append(cols, table.Column{
					Title: k,
					Width: 20,
				})
			}
			row[colIdx] = fmt.Sprintf("%v", v)
		}

		rows = append(rows, row)
	}

	m.table.SetColumns(cols)
	m.table.SetRows(rows)
}

func (m QueryResults) View() string {
	keyMap := "Use Arrow keys to navigate, Page Up/Down, Home/End to scroll, and q to exit."
	return baseStyle.Render(m.table.View()) + "\n" + keyMap
}

func getTerminalSize() (int, int, error) {
	fd := int(os.Stdout.Fd())
	width, height, err := term.GetSize(fd)
	if err != nil {
		return 0, 0, err
	}
	return width, height, nil
}
