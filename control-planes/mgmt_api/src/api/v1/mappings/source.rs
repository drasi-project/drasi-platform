use crate::domain::models::{SourceSpec, SourceStatus};

use super::{SourceSpecDto, SourceStatusDto};

impl Into<SourceStatus> for SourceStatusDto {
    fn into(self) -> SourceStatus {
        SourceStatus {
            available: self.available,
        }
    }
}

impl From<SourceStatus> for SourceStatusDto {
    fn from(status: SourceStatus) -> Self {
        SourceStatusDto {
            available: status.available,
        }
    }
}

impl Into<SourceSpec> for SourceSpecDto {
    fn into(self) -> SourceSpec {
        SourceSpec {
            kind: self.kind,
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
                Some(properties) => Some(
                    properties
                        .into_iter()
                        .map(|(k, v)| (k, Some(v.unwrap_or_default().into())))
                        .collect(),
                ),
                None => None,
            },
        }
    }
}

impl From<SourceSpec> for SourceSpecDto {
    fn from(spec: SourceSpec) -> Self {
        SourceSpecDto {
            kind: spec.kind,
            services: match spec.services {
                Some(services) => Some(
                    services
                        .into_iter()
                        .map(|(k, v)| (k, Some(v.unwrap().into())))
                        .collect(),
                ),
                None => None,
            },
            properties: match spec.properties {
                Some(properties) => Some(
                    properties
                        .into_iter()
                        .map(|(k, v)| (k, Some(v.unwrap().into())))
                        .collect(),
                ),
                None => None,
            },
        }
    }
}
