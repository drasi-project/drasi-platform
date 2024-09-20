use crate::domain::models::{SourceSpec, SourceStatus};

use super::{SourceSpecDto, SourceStatusDto};

impl From<SourceStatusDto> for SourceStatus {
    fn from(status: SourceStatusDto) -> Self {
        SourceStatus {
            available: status.available,
            messages: status.messages,
        }
    }
}

impl From<SourceStatus> for SourceStatusDto {
    fn from(status: SourceStatus) -> Self {
        SourceStatusDto {
            available: status.available,
            messages: status.messages,
        }
    }
}

impl From<SourceSpecDto> for SourceSpec {
    fn from(spec: SourceSpecDto) -> Self {
        SourceSpec {
            kind: spec.kind,
            services:  spec.services.map(|services| {
                services
                    .into_iter()
                    .map(|(k, v)| (k, v.map(|v| v.into())))
                    .collect()
            }),
            properties: spec.properties.map(|properties| {
                properties
                    .into_iter()
                    .map(|(k, v)| (k, v.map(|v| v.into())))
                    .collect()
            }),
        }
    }
}

impl From<SourceSpec> for SourceSpecDto {
    fn from(spec: SourceSpec) -> Self {
        SourceSpecDto {
            kind: spec.kind,
            services: spec.services.map(|services| {
                services
                    .into_iter()
                    .map(|(k, v)| (k, v.map(|v| v.into())))
                    .collect()
            }),
            properties: spec.properties.map(|properties| {
                properties
                    .into_iter()
                    .map(|(k, v)| (k, v.map(|v| v.into())))
                    .collect()
            }),
        }
    }
}
