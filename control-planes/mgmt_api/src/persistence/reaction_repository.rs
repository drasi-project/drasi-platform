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

use mongodb::{bson::Document, Database};

use crate::domain::models::ReactionSpec;

use super::{ResourceSpecRepository, ResourceSpecRepositoryImpl};

pub type ReactionRepository = dyn ResourceSpecRepository<ReactionSpec> + Send + Sync;

pub type ReactionRepositoryImpl = ResourceSpecRepositoryImpl<ReactionSpec>;

impl ReactionRepositoryImpl {
    pub fn new(db: Database) -> Self {
        ReactionRepositoryImpl {
            collection: db.collection::<Document>("reactions"),
            _t: std::marker::PhantomData,
        }
    }
}
