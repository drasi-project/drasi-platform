package service

import (
	"encoding/json"
	"os"
	"os/user"
	"path"
)

type ClusterConfig struct {
	DrasiNamespace     string `json:"drasinamespace"`
	DaprRuntimeVersion string `json:"daprruntimeversion"`
	DaprSidecarVersion string `json:"daprsidecarversion"`
}

func configPath() string {
	cfgFile := "drasiconfig.json"
	usr, _ := user.Current()
	return path.Join(usr.HomeDir, cfgFile)
}

func saveConfig(drasiConfig ClusterConfig) {
	jsonC, _ := json.Marshal(drasiConfig)
	if _, err := os.Stat(configPath()); os.IsNotExist(err) {
		os.Create(configPath())
	}
	os.WriteFile(configPath(), jsonC, os.ModeAppend)
}

func readConfig() ClusterConfig {
	data, _ := os.ReadFile(configPath())
	var cfg ClusterConfig
	json.Unmarshal(data, &cfg)
	return cfg
}
