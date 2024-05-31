use std::{sync::Arc, collections::{HashMap, BTreeMap}};
use futures::StreamExt;
use graph_rs_sdk::{GraphFailure, Graph, http::Method};
use serde_json::{json, Value, Map};
use tokio::sync::Mutex;

use crate::{models::{DeltaResponse, DriveItem, GraphResponse, TableItem, HeaderRow, TableRow, MimeType}, m365_auth::TokenManager, document_cache::{Document, DocumentElement, DocumentCache, ElementDiff}, api::{ChangeMessage, ChangeElement, ChangePayload, ChangeSource}, publisher::Publisher};



pub struct DriveChangeProcessor {
    token_manager: Arc<TokenManager>,
    document_cache: Arc<DocumentCache>,
    publisher: Arc<Publisher>,

    delta_links: Mutex<HashMap<String, String>>,
}

impl DriveChangeProcessor {
    pub fn new(token_manager: Arc<TokenManager>, docuemnt_cache: Arc<DocumentCache>, publisher: Arc<Publisher>) -> Self {
        Self {
            token_manager,
            document_cache: docuemnt_cache,
            publisher,
            delta_links: Mutex::new(HashMap::new()),
        }
    }

    pub async fn process_change(&self, resource_id: &str) -> Result<(), GraphFailure> {
        let token = self.token_manager.get_token().await?;
        let graph = Graph::new(token.bearer_token());
        let mut delta_links = self.delta_links.lock().await;
        
        //extract the drive id from resource id
        let drive_id = resource_id.split("/").nth(2).unwrap();
        
        let mut stream = match delta_links.get(drive_id) {
            Some(delta_link) => {
                let mut graph2 = graph.clone();
                graph2
                    .custom_endpoint(&delta_link)
                    .custom(Method::GET, None)
                    .paging()
                    .stream::<DeltaResponse<DriveItem>>()? 
            },
            None => {
                graph
                    .drive(drive_id)      
                    .item("root")                  
                    .get_drive_item_delta()
                    .paging()
                    .stream::<DeltaResponse<DriveItem>>()?                
            }
        };

        while let Some(result) = stream.next().await {
            let result = match result {
                Ok(result) => result,
                Err(e) => {
                    log::error!("Error getting delta for drive {}: {}", drive_id, e);
                    continue;
                }                        
            };
            
            let item = match result.into_body() {
                Ok(i) => i,
                Err(e) => {
                    log::error!("Error getting delta for drive {}: {}", drive_id, e);
                    continue;
                },
            };

            for di in item.value {
                self.process_drive_item(&di).await?;
            }

            if let Some(delta_link) = item.delta_link {
                delta_links.insert(drive_id.to_string(), delta_link);
            }
        }

        Ok(())
    }


    async fn process_drive_item(&self, item: &DriveItem) -> Result<(), GraphFailure> {

        if let Some(file) = &item.file {
            match file.mime_type {
                Some(MimeType::SpreadSheet) => {
                    let document = build_spreadsheet_doc(self.token_manager.clone(), item).await?;

                    let changes = self.document_cache.merge(&item.id, document).await;
                    self.emit_changes(changes).await?;
                },
                Some(_) => log::info!("Unsupported mime type for drive item {}", item.id),
                None => log::info!("No mime type for drive item {}", item.id),
            }
        }
        

        Ok(())
    }

    async fn emit_changes(&self, changes: Vec<ElementDiff>) -> Result<(), GraphFailure> {
        let ts_ms = chrono::Utc::now().timestamp_millis() as u64;
        let mut change_events = Vec::new();

        for c in changes {
            change_events.extend(build_change_events(c, ts_ms));
        }

        if let Err(err) = self.publisher.publish(change_events).await {
            log::error!("Error publishing change events: {}", err);
            return Err(GraphFailure::invalid("Error publishing change events"));
        }

        Ok(())
    } 
}

async fn build_spreadsheet_doc(token_manager: Arc<TokenManager>, drive_item: &DriveItem) -> Result<Document, GraphFailure> {
    let drive_id = match drive_item.parent_reference.as_ref() {
        Some(parent) => &parent.drive_id,
        None => {
            log::error!("No drive id for drive item {}", drive_item.id);
            return Err(GraphFailure::invalid("No drive id"));
        }
    };
    let item_id = drive_item.id.clone();
    
    
    let token = token_manager.get_token().await?;
    let graph = Graph::new(token.bearer_token());
    let mut elements = BTreeMap::new();

    let tables = graph
        .custom(Method::GET, None)
        .extend_path(&[format!("/drives/{drive_id}/items/{item_id}/workbook/tables")])
        .send()
        .await?;
        
    let tables = tables.json::<GraphResponse<TableItem>>().await?;

    for table in &tables.value {
        let element = DocumentElement {
            id: table.id.clone(),
            content: json!({
                "name": table.name
            }),
            label: "Table".to_string(),
            parent: Some(item_id.clone()),
        };

        elements.insert(table.id.clone(), element);

        let headers = graph
            .custom(Method::GET, None)
            .extend_path(&[format!("/drives/{drive_id}/items/{item_id}/workbook/tables/{}/headerRowRange", table.id)])
            .send()
            .await?;

        let headers = headers.json::<HeaderRow>().await?;
        
        let headers = match headers.text.first() {
            Some(h) => h,
            None => {
                log::info!("No header row for table {}", table.id);
                continue;
            }
        };

        let rows = graph
            .custom(Method::GET, None)
            .extend_path(&[format!("/drives/{drive_id}/items/{item_id}/workbook/tables/{}/rows", table.id)])
            .send()
            .await?;

        let rows = rows.json::<GraphResponse<TableRow>>().await?;
        
        for row in &rows.value {
            let row_id = row.id.clone();
            let row = match row.values.first() {
                Some(r) => r,
                None => {
                    log::info!("No row values for table {}", table.id);
                    continue;
                }
            };

            let content = headers.iter().zip(row.iter()).map(|(h, r)| {
                (h.clone(), r.clone())
            }).collect::<Map<String, Value>>();

            let element = DocumentElement {
                id: row_id.clone(),
                content: Value::Object(content),
                label: "Row".to_string(),
                parent: Some(table.id.clone()),                
            };

            elements.insert(row_id, element);
        }

    }
    
    let document = Document::new(item_id, drive_item.name.as_ref().unwrap().clone(), drive_item.etag.as_ref().unwrap().clone(), elements);

    Ok(document)
}


fn build_change_events(diff: ElementDiff, ts_ms: u64) -> Vec<ChangeMessage<ChangeElement>> {
    let mut result = Vec::with_capacity(2);

    let op = match &diff {
        ElementDiff::Added(_) => "i",
        ElementDiff::Removed(_) => "d",
        ElementDiff::Changed(_) => "u",
    };
    
    let element = match diff {
        ElementDiff::Added(element) => element,
        ElementDiff::Removed(element) => element,
        ElementDiff::Changed(element) => element,
    };

    let node_element = ChangeElement {
        id: element.id.clone(),
        labels: vec![element.label],
        properties: element.content.as_object().unwrap_or(&Map::new()).clone(),
        start_id: None,
        end_id: None,
    };

    result.push(ChangeMessage::<ChangeElement> {
        op: op.to_string(),
        payload: ChangePayload::<ChangeElement> {
            after: match op {
                "i" => Some(node_element.clone()),
                "u" => Some(node_element.clone()),
                _ => None,
                
            },
            before: match op {
                "d" => Some(node_element),
                _ => None,
            },
            source: ChangeSource {
                db: "m365".to_string(),
                table: "node".to_string(),
                ts_ms,
                ts_sec: ts_ms / 1000,
                lsn: 0,
            },
        },
        ts_ms,
    });

    if let Some(parent) = element.parent {
        let rel_element = ChangeElement {
            id: format!("{}-{}", parent, element.id),
            labels: vec!["CONTAINS".to_string()],
            properties: Map::new(),
            start_id: Some(parent),
            end_id: Some(element.id.clone()),
        };

        result.push(ChangeMessage::<ChangeElement> {
            op: op.to_string(),
            payload: ChangePayload::<ChangeElement> {
                after: match op {
                    "i" => Some(rel_element.clone()),
                    "u" => Some(rel_element.clone()),
                    _ => None,
                    
                },
                before: match op {
                    "d" => Some(rel_element),
                    _ => None,
                },
                source: ChangeSource {
                    db: "m365".to_string(),
                    table: "rel".to_string(),
                    ts_ms,
                    ts_sec: ts_ms / 1000,
                    lsn: 0,
                },
            },
            ts_ms,
        });
    }

    result
}

