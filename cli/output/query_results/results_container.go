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

package query_results

import (
	"bytes"
	"crypto/sha256"
	"encoding/json"
	"sort"
)

type resultContainer struct {
	resultKeys map[[32]byte]int
	results    []map[string]interface{}
}

func (m *resultContainer) Add(result map[string]interface{}) {
	key := hash(result)
	m.results = append(m.results, result)
	m.resultKeys[key] = len(m.results) - 1
}

func (m *resultContainer) Delete(result map[string]interface{}) {
	key := hash(result)
	idx := m.resultKeys[key]
	delete(m.resultKeys, key)
	m.results[idx] = nil
}

func (m *resultContainer) Update(update UpdatedResult) {
	beforeKey := hash(update.Before)
	afterKey := hash(update.After)
	idx := m.resultKeys[beforeKey]
	delete(m.resultKeys, beforeKey)
	m.resultKeys[afterKey] = idx
	m.results[idx] = update.After
}

func (m *resultContainer) Iter() []map[string]interface{} {
	return m.results
}

func hash(data map[string]interface{}) [32]byte {
	keys := make([]string, 0, len(data))
	for k := range data {
		keys = append(keys, k)
	}

	sort.Strings(keys)

	var buf bytes.Buffer

	for _, k := range keys {
		buf.WriteString(k)
		jsonBytes, _ := json.Marshal(data[k])
		buf.Write(jsonBytes)
	}

	return sha256.Sum256(buf.Bytes())
}
