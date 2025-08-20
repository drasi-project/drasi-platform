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

package sdk

import (
	"bytes"
	"context"
	"drasi.io/cli/output"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"time"

	"drasi.io/cli/api"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/clientcmd"
)

type ApiClient struct {
	stopCh       chan struct{}
	port         int32
	client       *http.Client
	streamClient *http.Client
	prefix       string
}

func (t *ApiClient) Apply(manifests *[]api.Manifest, output output.TaskOutput) error {
	for _, mf := range *manifests {
		subject := "Apply: " + mf.Kind + "/" + mf.Name
		output.AddTask(subject, subject)

		url := fmt.Sprintf("%v/%v/%v/%v", t.prefix, mf.ApiVersion, kindRoutes[strings.ToLower(mf.Kind)], mf.Name)

		if mf.Tag != "" {
			url = fmt.Sprintf("%v/%v/%v/%v", t.prefix, mf.ApiVersion, kindRoutes[strings.ToLower(mf.Kind)], mf.Name+":"+mf.Tag)
		}
		data, err := json.Marshal(mf.Spec)
		if err != nil {
			output.FailTask(subject, fmt.Sprintf("Error: %v: %v", subject, err.Error()))
			return err
		}

		req, err := http.NewRequest(http.MethodPut, url, bytes.NewReader(data))
		if err != nil {
			output.FailTask(subject, fmt.Sprintf("Error: %v: %v", subject, err.Error()))
			return err
		}

		req.Header.Set("Content-Type", "application/json")
		if mf.ApiVersion != "" {
			req.Header.Set("api-version", mf.ApiVersion)
		}

		resp, err := t.client.Do(req)
		if err != nil {
			output.FailTask(subject, fmt.Sprintf("Error: %v: %v", subject, err.Error()))
			return err
		}

		if resp.StatusCode != http.StatusOK {
			msg := resp.Status

			// Adding a space before the response body for better readability
			msg += " "

			if b, err := io.ReadAll(resp.Body); err == nil {
				msg += ": " + string(b)
			}

			output.FailTask(subject, fmt.Sprintf("Error: %v: %v", subject, msg))
			return errors.New(msg)
		}

		output.SucceedTask(subject, fmt.Sprintf("%v: complete", subject))

		if strings.ToLower(mf.Kind) == "reaction" || strings.ToLower(mf.Kind) == "source" {
			t.displayIngressInfo(mf.Name, mf.Spec, output)
		}
	}
	return nil
}

func (t *ApiClient) Delete(manifests *[]api.Manifest, output output.TaskOutput) error {
	for _, mf := range *manifests {
		subject := "Delete: " + mf.Kind + "/" + mf.Name
		output.AddTask(subject, subject)

		url := fmt.Sprintf("%v/%v/%v/%v", t.prefix, mf.ApiVersion, kindRoutes[strings.ToLower(mf.Kind)], mf.Name)

		if mf.Tag != "" {
			url = fmt.Sprintf("%v/%v/%v/%v", t.prefix, mf.ApiVersion, kindRoutes[strings.ToLower(mf.Kind)], mf.Name+":"+mf.Tag)
		}
		req, err := http.NewRequest(http.MethodDelete, url, bytes.NewReader([]byte{}))
		if err != nil {
			output.FailTask(subject, fmt.Sprintf("Error: %v: %v", subject, err.Error()))
			return err
		}

		resp, err := t.client.Do(req)
		if err != nil {
			output.FailTask(subject, fmt.Sprintf("Error: %v: %v", subject, err.Error()))
			return err
		}

		// Successful deletion should return 204 No Content
		if resp.StatusCode != http.StatusNoContent {
			output.FailTask(subject, fmt.Sprintf("Error: %v: %v", subject, resp.Status))
			return errors.New(resp.Status)
		}

		output.SucceedTask(subject, fmt.Sprintf("%v: complete", subject))
	}
	return nil
}

func (t *ApiClient) GetResource(kind string, name string) (*api.Resource, error) {
	var result api.Resource

	url := fmt.Sprintf("%v/%v/%v/%v", t.prefix, "v1", kindRoutes[strings.ToLower(kind)], name)
	resp, err := t.client.Get(url)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, errors.New(resp.Status)
	}

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if err = json.Unmarshal(data, &result); err != nil {
		return nil, err
	}

	return &result, err
}

func (t *ApiClient) ListResources(kind string) ([]api.Resource, error) {
	var result []api.Resource

	url := fmt.Sprintf("%v/%v/%v", t.prefix, "v1", kindRoutes[strings.ToLower(kind)])
	resp, err := t.client.Get(url)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, errors.New(resp.Status)
	}

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if err = json.Unmarshal(data, &result); err != nil {
		return nil, err
	}

	return result, err
}

func (t *ApiClient) ReadyWait(manifests *[]api.Manifest, timeout int32, output output.TaskOutput) error {
	oldTimeout := t.client.Timeout
	t.client.Timeout = time.Second * time.Duration(timeout+1)
	defer func() { t.client.Timeout = oldTimeout }()

	for _, mf := range *manifests {
		subject := "Wait " + mf.Kind + "/" + mf.Name

		output.AddTask(subject, fmt.Sprintf("Waiting for %v/%v to come online", mf.Kind, mf.Name))

		url := fmt.Sprintf("%v/%v/%v/%v/ready-wait?timeout=%v", t.prefix, mf.ApiVersion, kindRoutes[strings.ToLower(mf.Kind)], mf.Name, timeout)

		req, err := http.NewRequest(http.MethodGet, url, bytes.NewReader([]byte{}))
		if err != nil {
			output.FailTask(subject, fmt.Sprintf("Error: %v: %v", subject, err.Error()))
			return err
		}

		resp, err := t.client.Do(req)
		if err != nil {
			output.FailTask(subject, fmt.Sprintf("Error: %v: %v", subject, err.Error()))
			return err
		}

		if resp.StatusCode != http.StatusOK {
			output.FailTask(subject, fmt.Sprintf("Error: %v: %v", subject, resp.Status))
			return errors.New(resp.Status)
		}

		output.SucceedTask(subject, fmt.Sprintf("%v online", subject))
	}
	return nil
}

func (t *ApiClient) Watch(kind string, name string, output chan map[string]interface{}, initErr chan error) {
	defer close(output)
	url := fmt.Sprintf("%v/%v/%v/%v/watch", t.prefix, "v1", kindRoutes[kind], name)
	resp, err := t.streamClient.Get(url)
	if err != nil {
		initErr <- err
		return
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		initErr <- errors.New(resp.Status)
		return
	}

	decoder := json.NewDecoder(resp.Body)

	if _, err := decoder.Token(); err != nil {
		initErr <- err
		return
	}

	initErr <- nil

	// Iterate through each element in the JSON array
	for decoder.More() {
		var item map[string]interface{}
		if err := decoder.Decode(&item); err != nil {
			log.Fatal(err)
			return
		}
		output <- item
	}

	// Decode the closing bracket for the array `]`
	if _, err := decoder.Token(); err != nil {
		log.Fatal(err)
	}
}

func (t *ApiClient) displayIngressInfo(reactionName string, spec interface{}, output output.TaskOutput) {
	specMap, ok := spec.(map[string]interface{})
	if !ok {
		return
	}

	services, ok := specMap["services"].(map[string]interface{})
	if !ok {
		return
	}

	var hasExternalEndpoint bool
	for _, serviceData := range services {
		serviceMap, ok := serviceData.(map[string]interface{})
		if !ok {
			continue
		}

		endpoints, ok := serviceMap["endpoints"].(map[string]interface{})
		if !ok {
			continue
		}

		for _, endpointData := range endpoints {
			endpointMap, ok := endpointData.(map[string]interface{})
			if !ok {
				continue
			}

			setting, ok := endpointMap["setting"].(string)
			if ok && strings.ToLower(setting) == "external" {
				hasExternalEndpoint = true
				break
			}
		}
		if hasExternalEndpoint {
			break
		}
	}

	if hasExternalEndpoint {
		// Get the ingress controller LoadBalancer IP
		ip := t.getIngressExternalIP()
		ingressUrl := fmt.Sprintf("http://%s.drasi.%s.nip.io", reactionName, ip)
		output.InfoMessage(fmt.Sprintf("Ingress URL: %s", ingressUrl))
	}
}

func (t *ApiClient) getIngressExternalIP() string {
	loadingRules := clientcmd.NewDefaultClientConfigLoadingRules()
	configOverrides := &clientcmd.ConfigOverrides{}
	kubeConfig := clientcmd.NewNonInteractiveDeferredLoadingClientConfig(loadingRules, configOverrides)

	config, err := kubeConfig.ClientConfig()
	if err != nil {
		return ""
	}

	// Create Kubernetes client
	clientset, err := kubernetes.NewForConfig(config)
	if err != nil {
		return ""
	}

	configMap, err := clientset.CoreV1().ConfigMaps("drasi-system").Get(context.Background(), "drasi-config", metav1.GetOptions{})
	if err == nil && configMap.Data != nil {
		// Check if AGIC is configured
		if ingressType, exists := configMap.Data["INGRESS_TYPE"]; exists && ingressType == "agic" {
			// For AGIC, return the configured gateway IP directly
			if gatewayIP, exists := configMap.Data["AGIC_GATEWAY_IP"]; exists && gatewayIP != "" {
				return gatewayIP
			}
		}

		// For traditional ingress controllers, use LoadBalancer service discovery
		ingressService := "contour-envoy"    // default
		ingressNamespace := "projectcontour" // default

		if service, exists := configMap.Data["INGRESS_LOAD_BALANCER_SERVICE"]; exists && service != "" {
			ingressService = service
		}
		if namespace, exists := configMap.Data["INGRESS_LOAD_BALANCER_NAMESPACE"]; exists && namespace != "" {
			ingressNamespace = namespace
		}

		service, err := clientset.CoreV1().Services(ingressNamespace).Get(context.Background(), ingressService, metav1.GetOptions{})
		if err != nil {
			return ""
		}

		// Extract LoadBalancer IP
		if service.Status.LoadBalancer.Ingress != nil && len(service.Status.LoadBalancer.Ingress) > 0 {
			if service.Status.LoadBalancer.Ingress[0].IP != "" {
				return service.Status.LoadBalancer.Ingress[0].IP
			}
			if service.Status.LoadBalancer.Ingress[0].Hostname != "" {
				return service.Status.LoadBalancer.Ingress[0].Hostname
			}
		}
	}

	return ""
}

func (t *ApiClient) Close() {
	close(t.stopCh)
}

type StatusUpdate struct {
	Subject string
	Message string
	Success bool
}

var kindRoutes = map[string]string{
	"continuousquery":  "continuousQueries",
	"query":            "continuousQueries",
	"querycontainer":   "queryContainers",
	"reaction":         "reactions",
	"reactionprovider": "reactionProviders",
	"source":           "sources",
	"sourceprovider":   "sourceProviders",
}

func init() {
	for k, v := range kindRoutes {
		kindRoutes[strings.ToLower(k)] = v
	}
}
