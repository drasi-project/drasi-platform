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

use std::{sync::Arc, time::SystemTime};

use async_trait::async_trait;
use drasi_core::interface::{FutureElementRef, FutureQueueConsumer};

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
            .map_err(|e| format!("Error serializing future change: {e:?}"))?;

        self.publisher
            .publish(data, None, None)
            .await
            .map_err(|e| format!("Error publishing future change: {e:?}"))?;

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
        SystemTime::now()
            .duration_since(SystemTime::UNIX_EPOCH)
            .expect("SystemTime before UNIX EPOCH")
            .as_secs()
            * 1000
    }
}
