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

use serde_json::json;
use std::collections::{HashMap, HashSet};

#[derive(Debug, Clone, Default)]
pub struct SubscriberMap {
    pub label_map: HashMap<String, HashSet<String>>,
}

impl SubscriberMap {
    pub fn new() -> Self {
        Self {
            label_map: HashMap::new(),
        }
    }

    fn add(&mut self, label: &str, query_node_id: &str, query_id: &str) {
        let set = self.label_map.entry(label.to_string()).or_default();

        let json_data = json!({
            "queryNodeId": query_node_id,
            "queryId": query_id
        });

        set.insert(json_data.to_string());
    }

    pub fn add_labels(&mut self, labels: Vec<&str>, query_node_id: &str, query_id: &str) {
        for label in labels {
            self.add(label, query_node_id, query_id);
        }
    }

    pub fn get_subscribers_for_labels(&self, labels: Vec<&str>) -> Option<Vec<String>> {
        let mut result = Vec::new();

        for label in labels {
            match self.label_map.get(label) {
                Some(set) => {
                    for subscriber in set {
                        result.push(subscriber.clone());
                    }
                }
                None => return None,
            }
        }

        Some(result)
    }
}
