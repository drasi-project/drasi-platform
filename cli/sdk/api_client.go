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
	"drasi.io/cli/sdk/generated"
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
	stopCh          chan struct{}
	port            int32
	client          *http.Client
	streamClient    *http.Client
	prefix          string
	generatedClient *generated.Client
}

// Ensure ApiClient implements the DrasiClient interface
var _ DrasiClient = (*ApiClient)(nil)

// resourceID returns the resource identifier, including tag if present
func resourceID(name, tag string) string {
	if tag != "" {
		return name + ":" + tag
	}
	return name
}

// applyOne handles a single Apply operation to avoid defer issues in loops
func (t *ApiClient) applyOne(ctx context.Context, mf api.Manifest, output output.TaskOutput) error {
	subject := "Apply: " + mf.Kind + "/" + mf.Name
	output.AddTask(subject, subject)

	id := resourceID(mf.Name, mf.Tag)

	// Marshal spec to JSON for the WithBody variant
	specJSON, err := json.Marshal(mf.Spec)
	if err != nil {
		output.FailTask(subject, fmt.Sprintf("Error: %v: %v", subject, err.Error()))
		return err
	}
	body := bytes.NewReader(specJSON)

	var resp *http.Response

	switch strings.ToLower(mf.Kind) {
	case "source":
		resp, err = t.generatedClient.UpsertSourceWithBody(ctx, id, "application/json", body)
	case "continuousquery", "query":
		resp, err = t.generatedClient.CreateContinuousQueryWithBody(ctx, id, "application/json", body)
	case "reaction":
		resp, err = t.generatedClient.UpsertReactionWithBody(ctx, id, "application/json", body)
	case "sourceprovider":
		resp, err = t.generatedClient.UpsertSourceProviderWithBody(ctx, id, "application/json", body)
	case "reactionprovider":
		resp, err = t.generatedClient.UpsertReactionProviderWithBody(ctx, id, "application/json", body)
	case "querycontainer":
		resp, err = t.generatedClient.UpsertQueryContainerWithBody(ctx, id, "application/json", body)
	default:
		err = fmt.Errorf("unsupported resource kind: %s", mf.Kind)
	}

	if err != nil {
		output.FailTask(subject, fmt.Sprintf("Error: %v: %v", subject, err.Error()))
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		msg := resp.Status
		if b, err := io.ReadAll(resp.Body); err == nil {
			msg += ": " + string(b)
		}
		output.FailTask(subject, fmt.Sprintf("Error: %v: %v", subject, msg))
		return errors.New(msg)
	}

	output.SucceedTask(subject, fmt.Sprintf("%v: complete", subject))
	return nil
}

// deleteOne handles a single Delete operation to avoid defer issues in loops
func (t *ApiClient) deleteOne(ctx context.Context, mf api.Manifest, output output.TaskOutput) error {
	subject := "Delete: " + mf.Kind + "/" + mf.Name
	output.AddTask(subject, subject)

	id := resourceID(mf.Name, mf.Tag)

	var resp *http.Response
	var err error

	switch strings.ToLower(mf.Kind) {
	case "source":
		resp, err = t.generatedClient.DeleteSource(ctx, id)
	case "continuousquery", "query":
		resp, err = t.generatedClient.DeleteContinuousQuery(ctx, id)
	case "reaction":
		resp, err = t.generatedClient.DeleteReaction(ctx, id)
	case "sourceprovider":
		resp, err = t.generatedClient.DeleteSourceProvider(ctx, id)
	case "reactionprovider":
		resp, err = t.generatedClient.DeleteReactionProvider(ctx, id)
	case "querycontainer":
		resp, err = t.generatedClient.DeleteQueryContainer(ctx, id)
	default:
		err = fmt.Errorf("unsupported resource kind: %s", mf.Kind)
	}

	if err != nil {
		output.FailTask(subject, fmt.Sprintf("Error: %v: %v", subject, err.Error()))
		return err
	}
	defer resp.Body.Close()

	// Successful deletion should return 204 No Content
	if resp.StatusCode != http.StatusNoContent {
		output.FailTask(subject, fmt.Sprintf("Error: %v: %v", subject, resp.Status))
		return errors.New(resp.Status)
	}

	output.SucceedTask(subject, fmt.Sprintf("%v: complete", subject))
	return nil
}

func (t *ApiClient) Apply(manifests *[]api.Manifest, output output.TaskOutput) error {
	ctx := context.Background()
	for _, mf := range *manifests {
		if err := t.applyOne(ctx, mf, output); err != nil {
			return err
		}
	}
	return nil
}

func (t *ApiClient) Delete(manifests *[]api.Manifest, output output.TaskOutput) error {
	ctx := context.Background()
	for _, mf := range *manifests {
		if err := t.deleteOne(ctx, mf, output); err != nil {
			return err
		}
	}
	return nil
}

func (t *ApiClient) GetResource(kind string, name string) (*api.Resource, error) {
	ctx := context.Background()

	var resp *http.Response
	var err error

	switch strings.ToLower(kind) {
	case "source":
		resp, err = t.generatedClient.GetSource(ctx, name)
	case "continuousquery", "query":
		resp, err = t.generatedClient.GetContinuousQuery(ctx, name)
	case "reaction":
		resp, err = t.generatedClient.GetReaction(ctx, name)
	case "sourceprovider":
		resp, err = t.generatedClient.GetSourceProvider(ctx, name)
	case "reactionprovider":
		resp, err = t.generatedClient.GetReactionProvider(ctx, name)
	case "querycontainer":
		resp, err = t.generatedClient.GetQueryContainer(ctx, name)
	default:
		return nil, fmt.Errorf("unsupported resource kind: %s", kind)
	}

	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, errors.New(resp.Status)
	}

	var result api.Resource
	if err = json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	return &result, nil
}

func (t *ApiClient) ListResources(kind string) ([]api.Resource, error) {
	ctx := context.Background()

	var resp *http.Response
	var err error

	switch strings.ToLower(kind) {
	case "source":
		resp, err = t.generatedClient.ListSources(ctx)
	case "continuousquery", "query":
		resp, err = t.generatedClient.ListContinuousQueries(ctx)
	case "reaction":
		resp, err = t.generatedClient.ListReactions(ctx)
	case "sourceprovider":
		resp, err = t.generatedClient.ListSourceProviders(ctx)
	case "reactionprovider":
		resp, err = t.generatedClient.ListReactionProviders(ctx)
	case "querycontainer":
		resp, err = t.generatedClient.ListQueryContainers(ctx)
	default:
		return nil, fmt.Errorf("unsupported resource kind: %s", kind)
	}

	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, errors.New(resp.Status)
	}

	var result []api.Resource
	if err = json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	return result, nil
}

// readyWaitOne handles a single ReadyWait operation to avoid defer issues in loops
func (t *ApiClient) readyWaitOne(ctx context.Context, mf api.Manifest, timeout int64, output output.TaskOutput) error {
	subject := "Wait " + mf.Kind + "/" + mf.Name
	output.AddTask(subject, fmt.Sprintf("Waiting for %v/%v to come online", mf.Kind, mf.Name))

	var resp *http.Response
	var err error

	switch strings.ToLower(mf.Kind) {
	case "source":
		params := &generated.ReadyWaitSourceParams{Timeout: &timeout}
		resp, err = t.generatedClient.ReadyWaitSource(ctx, mf.Name, params)
	case "continuousquery", "query":
		params := &generated.ReadyWaitQueryParams{Timeout: &timeout}
		resp, err = t.generatedClient.ReadyWaitQuery(ctx, mf.Name, params)
	case "reaction":
		params := &generated.ReadyWaitReactionParams{Timeout: &timeout}
		resp, err = t.generatedClient.ReadyWaitReaction(ctx, mf.Name, params)
	case "querycontainer":
		params := &generated.ReadyWaitQueryContainerParams{Timeout: &timeout}
		resp, err = t.generatedClient.ReadyWaitQueryContainer(ctx, mf.Name, params)
	default:
		err = fmt.Errorf("unsupported resource kind for ready-wait: %s", mf.Kind)
	}

	if err != nil {
		output.FailTask(subject, fmt.Sprintf("Error: %v: %v", subject, err.Error()))
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		output.FailTask(subject, fmt.Sprintf("Error: %v: %v", subject, resp.Status))
		return errors.New(resp.Status)
	}

	output.SucceedTask(subject, fmt.Sprintf("%v online", subject))
	return nil
}

func (t *ApiClient) ReadyWait(manifests *[]api.Manifest, timeout int32, output output.TaskOutput) error {
	// Set a longer HTTP client timeout to accommodate the server-side wait
	oldTimeout := t.client.Timeout
	t.client.Timeout = time.Second * time.Duration(timeout+10)
	defer func() { t.client.Timeout = oldTimeout }()

	ctx := context.Background()
	timeout64 := int64(timeout)

	for _, mf := range *manifests {
		if err := t.readyWaitOne(ctx, mf, timeout64, output); err != nil {
			return err
		}
	}
	return nil
}

func (t *ApiClient) Watch(kind string, name string, output chan map[string]interface{}, initErr chan error) {
	defer close(output)

	// Watch is only supported for continuous queries
	if strings.ToLower(kind) != "continuousquery" && strings.ToLower(kind) != "query" {
		initErr <- fmt.Errorf("watch is only supported for continuous queries, not %s", kind)
		return
	}

	ctx := context.Background()

	// Use the stream client which has no timeout
	// We need to use the generated client but with our stream client
	streamGenClient, err := generated.NewClient(t.prefix, generated.WithHTTPClient(t.streamClient))
	if err != nil {
		initErr <- err
		return
	}

	resp, err := streamGenClient.WatchContinuousQuery(ctx, name)
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

	// Decode opening bracket for JSON array
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
