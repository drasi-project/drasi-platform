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
	"bytes"
	"context"
	"drasi.io/cli/service/output"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"drasi.io/cli/api"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/client-go/tools/portforward"
	"k8s.io/client-go/transport/spdy"
)

func MakeApiClient(namespace string) (*apiClient, error) {
	result := apiClient{
		port:   9083,
		stopCh: make(chan struct{}, 1),
	}
	if err := result.init(namespace); err != nil {
		return nil, err
	}

	err := result.createTunnel()
	if err != nil {
		return nil, err
	}

	result.prefix = fmt.Sprintf("http://localhost:%d", result.port)
	result.client = &http.Client{
		Timeout: 30 * time.Second,
	}

	return &result, nil
}

type apiClient struct {
	kubeClient    *kubernetes.Clientset
	kubeConfig    *rest.Config
	kubeNamespace string
	stopCh        chan struct{}
	port          int32
	client        *http.Client
	prefix        string
}

func (t *apiClient) init(namespace string) error {
	configLoadingRules := clientcmd.NewDefaultClientConfigLoadingRules()
	configOverrides := &clientcmd.ConfigOverrides{}

	config := clientcmd.NewNonInteractiveDeferredLoadingClientConfig(configLoadingRules, configOverrides)

	restConfig, err := config.ClientConfig()

	if err != nil {
		return err
	}
	if namespace != "" {
		t.kubeNamespace = namespace
	} else {
		cfg := readConfig()
		t.kubeNamespace = cfg.DrasiNamespace
	}

	// create the clientset
	t.kubeClient, err = kubernetes.NewForConfig(restConfig)
	if err != nil {
		return err
	}

	t.kubeConfig = restConfig

	return nil
}

func (t *apiClient) createTunnel() error {
	podName, err := t.getApiPodName()
	if err != nil {
		return err
	}

	namespace := t.kubeNamespace
	proxyURL := &url.URL{
		Scheme: "https",
		Path:   fmt.Sprintf("/api/v1/namespaces/%s/pods/%s/portforward", namespace, podName),
		Host:   strings.TrimPrefix(t.kubeConfig.Host, "https://"),
	}

	transport, upgrader, err := spdy.RoundTripperFor(t.kubeConfig)
	if err != nil {
		return err
	}

	dialer := spdy.NewDialer(upgrader, &http.Client{Transport: transport}, http.MethodPost, proxyURL)

	readyCh := make(chan struct{})

	sigs := make(chan os.Signal, 1)
	signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM)
	go func() {
		<-sigs
		close(t.stopCh)
	}()

	pf, err := portforward.New(dialer, []string{fmt.Sprintf("%d:%d", t.port, 8080)}, t.stopCh, readyCh, nil, os.Stderr)
	if err != nil {
		return err
	}

	go func() {
		err = pf.ForwardPorts()
		if err != nil {
			panic(err)
		}
	}()

	<-readyCh

	return nil
}

func (t *apiClient) getApiPodName() (string, error) {
	namespace := t.kubeNamespace
	ep, err := t.kubeClient.CoreV1().Endpoints(namespace).Get(context.TODO(), "drasi-api", v1.GetOptions{})
	if err != nil {
		return "", err
	}

	for _, subset := range ep.Subsets {
		for _, addr := range subset.Addresses {
			if addr.TargetRef.Kind == "Pod" {
				return addr.TargetRef.Name, nil
			}
		}
	}
	return "", errors.New("drasi API not available")
}

func (t *apiClient) Apply(manifests *[]api.Manifest, output output.TaskOutput) error {
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
	}
	return nil
}

func (t *apiClient) Delete(manifests *[]api.Manifest, output output.TaskOutput) error {
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

func (t *apiClient) GetResource(kind string, name string) (*api.Resource, error) {
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

func (t *apiClient) ListResources(kind string) ([]api.Resource, error) {
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

func (t *apiClient) ReadyWait(manifests *[]api.Manifest, timeout int32, output output.TaskOutput) error {
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

func (t *apiClient) Close() {
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
