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
