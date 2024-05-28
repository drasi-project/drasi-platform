use dapr::{
    appcallback::*,
    dapr::dapr::proto::runtime::v1::app_callback_server::{AppCallback, AppCallbackServer},
};
use log::info;
use publisher::Publisher;
use serde_json::Value;
use tonic::{transport::Server, Request, Response, Status};

mod publisher;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::fmt::init();

    let query_container_id = std::env::var("QUERY_NODE_ID").unwrap();
    let redis_url = match std::env::var("REDIS_BROKER") {
        Ok(url) => url,
        Err(_) => String::from("redis://rg-redis:6379"),
    };

    log::info!(
        "Drasi Publish API starting up for query node: {}",
        query_container_id
    );

    let topic = format!("{}-publish", query_container_id);

    let publisher = Publisher::connect(&redis_url, topic).await.unwrap();

    let addr = "[::]:50052".parse().unwrap();

    let app_callback_service = AppCallbackService::new(publisher);
    info!("AppCallbackServer listening on {}", addr);

    Server::builder()
        .add_service(AppCallbackServer::new(app_callback_service))
        .serve(addr)
        .await?;

    Ok(())
}

pub struct AppCallbackService {
    publisher: Publisher,
}

impl AppCallbackService {
    pub fn new(publisher: Publisher) -> Self {
        Self { publisher }
    }
}

#[tonic::async_trait]
impl AppCallback for AppCallbackService {
    async fn on_invoke(
        &self,
        request: Request<InvokeRequest>,
    ) -> Result<Response<InvokeResponse>, Status> {
        let header = request.metadata().clone();
        println!("Received header: {:?}", header);
        let r = request.into_inner();
        let method = &r.method;

        let data = &r.data;
        if let Some(data) = data {
            let json_data: Value = serde_json::from_slice(&data.value).unwrap();

            let traceparent = match json_data.get("traceparent") {
                Some(traceparent) => Some(traceparent.as_str().unwrap().to_string()),
                None => None,
            };

            println!("Received traceparent: {:?}", traceparent);
            match method.as_str() {
                "change" => {
                    let change = json_data.get("data").unwrap();
                    info!("Publishing change: {:?}", change);
                    self.publisher
                        .publish(change.to_string(), None, traceparent)
                        .await
                        .unwrap();
                }
                "data" => {
                    info!("Publishing data: {:?}", json_data);
                    self.publisher
                        .publish(json_data.to_string(), None, None)
                        .await
                        .unwrap();
                }
                _ => {}
            }
        }
        Ok(Response::new(InvokeResponse::default()))
    }

    async fn list_topic_subscriptions(
        &self,
        _request: Request<()>,
    ) -> Result<Response<ListTopicSubscriptionsResponse>, Status> {
        Ok(Response::new(ListTopicSubscriptionsResponse::default()))
    }

    async fn on_topic_event(
        &self,
        _request: Request<TopicEventRequest>,
    ) -> Result<Response<TopicEventResponse>, Status> {
        Ok(Response::new(TopicEventResponse::default()))
    }

    async fn list_input_bindings(
        &self,
        _request: Request<()>,
    ) -> Result<Response<ListInputBindingsResponse>, Status> {
        Ok(Response::new(ListInputBindingsResponse::default()))
    }

    async fn on_binding_event(
        &self,
        _request: Request<BindingEventRequest>,
    ) -> Result<Response<BindingEventResponse>, Status> {
        Ok(Response::new(BindingEventResponse::default()))
    }
}
