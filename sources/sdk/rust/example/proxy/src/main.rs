use drasi_source_sdk::{stream, BootstrapError, BootstrapRequest, BootstrapStream, SourceElement, SourceProxyBuilder};
use serde_json::{Number, Value};


#[tokio::main]
async fn main() {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
    
    let proxy = SourceProxyBuilder::new()
        .with_stream_producer(my_stream)
        .without_context()
        .build();

        proxy.start().await;    
}

async fn my_stream(_context: (), req: BootstrapRequest) -> Result<BootstrapStream, BootstrapError> {
    let stream = stream! {
        if req.node_labels.contains(&"Location".to_string()) {
            yield Ok(SourceElement::Node { 
                id: "Location-A".to_string(), 
                labels: vec!["Location".to_string()], 
                properties: vec![
                    ("longitude".to_string(), Value::Number(Number::from_f64(50.1).unwrap())),
                    ("latitude".to_string(), Value::Number(Number::from_f64(60.7).unwrap())),
                ].into_iter().collect(),
            });

            yield Ok(SourceElement::Node { 
                id: "Location-B".to_string(), 
                labels: vec!["Location".to_string()], 
                properties: vec![
                    ("longitude".to_string(), Value::Number(Number::from_f64(58.9).unwrap())),
                    ("latitude".to_string(), Value::Number(Number::from_f64(72.1).unwrap())),
                ].into_iter().collect(),
            });    
        }
    };

    Ok(Box::pin(stream))

}