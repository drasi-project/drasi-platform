use std::{
    error::Error,
    fmt::{Display, Formatter},
    sync::{Arc, RwLock},
};

use serde::{Deserialize, Serialize};
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

#[derive(Debug)]
pub enum QueryError {
    AlreadyConfigured,
    BootstrapFailure(Box<dyn Error>),
    ParseError(Box<dyn Error>),
    Other(String),
}

impl QueryError {
    pub fn bootstrap_failure(e: Box<dyn Error>) -> Self {
        QueryError::BootstrapFailure(e)
    }

    pub fn parse_error(e: Box<dyn Error>) -> Self {
        QueryError::ParseError(e)
    }
}

impl Display for QueryError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            QueryError::AlreadyConfigured => write!(f, "Query actor already configured"),
            QueryError::BootstrapFailure(o) => o.fmt(f),
            QueryError::ParseError(o) => o.fmt(f),
            QueryError::Other(o) => write!(f, "{}", o),
        }
    }
}

impl Error for QueryError {
    fn source(&self) -> Option<&(dyn Error + 'static)> {
        None
    }
}
