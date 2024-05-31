package api

type Resource struct {
	Id     string `json:"id"`
	Spec   any    `json:"spec"`
	Status any    `json:"status"`
}
