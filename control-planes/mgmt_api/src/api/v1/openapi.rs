// Copyright 2025 The Drasi Authors.
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

use super::models::*;
use utoipa::OpenApi;

#[derive(OpenApi)]
#[openapi(
    paths(
        // Sources
        super::sources::upsert,
        super::sources::get,
        super::sources::delete,
        super::sources::list,
        super::sources::ready_wait,

        // Query Containers
        super::query_containers::upsert,
        super::query_containers::get,
        super::query_containers::delete,
        super::query_containers::list,
        super::query_containers::ready_wait,

        // Reactions
        super::reactions::upsert,
        super::reactions::get,
        super::reactions::delete,
        super::reactions::list,
        super::reactions::ready_wait,

        // Continuous Queries
        super::continuous_queries::create,
        super::continuous_queries::get,
        super::continuous_queries::delete,
        super::continuous_queries::list,
        super::continuous_queries::ready_wait,
        super::continuous_queries::watch,

        // Source Providers
        super::source_providers::upsert,
        super::source_providers::get,
        super::source_providers::delete,
        super::source_providers::list,

        // Reaction Providers
        super::reaction_providers::upsert,
        super::reaction_providers::get,
        super::reaction_providers::delete,
        super::reaction_providers::list,

        // Debug WebSocket endpoint
        super::debug::debug,
    ),
    components(
        schemas(
            // Concrete Resource DTOs
            SourceDto,
            ReactionDto,
            ContinuousQueryDto,
            QueryContainerDto,
            SourceProviderDto,
            ReactionProviderDto,

            // Source DTOs
            SourceSpecDto,
            SourceStatusDto,

            // Query Container DTOs
            QueryContainerSpecDto,
            QueryContainerStatusDto,
            StorageSpecDto,

            // Reaction DTOs
            ReactionSpecDto,
            ReactionStatusDto,

            // Query DTOs
            QuerySpecDto,
            QueryStatusDto,
            QueryLanguageDto,
            QuerySourceLabelDto,
            QuerySubscriptionDto,
            QueryJoinKeyDto,
            QueryJoinDto,
            QuerySourcesDto,
            SourceMiddlewareConfigDto,
            ViewSpecDto,
            RetentionPolicyDto,

            // Provider DTOs
            ProviderSpecDto,
            ProviderServiceDto,
            ServiceEndpointDto,
            ServiceConfigDto,
            ServiceIdentityDto,
            EndpointDto,
            EndpointSettingDto,
            JsonSchemaDto,
            SchemaTypeDto,

            // Result DTOs
            ResultEventDto,
            ResultChangeEventDto,
            ResultControlEventDto,
            ControlSignalDto,
            UpdatePayloadDto,

            // Common DTOs
            ConfigValueDto,
            InlineValueDto,
            ReadyWaitParams,
            ControlMessage,
            ErrorMessage,
        )
    ),
    tags(
        (name = "Sources", description = "Source resource management"),
        (name = "Query Containers", description = "Query Container resource management"),
        (name = "Reactions", description = "Reaction resource management"),
        (name = "Continuous Queries", description = "Continuous Query resource management"),
        (name = "Source Providers", description = "Source Provider registration and management"),
        (name = "Reaction Providers", description = "Reaction Provider registration and management"),
    ),
    info(
        title = "Drasi Management API",
        version = "1.0.0",
        description = "API for managing Drasi platform resources",
        contact(
            name = "The Drasi Authors",
            url = "https://github.com/drasi-project/drasi-platform"
        ),
        license(
            name = "Apache 2.0",
            url = "https://www.apache.org/licenses/LICENSE-2.0"
        )
    ),
    servers(
        (url = "/", description = "Local server")
    )
)]
pub struct ApiDoc;
