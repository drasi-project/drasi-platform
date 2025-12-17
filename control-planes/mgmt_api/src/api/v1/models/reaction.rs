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

use std::collections::{BTreeMap, HashMap};

use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

use super::{ConfigValueDto, ServiceConfigDto, ServiceIdentityDto};

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct ReactionSpecDto {
    pub kind: String,
    pub tag: Option<String>,
    pub services: Option<HashMap<String, ServiceConfigDto>>,
    pub properties: Option<HashMap<String, ConfigValueDto>>,
    pub queries: HashMap<String, Option<String>>,
    pub identity: Option<ServiceIdentityDto>,
}

#[derive(Serialize, Deserialize, Debug, Clone, ToSchema)]
pub struct ReactionStatusDto {
    pub available: bool,
    pub messages: Option<BTreeMap<String, String>>,
    pub ingress_url: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct ReactionDto {
    pub id: String,
    pub spec: ReactionSpecDto,
    pub status: Option<ReactionStatusDto>,
}
