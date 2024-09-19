use crate::domain::models::{
    Endpoint, EndpointSetting, ReactionProviderSpec, ResourceProvider, Service, SourceProviderSpec,
};

use super::{
    EndpointDto, EndpointSettingDto, ReactionProviderSpecDto, ResourceProviderDto, ServiceDto,
    SourceProviderSpecDto,
};
impl<TSpec, TSpecDto> From<ResourceProviderDto<TSpecDto>> for ResourceProvider<TSpec>
where
    TSpecDto: Into<TSpec>,
{
    fn from(val: ResourceProviderDto<TSpecDto>) -> Self {
        ResourceProvider {
            id: val.id,
            spec: val.spec.into(),
        }
    }
}

impl<TSpec, TSpecDto> From<ResourceProvider<TSpec>> for ResourceProviderDto<TSpecDto>
where
    TSpec: Into<TSpecDto>,
{
    fn from(val: ResourceProvider<TSpec>) -> Self {
        ResourceProviderDto {
            id: val.id,
            spec: val.spec.into(),
        }
    }
}

impl From<ServiceDto> for Service {
    fn from(service: ServiceDto) -> Self {
        Service {
            replica: service.replica,
            image: service.image,
            endpoints: service.endpoints.map(|endpoints| endpoints.into_iter().map(|(k, v)| (k, v.into())).collect()),
            dapr: service.dapr.map(|dapr| dapr.into_iter().map(|(k, v)| (k, v.into())).collect()),
            properties: service.properties.map(|properties| properties.into_iter().map(|(k, v)| (k, v.unwrap().into())).collect()),
        }
    }
}


impl From<EndpointDto> for Endpoint {
    fn from(endpoint: EndpointDto) -> Self {
        Endpoint {
            setting: endpoint.setting.into(),
            target: endpoint.target,
        }
    }
}

impl From<Endpoint> for EndpointDto {
    fn from(endpoint: Endpoint) -> Self {
        EndpointDto {
            setting: endpoint.setting.into(),
            target: endpoint.target,
        }
    }
}

impl From<EndpointSetting> for EndpointSettingDto {
    fn from(setting: EndpointSetting) -> Self {
        match setting {
            EndpointSetting::Internal => EndpointSettingDto::Internal,
            EndpointSetting::External => EndpointSettingDto::External,
        }
    }
}

impl From<EndpointSettingDto> for EndpointSetting {
    fn from(setting: EndpointSettingDto) -> Self {
        match setting {
            EndpointSettingDto::Internal => EndpointSetting::Internal,
            EndpointSettingDto::External => EndpointSetting::External,
        }
    }
}

impl From<Service> for ServiceDto {
    fn from(service: Service) -> Self {
        ServiceDto {
            replica: service.replica,
            image: service.image,
            endpoints: service.endpoints.map(|endpoints| endpoints.into_iter().map(|(k, v)| (k, v.into())).collect()),
            dapr: service.dapr.map(|dapr| dapr.into_iter().map(|(k, v)| (k, v.into())).collect()),
            properties: service.properties.map(|properties| properties
                .into_iter()
                .map(|(k, v)| (k, Some(v.into())))
                .collect()),
        }
    }
}

impl From<SourceProviderSpecDto> for SourceProviderSpec {
    fn from(spec: SourceProviderSpecDto) -> Self {
        SourceProviderSpec {
            services: spec
                .services
                .into_iter()
                .collect(),
            config_schema: spec.config_schema,
        }
    }
}

impl From<SourceProviderSpec> for SourceProviderSpecDto {
    fn from(spec: SourceProviderSpec) -> Self {
        SourceProviderSpecDto {
            services: spec
                .services
                .into_iter()
                .collect(),
            config_schema: spec.config_schema,
        }
    }
}

impl From<ReactionProviderSpecDto> for ReactionProviderSpec {
    fn from(spec: ReactionProviderSpecDto) -> Self {
        ReactionProviderSpec {
            services: spec
                .services
                .into_iter()
                .collect(),
            config_schema: spec.config_schema,
        }
    }
}

impl From<ReactionProviderSpec> for ReactionProviderSpecDto {
    fn from(spec: ReactionProviderSpec) -> Self {
        ReactionProviderSpecDto {
            services: spec
                .services
                .into_iter()
                .collect(),
            config_schema: spec.config_schema,
        }
    }
}
