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

use std::fmt::Display;

use async_trait::async_trait;
use serde::Deserialize;
use thiserror::Error;

#[derive(Debug)]
pub struct Message<T> {
    pub id: String,
    pub data: T,
    pub trace_state: Option<String>,
    pub trace_parent: Option<String>,
}

#[derive(Debug, Error)]
pub enum ChangeStreamError {
    IOError(String),
    MessageError { id: String, error: String },
    AckOutOfSequence,
    Other(String),
}

#[async_trait]
pub trait SequentialChangeStream {
    /// Receives a message from the stream and deserializes it. If the previous message has not been acked, this will return that message.
    async fn recv<T>(&self) -> Result<Option<Message<T>>, ChangeStreamError>
    where
        T: for<'de> Deserialize<'de>;

    /// Acknowledges that the message has been processed. This will allow the next message to be received.
    /// If the message ID is not the previous message ID, this will return an AckOutOfSequence error.
    async fn ack(&self, id: &str) -> Result<(), ChangeStreamError>;

    /// Unsubscribes from all future messages.
    /// This will stop the background task that is buffering messages, and no further messages will be received on any future session.
    #[allow(dead_code)]
    async fn unsubscribe(&self) -> Result<(), ChangeStreamError>;
}

impl Display for ChangeStreamError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            ChangeStreamError::IOError(o) => write!(f, "IOError: {}", o),
            ChangeStreamError::MessageError { id, error } => {
                write!(f, "MessageError: {}, {}", id, error)
            }
            ChangeStreamError::AckOutOfSequence => write!(f, "AckOutOfSequence"),
            ChangeStreamError::Other(o) => write!(f, "Other: {}", o),
        }
    }
}

impl<T> opentelemetry::propagation::Extractor for Message<T> {
    fn get(&self, key: &str) -> Option<&str> {
        match key {
            "traceparent" => self.trace_parent.as_deref(),
            "tracestate" => self.trace_state.as_deref(),
            _ => None,
        }
    }

    fn keys(&self) -> Vec<&str> {
        vec!["traceparent", "tracestate"]
    }
}

pub mod redis_change_stream;

#[cfg(test)]
mod tests;
