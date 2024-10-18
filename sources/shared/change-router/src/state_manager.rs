use serde_json::Value;

pub struct DaprStateManager {
    client: reqwest::Client,
    dapr_host: String,
    dapr_port: u16,
    store_name: String,
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
        state_entry: Value,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let url = format!(
            "http://{}:{}/v1.0/state/{}?metadata.contentType=application/json",
            self.dapr_host, self.dapr_port, self.store_name
        );


        let mut request_headers = reqwest::header::HeaderMap::new();
        request_headers.insert("Content-Type", "application/json".parse().unwrap());

        // check if the state entry is a json array
        match state_entry.as_array() {
            Some(entry) => {
                // check each entry, if it is a string continue
                // if it is an object, check if it has a "key" field and a "value" field
                for entry in entry {
                    match entry {
                        Value::Object(obj) => {
                            if !obj.contains_key("key") || !obj.contains_key("value") {
                                return Err(Box::from("State entry object must have 'key' and 'value' fields"));
                            }
                        }
                        _ => return Err(Box::from("State entry must be a JSON array of objects")),
                    }
                }
            }
            None => return Err(Box::from("State entry must be a JSON array")),
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