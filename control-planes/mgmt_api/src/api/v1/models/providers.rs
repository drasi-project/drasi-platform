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
