use std::time::Duration;

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
}

impl ResultService {
    pub fn new(stream_config: ChangeStreamConfig) -> Self {
        ResultService { stream_config }
    }

    pub async fn stream(
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
}

pub mod api {
    use std::fmt::{Display, Formatter};

    use serde::Deserialize;
    use serde_json::{Map, Value};

    #[derive(Deserialize, Debug, Clone)]
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

    #[derive(Deserialize, Debug)]
    #[serde(tag = "kind")]
    pub enum ResultEvent {
        #[serde(rename = "change")]
        Change(ResultChangeEvent),

        #[serde(rename = "control")]
        Control(ResultControlEvent),
    }

    #[derive(Deserialize, Debug)]
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

    #[derive(Deserialize, Debug)]
    #[serde(rename_all = "camelCase")]
    pub struct ResultControlEvent {
        pub query_id: String,
        pub sequence: u64,
        pub source_time_ms: u64,
        pub metadata: Option<Map<String, Value>>,
        pub control_signal: ControlSignal,
    }

    #[derive(Deserialize, Debug)]
    pub struct UpdatePayload {
        pub before: Option<Map<String, Value>>,
        pub after: Option<Map<String, Value>>,
        pub grouping_keys: Option<Vec<String>>,
    }
}
