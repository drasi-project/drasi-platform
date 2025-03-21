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

#[derive(Serialize, Deserialize, Clone)]
pub struct SubscriptionRequest {
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
    pub ts_ns: u64,
    pub payload: SubscriptionPayload,
}

#[derive(Serialize)]
pub struct SubscriptionPayload {
    pub source: Source,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub before: Option<SubscriptionRequest>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub after: Option<SubscriptionRequest>,
}

#[derive(Serialize)]
pub struct Source {
    pub db: String,
    pub table: String,
}

pub mod v1 {
    use serde::Deserialize;
    use serde_json::{Map, Value};

    #[derive(Deserialize)]
    pub struct BootstrapEvents {
        pub nodes: Vec<BootstrapNode>,
        pub rels: Vec<BootstrapRelation>,
    }

    #[derive(Deserialize)]
    pub struct BootstrapNode {
        pub id: String,
        pub labels: Vec<String>,
        pub properties: Map<String, Value>,
    }

    #[derive(Deserialize)]
    #[serde(rename_all = "camelCase")]
    pub struct BootstrapRelation {
        pub id: String,
        pub labels: Vec<String>,
        pub properties: Map<String, Value>,
        pub start_id: String,
        pub end_id: String,
    }
}

pub mod v2 {
    use serde::{Deserialize, Serialize};
    use serde_json::{Map, Value};

    use super::{v1, SubscriptionRequest};

    #[derive(Serialize, Deserialize, Clone)]
    pub struct AcquireRequest {
        #[serde(rename = "nodeLabels")]
        pub node_labels: Vec<String>,
        #[serde(rename = "relLabels")]
        pub rel_labels: Vec<String>,
    }

    impl From<SubscriptionRequest> for AcquireRequest {
        fn from(subscription_request: SubscriptionRequest) -> Self {
            Self {
                node_labels: subscription_request.node_labels,
                rel_labels: subscription_request.rel_labels,
            }
        }
    }

    #[derive(Serialize)]
    #[serde(rename_all = "camelCase")]
    pub struct BootstrapElement {
        pub id: String,
        pub labels: Vec<String>,
        pub properties: Map<String, Value>,
        pub start_id: Option<String>,
        pub end_id: Option<String>,
    }

    impl From<v1::BootstrapNode> for BootstrapElement {
        fn from(node: v1::BootstrapNode) -> Self {
            Self {
                id: node.id,
                labels: node.labels,
                properties: node.properties,
                start_id: None,
                end_id: None,
            }
        }
    }

    impl From<v1::BootstrapRelation> for BootstrapElement {
        fn from(rel: v1::BootstrapRelation) -> Self {
            Self {
                id: rel.id,
                labels: rel.labels,
                properties: rel.properties,
                start_id: Some(rel.start_id),
                end_id: Some(rel.end_id),
            }
        }
    }
}
