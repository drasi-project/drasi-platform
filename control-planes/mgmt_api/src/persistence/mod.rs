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

mod provider_repository;
mod query_container_repository;
mod query_repository;
mod reaction_repository;
mod source_repository;

use async_trait::async_trait;
use futures_util::TryStreamExt;
use mongodb::{
    bson::{self, doc, Document},
    options::ReplaceOptions,
    Collection,
};
use serde::{de::DeserializeOwned, Serialize};
//use futures::stream::TryStreamExt;

use crate::domain::models::DomainError;

pub use provider_repository::{ProviderRepository, ProviderRepositoryImpl};
pub use query_container_repository::{QueryContainerRepository, QueryContainerRepositoryImpl};
pub use query_repository::{QueryRepository, QueryRepositoryImpl};
pub use reaction_repository::{ReactionRepository, ReactionRepositoryImpl};
pub use source_repository::{SourceRepository, SourceRepositoryImpl};

#[async_trait]
pub trait ResourceSpecRepository<T>
where
    T: Serialize + DeserializeOwned + Send + Sync,
{
    async fn get(&self, id: &str) -> Result<T, DomainError>;
    async fn set(&self, id: &str, spec: &T) -> Result<(), DomainError>;
    async fn delete(&self, id: &str) -> Result<(), DomainError>;
    async fn list(&self) -> Vec<(String, T)>; //Box<dyn Stream<Item = (String, T)>>;
}

pub struct ResourceSpecRepositoryImpl<T>
where
    T: Serialize + DeserializeOwned + Send + Sync,
{
    collection: Collection<Document>,
    _t: std::marker::PhantomData<T>,
}

#[async_trait]
impl<T> ResourceSpecRepository<T> for ResourceSpecRepositoryImpl<T>
where
    T: Serialize + DeserializeOwned + Send + Sync,
{
    async fn get(&self, id: &str) -> Result<T, DomainError> {
        match self.collection.find_one(doc! { "_id": id }, None).await {
            Ok(Some(doc)) => {
                //let id = doc.get_str("_id").unwrap().to_string();
                let spec: T = bson::from_document(doc).unwrap();
                Ok(spec)
            }
            Ok(None) => Err(DomainError::NotFound),
            Err(e) => Err(DomainError::Internal { inner: Box::new(e) }),
        }
    }

    async fn set(&self, id: &str, spec: &T) -> Result<(), DomainError> {
        let mut doc = bson::to_document(spec).unwrap();
        doc.insert("_id", id);

        let options = ReplaceOptions::builder().upsert(true).build();
        match self
            .collection
            .replace_one(doc! { "_id": id }, doc, options)
            .await
        {
            Ok(_) => Ok(()),
            Err(e) => Err(DomainError::Internal { inner: Box::new(e) }),
        }
    }

    async fn delete(&self, id: &str) -> Result<(), DomainError> {
        match self.collection.delete_one(doc! { "_id": id }, None).await {
            Ok(_) => Ok(()),
            Err(e) => Err(DomainError::Internal { inner: Box::new(e) }),
        }
    }

    async fn list(&self) -> Vec<(String, T)> {
        let mut cursor = self.collection.find(None, None).await.unwrap();
        let mut result = Vec::new();
        while let Some(doc) = cursor.try_next().await.unwrap() {
            let id = doc.get_str("_id").unwrap().to_string();
            let item: T = bson::from_document(doc).unwrap();

            result.push((id, item));
        }

        result
        // let strm = stream::unfold(cursor, |mut cursor| async move {
        //   match cursor.try_next().await {
        //     Ok(Some(doc)) => {
        //       let id = doc.get("_id").unwrap().to_string();
        //       let item: T = bson::from_document(doc).unwrap();

        //       Some(((id, item), cursor))
        //     },
        //     Ok(None) => None,
        //     Err(e) => panic!("Error finding document: {}", e),
        //   }
        // });
        // Box::new(strm)
    }
}
