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

use serde::Deserialize;
use serde::Serialize;

use super::ConfigValueDto;

use super::ServiceConfigDto;
use super::ServiceIdentityDto;

use std::collections::BTreeMap;
use std::collections::HashMap;

#[derive(Serialize, Deserialize, Debug)]
#[serde(tag = "kind")]
pub struct SourceSpecDto {
    pub kind: String,
    pub services: Option<HashMap<String, ServiceConfigDto>>,
    pub properties: Option<HashMap<String, ConfigValueDto>>,
    pub identity: Option<ServiceIdentityDto>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct SourceStatusDto {
    pub available: bool,
    pub messages: Option<BTreeMap<String, String>>,
}
