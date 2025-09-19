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

use super::models::QuerySpecDto;

/// This is a placeholder for the WebSocket endpoint documentation.
/// The actual WebSocket handler is implemented in mod.rs
///
/// **IMPORTANT**: This endpoint uses WebSocket protocol, which is not fully supported by OpenAPI 3.0 generators.
/// Generated clients will only handle the HTTP upgrade handshake but will NOT provide WebSocket communication methods.
/// Clients must implement WebSocket handling manually.
///
/// **Protocol**:
/// 1. Client connects via WebSocket to `/v1/debug`
/// 2. Client sends a QuerySpecDto as a JSON text message
/// 3. Server streams back ResultEventDto objects as JSON text messages
/// 4. Connection remains open until client disconnects or query is terminated
///
/// **Note for Client Implementers**: You will need to use a WebSocket library directly for this endpoint.
/// The generated client code will not be sufficient for full functionality.
#[utoipa::path(
    get,
    path = "/v1/debug",
    tag = "Continuous Queries",
    operation_id = "debug_query_websocket",
    responses(
        (status = 101, description = "Switching protocols to WebSocket. After connection upgrade, client sends a QuerySpecDto JSON message to start debugging. Server streams back ResultEventDto objects as JSON text messages. NOTE: OpenAPI generators will not provide WebSocket handling - manual implementation required."),
    ),
    request_body(
        content = inline(QuerySpecDto),
        description = "Query specification sent as WebSocket text message after connection is established (not as HTTP body)",
        content_type = "application/json"
    )
)]
#[allow(dead_code)]
async fn debug_websocket_placeholder() {
    // This function exists solely for OpenAPI documentation
    // The actual WebSocket handler is implemented elsewhere
    unimplemented!("This is a documentation placeholder");
}
