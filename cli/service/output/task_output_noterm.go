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
