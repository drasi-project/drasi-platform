package registry

import (
	"encoding/json"
	"reflect"
	"testing"
)

func TestKubernetesConfigSerialization(t *testing.T) {
	// Create a KubernetesConfig instance
	k8sCfg := &KubernetesConfig{
		Namespace:  "test-namespace",
		KubeConfig: []byte("test-kubeconfig-content"),
		Config: Config{
			Id:   "test-id",
			Kind: Kubernetes,
		},
	}

	// Test marshaling
	data, err := k8sCfg.MarshalJSON()
	if err != nil {
		t.Fatalf("Failed to marshal KubernetesConfig: %v", err)
	}

	// Verify JSON structure
	var jsonMap map[string]interface{}
	if err := json.Unmarshal(data, &jsonMap); err != nil {
		t.Fatalf("Failed to unmarshal JSON: %v", err)
	}

	// Verify fields
	if jsonMap["id"] != "test-id" {
		t.Errorf("Expected id 'test-id', got %v", jsonMap["id"])
	}
	if jsonMap["kind"] != string(Kubernetes) {
		t.Errorf("Expected kind '%s', got %v", Kubernetes, jsonMap["kind"])
	}
	if jsonMap["namespace"] != "test-namespace" {
		t.Errorf("Expected namespace 'test-namespace', got %v", jsonMap["namespace"])
	}

	// Test unmarshaling
	deserialized, err := UnmarshalJSON(data)
	if err != nil {
		t.Fatalf("Failed to unmarshal KubernetesConfig: %v", err)
	}

	// Type assertion
	k8sDeserialized, ok := deserialized.(*KubernetesConfig)
	if !ok {
		t.Fatalf("Expected *KubernetesConfig, got %T", deserialized)
	}

	// Verify content equality
	if k8sDeserialized.Id != k8sCfg.Id {
		t.Errorf("Expected Id '%s', got '%s'", k8sCfg.Id, k8sDeserialized.Id)
	}
	if k8sDeserialized.Kind != k8sCfg.Kind {
		t.Errorf("Expected Kind '%s', got '%s'", k8sCfg.Kind, k8sDeserialized.Kind)
	}
	if k8sDeserialized.Namespace != k8sCfg.Namespace {
		t.Errorf("Expected Namespace '%s', got '%s'", k8sCfg.Namespace, k8sDeserialized.Namespace)
	}
	if !reflect.DeepEqual(k8sDeserialized.KubeConfig, k8sCfg.KubeConfig) {
		t.Errorf("Expected KubeConfig '%s', got '%s'", k8sCfg.KubeConfig, k8sDeserialized.KubeConfig)
	}
}

func TestDockerConfigSerialization(t *testing.T) {
	// Create a KubernetesConfig for internal config
	containerId := "test-container-id"
	internalK8sCfg := &KubernetesConfig{
		Namespace:  "internal-namespace",
		KubeConfig: []byte("internal-kubeconfig-content"),
		Config: Config{
			Id:   "internal-id",
			Kind: Kubernetes,
		},
	}

	// Create a DockerConfig instance
	dockerCfg := &DockerConfig{
		ContainerId:    &containerId,
		InternalConfig: internalK8sCfg,
		Config: Config{
			Id:   "docker-id",
			Kind: Docker,
		},
	}

	// Test marshaling
	data, err := dockerCfg.MarshalJSON()
	if err != nil {
		t.Fatalf("Failed to marshal DockerConfig: %v", err)
	}

	// Verify JSON structure
	var jsonMap map[string]interface{}
	if err := json.Unmarshal(data, &jsonMap); err != nil {
		t.Fatalf("Failed to unmarshal JSON: %v", err)
	}

	// Verify fields
	if jsonMap["id"] != "docker-id" {
		t.Errorf("Expected id 'docker-id', got %v", jsonMap["id"])
	}
	if jsonMap["kind"] != string(Docker) {
		t.Errorf("Expected kind '%s', got %v", Docker, jsonMap["kind"])
	}
	if jsonMap["containerId"] != "test-container-id" {
		t.Errorf("Expected containerId 'test-container-id', got %v", jsonMap["containerId"])
	}

	// Test unmarshaling
	deserialized, err := UnmarshalJSON(data)
	if err != nil {
		t.Fatalf("Failed to unmarshal DockerConfig: %v", err)
	}

	// Type assertion
	dockerDeserialized, ok := deserialized.(*DockerConfig)
	if !ok {
		t.Fatalf("Expected *DockerConfig, got %T", deserialized)
	}

	// Verify content equality
	if dockerDeserialized.Id != dockerCfg.Id {
		t.Errorf("Expected Id '%s', got '%s'", dockerCfg.Id, dockerDeserialized.Id)
	}
	if dockerDeserialized.Kind != dockerCfg.Kind {
		t.Errorf("Expected Kind '%s', got '%s'", dockerCfg.Kind, dockerDeserialized.Kind)
	}
	if *dockerDeserialized.ContainerId != *dockerCfg.ContainerId {
		t.Errorf("Expected ContainerId '%s', got '%s'", *dockerCfg.ContainerId, *dockerDeserialized.ContainerId)
	}

	// Verify the internal config was properly unmarshaled
	if dockerDeserialized.InternalConfig == nil {
		t.Fatal("Expected InternalConfig to be unmarshaled, got nil")
	}

	internalK8s, ok := dockerDeserialized.InternalConfig.(*KubernetesConfig)
	if !ok {
		t.Fatalf("Expected internal config to be *KubernetesConfig, got %T", dockerDeserialized.InternalConfig)
	}

	// Verify internal config fields
	if internalK8s.Id != "internal-id" {
		t.Errorf("Expected internal Id '%s', got '%s'", "internal-id", internalK8s.Id)
	}
	if internalK8s.Kind != Kubernetes {
		t.Errorf("Expected internal Kind '%s', got '%s'", Kubernetes, internalK8s.Kind)
	}
	if internalK8s.Namespace != "internal-namespace" {
		t.Errorf("Expected internal Namespace '%s', got '%s'", "internal-namespace", internalK8s.Namespace)
	}
}

func TestNilContainerId(t *testing.T) {
	// Test with nil containerId to ensure omitempty works correctly
	dockerCfg := &DockerConfig{
		ContainerId: nil,
		InternalConfig: &KubernetesConfig{
			Config: Config{
				Id:   "internal-id",
				Kind: Kubernetes,
			},
		},
		Config: Config{
			Id:   "docker-id",
			Kind: Docker,
		},
	}

	data, err := dockerCfg.MarshalJSON()
	if err != nil {
		t.Fatalf("Failed to marshal DockerConfig with nil containerId: %v", err)
	}

	var jsonMap map[string]interface{}
	if err := json.Unmarshal(data, &jsonMap); err != nil {
		t.Fatalf("Failed to unmarshal JSON: %v", err)
	}

	// Verify containerId is omitted
	if _, exists := jsonMap["containerId"]; exists {
		t.Errorf("Expected containerId to be omitted, but it exists in the JSON")
	}
}
