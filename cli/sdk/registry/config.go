package registry

import "encoding/json"

type Kind string

const (
	Kubernetes Kind = "kubernetes"
)

type Registration interface {
	GetKind() Kind
	MarshalJSON() ([]byte, error)
}

type Config struct {
	Kind Kind `json:"kind"`
}

type KubernetesConfig struct {
	Namespace  string `json:"namespace"`
	KubeConfig []byte `json:"kubeconfig"`
	Config
}

func (cfg *KubernetesConfig) GetKind() Kind {
	return cfg.Kind
}

func (cfg *KubernetesConfig) MarshalJSON() ([]byte, error) {
	return json.Marshal(cfg)
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
	default:
		return nil, nil
	}
}
