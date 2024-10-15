use crate::{
    controller::ResourceController,
    models::{KubernetesSpec, RuntimeConfig},
    spec_builder::SpecBuilder,
};

use async_trait::async_trait;
use dapr::server::{
    actor::{
        axum::{response::IntoResponse, Json},
        context_client::{ActorContextClient, ActorStateOperation},
        Actor, ActorError,
    },
    utils::DaprJson,
};
use resource_provider_api::models::ResourceRequest;
use std::collections::BTreeMap;
use std::marker;
use tokio::sync::RwLock;
use uuid::Uuid;

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

        let instance_id = self.read_instance_id().await.unwrap_or_else(|e| {
            log::error!("Failed to read instance id: {}", e);
            None
        });

        let instance_id = match instance_id {
            Some(instance_id) => instance_id,
            None => {
                let instance_id = Uuid::new_v4().to_string();
                if let Err(err) = self.write_instance_id(&instance_id).await {
                    log::error!("Failed to write instance id: {}", err);
                    return err.into_response();
                }
                instance_id
            }
        };

        let platform_specs = self
            .spec_builder
            .build(spec, &self.runtime_config, &instance_id);

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

        self.delete_instance_id().await.unwrap_or_else(|e| {
            log::error!("Failed to delete instance id: {}", e);
        });

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
                if result.data.is_empty() {
                    log::debug!("No actor state found");
                    return Ok(Vec::new());
                }
                match serde_json::from_slice::<Vec<KubernetesSpec>>(&result.data) {
                    Ok(specs) => Ok(specs),
                    Err(e) => {
                        log::error!("Failed to deserialize actor state: {}", e);
                        Err(ActorError::MethodError(Box::new(e)))
                    }
                }
            }
            Err(e) => {
                log::error!("Failed to get actor state: {}", e);
                Err(ActorError::MethodError(Box::new(e)))
            }
        }
    }

    async fn read_instance_id(&self) -> Result<Option<String>, ActorError> {
        let mut client = self.dapr_client.clone();
        match client
            .get_actor_state(format!("{}-instance-id", self.resource_type))
            .await
        {
            Ok(result) => {
                if result.data.is_empty() {
                    log::debug!("No actor state (instance id) found");
                    return Ok(None);
                }
                match String::from_utf8(result.data) {
                    Ok(instance_id) => Ok(Some(instance_id)),
                    Err(e) => {
                        log::error!("Failed to deserialize actor state: {}", e);
                        Err(ActorError::MethodError(Box::new(e)))
                    }
                }
            }
            Err(e) => {
                log::error!("Failed to get actor state: {}", e);
                Err(ActorError::MethodError(Box::new(e)))
            }
        }
    }

    async fn write_instance_id(&self, instance_id: &str) -> Result<(), ActorError> {
        log::debug!("Writing instance id {}", self.id);
        let mut client = self.dapr_client.clone();
        if let Err(e) = client
            .execute_actor_state_transaction(vec![ActorStateOperation::Upsert {
                key: format!("{}-instance-id", self.resource_type),
                value: Some(instance_id.as_bytes().to_vec()),
            }])
            .await
        {
            log::error!("Failed to execute actor state transaction: {}", e);
            return Err(ActorError::MethodError(Box::new(e)));
        }
        Ok(())
    }

    async fn delete_instance_id(&self) -> Result<(), ActorError> {
        log::debug!("Deleting instance id {}", self.id);
        let mut client = self.dapr_client.clone();
        if let Err(e) = client
            .execute_actor_state_transaction(vec![ActorStateOperation::Delete {
                key: format!("{}-instance-id", self.resource_type),
            }])
            .await
        {
            log::error!("Failed to execute actor state transaction: {}", e);
            return Err(ActorError::MethodError(Box::new(e)));
        }
        Ok(())
    }

    async fn load_controllers(&self, specs: Vec<KubernetesSpec>) {
        log::info!("Loading controllers {}", self.id);
        let mut controllers = self.controllers.write().await;
        controllers.clear();
        for spec in specs {
            controllers.insert(
                spec.service_name.clone(),
                ResourceController::start(self.kube_config.clone(), spec),
            );
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
