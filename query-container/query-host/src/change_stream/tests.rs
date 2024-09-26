#![allow(clippy::print_stdout)]
use std::{env, time::Duration};

use redis::{streams::StreamPendingReply, AsyncCommands};
use serde::Deserialize;
use tokio::task;
use uuid::Uuid;

use crate::change_stream::{redis_change_stream::RedisChangeStream, SequentialChangeStream};

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

    let subject = RedisChangeStream::new(&url, &query_container_id, &query_id, 5, 3)
        .await
        .unwrap();

    let _: redis::Value = connection
        .xadd(&query_container_id, "*", &[("data", "{\"data\": 1}")])
        .await
        .unwrap();
    let _: redis::Value = connection
        .xadd(&query_container_id, "*", &[("data", "{\"data\": 2}")])
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
                &[("data", format!("{{\"data\": {}}}", i))],
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

    let subject = RedisChangeStream::new(&url, &query_container_id, &query_id, 5, 3)
        .await
        .unwrap();

    for i in 1..=10 {
        let _: redis::Value = connection
            .xadd(
                &query_container_id,
                "*",
                &[("data", format!("{{\"data\": {}}}", i))],
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
        println!("msg: {:?}", msg);
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

    let subject = RedisChangeStream::new(&url, &query_container_id, &query_id, 5, 3)
        .await
        .unwrap();

    for i in 1..=10 {
        let _: redis::Value = connection
            .xadd(
                &query_container_id,
                "*",
                &[("data", format!("{{\"data\": {}}}", i))],
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

    let subject = RedisChangeStream::new(&url, &query_container_id, &query_id, 5, 3)
        .await
        .unwrap();

    for i in 6..=10 {
        let msg = subject.recv::<TestMessage>().await.unwrap().unwrap();
        println!("msg: {:?}", msg);
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

    let subject = RedisChangeStream::new(&url, &query_container_id, &query_id, 5, 3)
        .await
        .unwrap();

    task::spawn(async move {
        tokio::time::sleep(Duration::from_millis(1000)).await;
        let _: redis::Value = connection
            .xadd(&query_container_id, "*", &[("data", "{\"data\": 1}")])
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

    let subject = RedisChangeStream::new(&url, &query_container_id, &query_id, 5, 3)
        .await
        .unwrap();

    for i in 1..=5 {
        let _: redis::Value = connection
            .xadd(
                &query_container_id,
                "*",
                &[("data", format!("{{\"data\": {}}}", i))],
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
                &[("data", format!("{{\"data\": {}}}", i))],
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
