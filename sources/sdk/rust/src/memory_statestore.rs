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

use std::{collections::HashMap, sync::Arc};

use axum::async_trait;
use tokio::sync::Mutex;

use crate::StateStore;

pub struct MemoryStateStore {
    data: Arc<Mutex<HashMap<String, Vec<u8>>>>,
}

impl MemoryStateStore {
    pub fn new() -> Self {
        MemoryStateStore {
            data: Arc::new(Mutex::new(HashMap::new())),
        }
    }
}

#[async_trait]
impl StateStore for MemoryStateStore {
    async fn get(
        &self,
        id: &str,
    ) -> Result<Option<Vec<u8>>, Box<dyn std::error::Error + Send + Sync>> {
        let data = self.data.lock().await;
        Ok(data.get(id).cloned())
    }

    async fn put(
        &self,
        id: &str,
        value: Vec<u8>,
    ) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        let mut data = self.data.lock().await;
        data.insert(id.to_string(), value);
        Ok(())
    }

    async fn delete(&self, id: &str) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        let mut data = self.data.lock().await;
        data.remove(id);
        Ok(())
    }
}
