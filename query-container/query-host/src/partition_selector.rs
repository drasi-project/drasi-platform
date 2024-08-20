use std::hash::Hasher;

use hashers::jenkins::spooky_hash::SpookyHasher;

use crate::{
    api::{ChangeEvent, ChangeType, ElementType},
    models::QuerySubscription,
};

pub trait PartitionSelector {
    fn include_in_partition(
        &self,
        subscription: &QuerySubscription,
        partition_id: u64,
        partition_count: u64,
    ) -> bool;
}

pub fn bucket_value<T: std::hash::Hash + Eq>(value: &T, partition_count: u64) -> u64 {
    let mut hasher = SpookyHasher::default();
    value.hash(&mut hasher);
    let hash_value = hasher.finish();

    hash_value % partition_count
}

impl PartitionSelector for ChangeEvent {
    fn include_in_partition(
        &self,
        subscription: &QuerySubscription,
        partition_id: u64,
        partition_count: u64,
    ) -> bool {
        if partition_count == 1 {
            return true;
        }

        let change_payload = match &self.op {
            ChangeType::Insert => &self.after,
            ChangeType::Update => &self.after,
            ChangeType::Delete => &self.before,
            _ => return true,
        };

        if let None = change_payload {
            return true;
        }
        let change_payload = match change_payload.as_ref() {
            Some(payload) => payload,
            None => return true,
        };

        let labels = match &change_payload.labels {
            Some(labels) => labels,
            None => return true,
        };

        let properties = match &change_payload.properties {
            Some(properties) => properties,
            None => return true,
        };

        let element_type = match &self.element_type {
            Some(element_type) => element_type,
            None => return true,
        };

        match element_type {
            ElementType::Node => {
                for subscription_node in &subscription.nodes {
                    if labels.contains(&subscription_node.source_label) {
                        match &subscription_node.partition_key {
                            Some(partition_key) => match properties.get(partition_key) {
                                Some(value) => {
                                    let value_partition_id = bucket_value(value, partition_count);
                                    if value_partition_id == partition_id {
                                        return true;
                                    }
                                }
                                None => return true,
                            },
                            None => return true,
                        }
                    }
                }
            }
            ElementType::Relation => {
                for subscription_node in &subscription.relations {
                    if labels.contains(&subscription_node.source_label) {
                        match &subscription_node.partition_key {
                            Some(partition_key) => match properties.get(partition_key) {
                                Some(value) => {
                                    let value_partition_id = bucket_value(value, partition_count);
                                    if value_partition_id == partition_id {
                                        return true;
                                    }
                                }
                                None => return true,
                            },
                            None => return true,
                        }
                    }
                }
            }
        }
        false
    }
}
