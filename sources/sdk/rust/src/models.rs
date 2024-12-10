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

use serde::{ser::SerializeStruct, Deserialize, Serialize, Serializer};
use serde_json::{Map, Value};
use std::env;

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct BootstrapRequest {
    pub node_labels: Vec<String>,
    pub rel_labels: Vec<String>,
}

#[derive(Serialize, Debug)]
#[serde(rename_all = "camelCase")]
#[serde(untagged)]
pub enum SourceElement {
    Node {
        id: String,
        labels: Vec<String>,
        properties: Map<String, Value>,
    },
    Relation {
        id: String,
        labels: Vec<String>,
        properties: Map<String, Value>,
        #[serde(rename = "startId")]
        start_id: String,
        #[serde(rename = "endId")]
        end_id: String,
    },
}

#[derive(Serialize, Debug)]
pub enum ChangeOp {
    #[serde(rename = "i")]
    Create,

    #[serde(rename = "u")]
    Update,

    #[serde(rename = "d")]
    Delete,
}

pub struct SourceChange {
    op: ChangeOp,
    element: SourceElement,
    metadata: Option<Map<String, Value>>,
    ts_ms: u64,
    seq: u64,
}

impl SourceChange {
    pub fn new(
        op: ChangeOp,
        element: SourceElement,
        ts_ms: u64,
        seq: u64,
        metadata: Option<Map<String, Value>>,
    ) -> SourceChange {
        SourceChange {
            op,
            element,
            metadata,
            ts_ms,
            seq,
        }
    }
}

struct SourceData<'a>(&'a SourceChange);

impl<'a> Serialize for SourceData<'a> {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let mut state = serializer.serialize_struct("SourceData", 1)?;
        state.serialize_field("db", &env::var("SOURCE_ID").unwrap_or("drasi".to_string()))?;
        state.serialize_field("lsn", &self.0.seq)?;
        state.serialize_field(
            "table",
            match &self.0.element {
                SourceElement::Node {
                    id: _,
                    labels: _,
                    properties: _,
                } => "node",
                SourceElement::Relation {
                    id: _,
                    labels: _,
                    properties: _,
                    start_id: _,
                    end_id: _,
                } => "rel",
            },
        )?;
        state.serialize_field("ts_ms", &self.0.ts_ms)?;
        state.end()
    }
}

struct Payload<'a>(&'a SourceChange);

impl<'a> Serialize for Payload<'a> {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let mut state = serializer.serialize_struct("Payload", 2)?;
        state.serialize_field(
            match &self.0.op {
                ChangeOp::Create => "after",
                ChangeOp::Update => "after",
                ChangeOp::Delete => "before",
            },
            &self.0.element,
        )?;
        state.serialize_field("source", &SourceData(self.0))?;
        state.end()
    }
}

impl Serialize for SourceChange {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let mut state = serializer.serialize_struct("SourceChange", 4)?;
        state.serialize_field("op", &self.op)?;
        state.serialize_field("payload", &Payload(self))?;
        state.serialize_field("ts_ms", &self.ts_ms)?;
        if let Some(metadata) = &self.metadata {
            state.serialize_field("metadata", metadata)?;
        }
        state.end()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn test_serialize_node_insert() {
        let node = SourceElement::Node {
            id: "1".to_string(),
            labels: vec!["Person".to_string()],
            properties: vec![
                ("field1".to_string(), Value::String("foo".to_string())),
                ("field2".to_string(), Value::String("bar".to_string())),
                ("field3".to_string(), Value::Number(4.into())),
            ]
            .into_iter()
            .collect(),
        };
        let change = SourceChange::new(ChangeOp::Create, node, 1234567890, 1, None);
        let serialized = serde_json::to_string(&change).unwrap();
        let expected = json!({
            "op": "i",
            "payload": {
                "after": {
                    "id": "1",
                    "labels": ["Person"],
                    "properties": {
                        "field1": "foo",
                        "field2": "bar",
                        "field3": 4,
                    },
                },
                "source": {
                    "db": "drasi",
                    "lsn": 1,
                    "table": "node",
                    "ts_ms": 1234567890,
                },
            },
            "ts_ms": 1234567890,
        });
        assert_eq!(
            serde_json::from_str::<Value>(&serialized).unwrap(),
            expected
        );
    }

    #[test]
    fn test_serialize_relation_insert() {
        let relation = SourceElement::Relation {
            id: "1".to_string(),
            labels: vec!["KNOWS".to_string()],
            properties: vec![
                ("field1".to_string(), Value::String("foo".to_string())),
                ("field2".to_string(), Value::String("bar".to_string())),
                ("field3".to_string(), Value::Number(4.into())),
            ]
            .into_iter()
            .collect(),
            start_id: "2".to_string(),
            end_id: "3".to_string(),
        };
        let change = SourceChange::new(ChangeOp::Create, relation, 1234567890, 1, None);
        let serialized = serde_json::to_string(&change).unwrap();
        let expected = json!({
            "op": "i",
            "payload": {
                "after": {
                    "id": "1",
                    "labels": ["KNOWS"],
                    "properties": {
                        "field1": "foo",
                        "field2": "bar",
                        "field3": 4,
                    },
                    "startId": "2",
                    "endId": "3",
                },
                "source": {
                    "db": "drasi",
                    "lsn": 1,
                    "table": "rel",
                    "ts_ms": 1234567890,
                },
            },
            "ts_ms": 1234567890,
        });
        assert_eq!(
            serde_json::from_str::<Value>(&serialized).unwrap(),
            expected
        );
    }

    #[test]
    fn test_serialize_node_update() {
        let node = SourceElement::Node {
            id: "1".to_string(),
            labels: vec!["Person".to_string()],
            properties: vec![
                ("field1".to_string(), Value::String("foo".to_string())),
                ("field2".to_string(), Value::String("bar".to_string())),
                ("field3".to_string(), Value::Number(4.into())),
            ]
            .into_iter()
            .collect(),
        };
        let change = SourceChange::new(ChangeOp::Update, node, 1234567890, 1, None);
        let serialized = serde_json::to_string(&change).unwrap();
        let expected = json!({
            "op": "u",
            "payload": {
                "after": {
                    "id": "1",
                    "labels": ["Person"],
                    "properties": {
                        "field1": "foo",
                        "field2": "bar",
                        "field3": 4,
                    },
                },
                "source": {
                    "db": "drasi",
                    "lsn": 1,
                    "table": "node",
                    "ts_ms": 1234567890,
                },
            },
            "ts_ms": 1234567890,
        });
        assert_eq!(
            serde_json::from_str::<Value>(&serialized).unwrap(),
            expected
        );
    }

    #[test]
    fn test_serialize_node_delete() {
        let node = SourceElement::Node {
            id: "1".to_string(),
            labels: vec!["Person".to_string()],
            properties: vec![
                ("field1".to_string(), Value::String("foo".to_string())),
                ("field2".to_string(), Value::String("bar".to_string())),
                ("field3".to_string(), Value::Number(4.into())),
            ]
            .into_iter()
            .collect(),
        };
        let change = SourceChange::new(ChangeOp::Delete, node, 1234567890, 1, None);
        let serialized = serde_json::to_string(&change).unwrap();
        let expected = json!({
            "op": "d",
            "payload": {
                "before": {
                    "id": "1",
                    "labels": ["Person"],
                    "properties": {
                        "field1": "foo",
                        "field2": "bar",
                        "field3": 4,
                    },
                },
                "source": {
                    "db": "drasi",
                    "lsn": 1,
                    "table": "node",
                    "ts_ms": 1234567890,
                },
            },
            "ts_ms": 1234567890,
        });
        assert_eq!(
            serde_json::from_str::<Value>(&serialized).unwrap(),
            expected
        );
    }
}
