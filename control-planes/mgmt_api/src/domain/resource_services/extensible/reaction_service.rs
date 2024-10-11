use super::{
    merge_spec, ExtensibleResourceDomainServiceImpl, ExtensibleSpecValidator, ResourceDomainService,
};
use crate::{
    domain::models::{
        ConfigValue, DomainError, InlineValue, ProviderSpec, ReactionSpec, ReactionStatus,
    },
    persistence::ReactionRepository,
    ProviderRepository,
};

use async_trait::async_trait;
use dapr::client::TonicClient;
use drasi_comms_abstractions::comms::Invoker;
use jsonschema::JSONSchema;
use std::{collections::HashMap, sync::Arc};
pub type ReactionDomainService = dyn ResourceDomainService<ReactionSpec, ReactionStatus>;
pub type ReactionDomainServiceImpl = ExtensibleResourceDomainServiceImpl<
    ReactionSpec,
    ReactionStatus,
    resource_provider_api::models::ReactionSpec,
    resource_provider_api::models::ReactionStatus,
>;

impl ReactionDomainServiceImpl {
    pub fn new(
        dapr_client: dapr::Client<TonicClient>,
        repo: Box<ReactionRepository>,
        provider_repo: Arc<ProviderRepository>,
        invoker: Arc<dyn Invoker>,
    ) -> Self {
        ReactionDomainServiceImpl {
            dapr_client,
            repo,
            provider_repo,
            invoker,
            actor_type: |_spec| "ReactionResource".to_string(),
            ready_check: |status| status.available,
            validators: vec![Box::new(ReactionSpecValidator {})],
            populate_default_values: |properties, schema_data| {
                populate_default_values(properties, schema_data)
            },
            _tspec: std::marker::PhantomData,
            _tstatus: std::marker::PhantomData,
            _tapi_spec: std::marker::PhantomData,
            _tapi_status: std::marker::PhantomData,
        }
    }
}

struct ReactionSpecValidator {}

#[async_trait]
impl ExtensibleSpecValidator<ReactionSpec> for ReactionSpecValidator {
    async fn validate(
        &self,
        spec: &ReactionSpec,
        schema: &ProviderSpec,
    ) -> Result<(), DomainError> {
        let kind = spec.kind.clone();
        let config_schema = schema.config_schema.as_ref();

        if let Some(config_schema) = config_schema {
            let raw_schema = match serde_json::to_value(config_schema) {
                Ok(raw_schema) => raw_schema,
                Err(e) => {
                    return Err(DomainError::InvalidSpec {
                        message: "Invalid config schema".to_string(),
                    });
                }
            };

            let validation = match JSONSchema::compile(&raw_schema) {
                Ok(validation) => validation,
                Err(e) => {
                    return Err(DomainError::InvalidSpec {
                        message: "Invalid config schema".to_string(),
                    });
                }
            };

            let source_properties = match spec.properties {
                Some(ref properties) => properties.clone(),
                None => {
                    return Err(DomainError::InvalidSpec {
                        message: format!("properties are not defined for {}", kind),
                    })
                }
            };

            let mut new_spec_properties = serde_json::Map::new();
            for (key, value) in source_properties {
                let value = match value {
                    ConfigValue::Inline { value } => match value {
                        InlineValue::String { value } => serde_json::Value::String(value),
                        InlineValue::Integer { value } => {
                            serde_json::Value::Number(serde_json::Number::from(value))
                        }
                        InlineValue::Boolean { value } => serde_json::Value::Bool(value),
                        InlineValue::List { value } => {
                            let mut new_sequence = Vec::new();
                            for val in value {
                                let val = match val {
                                    ConfigValue::Secret { name, key: _ } => {
                                        serde_json::Value::String(name)
                                    }
                                    ConfigValue::Inline { value } => match value {
                                        InlineValue::String { value } => {
                                            serde_json::Value::String(value)
                                        }
                                        InlineValue::Integer { value } => {
                                            serde_json::Value::Number(serde_json::Number::from(
                                                value,
                                            ))
                                        }
                                        InlineValue::Boolean { value } => {
                                            serde_json::Value::Bool(value)
                                        }
                                        InlineValue::List { value } => {
                                            serde_json::Value::Array(Vec::new())
                                        }
                                    },
                                };
                                new_sequence.push(val);
                            }
                            serde_json::Value::Array(new_sequence)
                        }
                    },
                    ConfigValue::Secret { name, key: _ } => serde_json::Value::String(name),
                };
                new_spec_properties.insert(key, value);
            }

            let json_data_properties = match serde_json::to_value(new_spec_properties) {
                Ok(json_data_properties) => json_data_properties,
                Err(e) => {
                    return Err(DomainError::JsonParseError {
                        message: format!("Unable to parse the properties for {}", kind),
                    })
                }
            };
            let result = validation.validate(&json_data_properties);

            if let Err(mut errors) = result {
                if let Some(error) = errors.next() {
                    log::info!("Validation error: {}", error);
                    log::info!("Instance path: {}", error.instance_path);
                    return Err(DomainError::InvalidSpec {
                        message: format!(
                            "Invalid spec: {}; error path: {}",
                            error, error.instance_path
                        ),
                    });
                }
            }
        }

        #[allow(clippy::map_clone)]
        let defined_services: Vec<String> = schema.services.keys().map(|s| s.clone()).collect();
        let services = match spec.services.clone() {
            Some(services) => services,
            None => {
                return Err(DomainError::InvalidSpec {
                    message: "Services not defined".to_string(),
                })
            }
        };
        // Check if the services defined in the source spec are defined in the schema
        for (service_name, service_settings) in &services {
            if !defined_services.contains(service_name) {
                return Err(DomainError::UndefinedSetting {
                    message: format!("Service {} is not defined in the schema", service_name),
                });
            }
        }
        for (service_name, service_properties) in &schema.services {
            let service_config_schema = service_properties.config_schema.clone();

            let service_config_schema = match service_config_schema {
                Some(service_config_schema) => service_config_schema,
                None => continue,
            };

            let raw_schema = match serde_json::to_value(service_config_schema) {
                Ok(raw_schema) => raw_schema,
                Err(e) => {
                    return Err(DomainError::InvalidSpec {
                        message: format!(
                            "Invalid service config schema for service {} - {}",
                            service_name, e
                        ),
                    });
                }
            };

            let validation = match JSONSchema::compile(&raw_schema) {
                Ok(validation) => validation,
                Err(e) => {
                    return Err(DomainError::InvalidSpec {
                        message: format!(
                            "Invalid service config schema for service {}",
                            service_name
                        ),
                    });
                }
            };

            let curr_service_config_schema = match services.get(service_name) {
                Some(service) => match &service.properties {
                    Some(properties) => properties.clone(),
                    None => {
                        return Err(DomainError::InvalidSpec {
                            message: format!(
                                "Invalid service properties for service {}",
                                service_name
                            ),
                        })
                    }
                },
                _ => HashMap::new(),
            };

            let mut curr_service_config_schema_json_value = serde_json::Map::new();

            for (key, value) in curr_service_config_schema {
                let value = match value {
                    ConfigValue::Inline { value } => match value {
                        InlineValue::String { value } => serde_json::Value::String(value),
                        InlineValue::Integer { value } => {
                            serde_json::Value::Number(serde_json::Number::from(value))
                        }
                        InlineValue::Boolean { value } => serde_json::Value::Bool(value),
                        InlineValue::List { value } => {
                            let mut new_sequence = Vec::new();
                            for val in value {
                                let val = match val {
                                    ConfigValue::Secret { name, key: _ } => {
                                        serde_json::Value::String(name)
                                    }
                                    ConfigValue::Inline { value } => match value {
                                        InlineValue::String { value } => {
                                            serde_json::Value::String(value)
                                        }
                                        InlineValue::Integer { value } => {
                                            serde_json::Value::Number(serde_json::Number::from(
                                                value,
                                            ))
                                        }
                                        InlineValue::Boolean { value } => {
                                            serde_json::Value::Bool(value)
                                        }
                                        InlineValue::List { value } => {
                                            serde_json::Value::Array(Vec::new())
                                        }
                                    },
                                };
                                new_sequence.push(val);
                            }
                            serde_json::Value::Array(new_sequence)
                        }
                    },
                    ConfigValue::Secret { name, key: _ } => serde_json::Value::String(name),
                };
                curr_service_config_schema_json_value.insert(key, value);
            }

            let json_data_properties =
                match serde_json::to_value(curr_service_config_schema_json_value) {
                    Ok(json_data_properties) => json_data_properties,
                    Err(_e) => {
                        return Err(DomainError::JsonParseError {
                            message: format!(
                                "Unable to parse the service properties for {}",
                                service_name
                            ),
                        })
                    }
                };
            let result = validation.validate(&json_data_properties);

            if let Err(mut errors) = result {
                if let Some(error) = errors.next() {
                    log::info!("Validation error: {}", error);
                    log::info!("Instance path: {}", error.instance_path);
                    return Err(DomainError::InvalidSpec {
                        message: format!(
                            "Invalid spec: {}; error path: {}",
                            error, error.instance_path
                        ),
                    });
                }
            }
        }
        Ok(())
    }
}

fn populate_default_values(
    reaction: &ReactionSpec,
    schema_json: &ProviderSpec,
) -> Result<ReactionSpec, DomainError> {
    let (properties, services) = merge_spec(
        reaction.properties.as_ref(),
        reaction.services.as_ref(),
        schema_json,
    )?;

    Ok(ReactionSpec {
        kind: reaction.kind.clone(),
        tag: reaction.tag.clone(),
        services: Some(services),
        properties: Some(properties),
        queries: reaction.queries.clone(),
    })
}
