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
use std::collections::{BTreeMap, HashMap};
use thiserror::Error;

pub trait HasKind {
    fn kind(&self) -> &str;
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Resource<TSpec, TStatus> {
    pub id: String,
    pub spec: TSpec,
    pub status: Option<TStatus>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ResourceProvider<TSpec> {
    pub id: String,
    pub spec: TSpec,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(tag = "kind")]
pub enum ConfigValue {
    Inline { value: InlineValue },
    Secret { name: String, key: String },
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum InlineValue {
    String { value: String },
    Integer { value: i64 },
    Boolean { value: bool },
    List { value: Vec<ConfigValue> },
}

impl Default for ConfigValue {
    fn default() -> Self {
        ConfigValue::Inline {
            value: InlineValue::String {
                value: "".to_string(),
            },
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(tag = "kind")]
pub struct SourceSpec {
    pub kind: String,
    pub services: Option<HashMap<String, ServiceConfig>>,
    pub properties: Option<HashMap<String, ConfigValue>>,
    pub identity: Option<ServiceIdentity>,
}

impl HasKind for SourceSpec {
    fn kind(&self) -> &str {
        &self.kind
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct SourceStatus {
    pub available: bool,
    pub messages: Option<BTreeMap<String, String>>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(tag = "kind")]
pub enum StorageSpec {
    #[serde(rename_all = "camelCase")]
    Memory { enable_archive: bool },
    #[serde(rename_all = "camelCase")]
    Redis {
        connection_string: ConfigValue,
        cache_size: Option<u32>,
    },
    #[serde(rename_all = "camelCase")]
    RocksDb {
        enable_archive: bool,
        storage_class: Option<String>,
        direct_io: bool,
    },
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct QueryContainerSpec {
    pub query_host_count: u16,
    pub results: HashMap<String, ConfigValue>,
    pub storage: HashMap<String, StorageSpec>,
    pub default_store: String,
}
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct QueryContainerStatus {
    pub available: bool,
    pub messages: Option<BTreeMap<String, String>>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ReactionSpec {
    pub kind: String,
    pub tag: Option<String>,
    pub services: Option<HashMap<String, ServiceConfig>>,
    pub properties: Option<HashMap<String, ConfigValue>>,
    pub queries: HashMap<String, String>,
    pub identity: Option<ServiceIdentity>,
}

impl HasKind for ReactionSpec {
    fn kind(&self) -> &str {
        &self.kind
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ReactionStatus {
    pub available: bool,
    pub messages: Option<BTreeMap<String, String>>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ReactionProviderStatus {
    pub available: bool,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct QuerySourceLabel {
    pub source_label: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct QuerySubscription {
    pub id: String,
    pub nodes: Vec<QuerySourceLabel>,
    pub relations: Vec<QuerySourceLabel>,
    pub pipeline: Vec<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct QueryJoinKey {
    pub label: String,
    pub property: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct QueryJoin {
    pub id: String,
    pub keys: Vec<QueryJoinKey>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum QueryLanguage {
    #[serde(rename = "Cypher")]
    Cypher,
    #[serde(rename = "GQL")]
    GQL,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct QuerySpec {
    pub container: String,
    pub mode: String,
    pub query: String,
    pub query_language: Option<QueryLanguage>,
    pub sources: QuerySources,
    pub storage_profile: Option<String>,
    pub view: ViewSpec,
    pub transient: Option<bool>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct SourceMiddlewareConfig {
    pub kind: String,
    pub name: String,

    #[serde(flatten)]
    pub config: Map<String, Value>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct QuerySources {
    pub subscriptions: Vec<QuerySubscription>,
    pub joins: Vec<QueryJoin>,
    pub middleware: Vec<SourceMiddlewareConfig>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct QueryStatus {
    pub host_name: String,
    pub status: String,
    pub container: String,
    pub error_message: Option<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct SourceProviderStatus {
    pub available: bool,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ProviderSpec {
    pub services: HashMap<String, ProviderService>,
    pub config_schema: Option<JsonSchema>,
}

pub struct SourceProviderMarker;
pub struct ReactionProviderMarker;

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ProviderService {
    pub image: String,
    pub external_image: Option<bool>,
    pub dapr: Option<HashMap<String, String>>,
    pub endpoints: Option<HashMap<String, ServiceEndpoint>>,
    pub config_schema: Option<JsonSchema>,
    pub deprovision_handler: Option<bool>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ServiceEndpoint {
    pub setting: EndpointSetting,
    pub target: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ServiceConfig {
    pub replica: Option<String>,
    pub image: Option<String>,
    pub external_image: Option<bool>,
    pub dapr: Option<HashMap<String, ConfigValue>>,
    pub endpoints: Option<HashMap<String, Endpoint>>,
    pub properties: Option<HashMap<String, ConfigValue>>,
    pub deprovision_handler: Option<bool>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(tag = "kind")]
pub enum ServiceIdentity {
    MicrosoftEntraWorkloadID {
        #[serde(rename = "clientId")]
        client_id: String,
    },
    MicrosoftEntraApplication {
        #[serde(rename = "tenantId")]
        tenant_id: ConfigValue,

        #[serde(rename = "clientId")]
        client_id: ConfigValue,

        secret: Option<ConfigValue>,

        certificate: Option<ConfigValue>,
    },
    ConnectionString {
        #[serde(rename = "connectionString")]
        connection_string: ConfigValue,
    },
    AccessKey {
        #[serde(rename = "accessKey")]
        access_key: ConfigValue,
    },
    AwsIamRole {
        #[serde(rename = "roleArn")]
        role_arn: ConfigValue,
    },
    AwsIamAccessKey {
        #[serde(rename = "accessKeyId")]
        access_key_id: ConfigValue,
        #[serde(rename = "secretAccessKey")]
        secret_access_key: ConfigValue,
        #[serde(rename = "region")]
        aws_region: ConfigValue,
    },
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Endpoint {
    pub setting: EndpointSetting,
    pub target: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub enum EndpointSetting {
    Internal,
    External,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ViewSpec {
    pub enabled: bool,
    pub retention_policy: RetentionPolicy,
}

#[derive(Serialize, Deserialize, Debug, Clone, Copy)]
#[serde(rename_all = "camelCase")]
pub enum RetentionPolicy {
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

#[derive(Debug, Clone)]
pub struct ChangeStreamConfig {
    pub redis_url: String,
    pub buffer_size: usize,
    pub fetch_batch_size: usize,
}

#[derive(Debug, Error)]
pub enum DomainError {
    #[error("Resource not found")]
    NotFound,

    #[error("Invalid: {message}")]
    Invalid { message: String },

    #[error("QueryContainerOffline")]
    QueryContainerOffline,

    #[error("Internal: {inner}")]
    Internal { inner: Box<dyn std::error::Error> },

    #[error("UndefinedSetting: {message}")]
    UndefinedSetting { message: String },

    #[error("InvalidSpec: {message}")]
    InvalidSpec { message: String },

    #[error("JsonParseError: {message}")]
    JsonParseError { message: String },

    #[error("Cancelled")]
    Cancelled,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct JsonSchema {
    #[serde(rename = "$schema", skip_serializing_if = "Option::is_none")]
    pub schema: Option<String>,

    #[serde(rename = "type")]
    pub schema_type: SchemaType,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub properties: Option<std::collections::HashMap<String, JsonSchema>>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub required: Option<Vec<String>>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub items: Option<Box<JsonSchema>>, // For array types

    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "enum")]
    pub enum_values: Option<Vec<serde_json::Value>>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub format: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub minimum: Option<f64>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub maximum: Option<f64>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub min_length: Option<u64>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub max_length: Option<u64>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub default: Option<Value>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "lowercase")]
pub enum SchemaType {
    Object,
    Array,
    String,
    Number,
    Integer,
    Boolean,
    Null,
}
