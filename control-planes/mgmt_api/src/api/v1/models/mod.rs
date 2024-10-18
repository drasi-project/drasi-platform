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

use serde::de::{self, MapAccess, Visitor};
use serde::{Deserialize, Deserializer, Serialize};
use std::fmt;
use std::str::FromStr;
use void::Void;

mod providers;
mod query;
mod query_container;
mod reaction;
mod source;

pub use providers::*;
pub use query::*;
pub use query_container::*;
pub use reaction::*;
pub use source::*;

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

struct StringOrConfig();

impl<'de> Visitor<'de> for StringOrConfig {
    type Value = ConfigValueDto;

    fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
        formatter.write_str("string or map or bool")
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

        impl From<FakeConfigValueDto> for ConfigValueDto {
            fn from(fcv: FakeConfigValueDto) -> ConfigValueDto {
                match fcv {
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
        // impl Into<ConfigValueDto> for FakeConfigValueDto {
        //     fn into(self) -> ConfigValueDto {
        //         match self {
        //             FakeConfigValueDto::Inline { value } => ConfigValueDto::Inline {
        //                 value: InlineValueDto::String { value },
        //             },
        //             FakeConfigValueDto::Secret { name, key } => {
        //                 ConfigValueDto::Secret { name, key }
        //             }
        //             FakeConfigValueDto::List { value } => ConfigValueDto::Inline {
        //                 value: InlineValueDto::List { value },
        //             },
        //             FakeConfigValueDto::Boolean { value } => ConfigValueDto::Inline {
        //                 value: InlineValueDto::Boolean { value },
        //             },
        //             FakeConfigValueDto::Integer { value } => ConfigValueDto::Inline {
        //                 value: InlineValueDto::Integer { value },
        //             },
        //         }
        //     }
        // }
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


#[derive(Serialize, Deserialize, Debug)]
#[serde(tag = "kind")]
pub enum ControlMessage {
    #[serde(rename = "error")]
    Error(ErrorMessage),
}

impl ControlMessage {
    pub fn error(message: String) -> Self {
        ControlMessage::Error(ErrorMessage { message })
    }

    pub fn to_json(&self) -> String {
        serde_json::to_string(self).unwrap()
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ErrorMessage {
    pub message: String,
}
