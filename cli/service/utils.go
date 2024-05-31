package service

import (
	"context"
	"encoding/json"
	"os"
	"os/user"
	"path"
	"path/filepath"

	rbacv1 "k8s.io/api/rbac/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/client-go/util/homedir"
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

func configureResourceProviderRole(namespace string) error {
	home := homedir.HomeDir()
	kubeconfig := filepath.Join(home, ".kube", "config")

	restConfig, err := clientcmd.BuildConfigFromFlags("", kubeconfig)
	if err != nil {
		panic(err.Error())
	}

	// create the clientset
	clientSet, err := kubernetes.NewForConfig(restConfig)
	if err != nil {
		return err
	}

	// Create the necessary cluster role for the resource provider
	// The resource provider might not be in the same ns as the ns that the resources (source, reaction and etc.)
	// are created in. In order to create and view the deployments, we need to create a cluster role and a role binding
	clusterRole := &rbacv1.ClusterRole{
		ObjectMeta: metav1.ObjectMeta{
			Name: "deployment-reader",
		},
		Rules: []rbacv1.PolicyRule{
			{
				APIGroups: []string{"apps"}, // Core API group
				Resources: []string{"deployments"},
				Verbs:     []string{"get", "list", "wait", "logs", "watch", "delete", "create"},
			},
		},
	}

	clusterRole, err = clientSet.RbacV1().ClusterRoles().Create(context.TODO(), clusterRole, metav1.CreateOptions{})
	if err != nil {
		return err
	}

	// Define the ClusterRoleBinding
	clusterRoleBinding := &rbacv1.ClusterRoleBinding{
		ObjectMeta: metav1.ObjectMeta{
			Name: "deployment-reader-binding",
		},
		Subjects: []rbacv1.Subject{
			{
				Kind:      "ServiceAccount",
				Name:      "drasi-resource-provider",
				Namespace: namespace,
			},
		},
		RoleRef: rbacv1.RoleRef{
			Kind: "ClusterRole",
			Name: "deployment-reader",
		},
	}
	_, err = clientSet.RbacV1().ClusterRoleBindings().Create(context.TODO(), clusterRoleBinding, metav1.CreateOptions{})
	if err != nil {
		return err
	}

	return nil
}
