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
