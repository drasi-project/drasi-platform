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
            _TSpec: std::marker::PhantomData,
            _TStatus: std::marker::PhantomData,
            _TApiSpec: std::marker::PhantomData,
            _TApiStatus: std::marker::PhantomData,
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
                return Err(DomainError::InvalidSpec {
                    message: format!("Reaction kind {} not found", kind),
                })
            }
        };

        println!("spec: {:?}", spec);

        let config_schema = match schema.get("config_schema") {
            Some(config_schema) => Some(config_schema),
            None => None,
        };

        let schema_services = match schema.get("services") {
            Some(service) => service,
            None => {
                return Err(DomainError::InvalidSpec {
                    message: format!("Invalid reaction schema"),
                })
            }
        };
        if let Some(config_schema) = config_schema {
            let validation = match JSONSchema::compile(config_schema) {
                Ok(validation) => validation,
                Err(e) => {
                    return Err(DomainError::InvalidSpec {
                        message: format!("Invalid reaction schema: {}", e),
                    })
                }
            };
            let source_properties = match spec.properties {
                Some(ref properties) => properties.clone(),
                None => return Err(DomainError::InvalidSpec {
                    message: format!("properties are not defined for reaction {}", kind),
                }),
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
                        message: format!("Unable to parse the properties"),
                    })
                }
            };
            let result = validation.validate(&json_data_properties);

            if let Err(errors) = result {
                for error in errors {
                    return Err(DomainError::InvalidSpec {
                        message: format!(
                            "Invalid reaction spec: {}; error path: {}",
                            error, error.instance_path
                        ),
                    });
                }
            }
        }

        let schema_services = match schema_services.as_object() {
            Some(schema_services) => schema_services,
            None => {
                return Err(DomainError::JsonParseError {
                    message: format!("Invalid reaction schema"),
                })
            }
        };
        let services = match spec.services.clone() {
            Some(services) => services,
            None => {
                return Err(DomainError::InvalidSpec {
                    message: format!("Services not defined"),
                })
            }
        };
        let defined_services: Vec<String> = schema_services.keys().map(|s| s.clone()).collect();
        for (service_name, _service_settings) in &services {
            if !defined_services.contains(&service_name) {
                return Err(DomainError::UndefinedSetting {
                    message: format!("Service {} is not defined in the schema", service_name),
                });
            }
        }
        let services = match spec.services.clone() {
            Some(services) => services,
            None => {
                return Err(DomainError::InvalidSpec {
                    message: format!("reaction service are not defined for reaction {}", kind),
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

            let validation = match JSONSchema::compile(service_config_schema) {
                Ok(validation) => validation,
                Err(e) => {
                    return Err(DomainError::InvalidSpec {
                        message: format!("Invalid reaction schema: {}", e),
                    })
                }
            };

            let curr_service_config_schema = match services.get(service_name) {
                Some(service) => match service {
                    Some(service) => match &service.properties {
                        Some(properties) => properties.clone(),
                        None => HashMap::new(),
                    },
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
                match serde_json::to_value(curr_service_config_schema_json_value) {
                    Ok(json_data_properties) => json_data_properties,
                    Err(e) => {
                        return Err(DomainError::JsonParseError {
                            message: format!("Unable to parse the service properties"),
                        })
                    }
                };
            let result = validation.validate(&json_data_properties);

            if let Err(errors) = result {
                for error in errors {
                    return Err(DomainError::InvalidSpec {
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
        let schema_properties = match schema_properties.as_object() {
            Some(properties) => properties,
            None => {
                return Err(DomainError::JsonParseError {
                    message: format!("Invalid reaction schema"),
                })
            }
        };

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
                            value: match n.as_i64() {
                                Some(i) => i,
                                None => return Err(DomainError::InvalidSpec {
                                    message: format!("expected a valid integer"),
                                }),
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
                                    value: InlineValue::Boolean { value: *b },
                                },
                                Value::Number(n) => ConfigValue::Inline {
                                    value: InlineValue::Integer {
                                        value: match n.as_i64() {
                                            Some(i) => i,
                                            None => return Err(DomainError::InvalidSpec {
                                                message: format!("expected a valid integer"),
                                            }),
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

    let mut services = match source.services {
        Some(ref services) => services.clone(),
        None => HashMap::new(),
    };

    if let Some(schema_services) = schema_json.get("services") {
        let schema_services = match schema_services.as_object() {
            Some(properties) => properties,
            None => {
                return Err(DomainError::JsonParseError {
                    message: format!("Invalid reaction schema"),
                })
            }
        };
        
        for (service_name, service_config) in schema_services {
            let service_config_map = match service_config.as_object() {
                Some(properties) => properties,
                None => {
                    return Err(DomainError::JsonParseError {
                        message: format!("Invalid service properties for {}", service_name),
                    })
                }
            };

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
                                            value: match n.as_i64() {
                                                Some(i) => i.to_string(),
                                                None => return Err(DomainError::InvalidSpec {
                                                    message: format!("expected a valid integer"),
                                                }),
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
                                                    Some(i) => i.to_string(),
                                                    None => return Err(DomainError::InvalidSpec {
                                                        message: format!("expected a valid integer"),
                                                    }),
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
                    let properties = match properties.get("properties") {
                        Some(properties) => match properties.as_object() {
                            Some(properties) => properties,
                            None => {
                                return Err(DomainError::JsonParseError {
                                    message: format!("Invalid properties for {}", service_name),
                                })
                            }
                        },
                        None => {
                            return Err(DomainError::InvalidSpec {
                                message: format!("Unable to retrieve the service properties for {}", service_name),
                            })
                        }
                    };
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
                                        value: match n.as_i64() {
                                            Some(i) => i,
                                            None => return Err(DomainError::InvalidSpec {
                                                message: format!("expected a valid integer"),
                                            }),
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
                                                value: InlineValue::Boolean { value: *b },
                                            },
                                            Value::Number(n) => ConfigValue::Inline {
                                                value: InlineValue::Integer {
                                                    value: match n.as_i64() {
                                                        Some(i) => i,
                                                        None => return Err(DomainError::InvalidSpec {
                                                            message: format!("expected a valid integer"),
                                                        }),
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
                    let endpoints = match endpoints.as_object() {
                        Some(endpoints) => endpoints,
                        None => {
                            return Err(DomainError::JsonParseError {
                                message: format!("Invalid endpoints for {}", service_name),
                            })
                        }
                    };
                    for (endpoint_name, endpoint_config) in endpoints {
                        let endpoints_properties = match endpoint_config.as_object() {
                            Some(properties) => properties,
                            None => {
                                return Err(DomainError::JsonParseError {
                                    message: format!("Invalid endpoint properties for {}", endpoint_name),
                                })
                            }
                        };
                        let setting = match endpoints_properties
                            .get("setting") {
                                Some(setting) => setting.as_str().unwrap().to_string(),
                                None => return Err(DomainError::InvalidSpec {
                                    message: format!("Invalid endpoint setting"),
                                }),
                            };
                        let target = match endpoints_properties
                            .get("target") {
                                Some(target) => target.as_str().unwrap().to_string(),
                                None => return Err(DomainError::InvalidSpec {
                                    message: format!("Invalid endpoint target"),
                                }),
                            };
                        let target = target.trim_start_matches("$").to_string();
                        let target_port_value = match service_properties {
                            Some(ref properties) => {
                                match properties.get(&target) {
                                    Some(value) => match value {
                                        ConfigValue::Inline { value } => match value {
                                            InlineValue::String { value } => value.clone(),
                                            InlineValue::Integer { value } => value.to_string(),
                                            _ => return Err(DomainError::InvalidSpec {
                                                message: format!("Invalid endpoint value; endpoint target must be a string or integer"),
                                            }),
                                        }
                                        _ => return Err(DomainError::InvalidSpec {
                                            message: format!("Invalid endpoint value; endpoint target must be a string or integer"),
                                        }),
                                    },
                                    None => return Err(DomainError::InvalidSpec {
                                        message: format!("Unable to retrieve the target port; {} is not defined", target),
                                    }),
                                }
                            },
                            None => return Err(DomainError::InvalidSpec {
                                message: format!("target port is not defined"),
                            }),
                        };

                        let endpoint = Endpoint {
                            setting: {
                                match setting.as_str() {
                                    "internal" => EndpointSetting::Internal,
                                    "external" => EndpointSetting::External,
                                    _ => {
                                        return Err(DomainError::InvalidSpec {
                                            message: format!("Invalid endpoint setting; endpoint setting must be either internal or external"),
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
                    _ => return Err(DomainError::InvalidSpec {
                        message: format!("Invalid image value"),
                    }),
                },
                None => {
                    return Err(DomainError::InvalidSpec {
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
    } else {
        return Err(DomainError::InvalidSpec {
            message: format!("Invalid reaction schema"),
        });
    }

    Ok(ReactionSpec {
        kind: source.kind.clone(),
        tag: source.tag.clone(),
        services: Some(services),
        properties: Some(properties),
        queries: source.queries.clone(),
    })
}
