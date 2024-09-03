use super::{ResourceProviderDomainService, ResourceProviderDomainServiceImpl};
use crate::{
    domain::models::{DomainError, SourceProviderSpec},
    persistence::SourceProviderRepository,
    SpecValidator,
};
use dapr::client::TonicClient;
use serde_json::Value;

use async_trait::async_trait;
pub type SourceProviderDomainService = dyn ResourceProviderDomainService<SourceProviderSpec>;
pub type SourceProviderDomainServiceImpl = ResourceProviderDomainServiceImpl<SourceProviderSpec>;

impl SourceProviderDomainServiceImpl {
    pub fn new(
        dapr_client: dapr::Client<TonicClient>,
        repo: Box<SourceProviderRepository>,
    ) -> Self {
        SourceProviderDomainServiceImpl {
            dapr_client,
            repo: repo,
            validators: vec![Box::new(SourceProviderValidator {})],
            _TProviderSpec: std::marker::PhantomData,
        }
    }
}

struct SourceProviderValidator {}

#[async_trait]
impl SpecValidator<SourceProviderSpec> for SourceProviderValidator {
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
            "properties": {
              "proxy": {
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
              },
              "reactivator": {
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
            "required": ["proxy", "reactivator"],
            "additionalProperties": true
          }
        },
        "required": ["services"]
      }"#;

        let spec: Value = match serde_json::from_str(provider_schema_json) {
            Ok(spec) => spec,
            Err(e) => {
                return Err(DomainError::Invalid {
                    message: format!("Invalid Source Provider definition: {}", e),
                });
            }
        };
        let compiled_schema = match jsonschema::JSONSchema::compile(&spec) {
            Ok(schema) => schema,
            Err(e) => {
                return Err(DomainError::Invalid {
                    message: format!("Invalid Source Provider definition: {}", e),
                });
            }
        };
        let result = compiled_schema.validate(&schema);
        if let Err(errors) = result {
            for error in errors {
                return Err(DomainError::Invalid {
                    message: format!("Invalid Source Provider definition: {}", error),
                });
            }
        }
        Ok(())
    }
}
