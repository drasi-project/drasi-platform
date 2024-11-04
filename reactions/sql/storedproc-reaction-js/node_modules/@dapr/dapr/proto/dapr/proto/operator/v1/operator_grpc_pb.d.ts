// package: dapr.proto.operator.v1
// file: dapr/proto/operator/v1/operator.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as dapr_proto_operator_v1_operator_pb from "../../../../dapr/proto/operator/v1/operator_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

interface IOperatorService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    componentUpdate: IOperatorService_IComponentUpdate;
    listComponents: IOperatorService_IListComponents;
    getConfiguration: IOperatorService_IGetConfiguration;
    listSubscriptions: IOperatorService_IListSubscriptions;
    getResiliency: IOperatorService_IGetResiliency;
    listResiliency: IOperatorService_IListResiliency;
    listSubscriptionsV2: IOperatorService_IListSubscriptionsV2;
    subscriptionUpdate: IOperatorService_ISubscriptionUpdate;
    listHTTPEndpoints: IOperatorService_IListHTTPEndpoints;
    hTTPEndpointUpdate: IOperatorService_IHTTPEndpointUpdate;
}

interface IOperatorService_IComponentUpdate extends grpc.MethodDefinition<dapr_proto_operator_v1_operator_pb.ComponentUpdateRequest, dapr_proto_operator_v1_operator_pb.ComponentUpdateEvent> {
    path: "/dapr.proto.operator.v1.Operator/ComponentUpdate";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<dapr_proto_operator_v1_operator_pb.ComponentUpdateRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_operator_v1_operator_pb.ComponentUpdateRequest>;
    responseSerialize: grpc.serialize<dapr_proto_operator_v1_operator_pb.ComponentUpdateEvent>;
    responseDeserialize: grpc.deserialize<dapr_proto_operator_v1_operator_pb.ComponentUpdateEvent>;
}
interface IOperatorService_IListComponents extends grpc.MethodDefinition<dapr_proto_operator_v1_operator_pb.ListComponentsRequest, dapr_proto_operator_v1_operator_pb.ListComponentResponse> {
    path: "/dapr.proto.operator.v1.Operator/ListComponents";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_operator_v1_operator_pb.ListComponentsRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_operator_v1_operator_pb.ListComponentsRequest>;
    responseSerialize: grpc.serialize<dapr_proto_operator_v1_operator_pb.ListComponentResponse>;
    responseDeserialize: grpc.deserialize<dapr_proto_operator_v1_operator_pb.ListComponentResponse>;
}
interface IOperatorService_IGetConfiguration extends grpc.MethodDefinition<dapr_proto_operator_v1_operator_pb.GetConfigurationRequest, dapr_proto_operator_v1_operator_pb.GetConfigurationResponse> {
    path: "/dapr.proto.operator.v1.Operator/GetConfiguration";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_operator_v1_operator_pb.GetConfigurationRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_operator_v1_operator_pb.GetConfigurationRequest>;
    responseSerialize: grpc.serialize<dapr_proto_operator_v1_operator_pb.GetConfigurationResponse>;
    responseDeserialize: grpc.deserialize<dapr_proto_operator_v1_operator_pb.GetConfigurationResponse>;
}
interface IOperatorService_IListSubscriptions extends grpc.MethodDefinition<google_protobuf_empty_pb.Empty, dapr_proto_operator_v1_operator_pb.ListSubscriptionsResponse> {
    path: "/dapr.proto.operator.v1.Operator/ListSubscriptions";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    requestDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
    responseSerialize: grpc.serialize<dapr_proto_operator_v1_operator_pb.ListSubscriptionsResponse>;
    responseDeserialize: grpc.deserialize<dapr_proto_operator_v1_operator_pb.ListSubscriptionsResponse>;
}
interface IOperatorService_IGetResiliency extends grpc.MethodDefinition<dapr_proto_operator_v1_operator_pb.GetResiliencyRequest, dapr_proto_operator_v1_operator_pb.GetResiliencyResponse> {
    path: "/dapr.proto.operator.v1.Operator/GetResiliency";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_operator_v1_operator_pb.GetResiliencyRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_operator_v1_operator_pb.GetResiliencyRequest>;
    responseSerialize: grpc.serialize<dapr_proto_operator_v1_operator_pb.GetResiliencyResponse>;
    responseDeserialize: grpc.deserialize<dapr_proto_operator_v1_operator_pb.GetResiliencyResponse>;
}
interface IOperatorService_IListResiliency extends grpc.MethodDefinition<dapr_proto_operator_v1_operator_pb.ListResiliencyRequest, dapr_proto_operator_v1_operator_pb.ListResiliencyResponse> {
    path: "/dapr.proto.operator.v1.Operator/ListResiliency";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_operator_v1_operator_pb.ListResiliencyRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_operator_v1_operator_pb.ListResiliencyRequest>;
    responseSerialize: grpc.serialize<dapr_proto_operator_v1_operator_pb.ListResiliencyResponse>;
    responseDeserialize: grpc.deserialize<dapr_proto_operator_v1_operator_pb.ListResiliencyResponse>;
}
interface IOperatorService_IListSubscriptionsV2 extends grpc.MethodDefinition<dapr_proto_operator_v1_operator_pb.ListSubscriptionsRequest, dapr_proto_operator_v1_operator_pb.ListSubscriptionsResponse> {
    path: "/dapr.proto.operator.v1.Operator/ListSubscriptionsV2";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_operator_v1_operator_pb.ListSubscriptionsRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_operator_v1_operator_pb.ListSubscriptionsRequest>;
    responseSerialize: grpc.serialize<dapr_proto_operator_v1_operator_pb.ListSubscriptionsResponse>;
    responseDeserialize: grpc.deserialize<dapr_proto_operator_v1_operator_pb.ListSubscriptionsResponse>;
}
interface IOperatorService_ISubscriptionUpdate extends grpc.MethodDefinition<dapr_proto_operator_v1_operator_pb.SubscriptionUpdateRequest, dapr_proto_operator_v1_operator_pb.SubscriptionUpdateEvent> {
    path: "/dapr.proto.operator.v1.Operator/SubscriptionUpdate";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<dapr_proto_operator_v1_operator_pb.SubscriptionUpdateRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_operator_v1_operator_pb.SubscriptionUpdateRequest>;
    responseSerialize: grpc.serialize<dapr_proto_operator_v1_operator_pb.SubscriptionUpdateEvent>;
    responseDeserialize: grpc.deserialize<dapr_proto_operator_v1_operator_pb.SubscriptionUpdateEvent>;
}
interface IOperatorService_IListHTTPEndpoints extends grpc.MethodDefinition<dapr_proto_operator_v1_operator_pb.ListHTTPEndpointsRequest, dapr_proto_operator_v1_operator_pb.ListHTTPEndpointsResponse> {
    path: "/dapr.proto.operator.v1.Operator/ListHTTPEndpoints";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_operator_v1_operator_pb.ListHTTPEndpointsRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_operator_v1_operator_pb.ListHTTPEndpointsRequest>;
    responseSerialize: grpc.serialize<dapr_proto_operator_v1_operator_pb.ListHTTPEndpointsResponse>;
    responseDeserialize: grpc.deserialize<dapr_proto_operator_v1_operator_pb.ListHTTPEndpointsResponse>;
}
interface IOperatorService_IHTTPEndpointUpdate extends grpc.MethodDefinition<dapr_proto_operator_v1_operator_pb.HTTPEndpointUpdateRequest, dapr_proto_operator_v1_operator_pb.HTTPEndpointUpdateEvent> {
    path: "/dapr.proto.operator.v1.Operator/HTTPEndpointUpdate";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<dapr_proto_operator_v1_operator_pb.HTTPEndpointUpdateRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_operator_v1_operator_pb.HTTPEndpointUpdateRequest>;
    responseSerialize: grpc.serialize<dapr_proto_operator_v1_operator_pb.HTTPEndpointUpdateEvent>;
    responseDeserialize: grpc.deserialize<dapr_proto_operator_v1_operator_pb.HTTPEndpointUpdateEvent>;
}

export const OperatorService: IOperatorService;

export interface IOperatorServer extends grpc.UntypedServiceImplementation {
    componentUpdate: grpc.handleServerStreamingCall<dapr_proto_operator_v1_operator_pb.ComponentUpdateRequest, dapr_proto_operator_v1_operator_pb.ComponentUpdateEvent>;
    listComponents: grpc.handleUnaryCall<dapr_proto_operator_v1_operator_pb.ListComponentsRequest, dapr_proto_operator_v1_operator_pb.ListComponentResponse>;
    getConfiguration: grpc.handleUnaryCall<dapr_proto_operator_v1_operator_pb.GetConfigurationRequest, dapr_proto_operator_v1_operator_pb.GetConfigurationResponse>;
    listSubscriptions: grpc.handleUnaryCall<google_protobuf_empty_pb.Empty, dapr_proto_operator_v1_operator_pb.ListSubscriptionsResponse>;
    getResiliency: grpc.handleUnaryCall<dapr_proto_operator_v1_operator_pb.GetResiliencyRequest, dapr_proto_operator_v1_operator_pb.GetResiliencyResponse>;
    listResiliency: grpc.handleUnaryCall<dapr_proto_operator_v1_operator_pb.ListResiliencyRequest, dapr_proto_operator_v1_operator_pb.ListResiliencyResponse>;
    listSubscriptionsV2: grpc.handleUnaryCall<dapr_proto_operator_v1_operator_pb.ListSubscriptionsRequest, dapr_proto_operator_v1_operator_pb.ListSubscriptionsResponse>;
    subscriptionUpdate: grpc.handleServerStreamingCall<dapr_proto_operator_v1_operator_pb.SubscriptionUpdateRequest, dapr_proto_operator_v1_operator_pb.SubscriptionUpdateEvent>;
    listHTTPEndpoints: grpc.handleUnaryCall<dapr_proto_operator_v1_operator_pb.ListHTTPEndpointsRequest, dapr_proto_operator_v1_operator_pb.ListHTTPEndpointsResponse>;
    hTTPEndpointUpdate: grpc.handleServerStreamingCall<dapr_proto_operator_v1_operator_pb.HTTPEndpointUpdateRequest, dapr_proto_operator_v1_operator_pb.HTTPEndpointUpdateEvent>;
}

export interface IOperatorClient {
    componentUpdate(request: dapr_proto_operator_v1_operator_pb.ComponentUpdateRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<dapr_proto_operator_v1_operator_pb.ComponentUpdateEvent>;
    componentUpdate(request: dapr_proto_operator_v1_operator_pb.ComponentUpdateRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<dapr_proto_operator_v1_operator_pb.ComponentUpdateEvent>;
    listComponents(request: dapr_proto_operator_v1_operator_pb.ListComponentsRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_operator_v1_operator_pb.ListComponentResponse) => void): grpc.ClientUnaryCall;
    listComponents(request: dapr_proto_operator_v1_operator_pb.ListComponentsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_operator_v1_operator_pb.ListComponentResponse) => void): grpc.ClientUnaryCall;
    listComponents(request: dapr_proto_operator_v1_operator_pb.ListComponentsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_operator_v1_operator_pb.ListComponentResponse) => void): grpc.ClientUnaryCall;
    getConfiguration(request: dapr_proto_operator_v1_operator_pb.GetConfigurationRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_operator_v1_operator_pb.GetConfigurationResponse) => void): grpc.ClientUnaryCall;
    getConfiguration(request: dapr_proto_operator_v1_operator_pb.GetConfigurationRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_operator_v1_operator_pb.GetConfigurationResponse) => void): grpc.ClientUnaryCall;
    getConfiguration(request: dapr_proto_operator_v1_operator_pb.GetConfigurationRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_operator_v1_operator_pb.GetConfigurationResponse) => void): grpc.ClientUnaryCall;
    listSubscriptions(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: dapr_proto_operator_v1_operator_pb.ListSubscriptionsResponse) => void): grpc.ClientUnaryCall;
    listSubscriptions(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_operator_v1_operator_pb.ListSubscriptionsResponse) => void): grpc.ClientUnaryCall;
    listSubscriptions(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_operator_v1_operator_pb.ListSubscriptionsResponse) => void): grpc.ClientUnaryCall;
    getResiliency(request: dapr_proto_operator_v1_operator_pb.GetResiliencyRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_operator_v1_operator_pb.GetResiliencyResponse) => void): grpc.ClientUnaryCall;
    getResiliency(request: dapr_proto_operator_v1_operator_pb.GetResiliencyRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_operator_v1_operator_pb.GetResiliencyResponse) => void): grpc.ClientUnaryCall;
    getResiliency(request: dapr_proto_operator_v1_operator_pb.GetResiliencyRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_operator_v1_operator_pb.GetResiliencyResponse) => void): grpc.ClientUnaryCall;
    listResiliency(request: dapr_proto_operator_v1_operator_pb.ListResiliencyRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_operator_v1_operator_pb.ListResiliencyResponse) => void): grpc.ClientUnaryCall;
    listResiliency(request: dapr_proto_operator_v1_operator_pb.ListResiliencyRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_operator_v1_operator_pb.ListResiliencyResponse) => void): grpc.ClientUnaryCall;
    listResiliency(request: dapr_proto_operator_v1_operator_pb.ListResiliencyRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_operator_v1_operator_pb.ListResiliencyResponse) => void): grpc.ClientUnaryCall;
    listSubscriptionsV2(request: dapr_proto_operator_v1_operator_pb.ListSubscriptionsRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_operator_v1_operator_pb.ListSubscriptionsResponse) => void): grpc.ClientUnaryCall;
    listSubscriptionsV2(request: dapr_proto_operator_v1_operator_pb.ListSubscriptionsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_operator_v1_operator_pb.ListSubscriptionsResponse) => void): grpc.ClientUnaryCall;
    listSubscriptionsV2(request: dapr_proto_operator_v1_operator_pb.ListSubscriptionsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_operator_v1_operator_pb.ListSubscriptionsResponse) => void): grpc.ClientUnaryCall;
    subscriptionUpdate(request: dapr_proto_operator_v1_operator_pb.SubscriptionUpdateRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<dapr_proto_operator_v1_operator_pb.SubscriptionUpdateEvent>;
    subscriptionUpdate(request: dapr_proto_operator_v1_operator_pb.SubscriptionUpdateRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<dapr_proto_operator_v1_operator_pb.SubscriptionUpdateEvent>;
    listHTTPEndpoints(request: dapr_proto_operator_v1_operator_pb.ListHTTPEndpointsRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_operator_v1_operator_pb.ListHTTPEndpointsResponse) => void): grpc.ClientUnaryCall;
    listHTTPEndpoints(request: dapr_proto_operator_v1_operator_pb.ListHTTPEndpointsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_operator_v1_operator_pb.ListHTTPEndpointsResponse) => void): grpc.ClientUnaryCall;
    listHTTPEndpoints(request: dapr_proto_operator_v1_operator_pb.ListHTTPEndpointsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_operator_v1_operator_pb.ListHTTPEndpointsResponse) => void): grpc.ClientUnaryCall;
    hTTPEndpointUpdate(request: dapr_proto_operator_v1_operator_pb.HTTPEndpointUpdateRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<dapr_proto_operator_v1_operator_pb.HTTPEndpointUpdateEvent>;
    hTTPEndpointUpdate(request: dapr_proto_operator_v1_operator_pb.HTTPEndpointUpdateRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<dapr_proto_operator_v1_operator_pb.HTTPEndpointUpdateEvent>;
}

export class OperatorClient extends grpc.Client implements IOperatorClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public componentUpdate(request: dapr_proto_operator_v1_operator_pb.ComponentUpdateRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<dapr_proto_operator_v1_operator_pb.ComponentUpdateEvent>;
    public componentUpdate(request: dapr_proto_operator_v1_operator_pb.ComponentUpdateRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<dapr_proto_operator_v1_operator_pb.ComponentUpdateEvent>;
    public listComponents(request: dapr_proto_operator_v1_operator_pb.ListComponentsRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_operator_v1_operator_pb.ListComponentResponse) => void): grpc.ClientUnaryCall;
    public listComponents(request: dapr_proto_operator_v1_operator_pb.ListComponentsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_operator_v1_operator_pb.ListComponentResponse) => void): grpc.ClientUnaryCall;
    public listComponents(request: dapr_proto_operator_v1_operator_pb.ListComponentsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_operator_v1_operator_pb.ListComponentResponse) => void): grpc.ClientUnaryCall;
    public getConfiguration(request: dapr_proto_operator_v1_operator_pb.GetConfigurationRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_operator_v1_operator_pb.GetConfigurationResponse) => void): grpc.ClientUnaryCall;
    public getConfiguration(request: dapr_proto_operator_v1_operator_pb.GetConfigurationRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_operator_v1_operator_pb.GetConfigurationResponse) => void): grpc.ClientUnaryCall;
    public getConfiguration(request: dapr_proto_operator_v1_operator_pb.GetConfigurationRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_operator_v1_operator_pb.GetConfigurationResponse) => void): grpc.ClientUnaryCall;
    public listSubscriptions(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: dapr_proto_operator_v1_operator_pb.ListSubscriptionsResponse) => void): grpc.ClientUnaryCall;
    public listSubscriptions(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_operator_v1_operator_pb.ListSubscriptionsResponse) => void): grpc.ClientUnaryCall;
    public listSubscriptions(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_operator_v1_operator_pb.ListSubscriptionsResponse) => void): grpc.ClientUnaryCall;
    public getResiliency(request: dapr_proto_operator_v1_operator_pb.GetResiliencyRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_operator_v1_operator_pb.GetResiliencyResponse) => void): grpc.ClientUnaryCall;
    public getResiliency(request: dapr_proto_operator_v1_operator_pb.GetResiliencyRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_operator_v1_operator_pb.GetResiliencyResponse) => void): grpc.ClientUnaryCall;
    public getResiliency(request: dapr_proto_operator_v1_operator_pb.GetResiliencyRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_operator_v1_operator_pb.GetResiliencyResponse) => void): grpc.ClientUnaryCall;
    public listResiliency(request: dapr_proto_operator_v1_operator_pb.ListResiliencyRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_operator_v1_operator_pb.ListResiliencyResponse) => void): grpc.ClientUnaryCall;
    public listResiliency(request: dapr_proto_operator_v1_operator_pb.ListResiliencyRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_operator_v1_operator_pb.ListResiliencyResponse) => void): grpc.ClientUnaryCall;
    public listResiliency(request: dapr_proto_operator_v1_operator_pb.ListResiliencyRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_operator_v1_operator_pb.ListResiliencyResponse) => void): grpc.ClientUnaryCall;
    public listSubscriptionsV2(request: dapr_proto_operator_v1_operator_pb.ListSubscriptionsRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_operator_v1_operator_pb.ListSubscriptionsResponse) => void): grpc.ClientUnaryCall;
    public listSubscriptionsV2(request: dapr_proto_operator_v1_operator_pb.ListSubscriptionsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_operator_v1_operator_pb.ListSubscriptionsResponse) => void): grpc.ClientUnaryCall;
    public listSubscriptionsV2(request: dapr_proto_operator_v1_operator_pb.ListSubscriptionsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_operator_v1_operator_pb.ListSubscriptionsResponse) => void): grpc.ClientUnaryCall;
    public subscriptionUpdate(request: dapr_proto_operator_v1_operator_pb.SubscriptionUpdateRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<dapr_proto_operator_v1_operator_pb.SubscriptionUpdateEvent>;
    public subscriptionUpdate(request: dapr_proto_operator_v1_operator_pb.SubscriptionUpdateRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<dapr_proto_operator_v1_operator_pb.SubscriptionUpdateEvent>;
    public listHTTPEndpoints(request: dapr_proto_operator_v1_operator_pb.ListHTTPEndpointsRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_operator_v1_operator_pb.ListHTTPEndpointsResponse) => void): grpc.ClientUnaryCall;
    public listHTTPEndpoints(request: dapr_proto_operator_v1_operator_pb.ListHTTPEndpointsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_operator_v1_operator_pb.ListHTTPEndpointsResponse) => void): grpc.ClientUnaryCall;
    public listHTTPEndpoints(request: dapr_proto_operator_v1_operator_pb.ListHTTPEndpointsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_operator_v1_operator_pb.ListHTTPEndpointsResponse) => void): grpc.ClientUnaryCall;
    public hTTPEndpointUpdate(request: dapr_proto_operator_v1_operator_pb.HTTPEndpointUpdateRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<dapr_proto_operator_v1_operator_pb.HTTPEndpointUpdateEvent>;
    public hTTPEndpointUpdate(request: dapr_proto_operator_v1_operator_pb.HTTPEndpointUpdateRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<dapr_proto_operator_v1_operator_pb.HTTPEndpointUpdateEvent>;
}
