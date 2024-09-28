use crate::subscriber_map::SubscriberMap;
use std::collections::{HashMap, HashSet};
use std::sync::Mutex;

#[derive(Debug, Default)]
pub struct Subscriber {
    pub subscriber_map: Mutex<SubscriberMap>,
}

impl Subscriber {
    pub fn new() -> Self {
        Self {
            subscriber_map: Mutex::new(SubscriberMap::new()),
        }
    }

    pub fn add_labels(&self, labels: Vec<&str>, query_node_id: &str, query_id: &str) {
        let mut subscriber_map = self.subscriber_map.lock().unwrap();
        subscriber_map.add_labels(labels, query_node_id, query_id);
    }

    pub fn get_label_map(&self) -> HashMap<String, HashSet<String>> {
        let subscriber_map = self.subscriber_map.lock().unwrap();
        subscriber_map.label_map.clone()
    }

    pub fn get_subscribers_for_labels(&self, labels: Vec<&str>) -> Option<Vec<String>> {
        let subscriber_map = self.subscriber_map.lock().unwrap();
        
        subscriber_map.get_subscribers_for_labels(labels).clone()
    }
}
