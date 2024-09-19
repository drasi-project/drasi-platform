use super::{ResourceDomainService, ResourceDomainServiceImpl};
use crate::{
    domain::models::{
        ConfigValue, DomainError, Endpoint, EndpointSetting, InlineValue, ReactionSpec,
        ReactionStatus, Service,
    },
    persistence::ReactionRepository,
    SpecValidator,
};

use async_trait::async_trait;
use dapr::client::TonicClient;
use jsonschema::JSONSchema;
use serde_json::Value;
use std::collections::HashMap;
pub type ReactionDomainService = dyn ResourceDomainService<ReactionSpec, ReactionStatus>;
pub type ReactionDomainServiceImpl = ResourceDomainServiceImpl<
    ReactionSpec,
    ReactionStatus,
    resource_provider_api::models::ReactionSpec,
    resource_provider_api::models::ReactionStatus,
>;

impl ReactionDomainServiceImpl {
    pub fn new(dapr_client: dapr::Client<TonicClient>, repo: Box<ReactionRepository>) -> Self {
        ReactionDomainServiceImpl {
            dapr_client,
            repo: repo,
            actor_type: |_spec| "ReactionResource".to_string(),
            ready_check: |status| status.available,
            validators: vec![Box::new(ReactionSpecValidator {})],
            retrieve_current_kind: |spec| Some(spec.kind.clone()),
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
impl SpecValidator<ReactionSpec> for ReactionSpecValidator {
    async fn validate(
        &self,
        spec: &ReactionSpec,
        schema: &Option<serde_json::Value>,
    ) -> Result<(), DomainError> {
        let kind = spec.kind.clone();
        let schema = match schema {
            Some(schema) => schema,
            None => {
                return Err(DomainError::Invalid {
                    message: "Schema not found".to_string(),
                })
            }
        };

        log::info!("spec: {:?}", spec);

        let config_schema = schema.get("config_schema").map(|config_schema| config_schema);

        let schema_services = match schema.get("services") {
            Some(service) => service,
            None => {
                return Err(DomainError::Invalid {
                    message: "Invalid source schema".to_string(),
                })
            }
        };

        if let Some(config_schema) = config_schema {
            let validation = JSONSchema::compile(config_schema).unwrap();
            let source_properties = spec.properties.clone().unwrap();

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

            let json_data_properties = serde_json::to_value(new_spec_properties).unwrap();
            let result = validation.validate(&json_data_properties);

            if let Err(errors) = result {
                for error in errors {
                    log::info!("Validation error: {}", error);
                    log::info!("Instance path: {}", error.instance_path);
                    return Err(DomainError::Invalid {
                        message: format!(
                            "Invalid source spec: {}; error path: {}",
                            error, error.instance_path
                        ),
                    });
                }
            }
        }

        let schema_services = schema_services.as_object().unwrap();
        let services = match spec.services.clone() {
            Some(services) => services,
            None => {
                return Err(DomainError::Invalid {
                    message: "Services not defined".to_string(),
                })
            }
        };
        for (service_name, service_properties) in schema_services {
            let service_config_schema = match service_properties.get("config_schema") {
                Some(service_config_schema) => Some(service_config_schema),
                None => None,
            };

            if service_config_schema.is_none() {
                continue;
            }

            let service_config_schema = match service_config_schema {
                Some(service_config_schema) => service_config_schema,
                None => continue,
            };

            let validation = JSONSchema::compile(service_config_schema).unwrap();

            let curr_service_config_schema = match services.get(service_name) {
                Some(service) => match service {
                    Some(service) => service.properties.clone().unwrap(),
                    None => HashMap::new(),
                },
                None => HashMap::new(),
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
                serde_json::to_value(curr_service_config_schema_json_value).unwrap();
            let result = validation.validate(&json_data_properties);

            if let Err(errors) = result {
                for error in errors {
                    log::info!("Validation error: {}", error);
                    log::info!("Instance path: {}", error.instance_path);
                    return Err(DomainError::Invalid {
                        message: format!(
                            "Invalid reaction spec: {}; error path: {}",
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
    source: &ReactionSpec,
    schema_json: Value,
) -> Result<ReactionSpec, DomainError> {
    let mut properties = match source.properties {
        Some(ref properties) => properties.clone(),
        None => HashMap::new(),
    };

    if let Some(schema_properties) = schema_json.get("config_schema") {
        let schema_properties = schema_properties.as_object().unwrap();

        // for each property in the schema, if it's not in the source spec, add it
        for (key, value) in schema_properties {
            if !properties.contains_key(key) {
                let default_value = match value.get("default") {
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
                        value: InlineValue::Boolean { value: *b },
                    },
                    Value::Number(n) => ConfigValue::Inline {
                        value: InlineValue::Integer {
                            value: n.as_i64().unwrap(),
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
                                    value: InlineValue::Boolean { value: *b },
                                },
                                Value::Number(n) => ConfigValue::Inline {
                                    value: InlineValue::Integer {
                                        value: n.as_i64().unwrap(),
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

    let mut services = match source.services {
        Some(ref services) => services.clone(),
        None => HashMap::new(),
    };

    if let Some(schema_services) = schema_json.get("services") {
        let schema_services = schema_services.as_object().unwrap();
        for (service_name, service_config) in schema_services {
            let service_config_map = service_config.as_object().unwrap();

            // if service is none, then create a new service
            let curr_service = match services.get(service_name) {
                Some(service) => match service {
                    Some(service) => service.clone(),
                    None => Service {
                        replica: None,
                        image: None,
                        endpoints: None,
                        dapr: None,
                        properties: None,
                    },
                },
                _ => Service {
                    replica: None,
                    image: None,
                    endpoints: None,
                    dapr: None,
                    properties: None,
                },
            };

            let dapr = match service_config_map.get("dapr") {
                Some(dapr) => {
                    let dapr_properties = match dapr.as_object() {
                        Some(properties) => {
                            let mut new_properties = HashMap::new();
                            for (key, value) in properties {
                                let default_value = value;
                                let default_value = match default_value {
                                    Value::String(s) => ConfigValue::Inline {
                                        value: InlineValue::String {
                                            value: s.to_string(),
                                        },
                                    },
                                    Value::Bool(b) => ConfigValue::Inline {
                                        value: InlineValue::String {
                                            value: b.to_string(),
                                        },
                                    },
                                    Value::Number(n) => ConfigValue::Inline {
                                        value: InlineValue::String {
                                            value: n.as_i64().unwrap().to_string(),
                                        },
                                    },
                                    Value::Array(a) => {
                                        let mut new_sequence = Vec::new();
                                        for val in a {
                                            let val = match val {
                                                Value::String(s) => s.to_string(),
                                                Value::Bool(b) => b.to_string(),
                                                Value::Number(n) => n.as_i64().unwrap().to_string(),
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
                                new_properties.insert(key.clone(), default_value);
                            }
                            Some(new_properties)
                        }
                        None => None,
                    };
                    dapr_properties
                }
                None => None,
            };

            let replica = match service_config_map.get("replica") {
                Some(replica) => match replica {
                    Value::String(s) => Some(s.clone()),
                    Value::Number(s) => Some(s.to_string()),
                    _ => None,
                },
                None => None,
            };

            let service_properties = match service_config_map.get("config_schema") {
                Some(properties) => {
                    let mut curr_service_properties = curr_service.properties.unwrap_or_default();
                    let properties = properties.get("properties").unwrap().as_object().unwrap();
                    for (key, value) in properties {
                        if !curr_service_properties.contains_key(key) {
                            let default_value = match value.get("default") {
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
                                    value: InlineValue::Boolean { value: *b },
                                },
                                Value::Number(n) => ConfigValue::Inline {
                                    value: InlineValue::Integer {
                                        value: n.as_i64().unwrap(),
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
                                                value: InlineValue::Boolean { value: *b },
                                            },
                                            Value::Number(n) => ConfigValue::Inline {
                                                value: InlineValue::Integer {
                                                    value: n.as_i64().unwrap(),
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
                            curr_service_properties.insert(key.clone(), default_value);
                        }
                    }
                    Some(curr_service_properties)
                }
                None => None,
            };

            let endpoints = match service_config_map.get("endpoints") {
                Some(endpoints) => {
                    let mut result = HashMap::new();
                    let endpoints = endpoints.as_object().unwrap();
                    for (endpoint_name, endpoint_config) in endpoints {
                        let endpoints_properties = endpoint_config.as_object().unwrap();
                        let setting = endpoints_properties
                            .get("setting")
                            .unwrap()
                            .as_str()
                            .unwrap()
                            .to_string();
                        let target = endpoints_properties
                            .get("target")
                            .unwrap()
                            .as_str()
                            .unwrap()
                            .to_string();
                        let target = target.trim_start_matches("$").to_string();
                        let target_port_value = match service_properties {
                            Some(ref properties) => {
                                match properties.get(&target) {
                                    Some(value) => match value {
                                        ConfigValue::Inline { value } => match value {
                                            InlineValue::String { value } => value.clone(),
                                            InlineValue::Integer { value } => value.to_string(),
                                            _ => return Err(DomainError::Invalid {
                                                message: format!("Invalid endpoint value"),
                                            }),
                                        }
                                        _ => return Err(DomainError::Invalid {
                                            message: format!("Invalid endpoint value"),
                                        }),
                                    },
                                    None => return Err(DomainError::Invalid {
                                        message: format!("Unable to retrieve the target port; {} is not defined", target),
                                    }),
                                }
                            },
                            None => return Err(DomainError::Invalid {
                                message: format!("Unable to retrieve the target port as the properties are not defined"),
                            }),
                        };

                        let endpoint = Endpoint {
                            setting: {
                                match setting.as_str() {
                                    "internal" => EndpointSetting::Internal,
                                    "external" => EndpointSetting::External,
                                    _ => {
                                        return Err(DomainError::Invalid {
                                            message: "Invalid endpoint setting".to_string(),
                                        })
                                    }
                                }
                            },
                            target: target_port_value,
                        };
                        result.insert(endpoint_name.clone(), endpoint);
                    }

                    Some(result)
                }
                None => None,
            };

            let image = match service_config_map.get("image") {
                Some(image) => match image {
                    Value::String(s) => Some(s.clone()),
                    Value::Number(s) => Some(s.to_string()),
                    _ => None,
                },
                None => {
                    return Err(DomainError::Invalid {
                        message: format!("Image not defined"),
                    })
                }
            };

            let new_service = Service {
                replica: replica,
                image: image,
                endpoints: endpoints,
                dapr: dapr,
                properties: service_properties,
            };
            services.insert(service_name.clone(), Some(new_service));
        }
    }

    Ok(ReactionSpec {
        kind: source.kind.clone(),
        tag: source.tag.clone(),
        services: Some(services),
        properties: Some(properties),
        queries: source.queries.clone(),
    })
}
