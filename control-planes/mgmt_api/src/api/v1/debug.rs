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

use std::time::Duration;

use actix_web::{
    get,
    web::{self},
    HttpRequest, Responder,
};
use actix_ws::{CloseCode, CloseReason, Message};
use futures_util::StreamExt;
use tokio::{pin, select, sync::oneshot};

use super::models::{ControlMessage, QuerySpecDto};
use crate::domain::debug_service::DebugService;

/// WebSocket endpoint for interactive query debugging.
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
#[get("")]
pub async fn debug(
    svc: web::Data<DebugService>,
    req: HttpRequest,
    body: web::Payload,
) -> actix_web::Result<impl Responder> {
    let (cancel_tx, cancel_rx) = oneshot::channel::<()>();
    let (response, mut session, msg_stream) = actix_ws::handle(&req, body)?;

    actix_web::rt::spawn(async move {
        let mut msg_stream = msg_stream.fuse();

        let query = {
            let mut query = None;
            while let Some(msg) = msg_stream.next().await {
                match msg {
                    Ok(actix_ws::Message::Text(text)) => {
                        query = match serde_json::from_str::<QuerySpecDto>(&text) {
                            Ok(q) => Some(q),
                            Err(e) => {
                                log::error!("Error parsing query spec: {}", e);
                                _ = session
                                    .text(ControlMessage::error(e.to_string()).to_json())
                                    .await
                                    .ok();
                                _ = session
                                    .close(Some(CloseReason {
                                        code: CloseCode::Invalid,
                                        description: None,
                                    }))
                                    .await
                                    .ok();
                                return;
                            }
                        };
                        break;
                    }
                    Ok(actix_ws::Message::Ping(bytes)) => {
                        if session.pong(&bytes).await.is_err() {
                            log::info!("Ping failed, closing session");
                            break;
                        }
                    }
                    Ok(actix_ws::Message::Pong(_)) => {}
                    Ok(actix_ws::Message::Close(cr)) => {
                        log::info!("Received close message: {:?}", cr);
                        return;
                    }
                    Err(e) => {
                        log::error!("Error receiving message: {}", e);
                        return;
                    }
                    _ => {}
                }
            }
            query
        };

        let query = match query {
            Some(q) => q,
            None => {
                log::error!("No query spec provided");
                _ = session
                    .close(Some(CloseReason {
                        code: CloseCode::Invalid,
                        description: Some("No query provided".to_string()),
                    }))
                    .await
                    .ok();
                return;
            }
        };

        let data_stream = match svc.debug(query.into(), cancel_rx).await {
            Ok(res) => res,
            Err(e) => {
                log::error!("Error debugging query: {}", e);
                _ = session
                    .text(ControlMessage::error(e.to_string()).to_json())
                    .await
                    .ok();
                _ = session
                    .close(Some(CloseReason {
                        code: CloseCode::Error,
                        description: None,
                    }))
                    .await
                    .ok();
                return;
            }
        };

        let data_stream = data_stream.fuse();
        pin!(data_stream);

        loop {
            select! {
              _ = tokio::time::sleep(Duration::from_secs(10)) => {
                log::info!("Sending ping");
                if session.ping(b"").await.is_err() {
                    log::info!("Ping failed, closing session");
                    break;
                }
              },
              msg = msg_stream.next() => {
                match msg {
                    Some(Ok(msg)) => {
                        match msg {
                            Message::Ping(bytes) => {
                                if session.pong(&bytes).await.is_err() {
                                    log::info!("Ping failed, closing session");
                                    break;
                                }
                            },
                            Message::Pong(_) => {},
                            Message::Close(cr) => {
                                log::info!("Received close message: {:?}", cr);
                                break;
                            },
                            _ => {
                                log::info!("Received unexpected message: {:?}", msg);
                                break;
                            },
                        }
                    }
                    Some(Err(e)) => {
                        log::error!("Error receiving message: {}", e);
                        break;
                    }
                    None => break,
                }
              },
              evt = data_stream.next() => {
                match evt {
                    Some(evt) => match evt {
                        Ok(evt) => {
                          let json = match serde_json::to_string(&evt) {
                              Ok(j) => j,
                              Err(e) => {
                                  log::error!("Error serializing message: {}", e);
                                  break;
                              }
                          };
                          match session.text(json).await {
                              Ok(_) => log::debug!("Sent debug message"),
                              Err(e) => {
                                  log::error!("Error sending debug message: {}", e);
                                  break;
                              }
                          }
                      },
                        Err(e) => {
                          _ = session
                            .text(ControlMessage::error(e.to_string()).to_json())
                            .await
                            .ok();
                        }
                    }

                    None => break,
                }
              }

            }
        }
        log::info!("debug stream ended");

        _ = cancel_tx.send(());
        log::info!("Cancellation signal sent");

        while (data_stream.next().await).is_some() {
            log::info!("Draining message stream");
        }

        log::info!("Closing session");

        _ = session.close(None).await.ok();

        log::info!("Session closed");
    });

    Ok(response)
}

pub fn configure_routes() -> actix_web::Scope {
    web::scope("/v1/debug").service(debug)
}
