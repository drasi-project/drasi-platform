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
        let set = self
            .label_map
            .entry(label.to_string())
            .or_default();

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
