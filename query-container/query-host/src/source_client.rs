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

use async_stream::stream;
use drasi_core::models::{QuerySubscription, SourceChange};
use futures::{Stream, StreamExt};
use reqwest_streams::JsonStreamResponse;
use serde_json::json;

use crate::models::BootstrapError;

#[derive(Debug)]
pub struct SourceClient {
    client: reqwest::Client,
}

impl SourceClient {
    pub fn new(client: reqwest::Client) -> SourceClient {
        SourceClient { client }
    }

    pub async fn subscribe(
        &self,
        query_container_id: String,
        query_id: String,
        subscription: QuerySubscription,
    ) -> Result<impl Stream<Item = Result<SourceChange, BootstrapError>>, BootstrapError> {
        let app_id = format!("{}-query-api", subscription.id);
        let data = json!({
            "queryNodeId": query_container_id,
            "queryId": query_id,
            "nodeLabels": subscription.nodes.iter().map(|l| l.source_label.clone()).collect::<Vec<String>>(),
            "relLabels": subscription.relations.iter().map(|l| l.source_label.clone()).collect::<Vec<String>>(),
        });
        let resp = match self
            .client
            .post(format!("http://{}/subscription", app_id))
            .json(&data)
            .send()
            .await
        {
            Ok(resp) => resp,
            Err(e) => {
                return Err(BootstrapError::fetch_failed(
                    subscription.id.to_string(),
                    Box::new(e),
                ))
            }
        };

        if !resp.status().is_success() {
            return Err(BootstrapError::fetch_failed(
                subscription.id.to_string(),
                Box::new(std::io::Error::new(
                    std::io::ErrorKind::Other,
                    format!(
                        "{} {}",
                        resp.status(),
                        resp.text().await.unwrap_or_default()
                    ),
                )),
            ));
        }

        let mut stream = resp.json_nl_stream::<v2::BootstrapElement>(usize::MAX);

        Ok(stream! {
            while let Some(element) = stream.next().await {
                match element {
                    Ok(element) => yield Ok(element.into_source_change(subscription.id.as_ref())),
                    Err(e) => yield Err(BootstrapError::fetch_failed(subscription.id.to_string(), Box::new(e))),
                }
            }
        })
    }
}

mod v2 {
    use std::sync::Arc;

    use drasi_core::models::{ElementMetadata, ElementReference, SourceChange};
    use serde::Deserialize;
    use serde_json::{Map, Value};

    #[derive(Deserialize)]
    #[serde(rename_all = "camelCase")]
    pub struct BootstrapElement {
        id: String,
        labels: Vec<String>,
        properties: Map<String, Value>,
        start_id: Option<String>,
        end_id: Option<String>,
    }

    impl BootstrapElement {
        pub fn into_source_change(self, source_id: &str) -> SourceChange {
            match self.start_id {
                Some(start_id) => SourceChange::Insert {
                    element: drasi_core::models::Element::Relation {
                        metadata: ElementMetadata {
                            reference: ElementReference::new(source_id, &self.id),
                            labels: Arc::from(
                                Vec::from_iter(self.labels.iter().map(|l| Arc::from(l.as_str())))
                                    .into_boxed_slice(),
                            ),
                            effective_from: 0,
                        },
                        properties: (&self.properties).into(),
                        in_node: ElementReference::new(source_id, start_id.as_str()),
                        out_node: ElementReference::new(source_id, self.end_id.unwrap().as_str()),
                    },
                },
                None => SourceChange::Insert {
                    element: drasi_core::models::Element::Node {
                        metadata: ElementMetadata {
                            reference: ElementReference::new(source_id, &self.id),
                            labels: Arc::from(
                                Vec::from_iter(self.labels.iter().map(|l| Arc::from(l.as_str())))
                                    .into_boxed_slice(),
                            ),
                            effective_from: 0,
                        },
                        properties: (&self.properties).into(),
                    },
                },
            }
        }
    }
}
