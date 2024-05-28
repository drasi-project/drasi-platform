use graph_rs_sdk::{oauth::{AccessToken, OAuth}, GraphFailure};
use tokio::sync::RwLock;


pub struct TokenManager {
    client_id: String,
    client_secret: String,
    tenant_id: String,
    scopes: String,
    token: RwLock<Option<AccessToken>>,
}


impl TokenManager {
    pub fn new(client_id: &str, client_secret: &str, tenant_id: &str) -> Self {
        Self {
            client_id: client_id.to_string(),
            client_secret: client_secret.to_string(),
            tenant_id: tenant_id.to_string(),
            scopes: ".default".to_string(),
            token: RwLock::new(None),
        }
    }

    pub fn from_env() -> Self {
        let client_id = std::env::var("clientId").expect("clientId not set");
        let client_secret = std::env::var("clientSecret").expect("clientSecret not set");
        let tenant_id = std::env::var("tenantId").expect("tenantId not set");

        Self::new(&client_id, &client_secret, &tenant_id)
    }

    pub async fn get_token(&self) -> Result<AccessToken, GraphFailure> {
        let read_token = self.token.read().await;
        let token = match read_token.as_ref() {
            Some(token) => {
                if token.is_expired() {
                    log::info!("Token expired, getting new token");
                    drop(read_token);
                    let mut write_token = self.token.write().await;
                    let new_token = self.get_new_token().await?;
                    write_token.replace(new_token.clone());
                    new_token
                } else {
                    token.clone()
                }                
            },
            None => {
                log::info!("No token, getting new token");
                drop(read_token);
                let mut write_token = self.token.write().await;

                let new_token = self.get_new_token().await?;
                write_token.replace(new_token.clone());
                new_token                
            },
        };

        Ok(token)
    }

    async fn get_new_token(&self) -> Result<AccessToken, GraphFailure> {
        let mut oauth = OAuth::new();
        oauth
            .client_id(&self.client_id)
            .client_secret(&self.client_secret)
            .tenant_id(&self.tenant_id)        
            .add_scope(&self.scopes)        
            .response_type("token");

        let ao = oauth.build_async();
        let auth_res = ao.client_credentials().access_token().send().await?;

        if auth_res.status().is_success() {
            log::info!("Got new token");
            let mut token = auth_res.json::<AccessToken>().await?;
            token.gen_timestamp();
            Ok(token)
        } else {
            log::error!("Error getting token: {}", auth_res.status());
            Err(GraphFailure::Default { message: auth_res.status().to_string(), headers: None, url: None })
        }
        
    }    
}
