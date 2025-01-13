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

use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use serde_json::Value;

use super::ConfigValueDto;

#[derive(Serialize, Deserialize, Debug)]
pub struct ProviderSpecDto {
    pub services: HashMap<String, ProviderServiceDto>,
    pub config_schema: Option<JsonSchemaDto>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ProviderServiceDto {
    pub image: String,
    #[serde(rename = "externalImage")]
    pub external_image: Option<bool>,
    pub dapr: Option<HashMap<String, String>>,
    pub endpoints: Option<HashMap<String, ServiceEndpointDto>>,
    pub config_schema: Option<JsonSchemaDto>,
    #[serde(rename = "deprovisionHandler")]
    pub deprovision_handler: Option<bool>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ServiceEndpointDto {
    pub setting: EndpointSettingDto,
    pub target: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ServiceConfigDto {
    pub endpoints: Option<HashMap<String, EndpointDto>>,
    pub dapr: Option<HashMap<String, ConfigValueDto>>,
    pub properties: Option<HashMap<String, Option<ConfigValueDto>>>,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(tag = "kind")]
pub enum ServiceIdentityDto {
    MicrosoftEntraWorkloadID {
        #[serde(rename = "clientId")]
        client_id: String,
    },
    MicrosoftEntraApplication {
        #[serde(rename = "tenantId")]
        tenant_id: ConfigValueDto,

        #[serde(rename = "clientId")]
        client_id: ConfigValueDto,

        secret: Option<ConfigValueDto>,

        certificate: Option<ConfigValueDto>,
    },
    ConnectionString {
        #[serde(rename = "connectionString")]
        connection_string: ConfigValueDto,
    },
    AccessKey {
        #[serde(rename = "accessKey")]
        access_key: ConfigValueDto,
    },
    AwsIamRole {
        #[serde(rename = "roleArn")]
        role_arn: ConfigValueDto,
    },
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct EndpointDto {
    pub setting: EndpointSettingDto,
    pub target: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub enum EndpointSettingDto {
    Internal,
    External,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct JsonSchemaDto {
    #[serde(rename = "$schema", skip_serializing_if = "Option::is_none")]
    pub schema: Option<String>,

    #[serde(rename = "type")]
    pub schema_type: SchemaTypeDto,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub properties: Option<std::collections::HashMap<String, JsonSchemaDto>>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub required: Option<Vec<String>>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub items: Option<Box<JsonSchemaDto>>, // For array types

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

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "lowercase")]
pub enum SchemaTypeDto {
    Object,
    Array,
    String,
    Number,
    Integer,
    Boolean,
    Null,
}
