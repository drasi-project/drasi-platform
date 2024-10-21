use serde_json::Value;
use serde::Deserialize;



pub struct DaprStateManager {
    client: reqwest::Client,
    dapr_host: String,
    dapr_port: u16,
    store_name: String,
}

// Used to validate the state entry objects
#[derive(Deserialize)]
struct StateEntry {
    #[serde(rename = "key")]
    _key: String,
    #[serde(rename = "value")]
    _value: Value,
}

impl DaprStateManager {
    pub fn new(dapr_host: &str, dapr_port: u16, store_name: &str) -> Self {
        DaprStateManager {
            client: reqwest::Client::new(),
            dapr_host:dapr_host.to_string(),
            dapr_port,
            store_name: store_name.to_string(),
        }
    }

    pub async fn save_state(
        &self,
        state_entry: Vec<Value>,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let url = format!(
            "http://{}:{}/v1.0/state/{}?metadata.contentType=application/json",
            self.dapr_host, self.dapr_port, self.store_name
        );


        let mut request_headers = reqwest::header::HeaderMap::new();
        request_headers.insert("Content-Type", "application/json".parse().unwrap());

        // Validate the state entry objects
        for entry in &state_entry {
            let _ = match serde_json::from_value::<StateEntry>(entry.clone()) {
                Ok(_) => (),
                Err(_e) => return Err(Box::from("State entry object must have 'key' and 'value' fields")),
            };
        }
        let response = self.client.post(url).headers(request_headers).json(&state_entry).send().await;

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