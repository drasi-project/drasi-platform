use std::time::Duration;
use futures::StreamExt;
use reqwest_streams::*;
use self::api::ResultEvent;
use super::models::{ChangeStreamConfig, DomainError};
use crate::change_stream::{
    redis_change_stream::{InitialCursor, RedisChangeStream},
    SequentialChangeStream,
};
use async_stream::stream;
use futures_util::Stream;

pub struct ResultService {
    stream_config: ChangeStreamConfig,
    http_client: reqwest::Client,
}

impl ResultService {
    pub fn new(stream_config: ChangeStreamConfig) -> Self {
        ResultService { 
            stream_config,
            http_client: reqwest::Client::new(),
        }
    }

    pub async fn stream_from_start(
        &self,
        query_id: &str,
        consumer_id: &str,
    ) -> Result<impl Stream<Item = ResultEvent> + Send, DomainError> {
        let topic = format!("{}-results", query_id);
        let change_stream = match RedisChangeStream::new(
            &self.stream_config.redis_url,
            &topic,
            consumer_id,
            consumer_id,
            self.stream_config.buffer_size,
            self.stream_config.fetch_batch_size,
            InitialCursor::Beginning,
        )
        .await
        {
            Ok(cs) => cs,
            Err(err) => {
                log::error!("Error creating change stream: {}", err);
                return Err(DomainError::Internal {
                    inner: Box::new(err),
                });
            }
        };

        let result = stream! {
            loop {
                let msg = match change_stream.recv::<ResultEvent>().await {
                    Ok(msg) => msg,
                    Err(err) => {
                        log::error!("Error receiving message from change stream: {}", err);
                        break;
                    },
                };

                match msg {
                    Some(msg) => {
                        _ = change_stream.ack(&msg.id).await;
                        yield msg.data;
                    },
                    None => tokio::time::sleep(Duration::from_millis(100)).await,
                };
            }
        };

        Ok(result)
    }

    pub async fn snapshot_stream_from_now(
        &self,
        query_container_id: &str,
        query_id: &str,
        consumer_id: &str,
    ) -> Result<impl Stream<Item = ResultEvent> + Send, DomainError> {
        
        let mut snapshot_stream = match self.http_client.get(&format!("http://{}-view-svc/{}", query_container_id, query_id)).send().await {
            Ok(r) => {
                if !r.status().is_success() {
                    log::error!("Error getting view: {}", r.status());
                    return Err(DomainError::Internal {
                        inner: Box::new(std::io::Error::new(std::io::ErrorKind::Other, "Error getting view")),
                    });
                }
                r.json_array_stream::<api::ViewElement>(usize::MAX)
            },
            Err(e) => {
                log::error!("Error getting view: {}", e);
                return Err(DomainError::Internal {
                    inner: Box::new(e),
                });
            },
        };
        
        let topic = format!("{}-results", query_id);
        let change_stream = match RedisChangeStream::new(
            &self.stream_config.redis_url,
            &topic,
            consumer_id,
            consumer_id,
            self.stream_config.buffer_size,
            self.stream_config.fetch_batch_size,
            InitialCursor::End,
        )
        .await
        {
            Ok(cs) => cs,
            Err(err) => {
                log::error!("Error creating change stream: {}", err);
                return Err(DomainError::Internal {
                    inner: Box::new(err),
                });
            }
        };

        let query_id = query_id.to_string();

        let result = stream! {
            while let Some(item) = snapshot_stream.next().await {
                match item {
                    Ok(api::ViewElement::Data(data)) => {
                        let event = ResultEvent::Change(api::ResultChangeEvent {
                            query_id: query_id.clone(),
                            sequence: 0,  //todo
                            source_time_ms: 0,
                            added_results: vec![data],
                            updated_results: vec![],
                            deleted_results: vec![],
                            metadata: None,
                        });
                        yield event;
                    },
                    Err(e) => {
                        log::error!("Error getting view: {}", e);                        
                    },
                    _ => (),
                }
            }
            loop {
                let msg = match change_stream.recv::<ResultEvent>().await {
                    Ok(msg) => msg,
                    Err(err) => {
                        log::error!("Error receiving message from change stream: {}", err);
                        break;
                    },
                };

                match msg {
                    Some(msg) => {
                        _ = change_stream.ack(&msg.id).await;
                        yield msg.data;
                    },
                    None => tokio::time::sleep(Duration::from_millis(100)).await,
                };
            }
        };

        Ok(result)
    }
}

pub mod api {
    use std::fmt::{Display, Formatter};

    use serde::{Deserialize, Serialize};
    use serde_json::{Map, Value};

    #[derive(Serialize, Deserialize, Debug, Clone)]
    #[serde(tag = "kind")]
    pub enum ControlSignal {
        #[serde(rename = "bootstrapStarted")]
        BootstrapStarted,

        #[serde(rename = "bootstrapCompleted")]
        BootstrapCompleted,

        #[serde(rename = "running")]
        Running,

        #[serde(rename = "stopped")]
        Stopped,

        #[serde(rename = "deleted")]
        QueryDeleted,
    }

    impl Display for ControlSignal {
        fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
            match self {
                ControlSignal::BootstrapStarted => write!(f, "bootstrapping"),
                ControlSignal::BootstrapCompleted => write!(f, "bootstrap complete"),
                ControlSignal::Running => write!(f, "running"),
                ControlSignal::Stopped => write!(f, "stopped"),
                ControlSignal::QueryDeleted => write!(f, "deleted"),
            }
        }
    }

    #[derive(Serialize, Deserialize, Debug)]
    #[serde(tag = "kind")]
    pub enum ResultEvent {
        #[serde(rename = "change")]
        Change(ResultChangeEvent),

        #[serde(rename = "control")]
        Control(ResultControlEvent),
    }

    #[derive(Serialize, Deserialize, Debug)]
    #[serde(rename_all = "camelCase")]
    pub struct ResultChangeEvent {
        pub query_id: String,
        pub sequence: u64,
        pub source_time_ms: u64,
        pub added_results: Vec<Map<String, Value>>,
        pub updated_results: Vec<UpdatePayload>,
        pub deleted_results: Vec<Map<String, Value>>,
        pub metadata: Option<Map<String, Value>>,
    }

    #[derive(Serialize, Deserialize, Debug)]
    #[serde(rename_all = "camelCase")]
    pub struct ResultControlEvent {
        pub query_id: String,
        pub sequence: u64,
        pub source_time_ms: u64,
        pub metadata: Option<Map<String, Value>>,
        pub control_signal: ControlSignal,
    }

    #[derive(Serialize, Deserialize, Debug)]
    pub struct UpdatePayload {
        pub before: Option<Map<String, Value>>,
        pub after: Option<Map<String, Value>>,
        pub grouping_keys: Option<Vec<String>>,
    }

    #[derive(Serialize, Deserialize, Debug)]
    #[serde(rename_all = "camelCase")]
    pub enum ViewElement {
        Header {
            sequence: u64,
            timestamp: u64,
            state: Option<String>,
        },
        Data(Map<String, Value>),
    }

}
