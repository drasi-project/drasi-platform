use std::sync::Arc;

use async_stream::stream;
use drasi_source_sdk::{models::{ChangeOp, SourceChange, SourceElement}, ChangeStream, DebugPublisher, ReactivatorBuilder, StateStore};
use serde_json::Value;



#[tokio::main]
async fn main() {
    let mut reactivator = ReactivatorBuilder::new()
        .with_publisher(DebugPublisher {})
        .with_stream_producer(&my_stream)
        .build();

    reactivator.start().await;
}


fn my_stream(state_store: &dyn StateStore) -> ChangeStream {
    //_ = state_store.get("a");
    let result = stream! {


        //state_store.put
        for i in 0..10 {
            let node = SourceElement::Node {
                id: i.to_string(),
                labels: vec!["Person".to_string()],
                properties: vec![
                    ("field1".to_string(), Value::String("foo".to_string())),
                    ("field2".to_string(), Value::String("bar".to_string())),
                    ("field3".to_string(), Value::Number(4.into())),
                ].into_iter().collect(),
            };
            let change = SourceChange::new(ChangeOp::Create, node, 1234567890, 1, None);

            yield change;
            tokio::time::sleep(std::time::Duration::from_secs(1)).await;
        }
        
    };

    Box::pin(result)
}