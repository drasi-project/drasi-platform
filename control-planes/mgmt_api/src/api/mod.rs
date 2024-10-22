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

use actix_web::HttpResponse;

use crate::domain::models::DomainError;

pub mod v1;

impl From<DomainError> for HttpResponse {
    fn from(error: DomainError) -> Self {
        match error {
            DomainError::NotFound => HttpResponse::NotFound().body("Resource not found"),
            DomainError::Invalid { message } => HttpResponse::BadRequest().body(message),
            DomainError::QueryContainerOffline => {
                HttpResponse::ServiceUnavailable().body("Query container is offline")
            }
            DomainError::UndefinedSetting { message } => {
                HttpResponse::BadRequest().body("Undefined setting: ".to_string() + &message)
            }
            DomainError::InvalidSpec { message } => HttpResponse::BadRequest().body(message),
            DomainError::JsonParseError { message } => HttpResponse::BadRequest().body(message),
            _ => HttpResponse::InternalServerError().body("Internal server error"),
        }
    }
}
