package output

import (
	"bytes"
	"crypto/sha256"
	"encoding/json"
	"fmt"
	tea "github.com/charmbracelet/bubbletea"
	"sort"
	"sync"
)

func NewQueryResults() QueryResults {
	m := QueryResults{
		lock:       &sync.RWMutex{},
		resultKeys: make(map[[32]byte]int),
		results:    make([]map[string]interface{}, 0, 100),
		queue:      make(chan interface{}, 10),
	}
	p := tea.NewProgram(m)
	m.program = p
	go func() {
		_, e := p.Run()
		if e != nil {
			fmt.Println("Error: " + e.Error())
		}
	}()
	return m
}

type UpdatedResult struct {
	Before map[string]interface{} `json:"before"`
	After  map[string]interface{} `json:"after"`
}

type ChangeMsg struct {
	AddedResults   []map[string]interface{} `json:"addedResults"`
	UpdatedResults []UpdatedResult          `json:"updatedResults"`
	DeletedResults []map[string]interface{} `json:"deletedResults"`
}

func CreateChangeMsg(data map[string]interface{}) (*ChangeMsg, error) {

	jsonData, err := json.Marshal(data)
	if err != nil {
		panic(err)
	}

	var result ChangeMsg
	err = json.Unmarshal(jsonData, &result)
	if err != nil {
		return nil, err
	}

	return &result, nil
}

type QueryResults struct {
	lock       *sync.RWMutex
	resultKeys map[[32]byte]int
	results    []map[string]interface{}
	queue      chan interface{}
	program    *tea.Program
}

func hash(data map[string]interface{}) [32]byte {

	keys := make([]string, 0, len(data))
	for k := range data {
		keys = append(keys, k)
	}

	sort.Strings(keys)

	var buf bytes.Buffer

	for _, k := range keys {
		buf.WriteString(k)
		jsonBytes, _ := json.Marshal(data[k])
		buf.Write(jsonBytes)
	}

	return sha256.Sum256(buf.Bytes())
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
	return m.waitForQueueItem()
}

func (m QueryResults) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	var cmds []tea.Cmd
	m.lock.Lock()
	defer m.lock.Unlock()

	switch msg := msg.(type) {

	case ChangeMsg:
		m.applyChanges(msg)
		return m, m.waitForQueueItem()
	case tea.KeyMsg:
		if msg.String() == "ctrl+c" {
			return m, tea.Quit
		}
	}

	return m, tea.Batch(cmds...)
}

func (m *QueryResults) applyChanges(chg ChangeMsg) {
	for _, result := range chg.AddedResults {
		key := hash(result)
		m.results = append(m.results, result)
		m.resultKeys[key] = len(m.results) - 1
	}

	for _, update := range chg.UpdatedResults {
		beforeKey := hash(update.Before)
		afterKey := hash(update.After)
		idx := m.resultKeys[beforeKey]
		delete(m.resultKeys, beforeKey)
		m.resultKeys[afterKey] = idx
		m.results[idx] = update.After
	}

	for _, result := range chg.DeletedResults {
		key := hash(result)
		idx := m.resultKeys[key]
		delete(m.resultKeys, key)
		m.results[idx] = nil
	}
}

func (m QueryResults) View() string {
	var s string
	s += "Results Table:\n\n"
	s += "Data\n"
	s += "-------------------\n"

	for _, result := range m.results {
		if result == nil {
			continue
		}
		s += fmt.Sprintf("%+v\n", result)
	}

	s += "\nPress 'q' to quit."
	return s
}
