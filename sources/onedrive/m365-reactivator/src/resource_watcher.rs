use std::{sync::Arc, time::SystemTime, collections::HashMap};

use crate::{m365_auth::TokenManager, models::{SourceConfig, GraphResponse, Subscription}, drive_change_processor::DriveChangeProcessor, document_cache::DocumentCache, publisher::Publisher};

use azure_core::base64;
use azure_storage::prelude::*;
use azure_storage_queues::prelude::*;
use chrono::{Utc, Days};
use graph_rs_sdk::{Graph, GraphFailure, http::BodyRead};
use serde::Deserialize;
use serde_json::json;


pub struct ResourceWatcher {
    join_handle: tokio::task::JoinHandle<()>,
}   

impl ResourceWatcher {
    pub fn start(config: &SourceConfig, document_cache: Arc<DocumentCache>, token_manager: Arc<TokenManager>, publisher: Arc<Publisher>) -> Self {
        
        
        let config = config.clone();
        let drive_item_proc = Arc::new(DriveChangeProcessor::new(token_manager.clone(), document_cache.clone(), publisher));

        let join_handle = tokio::task::spawn(async move {

            let mut resources = HashMap::new();
            
            for resource_id in &config.resources {
                log::info!("Starting watcher for resource {}", resource_id);

                log::info!("Confirming subscription for resource {}", resource_id);
                let subscription_id = confirm_subscription(&config.notification_url, &resource_id, token_manager.clone()).await.expect("Error confirming subscription");
                log::info!("Subscription {subscription_id} confirmed for resource {resource_id}");

                resources.insert(resource_id, ResourceWatchMetadata {
                    resource_type: ResourceType::Drive,
                    resource_id: resource_id.clone(),
                    subscription_id,
                });

                let rid = resource_id.clone();
                let dip = drive_item_proc.clone();
                tokio::task::spawn(async move {
                    loop {
                        _ = dip.process_change(&rid).await;
                        tokio::time::sleep(std::time::Duration::from_secs(10)).await;
                    }
                });
                
            }

            
            let storage_credentials = StorageCredentials::Key(config.storage_account.clone(), config.storage_access_key.clone());
            let queue_service = QueueServiceClient::new(config.storage_account.clone(), storage_credentials);
            let queue = queue_service.queue_client(config.queue_name.clone());

            loop {
                let response = match queue.get_messages().await {
                    Ok(response) => response,
                    Err(err) => {
                        log::error!("Error getting messages from queue: {}", err);
                        tokio::time::sleep(std::time::Duration::from_secs(5)).await;
                        continue;
                    }
                };
                if response.messages.is_empty() {
                    log::info!("No messages in queue");
                    tokio::time::sleep(std::time::Duration::from_secs(5)).await;
                    continue;
                }
                for message in response.messages {
                    
                    //log::info!("Got message from queue: {}", message.message_text);
                    //decode base64 message text
                    let decoded = match base64::decode(&message.message_text) {
                        Ok(decoded) => decoded,
                        Err(err) => {
                            log::error!("Error decoding message: {}", err);
                            continue;
                        }
                    };

                    //log::info!("Decoded message: {}", String::from_utf8_lossy(&decoded));

                    let changes: ChangeEnvelope = match serde_json::from_slice(decoded.as_slice()) {
                        Ok(changes) => changes,
                        Err(err) => {
                            log::error!("Error parsing message: {}", err);
                            continue;
                        }
                    };

                    for change in &changes.value {
                        if !resources.contains_key(&change.resource) {
                            log::info!("Resource {} not found in list of resources", change.resource);
                            continue;
                        }
                        
                        let data = resources.get(&change.resource).unwrap().clone();
                        if let Err(err) = drive_item_proc.process_change(&data.resource_id).await {
                            log::error!("Error processing change: {}", err);
                            continue;
                        }
    
                        //todo: check for lifecycle messages and renew subscription
                    }
                    
                    match queue.pop_receipt_client(message).delete().await {
                        Ok(_) => {
                            log::debug!("Deleted message from queue");
                        },
                        Err(err) => {
                            log::error!("Error deleting message from queue: {}", err);
                        }
                    };
                }
            }

            // for resource_id in &config.resources {
            //     log::info!("Resource watcher for {} stopped", resource_id);
            // }
        });
        
        
        Self {
            join_handle,
        }
    }
    
    pub async fn join(self) {
        self.join_handle.await.expect("Error joining resource watcher");
    }

}

#[derive(Clone)]
enum ResourceType {
    Drive,
}

#[derive(Clone)]
struct ResourceWatchMetadata {
    resource_type: ResourceType,
    resource_id: String,
    subscription_id: String,
}

async fn confirm_subscription(notification_url: &str, resource: &str, token_manager: Arc<TokenManager>) -> Result<String, GraphFailure> {
    let token = token_manager.get_token().await?;
    let client = Graph::new(token.bearer_token());

    
    let list = client
        .subscriptions()
        .list_subscription()
        .paging()
        .json::<GraphResponse<Subscription>>()
        .await?;

    for bs in list {
        let body = bs.into_body().unwrap();

        for subscription in body.value {
            if subscription.notification_url == Some(notification_url.to_string()) && subscription.resource == Some(resource.to_string()) {
                log::info!("Found existing subscription: {:?}", subscription);
                return Ok(subscription.id.unwrap());
            }
        }
    }

    let create_body = BodyRead::from_serialize(&json!({
        "changeType": "updated",
        "notificationUrl": notification_url,
        "resource": resource,
        "expirationDateTime": chrono::DateTime::<Utc>::from(SystemTime::now()).checked_add_days(Days::new(30)),
        "clientState": "todo",
        "lifecycleNotificationUrl": notification_url
    })).unwrap();

    let create_res = client.subscriptions().create_subscription(create_body).send().await?;

    let result = create_res.json::<Subscription>().await?;

    log::info!("Created subscription: {:?}", result);

    Ok(result.id.unwrap())
}


#[derive(Debug, Deserialize)]
struct ChangeEnvelope {
    value: Vec<ChangeMessage>
}

#[derive(Debug, Deserialize)]
struct ChangeMessage {
    #[serde(rename = "subscriptionId")]
    subscription_id: String,

    resource: String,

    #[serde(rename = "subscriptionExpirationDateTime")]
    subscription_expiration_date_time: Option<chrono::DateTime<Utc>>,

    #[serde(rename = "lifecycleEvent")]
    lifecycle_event: Option<String>

}