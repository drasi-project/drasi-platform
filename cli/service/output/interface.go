package output

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
