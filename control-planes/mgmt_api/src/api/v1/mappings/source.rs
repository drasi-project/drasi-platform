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
            services: spec
                .services
                .map(|services| services.into_iter().map(|(k, v)| (k, v.into())).collect()),
            properties: spec
                .properties
                .map(|properties| properties.into_iter().map(|(k, v)| (k, v.into())).collect()),
            identity: spec.identity.map(|identity| identity.into()),
        }
    }
}

impl From<SourceSpec> for SourceSpecDto {
    fn from(spec: SourceSpec) -> Self {
        SourceSpecDto {
            kind: spec.kind,
            services: spec
                .services
                .map(|services| services.into_iter().map(|(k, v)| (k, v.into())).collect()),
            properties: spec
                .properties
                .map(|properties| properties.into_iter().map(|(k, v)| (k, v.into())).collect()),
            identity: spec.identity.map(|identity| identity.into()),
        }
    }
}
