package query_results

import (
	"reflect"
	"testing"
)

func TestResultContainer(t *testing.T) {
	t.Run("Add and Iter", func(t *testing.T) {
		rc := &resultContainer{
			resultKeys: make(map[[32]byte]int),
		}

		result1 := map[string]interface{}{"id": 1, "name": "Alice"}
		result2 := map[string]interface{}{"id": 2, "name": "Bob"}

		rc.Add(result1)
		rc.Add(result2)

		expected := []map[string]interface{}{result1, result2}
		actual := rc.Iter()

		if !reflect.DeepEqual(actual, expected) {
			t.Errorf("Expected %v, got %v", expected, actual)
		}
	})

	t.Run("Delete", func(t *testing.T) {
		rc := &resultContainer{
			resultKeys: make(map[[32]byte]int),
		}

		result1 := map[string]interface{}{"id": 1, "name": "Alice"}
		result2 := map[string]interface{}{"id": 2, "name": "Bob"}

		rc.Add(result1)
		rc.Add(result2)
		rc.Delete(result1)

		expected := []map[string]interface{}{nil, result2}
		actual := rc.Iter()

		if !reflect.DeepEqual(actual, expected) {
			t.Errorf("Expected %v, got %v", expected, actual)
		}
	})

	t.Run("Update", func(t *testing.T) {
		rc := &resultContainer{
			resultKeys: make(map[[32]byte]int),
		}

		result1 := map[string]interface{}{"id": 1, "name": "Alice"}
		result2 := map[string]interface{}{"id": 2, "name": "Bob"}

		rc.Add(result1)
		rc.Add(result2)

		updatedResult := map[string]interface{}{"id": 1, "name": "Alice Smith"}
		rc.Update(UpdatedResult{Before: result1, After: updatedResult})

		expected := []map[string]interface{}{updatedResult, result2}
		actual := rc.Iter()

		if !reflect.DeepEqual(actual, expected) {
			t.Errorf("Expected %v, got %v", expected, actual)
		}
	})

	t.Run("Hash function", func(t *testing.T) {
		result1 := map[string]interface{}{"id": 1, "name": "Alice"}
		result2 := map[string]interface{}{"name": "Alice", "id": 1}

		hash1 := hash(result1)
		hash2 := hash(result2)

		if hash1 != hash2 {
			t.Errorf("Hash function is not consistent for equivalent maps")
		}
	})
}
