use std::collections::{BTreeMap, HashMap};

use serde::{Deserialize, Serialize};

use super::{ConfigValueDto, ServiceConfigDto};

#[derive(Serialize, Deserialize, Debug)]
pub struct ReactionSpecDto {
    pub kind: String,
    pub tag: Option<String>,
    pub services: Option<HashMap<String, ServiceConfigDto>>,
    pub properties: Option<HashMap<String, ConfigValueDto>>,
    pub queries: HashMap<String, Option<String>>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ReactionStatusDto {
    pub available: bool,
    pub messages: Option<BTreeMap<String, String>>,
}
