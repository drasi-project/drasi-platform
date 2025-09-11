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

package cmd

import (
	"os"
	"path/filepath"
	"testing"
)

func TestLoadCustomValues(t *testing.T) {
	// Test with valid YAML file
	tmpDir := t.TempDir()
	configFile := filepath.Join(tmpDir, "values.yaml")

	yamlContent := `
contour:
  replicas: 2
  service:
    type: LoadBalancer

envoy:
  replicas: 3
`

	err := os.WriteFile(configFile, []byte(yamlContent), 0644)
	if err != nil {
		t.Fatalf("Failed to create test file: %v", err)
	}

	values, err := loadCustomValues(configFile)
	if err != nil {
		t.Fatalf("loadCustomValues failed: %v", err)
	}

	// Check that values were parsed correctly
	if contour, ok := values["contour"].(map[string]interface{}); ok {
		if replicas, ok := contour["replicas"].(int); !ok || replicas != 2 {
			t.Errorf("Expected contour.replicas to be 2, got %v", replicas)
		}
	} else {
		t.Error("Expected 'contour' key in parsed values")
	}
}

func TestLoadCustomValues_InvalidFile(t *testing.T) {
	// Test with non-existent file
	_, err := loadCustomValues("/nonexistent/file.yaml")
	if err == nil {
		t.Error("Expected error for non-existent file")
	}
}

func TestLoadCustomValues_InvalidYAML(t *testing.T) {
	// Test with invalid YAML
	tmpDir := t.TempDir()
	configFile := filepath.Join(tmpDir, "invalid.yaml")

	invalidYaml := `
invalid: yaml: content:
  - missing
    - proper
  indentation
`

	err := os.WriteFile(configFile, []byte(invalidYaml), 0644)
	if err != nil {
		t.Fatalf("Failed to create test file: %v", err)
	}

	_, err = loadCustomValues(configFile)
	if err == nil {
		t.Error("Expected error for invalid YAML")
	}
}

func TestMergeValues(t *testing.T) {
	base := map[string]interface{}{
		"key1": "value1",
		"key2": map[string]interface{}{
			"nested": "original",
		},
	}

	custom := map[string]interface{}{
		"key1": "overridden",
		"key3": "new_value",
	}

	result := mergeValues(base, custom)

	// Check overridden value
	if result["key1"] != "overridden" {
		t.Errorf("Expected key1 to be 'overridden', got %v", result["key1"])
	}

	// Check new value
	if result["key3"] != "new_value" {
		t.Errorf("Expected key3 to be 'new_value', got %v", result["key3"])
	}

	// Check preserved value
	if nested, ok := result["key2"].(map[string]interface{}); ok {
		if nested["nested"] != "original" {
			t.Errorf("Expected key2.nested to be 'original', got %v", nested["nested"])
		}
	} else {
		t.Error("Expected key2 to be preserved")
	}
}

func TestMergeValues_NilCustom(t *testing.T) {
	base := map[string]interface{}{
		"key1": "value1",
	}

	result := mergeValues(base, nil)

	if len(result) != len(base) {
		t.Errorf("Expected result length to be %d, got %d", len(base), len(result))
	}

	if result["key1"] != "value1" {
		t.Errorf("Expected key1 to be 'value1', got %v", result["key1"])
	}
}
