use serde::Deserialize;
use serde::Serialize;

use super::ConfigValueDto;

use super::ServiceDto;

use std::collections::BTreeMap;
use std::collections::HashMap;

#[derive(Serialize, Deserialize, Debug)]
#[serde(tag = "kind")]
pub struct SourceSpecDto {
    pub kind: String,
    pub services: Option<HashMap<String, Option<ServiceDto>>>,
    pub properties: Option<HashMap<String, Option<ConfigValueDto>>>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct SourceStatusDto {
    pub available: bool,
    pub messages: Option<BTreeMap<String, String>>,
}
