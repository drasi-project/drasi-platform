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
        let mut subscriber_map = self
            .subscriber_map
            .lock()
            .expect("subscriber_map lock poisoned");
        subscriber_map.add_labels(labels, query_node_id, query_id);
    }

    pub fn get_label_map(&self) -> HashMap<String, HashSet<String>> {
        let subscriber_map = self
            .subscriber_map
            .lock()
            .expect("subscriber_map lock poisoned");
        subscriber_map.label_map.clone()
    }

    pub fn get_subscribers_for_labels(&self, labels: Vec<&str>) -> Option<Vec<String>> {
        let subscriber_map = self
            .subscriber_map
            .lock()
            .expect("subscriber_map lock poisoned");

        subscriber_map.get_subscribers_for_labels(labels).clone()
    }
}
