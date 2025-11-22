// Copyright 2025 The Drasi Authors.
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

use crate::api::v1::models::{
    ControlSignalDto, ResultChangeEventDto, ResultControlEventDto, ResultEventDto, UpdatePayloadDto,
};
use crate::domain::result_service::api::{
    ControlSignal, ResultChangeEvent, ResultControlEvent, ResultEvent, UpdatePayload,
};

impl From<ResultEvent> for ResultEventDto {
    fn from(event: ResultEvent) -> Self {
        match event {
            ResultEvent::Change(change) => ResultEventDto::Change(change.into()),
            ResultEvent::Control(control) => ResultEventDto::Control(control.into()),
        }
    }
}

impl From<ResultChangeEvent> for ResultChangeEventDto {
    fn from(event: ResultChangeEvent) -> Self {
        ResultChangeEventDto {
            query_id: event.query_id,
            sequence: event.sequence,
            source_time_ms: event.source_time_ms,
            added_results: event.added_results,
            updated_results: event
                .updated_results
                .into_iter()
                .map(|u| u.into())
                .collect(),
            deleted_results: event.deleted_results,
            metadata: event.metadata,
        }
    }
}

impl From<ResultControlEvent> for ResultControlEventDto {
    fn from(event: ResultControlEvent) -> Self {
        ResultControlEventDto {
            query_id: event.query_id,
            sequence: event.sequence,
            source_time_ms: event.source_time_ms,
            metadata: event.metadata,
            control_signal: event.control_signal.into(),
        }
    }
}

impl From<UpdatePayload> for UpdatePayloadDto {
    fn from(payload: UpdatePayload) -> Self {
        UpdatePayloadDto {
            before: payload.before,
            after: payload.after,
            grouping_keys: payload.grouping_keys,
        }
    }
}

impl From<ControlSignal> for ControlSignalDto {
    fn from(signal: ControlSignal) -> Self {
        match signal {
            ControlSignal::BootstrapStarted => ControlSignalDto::BootstrapStarted,
            ControlSignal::BootstrapCompleted => ControlSignalDto::BootstrapCompleted,
            ControlSignal::Running => ControlSignalDto::Running,
            ControlSignal::Stopped => ControlSignalDto::Stopped,
            ControlSignal::QueryDeleted => ControlSignalDto::QueryDeleted,
        }
    }
}
