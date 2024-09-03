use serde::de::{self, MapAccess, Visitor};
use serde::{Deserialize, Deserializer, Serialize};
use serde_json::{Map, Value};
use std::collections::HashMap;
use std::fmt;
use std::str::FromStr;
use void::Void;

#[derive(Serialize, Deserialize, Debug)]
pub struct ResourceDto<TSpec, TStatus> {
    pub id: String,
    pub spec: TSpec,
    pub status: Option<TStatus>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ResourceProviderDto<TSpec> {
    pub id: String,
    pub spec: TSpec,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(tag = "kind")]
pub struct SourceSpecDto {
    pub kind: String,
    pub services: Option<HashMap<String, Option<ServiceDto>>>,
    pub properties: Option<HashMap<String, Option<ConfigValueDto>>>,
}

fn default_container() -> String {
    "default".to_string()
}

#[derive(Serialize, Debug)]
#[serde(tag = "kind")]
pub enum ConfigValueDto {
    Inline { value: InlineValueDto },
    Secret { name: String, key: String },
}

#[derive(Serialize, Debug)]
pub enum InlineValueDto {
    String { value: String },
    Integer { value: i64 },
    Boolean { value: bool },
    List { value: Vec<ConfigValueDto> },
}

impl InlineValueDto {
    pub fn get_value(&self) -> &dyn std::any::Any {
        match self {
            InlineValueDto::String { value } => value,
            InlineValueDto::Integer { value } => value,
            InlineValueDto::Boolean { value } => value,
            InlineValueDto::List { value } => value,
        }
    }
}

impl Default for ConfigValueDto {
    fn default() -> Self {
        ConfigValueDto::Inline {
            value: InlineValueDto::String {
                value: "".to_string(),
            },
        }
    }
}

impl FromStr for ConfigValueDto {
    type Err = Void;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        Ok(ConfigValueDto::Inline {
            value: InlineValueDto::String {
                value: s.to_string(),
            },
        })
    }
}

impl ConfigValueDto {
    fn from_integer(i: i64) -> Self {
        ConfigValueDto::Inline {
            value: InlineValueDto::Integer { value: i },
        }
    }

    fn from_boolean(b: bool) -> Self {
        ConfigValueDto::Inline {
            value: InlineValueDto::Boolean { value: b },
        }
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct SourceStatusDto {
    pub available: bool,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(tag = "kind", rename_all = "camelCase")]
pub enum StorageSpecDto {
    #[serde(rename_all = "camelCase")]
    Memory { enable_archive: bool },
    #[serde(rename_all = "camelCase")]
    Redis {
        connection_string: ConfigValueDto,
        cache_size: Option<u32>,
    },
    #[serde(rename_all = "camelCase")]
    RocksDb {
        #[serde(default)]
        enable_archive: bool,

        storage_class: Option<String>,

        #[serde(default)]
        direct_io: bool,
    },
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct QueryContainerSpecDto {
    pub query_host_count: u16,
    pub results: HashMap<String, ConfigValueDto>,
    pub storage: HashMap<String, StorageSpecDto>,
    pub default_store: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct QueryContainerStatusDto {
    pub available: bool,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ReactionSpecDto {
    pub kind: String,
    pub tag: Option<String>,
    pub services: Option<HashMap<String, Option<ServiceDto>>>,
    pub properties: Option<HashMap<String, ConfigValueDto>>,
    pub queries: HashMap<String, Option<String>>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ReactionStatusDto {
    pub available: bool,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct QuerySourceLabelDto {
    pub source_label: String,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct QuerySubscriptionDto {
    pub id: String,
    pub nodes: Option<Vec<QuerySourceLabelDto>>,
    pub relations: Option<Vec<QuerySourceLabelDto>>,
    pub pipeline: Option<Vec<String>>,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct QueryJoinKeyDto {
    pub label: String,
    pub property: String,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct QueryJoinDto {
    pub id: String,
    pub keys: Vec<QueryJoinKeyDto>,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct QuerySpecDto {
    #[serde(default = "default_container")]
    pub container: String,
    pub mode: String,
    pub query: String,
    pub sources: QuerySourcesDto,
    pub storage_profile: Option<String>,
    pub view: Option<ViewSpecDto>,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct SourceMiddlewareConfigDto {
    pub kind: String,
    pub name: String,

    #[serde(flatten)]
    pub config: Map<String, Value>,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct QuerySourcesDto {
    pub subscriptions: Vec<QuerySubscriptionDto>,
    pub joins: Option<Vec<QueryJoinDto>>,
    pub middleware: Option<Vec<SourceMiddlewareConfigDto>>,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct QueryStatusDto {
    pub host_name: String,
    pub status: String,
    pub container: String,
    pub error_message: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ViewSpecDto {
    pub enabled: bool,
    pub retention_policy: RetentionPolicyDto,
}

#[derive(Serialize, Deserialize, Debug, Clone, Copy)]
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

struct StringOrConfig();

impl<'de> Visitor<'de> for StringOrConfig {
    type Value = ConfigValueDto;

    fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
        formatter.write_str("string, integer, boolean, list, or map")
    }

    fn visit_str<E>(self, value: &str) -> Result<ConfigValueDto, E>
    where
        E: de::Error,
    {
        Ok(ConfigValueDto::from_str(value).unwrap())
    }

    fn visit_seq<A>(self, seq: A) -> Result<ConfigValueDto, A::Error>
    where
        A: de::SeqAccess<'de>,
    {
        let value =
            serde::de::Deserialize::deserialize(de::value::SeqAccessDeserializer::new(seq))?;
        Ok(ConfigValueDto::Inline {
            value: InlineValueDto::List { value },
        })
    }

    fn visit_i64<E>(self, value: i64) -> Result<ConfigValueDto, E>
    where
        E: de::Error,
    {
        Ok(ConfigValueDto::from_integer(value))
    }

    fn visit_u64<E>(self, value: u64) -> Result<ConfigValueDto, E>
    where
        E: de::Error,
    {
        Ok(ConfigValueDto::from_integer(value as i64))
    }

    fn visit_bool<E>(self, value: bool) -> Result<ConfigValueDto, E>
    where
        E: de::Error,
    {
        Ok(ConfigValueDto::from_boolean(value))
    }

    fn visit_map<M>(self, map: M) -> Result<ConfigValueDto, M::Error>
    where
        M: MapAccess<'de>,
    {
        #[derive(Deserialize)]
        #[serde(tag = "kind")]
        enum FakeConfigValueDto {
            Inline { value: String },
            Secret { name: String, key: String },
            List { value: Vec<ConfigValueDto> },
            Boolean { value: bool },
            Integer { value: i64 },
        }

        impl Into<ConfigValueDto> for FakeConfigValueDto {
            fn into(self) -> ConfigValueDto {
                match self {
                    FakeConfigValueDto::Inline { value } => ConfigValueDto::Inline {
                        value: InlineValueDto::String { value },
                    },
                    FakeConfigValueDto::Secret { name, key } => {
                        ConfigValueDto::Secret { name, key }
                    }
                    FakeConfigValueDto::List { value } => ConfigValueDto::Inline {
                        value: InlineValueDto::List { value },
                    },
                    FakeConfigValueDto::Boolean { value } => ConfigValueDto::Inline {
                        value: InlineValueDto::Boolean { value },
                    },
                    FakeConfigValueDto::Integer { value } => ConfigValueDto::Inline {
                        value: InlineValueDto::Integer { value },
                    },
                }
            }
        }
        let fv = FakeConfigValueDto::deserialize(de::value::MapAccessDeserializer::new(map))?;
        Ok(fv.into())
    }
}

impl<'de> Deserialize<'de> for ConfigValueDto {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        log::debug!("ConfigValueDto::deserialize");

        deserializer.deserialize_any(StringOrConfig())
    }
}

#[derive(Deserialize)]
pub struct ReadyWaitParams {
    #[serde(default = "default_ready_timeout")]
    pub timeout: u64,
}

fn default_ready_timeout() -> u64 {
    60
}
