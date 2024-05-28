use super::{ResourceDomainService, ResourceDomainServiceImpl};
use crate::{
    domain::models::{
        ConfigValue, DomainError, Endpoint, EndpointSetting, InlineValue, Service, SourceSpec,
        SourceStatus,
    },
    persistence::SourceRepository,
    SpecValidator,
};
use actix_identity::config;
use dapr::client::TonicClient;
use jsonschema::JSONSchema;
use serde_json::Value;
use std::collections::HashMap;

use async_trait::async_trait;
pub type SourceDomainService = dyn ResourceDomainService<SourceSpec, SourceStatus>;
pub type SourceDomainServiceImpl = ResourceDomainServiceImpl<
    SourceSpec,
    SourceStatus,
    resource_provider_api::models::SourceSpec,
    resource_provider_api::models::SourceStatus,
>;

impl SourceDomainServiceImpl {
    pub fn new(dapr_client: dapr::Client<TonicClient>, repo: Box<SourceRepository>) -> Self {
        SourceDomainServiceImpl {
            dapr_client,
            repo: repo,
            actor_type: |_spec| "SourceResource".to_string(),
            ready_check: |status| status.available,
            validators: vec![Box::new(SourceSpecValidator {})],
            retrieve_current_kind: |spec| Some(spec.kind.clone()),
            populate_default_values: |properties, schema_data| {
                populate_default_values(properties, schema_data)
            },
            _TSpec: std::marker::PhantomData,
            _TStatus: std::marker::PhantomData,
            _TApiSpec: std::marker::PhantomData,
            _TApiStatus: std::marker::PhantomData,
        }
    }
}

struct SourceSpecValidator {}

#[async_trait]
impl SpecValidator<SourceSpec> for SourceSpecValidator {
    // Validate the `config_schema` and `services.service.config_schema` sections
    async fn validate(&self, spec: &SourceSpec, schema: &Option<Value>) -> Result<(), DomainError> {
        let kind = spec.kind.clone();
        let schema = match schema {
            Some(schema) => schema,
            None => {
                return Err(DomainError::Invalid {
                    message: format!("Schema for kind {} not found", kind),
                });
            }
        };

        let config_schema = match schema.get("config_schema") {
            Some(config_schema) => Some(config_schema),
            None => None,
        };

        let schema_services = match schema.get("services") {
            Some(service) => service,
            None => {
                return Err(DomainError::Invalid {
                    message: format!("Invalid source schema"),
                })
            }
        };

        if let Some(config_schema) = config_schema {
            let validation = JSONSchema::compile(config_schema).unwrap();
            let source_properties = spec.properties.clone().unwrap();

            let mut new_spec_properties = serde_json::Map::new();
            for (key, value) in source_properties {
                let value = match value {
                    Some(value) => match value {
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
                    },
                    None => serde_json::Value::Null,
                };
                new_spec_properties.insert(key, value);
            }

            let json_data_properties = serde_json::to_value(new_spec_properties).unwrap();
            let result = validation.validate(&json_data_properties);

            if let Err(errors) = result {
                for error in errors {
                    println!("Validation error: {}", error);
                    println!("Instance path: {}", error.instance_path);
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
                    message: format!("Services not defined"),
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

            let service_config_schema = service_config_schema.unwrap();

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
                    println!("Validation error: {}", error);
                    println!("Instance path: {}", error.instance_path);
                    return Err(DomainError::Invalid {
                        message: format!(
                            "Invalid source spec: {}; error path: {}",
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
    source: &SourceSpec,
    schema_json: Value,
) -> Result<SourceSpec, DomainError> {
    let mut properties = match source.properties {
        Some(ref properties) => properties.clone(),
        None => HashMap::new(),
    };
    // Retrieve the 'properties' field from the schema
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
                properties.insert(key.clone(), Some(default_value));
            }
        }
    }

    let mut services = match source.services {
        Some(ref services) => services.clone(),
        None => HashMap::new(),
    };

    // Traverse through the services and populate the default values
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
                    let mut curr_service_properties = match curr_service.properties {
                        Some(properties) => properties,
                        None => HashMap::new(),
                    };
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
                            curr_service_properties.insert(key.clone(), default_value);
                        }
                    }
                    Some(curr_service_properties)
                }
                None => None,
            };

            println!("service_properties: {:?}", service_properties);

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
                                            message: format!("Invalid endpoint setting"),
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

    Ok(SourceSpec {
        kind: source.kind.clone(),
        properties: Some(properties),
        services: Some(services),
    })
}
