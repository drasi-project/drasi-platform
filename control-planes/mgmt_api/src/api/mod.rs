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
            },
            DomainError::UndefinedSetting { message } => {
                HttpResponse::BadRequest().body("Undefined setting: ".to_string() + &message)
            },
            DomainError::InvalidSpec { message } => HttpResponse::BadRequest().body(message),
            DomainError::JsonParseError { message }=> HttpResponse::BadRequest().body(message),
            _ => HttpResponse::InternalServerError().body("Internal server error"),
        }
    }
}
