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

use std::pin::Pin;

use async_trait::async_trait;
use futures::Stream;

use crate::{
    api::{ResultChangeEvent, RetentionPolicy, ViewElement},
    models::ViewError,
};

pub type ViewStream = Pin<Box<dyn Stream<Item = ViewElement> + Send>>;
//pub type ViewStream = dyn Stream<Item = Result<ViewElement, ViewError>>;

#[async_trait]
pub trait ViewStore: Send + Sync {
    async fn init_view(&self, query_id: &str, policy: RetentionPolicy) -> Result<(), ViewError>;
    async fn set_retention_policy(
        &self,
        query_id: &str,
        policy: RetentionPolicy,
    ) -> Result<(), ViewError>;
    async fn delete_view(&self, query_id: &str) -> Result<(), ViewError>;
    async fn record_change(
        &self,
        query_id: &str,
        change: ResultChangeEvent,
    ) -> Result<(), ViewError>;
    async fn get_view(
        &self,
        query_id: &str,
        timestamp: Option<u64>,
    ) -> Result<ViewStream, ViewError>;
    async fn set_state(
        &self,
        query_id: &str,
        sequence: u64,
        ts: u64,
        state: &str,
    ) -> Result<(), ViewError>;
}
