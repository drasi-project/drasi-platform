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

impl Into<ReactionSpec> for ReactionSpecDto {
    fn into(self) -> ReactionSpec {
        ReactionSpec {
            kind: self.kind,
            tag: match self.tag {
                Some(tag) => Some(tag),
                None => None,
            },
            services: match self.services {
                Some(services) => Some(
                    services
                        .into_iter()
                        .map(|(k, v)| {
                            if let Some(v) = v {
                                (k, Some(v.into()))
                            } else {
                                (k, None)
                            }
                        })
                        .collect(),
                ),
                None => None,
            },
            properties: match self.properties {
                Some(properties) => {
                    Some(properties.into_iter().map(|(k, v)| (k, v.into())).collect())
                }
                None => None,
            },
            queries: self
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
            tag: match spec.tag {
                Some(tag) => Some(tag),
                None => None,
            },
            services: match spec.services {
                Some(services) => Some(
                    services
                        .into_iter()
                        .map(|(k, v)| {
                            if let Some(v) = v {
                                (k, Some(v.into()))
                            } else {
                                (k, None)
                            }
                        })
                        .collect(),
                ),
                None => None,
            },
            properties: match spec.properties {
                Some(properties) => {
                    Some(properties.into_iter().map(|(k, v)| (k, v.into())).collect())
                }
                None => None,
            },
            queries: spec
                .queries
                .into_iter()
                .map(|(k, v)| (k, Some(v)))
                .collect(),
        }
    }
}
