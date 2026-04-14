package cmd

import (
	"fmt"
	"strings"

	"drasi.io/cli/api"
	"gopkg.in/yaml.v3"
)

type Severity string

const (
	SeverityError   Severity = "error"
	SeverityWarning Severity = "warning"
)

type ValidationError struct {
	Index    int      `json:"index"`
	Severity Severity `json:"severity"`
	Kind     string   `json:"kind,omitempty"`
	Name     string   `json:"name,omitempty"`
	Message  string   `json:"message"`
}

func (e ValidationError) Error() string {
	loc := fmt.Sprintf("Resource %d", e.Index)
	if e.Kind != "" || e.Name != "" {
		loc += fmt.Sprintf(" (%s/%s)", e.Kind, e.Name)
	}
	return fmt.Sprintf("[%s] %s: %s", e.Severity, loc, e.Message)
}

func HasErrors(errs []ValidationError) bool {
	for _, e := range errs {
		if e.Severity == SeverityError {
			return true
		}
	}
	return false
}

var kindToSchema = map[string]string{
	"ContinuousQuery":  "QuerySpecDto",
	"QueryContainer":   "QueryContainerSpecDto",
	"Source":           "SourceSpecDto",
	"Reaction":         "ReactionSpecDto",
	"SourceProvider":   "ProviderSpecDto",
	"ReactionProvider": "ProviderSpecDto",
}

func schemaNameForKind(kind string) string {
	if name, ok := kindToSchema[kind]; ok {
		return name
	}
	return kind + "SpecDto"
}

func ValidateManifests(manifests []api.Manifest, openapiBytes []byte) ([]ValidationError, error) {
	openapiSpec, err := loadOpenAPISpec(openapiBytes)
	if err != nil {
		return nil, fmt.Errorf("could not parse openapi.yaml: %w", err)
	}

	var errs []ValidationError
	for i, m := range manifests {
		errs = append(errs, validateManifest(i, m, openapiSpec)...)
	}
	return errs, nil
}

func loadOpenAPISpec(data []byte) (map[string]interface{}, error) {
	var spec map[string]interface{}
	if err := yaml.Unmarshal(data, &spec); err != nil {
		return nil, err
	}
	return spec, nil
}

func getNested(m map[string]interface{}, keys ...string) (interface{}, bool) {
	var cur interface{} = m
	for _, k := range keys {
		mm, ok := cur.(map[string]interface{})
		if !ok {
			return nil, false
		}
		cur, ok = mm[k]
		if !ok {
			return nil, false
		}
	}
	return cur, true
}

func getMap(m map[string]interface{}, keys ...string) map[string]interface{} {
	v, ok := getNested(m, keys...)
	if !ok {
		return nil
	}
	mm, ok := v.(map[string]interface{})
	if !ok {
		return nil
	}
	return mm
}

func fieldPresent(m map[string]interface{}, key string) bool {
	v, ok := m[key]
	if !ok {
		return false
	}
	if s, ok := v.(string); ok {
		return strings.TrimSpace(s) != ""
	}
	return v != nil
}

func validateManifest(index int, m api.Manifest, openapiSpec map[string]interface{}) []ValidationError {
	var errs []ValidationError

	newErr := func(sev Severity, kind, name, msg string) ValidationError {
		return ValidationError{Index: index, Severity: sev, Kind: kind, Name: name, Message: msg}
	}

	if strings.TrimSpace(m.ApiVersion) == "" {
		errs = append(errs, newErr(SeverityWarning, "", "", "'apiVersion' is missing (expected e.g. 'v1')"))
	}

	kind := strings.TrimSpace(m.Kind)
	if kind == "" {
		errs = append(errs, newErr(SeverityError, "", "", "'kind' is missing or empty"))
		return errs
	}

	name := strings.TrimSpace(m.Name)
	if name == "" {
		errs = append(errs, newErr(SeverityError, kind, "", "'name' is missing or empty"))
	}

	if m.Spec == nil {
		errs = append(errs, newErr(SeverityError, kind, name, "'spec' block is missing"))
		return errs
	}

	spec, ok := m.Spec.(map[string]interface{})
	if !ok {
		errs = append(errs, newErr(SeverityError, kind, name,
			fmt.Sprintf("'spec' must be a YAML map, got %T", m.Spec)))
		return errs
	}

	schemaName := schemaNameForKind(kind)
	schemas := getMap(openapiSpec, "components", "schemas")
	schema := getMap(schemas, schemaName)

	if schema == nil {
		errs = append(errs, newErr(SeverityWarning, kind, name,
			fmt.Sprintf("no OpenAPI schema found for kind %q (looked for %q) — skipping deep validation", kind, schemaName)))
		return errs
	}

	if reqList, ok := getNested(schema, "required"); ok {
		for _, r := range reqList.([]interface{}) {
			field, ok := r.(string)
			if !ok {
				continue
			}
			if !fieldPresent(spec, field) {
				errs = append(errs, newErr(SeverityError, kind, name,
					fmt.Sprintf("spec: missing required field '%s'", field)))
			}
		}
	}

	switch kind {
	case "ContinuousQuery":
		errs = append(errs, validateContinuousQuery(index, kind, name, spec)...)
	}

	return errs
}

func validateContinuousQuery(index int, kind, name string, spec map[string]interface{}) []ValidationError {
	var errs []ValidationError
	newErr := func(sev Severity, msg string) ValidationError {
		return ValidationError{Index: index, Severity: sev, Kind: kind, Name: name, Message: msg}
	}

	sources := getMap(spec, "sources")
	if sources == nil {
		errs = append(errs, newErr(SeverityError, "spec.sources: block is missing"))
		return errs
	}

	subsRaw, ok := sources["subscriptions"]
	if !ok || subsRaw == nil {
		errs = append(errs, newErr(SeverityError, "spec.sources: missing required field 'subscriptions'"))
	} else if subs, ok := subsRaw.([]interface{}); !ok || len(subs) == 0 {
		errs = append(errs, newErr(SeverityError, "spec.sources.subscriptions: must be a non-empty list"))
	}

	return errs
}
