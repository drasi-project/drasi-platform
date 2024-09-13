use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use serde_json::Value;

use super::ConfigValueDto;

#[derive(Serialize, Deserialize, Debug)]
pub struct SourceProviderSpecDto {
    pub services: HashMap<String, Value>,
    pub config_schema: Option<Value>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ReactionProviderSpecDto {
    pub services: HashMap<String, Value>,
    pub config_schema: Option<Value>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ServiceDto {
    pub replica: Option<String>,
    pub image: Option<String>,
    pub endpoints: Option<HashMap<String, EndpointDto>>,
    pub dapr: Option<HashMap<String, ConfigValueDto>>,
    pub properties: Option<HashMap<String, Option<ConfigValueDto>>>,
    // pub config_schema: Option<Value>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct EndpointDto {
    pub setting: EndpointSettingDto,
    pub target: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum EndpointSettingDto {
    Internal,
    External,
}
