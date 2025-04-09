package registry

import (
	"os"
	"path/filepath"

	"k8s.io/client-go/tools/clientcmd"
)

func SaveRegistration(name string, registration Registration) error {

	homeDir, err := os.UserHomeDir()
	if err != nil {
		return err
	}

	cfgPath := filepath.Join(homeDir, ".drasi", "servers", name)
	err = os.MkdirAll(cfgPath, 0755)
	if err != nil {
		return err
	}
	cfgFile := filepath.Join(cfgPath, "config.json")
	data, err := registration.MarshalJSON()
	if err != nil {
		return err
	}
	err = os.WriteFile(cfgFile, data, 0644)
	if err != nil {
		return err
	}

	return nil
}

func LoadRegistration(name string) (Registration, error) {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return nil, err
	}

	cfgPath := filepath.Join(homeDir, ".drasi", "servers", name)
	cfgFile := filepath.Join(cfgPath, "config.json")
	data, err := os.ReadFile(cfgFile)
	if err != nil {
		return nil, err
	}

	registration, err := UnmarshalJSON(data)
	if err != nil {
		return nil, err
	}

	return registration, nil
}

func SetCurrentRegistration(name string) error {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return err
	}

	cfgFile := filepath.Join(homeDir, ".drasi", "current")
	err = os.WriteFile(cfgFile, []byte(name), 0644)
	if err != nil {
		return err
	}

	return nil
}

func GetCurrentRegistration() (string, error) {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return "", err
	}

	cfgFile := filepath.Join(homeDir, ".drasi", "current")

	_, err = os.Stat(cfgFile)

	if err != nil && os.IsNotExist(err) {
		return "", nil
	}

	data, err := os.ReadFile(cfgFile)
	if err != nil {
		return "", err
	}

	return string(data), nil
}

func LoadCurrentRegistration() (Registration, error) {
	name, err := GetCurrentRegistration()
	if err != nil {
		return nil, err
	}

	if name == "" {
		return getDefaultRegistration()
	}

	registration, err := LoadRegistration(name)
	if err != nil {
		return nil, err
	}

	return registration, nil
}

func LoadCurrentRegistrationWithNamespace(namespace string) (Registration, error) {
	result, err := LoadCurrentRegistration()
	if err != nil {
		return nil, err
	}
	if k8sConfig, ok := result.(*KubernetesConfig); ok {
		k8sConfig.Namespace = namespace
	}

	return result, nil
}

func getDefaultRegistration() (Registration, error) {
	configLoadingRules := clientcmd.NewDefaultClientConfigLoadingRules()
	configOverrides := &clientcmd.ConfigOverrides{}

	config := clientcmd.NewNonInteractiveDeferredLoadingClientConfig(configLoadingRules, configOverrides)

	rawConfig, err := config.RawConfig()
	if err != nil {
		return nil, err
	}
	configBytes, err := clientcmd.Write(rawConfig)
	if err != nil {
		return nil, err
	}

	return &KubernetesConfig{
		Namespace:  "drasi-system",
		KubeConfig: configBytes,
		Config: Config{
			Kind: Kubernetes,
		},
	}, nil
}
