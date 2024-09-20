use crate::domain::models::{ReactionSpec, ReactionStatus};

use super::{ReactionSpecDto, ReactionStatusDto};

impl From<ReactionStatus> for ReactionStatusDto {
    fn from(status: ReactionStatus) -> Self {
        ReactionStatusDto {
            available: status.available,
            messages: status.messages,
        }
    }
}

impl From<ReactionSpecDto> for ReactionSpec {
    fn from(spec: ReactionSpecDto) -> Self {
        ReactionSpec {
            kind: spec.kind,
            tag: spec.tag,
            services: spec.services.map(|services| services
                .into_iter()
                .map(|(k,v)| {
                    if let Some(v) = v {
                        (k, Some(v.into()))
                    } else {
                        (k, None)
                    }
                }).collect()),
            properties: spec.properties.map(|properties| properties.into_iter().map(|(k, v)| (k, v.into())).collect()),
            queries: spec
                .queries
                .into_iter()
                .map(|(k, v)| (k, v.unwrap_or_default()))
                .collect(),
        }
    }
}

impl From<ReactionSpec> for ReactionSpecDto {
    fn from(spec: ReactionSpec) -> Self {
        ReactionSpecDto {
            kind: spec.kind,
            tag: spec.tag,
            services: spec.services.map(|services| services
                .into_iter()
                .map(|(k,v)| {
                    if let Some(v) = v {
                        (k, Some(v.into()))
                    } else {
                        (k, None)
                    }
                }).collect()),
            properties: spec.properties.map(|properties| properties.into_iter().map(|(k, v)| (k, v.into())).collect()),
            queries: spec
                .queries
                .into_iter()
                .map(|(k, v)| (k, Some(v)))
                .collect(),
        }
    }
}
