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
	"context"
	"fmt"
	"time"

	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/clientcmd"
)

func UninstallDrasi(namespace string) error {
	configLoadingRules := clientcmd.NewDefaultClientConfigLoadingRules()
	configOverrides := &clientcmd.ConfigOverrides{}

	config := clientcmd.NewNonInteractiveDeferredLoadingClientConfig(configLoadingRules, configOverrides)

	restConfig, err := config.ClientConfig()

	if err != nil {
		return err
	}

	clientset, err := kubernetes.NewForConfig(restConfig)
	if err != nil {
		return err
	}

	err = clientset.CoreV1().Namespaces().Delete(context.TODO(), namespace, metav1.DeleteOptions{})
	if err != nil {
		return err
	}

	// Pods are not deleted immediately; instead, they will remain in a Terminating state for a while
	// Need to verify that all resources have been deleted; if not, wait for them to be deleted
	nsDeleted := false
	for !nsDeleted {
		list, err := clientset.CoreV1().Namespaces().List(context.TODO(), metav1.ListOptions{})
		if err != nil {
			return err
		}
		for _, ns := range list.Items {
			// check if the namespace is still there
			if ns.Name == namespace {
				fmt.Println("Namespace is still present. Waiting for it to be deleted")
				// wait for 10 seconds
				time.Sleep(10 * time.Second)
			} else {
				nsDeleted = true
			}
		}
	}

	return nil
}

func UninstallDapr(namespace string) error {
	configLoadingRules := clientcmd.NewDefaultClientConfigLoadingRules()
	configOverrides := &clientcmd.ConfigOverrides{}

	config := clientcmd.NewNonInteractiveDeferredLoadingClientConfig(configLoadingRules, configOverrides)

	restConfig, err := config.ClientConfig()

	if err != nil {
		return err
	}

	clientset, err := kubernetes.NewForConfig(restConfig)
	if err != nil {
		return err
	}

	err = clientset.CoreV1().Namespaces().Delete(context.TODO(), "dapr-system", metav1.DeleteOptions{})
	if err != nil {
		return err
	}

	nsDeleted := false
	for !nsDeleted {
		list, err := clientset.CoreV1().Namespaces().List(context.TODO(), metav1.ListOptions{})
		if err != nil {
			return err
		}
		for _, ns := range list.Items {
			// check if the namespace is still there
			if ns.Name == "dapr-system" {
				fmt.Println("dapr-system namespace is still present. Waiting for it to be deleted")
				// wait for 10 seconds
				time.Sleep(10 * time.Second)
			} else {
				nsDeleted = true
			}
		}
	}

	return nil
}
