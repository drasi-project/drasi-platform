use crate::{
    controller::reconciler::ReconcileStatus, models::RuntimeConfig,
    spec_builder::query_container::QueryContainerSpecBuilder,
};
use axum::{response::IntoResponse, Json};
use dapr::{actor, server::actor::context_client::ActorContextClient};
use resource_provider_api::models::{QueryContainerSpec, QueryContainerStatus};
use std::marker;
use tokio::sync::RwLock;

use super::ResourceActor;

#[actor]
pub type QueryContainerActor = ResourceActor<QueryContainerSpec, QueryContainerStatus>;

impl QueryContainerActor {
    pub fn new(
        actor_type: &str,
        id: &str,
        runtime_config: RuntimeConfig,
        dapr_client: ActorContextClient,
        kube_config: kube::Config,
    ) -> Self {
        ResourceActor {
            actor_type: actor_type.to_string(),
            id: id.to_string(),
            dapr_client,
            resource_type: "querycontainer".to_string(),
            runtime_config,
            spec_builder: Box::new(QueryContainerSpecBuilder {}),
            controllers: RwLock::new(Vec::new()),
            kube_config,
            _owns_tstatus: marker::PhantomData,
        }
    }

    pub async fn get_status(&self) -> impl IntoResponse {
        let controllers = self.controllers.read().await;
        let available = controllers
            .iter()
            .all(|c| c.status() == ReconcileStatus::Online);
        Json(QueryContainerStatus { available })
    }
}
