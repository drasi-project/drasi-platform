use crate::{
    controller::ResourceController,
    models::{KubernetesSpec, RuntimeConfig},
    spec_builder::SpecBuilder,
};

use async_trait::async_trait;
use dapr::server::{
    actor::{
        context_client::{ActorContextClient, ActorStateOperation},
        Actor, ActorError,  axum::{response::IntoResponse, Json},

    },
    utils::DaprJson,
};
use resource_provider_api::models::ResourceRequest;
use std::collections::BTreeMap;
use std::marker;
use tokio::sync::RwLock;

pub mod querycontainer_actor;
pub mod reaction_actor;
pub mod source_actor;

pub struct ResourceActor<TSpec, TStatus> {
    actor_type: String,
    id: String,
    dapr_client: ActorContextClient,
    resource_type: String,
    runtime_config: RuntimeConfig,
    spec_builder: Box<dyn SpecBuilder<TSpec> + Send + Sync>,
    controllers: RwLock<BTreeMap<String, ResourceController>>,
    kube_config: kube::Config,
    _owns_tstatus: marker::PhantomData<TStatus>,
}

unsafe impl<SourceSpec, SourceStatus> Send for ResourceActor<SourceSpec, SourceStatus> {}

#[async_trait]
impl<TSpec, TStatus: Send + Sync> Actor for ResourceActor<TSpec, TStatus> {
    async fn on_activate(&self) -> Result<(), ActorError> {
        log::info!("Actor activated {} {}", self.actor_type, self.id);
        let specs = self.read_specs().await?;
        self.load_controllers(specs).await;
        self.reconcile_internal_async().await;
        Ok(())
    }

    async fn on_deactivate(&self) -> Result<(), ActorError> {
        log::info!("Actor deactivated {} {}", self.actor_type, self.id);
        Ok(())
    }

    async fn on_reminder(&self, _reminder_name: &str, _data: Vec<u8>) -> Result<(), ActorError> {
        Ok(())
    }

    async fn on_timer(&self, _timer_name: &str, _data: Vec<u8>) -> Result<(), ActorError> {
        Ok(())
    }
}

impl<TSpec, TStatus> ResourceActor<TSpec, TStatus> {
    pub async fn configure(
        &self,
        DaprJson(spec): DaprJson<ResourceRequest<TSpec>>,
    ) -> impl IntoResponse {
        log::info!("Actor configure - {} {}", self.actor_type, self.id);

        let platform_specs = self.spec_builder.build(spec, &self.runtime_config);

        if let Err(err) = self.write_specs(&platform_specs).await {
            log::error!("Failed to write specs: {}", err);
            return err.into_response();
        }

        self.load_controllers(platform_specs).await;
        self.reconcile_internal().await;

        Json(()).into_response()
    }

    pub async fn reconcile(&self) -> impl IntoResponse {
        log::info!("Actor reconcile - {} {}", self.actor_type, self.id);
        self.reconcile_internal().await;
        Json(()).into_response()
    }

    pub async fn deprovision(&self) -> impl IntoResponse {
        log::info!("Actor deprovision - {} {}", self.actor_type, self.id);

        let mut specs = match self.read_specs().await {
            Ok(specs) => specs,
            Err(err) => {
                log::error!("Failed to read specs: {}", err);
                return err.into_response();
            }
        };

        for spec in &mut specs {
            spec.removed = true;
        }

        if let Err(err) = self.write_specs(&specs).await {
            log::error!("Failed to write specs: {}", err);
            return err.into_response();
        }

        let controllers = self.controllers.read().await;

        for (_, controller) in controllers.iter() {
            controller.deprovision();
        }

        Json(()).into_response()
    }

    async fn write_specs(&self, specs: &Vec<KubernetesSpec>) -> Result<(), ActorError> {
        log::debug!("Writing specs {}", self.id);
        let mut client = self.dapr_client.clone();
        if let Err(e) = client
            .execute_actor_state_transaction(vec![ActorStateOperation::Upsert {
                key: format!("{}-platform-specs", self.resource_type),
                value: Some(serde_json::to_vec(&specs).unwrap()),
            }])
            .await
        {
            log::error!("Failed to execute actor state transaction: {}", e);
            return Err(ActorError::MethodError(Box::new(e)));
        }
        Ok(())
    }

    async fn read_specs(&self) -> Result<Vec<KubernetesSpec>, ActorError> {
        let mut client = self.dapr_client.clone();
        match client
            .get_actor_state(format!("{}-platform-specs", self.resource_type))
            .await
        {
            Ok(result) => {
                if result.data.len() == 0 {
                    log::debug!("No actor state found");
                    return Ok(Vec::new());
                }
                match serde_json::from_slice::<Vec<KubernetesSpec>>(&result.data) {
                    Ok(specs) => Ok(specs),
                    Err(e) => {
                        log::error!("Failed to deserialize actor state: {}", e);
                        return Err(ActorError::MethodError(Box::new(e)));
                    }
                }
            }
            Err(e) => {
                log::error!("Failed to get actor state: {}", e);
                return Err(ActorError::MethodError(Box::new(e)));
            }
        }
    }

    async fn load_controllers(&self, specs: Vec<KubernetesSpec>) {
        log::info!("Loading controllers {}", self.id);
        let mut controllers = self.controllers.write().await;
        controllers.clear();
        for spec in specs {
            controllers.insert(spec.service_name.clone(), ResourceController::start(self.kube_config.clone(), spec));
        }
    }

    async fn reconcile_internal(&self) {
        log::info!("start reconcile {}", self.id);

        let mut recievers = Vec::new();

        let controllers = self.controllers.read().await;
        for (_, controller) in controllers.iter() {
            recievers.push(controller.reconcile());
        }

        log::info!("end reconcile {}", self.id);
    }

    async fn reconcile_internal_async(&self) {
        log::info!("start reconcile_async {}", self.id);

        let mut recievers = Vec::new();

        let controllers = self.controllers.read().await;
        for (_, controller) in controllers.iter() {
            recievers.push(controller.reconcile());
        }

        for reciever in recievers {
            _ = reciever.await;
        }

        log::info!("end reconcile_async {}", self.id);
    }
}
