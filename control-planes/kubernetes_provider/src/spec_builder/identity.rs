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

use std::collections::BTreeMap;

use k8s_openapi::api::core::v1::{EnvVar, ServiceAccount};
use kube::{api::ObjectMeta, ResourceExt};
use resource_provider_api::models::{ConfigValue, ServiceIdentity};

use crate::models::KubernetesSpec;

use super::map_env_vars;

#[allow(clippy::needless_late_init)]
pub fn apply_identity(spec: &mut KubernetesSpec, identity: &ServiceIdentity) {
    if spec.service_account.is_none() {
        let service_account_name = format!("{}.{}", spec.resource_type, spec.resource_id);

        let mut labels = BTreeMap::new();
        labels.insert("drasi/type".to_string(), spec.resource_type.to_string());
        labels.insert("drasi/resource".to_string(), spec.resource_id.to_string());

        spec.service_account = Some(ServiceAccount {
            metadata: ObjectMeta {
                name: Some(service_account_name.clone()),
                annotations: Some(BTreeMap::new()),
                labels: Some(labels),
                ..Default::default()
            },
            ..Default::default()
        });
        if let Some(spec) = spec.deployment.template.spec.as_mut() {
            spec.service_account_name = Some(service_account_name);
        }
    }
    let service_account = spec.service_account.as_mut().unwrap(); //asserted above

    let mut env_vars = BTreeMap::new();
    let id_type;

    match identity {
        ServiceIdentity::MicrosoftEntraWorkloadID { client_id } => {
            //set the client id annotation on service account
            service_account.annotations_mut().insert(
                "azure.workload.identity/client-id".to_string(),
                client_id.to_string(),
            );

            //set the use workload identity label on the pod
            if let Some(metadata) = spec.deployment.template.metadata.as_mut() {
                metadata.labels.get_or_insert(BTreeMap::new()).insert(
                    "azure.workload.identity/use".to_string(),
                    "true".to_string(),
                );
            }
            id_type = "MicrosoftEntraWorkloadID";
        }
        ServiceIdentity::MicrosoftEntraApplication {
            tenant_id,
            client_id,
            secret,
            certificate,
        } => {
            env_vars.insert("AZURE_TENANT_ID".to_string(), tenant_id.clone());
            env_vars.insert("AZURE_CLIENT_ID".to_string(), client_id.clone());

            if let Some(secret) = secret {
                env_vars.insert("AZURE_CLIENT_SECRET".to_string(), secret.clone());
            }
            if let Some(certificate) = certificate {
                env_vars.insert("AZURE_CLIENT_CERTIFICATE".to_string(), certificate.clone());
            }
            id_type = "MicrosoftEntraApplication";
        }
        ServiceIdentity::ConnectionString { connection_string } => {
            env_vars.insert("CONNECTION_STRING".to_string(), connection_string.clone());
            id_type = "ConnectionString";
        }
        ServiceIdentity::AccessKey { access_key } => {
            env_vars.insert("ACCESS_KEY".to_string(), access_key.clone());
            id_type = "AccessKey";
        }
        ServiceIdentity::AwsIamRole { role_arn } => {
            env_vars.insert("AWS_ROLE_ARN".to_string(), role_arn.clone());
            id_type = "AwsIamRole";

            let arn = match role_arn {
                ConfigValue::Inline { value } => value,
                _ => panic!("role_arn must be an inline value"),
            };

            let token_file = ConfigValue::Inline {
                value: "/var/run/secrets/eks.amazonaws.com/serviceaccount/token".to_string(),
            };
            env_vars.insert("AWS_WEB_IDENTITY_TOKEN_FILE".to_string(), token_file);

            // annotate the label for the service account
            service_account
                .annotations_mut()
                .insert("eks.amazonaws.com/role-arn".to_string(), arn.to_string());
        }
        ServiceIdentity::AwsIamAccessKey {
            access_key_id,
            secret_access_key,
            aws_region,
        } => {
            env_vars.insert("AWS_ACCESS_KEY_ID".to_string(), access_key_id.clone());
            env_vars.insert(
                "AWS_SECRET_ACCESS_KEY".to_string(),
                secret_access_key.clone(),
            );
            env_vars.insert("AWS_REGION".to_string(), aws_region.clone());

            id_type = "AwsIamAccessKey";
        }
    }

    if let Some(pod_spec) = &mut spec.deployment.template.spec {
        for container_spec in &mut pod_spec.containers {
            let env = container_spec.env.get_or_insert(Vec::new());
            env.push(EnvVar {
                name: "IDENTITY_TYPE".to_string(),
                value: Some(id_type.to_string()),
                ..Default::default()
            });
            env.extend(map_env_vars(env_vars.clone()));
        }
    }
}
