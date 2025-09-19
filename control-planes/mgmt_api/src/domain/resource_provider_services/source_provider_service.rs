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
use crate::{domain::models::SourceProviderMarker, persistence::ProviderRepository};
pub type SourceProviderDomainService = dyn ResourceProviderDomainService<SourceProviderMarker>;
pub type SourceProviderDomainServiceImpl = ResourceProviderDomainServiceImpl<SourceProviderMarker>;

impl SourceProviderDomainServiceImpl {
    pub fn new(
        _dapr_client: dapr::Client<dapr::client::TonicClient>,
        repo: Arc<ProviderRepository>,
    ) -> Self {
        SourceProviderDomainServiceImpl {
            repo,
            validators: vec![],
            _marker: std::marker::PhantomData,
        }
    }
}
