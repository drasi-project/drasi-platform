// Package generated provides primitives to interact with the openapi HTTP API.
//
// This file contains manually defined types for schemas that couldn't be auto-generated
// due to discriminator mapping issues in the OpenAPI spec. These types use flexible
// representations (interface{} or map[string]interface{}) to maintain compatibility.
package generated

// ConfigValueDto represents a configuration value that can be either inline or a secret reference.
// The discriminator field is "kind" with possible values: "Inline" or "Secret".
//
// For Inline values:
//
//	{"kind": "Inline", "value": <InlineValueDto>}
//
// For Secret references:
//
//	{"kind": "Secret", "name": "secret-name", "key": "secret-key"}
type ConfigValueDto = interface{}

// ServiceIdentityDto represents identity configuration for a service.
// The discriminator field is "kind" with possible values:
// - "MicrosoftEntraWorkloadID"
// - "MicrosoftEntraApplication"
// - "ConnectionString"
// - "AccessKey"
// - "AwsIamRole"
// - "AwsIamAccessKey"
type ServiceIdentityDto = interface{}

// StorageSpecDto represents storage configuration for a query container.
// The discriminator field is "kind" with possible values:
// - "memory"
// - "redis"
// - "rocksDb"
type StorageSpecDto = interface{}

// ResultEventDto represents an event from a continuous query result stream.
// The discriminator field is "kind" with possible values for change events
// and control signals.
type ResultEventDto = interface{}

// ControlMessage represents a control message in the query result stream.
type ControlMessage = interface{}
