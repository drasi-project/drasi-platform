use super::models::*;
use crate::domain::models::{ConfigValue, InlineValue, Resource};

mod providers;
mod query;
mod query_container;
mod reaction;
mod source;

impl<TSpec, TStatus, TSpecDto, TStatusDto> From<ResourceDto<TSpecDto, TStatusDto>>
    for Resource<TSpec, TStatus>
where
    TSpecDto: Into<TSpec>,
    TStatusDto: Into<TStatus>,
{
    fn from(val: ResourceDto<TSpecDto, TStatusDto>) -> Self {
        Resource {
            id: val.id,
            spec: val.spec.into(),
            status: val.status.map(|s| s.into()),
        }
    }
}

impl<TSpec, TStatus, TSpecDto, TStatusDto> From<Resource<TSpec, TStatus>>
    for ResourceDto<TSpecDto, TStatusDto>
where
    TSpec: Into<TSpecDto>,
    TStatus: Into<TStatusDto>,
{
    fn from(val: Resource<TSpec, TStatus>) -> Self {
        ResourceDto {
            id: val.id,
            spec: val.spec.into(),
            status: val.status.map(|s| s.into()),
        }
    }
}

impl From<ConfigValueDto> for ConfigValue {
    fn from(value: ConfigValueDto) -> Self {
        match value {
            ConfigValueDto::Inline { value } => match value {
                InlineValueDto::String { value } => ConfigValue::Inline {
                    value: InlineValue::String { value },
                },
                InlineValueDto::Integer { value } => ConfigValue::Inline {
                    value: InlineValue::Integer { value },
                },
                InlineValueDto::Boolean { value } => ConfigValue::Inline {
                    value: InlineValue::Boolean { value },
                },
                InlineValueDto::List { value } => ConfigValue::Inline {
                    value: InlineValue::List {
                        value: value.into_iter().map(|v| v.into()).collect(),
                    },
                },
            },
            ConfigValueDto::Secret { name, key } => ConfigValue::Secret { name, key },
        }
    }
}

impl From<ConfigValue> for ConfigValueDto {
    fn from(value: ConfigValue) -> Self {
        match value {
            ConfigValue::Inline { value } => match value {
                InlineValue::String { value } => ConfigValueDto::Inline {
                    value: InlineValueDto::String { value },
                },
                InlineValue::Integer { value } => ConfigValueDto::Inline {
                    value: InlineValueDto::Integer { value },
                },
                InlineValue::Boolean { value } => ConfigValueDto::Inline {
                    value: InlineValueDto::Boolean { value },
                },
                InlineValue::List { value } => ConfigValueDto::Inline {
                    value: InlineValueDto::List {
                        value: value.into_iter().map(|v| v.into()).collect(),
                    },
                },
            },
            ConfigValue::Secret { name, key } => ConfigValueDto::Secret { name, key },
        }
    }
}
