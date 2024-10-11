use async_trait::async_trait;
use dapr::client::TonicClient;
use drasi_comms_abstractions::comms::{Invoker, Payload};
use serde::{de::DeserializeOwned, Serialize};
use serde_json::Value;
use std::{collections::HashMap, fmt::Debug, sync::Arc, time::Duration};

use crate::{
    domain::models::{
        ConfigValue, DomainError, Endpoint, HasKind, InlineValue, ProviderSpec, Resource,
        ServiceConfig,
    },
    ProviderRepository, ResourceSpecRepository,
};

use super::ResourceDomainService;

mod reaction_service;
mod source_service;

pub use reaction_service::ReactionDomainService;
pub use reaction_service::ReactionDomainServiceImpl;
pub use source_service::SourceDomainService;
pub use source_service::SourceDomainServiceImpl;

#[async_trait]
pub trait ExtensibleSpecValidator<TSpec> {
    async fn validate(&self, _spec: &TSpec, _schema: &ProviderSpec) -> Result<(), DomainError> {
        Ok(())
    }
}

pub struct ExtensibleResourceDomainServiceImpl<TSpec, TStatus, TApiSpec, TApiStatus>
where
    TSpec: Serialize + DeserializeOwned + Debug + Clone + Into<TApiSpec> + Send + Sync,
    TStatus: Send + Sync,
    TApiSpec: Serialize + Send + Sync,
    TApiStatus: DeserializeOwned + Send + Sync,
{
    dapr_client: dapr::Client<TonicClient>,
    repo: Box<dyn ResourceSpecRepository<TSpec> + Send + Sync>,
    provider_repo: Arc<ProviderRepository>,
    invoker: Arc<dyn Invoker>,
    actor_type: fn(&TSpec) -> String,
    ready_check: fn(&TStatus) -> bool,
    validators: Vec<Box<dyn ExtensibleSpecValidator<TSpec> + Send + Sync>>,
    populate_default_values: fn(&TSpec, &ProviderSpec) -> Result<TSpec, DomainError>,
    _tspec: std::marker::PhantomData<TSpec>,
    _tstatus: std::marker::PhantomData<TStatus>,
    _tapi_spec: std::marker::PhantomData<TApiSpec>,
    _tapi_status: std::marker::PhantomData<TApiStatus>,
}

#[async_trait]
impl<TSpec, TStatus, TApiSpec, TApiStatus> ResourceDomainService<TSpec, TStatus>
    for ExtensibleResourceDomainServiceImpl<TSpec, TStatus, TApiSpec, TApiStatus>
where
    TSpec: HasKind + Serialize + DeserializeOwned + Debug + Clone + Into<TApiSpec> + Send + Sync,
    TStatus: Send + Sync,
    TApiSpec: Serialize + Send + Sync,
    TApiStatus: DeserializeOwned + Into<TStatus> + Send + Sync,
{
    async fn set(&self, id: &str, source: TSpec) -> Result<Resource<TSpec, TStatus>, DomainError> {
        log::debug!("Setting resource: {}", id);
        let schema = match self.provider_repo.get(source.kind()).await {
            Ok(s) => s,
            Err(e) => {
                log::error!("Error getting schema for resource: {}", e);
                if let DomainError::NotFound = e {
                    return Err(DomainError::Invalid {
                        message: (format!("Schema not initialized for kind: {}", source.kind())),
                    });
                }
                return Err(DomainError::Internal { inner: Box::new(e) });
            }
        };

        let mut source = source.clone();
        source = match (self.populate_default_values)(&source, &schema) {
            Ok(s) => s,
            Err(e) => {
                log::error!("Error populating default values for resource: {}", e);
                return Err(DomainError::Internal { inner: Box::new(e) });
            }
        };

        for validator in &self.validators {
            validator.validate(&source, &schema).await?;
        }

        log::info!("Validated resource: {}", id);

        let mut mut_dapr = self.dapr_client.clone();

        self.repo.set(id, &source).await?;

        let request = resource_provider_api::models::ResourceRequest::<TApiSpec> {
            id: id.to_string(),
            spec: source.clone().into(),
        };

        let _: () = match mut_dapr
            .invoke_actor(
                (self.actor_type)(&source),
                id.to_string(),
                "configure",
                request,
                None,
            )
            .await
        {
            Err(e) => {
                log::error!("Error configuring resource: {}", e);
                return Err(DomainError::Internal { inner: Box::new(e) });
            }
            r => r.unwrap(),
        };

        Ok(Resource {
            id: id.to_string(),
            spec: source,
            status: None,
        })
    }

    async fn delete(&self, id: &str) -> Result<(), DomainError> {
        log::debug!("Deleting resource: {}", id);
        let spec = self.repo.get(id).await?;

        let schema = match self.provider_repo.get(spec.kind()).await {
            Ok(schema) => Some(schema),
            Err(e) => {
                log::error!("Error getting schema for resource: {}", e);
                None
            }
        };

        if let Some(schema) = &schema {
            for (service_name, service_config) in &schema.services {
                if let Some(deprovision_handler) = &service_config.deprovision_handler {
                    if *deprovision_handler {
                        match self
                            .invoker
                            .invoke(
                                Payload::None,
                                format!("{}-{}", id, service_name).as_str(),
                                "deprovision",
                                None,
                            )
                            .await
                        {
                            Ok(_) => {
                                log::info!("Called Deprovision handler for {}-{}", id, service_name)
                            }
                            Err(e) => {
                                log::error!(
                                    "Error deprovisioning {}-{}: {}",
                                    id,
                                    service_name,
                                    e.to_string()
                                );
                            }
                        }
                    }
                }
            }
        }

        let mut mut_dapr = self.dapr_client.clone();

        let _: () = match mut_dapr
            .invoke_actor(
                (self.actor_type)(&spec),
                id.to_string(),
                "deprovision",
                (),
                None,
            )
            .await
        {
            Err(e) => {
                log::error!("Error deprovisioning resource: {}", e);
                return Err(DomainError::Internal { inner: Box::new(e) });
            }
            r => r.unwrap(),
        };

        self.repo.delete(id).await?;
        Ok(())
    }

    async fn get(&self, id: &str) -> Result<Resource<TSpec, TStatus>, DomainError> {
        log::debug!("Getting resource: {}", id);
        let spec = self.repo.get(id).await?;
        let actor_type = (self.actor_type)(&spec);

        Ok(Resource {
            id: id.to_string(),
            spec,
            status: {
                let mut mut_dapr = self.dapr_client.clone();
                let status: Option<TApiStatus> = match mut_dapr
                    .invoke_actor(actor_type, id.to_string(), "getStatus", (), None)
                    .await
                {
                    Ok(r) => Some(r),
                    Err(e) => {
                        log::error!("Error getting status for resource: {} - {:?}", id, e);
                        None
                    }
                };

                status.map(|s| s.into())
            },
        })
    }

    async fn list(&self) -> Result<Vec<Resource<TSpec, TStatus>>, DomainError> {
        log::debug!("Listing resources");
        let mut result = Vec::new();
        let mut mut_dapr = self.dapr_client.clone();
        let items = self.repo.list().await;
        for item in &items {
            result.push(Resource {
                id: item.0.clone(),
                spec: item.1.clone(),
                status: {
                    let status: Option<TApiStatus> = match mut_dapr
                        .invoke_actor(
                            (self.actor_type)(&item.1),
                            item.0.to_string(),
                            "getStatus",
                            (),
                            None,
                        )
                        .await
                    {
                        Ok(r) => Some(r),
                        Err(e) => {
                            log::error!("Error getting status for resource: {} - {:?}", item.0, e);
                            None
                        }
                    };

                    status.map(|s| s.into())
                },
            });
        }

        Ok(result)
    }

    async fn wait_for_ready(&self, id: &str, time_out: Duration) -> Result<bool, DomainError> {
        //todo: temp solution, will reimplement with events
        let interval = Duration::from_secs(1);

        let spec = self.repo.get(id).await?;
        let actor_type = (self.actor_type)(&spec);

        let mut mut_dapr = self.dapr_client.clone();
        let start = std::time::Instant::now();

        while start.elapsed() < time_out {
            let status: TApiStatus = match mut_dapr
                .invoke_actor(actor_type.clone(), id.to_string(), "getStatus", (), None)
                .await
            {
                Ok(r) => r,
                Err(e) => {
                    log::error!("Error getting status for resource: {} - {:?}", id, e);
                    return Err(DomainError::Internal { inner: Box::new(e) });
                }
            };

            if (self.ready_check)(&status.into()) {
                return Ok(true);
            }

            tokio::time::sleep(interval).await;
        }

        Ok(false)
    }
}

fn merge_spec(
    source_properties: Option<&HashMap<String, ConfigValue>>,
    source_services: Option<&HashMap<String, ServiceConfig>>,
    schema_json: &ProviderSpec,
) -> Result<(HashMap<String, ConfigValue>, HashMap<String, ServiceConfig>), DomainError> {
    let mut properties = match source_properties {
        Some(properties) => properties.clone(),
        None => HashMap::new(),
    };
    let config_properties = match schema_json.config_schema {
        Some(ref config_properties) => config_properties.properties.clone(),
        None => None,
    };
    if let Some(config_schema_properties) = config_properties {
        // for each property in the schema, if it's not in the source spec, add it
        for (key, value) in config_schema_properties {
            if !properties.contains_key(&key) {
                let default_value = match value.default {
                    Some(default_value) => default_value,
                    None => continue,
                };
                let default_value = match default_value {
                    Value::String(s) => ConfigValue::Inline {
                        value: InlineValue::String {
                            value: s.to_string(),
                        },
                    },
                    Value::Bool(b) => ConfigValue::Inline {
                        value: InlineValue::Boolean { value: b },
                    },
                    Value::Number(n) => ConfigValue::Inline {
                        value: InlineValue::Integer {
                            value: match n.as_i64() {
                                Some(n) => n,
                                None => {
                                    return Err(DomainError::InvalidSpec {
                                        message: "expected a valid integer".to_string(),
                                    })
                                }
                            },
                        },
                    },
                    Value::Array(a) => {
                        let mut new_sequence = Vec::new();
                        for val in a {
                            let val = match val {
                                Value::String(s) => ConfigValue::Inline {
                                    value: InlineValue::String {
                                        value: s.to_string(),
                                    },
                                },
                                Value::Bool(b) => ConfigValue::Inline {
                                    value: InlineValue::Boolean { value: b },
                                },
                                Value::Number(n) => ConfigValue::Inline {
                                    value: InlineValue::Integer {
                                        value: match n.as_i64() {
                                            Some(n) => n,
                                            None => {
                                                return Err(DomainError::InvalidSpec {
                                                    message: "expected a valid integer".to_string(),
                                                })
                                            }
                                        },
                                    },
                                },
                                _ => continue,
                            };
                            new_sequence.push(val);
                        }
                        ConfigValue::Inline {
                            value: InlineValue::List {
                                value: new_sequence,
                            },
                        }
                    }
                    _ => continue,
                };
                properties.insert(key.clone(), default_value);
            }
        }
    }
    let mut services = match source_services {
        Some(services) => services.clone(),
        None => HashMap::new(),
    };
    for (service_name, service_config) in &schema_json.services {
        // check to see if this service is defined in the source spec (yaml file)
        let curr_service = match services.get(service_name) {
            Some(service) => service.clone(),
            _ => ServiceConfig {
                replica: None,
                image: None,
                endpoints: None,
                dapr: None,
                properties: None,
                deprovision_handler: None,
            },
        };

        let dapr = match &service_config.dapr {
            Some(properties) => {
                let mut new_properties = HashMap::new();
                for (key, value) in properties {
                    let default_value = ConfigValue::Inline {
                        value: InlineValue::String {
                            value: value.clone(),
                        },
                    };
                    new_properties.insert(key.clone(), default_value);
                }
                Some(new_properties)
            }
            None => None,
        };

        let service_properties = match &service_config.config_schema {
            Some(properties) => {
                let mut curr_service_properties = curr_service.properties.unwrap_or_default();
                let properties = match &properties.properties {
                    Some(properties) => properties.clone(),
                    None => {
                        return Err(DomainError::InvalidSpec {
                            message: format!(
                                "Unable to retrieve the service properties for {}",
                                service_name
                            ),
                        })
                    }
                };
                for (key, value) in properties {
                    if !curr_service_properties.contains_key(&key) {
                        let default_value = match value.default {
                            Some(default_value) => default_value,
                            None => continue,
                        };
                        let default_value = match default_value {
                            Value::String(s) => ConfigValue::Inline {
                                value: InlineValue::String {
                                    value: s.to_string(),
                                },
                            },
                            Value::Bool(b) => ConfigValue::Inline {
                                value: InlineValue::Boolean { value: b },
                            },
                            Value::Number(n) => ConfigValue::Inline {
                                value: InlineValue::Integer {
                                    value: match n.as_i64() {
                                        Some(n) => n,
                                        None => {
                                            return Err(DomainError::InvalidSpec {
                                                message: "expected a valid integer".to_string(),
                                            })
                                        }
                                    },
                                },
                            },
                            Value::Array(a) => {
                                let mut new_sequence = Vec::new();
                                for val in a {
                                    let val = match val {
                                        Value::String(s) => s.to_string(),
                                        Value::Bool(b) => b.to_string(),
                                        Value::Number(n) => match n.as_i64() {
                                            Some(n) => n.to_string(),
                                            None => {
                                                return Err(DomainError::InvalidSpec {
                                                    message: "expected a valid integer".to_string(),
                                                })
                                            }
                                        },
                                        _ => continue,
                                    };
                                    new_sequence.push(val);
                                }
                                let list = new_sequence.join(",");
                                ConfigValue::Inline {
                                    value: InlineValue::String { value: list },
                                }
                            }
                            _ => continue,
                        };
                        curr_service_properties.insert(key.clone(), default_value);
                    }
                }
                Some(curr_service_properties)
            }
            None => None,
        };

        log::info!("service_properties: {:?}", service_properties);

        let endpoints = match &service_config.endpoints {
            Some(endpoints) => {
                let mut result = HashMap::new();

                for (endpoint_name, endpoint_config) in endpoints {
                    let target = endpoint_config.target.trim_start_matches("$").to_string();
                    let target_port_value = match service_properties {
                            Some(ref properties) => {
                                match properties.get(&target) {
                                    Some(value) => match value {
                                        ConfigValue::Inline { value } => match value {
                                            InlineValue::String { value } => value.clone(),
                                            InlineValue::Integer { value } => value.to_string(),
                                            _ => return Err(DomainError::InvalidSpec {
                                                message: "Invalid endpoint value; expected string or integer".to_string(),
                                            }),
                                        }
                                        _ => return Err(DomainError::InvalidSpec {
                                            message: "Invalid endpoint value; expected string or integer".to_string(),
                                        }),
                                    },
                                    None => return Err(DomainError::InvalidSpec {
                                        message: format!("Unable to retrieve the target port; {} is not defined", target),
                                    }),
                                }
                            },
                            None => return Err(DomainError::InvalidSpec {
                                message: "Unable to retrieve the target port as the properties are not defined".to_string(),
                            }),
                        };

                    let endpoint = Endpoint {
                        setting: endpoint_config.setting.clone(),
                        target: target_port_value,
                    };
                    result.insert(endpoint_name.clone(), endpoint);
                }

                Some(result)
            }
            None => None,
        };

        let new_service = ServiceConfig {
            replica: None,
            image: Some(service_config.image.clone()),
            endpoints,
            dapr,
            properties: service_properties,
            deprovision_handler: service_config.deprovision_handler,
        };

        services.insert(service_name.clone(), new_service);
    }
    Ok((properties, services))
}
