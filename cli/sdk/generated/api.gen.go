// Package generated provides a generated OpenAPI client for the Drasi Management API
// This is a simplified implementation that demonstrates the expected interface
package generated

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
)

// ClientOption is a function that modifies the client configuration
type ClientOption func(*Client) error

// Client is the OpenAPI client
type Client struct {
	Server string
	Client *http.Client
}

// ClientWithResponses wraps the Client with response handling
type ClientWithResponses struct {
	*Client
}

// WithHTTPClient sets a custom HTTP client
func WithHTTPClient(httpClient *http.Client) ClientOption {
	return func(c *Client) error {
		c.Client = httpClient
		return nil
	}
}

// NewClient creates a new Client with the given server URL
func NewClient(server string, opts ...ClientOption) (*Client, error) {
	c := &Client{
		Server: server,
		Client: http.DefaultClient,
	}

	for _, opt := range opts {
		if err := opt(c); err != nil {
			return nil, err
		}
	}

	return c, nil
}

// NewClientWithResponses creates a new ClientWithResponses with the given server URL
func NewClientWithResponses(server string, opts ...ClientOption) (*ClientWithResponses, error) {
	client, err := NewClient(server, opts...)
	if err != nil {
		return nil, err
	}

	return &ClientWithResponses{Client: client}, nil
}

// Helper function to create a request
func (c *Client) newRequest(ctx context.Context, method, path string, body interface{}) (*http.Request, error) {
	url := c.Server + path
	var reqBody []byte
	var err error

	if body != nil {
		reqBody, err = json.Marshal(body)
		if err != nil {
			return nil, err
		}
	}

	req, err := http.NewRequestWithContext(ctx, method, url, bytes.NewReader(reqBody))
	if err != nil {
		return nil, err
	}

	if body != nil {
		req.Header.Set("Content-Type", "application/json")
	}

	return req, nil
}

// Source operations

// PutSourceJSONRequestBody is the request body for PutSource
type PutSourceJSONRequestBody interface{}

// PutSource creates or updates a source
func (c *ClientWithResponses) PutSource(ctx context.Context, id string, body PutSourceJSONRequestBody) (*http.Response, error) {
	path := fmt.Sprintf("/v1/sources/%s", id)
	req, err := c.newRequest(ctx, http.MethodPut, path, body)
	if err != nil {
		return nil, err
	}
	return c.Client.Client.Do(req)
}

// GetSource retrieves a source
func (c *ClientWithResponses) GetSource(ctx context.Context, id string) (*http.Response, error) {
	path := fmt.Sprintf("/v1/sources/%s", id)
	req, err := c.newRequest(ctx, http.MethodGet, path, nil)
	if err != nil {
		return nil, err
	}
	return c.Client.Client.Do(req)
}

// DeleteSource deletes a source
func (c *ClientWithResponses) DeleteSource(ctx context.Context, id string) (*http.Response, error) {
	path := fmt.Sprintf("/v1/sources/%s", id)
	req, err := c.newRequest(ctx, http.MethodDelete, path, nil)
	if err != nil {
		return nil, err
	}
	return c.Client.Client.Do(req)
}

// ListSources lists all sources
func (c *ClientWithResponses) ListSources(ctx context.Context) (*http.Response, error) {
	path := "/v1/sources"
	req, err := c.newRequest(ctx, http.MethodGet, path, nil)
	if err != nil {
		return nil, err
	}
	return c.Client.Client.Do(req)
}

// ContinuousQuery operations

// PutContinuousQueryJSONRequestBody is the request body for PutContinuousQuery
type PutContinuousQueryJSONRequestBody interface{}

// PutContinuousQuery creates or updates a continuous query
func (c *ClientWithResponses) PutContinuousQuery(ctx context.Context, id string, body PutContinuousQueryJSONRequestBody) (*http.Response, error) {
	path := fmt.Sprintf("/v1/continuousQueries/%s", id)
	req, err := c.newRequest(ctx, http.MethodPut, path, body)
	if err != nil {
		return nil, err
	}
	return c.Client.Client.Do(req)
}

// GetContinuousQuery retrieves a continuous query
func (c *ClientWithResponses) GetContinuousQuery(ctx context.Context, id string) (*http.Response, error) {
	path := fmt.Sprintf("/v1/continuousQueries/%s", id)
	req, err := c.newRequest(ctx, http.MethodGet, path, nil)
	if err != nil {
		return nil, err
	}
	return c.Client.Client.Do(req)
}

// DeleteContinuousQuery deletes a continuous query
func (c *ClientWithResponses) DeleteContinuousQuery(ctx context.Context, id string) (*http.Response, error) {
	path := fmt.Sprintf("/v1/continuousQueries/%s", id)
	req, err := c.newRequest(ctx, http.MethodDelete, path, nil)
	if err != nil {
		return nil, err
	}
	return c.Client.Client.Do(req)
}

// ListContinuousQueries lists all continuous queries
func (c *ClientWithResponses) ListContinuousQueries(ctx context.Context) (*http.Response, error) {
	path := "/v1/continuousQueries"
	req, err := c.newRequest(ctx, http.MethodGet, path, nil)
	if err != nil {
		return nil, err
	}
	return c.Client.Client.Do(req)
}

// Reaction operations

// PutReactionJSONRequestBody is the request body for PutReaction
type PutReactionJSONRequestBody interface{}

// PutReaction creates or updates a reaction
func (c *ClientWithResponses) PutReaction(ctx context.Context, id string, body PutReactionJSONRequestBody) (*http.Response, error) {
	path := fmt.Sprintf("/v1/reactions/%s", id)
	req, err := c.newRequest(ctx, http.MethodPut, path, body)
	if err != nil {
		return nil, err
	}
	return c.Client.Client.Do(req)
}

// GetReaction retrieves a reaction
func (c *ClientWithResponses) GetReaction(ctx context.Context, id string) (*http.Response, error) {
	path := fmt.Sprintf("/v1/reactions/%s", id)
	req, err := c.newRequest(ctx, http.MethodGet, path, nil)
	if err != nil {
		return nil, err
	}
	return c.Client.Client.Do(req)
}

// DeleteReaction deletes a reaction
func (c *ClientWithResponses) DeleteReaction(ctx context.Context, id string) (*http.Response, error) {
	path := fmt.Sprintf("/v1/reactions/%s", id)
	req, err := c.newRequest(ctx, http.MethodDelete, path, nil)
	if err != nil {
		return nil, err
	}
	return c.Client.Client.Do(req)
}

// ListReactions lists all reactions
func (c *ClientWithResponses) ListReactions(ctx context.Context) (*http.Response, error) {
	path := "/v1/reactions"
	req, err := c.newRequest(ctx, http.MethodGet, path, nil)
	if err != nil {
		return nil, err
	}
	return c.Client.Client.Do(req)
}

// QueryContainer operations

// PutQueryContainerJSONRequestBody is the request body for PutQueryContainer
type PutQueryContainerJSONRequestBody interface{}

// PutQueryContainer creates or updates a query container
func (c *ClientWithResponses) PutQueryContainer(ctx context.Context, id string, body PutQueryContainerJSONRequestBody) (*http.Response, error) {
	path := fmt.Sprintf("/v1/queryContainers/%s", id)
	req, err := c.newRequest(ctx, http.MethodPut, path, body)
	if err != nil {
		return nil, err
	}
	return c.Client.Client.Do(req)
}

// GetQueryContainer retrieves a query container
func (c *ClientWithResponses) GetQueryContainer(ctx context.Context, id string) (*http.Response, error) {
	path := fmt.Sprintf("/v1/queryContainers/%s", id)
	req, err := c.newRequest(ctx, http.MethodGet, path, nil)
	if err != nil {
		return nil, err
	}
	return c.Client.Client.Do(req)
}

// DeleteQueryContainer deletes a query container
func (c *ClientWithResponses) DeleteQueryContainer(ctx context.Context, id string) (*http.Response, error) {
	path := fmt.Sprintf("/v1/queryContainers/%s", id)
	req, err := c.newRequest(ctx, http.MethodDelete, path, nil)
	if err != nil {
		return nil, err
	}
	return c.Client.Client.Do(req)
}

// ListQueryContainers lists all query containers
func (c *ClientWithResponses) ListQueryContainers(ctx context.Context) (*http.Response, error) {
	path := "/v1/queryContainers"
	req, err := c.newRequest(ctx, http.MethodGet, path, nil)
	if err != nil {
		return nil, err
	}
	return c.Client.Client.Do(req)
}

// SourceProvider operations

// PutSourceProviderJSONRequestBody is the request body for PutSourceProvider
type PutSourceProviderJSONRequestBody interface{}

// PutSourceProvider creates or updates a source provider
func (c *ClientWithResponses) PutSourceProvider(ctx context.Context, id string, body PutSourceProviderJSONRequestBody) (*http.Response, error) {
	path := fmt.Sprintf("/v1/sourceProviders/%s", id)
	req, err := c.newRequest(ctx, http.MethodPut, path, body)
	if err != nil {
		return nil, err
	}
	return c.Client.Client.Do(req)
}

// GetSourceProvider retrieves a source provider
func (c *ClientWithResponses) GetSourceProvider(ctx context.Context, id string) (*http.Response, error) {
	path := fmt.Sprintf("/v1/sourceProviders/%s", id)
	req, err := c.newRequest(ctx, http.MethodGet, path, nil)
	if err != nil {
		return nil, err
	}
	return c.Client.Client.Do(req)
}

// DeleteSourceProvider deletes a source provider
func (c *ClientWithResponses) DeleteSourceProvider(ctx context.Context, id string) (*http.Response, error) {
	path := fmt.Sprintf("/v1/sourceProviders/%s", id)
	req, err := c.newRequest(ctx, http.MethodDelete, path, nil)
	if err != nil {
		return nil, err
	}
	return c.Client.Client.Do(req)
}

// ListSourceProviders lists all source providers
func (c *ClientWithResponses) ListSourceProviders(ctx context.Context) (*http.Response, error) {
	path := "/v1/sourceProviders"
	req, err := c.newRequest(ctx, http.MethodGet, path, nil)
	if err != nil {
		return nil, err
	}
	return c.Client.Client.Do(req)
}

// ReactionProvider operations

// PutReactionProviderJSONRequestBody is the request body for PutReactionProvider
type PutReactionProviderJSONRequestBody interface{}

// PutReactionProvider creates or updates a reaction provider
func (c *ClientWithResponses) PutReactionProvider(ctx context.Context, id string, body PutReactionProviderJSONRequestBody) (*http.Response, error) {
	path := fmt.Sprintf("/v1/reactionProviders/%s", id)
	req, err := c.newRequest(ctx, http.MethodPut, path, body)
	if err != nil {
		return nil, err
	}
	return c.Client.Client.Do(req)
}

// GetReactionProvider retrieves a reaction provider
func (c *ClientWithResponses) GetReactionProvider(ctx context.Context, id string) (*http.Response, error) {
	path := fmt.Sprintf("/v1/reactionProviders/%s", id)
	req, err := c.newRequest(ctx, http.MethodGet, path, nil)
	if err != nil {
		return nil, err
	}
	return c.Client.Client.Do(req)
}

// DeleteReactionProvider deletes a reaction provider
func (c *ClientWithResponses) DeleteReactionProvider(ctx context.Context, id string) (*http.Response, error) {
	path := fmt.Sprintf("/v1/reactionProviders/%s", id)
	req, err := c.newRequest(ctx, http.MethodDelete, path, nil)
	if err != nil {
		return nil, err
	}
	return c.Client.Client.Do(req)
}

// ListReactionProviders lists all reaction providers
func (c *ClientWithResponses) ListReactionProviders(ctx context.Context) (*http.Response, error) {
	path := "/v1/reactionProviders"
	req, err := c.newRequest(ctx, http.MethodGet, path, nil)
	if err != nil {
		return nil, err
	}
	return c.Client.Client.Do(req)
}
