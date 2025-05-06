package registry

import "encoding/json"

type Kind string

const (
	Docker     Kind = "docker"
	Kubernetes Kind = "kubernetes"
)

type Registration interface {
	GetKind() Kind
	GetId() string
	MarshalJSON() ([]byte, error)
}

type Config struct {
	Id   string `json:"id"`
	Kind Kind   `json:"kind"`
}

type KubernetesConfig struct {
	Namespace  string `json:"namespace"`
	KubeConfig []byte `json:"kubeconfig"`
	Config
}

type DockerConfig struct {
	ContainerId    *string      `json:"containerId,omitempty"`
	InternalConfig Registration `json:"-"` // Using custom marshaling
	Config
}

func (cfg *KubernetesConfig) GetKind() Kind {
	return cfg.Kind
}

func (cfg *DockerConfig) GetKind() Kind {
	return cfg.Kind
}

func (cfg *KubernetesConfig) GetId() string {
	return cfg.Id
}

func (cfg *DockerConfig) GetId() string {
	return cfg.Id
}

func (cfg *KubernetesConfig) MarshalJSON() ([]byte, error) {
	type Alias KubernetesConfig
	return json.Marshal((*Alias)(cfg))
}

func (cfg *DockerConfig) MarshalJSON() ([]byte, error) {
	type Alias struct {
		ContainerId    *string         `json:"containerId,omitempty"`
		InternalConfig json.RawMessage `json:"internalConfig"`
		Id             string          `json:"id"`
		Kind           Kind            `json:"kind"`
	}

	var internalConfigJSON json.RawMessage
	if cfg.InternalConfig != nil {
		data, err := cfg.InternalConfig.MarshalJSON()
		if err != nil {
			return nil, err
		}
		internalConfigJSON = data
	}

	return json.Marshal(&Alias{
		ContainerId:    cfg.ContainerId,
		InternalConfig: internalConfigJSON,
		Id:             cfg.Id,
		Kind:           cfg.Kind,
	})
}

func UnmarshalJSON(data []byte) (Registration, error) {
	var cfg Config
	if err := json.Unmarshal(data, &cfg); err != nil {
		return nil, err
	}

	switch cfg.Kind {
	case Kubernetes:
		var k8sConfig KubernetesConfig
		if err := json.Unmarshal(data, &k8sConfig); err != nil {
			return nil, err
		}
		return &k8sConfig, nil
	case Docker:
		var temp struct {
			ContainerId    *string         `json:"containerId,omitempty"`
			InternalConfig json.RawMessage `json:"internalConfig"`
			Id             string          `json:"id"`
			Kind           Kind            `json:"kind"`
		}

		if err := json.Unmarshal(data, &temp); err != nil {
			return nil, err
		}

		// Unmarshal the internal config
		internalConfig, err := UnmarshalJSON(temp.InternalConfig)
		if err != nil {
			return nil, err
		}

		dockerConfig := &DockerConfig{
			ContainerId:    temp.ContainerId,
			InternalConfig: internalConfig,
			Config: Config{
				Id:   temp.Id,
				Kind: temp.Kind,
			},
		}

		return dockerConfig, nil
	default:
		return nil, nil
	}
}
