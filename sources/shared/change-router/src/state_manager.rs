use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::collections::HashMap;

pub struct DaprStateManager {
    client: reqwest::Client,
    dapr_host: String,
    dapr_port: u16,
    store_name: String,
}

// Used to validate the state entry objects
#[derive(Deserialize, Serialize)]
pub struct StateEntry {
    key: String,
    value: Value,
}

impl StateEntry {
    pub fn new(key: &str, value: Value) -> Self {
        StateEntry {
            key: key.to_string(),
            value,
        }
    }
}

impl DaprStateManager {
    pub fn new(dapr_host: &str, dapr_port: u16, store_name: &str) -> Self {
        DaprStateManager {
            client: reqwest::Client::new(),
            dapr_host: dapr_host.to_string(),
            dapr_port,
            store_name: store_name.to_string(),
        }
    }

    pub async fn query_state(
        &self,
        query_condition: Value,
        metadata: Option<HashMap<String, String>>,
    ) -> Result<Vec<Value>, Box<dyn std::error::Error>> {
        let addr = "https://127.0.0.1".to_string();
        let mut dapr_client = dapr::Client::<dapr::client::TonicClient>::connect(addr)
            .await
            .expect("Unable to connect to Dapr");

        let response = match dapr_client
            .query_state_alpha1(&self.store_name, query_condition, metadata)
            .await
        {
            Ok(response) => response.results,
            Err(e) => {
                log::error!("Error querying the Dapr state store: {:?}", e);
                vec![]
            }
        };

        // for each item in response, serialize the data field in json
        let mut result = vec![];
        for item in response {
            let data: Value = match serde_json::from_slice(&item.data) {
                Ok(data) => data,
                Err(e) => {
                    log::error!(
                        "Error parsing the response from the Dapr state query: {:?}",
                        e
                    );
                    continue;
                }
            };
            result.push(data);
        }

        Ok(result)
    }

    pub async fn save_state(
        &self,
        state_entry: Vec<StateEntry>,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let url = format!(
            "http://{}:{}/v1.0/state/{}?metadata.contentType=application/json",
            self.dapr_host, self.dapr_port, self.store_name
        );

        let mut request_headers = reqwest::header::HeaderMap::new();
        request_headers.insert("Content-Type", "application/json".parse().unwrap());

        let response = self
            .client
            .post(url)
            .headers(request_headers)
            .json(&state_entry)
            .send()
            .await;

        match response {
            Ok(resp) => {
                if resp.status().is_success() {
                    Ok(())
                } else {
                    let error_message = format!(
                        "State save request failed with status: {} and body: {}",
                        resp.status(),
                        resp.text().await.unwrap_or_default()
                    );
                    Err(Box::from(error_message))
                }
            }
            Err(e) => Err(Box::new(e)),
        }
    }
}
