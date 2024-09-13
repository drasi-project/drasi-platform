use async_trait::async_trait;
use std::time::Duration;

use super::models::Resource;

mod extensible;
mod standard;

pub use extensible::ReactionDomainService;
pub use extensible::ReactionDomainServiceImpl;
pub use extensible::SourceDomainService;
pub use extensible::SourceDomainServiceImpl;
pub use standard::QueryContainerDomainService;
pub use standard::QueryContainerDomainServiceImpl;
pub use standard::QueryDomainService;
pub use standard::QueryDomainServiceImpl;

#[async_trait]
pub trait ResourceDomainService<TSpec, TStatus> {
    async fn set(
        &self,
        id: &str,
        source: TSpec,
    ) -> Result<Resource<TSpec, TStatus>, super::models::DomainError>;
    async fn delete(&self, id: &str) -> Result<(), super::models::DomainError>;
    async fn get(&self, id: &str) -> Result<Resource<TSpec, TStatus>, super::models::DomainError>;
    async fn list(&self) -> Result<Vec<Resource<TSpec, TStatus>>, super::models::DomainError>;
    async fn wait_for_ready(
        &self,
        id: &str,
        time_out: Duration,
    ) -> Result<bool, super::models::DomainError>;
}
