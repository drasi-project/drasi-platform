package registry

import (
	"os"
	"path/filepath"

	"k8s.io/client-go/tools/clientcmd"
)

const (
	// Directory structure constants
	DrasiDir       = ".drasi"
	ServersDir     = "servers"
	CurrentFile    = "current"
	ConfigFileName = "config.json"

	// Default values
	DefaultNamespace = "drasi-system"

	// File modes
	DirPermission  = 0755
	FilePermission = 0644
)

func SaveRegistration(name string, registration Registration) error {

	homeDir, err := os.UserHomeDir()
	if err != nil {
		return err
	}

	cfgPath := filepath.Join(homeDir, DrasiDir, ServersDir, name)
	err = os.MkdirAll(cfgPath, DirPermission)
	if err != nil {
		return err
	}
	cfgFile := filepath.Join(cfgPath, ConfigFileName)
	data, err := registration.MarshalJSON()
	if err != nil {
		return err
	}
	err = os.WriteFile(cfgFile, data, FilePermission)
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

	cfgPath := filepath.Join(homeDir, DrasiDir, ServersDir, name)
	cfgFile := filepath.Join(cfgPath, ConfigFileName)

	_, err = os.Stat(cfgFile)
	if err != nil && os.IsNotExist(err) {
		return nil, err
	}

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

func RegistrationExists(name string) (bool, error) {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return false, err
	}

	cfgPath := filepath.Join(homeDir, DrasiDir, ServersDir, name)
	cfgFile := filepath.Join(cfgPath, ConfigFileName)

	_, err = os.Stat(cfgFile)

	if err != nil && os.IsNotExist(err) {
		return false, nil
	}

	return true, nil
}

func DeleteRegistration(name string) error {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return err
	}

	cfgPath := filepath.Join(homeDir, DrasiDir, ServersDir, name)
	err = os.RemoveAll(cfgPath)
	if err != nil {
		return err
	}

	current, err := GetCurrentRegistration()
	if err != nil {
		return err
	}
	if current == name {
		err = UnsetCurrentRegistration()
		if err != nil {
			return err
		}
	}

	return nil
}

func SetCurrentRegistration(name string) error {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return err
	}

	cfgFile := filepath.Join(homeDir, DrasiDir, CurrentFile)
	err = os.WriteFile(cfgFile, []byte(name), FilePermission)
	if err != nil {
		return err
	}

	return nil
}

func UnsetCurrentRegistration() error {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return err
	}

	cfgFile := filepath.Join(homeDir, DrasiDir, CurrentFile)
	err = os.Remove(cfgFile)
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

	cfgFile := filepath.Join(homeDir, DrasiDir, CurrentFile)

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
		return SaveKubecontextAsCurrent()
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
		if namespace != "" {
			k8sConfig.Namespace = namespace
		}
	}

	return result, nil
}

func ListRegistrations() ([]Registration, error) {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return nil, err
	}

	cfgPath := filepath.Join(homeDir, DrasiDir, ServersDir)

	if _, err := os.Stat(cfgPath); os.IsNotExist(err) {
		return []Registration{}, nil
	}

	files, err := os.ReadDir(cfgPath)
	if err != nil {
		return nil, err
	}

	var registrations []Registration
	for _, file := range files {
		if file.IsDir() {
			registration, err := LoadRegistration(file.Name())
			if err != nil {
				return nil, err
			}
			if registration != nil {
				registrations = append(registrations, registration)
			}
		}
	}

	return registrations, nil
}

func SaveKubecontextAsCurrent() (Registration, error) {
	reg, err := getCurrentKubecontextRegistration()
	if err != nil {
		return nil, err
	}

	err = SaveRegistration(reg.GetId(), reg)
	if err != nil {
		return nil, err
	}

	err = SetCurrentRegistration(reg.GetId())
	if err != nil {
		return nil, err
	}

	return reg, nil
}

func getCurrentKubecontextRegistration() (Registration, error) {
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
		Namespace:  DefaultNamespace,
		KubeConfig: configBytes,
		Config: Config{
			Kind: Kubernetes,
			Id:   rawConfig.CurrentContext,
		},
	}, nil
}
