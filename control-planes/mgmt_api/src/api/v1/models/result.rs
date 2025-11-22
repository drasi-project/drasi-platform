// Copyright 2025 The Drasi Authors.
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

use serde::Serialize;
use serde_json::{Map, Value};
use utoipa::ToSchema;

#[derive(Serialize, ToSchema)]
#[serde(tag = "kind")]
pub enum ResultEventDto {
    #[serde(rename = "change")]
    Change(ResultChangeEventDto),

    #[serde(rename = "control")]
    Control(ResultControlEventDto),
}

#[derive(Serialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct ResultChangeEventDto {
    pub query_id: String,
    pub sequence: u64,
    pub source_time_ms: u64,
    pub added_results: Vec<Map<String, Value>>,
    pub updated_results: Vec<UpdatePayloadDto>,
    pub deleted_results: Vec<Map<String, Value>>,
    pub metadata: Option<Map<String, Value>>,
}

#[derive(Serialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct ResultControlEventDto {
    pub query_id: String,
    pub sequence: u64,
    pub source_time_ms: u64,
    pub metadata: Option<Map<String, Value>>,
    pub control_signal: ControlSignalDto,
}

#[derive(Serialize, ToSchema)]
#[serde(tag = "kind")]
pub enum ControlSignalDto {
    #[serde(rename = "bootstrapStarted")]
    BootstrapStarted,

    #[serde(rename = "bootstrapCompleted")]
    BootstrapCompleted,

    #[serde(rename = "running")]
    Running,

    #[serde(rename = "stopped")]
    Stopped,

    #[serde(rename = "deleted")]
    QueryDeleted,
}

#[derive(Serialize, ToSchema)]
pub struct UpdatePayloadDto {
    pub before: Option<Map<String, Value>>,
    pub after: Option<Map<String, Value>>,
    pub grouping_keys: Option<Vec<String>>,
}
