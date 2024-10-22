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

use std::sync::Arc;

use super::{ResourceProviderDomainService, ResourceProviderDomainServiceImpl};
use crate::{domain::models::ReactionProviderMarker, ProviderRepository};
use dapr::client::TonicClient;

pub type ReactionProviderDomainService = dyn ResourceProviderDomainService<ReactionProviderMarker>;
pub type ReactionProviderDomainServiceImpl =
    ResourceProviderDomainServiceImpl<ReactionProviderMarker>;

impl ReactionProviderDomainServiceImpl {
    pub fn new(dapr_client: dapr::Client<TonicClient>, repo: Arc<ProviderRepository>) -> Self {
        ReactionProviderDomainServiceImpl {
            dapr_client,
            repo,
            validators: vec![],
            _marker: std::marker::PhantomData,
        }
    }
}
