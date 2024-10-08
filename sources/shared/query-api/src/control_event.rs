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

use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct SubscriptionInput {
    #[serde(rename = "queryId")]
    pub query_id: String,
    #[serde(rename = "queryNodeId")]
    pub query_node_id: String,
    #[serde(rename = "nodeLabels")]
    pub node_labels: Vec<String>,
    #[serde(rename = "relLabels")]
    pub rel_labels: Vec<String>,
}

#[derive(Serialize)]
pub struct ControlEvent {
    pub op: String,
    pub ts_ms: u64,
    pub payload: Payload,
}

#[derive(Serialize)]
pub struct Payload {
    pub source: Source,
    pub before: Option<()>,
    pub after: SubscriptionData,
}

#[derive(Serialize)]
pub struct Source {
    pub db: String,
    pub table: String,
}

#[derive(Serialize)]
pub struct SubscriptionData {
    #[serde(rename = "queryId")]
    pub query_id: String,
    #[serde(rename = "queryNodeId")]
    pub query_node_id: String,
    #[serde(rename = "nodeLabels")]
    pub node_labels: Vec<String>,
    #[serde(rename = "relLabels")]
    pub rel_labels: Vec<String>,
}
