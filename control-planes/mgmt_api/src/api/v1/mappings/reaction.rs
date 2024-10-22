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
            services: spec
                .services
                .map(|services| services.into_iter().map(|(k, v)| (k, v.into())).collect()),
            properties: spec
                .properties
                .map(|properties| properties.into_iter().map(|(k, v)| (k, v.into())).collect()),
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
            services: spec
                .services
                .map(|services| services.into_iter().map(|(k, v)| (k, v.into())).collect()),
            properties: spec
                .properties
                .map(|properties| properties.into_iter().map(|(k, v)| (k, v.into())).collect()),
            queries: spec
                .queries
                .into_iter()
                .map(|(k, v)| (k, Some(v)))
                .collect(),
        }
    }
}
