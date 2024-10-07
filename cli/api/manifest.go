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

package api

import (
	"bytes"
	"io"

	"gopkg.in/yaml.v3"
)

type Manifest struct {
	Kind       string      `yaml:"kind"`
	ApiVersion string      `yaml:"apiVersion"`
	Name       string      `yaml:"name"`
	Spec       interface{} `yaml:"spec"`
	Tag        string      `yaml:"tag"`
}

func ReadManifests(data []byte) (*[]Manifest, error) {
	var result []Manifest
	r := bytes.NewReader(data)
	decoder := yaml.NewDecoder(r)
	for {
		var doc Manifest

		if err := decoder.Decode(&doc); err != nil {
			// Break when there are no more documents to decode
			if err != io.EOF {
				return nil, err
			}
			break
		}
		result = append(result, doc)
	}
	return &result, nil
}
