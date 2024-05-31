use serde::{Serialize, Deserialize};
use serde_json::Value;



#[derive(Debug, Clone)]
pub struct SourceConfig {
    pub storage_account: String,
    pub storage_access_key: String,
    pub queue_name: String,
    pub notification_url: String,
    pub resources: Vec<String>,
}

impl SourceConfig {
    pub fn new(account: &str, access_key: &str, queue_name: &str, notification_url: &str, resources: Vec<String>) -> Self {
        Self {
            storage_account: account.to_string(),
            storage_access_key: access_key.to_string(),
            queue_name: queue_name.to_string(),
            notification_url: notification_url.to_string(),
            resources,
        }
    }

    pub fn from_env() -> Self {
        let account = std::env::var("storageAccount").expect("storageAccount not set");
        let access_key = std::env::var("storageKey").expect("storageKey not set");
        let queue_name = std::env::var("storageQueueName").expect("storageQueueName not set");
        let notification_url = std::env::var("notificationUrl").expect("notificationUrl not set");
        let resources = std::env::var("resources").expect("resources not set");

        Self {
            storage_account: account,
            storage_access_key: access_key,
            queue_name,
            notification_url,
            resources: resources.split(",").map(|s| s.to_string()).collect(),
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct GraphResponse<TItem> {
    #[serde(rename = "@odata.context")]
    pub context: Option<String>,

    pub value: Vec<TItem>,
}

#[derive(Debug, Deserialize)]
pub struct DeltaResponse<TItem> {
    #[serde(rename = "@odata.context")]
    pub context: Option<String>,

    #[serde(rename = "@odata.deltaLink")]
    pub delta_link: Option<String>,

    pub value: Vec<TItem>,
}


#[derive(Debug, Deserialize)]
pub struct ParentReference {
    #[serde(rename = "driveId")]
    pub drive_id: String,
    //pub id: String,
    //pub path: String,
}

#[derive(Debug, Deserialize)]
pub struct DriveItem {
    pub id: String,
    pub name: Option<String>,
    
    #[serde(rename = "eTag")]
    pub etag: Option<String>,

    pub file: Option<FileInfo>,

    #[serde(rename = "parentReference")]
    pub parent_reference: Option<ParentReference>,
}

#[derive(Debug, Deserialize)]
pub enum MimeType {
    #[serde(rename = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")]
    SpreadSheet,

    #[serde(rename = "application/vnd.openxmlformats-officedocument.wordprocessingml.document")]
    WordDocument,

    #[serde(other)]
    Other,
}

#[derive(Debug, Deserialize)]
pub struct FileInfo {
    #[serde(rename = "mimeType")]
    pub mime_type: Option<MimeType>
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Subscription {
    pub id: Option<String>,

    #[serde(rename = "changeType")]
    pub change_type: Option<String>,

    #[serde(rename = "notificationUrl")]
    pub notification_url: Option<String>,

    pub resource: Option<String>,
    
    #[serde(rename = "expirationDateTime")]
    pub expiration_date_time: Option<chrono::DateTime<chrono::Utc>>,
    
    #[serde(rename = "clientState")]
    pub client_state: Option<String>,
    
    #[serde(rename = "lifecycleNotificationUrl")]
    pub lifecycle_notification_url: Option<String>,

}

#[derive(Debug, Deserialize)]
pub struct TableItem {
    pub id: String,
    pub name: String,
    
    #[serde(rename = "@odata.id")]
    pub global_id: String,
}

#[derive(Debug, Deserialize)]
pub struct HeaderRow {
    pub text: Vec<Vec<String>>,
}

#[derive(Debug, Deserialize)]
pub struct TableRow {
    #[serde(rename = "@odata.id")]
    pub id: String,

    pub values: Vec<Vec<Value>>,
}