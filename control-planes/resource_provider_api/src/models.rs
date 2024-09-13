use std::collections::{BTreeMap, HashMap};
use std::fmt;
use std::marker::PhantomData;
use std::str::FromStr;

use serde::de::{self, MapAccess, Visitor};
use serde::{Deserialize, Deserializer, Serialize};
use serde_json::{Map, Value};
use void::Void;

#[derive(Serialize, Deserialize, Debug)]
pub struct Resource<TSpec, TStatus> {
    pub id: String,
    pub spec: TSpec,
    pub status: Option<TStatus>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ResourceRequest<TSpec> {
    pub id: String,
    pub spec: TSpec,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(tag = "kind")]
pub enum ConfigValue {
    Inline { value: String },
    Secret { name: String, key: String },
}

impl Default for ConfigValue {
    fn default() -> Self {
        ConfigValue::Inline {
            value: "".to_string(),
        }
    }
}

impl FromStr for ConfigValue {
    type Err = Void;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        Ok(ConfigValue::Inline {
            value: s.to_string(),
        })
    }
}

fn string_or_struct<'de, T, D>(deserializer: D) -> Result<T, D::Error>
where
    T: Deserialize<'de> + FromStr<Err = Void>,
    D: Deserializer<'de>,
{
    struct StringOrStruct<T>(PhantomData<fn() -> T>);

    impl<'de, T> Visitor<'de> for StringOrStruct<T>
    where
        T: Deserialize<'de> + FromStr<Err = Void>,
    {
        type Value = T;

        fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
            formatter.write_str("string or map")
        }

        fn visit_str<E>(self, value: &str) -> Result<T, E>
        where
            E: de::Error,
        {
            Ok(FromStr::from_str(value).unwrap())
        }

        fn visit_map<M>(self, map: M) -> Result<T, M::Error>
        where
            M: MapAccess<'de>,
        {
            Deserialize::deserialize(de::value::MapAccessDeserializer::new(map))
        }
    }

    deserializer.deserialize_any(StringOrStruct(PhantomData))
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(tag = "kind")]
pub struct SourceSpec {
    #[serde(rename = "sourceKind")]
    pub kind: String,
    pub services: Option<HashMap<String, Service>>,
    pub properties: Option<HashMap<String, ConfigValue>>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct SourceStatus {
    pub available: bool,
    pub messages: Option<BTreeMap<String, String>>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(tag = "kind", rename_all = "camelCase")]
pub enum StorageSpec {
    Memory {
        enable_archive: bool,
    },
    Redis {
        #[serde(deserialize_with = "string_or_struct")]
        connection_string: ConfigValue,
        cache_size: Option<u32>,
    },
    RocksDb {
        enable_archive: bool,
        storage_class: Option<String>,
        direct_io: bool,
    },
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct QueryContainerSpec {
    pub query_host_count: u16,
    pub results: HashMap<String, ConfigValue>,
    pub storage: HashMap<String, StorageSpec>,
    pub default_store: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct QueryContainerStatus {
    pub available: bool,
    pub messages: Option<BTreeMap<String, String>>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ReactionSpec {
    pub kind: String,
    pub tag: Option<String>,
    pub services: Option<HashMap<String, Service>>,
    pub properties: Option<HashMap<String, ConfigValue>>,
    pub queries: HashMap<String, String>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ReactionStatus {
    pub available: bool,
    pub messages: Option<BTreeMap<String, String>>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct SourceProviderSpec {
    pub services: HashMap<String, serde_json::Value>,
    pub config_schema: Option<serde_json::Value>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct SourceProviderStatus {
    pub available: bool,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ReactionProviderSpec {
    pub services: HashMap<String, serde_json::Value>,
    pub config_schema: Option<serde_json::Value>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ReactionProviderStatus {
    pub available: bool,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ConfigProperties {
    pub default: Option<DefaultValue>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub enum DefaultValue {
    Val(ConfigValue),
    Map(HashMap<String, DefaultValue>),
    Array(Vec<String>),
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Service {
    pub replica: Option<String>,
    pub image: String,
    pub endpoints: Option<HashMap<String, Endpoint>>,
    pub dapr: Option<HashMap<String, ConfigValue>>,
    pub properties: Option<HashMap<String, ConfigValue>>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Endpoint {
    pub setting: EndpointSetting,
    pub target: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum EndpointSetting {
    Internal,
    External,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct QuerySourceLabel {
    pub source_label: String,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct QuerySubscription {
    pub id: String,

    #[serde(default)]
    pub nodes: Vec<QuerySourceLabel>,

    #[serde(default)]
    pub relations: Vec<QuerySourceLabel>,

    #[serde(default)]
    pub pipeline: Vec<String>,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct QueryJoinKey {
    pub label: String,
    pub property: String,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct QueryJoin {
    pub id: String,
    pub keys: Vec<QueryJoinKey>,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct SourceMiddlewareConfig {
    pub kind: String,
    pub name: String,

    #[serde(flatten)]
    pub config: Map<String, Value>,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct QuerySpec {
    pub mode: String,
    pub query: String,
    pub sources: QuerySources,
    pub storage_profile: Option<String>,
    pub view: ViewSpec,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct QuerySources {
    pub subscriptions: Vec<QuerySubscription>,
    pub joins: Vec<QueryJoin>,

    #[serde(default)]
    pub middleware: Vec<SourceMiddlewareConfig>,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct QueryStatus {
    pub host_name: String,
    pub status: String,
    pub container: String,
    pub error_message: Option<String>,
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
