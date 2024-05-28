use std::{sync::Arc, time::SystemTime};

use async_trait::async_trait;
use drasi_query_core::interface::{FutureElementRef, FutureQueueConsumer};

use crate::{api::ChangeEvent, change_stream};

pub struct FutureConsumer {
    publisher: Arc<change_stream::publisher::Publisher>,
    query_id: String,
}

impl FutureConsumer {
    pub fn new(publisher: Arc<change_stream::publisher::Publisher>, query_id: String) -> Self {
        FutureConsumer {
            publisher,
            query_id,
        }
    }
}

#[async_trait]
impl FutureQueueConsumer for FutureConsumer {
    async fn on_due(
        &self,
        future_ref: &FutureElementRef,
    ) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        let change = ChangeEvent::from_future_ref(future_ref, self.query_id.as_str());
        let data = serde_json::to_string(&change)
            .map_err(|e| format!("Error serializing future change: {:?}", e))?;

        self.publisher
            .publish(data, None, None)
            .await
            .map_err(|e| format!("Error publishing future change: {:?}", e))?;

        Ok(())
    }
    async fn on_error(
        &self,
        future_ref: &FutureElementRef,
        error: Box<dyn std::error::Error + Send + Sync>,
    ) {
        log::error!(
            "Error processing {} off future queue: {:?}",
            future_ref.element_ref,
            error
        );
    }

    fn now(&self) -> u64 {
        let now = SystemTime::now()
            .duration_since(SystemTime::UNIX_EPOCH)
            .unwrap()
            .as_secs()
            * 1000;
        now
    }
}
