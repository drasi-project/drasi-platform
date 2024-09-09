use crate::domain::models::{
    Endpoint, EndpointSetting, ReactionProviderSpec, ResourceProvider, Service, SourceProviderSpec,
};

use super::{
    EndpointDto, EndpointSettingDto, ReactionProviderSpecDto, ResourceProviderDto, ServiceDto,
    SourceProviderSpecDto,
};

impl<Tspec, TspecDto> Into<ResourceProvider<Tspec>> for ResourceProviderDto<TspecDto>
where
    TspecDto: Into<Tspec>,
{
    fn into(self) -> ResourceProvider<Tspec> {
        ResourceProvider {
            id: self.id,
            spec: self.spec.into(),
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

impl Into<Service> for ServiceDto {
    fn into(self) -> Service {
        Service {
            replica: self.replica,
            image: self.image,
            endpoints: match self.endpoints {
                Some(endpoints) => {
                    Some(endpoints.into_iter().map(|(k, v)| (k, v.into())).collect())
                }
                None => None,
            },
            dapr: match self.dapr {
                Some(dapr) => Some(dapr.into_iter().map(|(k, v)| (k, v.into())).collect()),
                None => None,
            },
            properties: match self.properties {
                Some(properties) => Some(
                    properties
                        .into_iter()
                        .map(|(k, v)| (k, v.unwrap_or_default().into()))
                        .collect(),
                ),
                None => None,
            },
        }
    }
}

impl Into<Endpoint> for EndpointDto {
    fn into(self) -> Endpoint {
        Endpoint {
            setting: self.setting.into(),
            target: self.target,
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

impl Into<EndpointSetting> for EndpointSettingDto {
    fn into(self) -> EndpointSetting {
        match self {
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
            endpoints: match service.endpoints {
                Some(endpoints) => {
                    Some(endpoints.into_iter().map(|(k, v)| (k, v.into())).collect())
                }
                None => None,
            },
            dapr: match service.dapr {
                Some(dapr) => Some(dapr.into_iter().map(|(k, v)| (k, v.into())).collect()),
                None => None,
            },
            properties: match service.properties {
                Some(properties) => Some(
                    properties
                        .into_iter()
                        .map(|(k, v)| (k, Some(v.into())))
                        .collect(),
                ),
                None => None,
            },
        }
    }
}

impl Into<SourceProviderSpec> for SourceProviderSpecDto {
    fn into(self) -> SourceProviderSpec {
        SourceProviderSpec {
            services: self
                .services
                .into_iter()
                .map(|(k, v)| (k, v.into()))
                .collect(),
            config_schema: match self.config_schema {
                Some(schema) => Some(schema),
                None => None,
            },
        }
    }
}

impl From<SourceProviderSpec> for SourceProviderSpecDto {
    fn from(spec: SourceProviderSpec) -> Self {
        SourceProviderSpecDto {
            services: spec
                .services
                .into_iter()
                .map(|(k, v)| (k, v.into()))
                .collect(),
            config_schema: match spec.config_schema {
                Some(schema) => Some(schema),
                None => None,
            },
        }
    }
}

impl Into<ReactionProviderSpec> for ReactionProviderSpecDto {
    fn into(self) -> ReactionProviderSpec {
        ReactionProviderSpec {
            services: self
                .services
                .into_iter()
                .map(|(k, v)| (k, v.into()))
                .collect(),
            config_schema: match self.config_schema {
                Some(schema) => Some(schema),
                None => None,
            },
        }
    }
}

impl From<ReactionProviderSpec> for ReactionProviderSpecDto {
    fn from(spec: ReactionProviderSpec) -> Self {
        ReactionProviderSpecDto {
            services: spec
                .services
                .into_iter()
                .map(|(k, v)| (k, v.into()))
                .collect(),
            config_schema: match spec.config_schema {
                Some(schema) => Some(schema),
                None => None,
            },
        }
    }
}
