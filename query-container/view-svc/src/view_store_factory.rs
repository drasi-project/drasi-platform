use std::{env, sync::Arc};

use crate::{models::ViewError, mongo_view_store::MongoViewStore, view_store::ViewStore};

pub async fn from_env() -> Result<Arc<dyn ViewStore>, ViewError> {
    let store_type = env::var("VIEW_STORE_TYPE").unwrap_or("mongo".to_string());
    match store_type.as_str() {
        "redis" => {
            todo!()
        }
        "mongo" => {
            let mongo_uri =
                env::var("MONGO_URI").unwrap_or("mongodb://drasi-mongo:27017".to_string());
            let db_name = env::var("MONGO_DB").unwrap_or("drasi-results".to_string());

            let store = match MongoViewStore::connect(&mongo_uri, &db_name).await {
                Ok(s) => s,
                Err(e) => return Err(ViewError::StoreError(Box::new(e))),
            };

            Ok(store)
        }
        _ => Err(ViewError::Other(format!(
            "Unknown view store type {}",
            store_type
        ))),
    }
}
