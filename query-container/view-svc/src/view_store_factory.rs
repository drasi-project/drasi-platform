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
