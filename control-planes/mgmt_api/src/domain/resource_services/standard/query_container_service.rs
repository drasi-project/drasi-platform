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

use super::{ResourceDomainService, StandardResourceDomainServiceImpl};
use crate::{
    domain::models::{QueryContainerSpec, QueryContainerStatus},
    persistence::QueryContainerRepository,
};
use dapr::client::TonicClient;

pub type QueryContainerDomainService =
    dyn ResourceDomainService<QueryContainerSpec, QueryContainerStatus> + Send + Sync;
pub type QueryContainerDomainServiceImpl = StandardResourceDomainServiceImpl<
    QueryContainerSpec,
    QueryContainerStatus,
    resource_provider_api::models::QueryContainerSpec,
    resource_provider_api::models::QueryContainerStatus,
>;

impl QueryContainerDomainServiceImpl {
    pub fn new(
        dapr_client: dapr::Client<TonicClient>,
        repo: Box<QueryContainerRepository>,
    ) -> Self {
        QueryContainerDomainServiceImpl {
            dapr_client,
            repo,
            actor_type: |_spec| "QueryContainerResource".to_string(),
            ready_check: |status| status.available,
            validators: vec![],
            _tspec: std::marker::PhantomData,
            _tstatus: std::marker::PhantomData,
            _tapi_spec: std::marker::PhantomData,
            _tapi_status: std::marker::PhantomData,
        }
    }
}
