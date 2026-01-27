// Copyright 2024 The Drasi Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

use std::collections::HashSet;
use std::sync::Arc;

use super::{
    QueryContainerDomainService, ResourceDomainService, StandardResourceDomainServiceImpl,
    StandardSpecValidator,
};
use crate::{
    domain::models::{DomainError, QuerySpec, QueryStatus},
    persistence::QueryRepository,
};
use async_trait::async_trait;
use dapr::client::TonicClient;

pub type QueryDomainService = dyn ResourceDomainService<QuerySpec, QueryStatus>;
pub type QueryDomainServiceImpl = StandardResourceDomainServiceImpl<
    QuerySpec,
    QueryStatus,
    resource_provider_api::models::QuerySpec,
    resource_provider_api::models::QueryStatus,
>;

impl QueryDomainServiceImpl {
    pub fn new(
        dapr_client: dapr::Client<TonicClient>,
        repo: Arc<QueryRepository>,
        container_service: Arc<QueryContainerDomainService>,
    ) -> Self {
        QueryDomainServiceImpl {
            dapr_client,
            repo,
            actor_type: |spec| format!("{}.ContinuousQuery", spec.container),
            ready_check: |status| status.status == "Running",
            validators: vec![Box::new(QuerySpecValidator {
                query_container_service: container_service,
            })],
            _tspec: std::marker::PhantomData,
            _tstatus: std::marker::PhantomData,
            _tapi_spec: std::marker::PhantomData,
            _tapi_status: std::marker::PhantomData,
        }
    }
}

struct QuerySpecValidator {
    query_container_service: Arc<QueryContainerDomainService>,
}

#[async_trait]
impl StandardSpecValidator<QuerySpec> for QuerySpecValidator {
    async fn validate(&self, spec: &QuerySpec) -> Result<(), DomainError> {
        let qc = match self.query_container_service.get(&spec.container).await {
            Ok(qc) => qc,
            Err(e) => match e {
                DomainError::NotFound => {
                    return Err(DomainError::Invalid {
                        message: format!("Query container {} does not exist", spec.container),
                    })
                }
                _ => return Err(e),
            },
        };

        // Validate that all middleware referenced in subscriptions' pipelines
        // are defined in sources.middleware.
        let defined_middleware: HashSet<&str> = spec
            .sources
            .middleware
            .iter()
            .map(|m| m.name.as_str())
            .collect();

        for sub in &spec.sources.subscriptions {
            for mw in &sub.pipeline {
                if !defined_middleware.contains(mw.as_str()) {
                    return Err(DomainError::InvalidSpec {
                        message: format!(
                            "Middleware '{}' referenced in pipeline for subscription '{}' is not defined in sources.middleware",
                            mw, sub.id
                        ),
                    });
                }
            }
        }

        match qc.status {
            Some(status) => match status.available {
                true => Ok(()),
                false => Err(DomainError::QueryContainerOffline),
            },
            None => Err(DomainError::QueryContainerOffline),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::domain::models::*;
    use async_trait::async_trait;
    use std::collections::HashMap;

    struct TestQueryContainerService {
        status: Option<QueryContainerStatus>,
    }

    #[async_trait]
    impl ResourceDomainService<QueryContainerSpec, QueryContainerStatus> for TestQueryContainerService {
        async fn set(
            &self,
            _id: &str,
            _source: QueryContainerSpec,
        ) -> Result<Resource<QueryContainerSpec, QueryContainerStatus>, DomainError> {
            unimplemented!("not needed for these tests")
        }

        async fn delete(&self, _id: &str) -> Result<(), DomainError> {
            unimplemented!("not needed for these tests")
        }

        async fn get(
            &self,
            id: &str,
        ) -> Result<Resource<QueryContainerSpec, QueryContainerStatus>, DomainError> {
            Ok(Resource {
                id: id.to_string(),
                spec: QueryContainerSpec {
                    query_host_count: 1,
                    results: HashMap::new(),
                    storage: HashMap::new(),
                    default_store: "default".to_string(),
                },
                status: self.status.clone(),
            })
        }

        async fn list(
            &self,
        ) -> Result<Vec<Resource<QueryContainerSpec, QueryContainerStatus>>, DomainError> {
            unimplemented!("not needed for these tests")
        }

        async fn wait_for_ready(
            &self,
            _id: &str,
            _time_out: std::time::Duration,
        ) -> Result<bool, DomainError> {
            unimplemented!("not needed for these tests")
        }
    }

    fn make_query_spec_with_pipeline(pipeline: Vec<String>) -> QuerySpec {
        QuerySpec {
            container: "qc1".to_string(),
            mode: "continuous".to_string(),
            query: "SELECT *".to_string(),
            query_language: None,
            sources: QuerySources {
                subscriptions: vec![QuerySubscription {
                    id: "sub1".to_string(),
                    nodes: vec![],
                    relations: vec![],
                    pipeline,
                }],
                joins: vec![],
                middleware: vec![
                    SourceMiddlewareConfig {
                        kind: "example".to_string(),
                        name: "mw1".to_string(),
                        config: serde_json::Map::new(),
                    },
                    SourceMiddlewareConfig {
                        kind: "example".to_string(),
                        name: "mw2".to_string(),
                        config: serde_json::Map::new(),
                    },
                ],
            },
            storage_profile: None,
            view: ViewSpec {
                enabled: false,
                retention_policy: RetentionPolicy::Latest,
            },
            transient: None,
        }
    }

    #[tokio::test]
    async fn validate_passes_when_pipeline_middlewares_exist() {
        let svc: Arc<QueryContainerDomainService> = Arc::new(TestQueryContainerService {
            status: Some(QueryContainerStatus {
                available: true,
                messages: None,
            }),
        });
        let validator = QuerySpecValidator {
            query_container_service: svc,
        };

        let spec = make_query_spec_with_pipeline(vec!["mw1".into(), "mw2".into()]);

        let res = validator.validate(&spec).await;
        assert!(res.is_ok());
    }

    #[tokio::test]
    async fn validate_fails_when_pipeline_references_unknown_middleware() {
        // Even if the container is offline, the middleware error should be raised first
        let svc: Arc<QueryContainerDomainService> = Arc::new(TestQueryContainerService {
            status: Some(QueryContainerStatus {
                available: false,
                messages: None,
            }),
        });
        let validator = QuerySpecValidator {
            query_container_service: svc,
        };

        let spec = make_query_spec_with_pipeline(vec!["unknown".into()]);

        let err = validator.validate(&spec).await.unwrap_err();
        match err {
            DomainError::InvalidSpec { message } => {
                assert!(message.contains("unknown"));
                assert!(message.contains("sub1"));
            }
            other => panic!("expected InvalidSpec, got: {:?}", other),
        }
    }

    #[tokio::test]
    async fn validate_accepts_query_spec_without_language_specified() {
        // Test that a QuerySpec with query_language: None is valid and accepted.
        // Note: This only validates spec acceptance; the actual default to GQL
        // is handled by the query worker.
        let svc: Arc<QueryContainerDomainService> = Arc::new(TestQueryContainerService {
            status: Some(QueryContainerStatus {
                available: true,
                messages: None,
            }),
        });
        let validator = QuerySpecValidator {
            query_container_service: svc,
        };

        let spec = make_query_spec_with_pipeline(vec!["mw1".into()]);
        assert!(spec.query_language.is_none());

        let res = validator.validate(&spec).await;
        assert!(res.is_ok());
    }

    #[tokio::test]
    async fn validate_accepts_query_spec_with_cypher_language() {
        // Test that a QuerySpec with query_language: Some(Cypher) is valid
        let svc: Arc<QueryContainerDomainService> = Arc::new(TestQueryContainerService {
            status: Some(QueryContainerStatus {
                available: true,
                messages: None,
            }),
        });
        let validator = QuerySpecValidator {
            query_container_service: svc,
        };

        let mut spec = make_query_spec_with_pipeline(vec!["mw1".into()]);
        spec.query_language = Some(QueryLanguage::Cypher);

        let res = validator.validate(&spec).await;
        assert!(res.is_ok());
    }

    #[tokio::test]
    async fn validate_accepts_query_spec_with_gql_language() {
        // Test that a QuerySpec with query_language: Some(GQL) is valid
        let svc: Arc<QueryContainerDomainService> = Arc::new(TestQueryContainerService {
            status: Some(QueryContainerStatus {
                available: true,
                messages: None,
            }),
        });
        let validator = QuerySpecValidator {
            query_container_service: svc,
        };

        let mut spec = make_query_spec_with_pipeline(vec!["mw1".into()]);
        spec.query_language = Some(QueryLanguage::GQL);

        let res = validator.validate(&spec).await;
        assert!(res.is_ok());
    }
}
