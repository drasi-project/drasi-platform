mod query_container_repository;
mod query_repository;
mod reaction_provider_repository;
mod reaction_repository;
mod source_provider_repository;
mod source_repository;

use async_trait::async_trait;
use futures_util::TryStreamExt;
use mongodb::{
    bson::{self, doc, Document},
    options::ReplaceOptions,
    Collection,
};
use serde::{de::DeserializeOwned, Serialize};
use serde_json::Value;
//use futures::stream::TryStreamExt;

use crate::domain::models::DomainError;

pub use query_container_repository::{QueryContainerRepository, QueryContainerRepositoryImpl};
pub use query_repository::{QueryRepository, QueryRepositoryImpl};
pub use reaction_provider_repository::{
    ReactionProviderRepository, ReactionProviderRepositoryImpl,
};
pub use reaction_repository::{ReactionRepository, ReactionRepositoryImpl};
pub use source_provider_repository::{SourceProviderRepository, SourceProviderRepositoryImpl};
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
    async fn set_definition_schema(&self, id: &str, schema: &Value) -> Result<(), DomainError>;
    async fn get_definition_schema(&self, id: &str) -> Result<Option<Value>, DomainError>;
    async fn delete_definition_schema(&self, id: &str) -> Result<(), DomainError>;
}

pub struct ResourceSpecRepositoryImpl<T>
where
    T: Serialize + DeserializeOwned + Send + Sync,
{
    collection: Collection<Document>,
    schema_collection: Option<Collection<Document>>,
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

    async fn get_definition_schema(&self, id: &str) -> Result<Option<Value>, DomainError> {
        match self.schema_collection {
            Some(ref schema_collection) => {
                match schema_collection.find_one(doc! { "_id": id }, None).await {
                    Ok(Some(doc)) => {
                        let schema: Value = bson::from_document(doc).unwrap();
                        Ok(Some(schema))
                    }
                    Ok(None) => Ok(None),
                    Err(e) => Err(DomainError::Internal { inner: Box::new(e) }),
                }
            }
            None => Ok(None),
        }
    }

    async fn delete_definition_schema(&self, id: &str) -> Result<(), DomainError> {
        match self.schema_collection {
            Some(ref schema_collection) => {
                match schema_collection.delete_one(doc! { "_id": id }, None).await {
                    Ok(_) => Ok(()),
                    Err(e) => Err(DomainError::Internal { inner: Box::new(e) }),
                }
            }
            None => Ok(()),
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

    async fn set_definition_schema(&self, id: &str, schema: &Value) -> Result<(), DomainError> {
        let mut doc = bson::to_document(schema).unwrap();
        doc.insert("_id", id);
        let options = ReplaceOptions::builder().upsert(true).build();
        match self.schema_collection {
            Some(ref schema_collection) => {
                match schema_collection
                    .replace_one(doc! { "_id": id }, doc, options)
                    .await
                {
                    Ok(_) => Ok(()),
                    Err(e) => Err(DomainError::Internal { inner: Box::new(e) }),
                }
            }
            None => Ok(()),
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
