// package: dapr.proto.sentry.v1
// file: dapr/proto/sentry/v1/sentry.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as dapr_proto_sentry_v1_sentry_pb from "../../../../dapr/proto/sentry/v1/sentry_pb";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";

interface ICAService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    signCertificate: ICAService_ISignCertificate;
}

interface ICAService_ISignCertificate extends grpc.MethodDefinition<dapr_proto_sentry_v1_sentry_pb.SignCertificateRequest, dapr_proto_sentry_v1_sentry_pb.SignCertificateResponse> {
    path: "/dapr.proto.sentry.v1.CA/SignCertificate";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_sentry_v1_sentry_pb.SignCertificateRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_sentry_v1_sentry_pb.SignCertificateRequest>;
    responseSerialize: grpc.serialize<dapr_proto_sentry_v1_sentry_pb.SignCertificateResponse>;
    responseDeserialize: grpc.deserialize<dapr_proto_sentry_v1_sentry_pb.SignCertificateResponse>;
}

export const CAService: ICAService;

export interface ICAServer extends grpc.UntypedServiceImplementation {
    signCertificate: grpc.handleUnaryCall<dapr_proto_sentry_v1_sentry_pb.SignCertificateRequest, dapr_proto_sentry_v1_sentry_pb.SignCertificateResponse>;
}

export interface ICAClient {
    signCertificate(request: dapr_proto_sentry_v1_sentry_pb.SignCertificateRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_sentry_v1_sentry_pb.SignCertificateResponse) => void): grpc.ClientUnaryCall;
    signCertificate(request: dapr_proto_sentry_v1_sentry_pb.SignCertificateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_sentry_v1_sentry_pb.SignCertificateResponse) => void): grpc.ClientUnaryCall;
    signCertificate(request: dapr_proto_sentry_v1_sentry_pb.SignCertificateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_sentry_v1_sentry_pb.SignCertificateResponse) => void): grpc.ClientUnaryCall;
}

export class CAClient extends grpc.Client implements ICAClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public signCertificate(request: dapr_proto_sentry_v1_sentry_pb.SignCertificateRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_sentry_v1_sentry_pb.SignCertificateResponse) => void): grpc.ClientUnaryCall;
    public signCertificate(request: dapr_proto_sentry_v1_sentry_pb.SignCertificateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_sentry_v1_sentry_pb.SignCertificateResponse) => void): grpc.ClientUnaryCall;
    public signCertificate(request: dapr_proto_sentry_v1_sentry_pb.SignCertificateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_sentry_v1_sentry_pb.SignCertificateResponse) => void): grpc.ClientUnaryCall;
}
