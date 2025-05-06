package registry

import (
	"os"
	"path/filepath"
	"testing"

	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/client-go/tools/clientcmd/api"
)

// setupTestEnv sets up a temporary test environment
func setupTestEnv(t *testing.T) (string, func()) {
	// Create a temporary directory for tests
	tempDir, err := os.MkdirTemp("", "drasi-test")
	if err != nil {
		t.Fatalf("Failed to create temp directory: %v", err)
	}

	// Save original home dir and override for tests
	origHomeDir := os.Getenv("HOME")
	os.Setenv("HOME", tempDir)

	// Create the necessary directory structure
	serverDir := filepath.Join(tempDir, DrasiDir, ServersDir)
	err = os.MkdirAll(serverDir, DirPermission)
	if err != nil {
		t.Fatalf("Failed to create drasi directory: %v", err)
	}

	// Return cleanup function
	cleanup := func() {
		os.Setenv("HOME", origHomeDir)
		os.RemoveAll(tempDir)
	}

	return tempDir, cleanup
}

// createFakeKubeConfig creates a fake kube config file for testing
func createFakeKubeConfig(t *testing.T, dir, contextName string) string {
	// Create a simple kubeconfig
	config := api.NewConfig()

	// Add a context
	config.CurrentContext = contextName
	config.Contexts = map[string]*api.Context{
		contextName: {
			Cluster:  "test-cluster",
			AuthInfo: "test-user",
		},
	}
	config.Clusters = map[string]*api.Cluster{
		"test-cluster": {
			Server: "https://example.com:6443",
		},
	}
	config.AuthInfos = map[string]*api.AuthInfo{
		"test-user": {
			Username: "test",
			Password: "test-password",
		},
	}

	// Create the kubeconfig directory
	kubeDir := filepath.Join(dir, ".kube")
	err := os.MkdirAll(kubeDir, DirPermission)
	if err != nil {
		t.Fatalf("Failed to create kube directory: %v", err)
	}

	// Write the config
	configPath := filepath.Join(kubeDir, "config")
	err = clientcmd.WriteToFile(*config, configPath)
	if err != nil {
		t.Fatalf("Failed to write kubeconfig: %v", err)
	}

	// Set KUBECONFIG environment variable
	os.Setenv("KUBECONFIG", configPath)

	return configPath
}

func TestSaveKubecontextAsCurrent(t *testing.T) {
	// Set up test environment
	tempDir, cleanup := setupTestEnv(t)
	defer cleanup()

	// Create fake kubeconfig
	contextName := "test-context"
	createFakeKubeConfig(t, tempDir, contextName)

	// Test SaveKubecontextAsCurrent
	reg, err := SaveKubecontextAsCurrent()
	if err != nil {
		t.Fatalf("Failed to save kubecontext: %v", err)
	}

	// Verify the registration
	if reg.GetId() != contextName {
		t.Errorf("Expected registration ID %q, got %q", contextName, reg.GetId())
	}

	k8sConfig, ok := reg.(*KubernetesConfig)
	if !ok {
		t.Fatalf("Expected KubernetesConfig, got %T", reg)
	}

	if k8sConfig.Namespace != DefaultNamespace {
		t.Errorf("Expected namespace %q, got %q", DefaultNamespace, k8sConfig.Namespace)
	}

	// Verify the registration was saved
	exists, err := RegistrationExists(contextName)
	if err != nil {
		t.Fatalf("Failed to check if registration exists: %v", err)
	}
	if !exists {
		t.Errorf("Registration was not saved")
	}

	// Verify it was set as current
	current, err := GetCurrentRegistration()
	if err != nil {
		t.Fatalf("Failed to get current registration: %v", err)
	}
	if current != contextName {
		t.Errorf("Expected current registration %q, got %q", contextName, current)
	}
}

func TestGetCurrentKubecontextRegistration(t *testing.T) {
	// Set up test environment
	tempDir, cleanup := setupTestEnv(t)
	defer cleanup()

	// Create fake kubeconfig
	contextName := "test-context"
	createFakeKubeConfig(t, tempDir, contextName)

	// Test getCurrentKubecontextRegistration
	reg, err := getCurrentKubecontextRegistration()
	if err != nil {
		t.Fatalf("Failed to get current kubecontext registration: %v", err)
	}

	// Verify the registration
	if reg.GetId() != contextName {
		t.Errorf("Expected registration ID %q, got %q", contextName, reg.GetId())
	}

	if reg.GetKind() != Kubernetes {
		t.Errorf("Expected kind %q, got %q", Kubernetes, reg.GetKind())
	}

	k8sConfig, ok := reg.(*KubernetesConfig)
	if !ok {
		t.Fatalf("Expected KubernetesConfig, got %T", reg)
	}

	if k8sConfig.Namespace != DefaultNamespace {
		t.Errorf("Expected namespace %q, got %q", DefaultNamespace, k8sConfig.Namespace)
	}
}

func TestLoadCurrentRegistrationWithKubeContext(t *testing.T) {
	// Set up test environment
	tempDir, cleanup := setupTestEnv(t)
	defer cleanup()

	// Create fake kubeconfig
	contextName := "test-context"
	createFakeKubeConfig(t, tempDir, contextName)

	// Test LoadCurrentRegistration when no current is set
	// It should automatically save the kubecontext
	reg, err := LoadCurrentRegistration()
	if err != nil {
		t.Fatalf("Failed to load current registration: %v", err)
	}

	// Verify the registration
	if reg.GetId() != contextName {
		t.Errorf("Expected registration ID %q, got %q", contextName, reg.GetId())
	}

	// Test LoadCurrentRegistrationWithNamespace
	customNamespace := "custom-namespace"
	regWithNs, err := LoadCurrentRegistrationWithNamespace(customNamespace)
	if err != nil {
		t.Fatalf("Failed to load current registration with namespace: %v", err)
	}

	k8sConfig, ok := regWithNs.(*KubernetesConfig)
	if !ok {
		t.Fatalf("Expected KubernetesConfig, got %T", regWithNs)
	}

	if k8sConfig.Namespace != customNamespace {
		t.Errorf("Expected namespace %q, got %q", customNamespace, k8sConfig.Namespace)
	}
}
