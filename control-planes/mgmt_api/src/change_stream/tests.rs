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

#![allow(clippy::unwrap_used)]

use cloudevents::event::{EventBuilder, EventBuilderV10};
use std::{env, time::Duration};

use redis::{streams::StreamPendingReply, AsyncCommands};
use serde::Deserialize;
use serde_json::{json, Value};
use tokio::task;
use uuid::Uuid;

use crate::change_stream::{
    redis_change_stream::{InitialCursor, RedisChangeStream},
    SequentialChangeStream,
};

#[derive(Deserialize, Debug)]
struct TestMessage {
    data: u64,
}

fn get_url() -> String {
    match env::var("REDIS_URL") {
        Ok(url) => url,
        Err(_) => "redis://127.0.0.1:6379".to_string(),
    }
}

#[tokio::test]
async fn serves_messages_sequentially() {
    let url = get_url();
    let query_container_id = format!("test:{}", Uuid::new_v4());
    let query_id = Uuid::new_v4().to_string();
    let mut connection = redis::Client::open(url.as_str())
        .unwrap()
        .get_multiplexed_async_connection()
        .await
        .unwrap();

    let subject = RedisChangeStream::new(
        &url,
        &query_container_id,
        &query_id,
        "consumer",
        5,
        3,
        InitialCursor::Beginning,
    )
    .await
    .unwrap();

    let _: redis::Value = connection
        .xadd(
            &query_container_id,
            "*",
            &build_redis_message(json!({"data": 1})),
        )
        .await
        .unwrap();
    let _: redis::Value = connection
        .xadd(
            &query_container_id,
            "*",
            &build_redis_message(json!({"data": 2})),
        )
        .await
        .unwrap();

    let msg = subject.recv::<TestMessage>().await.unwrap().unwrap();
    assert_eq!(msg.data.data, 1);

    let msg = subject.recv::<TestMessage>().await.unwrap().unwrap();
    assert_eq!(msg.data.data, 1);

    subject.ack(&msg.id).await.unwrap();

    for i in 3..=10 {
        let _: redis::Value = connection
            .xadd(
                &query_container_id,
                "*",
                &build_redis_message(json!({"data": i})),
            )
            .await
            .unwrap();
    }

    for i in 2..=10 {
        let msg = subject.recv::<TestMessage>().await.unwrap().unwrap();
        assert_eq!(msg.data.data, i);
        subject.ack(&msg.id).await.unwrap();
    }
}

#[tokio::test]
async fn buffers_messages() {
    let url = get_url();
    let query_container_id = format!("test:{}", Uuid::new_v4());
    let query_id = Uuid::new_v4().to_string();
    let mut connection = redis::Client::open(url.as_str())
        .unwrap()
        .get_async_connection()
        .await
        .unwrap();

    let subject = RedisChangeStream::new(
        &url,
        &query_container_id,
        &query_id,
        "consumer",
        5,
        3,
        InitialCursor::Beginning,
    )
    .await
    .unwrap();

    for i in 1..=10 {
        let _: redis::Value = connection
            .xadd(
                &query_container_id,
                "*",
                &build_redis_message(json!({"data": i})),
            )
            .await
            .unwrap();
    }

    tokio::time::sleep(Duration::from_millis(1000)).await;

    let pending: StreamPendingReply = connection
        .xpending(&query_container_id, &query_id)
        .await
        .unwrap();
    assert!(pending.count() >= 6 || pending.count() < 9);

    for i in 1..=5 {
        let msg = subject.recv::<TestMessage>().await.unwrap().unwrap();
        log::info!("msg: {:?}", msg);
        assert_eq!(msg.data.data, i);
        subject.ack(&msg.id).await.unwrap();
    }

    tokio::time::sleep(Duration::from_millis(1000)).await;

    let pending: StreamPendingReply = connection
        .xpending(&query_container_id, &query_id)
        .await
        .unwrap();
    assert_eq!(5, pending.count());
}

#[tokio::test]
async fn recovers_unack_messages() {
    let url = get_url();
    let query_container_id = format!("test:{}", Uuid::new_v4());
    let query_id = Uuid::new_v4().to_string();
    let mut connection = redis::Client::open(url.as_str())
        .unwrap()
        .get_async_connection()
        .await
        .unwrap();

    let subject = RedisChangeStream::new(
        &url,
        &query_container_id,
        &query_id,
        "consumer",
        5,
        3,
        InitialCursor::Beginning,
    )
    .await
    .unwrap();

    for i in 1..=10 {
        let _: redis::Value = connection
            .xadd(
                &query_container_id,
                "*",
                &build_redis_message(json!({"data": i})),
            )
            .await
            .unwrap();
    }

    for i in 1..=5 {
        let msg = subject.recv::<TestMessage>().await.unwrap().unwrap();
        assert_eq!(msg.data.data, i);
        subject.ack(&msg.id).await.unwrap();
    }

    tokio::time::sleep(Duration::from_millis(1000)).await;

    drop(subject);

    let subject = RedisChangeStream::new(
        &url,
        &query_container_id,
        &query_id,
        "consumer",
        5,
        3,
        InitialCursor::Beginning,
    )
    .await
    .unwrap();

    for i in 6..=10 {
        let msg = subject.recv::<TestMessage>().await.unwrap().unwrap();
        log::info!("msg: {:?}", msg);
        assert_eq!(msg.data.data, i);
        subject.ack(&msg.id).await.unwrap();
    }
}

#[tokio::test]
async fn waits_for_new_messages() {
    let url = get_url();
    let query_container_id = format!("test:{}", Uuid::new_v4());
    let query_id = Uuid::new_v4().to_string();
    let mut connection = redis::Client::open(url.as_str())
        .unwrap()
        .get_multiplexed_async_connection()
        .await
        .unwrap();

    let subject = RedisChangeStream::new(
        &url,
        &query_container_id,
        &query_id,
        "consumer",
        5,
        3,
        InitialCursor::Beginning,
    )
    .await
    .unwrap();

    task::spawn(async move {
        tokio::time::sleep(Duration::from_millis(1000)).await;
        let _: redis::Value = connection
            .xadd(
                &query_container_id,
                "*",
                &build_redis_message(json!({"data": 1})),
            )
            .await
            .unwrap();
    });

    let msg = subject.recv::<TestMessage>().await.unwrap().unwrap();
    assert_eq!(msg.data.data, 1);
}

#[tokio::test]
async fn stops_buffering_on_drop() {
    let url = get_url();
    let query_container_id = format!("test:{}", Uuid::new_v4());
    let query_id = Uuid::new_v4().to_string();
    let mut connection = redis::Client::open(url.as_str())
        .unwrap()
        .get_async_connection()
        .await
        .unwrap();

    let subject = RedisChangeStream::new(
        &url,
        &query_container_id,
        &query_id,
        "consumer",
        5,
        3,
        InitialCursor::Beginning,
    )
    .await
    .unwrap();

    for i in 1..=5 {
        let _: redis::Value = connection
            .xadd(
                &query_container_id,
                "*",
                &build_redis_message(json!({"data": i})),
            )
            .await
            .unwrap();
    }

    for i in 1..=5 {
        let msg = subject.recv::<TestMessage>().await.unwrap().unwrap();
        assert_eq!(msg.data.data, i);
        subject.ack(&msg.id).await.unwrap();
    }

    drop(subject);

    tokio::time::sleep(Duration::from_millis(1000)).await;

    for i in 6..=10 {
        let _: redis::Value = connection
            .xadd(
                &query_container_id,
                "*",
                &[("data", format!("{{\"data\": {i}}}"))],
            )
            .await
            .unwrap();
    }

    tokio::time::sleep(Duration::from_millis(1000)).await;

    let pending: StreamPendingReply = connection
        .xpending(&query_container_id, &query_id)
        .await
        .unwrap();
    assert_eq!(0, pending.count());
}

fn build_redis_message(msg: Value) -> Vec<(String, String)> {
    let evt = EventBuilderV10::new()
        .id("test")
        .ty("test")
        .source("test")
        .data("application/json", msg)
        .build()
        .unwrap();
    let data_str = serde_json::to_string(&evt).unwrap();
    vec![("data".to_string(), data_str)]
}
