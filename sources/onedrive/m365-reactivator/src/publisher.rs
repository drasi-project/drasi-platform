use std::time::Duration;

use crate::api::{ChangeMessage, ChangeElement};

pub struct Publisher {
    client: dapr::Client<dapr::client::TonicClient>,
    pubsub_name: String,
    topic: String,
    data_content_type: String,}

impl Publisher {

    pub async fn new() -> Self {
        
        tokio::time::sleep(Duration::from_secs(2)).await;

        let port: u16 = std::env::var("DAPR_GRPC_PORT").unwrap_or("3501".to_string()).parse().unwrap();
        let addr = format!("https://127.0.0.1:{}", port);
        let source_id = std::env::var("SOURCE_ID").expect("SOURCE_ID not set");

        let client = dapr::Client::<dapr::client::TonicClient>::connect(addr).await.expect("Unable to connect to Dapr");

        let pubsub_name = std::env::var("PubSubName").unwrap_or("rg-pubsub".to_string());
        let data_content_type = "application/json".to_string();

        let topic = format!("{}-change", source_id);

        Self {
            client,
            pubsub_name,
            topic,
            data_content_type,
        }
    }

    pub async fn publish(&self, events: Vec<ChangeMessage<ChangeElement>>) -> Result<(), Box<dyn std::error::Error>> {
        log::info!("Publishing {} events", events.len());
        let data = serde_json::to_vec(&events)?;

        let mut client = self.client.clone();
        client.publish_event(&self.pubsub_name, &self.topic, &self.data_content_type, data, None).await?;

        Ok(())
    }
}