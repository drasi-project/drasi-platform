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

use std::{
    error::Error,
    fmt::{Display, Formatter},
    sync::{Arc, RwLock},
};

use serde::{Deserialize, Serialize};
use thiserror::Error;
use tokio::sync::watch;

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub enum QueryState {
    New,
    Configured,
    Bootstrapping,
    Running,
    //Paused,
    //Stopped,
    Deleted,
    TerminalError(String),
    TransientError(String),
}

impl Display for QueryState {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            QueryState::New => write!(f, "New"),
            QueryState::Configured => write!(f, "Configured"),
            QueryState::Bootstrapping => write!(f, "Bootstrapping"),
            QueryState::Running => write!(f, "Running"),
            //QueryState::Paused => write!(f, "Paused"),
            //QueryState::Stopped => write!(f, "Stopped"),
            QueryState::Deleted => write!(f, "Deleted"),
            QueryState::TerminalError(_o) => write!(f, "TerminalError"),
            QueryState::TransientError(_o) => write!(f, "TransientError"),
        }
    }
}

//#[derive(Debug, Clone)]
pub struct QueryLifecycle {
    state: Arc<RwLock<QueryState>>,
    on_change_tx: watch::Sender<QueryState>,
    on_change_rx: watch::Receiver<QueryState>,
}

impl QueryLifecycle {
    pub fn new(initial: QueryState) -> Self {
        let (tx, rx) = watch::channel(initial.clone());

        QueryLifecycle {
            state: Arc::new(RwLock::new(initial)),
            on_change_rx: rx,
            on_change_tx: tx,
        }
    }

    pub fn get_state(&self) -> QueryState {
        self.state.read().unwrap().clone()
    }

    pub fn init_state(&self, state: QueryState) {
        *self.state.write().unwrap() = state;
    }

    pub fn change_state(&self, state: QueryState) {
        *self.state.write().unwrap() = state.clone();
        _ = self.on_change_tx.send(state);
    }

    pub fn get_error(&self) -> Option<String> {
        match self.get_state() {
            QueryState::TerminalError(o) => Some(o),
            QueryState::TransientError(o) => Some(o),
            _ => None,
        }
    }

    pub fn on_change(&self) -> watch::Receiver<QueryState> {
        self.on_change_rx.clone()
    }
}

pub struct ChangeStreamConfig {
    pub redis_url: String,
    pub buffer_size: usize,
    pub fetch_batch_size: usize,
}

#[derive(Error, Debug)]
pub enum QueryError {
    #[error("Bootstrap failure: {0}")]
    BootstrapFailure(BootstrapError),

    #[error("Parse error: {0}")]
    ParseError(Box<dyn Error>),

    #[error("{0}")]
    Other(String),
}

impl QueryError {
    pub fn bootstrap_failure(e: BootstrapError) -> Self {
        QueryError::BootstrapFailure(e)
    }

    pub fn parse_error(e: Box<dyn Error>) -> Self {
        QueryError::ParseError(e)
    }
}

#[derive(Error, Debug)]
pub enum BootstrapError {
    #[error("Failed to fetch data from source '{source_id}': {inner}")]
    FetchFailed {
        source_id: String,
        inner: Box<dyn Error>,
    },

    #[error("Failed to process element '{element_id}' from source '{source_id}': {inner}")]
    ProcessFailed {
        source_id: String,
        element_id: String,
        inner: Box<dyn Error>,
    },

    #[error("Failed to publish: {0}")]
    PublishError(Box<dyn Error>),

    #[error("{0}")]
    Other(Box<dyn Error>),
}

impl BootstrapError {
    pub fn fetch_failed(source_id: String, inner: Box<dyn Error>) -> Self {
        BootstrapError::FetchFailed { source_id, inner }
    }

    pub fn process_failed(source_id: String, element_id: String, inner: Box<dyn Error>) -> Self {
        BootstrapError::ProcessFailed {
            source_id,
            element_id,
            inner,
        }
    }

    pub fn publish_error(inner: Box<dyn Error>) -> Self {
        BootstrapError::PublishError(inner)
    }

    pub fn other(inner: Box<dyn Error>) -> Self {
        BootstrapError::Other(inner)
    }
}
