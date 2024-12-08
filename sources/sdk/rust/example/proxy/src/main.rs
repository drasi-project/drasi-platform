use std::{future::Future, pin::Pin};

use async_stream::stream;
use drasi_source_sdk::{models::{BootstrapRequest, SourceElement}, BootstrapError, BootstrapStream, SourceProxyBuilder};
use serde_json::Value;



#[tokio::main]
async fn main() {

    //let z = &my_stream;
    let proxy = SourceProxyBuilder::new()
        .with_stream_producer(my_stream)
        .build();

        proxy.start().await;    
}


async fn my_stream(req: BootstrapRequest) -> Result<BootstrapStream, BootstrapError> {

    tokio::time::sleep(tokio::time::Duration::from_secs(2)).await;

    let stream = stream! {
        for i in 0..10 {
            let node = SourceElement::Node { 
                id: "1".to_string(), 
                labels: vec!["Person".to_string()], 
                properties: vec![
                    ("field1".to_string(), Value::String("foo".to_string())),
                    ("field2".to_string(), Value::String("bar".to_string())),
                ].into_iter().collect(),
            };

            yield node;
        }
    };

    Ok(Box::pin(stream))

}