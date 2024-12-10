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

use std::{env, error::Error};

pub use async_stream::stream;
use axum::async_trait;

mod dapr_publisher;
mod dapr_statestore;
mod debug_publisher;
mod memory_statestore;
mod models;
mod proxy;
mod reactivator;
mod telemetry;

pub use debug_publisher::DebugPublisher;
pub use memory_statestore::MemoryStateStore;
pub use models::*;
pub use proxy::*;
pub use reactivator::*;
use tokio::signal;

#[async_trait]
pub trait Publisher {
    async fn publish(&self, change: SourceChange) -> Result<(), Box<dyn Error + Send + Sync>>;
}

#[async_trait]
pub trait StateStore {
    async fn get(&self, id: &str) -> Result<Option<Vec<u8>>, Box<dyn Error + Send + Sync>>;
    async fn put(&self, id: &str, data: Vec<u8>) -> Result<(), Box<dyn Error + Send + Sync>>;
    async fn delete(&self, id: &str) -> Result<(), Box<dyn Error + Send + Sync>>;
}

pub fn get_config_value(key: &str) -> Option<String> {
    match env::var(key) {
        Ok(s) => Some(s),
        Err(_) => None,
    }
}

async fn shutdown_signal() {
    let ctrl_c = async {
        signal::ctrl_c()
            .await
            .expect("failed to install Ctrl+C handler");
    };

    let terminate = async {
        signal::unix::signal(signal::unix::SignalKind::terminate())
            .expect("failed to install signal handler")
            .recv()
            .await;
    };

    let interrupt = async {
        signal::unix::signal(signal::unix::SignalKind::interrupt())
            .expect("failed to install signal handler")
            .recv()
            .await;
    };

    tokio::select! {
        _ = ctrl_c => {},
        _ = terminate => {},
        _ = interrupt => {}
    }
}
