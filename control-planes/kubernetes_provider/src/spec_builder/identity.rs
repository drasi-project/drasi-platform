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

use k8s_openapi::api::core::v1::ServiceAccount;
use kube::{api::ObjectMeta, ResourceExt};
use resource_provider_api::models::ServiceIdentity;

use crate::models::KubernetesSpec;

pub fn apply_identity(spec: &mut KubernetesSpec, identity: &ServiceIdentity) {
    if let None = spec.service_account {
        let service_account_name = format!(
            "{}.{}.{}",
            spec.resource_type, spec.resource_id, spec.service_name
        );
        spec.service_account = Some(ServiceAccount {
            metadata: ObjectMeta {
                name: Some(service_account_name.clone()),
                annotations: Some(BTreeMap::new()),
                labels: spec.deployment.selector.match_labels.clone(),
                ..Default::default()
            },
            ..Default::default()
        });
        if let Some(spec) = spec.deployment.template.spec.as_mut() {
            spec.service_account_name = Some(service_account_name);
        }
    }
    let service_account = spec.service_account.as_mut().unwrap(); //asserted above

    match identity {
        ServiceIdentity::MicrosoftManagedIdentity { client_id } => {
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
        }
    }
}
