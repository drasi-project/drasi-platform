// package: dapr.proto.sentry.v1
// file: dapr/proto/sentry/v1/sentry.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";

export class SignCertificateRequest extends jspb.Message { 
    getId(): string;
    setId(value: string): SignCertificateRequest;
    getToken(): string;
    setToken(value: string): SignCertificateRequest;
    getTrustDomain(): string;
    setTrustDomain(value: string): SignCertificateRequest;
    getNamespace(): string;
    setNamespace(value: string): SignCertificateRequest;
    getCertificateSigningRequest(): Uint8Array | string;
    getCertificateSigningRequest_asU8(): Uint8Array;
    getCertificateSigningRequest_asB64(): string;
    setCertificateSigningRequest(value: Uint8Array | string): SignCertificateRequest;
    getTokenValidator(): SignCertificateRequest.TokenValidator;
    setTokenValidator(value: SignCertificateRequest.TokenValidator): SignCertificateRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SignCertificateRequest.AsObject;
    static toObject(includeInstance: boolean, msg: SignCertificateRequest): SignCertificateRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SignCertificateRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SignCertificateRequest;
    static deserializeBinaryFromReader(message: SignCertificateRequest, reader: jspb.BinaryReader): SignCertificateRequest;
}

export namespace SignCertificateRequest {
    export type AsObject = {
        id: string,
        token: string,
        trustDomain: string,
        namespace: string,
        certificateSigningRequest: Uint8Array | string,
        tokenValidator: SignCertificateRequest.TokenValidator,
    }

    export enum TokenValidator {
    UNKNOWN = 0,
    INSECURE = 1,
    KUBERNETES = 2,
    JWKS = 3,
    }

}

export class SignCertificateResponse extends jspb.Message { 
    getWorkloadCertificate(): Uint8Array | string;
    getWorkloadCertificate_asU8(): Uint8Array;
    getWorkloadCertificate_asB64(): string;
    setWorkloadCertificate(value: Uint8Array | string): SignCertificateResponse;
    clearTrustChainCertificatesList(): void;
    getTrustChainCertificatesList(): Array<Uint8Array | string>;
    getTrustChainCertificatesList_asU8(): Array<Uint8Array>;
    getTrustChainCertificatesList_asB64(): Array<string>;
    setTrustChainCertificatesList(value: Array<Uint8Array | string>): SignCertificateResponse;
    addTrustChainCertificates(value: Uint8Array | string, index?: number): Uint8Array | string;

    hasValidUntil(): boolean;
    clearValidUntil(): void;
    getValidUntil(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setValidUntil(value?: google_protobuf_timestamp_pb.Timestamp): SignCertificateResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SignCertificateResponse.AsObject;
    static toObject(includeInstance: boolean, msg: SignCertificateResponse): SignCertificateResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SignCertificateResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SignCertificateResponse;
    static deserializeBinaryFromReader(message: SignCertificateResponse, reader: jspb.BinaryReader): SignCertificateResponse;
}

export namespace SignCertificateResponse {
    export type AsObject = {
        workloadCertificate: Uint8Array | string,
        trustChainCertificatesList: Array<Uint8Array | string>,
        validUntil?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    }
}
