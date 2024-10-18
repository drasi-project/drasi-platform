use async_trait::async_trait;
use drasi_comms_abstractions::comms::{Headers, Invoker, Publisher, StateManager};
use serde_json::Value;
pub struct DaprHttpPublisher {
    client: reqwest::Client,
    dapr_host: String,
    dapr_port: u16,
    pubsub: String,
    topic: String,
}

#[async_trait]
impl Publisher for DaprHttpPublisher {
    fn new(dapr_host: String, dapr_port: u16, pubsub: String, topic: String) -> Self {
        DaprHttpPublisher {
            client: reqwest::Client::new(),
            dapr_host,
            dapr_port,
            pubsub,
            topic,
        }
    }

    async fn publish(
        &self,
        data: Value,
        headers: Headers,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let mut request = self
            .client
            .post(format!(
                "http://{}:{}/v1.0/publish/{}/{}",
                self.dapr_host, self.dapr_port, self.pubsub, self.topic
            ))
            .json(&data);

        for (key, value) in headers.headers.iter() {
            request = request.header(key, value);
        }

        let response = request.send().await;

        match response {
            Ok(resp) => {
                if resp.status().is_success() {
                    Ok(())
                } else {
                    let error_message = format!(
                        "Dapr publish request failed with status: {} and body: {}",
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

#[derive(Debug, Clone)]
pub struct DaprHttpInvoker {
    client: reqwest::Client,
    dapr_host: String,
    dapr_port: u16,
}

#[async_trait]
impl Invoker for DaprHttpInvoker {
    fn new(dapr_host: String, dapr_port: u16) -> Self {
        DaprHttpInvoker {
            client: reqwest::Client::new(),
            dapr_host,
            dapr_port,
        }
    }

    async fn invoke(
        &self,
        data: Value,
        app_id: String,
        method: String,
        headers: Headers,
    ) -> Result<bytes::Bytes, Box<dyn std::error::Error>> {
        let url = format!("http://{}:{}/{}", self.dapr_host, self.dapr_port, method);

        let mut request_headers = reqwest::header::HeaderMap::new();
        let headers = headers.headers.clone();
        for (key, value) in headers.iter() {
            request_headers.insert(
                key.parse::<reqwest::header::HeaderName>().unwrap(),
                value.parse().unwrap(),
            );
        }

        if !request_headers.contains_key("Content-Type") {
            request_headers.insert("Content-Type", "application/json".parse().unwrap());
        }

        request_headers.insert("dapr-app-id", app_id.parse().unwrap());

        let response = self
            .client
            .post(url)
            .headers(request_headers)
            .json(&data)
            .send()
            .await;

        match response {
            Ok(resp) => {
                if resp.status().is_success() {
                    Ok(resp.bytes().await?)
                } else {
                    let error_message = format!(
                        "Service invocation request failed with status: {} and body: {}",
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


pub struct DaprStateManager {
    client: reqwest::Client,
    dapr_host: String,
    dapr_port: u16,
    store_name: String,
}

#[async_trait]
impl StateManager for DaprStateManager {
    fn new(dapr_host: &str, dapr_port: u16, store_name: &str) -> Self {
        DaprStateManager {
            client: reqwest::Client::new(),
            dapr_host:dapr_host.to_string(),
            dapr_port,
            store_name: store_name.to_string(),
        }
    }

    async fn save_state(
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
                        Value::String(_) => continue,
                        Value::Object(obj) => {
                            if !obj.contains_key("key") || !obj.contains_key("value") {
                                return Err(Box::from("State entry object must have 'key' and 'value' fields"));
                            }
                        }
                        _ => return Err(Box::from("State entry must be a JSON array of strings or objects")),
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