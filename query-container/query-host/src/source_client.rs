use std::{error::Error, sync::Arc};

use drasi_core::models::{ElementMetadata, ElementReference, SourceChange};
use serde::Deserialize;
use serde_json::{json, Map, Value};

use crate::{
    models::QuerySubscription,
    partition_selector::{self, PartitionSelector},
};

#[derive(Debug)]
pub struct SourceClient {
    client: reqwest::Client,
    dapr_host: String,
    dapr_port: u16,
}

impl SourceClient {
    pub fn new(client: reqwest::Client, dapr_host: String, dapr_port: u16) -> SourceClient {
        SourceClient {
            client,
            dapr_host,
            dapr_port,
        }
    }

    pub async fn subscribe(
        &self,
        query_container_id: &str,
        query_id: &str,
        source_id: &str,
        subscription: &QuerySubscription,
        partition_id: u64,
        partition_count: u64,
    ) -> Result<Vec<SourceChange>, Box<dyn Error>> {
        let app_id = format!("{}-query-api", source_id);
        let data = json!({
            "queryNodeId": query_container_id,
            "queryId": query_id,
            "nodeLabels": subscription.nodes.iter().map(|l| l.source_label.clone()).collect::<Vec<String>>(),
            "relLabels": subscription.relations.iter().map(|l| l.source_label.clone()).collect::<Vec<String>>(),
        });

        let response = self
            .client
            .post(format!(
                "http://{}:{}/v1.0/invoke/{}/method/subscription",
                self.dapr_host, self.dapr_port, app_id
            ))
            .json(&data)
            .send()
            .await;

        match response {
            Ok(response) => {
                let data: BootstrapEvents = response.json().await?;
                Ok(
                    data.into_source_changes(
                        source_id,
                        subscription,
                        partition_id,
                        partition_count,
                    ),
                )
            }
            Err(e) => Err(Box::new(e)),
        }
    }
}

#[derive(Deserialize)]
struct BootstrapEvents {
    nodes: Vec<BootstrapNode>,
    rels: Vec<BootstrapRelation>,
}

#[derive(Deserialize)]
struct BootstrapNode {
    id: String,
    labels: Vec<String>,
    properties: Map<String, Value>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct BootstrapRelation {
    id: String,
    labels: Vec<String>,
    properties: Map<String, Value>,
    start_id: String,
    end_id: String,
}

impl BootstrapEvents {
    fn into_source_changes(
        self,
        source_id: &str,
        subscription: &QuerySubscription,
        partition_id: u64,
        partition_count: u64,
    ) -> Vec<SourceChange> {
        let mut changes = Vec::new();

        for node in self.nodes {
            if !node.include_in_partition(subscription, partition_id, partition_count) {
                continue;
            }
            changes.push(SourceChange::Insert {
                element: drasi_core::models::Element::Node {
                    metadata: ElementMetadata {
                        reference: ElementReference::new(source_id, &node.id),
                        labels: Arc::from(
                            Vec::from_iter(node.labels.iter().map(|l| Arc::from(l.as_str())))
                                .into_boxed_slice(),
                        ),
                        effective_from: 0,
                    },
                    properties: (&node.properties).into(),
                },
            });
        }

        for rel in self.rels {
            if !rel.include_in_partition(subscription, partition_id, partition_count) {
                continue;
            }
            changes.push(SourceChange::Insert {
                element: drasi_core::models::Element::Relation {
                    metadata: ElementMetadata {
                        reference: ElementReference::new(source_id, &rel.id),
                        labels: Arc::from(
                            Vec::from_iter(rel.labels.iter().map(|l| Arc::from(l.as_str())))
                                .into_boxed_slice(),
                        ),
                        effective_from: 0,
                    },
                    properties: (&rel.properties).into(),
                    in_node: ElementReference::new(source_id, rel.start_id.as_str()),
                    out_node: ElementReference::new(source_id, rel.end_id.as_str()),
                },
            });
        }

        changes
    }
}

impl PartitionSelector for BootstrapNode {
    fn include_in_partition(
        &self,
        subscription: &QuerySubscription,
        partition_id: u64,
        partition_count: u64,
    ) -> bool {
        for subscription_node in &subscription.nodes {
            if self.labels.contains(&subscription_node.source_label) {
                match &subscription_node.partition_key {
                    Some(partition_key) => {
                        match self.properties.get(partition_key) {
                            Some(value) => {}
                            None => return true,
                        }
                        if let Some(value) = self.properties.get(partition_key) {
                            let value_partition_id =
                                partition_selector::bucket_value(value, partition_count);
                            if value_partition_id == partition_id {
                                return true;
                            }
                        }
                    }
                    None => return true,
                }
            }
        }
        false
    }
}

impl PartitionSelector for BootstrapRelation {
    fn include_in_partition(
        &self,
        subscription: &QuerySubscription,
        partition_id: u64,
        partition_count: u64,
    ) -> bool {
        for subscription_node in &subscription.relations {
            if self.labels.contains(&subscription_node.source_label) {
                match &subscription_node.partition_key {
                    Some(partition_key) => {
                        match self.properties.get(partition_key) {
                            Some(value) => {}
                            None => return true,
                        }
                        if let Some(value) = self.properties.get(partition_key) {
                            let value_partition_id =
                                partition_selector::bucket_value(value, partition_count);
                            if value_partition_id == partition_id {
                                return true;
                            }
                        }
                    }
                    None => return true,
                }
            }
        }
        false
    }
}
