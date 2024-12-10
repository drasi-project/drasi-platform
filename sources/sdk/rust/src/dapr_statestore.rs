use std::env;

use axum::async_trait;
use dapr::Client;

use crate::StateStore;

pub struct DaprStateStore {
    client: dapr::Client::<dapr::client::TonicClient>,
    store_name: String,
}

impl DaprStateStore {
    pub async fn connect() -> Result<Self, dapr::error::Error> {
        Ok(DaprStateStore {
            client: Client::<dapr::client::TonicClient>::connect("https://127.0.0.1".to_string()).await?,
            store_name: match env::var("STATE_STORE_NAME") {
                Ok(val) => val,
                Err(_) => "drasi-state".to_string(),
            },
        })
    }
    
}

#[async_trait]
impl StateStore for DaprStateStore {

    async fn get(&self, id: &str) -> Result<Option<Vec<u8>>, Box<dyn std::error::Error + Send + Sync>> {
        let mut dapr_client = self.client.clone();
        let response = dapr_client.get_state(self.store_name.as_str(), id, None).await?;
        if response.data.len() == 0 {
            return Ok(None);
        }
        Ok(Some(response.data))
    }

    async fn put(&self, id: &str, value: Vec<u8>) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {            
        let mut dapr_client = self.client.clone();
        dapr_client.save_state(self.store_name.as_str(), [(id, value)]).await?;
        Ok(())
    }

    async fn delete(&self, id: &str) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        let mut dapr_client = self.client.clone();
        dapr_client.delete_state(self.store_name.as_str(), id, None).await?;
        Ok(())
    }    
}