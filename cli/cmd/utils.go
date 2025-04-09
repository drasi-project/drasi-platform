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
	"bufio"
	"context"
	"io"
	"net/http"
	"os"

	"drasi.io/cli/api"
	"github.com/spf13/cobra"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/clientcmd"
)

func loadManifests(cmd *cobra.Command, args []string) (*[]api.Manifest, error) {
	var err error
	fromFiles, _ := cmd.Flags().GetBool("files")

	var manifests []api.Manifest

	if fromFiles {
		for _, fileName := range args {
			var file []byte

			if isURL(fileName) {
				// Fetch the YAML file from the URL
				resp, err := http.Get(fileName)
				if err != nil {
					return nil, err
				}
				defer resp.Body.Close()

				// Read the YAML file contents
				file, err = io.ReadAll(resp.Body)
				if err != nil {
					return nil, err
				}
			} else {
				if file, err = os.ReadFile(fileName); err != nil {
					return nil, err
				}
			}
			var fileManifests *[]api.Manifest
			fileManifests, err = api.ReadManifests(file)
			manifests = append(manifests, *fileManifests...)
		}
	} else {
		// If the '-f' flag is not set, there are two possibilities:
		if len(args) == 2 {
			// Possibility 1: we have two arguments (e.g. drasi wait source test-source)
			manifests = append(manifests, api.Manifest{
				Kind:       args[0],
				ApiVersion: "v1",
				Name:       args[1],
				Spec:       nil,
			})
		} else {
			// Possibility 2: we have no arguments and we need to retrieve the manifests from pipe
			stat, err := os.Stdin.Stat()
			if err != nil {
				return nil, err
			}
			if (stat.Mode() & os.ModeCharDevice) == 0 {
				reader := bufio.NewReader(os.Stdin)
				pipeData, _ := io.ReadAll(reader)
				var fileManifests *[]api.Manifest
				fileManifests, err = api.ReadManifests(pipeData)
				if fileManifests != nil {
					manifests = append(manifests, *fileManifests...)
				}
			}
		}

	}
	return &manifests, nil

}

func isURL(path string) bool {
	_, err := http.Get(path)
	return err == nil
}

// Retrieve the name of all namespaces that have the label
// "drasi.io/namespace": "true"
func listNamespaces() ([]string, error) {
	configLoadingRules := clientcmd.NewDefaultClientConfigLoadingRules()
	configOverrides := &clientcmd.ConfigOverrides{}

	config := clientcmd.NewNonInteractiveDeferredLoadingClientConfig(configLoadingRules, configOverrides)

	restConfig, err := config.ClientConfig()

	if err != nil {
		return nil, err
	}

	clientset, err := kubernetes.NewForConfig(restConfig)
	if err != nil {
		return nil, err
	}

	namespaces, err := clientset.CoreV1().Namespaces().List(context.TODO(), metav1.ListOptions{
		LabelSelector: "drasi.io/namespace=true",
	})
	if err != nil {
		return nil, err
	}

	var nsList []string
	for _, ns := range namespaces.Items {
		nsList = append(nsList, ns.Name)
	}

	return nsList, nil
}
