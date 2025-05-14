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
	"encoding/json"
)

type UpdatedResult struct {
	Before map[string]interface{} `json:"before"`
	After  map[string]interface{} `json:"after"`
}

type ChangeMsg struct {
	AddedResults   []map[string]interface{} `json:"addedResults"`
	UpdatedResults []UpdatedResult          `json:"updatedResults"`
	DeletedResults []map[string]interface{} `json:"deletedResults"`
}

func CreateChangeMsg(data map[string]interface{}) (*ChangeMsg, error) {
	jsonData, err := json.Marshal(data)
	if err != nil {
		panic(err)
	}

	var result ChangeMsg
	err = json.Unmarshal(jsonData, &result)
	if err != nil {
		return nil, err
	}

	return &result, nil
}
