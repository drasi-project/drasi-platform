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

use serde::{Deserialize, Serialize};
use serde_json::{Map, Value};
use utoipa::ToSchema;

#[derive(Serialize, Deserialize, Debug, Clone, ToSchema)]
#[allow(clippy::upper_case_acronyms)]
pub enum QueryLanguageDto {
    #[serde(rename = "Cypher")]
    Cypher,
    #[serde(rename = "GQL")]
    GQL,
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct QuerySourceLabelDto {
    pub source_label: String,
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct QuerySubscriptionDto {
    pub id: String,
    pub nodes: Option<Vec<QuerySourceLabelDto>>,
    pub relations: Option<Vec<QuerySourceLabelDto>>,
    pub pipeline: Option<Vec<String>>,
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct QueryJoinKeyDto {
    pub label: String,
    pub property: String,
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct QueryJoinDto {
    pub id: String,
    pub keys: Vec<QueryJoinKeyDto>,
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct QuerySpecDto {
    #[serde(default = "default_container")]
    pub container: String,
    pub mode: String,
    pub query: String,
    pub query_language: Option<QueryLanguageDto>,
    pub sources: QuerySourcesDto,
    pub storage_profile: Option<String>,
    pub view: Option<ViewSpecDto>,
}

pub(crate) fn default_container() -> String {
    "default".to_string()
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct SourceMiddlewareConfigDto {
    pub kind: String,
    pub name: String,

    #[serde(flatten)]
    pub config: Map<String, Value>,
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct QuerySourcesDto {
    pub subscriptions: Vec<QuerySubscriptionDto>,
    pub joins: Option<Vec<QueryJoinDto>>,
    pub middleware: Option<Vec<SourceMiddlewareConfigDto>>,
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct QueryStatusDto {
    pub host_name: String,
    pub status: String,
    pub container: String,
    pub error_message: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct ViewSpecDto {
    pub enabled: bool,
    pub retention_policy: RetentionPolicyDto,
}

#[derive(Serialize, Deserialize, Debug, Clone, Copy, ToSchema)]
#[serde(rename_all = "camelCase")]
pub enum RetentionPolicyDto {
    #[serde(rename = "latest")]
    Latest,

    #[serde(rename = "expire")]
    Expire {
        #[serde(rename = "afterSeconds")]
        after_seconds: u64,
    },

    #[serde(rename = "all")]
    All,
}

impl Default for ViewSpecDto {
    fn default() -> Self {
        ViewSpecDto {
            enabled: true,
            retention_policy: RetentionPolicyDto::Latest,
        }
    }
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct ContinuousQueryDto {
    pub id: String,
    pub spec: QuerySpecDto,
    pub status: Option<QueryStatusDto>,
}
