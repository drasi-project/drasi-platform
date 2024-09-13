use super::{ResourceProviderDomainService, ResourceProviderDomainServiceImpl, SchemaValidator};
use crate::{
    domain::models::{DomainError, ReactionProviderSpec},
    persistence::ReactionProviderRepository,
};
use dapr::client::TonicClient;

use async_trait::async_trait;
use serde_json::Value;
pub type ReactionProviderDomainService = dyn ResourceProviderDomainService<ReactionProviderSpec>;
pub type ReactionProviderDomainServiceImpl =
    ResourceProviderDomainServiceImpl<ReactionProviderSpec>;

impl ReactionProviderDomainServiceImpl {
    pub fn new(
        dapr_client: dapr::Client<TonicClient>,
        repo: Box<ReactionProviderRepository>,
    ) -> Self {
        ReactionProviderDomainServiceImpl {
            dapr_client,
            repo: repo,
            validators: vec![Box::new(ReactionProviderValidator {})],
            _TProviderSpec: std::marker::PhantomData,
        }
    }
}

struct ReactionProviderValidator {}

#[async_trait]
impl SchemaValidator for ReactionProviderValidator {
    async fn validate_schema(&self, schema: &Value) -> Result<(), DomainError> {
        let provider_schema_json = r#"{
            "type": "object",
            "properties": {
                "config_schema": {
                    "type": "object",
                    "properties": {
                        "properties": {
                          "type": "object",
                          "patternProperties": {
                            ".*": {
                              "type": "object",
                              "properties": {
                                "type": {
                                  "type": "string"
                                },
                                "default": {
                                  "type": ["string", "object", "array", "number", "boolean"]
                                }
                              },
                              "required": ["type"],
                              "additionalProperties": false
                            }
                          }
                        },
                        "type": {
                            "type": "string"
                        },
                        "required": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    },
                    "required": ["properties", "type"]
                },
                "services": {
                    "type": "object",
                    "patternProperties": {
                      ".*": {
                        "type": "object",
                        "properties": {
                          "image": {
                            "type": "string"
                          },
                          "dapr": {
                            "type": "object",
                            "properties": {
                              "app-port": {
                                "type": "string"
                              },
                              "app-protocol": {
                                "type": "string"
                              }
                            }
                          },
                          "endpoints": {
                            "type": "object",
                            "patternProperties": {
                              ".*": {
                                "type": "object",
                                "properties": {
                                  "setting": {
                                    "oneOf": [
                                      {
                                        "type": "string",
                                        "enum": ["internal"]
                                      },
                                      {
                                        "type": "string",
                                        "enum": ["external"]
                                      }
                                    ]
                                  },
                                  "target": {
                                    "type": "string",
                                    "pattern": "^\\$.*$"
                                  }
                                },
                                "required": ["setting", "target"]
                              }
                            }
                          },
                          "config_schema": {
                            "type": "object",
                            "properties": {
                              "properties": {
                                "type": "object",
                                "patternProperties": {
                                  ".*": {
                                    "type": "object",
                                    "properties": {
                                      "type": {
                                        "type": "string"
                                      },
                                      "default": {
                                        "type": ["string", "object", "array", "number", "boolean"]
                                      }
                                    },
                                    "required": ["type"],
                                    "additionalProperties": false
                                  }
                                }
                              },
                              "type": {
                                  "type": "string"
                              },
                              "required": {
                                  "type": "array",
                                  "items": {
                                      "type": "string"
                                  }
                              }
                            },
                            "required": ["properties", "type"]
                          }
                        },
                        "required": ["image"]
                      }
                    },
                    "additionalProperties": true,
                    "minProperties": 1
                }
            },
            "required": ["services"]
        }"#;

        let spec: Value = match serde_json::from_str(provider_schema_json) {
            Ok(spec) => spec,
            Err(e) => {
                return Err(DomainError::Invalid {
                    message: format!("Invalid Reaction Provider definition: {},", e),
                });
            }
        };
        let compiled_schema = match jsonschema::JSONSchema::compile(&spec) {
            Ok(schema) => schema,
            Err(e) => {
                return Err(DomainError::Invalid {
                    message: format!("Invalid Reaction Provider definition: {},", e),
                });
            }
        };

        let result = compiled_schema.validate(&schema);
        if let Err(errors) = result {
            for error in errors {
                return Err(DomainError::Invalid {
                    message: format!(
                        "Invalid Reaction Provider definition: {}, instance path: {}",
                        error, error.instance_path
                    ),
                });
            }
        }
        Ok(())
    }
}
