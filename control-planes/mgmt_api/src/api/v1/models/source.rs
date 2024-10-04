use serde::Deserialize;
use serde::Serialize;

use super::ConfigValueDto;

use super::ServiceConfigDto;

use std::collections::BTreeMap;
use std::collections::HashMap;

#[derive(Serialize, Deserialize, Debug)]
#[serde(tag = "kind")]
pub struct SourceSpecDto {
    pub kind: String,
    pub services: Option<HashMap<String, ServiceConfigDto>>,
    pub properties: Option<HashMap<String, ConfigValueDto>>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct SourceStatusDto {
    pub available: bool,
    pub messages: Option<BTreeMap<String, String>>,
}
