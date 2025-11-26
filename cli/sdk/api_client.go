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
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"time"

	"drasi.io/cli/api"
	"drasi.io/cli/output"
)

// DrasiClient defines the interface for interacting with the Drasi Management API.
type DrasiClient interface {
	Apply(manifests *[]api.Manifest, output output.TaskOutput) error
	Delete(manifests *[]api.Manifest, output output.TaskOutput) error
	GetResource(kind string, name string) (*api.Resource, error)
	ListResources(kind string) ([]api.Resource, error)
	ReadyWait(manifests *[]api.Manifest, timeout int32, output output.TaskOutput) error
	Watch(kind string, name string, output chan map[string]interface{}, initErr chan error)
	Close()
}

type ApiClient struct {
	stopCh       chan struct{}
	port         int32
	client       *http.Client
	streamClient *http.Client
	prefix       string
}

// Ensure ApiClient implements the new interface
var _ DrasiClient = (*ApiClient)(nil)

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
