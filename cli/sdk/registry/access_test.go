package registry

import (
	"os"
	"path/filepath"
	"testing"
)

func TestRegistrationLifecycle(t *testing.T) {
	// Set up test environment
	_, cleanup := setupTestEnv(t)
	defer cleanup()

	// Create a test registration
	testName := "test-registration"
	testReg := &KubernetesConfig{
		Namespace:  "test-namespace",
		KubeConfig: []byte("test-kubeconfig"),
		Config: Config{
			Id:   testName,
			Kind: Kubernetes,
		},
	}

	// Test SaveRegistration
	err := SaveRegistration(testName, testReg)
	if err != nil {
		t.Fatalf("Failed to save registration: %v", err)
	}

	// Test RegistrationExists
	exists, err := RegistrationExists(testName)
	if err != nil {
		t.Fatalf("Failed to check if registration exists: %v", err)
	}
	if !exists {
		t.Errorf("Expected registration to exist, but it doesn't")
	}

	// Test LoadRegistration
	loadedReg, err := LoadRegistration(testName)
	if err != nil {
		t.Fatalf("Failed to load registration: %v", err)
	}

	k8sConfig, ok := loadedReg.(*KubernetesConfig)
	if !ok {
		t.Fatalf("Expected KubernetesConfig, got %T", loadedReg)
	}
	if k8sConfig.Id != testName {
		t.Errorf("Expected ID %q, got %q", testName, k8sConfig.Id)
	}
	if k8sConfig.Namespace != "test-namespace" {
		t.Errorf("Expected namespace %q, got %q", "test-namespace", k8sConfig.Namespace)
	}

	// Test SetCurrentRegistration
	err = SetCurrentRegistration(testName)
	if err != nil {
		t.Fatalf("Failed to set current registration: %v", err)
	}

	currentName, err := GetCurrentRegistration()
	if err != nil {
		t.Fatalf("Failed to get current registration: %v", err)
	}
	if currentName != testName {
		t.Errorf("Expected current registration %q, got %q", testName, currentName)
	}

	// Test ListRegistrations
	regs, err := ListRegistrations()
	if err != nil {
		t.Fatalf("Failed to list registrations: %v", err)
	}
	if len(regs) != 1 {
		t.Errorf("Expected 1 registration, got %d", len(regs))
	}
	if regs[0].GetId() != testName {
		t.Errorf("Expected registration ID %q, got %q", testName, regs[0].GetId())
	}

	// Test DeleteRegistration
	err = DeleteRegistration(testName)
	if err != nil {
		t.Fatalf("Failed to delete registration: %v", err)
	}

	// Verify it was deleted
	exists, err = RegistrationExists(testName)
	if err != nil {
		t.Fatalf("Failed to check if registration exists: %v", err)
	}
	if exists {
		t.Errorf("Expected registration to be deleted, but it still exists")
	}

	// Verify current was unset
	currentName, err = GetCurrentRegistration()
	if err != nil {
		t.Fatalf("Failed to get current registration: %v", err)
	}
	if currentName != "" {
		t.Errorf("Expected current registration to be empty, got %q", currentName)
	}
}

func TestEmptyCurrentRegistration(t *testing.T) {
	// Set up test environment
	tempDir, cleanup := setupTestEnv(t)
	defer cleanup()

	// Create the basic drasi directory structure
	err := os.MkdirAll(filepath.Join(tempDir, DrasiDir), DirPermission)
	if err != nil {
		t.Fatalf("Failed to create drasi directory: %v", err)
	}

	// Test when there is no current registration file
	current, err := GetCurrentRegistration()
	if err != nil {
		t.Fatalf("Failed to get current registration: %v", err)
	}
	if current != "" {
		t.Errorf("Expected empty current registration, got %q", current)
	}

	// Test unset when there's nothing to unset
	err = UnsetCurrentRegistration()
	if err == nil {
		t.Errorf("Expected error when unsetting non-existent current registration")
	}
}
