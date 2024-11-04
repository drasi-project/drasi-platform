// package: dapr.proto.common.v1
// file: dapr/proto/common/v1/common.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as google_protobuf_any_pb from "google-protobuf/google/protobuf/any_pb";

export class HTTPExtension extends jspb.Message { 
    getVerb(): HTTPExtension.Verb;
    setVerb(value: HTTPExtension.Verb): HTTPExtension;
    getQuerystring(): string;
    setQuerystring(value: string): HTTPExtension;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): HTTPExtension.AsObject;
    static toObject(includeInstance: boolean, msg: HTTPExtension): HTTPExtension.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: HTTPExtension, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): HTTPExtension;
    static deserializeBinaryFromReader(message: HTTPExtension, reader: jspb.BinaryReader): HTTPExtension;
}

export namespace HTTPExtension {
    export type AsObject = {
        verb: HTTPExtension.Verb,
        querystring: string,
    }

    export enum Verb {
    NONE = 0,
    GET = 1,
    HEAD = 2,
    POST = 3,
    PUT = 4,
    DELETE = 5,
    CONNECT = 6,
    OPTIONS = 7,
    TRACE = 8,
    PATCH = 9,
    }

}

export class InvokeRequest extends jspb.Message { 
    getMethod(): string;
    setMethod(value: string): InvokeRequest;

    hasData(): boolean;
    clearData(): void;
    getData(): google_protobuf_any_pb.Any | undefined;
    setData(value?: google_protobuf_any_pb.Any): InvokeRequest;
    getContentType(): string;
    setContentType(value: string): InvokeRequest;

    hasHttpExtension(): boolean;
    clearHttpExtension(): void;
    getHttpExtension(): HTTPExtension | undefined;
    setHttpExtension(value?: HTTPExtension): InvokeRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): InvokeRequest.AsObject;
    static toObject(includeInstance: boolean, msg: InvokeRequest): InvokeRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: InvokeRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): InvokeRequest;
    static deserializeBinaryFromReader(message: InvokeRequest, reader: jspb.BinaryReader): InvokeRequest;
}

export namespace InvokeRequest {
    export type AsObject = {
        method: string,
        data?: google_protobuf_any_pb.Any.AsObject,
        contentType: string,
        httpExtension?: HTTPExtension.AsObject,
    }
}

export class InvokeResponse extends jspb.Message { 

    hasData(): boolean;
    clearData(): void;
    getData(): google_protobuf_any_pb.Any | undefined;
    setData(value?: google_protobuf_any_pb.Any): InvokeResponse;
    getContentType(): string;
    setContentType(value: string): InvokeResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): InvokeResponse.AsObject;
    static toObject(includeInstance: boolean, msg: InvokeResponse): InvokeResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: InvokeResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): InvokeResponse;
    static deserializeBinaryFromReader(message: InvokeResponse, reader: jspb.BinaryReader): InvokeResponse;
}

export namespace InvokeResponse {
    export type AsObject = {
        data?: google_protobuf_any_pb.Any.AsObject,
        contentType: string,
    }
}

export class StreamPayload extends jspb.Message { 
    getData(): Uint8Array | string;
    getData_asU8(): Uint8Array;
    getData_asB64(): string;
    setData(value: Uint8Array | string): StreamPayload;
    getSeq(): number;
    setSeq(value: number): StreamPayload;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): StreamPayload.AsObject;
    static toObject(includeInstance: boolean, msg: StreamPayload): StreamPayload.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: StreamPayload, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): StreamPayload;
    static deserializeBinaryFromReader(message: StreamPayload, reader: jspb.BinaryReader): StreamPayload;
}

export namespace StreamPayload {
    export type AsObject = {
        data: Uint8Array | string,
        seq: number,
    }
}

export class StateItem extends jspb.Message { 
    getKey(): string;
    setKey(value: string): StateItem;
    getValue(): Uint8Array | string;
    getValue_asU8(): Uint8Array;
    getValue_asB64(): string;
    setValue(value: Uint8Array | string): StateItem;

    hasEtag(): boolean;
    clearEtag(): void;
    getEtag(): Etag | undefined;
    setEtag(value?: Etag): StateItem;

    getMetadataMap(): jspb.Map<string, string>;
    clearMetadataMap(): void;

    hasOptions(): boolean;
    clearOptions(): void;
    getOptions(): StateOptions | undefined;
    setOptions(value?: StateOptions): StateItem;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): StateItem.AsObject;
    static toObject(includeInstance: boolean, msg: StateItem): StateItem.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: StateItem, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): StateItem;
    static deserializeBinaryFromReader(message: StateItem, reader: jspb.BinaryReader): StateItem;
}

export namespace StateItem {
    export type AsObject = {
        key: string,
        value: Uint8Array | string,
        etag?: Etag.AsObject,

        metadataMap: Array<[string, string]>,
        options?: StateOptions.AsObject,
    }
}

export class Etag extends jspb.Message { 
    getValue(): string;
    setValue(value: string): Etag;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Etag.AsObject;
    static toObject(includeInstance: boolean, msg: Etag): Etag.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Etag, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Etag;
    static deserializeBinaryFromReader(message: Etag, reader: jspb.BinaryReader): Etag;
}

export namespace Etag {
    export type AsObject = {
        value: string,
    }
}

export class StateOptions extends jspb.Message { 
    getConcurrency(): StateOptions.StateConcurrency;
    setConcurrency(value: StateOptions.StateConcurrency): StateOptions;
    getConsistency(): StateOptions.StateConsistency;
    setConsistency(value: StateOptions.StateConsistency): StateOptions;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): StateOptions.AsObject;
    static toObject(includeInstance: boolean, msg: StateOptions): StateOptions.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: StateOptions, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): StateOptions;
    static deserializeBinaryFromReader(message: StateOptions, reader: jspb.BinaryReader): StateOptions;
}

export namespace StateOptions {
    export type AsObject = {
        concurrency: StateOptions.StateConcurrency,
        consistency: StateOptions.StateConsistency,
    }

    export enum StateConcurrency {
    CONCURRENCY_UNSPECIFIED = 0,
    CONCURRENCY_FIRST_WRITE = 1,
    CONCURRENCY_LAST_WRITE = 2,
    }

    export enum StateConsistency {
    CONSISTENCY_UNSPECIFIED = 0,
    CONSISTENCY_EVENTUAL = 1,
    CONSISTENCY_STRONG = 2,
    }

}

export class ConfigurationItem extends jspb.Message { 
    getValue(): string;
    setValue(value: string): ConfigurationItem;
    getVersion(): string;
    setVersion(value: string): ConfigurationItem;

    getMetadataMap(): jspb.Map<string, string>;
    clearMetadataMap(): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ConfigurationItem.AsObject;
    static toObject(includeInstance: boolean, msg: ConfigurationItem): ConfigurationItem.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ConfigurationItem, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ConfigurationItem;
    static deserializeBinaryFromReader(message: ConfigurationItem, reader: jspb.BinaryReader): ConfigurationItem;
}

export namespace ConfigurationItem {
    export type AsObject = {
        value: string,
        version: string,

        metadataMap: Array<[string, string]>,
    }
}
