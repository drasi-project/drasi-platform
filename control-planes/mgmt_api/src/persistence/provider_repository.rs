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

use super::{ResourceSpecRepository, ResourceSpecRepositoryImpl};
use crate::domain::models::ProviderSpec;
use mongodb::{bson::Document, Database};

pub type ProviderRepository = dyn ResourceSpecRepository<ProviderSpec> + Send + Sync;
pub type ProviderRepositoryImpl = ResourceSpecRepositoryImpl<ProviderSpec>;

impl ProviderRepositoryImpl {
    pub fn new(db: Database, collection_name: &str) -> Self {
        ProviderRepositoryImpl {
            collection: db.collection::<Document>(collection_name),
            _t: std::marker::PhantomData,
        }
    }
}
