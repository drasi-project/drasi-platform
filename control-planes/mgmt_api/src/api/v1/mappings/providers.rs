use crate::domain::models::{
    Endpoint, EndpointSetting, JsonSchema, ProviderService, ProviderSpec, ResourceProvider,
    SchemaType, ServiceConfig, ServiceEndpoint,
};

use super::{
    EndpointDto, EndpointSettingDto, JsonSchemaDto, ProviderServiceDto, ProviderSpecDto,
    ResourceProviderDto, SchemaTypeDto, ServiceConfigDto, ServiceEndpointDto,
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

impl From<ServiceConfigDto> for ServiceConfig {
    fn from(service: ServiceConfigDto) -> Self {
        ServiceConfig {
            replica: None,
            image: None,
            deprovision_handler: None,
            endpoints: service
                .endpoints
                .map(|endpoints| endpoints.into_iter().map(|(k, v)| (k, v.into())).collect()),
            dapr: service
                .dapr
                .map(|dapr| dapr.into_iter().map(|(k, v)| (k, v.into())).collect()),
            properties: service.properties.map(|properties| {
                properties
                    .into_iter()
                    .map(|(k, v)| (k, v.unwrap().into()))
                    .collect()
            }),
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

impl From<ServiceConfig> for ServiceConfigDto {
    fn from(service: ServiceConfig) -> Self {
        ServiceConfigDto {
            endpoints: service
                .endpoints
                .map(|endpoints| endpoints.into_iter().map(|(k, v)| (k, v.into())).collect()),
            dapr: service
                .dapr
                .map(|dapr| dapr.into_iter().map(|(k, v)| (k, v.into())).collect()),
            properties: service.properties.map(|properties| {
                properties
                    .into_iter()
                    .map(|(k, v)| (k, Some(v.into())))
                    .collect()
            }),
        }
    }
}

impl From<ProviderSpecDto> for ProviderSpec {
    fn from(provider_spec: ProviderSpecDto) -> Self {
        ProviderSpec {
            services: provider_spec
                .services
                .into_iter()
                .map(|(k, v)| (k, v.into()))
                .collect(),
            config_schema: provider_spec.config_schema.map(|schema| schema.into()),
        }
    }
}

impl From<ProviderSpec> for ProviderSpecDto {
    fn from(provider_spec: ProviderSpec) -> Self {
        ProviderSpecDto {
            services: provider_spec
                .services
                .into_iter()
                .map(|(k, v)| (k, v.into()))
                .collect(),
            config_schema: provider_spec.config_schema.map(|schema| schema.into()),
        }
    }
}

impl From<ProviderServiceDto> for ProviderService {
    fn from(provider_service: ProviderServiceDto) -> Self {
        ProviderService {
            image: provider_service.image,
            dapr: provider_service.dapr,
            endpoints: provider_service
                .endpoints
                .map(|endpoints| endpoints.into_iter().map(|(k, v)| (k, v.into())).collect()),
            config_schema: provider_service.config_schema.map(|schema| schema.into()),
            deprovision_handler: provider_service.deprovision_handler,
        }
    }
}

impl From<ProviderService> for ProviderServiceDto {
    fn from(provider_service: ProviderService) -> Self {
        ProviderServiceDto {
            image: provider_service.image,
            dapr: provider_service.dapr,
            endpoints: provider_service
                .endpoints
                .map(|endpoints| endpoints.into_iter().map(|(k, v)| (k, v.into())).collect()),
            config_schema: provider_service.config_schema.map(|schema| schema.into()),
            deprovision_handler: provider_service.deprovision_handler,
        }
    }
}

impl From<ServiceEndpointDto> for ServiceEndpoint {
    fn from(service_endpoint: ServiceEndpointDto) -> Self {
        ServiceEndpoint {
            setting: service_endpoint.setting.into(),
            target: service_endpoint.target,
        }
    }
}

impl From<ServiceEndpoint> for ServiceEndpointDto {
    fn from(endpoint: ServiceEndpoint) -> Self {
        ServiceEndpointDto {
            setting: endpoint.setting.into(),
            target: endpoint.target,
        }
    }
}

impl From<SchemaTypeDto> for SchemaType {
    fn from(schema_type: SchemaTypeDto) -> Self {
        match schema_type {
            SchemaTypeDto::String => SchemaType::String,
            SchemaTypeDto::Number => SchemaType::Number,
            SchemaTypeDto::Integer => SchemaType::Integer,
            SchemaTypeDto::Object => SchemaType::Object,
            SchemaTypeDto::Array => SchemaType::Array,
            SchemaTypeDto::Boolean => SchemaType::Boolean,
            SchemaTypeDto::Null => SchemaType::Null,
        }
    }
}

impl From<SchemaType> for SchemaTypeDto {
    fn from(schema_type: SchemaType) -> Self {
        match schema_type {
            SchemaType::String => SchemaTypeDto::String,
            SchemaType::Number => SchemaTypeDto::Number,
            SchemaType::Integer => SchemaTypeDto::Integer,
            SchemaType::Object => SchemaTypeDto::Object,
            SchemaType::Array => SchemaTypeDto::Array,
            SchemaType::Boolean => SchemaTypeDto::Boolean,
            SchemaType::Null => SchemaTypeDto::Null,
        }
    }
}

impl From<JsonSchemaDto> for JsonSchema {
    fn from(schema: JsonSchemaDto) -> Self {
        JsonSchema {
            schema: schema.schema,
            schema_type: schema.schema_type.into(),
            properties: schema
                .properties
                .map(|properties| properties.into_iter().map(|(k, v)| (k, v.into())).collect()),
            required: schema.required,
            items: schema.items.map(|items| Box::new((*items).into())),
            enum_values: schema.enum_values,
            format: schema.format,
            minimum: schema.minimum,
            maximum: schema.maximum,
            min_length: schema.min_length,
            max_length: schema.max_length,
            description: schema.description,
            default: schema.default,
        }
    }
}

impl From<JsonSchema> for JsonSchemaDto {
    fn from(schema: JsonSchema) -> Self {
        JsonSchemaDto {
            schema: schema.schema,
            schema_type: schema.schema_type.into(),
            properties: schema
                .properties
                .map(|properties| properties.into_iter().map(|(k, v)| (k, v.into())).collect()),
            required: schema.required,
            items: schema.items.map(|items| Box::new((*items).into())),
            enum_values: schema.enum_values,
            format: schema.format,
            minimum: schema.minimum,
            maximum: schema.maximum,
            min_length: schema.min_length,
            max_length: schema.max_length,
            description: schema.description,
            default: schema.default,
        }
    }
}
