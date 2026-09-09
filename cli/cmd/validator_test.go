package cmd

import (
	"testing"

	"drasi.io/cli/api"
	"github.com/stretchr/testify/assert"
)

// minimalOpenAPI is a small but realistic openapi.yaml fixture used across all tests. It includes the required fields for Source and ContinuousQuery, so manifests that include those fields should pass validation without errors.
var minimalOpenAPI = []byte(`
components:
  schemas:
    SourceSpecDto:
      required:
        - kind
      properties:
        kind:
          type: string
        dbhost:
          type: string
        dbport:
          type: integer
    QuerySpecDto:
      required:
        - query
        - sources
      properties:
        query:
          type: string
        sources:
          type: object
`)

func TestValidateManifests(t *testing.T) {

	t.Run("Success case - valid Source manifest", func(t *testing.T) {
		manifests := []api.Manifest{
			{
				ApiVersion: "v1",
				Kind:       "Source",
				Name:       "my-source",
				Spec: map[string]interface{}{
					"kind":   "PostgreSQL",
					"dbhost": "localhost",
					"dbport": 5432,
				},
			},
		}

		errs, err := ValidateManifests(manifests, minimalOpenAPI)

		assert.NoError(t, err)
		assert.Empty(t, errs)
	})

	t.Run("Success case - valid ContinuousQuery manifest", func(t *testing.T) {
		manifests := []api.Manifest{
			{
				ApiVersion: "v1",
				Kind:       "ContinuousQuery",
				Name:       "my-query",
				Spec: map[string]interface{}{
					"query": "SELECT * FROM Users",
					"sources": map[string]interface{}{
						"subscriptions": []interface{}{
							map[string]interface{}{"id": "my-source"},
						},
					},
				},
			},
		}

		errs, err := ValidateManifests(manifests, minimalOpenAPI)

		assert.NoError(t, err)
		assert.Empty(t, errs)
	})

	t.Run("Success case - multiple valid manifests", func(t *testing.T) {
		manifests := []api.Manifest{
			{
				ApiVersion: "v1",
				Kind:       "Source",
				Name:       "my-source",
				Spec: map[string]interface{}{
					"kind": "PostgreSQL",
				},
			},
			{
				ApiVersion: "v1",
				Kind:       "ContinuousQuery",
				Name:       "my-query",
				Spec: map[string]interface{}{
					"query": "SELECT * FROM Users",
					"sources": map[string]interface{}{
						"subscriptions": []interface{}{
							map[string]interface{}{"id": "my-source"},
						},
					},
				},
			},
		}

		errs, err := ValidateManifests(manifests, minimalOpenAPI)

		assert.NoError(t, err)
		assert.Empty(t, errs)
	})

	t.Run("Error case - invalid openapi spec bytes", func(t *testing.T) {
		manifests := []api.Manifest{
			{Kind: "Source", Name: "my-source"},
		}

		errs, err := ValidateManifests(manifests, []byte("{{invalid yaml"))

		// Must return a hard error, not silent nil — so apply.go can block client.Apply()
		assert.Error(t, err)
		assert.Nil(t, errs)
		assert.Contains(t, err.Error(), "could not parse openapi.yaml")
	})

	t.Run("Error case - nil openapi spec bytes", func(t *testing.T) {
		manifests := []api.Manifest{
			{
				Kind: "Source",
				Name: "my-source",
				Spec: map[string]interface{}{
					"kind": "PostgreSQL",
				},
			},
		}

		errs, err := ValidateManifests(manifests, nil)

		assert.NoError(t, err)
		assert.True(t, len(errs) > 0)
		for _, e := range errs {
			assert.Equal(t, SeverityWarning, e.Severity)
		}
	})
}

func TestApiVersionValidation(t *testing.T) {

	t.Run("Warning case - missing apiVersion", func(t *testing.T) {
		manifests := []api.Manifest{
			{
				Kind: "Source",
				Name: "my-source",
				Spec: map[string]interface{}{"kind": "PostgreSQL"},
			},
		}

		errs, err := ValidateManifests(manifests, minimalOpenAPI)

		assert.NoError(t, err)
		assert.Equal(t, 1, len(errs))
		assert.Equal(t, SeverityWarning, errs[0].Severity)
		assert.Contains(t, errs[0].Message, "apiVersion")
	})

	t.Run("Warning case - whitespace-only apiVersion", func(t *testing.T) {
		manifests := []api.Manifest{
			{
				ApiVersion: "   ",
				Kind:       "Source",
				Name:       "my-source",
				Spec:       map[string]interface{}{"kind": "PostgreSQL"},
			},
		}

		errs, err := ValidateManifests(manifests, minimalOpenAPI)

		assert.NoError(t, err)
		assert.Equal(t, 1, len(errs))
		assert.Equal(t, SeverityWarning, errs[0].Severity)
		assert.Contains(t, errs[0].Message, "apiVersion")
	})
}

func TestKindValidation(t *testing.T) {

	t.Run("Error case - missing kind", func(t *testing.T) {
		manifests := []api.Manifest{
			{
				ApiVersion: "v1",
				Name:       "my-source",
				Spec:       map[string]interface{}{"kind": "PostgreSQL"},
			},
		}

		errs, err := ValidateManifests(manifests, minimalOpenAPI)

		assert.NoError(t, err)
		assert.True(t, HasErrors(errs))

		kindErr := findError(errs, SeverityError)
		assert.NotNil(t, kindErr)
		assert.Contains(t, kindErr.Message, "kind")
	})

	t.Run("Warning case - unknown kind gets schema-not-found warning", func(t *testing.T) {
		manifests := []api.Manifest{
			{
				ApiVersion: "v1",
				Kind:       "UnknownResource",
				Name:       "my-thing",
				Spec:       map[string]interface{}{"foo": "bar"},
			},
		}

		errs, err := ValidateManifests(manifests, minimalOpenAPI)

		assert.NoError(t, err)
		assert.False(t, HasErrors(errs))
		assert.Equal(t, 1, len(errs))
		assert.Equal(t, SeverityWarning, errs[0].Severity)
		assert.Contains(t, errs[0].Message, "UnknownResource")
	})
}

func TestNameValidation(t *testing.T) {

	t.Run("Error case - missing name", func(t *testing.T) {
		manifests := []api.Manifest{
			{
				ApiVersion: "v1",
				Kind:       "Source",
				Spec:       map[string]interface{}{"kind": "PostgreSQL"},
			},
		}

		errs, err := ValidateManifests(manifests, minimalOpenAPI)

		assert.NoError(t, err)
		assert.True(t, HasErrors(errs))
		nameErr := findError(errs, SeverityError)
		assert.NotNil(t, nameErr)
		assert.Contains(t, nameErr.Message, "name")
	})

	t.Run("Error case - whitespace-only name", func(t *testing.T) {
		manifests := []api.Manifest{
			{
				ApiVersion: "v1",
				Kind:       "Source",
				Name:       "   ",
				Spec:       map[string]interface{}{"kind": "PostgreSQL"},
			},
		}

		errs, err := ValidateManifests(manifests, minimalOpenAPI)

		assert.NoError(t, err)
		assert.True(t, HasErrors(errs))
		nameErr := findError(errs, SeverityError)
		assert.NotNil(t, nameErr)
		assert.Contains(t, nameErr.Message, "name")
	})
}

func TestSpecValidation(t *testing.T) {

	t.Run("Error case - nil spec", func(t *testing.T) {
		manifests := []api.Manifest{
			{
				ApiVersion: "v1",
				Kind:       "Source",
				Name:       "my-source",
				Spec:       nil,
			},
		}

		errs, err := ValidateManifests(manifests, minimalOpenAPI)

		assert.NoError(t, err)
		assert.True(t, HasErrors(errs))
		specErr := findError(errs, SeverityError)
		assert.NotNil(t, specErr)
		assert.Contains(t, specErr.Message, "spec")
	})

	t.Run("Error case - spec is not a map (string value)", func(t *testing.T) {
		manifests := []api.Manifest{
			{
				ApiVersion: "v1",
				Kind:       "Source",
				Name:       "my-source",
				Spec:       "this-is-not-a-map",
			},
		}

		errs, err := ValidateManifests(manifests, minimalOpenAPI)

		assert.NoError(t, err)
		assert.True(t, HasErrors(errs))
		specErr := findError(errs, SeverityError)
		assert.NotNil(t, specErr)
		assert.Contains(t, specErr.Message, "spec")
	})

	t.Run("Error case - spec is empty map, required fields missing", func(t *testing.T) {
		manifests := []api.Manifest{
			{
				ApiVersion: "v1",
				Kind:       "Source",
				Name:       "my-source",
				Spec:       map[string]interface{}{},
			},
		}

		errs, err := ValidateManifests(manifests, minimalOpenAPI)

		assert.NoError(t, err)
		assert.True(t, HasErrors(errs))
		// Source requires 'kind' — should be flagged
		assert.True(t, containsMessage(errs, "kind"))
	})

	t.Run("Success case - spec with boolean field present (false value)", func(t *testing.T) {

		manifests := []api.Manifest{
			{
				ApiVersion: "v1",
				Kind:       "Source",
				Name:       "my-source",
				Spec: map[string]interface{}{
					"kind":    "PostgreSQL",
					"enabled": false,
				},
			},
		}

		errs, err := ValidateManifests(manifests, minimalOpenAPI)

		assert.NoError(t, err)
		assert.Empty(t, errs)
	})

	t.Run("Success case - spec with integer zero field present", func(t *testing.T) {
		// fieldPresent must not treat int 0 as missing
		manifests := []api.Manifest{
			{
				ApiVersion: "v1",
				Kind:       "Source",
				Name:       "my-source",
				Spec: map[string]interface{}{
					"kind":   "PostgreSQL",
					"dbport": 0,
				},
			},
		}

		errs, err := ValidateManifests(manifests, minimalOpenAPI)

		assert.NoError(t, err)
		assert.Empty(t, errs)
	})
}

func TestContinuousQueryValidation(t *testing.T) {

	t.Run("Error case - sources block missing", func(t *testing.T) {
		manifests := []api.Manifest{
			{
				ApiVersion: "v1",
				Kind:       "ContinuousQuery",
				Name:       "my-query",
				Spec: map[string]interface{}{
					"query": "SELECT * FROM Users",
				},
			},
		}

		errs, err := ValidateManifests(manifests, minimalOpenAPI)

		assert.NoError(t, err)
		assert.True(t, HasErrors(errs))
		assert.True(t, containsMessage(errs, "sources"))
	})

	t.Run("Error case - subscriptions missing from sources", func(t *testing.T) {
		manifests := []api.Manifest{
			{
				ApiVersion: "v1",
				Kind:       "ContinuousQuery",
				Name:       "my-query",
				Spec: map[string]interface{}{
					"query":   "SELECT * FROM Users",
					"sources": map[string]interface{}{},
				},
			},
		}

		errs, err := ValidateManifests(manifests, minimalOpenAPI)

		assert.NoError(t, err)
		assert.True(t, HasErrors(errs))
		assert.True(t, containsMessage(errs, "subscriptions"))
	})

	t.Run("Error case - subscriptions is an empty list", func(t *testing.T) {
		manifests := []api.Manifest{
			{
				ApiVersion: "v1",
				Kind:       "ContinuousQuery",
				Name:       "my-query",
				Spec: map[string]interface{}{
					"query": "SELECT * FROM Users",
					"sources": map[string]interface{}{
						"subscriptions": []interface{}{}, // empty
					},
				},
			},
		}

		errs, err := ValidateManifests(manifests, minimalOpenAPI)

		assert.NoError(t, err)
		assert.True(t, HasErrors(errs))
		assert.True(t, containsMessage(errs, "subscriptions"))
	})

	t.Run("Error case - subscriptions is wrong type (not a list)", func(t *testing.T) {
		manifests := []api.Manifest{
			{
				ApiVersion: "v1",
				Kind:       "ContinuousQuery",
				Name:       "my-query",
				Spec: map[string]interface{}{
					"query": "SELECT * FROM Users",
					"sources": map[string]interface{}{
						"subscriptions": "my-source", // string instead of list
					},
				},
			},
		}

		errs, err := ValidateManifests(manifests, minimalOpenAPI)

		assert.NoError(t, err)
		assert.True(t, HasErrors(errs))
		assert.True(t, containsMessage(errs, "subscriptions"))
	})

	t.Run("Error case - query field missing", func(t *testing.T) {
		manifests := []api.Manifest{
			{
				ApiVersion: "v1",
				Kind:       "ContinuousQuery",
				Name:       "my-query",
				Spec: map[string]interface{}{
					"sources": map[string]interface{}{
						"subscriptions": []interface{}{
							map[string]interface{}{"id": "my-source"},
						},
					},
				},
			},
		}

		errs, err := ValidateManifests(manifests, minimalOpenAPI)

		assert.NoError(t, err)
		assert.True(t, HasErrors(errs))
		assert.True(t, containsMessage(errs, "query"))
	})
}

// ─────────────────────────────────────────────────────────────
// HasErrors
// ─────────────────────────────────────────────────────────────

func TestHasErrors(t *testing.T) {

	t.Run("Returns false for empty slice", func(t *testing.T) {
		assert.False(t, HasErrors(nil))
		assert.False(t, HasErrors([]ValidationError{}))
	})

	t.Run("Returns false for warnings only", func(t *testing.T) {
		errs := []ValidationError{
			{Severity: SeverityWarning, Message: "apiVersion missing"},
		}
		assert.False(t, HasErrors(errs))
	})

	t.Run("Returns true when at least one error exists", func(t *testing.T) {
		errs := []ValidationError{
			{Severity: SeverityWarning, Message: "apiVersion missing"},
			{Severity: SeverityError, Message: "kind missing"},
		}
		assert.True(t, HasErrors(errs))
	})

	t.Run("Returns true for errors-only slice", func(t *testing.T) {
		errs := []ValidationError{
			{Severity: SeverityError, Message: "kind missing"},
		}
		assert.True(t, HasErrors(errs))
	})
}

// ─────────────────────────────────────────────────────────────
// ValidationError.Error() formatting
// ─────────────────────────────────────────────────────────────

func TestValidationErrorFormat(t *testing.T) {

	t.Run("Formats with kind and name", func(t *testing.T) {
		e := ValidationError{
			Index:    0,
			Severity: SeverityError,
			Kind:     "Source",
			Name:     "my-source",
			Message:  "spec: missing required field 'kind'",
		}
		assert.Equal(t, "[error] Resource 0 (Source/my-source): spec: missing required field 'kind'", e.Error())
	})

	t.Run("Formats without kind and name", func(t *testing.T) {
		e := ValidationError{
			Index:    1,
			Severity: SeverityWarning,
			Message:  "'apiVersion' is missing",
		}
		assert.Equal(t, "[warning] Resource 1: 'apiVersion' is missing", e.Error())
	})

	t.Run("Formats with kind only (name empty)", func(t *testing.T) {
		e := ValidationError{
			Index:    2,
			Severity: SeverityError,
			Kind:     "Source",
			Message:  "'name' is missing or empty",
		}
		assert.Equal(t, "[error] Resource 2 (Source/): 'name' is missing or empty", e.Error())
	})
}

// ─────────────────────────────────────────────────────────────
// Multi-manifest error indexing
// ─────────────────────────────────────────────────────────────

func TestErrorIndexing(t *testing.T) {

	t.Run("Error index matches manifest position", func(t *testing.T) {
		manifests := []api.Manifest{
			{
				ApiVersion: "v1",
				Kind:       "Source",
				Name:       "good-source",
				Spec:       map[string]interface{}{"kind": "PostgreSQL"},
			},
			{
				// index 1: missing kind — should produce error with Index=1
				ApiVersion: "v1",
				Name:       "bad-manifest",
				Spec:       map[string]interface{}{},
			},
		}

		errs, err := ValidateManifests(manifests, minimalOpenAPI)

		assert.NoError(t, err)
		assert.True(t, HasErrors(errs))

		for _, e := range errs {
			if e.Severity == SeverityError {
				assert.Equal(t, 1, e.Index, "error should reference the second manifest (index 1)")
			}
		}
	})
}

// ─────────────────────────────────────────────────────────────
// Test helpers
// ─────────────────────────────────────────────────────────────

// findError returns the first ValidationError with the given severity, or nil.
func findError(errs []ValidationError, sev Severity) *ValidationError {
	for i := range errs {
		if errs[i].Severity == sev {
			return &errs[i]
		}
	}
	return nil
}

// containsMessage returns true if any ValidationError message contains substr.
func containsMessage(errs []ValidationError, substr string) bool {
	for _, e := range errs {
		if len(e.Message) > 0 {
			// Use strings.Contains equivalent inline to avoid import
			if len(e.Message) >= len(substr) {
				for i := 0; i <= len(e.Message)-len(substr); i++ {
					if e.Message[i:i+len(substr)] == substr {
						return true
					}
				}
			}
		}
	}
	return false
}
