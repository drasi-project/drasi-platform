use async_stream::stream;
use drasi_source_sdk::{models::{BootstrapRequest, SourceElement}, BootstrapStream, SourceProxyBuilder};
use serde_json::Value;



#[tokio::main]
async fn main() {
    let mut proxy = SourceProxyBuilder::new()
        .with_stream_producer(&my_stream)
        .build();

        proxy.start().await;    
}


fn my_stream(req: BootstrapRequest) -> BootstrapStream {

    

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

    Box::pin(stream)

}