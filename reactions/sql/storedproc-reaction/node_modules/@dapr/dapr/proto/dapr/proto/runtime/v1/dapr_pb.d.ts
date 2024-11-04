// package: dapr.proto.runtime.v1
// file: dapr/proto/runtime/v1/dapr.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as google_protobuf_any_pb from "google-protobuf/google/protobuf/any_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";
import * as dapr_proto_common_v1_common_pb from "../../../../dapr/proto/common/v1/common_pb";
import * as dapr_proto_runtime_v1_appcallback_pb from "../../../../dapr/proto/runtime/v1/appcallback_pb";

export class InvokeServiceRequest extends jspb.Message { 
    getId(): string;
    setId(value: string): InvokeServiceRequest;

    hasMessage(): boolean;
    clearMessage(): void;
    getMessage(): dapr_proto_common_v1_common_pb.InvokeRequest | undefined;
    setMessage(value?: dapr_proto_common_v1_common_pb.InvokeRequest): InvokeServiceRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): InvokeServiceRequest.AsObject;
    static toObject(includeInstance: boolean, msg: InvokeServiceRequest): InvokeServiceRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: InvokeServiceRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): InvokeServiceRequest;
    static deserializeBinaryFromReader(message: InvokeServiceRequest, reader: jspb.BinaryReader): InvokeServiceRequest;
}

export namespace InvokeServiceRequest {
    export type AsObject = {
        id: string,
        message?: dapr_proto_common_v1_common_pb.InvokeRequest.AsObject,
    }
}

export class GetStateRequest extends jspb.Message { 
    getStoreName(): string;
    setStoreName(value: string): GetStateRequest;
    getKey(): string;
    setKey(value: string): GetStateRequest;
    getConsistency(): dapr_proto_common_v1_common_pb.StateOptions.StateConsistency;
    setConsistency(value: dapr_proto_common_v1_common_pb.StateOptions.StateConsistency): GetStateRequest;

    getMetadataMap(): jspb.Map<string, string>;
    clearMetadataMap(): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetStateRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetStateRequest): GetStateRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetStateRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetStateRequest;
    static deserializeBinaryFromReader(message: GetStateRequest, reader: jspb.BinaryReader): GetStateRequest;
}

export namespace GetStateRequest {
    export type AsObject = {
        storeName: string,
        key: string,
        consistency: dapr_proto_common_v1_common_pb.StateOptions.StateConsistency,

        metadataMap: Array<[string, string]>,
    }
}

export class GetBulkStateRequest extends jspb.Message { 
    getStoreName(): string;
    setStoreName(value: string): GetBulkStateRequest;
    clearKeysList(): void;
    getKeysList(): Array<string>;
    setKeysList(value: Array<string>): GetBulkStateRequest;
    addKeys(value: string, index?: number): string;
    getParallelism(): number;
    setParallelism(value: number): GetBulkStateRequest;

    getMetadataMap(): jspb.Map<string, string>;
    clearMetadataMap(): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetBulkStateRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetBulkStateRequest): GetBulkStateRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetBulkStateRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetBulkStateRequest;
    static deserializeBinaryFromReader(message: GetBulkStateRequest, reader: jspb.BinaryReader): GetBulkStateRequest;
}

export namespace GetBulkStateRequest {
    export type AsObject = {
        storeName: string,
        keysList: Array<string>,
        parallelism: number,

        metadataMap: Array<[string, string]>,
    }
}

export class GetBulkStateResponse extends jspb.Message { 
    clearItemsList(): void;
    getItemsList(): Array<BulkStateItem>;
    setItemsList(value: Array<BulkStateItem>): GetBulkStateResponse;
    addItems(value?: BulkStateItem, index?: number): BulkStateItem;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetBulkStateResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetBulkStateResponse): GetBulkStateResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetBulkStateResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetBulkStateResponse;
    static deserializeBinaryFromReader(message: GetBulkStateResponse, reader: jspb.BinaryReader): GetBulkStateResponse;
}

export namespace GetBulkStateResponse {
    export type AsObject = {
        itemsList: Array<BulkStateItem.AsObject>,
    }
}

export class BulkStateItem extends jspb.Message { 
    getKey(): string;
    setKey(value: string): BulkStateItem;
    getData(): Uint8Array | string;
    getData_asU8(): Uint8Array;
    getData_asB64(): string;
    setData(value: Uint8Array | string): BulkStateItem;
    getEtag(): string;
    setEtag(value: string): BulkStateItem;
    getError(): string;
    setError(value: string): BulkStateItem;

    getMetadataMap(): jspb.Map<string, string>;
    clearMetadataMap(): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BulkStateItem.AsObject;
    static toObject(includeInstance: boolean, msg: BulkStateItem): BulkStateItem.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: BulkStateItem, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BulkStateItem;
    static deserializeBinaryFromReader(message: BulkStateItem, reader: jspb.BinaryReader): BulkStateItem;
}

export namespace BulkStateItem {
    export type AsObject = {
        key: string,
        data: Uint8Array | string,
        etag: string,
        error: string,

        metadataMap: Array<[string, string]>,
    }
}

export class GetStateResponse extends jspb.Message { 
    getData(): Uint8Array | string;
    getData_asU8(): Uint8Array;
    getData_asB64(): string;
    setData(value: Uint8Array | string): GetStateResponse;
    getEtag(): string;
    setEtag(value: string): GetStateResponse;

    getMetadataMap(): jspb.Map<string, string>;
    clearMetadataMap(): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetStateResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetStateResponse): GetStateResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetStateResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetStateResponse;
    static deserializeBinaryFromReader(message: GetStateResponse, reader: jspb.BinaryReader): GetStateResponse;
}

export namespace GetStateResponse {
    export type AsObject = {
        data: Uint8Array | string,
        etag: string,

        metadataMap: Array<[string, string]>,
    }
}

export class DeleteStateRequest extends jspb.Message { 
    getStoreName(): string;
    setStoreName(value: string): DeleteStateRequest;
    getKey(): string;
    setKey(value: string): DeleteStateRequest;

    hasEtag(): boolean;
    clearEtag(): void;
    getEtag(): dapr_proto_common_v1_common_pb.Etag | undefined;
    setEtag(value?: dapr_proto_common_v1_common_pb.Etag): DeleteStateRequest;

    hasOptions(): boolean;
    clearOptions(): void;
    getOptions(): dapr_proto_common_v1_common_pb.StateOptions | undefined;
    setOptions(value?: dapr_proto_common_v1_common_pb.StateOptions): DeleteStateRequest;

    getMetadataMap(): jspb.Map<string, string>;
    clearMetadataMap(): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DeleteStateRequest.AsObject;
    static toObject(includeInstance: boolean, msg: DeleteStateRequest): DeleteStateRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DeleteStateRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DeleteStateRequest;
    static deserializeBinaryFromReader(message: DeleteStateRequest, reader: jspb.BinaryReader): DeleteStateRequest;
}

export namespace DeleteStateRequest {
    export type AsObject = {
        storeName: string,
        key: string,
        etag?: dapr_proto_common_v1_common_pb.Etag.AsObject,
        options?: dapr_proto_common_v1_common_pb.StateOptions.AsObject,

        metadataMap: Array<[string, string]>,
    }
}

export class DeleteBulkStateRequest extends jspb.Message { 
    getStoreName(): string;
    setStoreName(value: string): DeleteBulkStateRequest;
    clearStatesList(): void;
    getStatesList(): Array<dapr_proto_common_v1_common_pb.StateItem>;
    setStatesList(value: Array<dapr_proto_common_v1_common_pb.StateItem>): DeleteBulkStateRequest;
    addStates(value?: dapr_proto_common_v1_common_pb.StateItem, index?: number): dapr_proto_common_v1_common_pb.StateItem;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DeleteBulkStateRequest.AsObject;
    static toObject(includeInstance: boolean, msg: DeleteBulkStateRequest): DeleteBulkStateRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DeleteBulkStateRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DeleteBulkStateRequest;
    static deserializeBinaryFromReader(message: DeleteBulkStateRequest, reader: jspb.BinaryReader): DeleteBulkStateRequest;
}

export namespace DeleteBulkStateRequest {
    export type AsObject = {
        storeName: string,
        statesList: Array<dapr_proto_common_v1_common_pb.StateItem.AsObject>,
    }
}

export class SaveStateRequest extends jspb.Message { 
    getStoreName(): string;
    setStoreName(value: string): SaveStateRequest;
    clearStatesList(): void;
    getStatesList(): Array<dapr_proto_common_v1_common_pb.StateItem>;
    setStatesList(value: Array<dapr_proto_common_v1_common_pb.StateItem>): SaveStateRequest;
    addStates(value?: dapr_proto_common_v1_common_pb.StateItem, index?: number): dapr_proto_common_v1_common_pb.StateItem;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SaveStateRequest.AsObject;
    static toObject(includeInstance: boolean, msg: SaveStateRequest): SaveStateRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SaveStateRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SaveStateRequest;
    static deserializeBinaryFromReader(message: SaveStateRequest, reader: jspb.BinaryReader): SaveStateRequest;
}

export namespace SaveStateRequest {
    export type AsObject = {
        storeName: string,
        statesList: Array<dapr_proto_common_v1_common_pb.StateItem.AsObject>,
    }
}

export class QueryStateRequest extends jspb.Message { 
    getStoreName(): string;
    setStoreName(value: string): QueryStateRequest;
    getQuery(): string;
    setQuery(value: string): QueryStateRequest;

    getMetadataMap(): jspb.Map<string, string>;
    clearMetadataMap(): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): QueryStateRequest.AsObject;
    static toObject(includeInstance: boolean, msg: QueryStateRequest): QueryStateRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: QueryStateRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): QueryStateRequest;
    static deserializeBinaryFromReader(message: QueryStateRequest, reader: jspb.BinaryReader): QueryStateRequest;
}

export namespace QueryStateRequest {
    export type AsObject = {
        storeName: string,
        query: string,

        metadataMap: Array<[string, string]>,
    }
}

export class QueryStateItem extends jspb.Message { 
    getKey(): string;
    setKey(value: string): QueryStateItem;
    getData(): Uint8Array | string;
    getData_asU8(): Uint8Array;
    getData_asB64(): string;
    setData(value: Uint8Array | string): QueryStateItem;
    getEtag(): string;
    setEtag(value: string): QueryStateItem;
    getError(): string;
    setError(value: string): QueryStateItem;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): QueryStateItem.AsObject;
    static toObject(includeInstance: boolean, msg: QueryStateItem): QueryStateItem.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: QueryStateItem, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): QueryStateItem;
    static deserializeBinaryFromReader(message: QueryStateItem, reader: jspb.BinaryReader): QueryStateItem;
}

export namespace QueryStateItem {
    export type AsObject = {
        key: string,
        data: Uint8Array | string,
        etag: string,
        error: string,
    }
}

export class QueryStateResponse extends jspb.Message { 
    clearResultsList(): void;
    getResultsList(): Array<QueryStateItem>;
    setResultsList(value: Array<QueryStateItem>): QueryStateResponse;
    addResults(value?: QueryStateItem, index?: number): QueryStateItem;
    getToken(): string;
    setToken(value: string): QueryStateResponse;

    getMetadataMap(): jspb.Map<string, string>;
    clearMetadataMap(): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): QueryStateResponse.AsObject;
    static toObject(includeInstance: boolean, msg: QueryStateResponse): QueryStateResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: QueryStateResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): QueryStateResponse;
    static deserializeBinaryFromReader(message: QueryStateResponse, reader: jspb.BinaryReader): QueryStateResponse;
}

export namespace QueryStateResponse {
    export type AsObject = {
        resultsList: Array<QueryStateItem.AsObject>,
        token: string,

        metadataMap: Array<[string, string]>,
    }
}

export class PublishEventRequest extends jspb.Message { 
    getPubsubName(): string;
    setPubsubName(value: string): PublishEventRequest;
    getTopic(): string;
    setTopic(value: string): PublishEventRequest;
    getData(): Uint8Array | string;
    getData_asU8(): Uint8Array;
    getData_asB64(): string;
    setData(value: Uint8Array | string): PublishEventRequest;
    getDataContentType(): string;
    setDataContentType(value: string): PublishEventRequest;

    getMetadataMap(): jspb.Map<string, string>;
    clearMetadataMap(): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PublishEventRequest.AsObject;
    static toObject(includeInstance: boolean, msg: PublishEventRequest): PublishEventRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PublishEventRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PublishEventRequest;
    static deserializeBinaryFromReader(message: PublishEventRequest, reader: jspb.BinaryReader): PublishEventRequest;
}

export namespace PublishEventRequest {
    export type AsObject = {
        pubsubName: string,
        topic: string,
        data: Uint8Array | string,
        dataContentType: string,

        metadataMap: Array<[string, string]>,
    }
}

export class BulkPublishRequest extends jspb.Message { 
    getPubsubName(): string;
    setPubsubName(value: string): BulkPublishRequest;
    getTopic(): string;
    setTopic(value: string): BulkPublishRequest;
    clearEntriesList(): void;
    getEntriesList(): Array<BulkPublishRequestEntry>;
    setEntriesList(value: Array<BulkPublishRequestEntry>): BulkPublishRequest;
    addEntries(value?: BulkPublishRequestEntry, index?: number): BulkPublishRequestEntry;

    getMetadataMap(): jspb.Map<string, string>;
    clearMetadataMap(): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BulkPublishRequest.AsObject;
    static toObject(includeInstance: boolean, msg: BulkPublishRequest): BulkPublishRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: BulkPublishRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BulkPublishRequest;
    static deserializeBinaryFromReader(message: BulkPublishRequest, reader: jspb.BinaryReader): BulkPublishRequest;
}

export namespace BulkPublishRequest {
    export type AsObject = {
        pubsubName: string,
        topic: string,
        entriesList: Array<BulkPublishRequestEntry.AsObject>,

        metadataMap: Array<[string, string]>,
    }
}

export class BulkPublishRequestEntry extends jspb.Message { 
    getEntryId(): string;
    setEntryId(value: string): BulkPublishRequestEntry;
    getEvent(): Uint8Array | string;
    getEvent_asU8(): Uint8Array;
    getEvent_asB64(): string;
    setEvent(value: Uint8Array | string): BulkPublishRequestEntry;
    getContentType(): string;
    setContentType(value: string): BulkPublishRequestEntry;

    getMetadataMap(): jspb.Map<string, string>;
    clearMetadataMap(): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BulkPublishRequestEntry.AsObject;
    static toObject(includeInstance: boolean, msg: BulkPublishRequestEntry): BulkPublishRequestEntry.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: BulkPublishRequestEntry, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BulkPublishRequestEntry;
    static deserializeBinaryFromReader(message: BulkPublishRequestEntry, reader: jspb.BinaryReader): BulkPublishRequestEntry;
}

export namespace BulkPublishRequestEntry {
    export type AsObject = {
        entryId: string,
        event: Uint8Array | string,
        contentType: string,

        metadataMap: Array<[string, string]>,
    }
}

export class BulkPublishResponse extends jspb.Message { 
    clearFailedentriesList(): void;
    getFailedentriesList(): Array<BulkPublishResponseFailedEntry>;
    setFailedentriesList(value: Array<BulkPublishResponseFailedEntry>): BulkPublishResponse;
    addFailedentries(value?: BulkPublishResponseFailedEntry, index?: number): BulkPublishResponseFailedEntry;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BulkPublishResponse.AsObject;
    static toObject(includeInstance: boolean, msg: BulkPublishResponse): BulkPublishResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: BulkPublishResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BulkPublishResponse;
    static deserializeBinaryFromReader(message: BulkPublishResponse, reader: jspb.BinaryReader): BulkPublishResponse;
}

export namespace BulkPublishResponse {
    export type AsObject = {
        failedentriesList: Array<BulkPublishResponseFailedEntry.AsObject>,
    }
}

export class BulkPublishResponseFailedEntry extends jspb.Message { 
    getEntryId(): string;
    setEntryId(value: string): BulkPublishResponseFailedEntry;
    getError(): string;
    setError(value: string): BulkPublishResponseFailedEntry;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BulkPublishResponseFailedEntry.AsObject;
    static toObject(includeInstance: boolean, msg: BulkPublishResponseFailedEntry): BulkPublishResponseFailedEntry.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: BulkPublishResponseFailedEntry, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BulkPublishResponseFailedEntry;
    static deserializeBinaryFromReader(message: BulkPublishResponseFailedEntry, reader: jspb.BinaryReader): BulkPublishResponseFailedEntry;
}

export namespace BulkPublishResponseFailedEntry {
    export type AsObject = {
        entryId: string,
        error: string,
    }
}

export class SubscribeTopicEventsRequestAlpha1 extends jspb.Message { 

    hasInitialRequest(): boolean;
    clearInitialRequest(): void;
    getInitialRequest(): SubscribeTopicEventsRequestInitialAlpha1 | undefined;
    setInitialRequest(value?: SubscribeTopicEventsRequestInitialAlpha1): SubscribeTopicEventsRequestAlpha1;

    hasEventProcessed(): boolean;
    clearEventProcessed(): void;
    getEventProcessed(): SubscribeTopicEventsRequestProcessedAlpha1 | undefined;
    setEventProcessed(value?: SubscribeTopicEventsRequestProcessedAlpha1): SubscribeTopicEventsRequestAlpha1;

    getSubscribeTopicEventsRequestTypeCase(): SubscribeTopicEventsRequestAlpha1.SubscribeTopicEventsRequestTypeCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SubscribeTopicEventsRequestAlpha1.AsObject;
    static toObject(includeInstance: boolean, msg: SubscribeTopicEventsRequestAlpha1): SubscribeTopicEventsRequestAlpha1.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SubscribeTopicEventsRequestAlpha1, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SubscribeTopicEventsRequestAlpha1;
    static deserializeBinaryFromReader(message: SubscribeTopicEventsRequestAlpha1, reader: jspb.BinaryReader): SubscribeTopicEventsRequestAlpha1;
}

export namespace SubscribeTopicEventsRequestAlpha1 {
    export type AsObject = {
        initialRequest?: SubscribeTopicEventsRequestInitialAlpha1.AsObject,
        eventProcessed?: SubscribeTopicEventsRequestProcessedAlpha1.AsObject,
    }

    export enum SubscribeTopicEventsRequestTypeCase {
        SUBSCRIBE_TOPIC_EVENTS_REQUEST_TYPE_NOT_SET = 0,
        INITIAL_REQUEST = 1,
        EVENT_PROCESSED = 2,
    }

}

export class SubscribeTopicEventsRequestInitialAlpha1 extends jspb.Message { 
    getPubsubName(): string;
    setPubsubName(value: string): SubscribeTopicEventsRequestInitialAlpha1;
    getTopic(): string;
    setTopic(value: string): SubscribeTopicEventsRequestInitialAlpha1;

    getMetadataMap(): jspb.Map<string, string>;
    clearMetadataMap(): void;

    hasDeadLetterTopic(): boolean;
    clearDeadLetterTopic(): void;
    getDeadLetterTopic(): string | undefined;
    setDeadLetterTopic(value: string): SubscribeTopicEventsRequestInitialAlpha1;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SubscribeTopicEventsRequestInitialAlpha1.AsObject;
    static toObject(includeInstance: boolean, msg: SubscribeTopicEventsRequestInitialAlpha1): SubscribeTopicEventsRequestInitialAlpha1.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SubscribeTopicEventsRequestInitialAlpha1, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SubscribeTopicEventsRequestInitialAlpha1;
    static deserializeBinaryFromReader(message: SubscribeTopicEventsRequestInitialAlpha1, reader: jspb.BinaryReader): SubscribeTopicEventsRequestInitialAlpha1;
}

export namespace SubscribeTopicEventsRequestInitialAlpha1 {
    export type AsObject = {
        pubsubName: string,
        topic: string,

        metadataMap: Array<[string, string]>,
        deadLetterTopic?: string,
    }
}

export class SubscribeTopicEventsRequestProcessedAlpha1 extends jspb.Message { 
    getId(): string;
    setId(value: string): SubscribeTopicEventsRequestProcessedAlpha1;

    hasStatus(): boolean;
    clearStatus(): void;
    getStatus(): dapr_proto_runtime_v1_appcallback_pb.TopicEventResponse | undefined;
    setStatus(value?: dapr_proto_runtime_v1_appcallback_pb.TopicEventResponse): SubscribeTopicEventsRequestProcessedAlpha1;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SubscribeTopicEventsRequestProcessedAlpha1.AsObject;
    static toObject(includeInstance: boolean, msg: SubscribeTopicEventsRequestProcessedAlpha1): SubscribeTopicEventsRequestProcessedAlpha1.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SubscribeTopicEventsRequestProcessedAlpha1, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SubscribeTopicEventsRequestProcessedAlpha1;
    static deserializeBinaryFromReader(message: SubscribeTopicEventsRequestProcessedAlpha1, reader: jspb.BinaryReader): SubscribeTopicEventsRequestProcessedAlpha1;
}

export namespace SubscribeTopicEventsRequestProcessedAlpha1 {
    export type AsObject = {
        id: string,
        status?: dapr_proto_runtime_v1_appcallback_pb.TopicEventResponse.AsObject,
    }
}

export class SubscribeTopicEventsResponseAlpha1 extends jspb.Message { 

    hasInitialResponse(): boolean;
    clearInitialResponse(): void;
    getInitialResponse(): SubscribeTopicEventsResponseInitialAlpha1 | undefined;
    setInitialResponse(value?: SubscribeTopicEventsResponseInitialAlpha1): SubscribeTopicEventsResponseAlpha1;

    hasEventMessage(): boolean;
    clearEventMessage(): void;
    getEventMessage(): dapr_proto_runtime_v1_appcallback_pb.TopicEventRequest | undefined;
    setEventMessage(value?: dapr_proto_runtime_v1_appcallback_pb.TopicEventRequest): SubscribeTopicEventsResponseAlpha1;

    getSubscribeTopicEventsResponseTypeCase(): SubscribeTopicEventsResponseAlpha1.SubscribeTopicEventsResponseTypeCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SubscribeTopicEventsResponseAlpha1.AsObject;
    static toObject(includeInstance: boolean, msg: SubscribeTopicEventsResponseAlpha1): SubscribeTopicEventsResponseAlpha1.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SubscribeTopicEventsResponseAlpha1, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SubscribeTopicEventsResponseAlpha1;
    static deserializeBinaryFromReader(message: SubscribeTopicEventsResponseAlpha1, reader: jspb.BinaryReader): SubscribeTopicEventsResponseAlpha1;
}

export namespace SubscribeTopicEventsResponseAlpha1 {
    export type AsObject = {
        initialResponse?: SubscribeTopicEventsResponseInitialAlpha1.AsObject,
        eventMessage?: dapr_proto_runtime_v1_appcallback_pb.TopicEventRequest.AsObject,
    }

    export enum SubscribeTopicEventsResponseTypeCase {
        SUBSCRIBE_TOPIC_EVENTS_RESPONSE_TYPE_NOT_SET = 0,
        INITIAL_RESPONSE = 1,
        EVENT_MESSAGE = 2,
    }

}

export class SubscribeTopicEventsResponseInitialAlpha1 extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SubscribeTopicEventsResponseInitialAlpha1.AsObject;
    static toObject(includeInstance: boolean, msg: SubscribeTopicEventsResponseInitialAlpha1): SubscribeTopicEventsResponseInitialAlpha1.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SubscribeTopicEventsResponseInitialAlpha1, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SubscribeTopicEventsResponseInitialAlpha1;
    static deserializeBinaryFromReader(message: SubscribeTopicEventsResponseInitialAlpha1, reader: jspb.BinaryReader): SubscribeTopicEventsResponseInitialAlpha1;
}

export namespace SubscribeTopicEventsResponseInitialAlpha1 {
    export type AsObject = {
    }
}

export class InvokeBindingRequest extends jspb.Message { 
    getName(): string;
    setName(value: string): InvokeBindingRequest;
    getData(): Uint8Array | string;
    getData_asU8(): Uint8Array;
    getData_asB64(): string;
    setData(value: Uint8Array | string): InvokeBindingRequest;

    getMetadataMap(): jspb.Map<string, string>;
    clearMetadataMap(): void;
    getOperation(): string;
    setOperation(value: string): InvokeBindingRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): InvokeBindingRequest.AsObject;
    static toObject(includeInstance: boolean, msg: InvokeBindingRequest): InvokeBindingRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: InvokeBindingRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): InvokeBindingRequest;
    static deserializeBinaryFromReader(message: InvokeBindingRequest, reader: jspb.BinaryReader): InvokeBindingRequest;
}

export namespace InvokeBindingRequest {
    export type AsObject = {
        name: string,
        data: Uint8Array | string,

        metadataMap: Array<[string, string]>,
        operation: string,
    }
}

export class InvokeBindingResponse extends jspb.Message { 
    getData(): Uint8Array | string;
    getData_asU8(): Uint8Array;
    getData_asB64(): string;
    setData(value: Uint8Array | string): InvokeBindingResponse;

    getMetadataMap(): jspb.Map<string, string>;
    clearMetadataMap(): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): InvokeBindingResponse.AsObject;
    static toObject(includeInstance: boolean, msg: InvokeBindingResponse): InvokeBindingResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: InvokeBindingResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): InvokeBindingResponse;
    static deserializeBinaryFromReader(message: InvokeBindingResponse, reader: jspb.BinaryReader): InvokeBindingResponse;
}

export namespace InvokeBindingResponse {
    export type AsObject = {
        data: Uint8Array | string,

        metadataMap: Array<[string, string]>,
    }
}

export class GetSecretRequest extends jspb.Message { 
    getStoreName(): string;
    setStoreName(value: string): GetSecretRequest;
    getKey(): string;
    setKey(value: string): GetSecretRequest;

    getMetadataMap(): jspb.Map<string, string>;
    clearMetadataMap(): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetSecretRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetSecretRequest): GetSecretRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetSecretRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetSecretRequest;
    static deserializeBinaryFromReader(message: GetSecretRequest, reader: jspb.BinaryReader): GetSecretRequest;
}

export namespace GetSecretRequest {
    export type AsObject = {
        storeName: string,
        key: string,

        metadataMap: Array<[string, string]>,
    }
}

export class GetSecretResponse extends jspb.Message { 

    getDataMap(): jspb.Map<string, string>;
    clearDataMap(): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetSecretResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetSecretResponse): GetSecretResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetSecretResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetSecretResponse;
    static deserializeBinaryFromReader(message: GetSecretResponse, reader: jspb.BinaryReader): GetSecretResponse;
}

export namespace GetSecretResponse {
    export type AsObject = {

        dataMap: Array<[string, string]>,
    }
}

export class GetBulkSecretRequest extends jspb.Message { 
    getStoreName(): string;
    setStoreName(value: string): GetBulkSecretRequest;

    getMetadataMap(): jspb.Map<string, string>;
    clearMetadataMap(): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetBulkSecretRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetBulkSecretRequest): GetBulkSecretRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetBulkSecretRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetBulkSecretRequest;
    static deserializeBinaryFromReader(message: GetBulkSecretRequest, reader: jspb.BinaryReader): GetBulkSecretRequest;
}

export namespace GetBulkSecretRequest {
    export type AsObject = {
        storeName: string,

        metadataMap: Array<[string, string]>,
    }
}

export class SecretResponse extends jspb.Message { 

    getSecretsMap(): jspb.Map<string, string>;
    clearSecretsMap(): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SecretResponse.AsObject;
    static toObject(includeInstance: boolean, msg: SecretResponse): SecretResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SecretResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SecretResponse;
    static deserializeBinaryFromReader(message: SecretResponse, reader: jspb.BinaryReader): SecretResponse;
}

export namespace SecretResponse {
    export type AsObject = {

        secretsMap: Array<[string, string]>,
    }
}

export class GetBulkSecretResponse extends jspb.Message { 

    getDataMap(): jspb.Map<string, SecretResponse>;
    clearDataMap(): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetBulkSecretResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetBulkSecretResponse): GetBulkSecretResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetBulkSecretResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetBulkSecretResponse;
    static deserializeBinaryFromReader(message: GetBulkSecretResponse, reader: jspb.BinaryReader): GetBulkSecretResponse;
}

export namespace GetBulkSecretResponse {
    export type AsObject = {

        dataMap: Array<[string, SecretResponse.AsObject]>,
    }
}

export class TransactionalStateOperation extends jspb.Message { 
    getOperationtype(): string;
    setOperationtype(value: string): TransactionalStateOperation;

    hasRequest(): boolean;
    clearRequest(): void;
    getRequest(): dapr_proto_common_v1_common_pb.StateItem | undefined;
    setRequest(value?: dapr_proto_common_v1_common_pb.StateItem): TransactionalStateOperation;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TransactionalStateOperation.AsObject;
    static toObject(includeInstance: boolean, msg: TransactionalStateOperation): TransactionalStateOperation.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TransactionalStateOperation, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TransactionalStateOperation;
    static deserializeBinaryFromReader(message: TransactionalStateOperation, reader: jspb.BinaryReader): TransactionalStateOperation;
}

export namespace TransactionalStateOperation {
    export type AsObject = {
        operationtype: string,
        request?: dapr_proto_common_v1_common_pb.StateItem.AsObject,
    }
}

export class ExecuteStateTransactionRequest extends jspb.Message { 
    getStorename(): string;
    setStorename(value: string): ExecuteStateTransactionRequest;
    clearOperationsList(): void;
    getOperationsList(): Array<TransactionalStateOperation>;
    setOperationsList(value: Array<TransactionalStateOperation>): ExecuteStateTransactionRequest;
    addOperations(value?: TransactionalStateOperation, index?: number): TransactionalStateOperation;

    getMetadataMap(): jspb.Map<string, string>;
    clearMetadataMap(): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ExecuteStateTransactionRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ExecuteStateTransactionRequest): ExecuteStateTransactionRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ExecuteStateTransactionRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ExecuteStateTransactionRequest;
    static deserializeBinaryFromReader(message: ExecuteStateTransactionRequest, reader: jspb.BinaryReader): ExecuteStateTransactionRequest;
}

export namespace ExecuteStateTransactionRequest {
    export type AsObject = {
        storename: string,
        operationsList: Array<TransactionalStateOperation.AsObject>,

        metadataMap: Array<[string, string]>,
    }
}

export class RegisterActorTimerRequest extends jspb.Message { 
    getActorType(): string;
    setActorType(value: string): RegisterActorTimerRequest;
    getActorId(): string;
    setActorId(value: string): RegisterActorTimerRequest;
    getName(): string;
    setName(value: string): RegisterActorTimerRequest;
    getDueTime(): string;
    setDueTime(value: string): RegisterActorTimerRequest;
    getPeriod(): string;
    setPeriod(value: string): RegisterActorTimerRequest;
    getCallback(): string;
    setCallback(value: string): RegisterActorTimerRequest;
    getData(): Uint8Array | string;
    getData_asU8(): Uint8Array;
    getData_asB64(): string;
    setData(value: Uint8Array | string): RegisterActorTimerRequest;
    getTtl(): string;
    setTtl(value: string): RegisterActorTimerRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RegisterActorTimerRequest.AsObject;
    static toObject(includeInstance: boolean, msg: RegisterActorTimerRequest): RegisterActorTimerRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RegisterActorTimerRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RegisterActorTimerRequest;
    static deserializeBinaryFromReader(message: RegisterActorTimerRequest, reader: jspb.BinaryReader): RegisterActorTimerRequest;
}

export namespace RegisterActorTimerRequest {
    export type AsObject = {
        actorType: string,
        actorId: string,
        name: string,
        dueTime: string,
        period: string,
        callback: string,
        data: Uint8Array | string,
        ttl: string,
    }
}

export class UnregisterActorTimerRequest extends jspb.Message { 
    getActorType(): string;
    setActorType(value: string): UnregisterActorTimerRequest;
    getActorId(): string;
    setActorId(value: string): UnregisterActorTimerRequest;
    getName(): string;
    setName(value: string): UnregisterActorTimerRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UnregisterActorTimerRequest.AsObject;
    static toObject(includeInstance: boolean, msg: UnregisterActorTimerRequest): UnregisterActorTimerRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UnregisterActorTimerRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UnregisterActorTimerRequest;
    static deserializeBinaryFromReader(message: UnregisterActorTimerRequest, reader: jspb.BinaryReader): UnregisterActorTimerRequest;
}

export namespace UnregisterActorTimerRequest {
    export type AsObject = {
        actorType: string,
        actorId: string,
        name: string,
    }
}

export class RegisterActorReminderRequest extends jspb.Message { 
    getActorType(): string;
    setActorType(value: string): RegisterActorReminderRequest;
    getActorId(): string;
    setActorId(value: string): RegisterActorReminderRequest;
    getName(): string;
    setName(value: string): RegisterActorReminderRequest;
    getDueTime(): string;
    setDueTime(value: string): RegisterActorReminderRequest;
    getPeriod(): string;
    setPeriod(value: string): RegisterActorReminderRequest;
    getData(): Uint8Array | string;
    getData_asU8(): Uint8Array;
    getData_asB64(): string;
    setData(value: Uint8Array | string): RegisterActorReminderRequest;
    getTtl(): string;
    setTtl(value: string): RegisterActorReminderRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RegisterActorReminderRequest.AsObject;
    static toObject(includeInstance: boolean, msg: RegisterActorReminderRequest): RegisterActorReminderRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RegisterActorReminderRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RegisterActorReminderRequest;
    static deserializeBinaryFromReader(message: RegisterActorReminderRequest, reader: jspb.BinaryReader): RegisterActorReminderRequest;
}

export namespace RegisterActorReminderRequest {
    export type AsObject = {
        actorType: string,
        actorId: string,
        name: string,
        dueTime: string,
        period: string,
        data: Uint8Array | string,
        ttl: string,
    }
}

export class UnregisterActorReminderRequest extends jspb.Message { 
    getActorType(): string;
    setActorType(value: string): UnregisterActorReminderRequest;
    getActorId(): string;
    setActorId(value: string): UnregisterActorReminderRequest;
    getName(): string;
    setName(value: string): UnregisterActorReminderRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UnregisterActorReminderRequest.AsObject;
    static toObject(includeInstance: boolean, msg: UnregisterActorReminderRequest): UnregisterActorReminderRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UnregisterActorReminderRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UnregisterActorReminderRequest;
    static deserializeBinaryFromReader(message: UnregisterActorReminderRequest, reader: jspb.BinaryReader): UnregisterActorReminderRequest;
}

export namespace UnregisterActorReminderRequest {
    export type AsObject = {
        actorType: string,
        actorId: string,
        name: string,
    }
}

export class GetActorStateRequest extends jspb.Message { 
    getActorType(): string;
    setActorType(value: string): GetActorStateRequest;
    getActorId(): string;
    setActorId(value: string): GetActorStateRequest;
    getKey(): string;
    setKey(value: string): GetActorStateRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetActorStateRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetActorStateRequest): GetActorStateRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetActorStateRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetActorStateRequest;
    static deserializeBinaryFromReader(message: GetActorStateRequest, reader: jspb.BinaryReader): GetActorStateRequest;
}

export namespace GetActorStateRequest {
    export type AsObject = {
        actorType: string,
        actorId: string,
        key: string,
    }
}

export class GetActorStateResponse extends jspb.Message { 
    getData(): Uint8Array | string;
    getData_asU8(): Uint8Array;
    getData_asB64(): string;
    setData(value: Uint8Array | string): GetActorStateResponse;

    getMetadataMap(): jspb.Map<string, string>;
    clearMetadataMap(): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetActorStateResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetActorStateResponse): GetActorStateResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetActorStateResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetActorStateResponse;
    static deserializeBinaryFromReader(message: GetActorStateResponse, reader: jspb.BinaryReader): GetActorStateResponse;
}

export namespace GetActorStateResponse {
    export type AsObject = {
        data: Uint8Array | string,

        metadataMap: Array<[string, string]>,
    }
}

export class ExecuteActorStateTransactionRequest extends jspb.Message { 
    getActorType(): string;
    setActorType(value: string): ExecuteActorStateTransactionRequest;
    getActorId(): string;
    setActorId(value: string): ExecuteActorStateTransactionRequest;
    clearOperationsList(): void;
    getOperationsList(): Array<TransactionalActorStateOperation>;
    setOperationsList(value: Array<TransactionalActorStateOperation>): ExecuteActorStateTransactionRequest;
    addOperations(value?: TransactionalActorStateOperation, index?: number): TransactionalActorStateOperation;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ExecuteActorStateTransactionRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ExecuteActorStateTransactionRequest): ExecuteActorStateTransactionRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ExecuteActorStateTransactionRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ExecuteActorStateTransactionRequest;
    static deserializeBinaryFromReader(message: ExecuteActorStateTransactionRequest, reader: jspb.BinaryReader): ExecuteActorStateTransactionRequest;
}

export namespace ExecuteActorStateTransactionRequest {
    export type AsObject = {
        actorType: string,
        actorId: string,
        operationsList: Array<TransactionalActorStateOperation.AsObject>,
    }
}

export class TransactionalActorStateOperation extends jspb.Message { 
    getOperationtype(): string;
    setOperationtype(value: string): TransactionalActorStateOperation;
    getKey(): string;
    setKey(value: string): TransactionalActorStateOperation;

    hasValue(): boolean;
    clearValue(): void;
    getValue(): google_protobuf_any_pb.Any | undefined;
    setValue(value?: google_protobuf_any_pb.Any): TransactionalActorStateOperation;

    getMetadataMap(): jspb.Map<string, string>;
    clearMetadataMap(): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TransactionalActorStateOperation.AsObject;
    static toObject(includeInstance: boolean, msg: TransactionalActorStateOperation): TransactionalActorStateOperation.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TransactionalActorStateOperation, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TransactionalActorStateOperation;
    static deserializeBinaryFromReader(message: TransactionalActorStateOperation, reader: jspb.BinaryReader): TransactionalActorStateOperation;
}

export namespace TransactionalActorStateOperation {
    export type AsObject = {
        operationtype: string,
        key: string,
        value?: google_protobuf_any_pb.Any.AsObject,

        metadataMap: Array<[string, string]>,
    }
}

export class InvokeActorRequest extends jspb.Message { 
    getActorType(): string;
    setActorType(value: string): InvokeActorRequest;
    getActorId(): string;
    setActorId(value: string): InvokeActorRequest;
    getMethod(): string;
    setMethod(value: string): InvokeActorRequest;
    getData(): Uint8Array | string;
    getData_asU8(): Uint8Array;
    getData_asB64(): string;
    setData(value: Uint8Array | string): InvokeActorRequest;

    getMetadataMap(): jspb.Map<string, string>;
    clearMetadataMap(): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): InvokeActorRequest.AsObject;
    static toObject(includeInstance: boolean, msg: InvokeActorRequest): InvokeActorRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: InvokeActorRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): InvokeActorRequest;
    static deserializeBinaryFromReader(message: InvokeActorRequest, reader: jspb.BinaryReader): InvokeActorRequest;
}

export namespace InvokeActorRequest {
    export type AsObject = {
        actorType: string,
        actorId: string,
        method: string,
        data: Uint8Array | string,

        metadataMap: Array<[string, string]>,
    }
}

export class InvokeActorResponse extends jspb.Message { 
    getData(): Uint8Array | string;
    getData_asU8(): Uint8Array;
    getData_asB64(): string;
    setData(value: Uint8Array | string): InvokeActorResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): InvokeActorResponse.AsObject;
    static toObject(includeInstance: boolean, msg: InvokeActorResponse): InvokeActorResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: InvokeActorResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): InvokeActorResponse;
    static deserializeBinaryFromReader(message: InvokeActorResponse, reader: jspb.BinaryReader): InvokeActorResponse;
}

export namespace InvokeActorResponse {
    export type AsObject = {
        data: Uint8Array | string,
    }
}

export class GetMetadataRequest extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetMetadataRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetMetadataRequest): GetMetadataRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetMetadataRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetMetadataRequest;
    static deserializeBinaryFromReader(message: GetMetadataRequest, reader: jspb.BinaryReader): GetMetadataRequest;
}

export namespace GetMetadataRequest {
    export type AsObject = {
    }
}

export class GetMetadataResponse extends jspb.Message { 
    getId(): string;
    setId(value: string): GetMetadataResponse;
    clearActiveActorsCountList(): void;
    getActiveActorsCountList(): Array<ActiveActorsCount>;
    setActiveActorsCountList(value: Array<ActiveActorsCount>): GetMetadataResponse;
    addActiveActorsCount(value?: ActiveActorsCount, index?: number): ActiveActorsCount;
    clearRegisteredComponentsList(): void;
    getRegisteredComponentsList(): Array<RegisteredComponents>;
    setRegisteredComponentsList(value: Array<RegisteredComponents>): GetMetadataResponse;
    addRegisteredComponents(value?: RegisteredComponents, index?: number): RegisteredComponents;

    getExtendedMetadataMap(): jspb.Map<string, string>;
    clearExtendedMetadataMap(): void;
    clearSubscriptionsList(): void;
    getSubscriptionsList(): Array<PubsubSubscription>;
    setSubscriptionsList(value: Array<PubsubSubscription>): GetMetadataResponse;
    addSubscriptions(value?: PubsubSubscription, index?: number): PubsubSubscription;
    clearHttpEndpointsList(): void;
    getHttpEndpointsList(): Array<MetadataHTTPEndpoint>;
    setHttpEndpointsList(value: Array<MetadataHTTPEndpoint>): GetMetadataResponse;
    addHttpEndpoints(value?: MetadataHTTPEndpoint, index?: number): MetadataHTTPEndpoint;

    hasAppConnectionProperties(): boolean;
    clearAppConnectionProperties(): void;
    getAppConnectionProperties(): AppConnectionProperties | undefined;
    setAppConnectionProperties(value?: AppConnectionProperties): GetMetadataResponse;
    getRuntimeVersion(): string;
    setRuntimeVersion(value: string): GetMetadataResponse;
    clearEnabledFeaturesList(): void;
    getEnabledFeaturesList(): Array<string>;
    setEnabledFeaturesList(value: Array<string>): GetMetadataResponse;
    addEnabledFeatures(value: string, index?: number): string;

    hasActorRuntime(): boolean;
    clearActorRuntime(): void;
    getActorRuntime(): ActorRuntime | undefined;
    setActorRuntime(value?: ActorRuntime): GetMetadataResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetMetadataResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetMetadataResponse): GetMetadataResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetMetadataResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetMetadataResponse;
    static deserializeBinaryFromReader(message: GetMetadataResponse, reader: jspb.BinaryReader): GetMetadataResponse;
}

export namespace GetMetadataResponse {
    export type AsObject = {
        id: string,
        activeActorsCountList: Array<ActiveActorsCount.AsObject>,
        registeredComponentsList: Array<RegisteredComponents.AsObject>,

        extendedMetadataMap: Array<[string, string]>,
        subscriptionsList: Array<PubsubSubscription.AsObject>,
        httpEndpointsList: Array<MetadataHTTPEndpoint.AsObject>,
        appConnectionProperties?: AppConnectionProperties.AsObject,
        runtimeVersion: string,
        enabledFeaturesList: Array<string>,
        actorRuntime?: ActorRuntime.AsObject,
    }
}

export class ActorRuntime extends jspb.Message { 
    getRuntimeStatus(): ActorRuntime.ActorRuntimeStatus;
    setRuntimeStatus(value: ActorRuntime.ActorRuntimeStatus): ActorRuntime;
    clearActiveActorsList(): void;
    getActiveActorsList(): Array<ActiveActorsCount>;
    setActiveActorsList(value: Array<ActiveActorsCount>): ActorRuntime;
    addActiveActors(value?: ActiveActorsCount, index?: number): ActiveActorsCount;
    getHostReady(): boolean;
    setHostReady(value: boolean): ActorRuntime;
    getPlacement(): string;
    setPlacement(value: string): ActorRuntime;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ActorRuntime.AsObject;
    static toObject(includeInstance: boolean, msg: ActorRuntime): ActorRuntime.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ActorRuntime, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ActorRuntime;
    static deserializeBinaryFromReader(message: ActorRuntime, reader: jspb.BinaryReader): ActorRuntime;
}

export namespace ActorRuntime {
    export type AsObject = {
        runtimeStatus: ActorRuntime.ActorRuntimeStatus,
        activeActorsList: Array<ActiveActorsCount.AsObject>,
        hostReady: boolean,
        placement: string,
    }

    export enum ActorRuntimeStatus {
    INITIALIZING = 0,
    DISABLED = 1,
    RUNNING = 2,
    }

}

export class ActiveActorsCount extends jspb.Message { 
    getType(): string;
    setType(value: string): ActiveActorsCount;
    getCount(): number;
    setCount(value: number): ActiveActorsCount;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ActiveActorsCount.AsObject;
    static toObject(includeInstance: boolean, msg: ActiveActorsCount): ActiveActorsCount.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ActiveActorsCount, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ActiveActorsCount;
    static deserializeBinaryFromReader(message: ActiveActorsCount, reader: jspb.BinaryReader): ActiveActorsCount;
}

export namespace ActiveActorsCount {
    export type AsObject = {
        type: string,
        count: number,
    }
}

export class RegisteredComponents extends jspb.Message { 
    getName(): string;
    setName(value: string): RegisteredComponents;
    getType(): string;
    setType(value: string): RegisteredComponents;
    getVersion(): string;
    setVersion(value: string): RegisteredComponents;
    clearCapabilitiesList(): void;
    getCapabilitiesList(): Array<string>;
    setCapabilitiesList(value: Array<string>): RegisteredComponents;
    addCapabilities(value: string, index?: number): string;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RegisteredComponents.AsObject;
    static toObject(includeInstance: boolean, msg: RegisteredComponents): RegisteredComponents.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RegisteredComponents, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RegisteredComponents;
    static deserializeBinaryFromReader(message: RegisteredComponents, reader: jspb.BinaryReader): RegisteredComponents;
}

export namespace RegisteredComponents {
    export type AsObject = {
        name: string,
        type: string,
        version: string,
        capabilitiesList: Array<string>,
    }
}

export class MetadataHTTPEndpoint extends jspb.Message { 
    getName(): string;
    setName(value: string): MetadataHTTPEndpoint;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): MetadataHTTPEndpoint.AsObject;
    static toObject(includeInstance: boolean, msg: MetadataHTTPEndpoint): MetadataHTTPEndpoint.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: MetadataHTTPEndpoint, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): MetadataHTTPEndpoint;
    static deserializeBinaryFromReader(message: MetadataHTTPEndpoint, reader: jspb.BinaryReader): MetadataHTTPEndpoint;
}

export namespace MetadataHTTPEndpoint {
    export type AsObject = {
        name: string,
    }
}

export class AppConnectionProperties extends jspb.Message { 
    getPort(): number;
    setPort(value: number): AppConnectionProperties;
    getProtocol(): string;
    setProtocol(value: string): AppConnectionProperties;
    getChannelAddress(): string;
    setChannelAddress(value: string): AppConnectionProperties;
    getMaxConcurrency(): number;
    setMaxConcurrency(value: number): AppConnectionProperties;

    hasHealth(): boolean;
    clearHealth(): void;
    getHealth(): AppConnectionHealthProperties | undefined;
    setHealth(value?: AppConnectionHealthProperties): AppConnectionProperties;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AppConnectionProperties.AsObject;
    static toObject(includeInstance: boolean, msg: AppConnectionProperties): AppConnectionProperties.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: AppConnectionProperties, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): AppConnectionProperties;
    static deserializeBinaryFromReader(message: AppConnectionProperties, reader: jspb.BinaryReader): AppConnectionProperties;
}

export namespace AppConnectionProperties {
    export type AsObject = {
        port: number,
        protocol: string,
        channelAddress: string,
        maxConcurrency: number,
        health?: AppConnectionHealthProperties.AsObject,
    }
}

export class AppConnectionHealthProperties extends jspb.Message { 
    getHealthCheckPath(): string;
    setHealthCheckPath(value: string): AppConnectionHealthProperties;
    getHealthProbeInterval(): string;
    setHealthProbeInterval(value: string): AppConnectionHealthProperties;
    getHealthProbeTimeout(): string;
    setHealthProbeTimeout(value: string): AppConnectionHealthProperties;
    getHealthThreshold(): number;
    setHealthThreshold(value: number): AppConnectionHealthProperties;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AppConnectionHealthProperties.AsObject;
    static toObject(includeInstance: boolean, msg: AppConnectionHealthProperties): AppConnectionHealthProperties.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: AppConnectionHealthProperties, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): AppConnectionHealthProperties;
    static deserializeBinaryFromReader(message: AppConnectionHealthProperties, reader: jspb.BinaryReader): AppConnectionHealthProperties;
}

export namespace AppConnectionHealthProperties {
    export type AsObject = {
        healthCheckPath: string,
        healthProbeInterval: string,
        healthProbeTimeout: string,
        healthThreshold: number,
    }
}

export class PubsubSubscription extends jspb.Message { 
    getPubsubName(): string;
    setPubsubName(value: string): PubsubSubscription;
    getTopic(): string;
    setTopic(value: string): PubsubSubscription;

    getMetadataMap(): jspb.Map<string, string>;
    clearMetadataMap(): void;

    hasRules(): boolean;
    clearRules(): void;
    getRules(): PubsubSubscriptionRules | undefined;
    setRules(value?: PubsubSubscriptionRules): PubsubSubscription;
    getDeadLetterTopic(): string;
    setDeadLetterTopic(value: string): PubsubSubscription;
    getType(): PubsubSubscriptionType;
    setType(value: PubsubSubscriptionType): PubsubSubscription;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PubsubSubscription.AsObject;
    static toObject(includeInstance: boolean, msg: PubsubSubscription): PubsubSubscription.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PubsubSubscription, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PubsubSubscription;
    static deserializeBinaryFromReader(message: PubsubSubscription, reader: jspb.BinaryReader): PubsubSubscription;
}

export namespace PubsubSubscription {
    export type AsObject = {
        pubsubName: string,
        topic: string,

        metadataMap: Array<[string, string]>,
        rules?: PubsubSubscriptionRules.AsObject,
        deadLetterTopic: string,
        type: PubsubSubscriptionType,
    }
}

export class PubsubSubscriptionRules extends jspb.Message { 
    clearRulesList(): void;
    getRulesList(): Array<PubsubSubscriptionRule>;
    setRulesList(value: Array<PubsubSubscriptionRule>): PubsubSubscriptionRules;
    addRules(value?: PubsubSubscriptionRule, index?: number): PubsubSubscriptionRule;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PubsubSubscriptionRules.AsObject;
    static toObject(includeInstance: boolean, msg: PubsubSubscriptionRules): PubsubSubscriptionRules.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PubsubSubscriptionRules, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PubsubSubscriptionRules;
    static deserializeBinaryFromReader(message: PubsubSubscriptionRules, reader: jspb.BinaryReader): PubsubSubscriptionRules;
}

export namespace PubsubSubscriptionRules {
    export type AsObject = {
        rulesList: Array<PubsubSubscriptionRule.AsObject>,
    }
}

export class PubsubSubscriptionRule extends jspb.Message { 
    getMatch(): string;
    setMatch(value: string): PubsubSubscriptionRule;
    getPath(): string;
    setPath(value: string): PubsubSubscriptionRule;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PubsubSubscriptionRule.AsObject;
    static toObject(includeInstance: boolean, msg: PubsubSubscriptionRule): PubsubSubscriptionRule.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PubsubSubscriptionRule, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PubsubSubscriptionRule;
    static deserializeBinaryFromReader(message: PubsubSubscriptionRule, reader: jspb.BinaryReader): PubsubSubscriptionRule;
}

export namespace PubsubSubscriptionRule {
    export type AsObject = {
        match: string,
        path: string,
    }
}

export class SetMetadataRequest extends jspb.Message { 
    getKey(): string;
    setKey(value: string): SetMetadataRequest;
    getValue(): string;
    setValue(value: string): SetMetadataRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SetMetadataRequest.AsObject;
    static toObject(includeInstance: boolean, msg: SetMetadataRequest): SetMetadataRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SetMetadataRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SetMetadataRequest;
    static deserializeBinaryFromReader(message: SetMetadataRequest, reader: jspb.BinaryReader): SetMetadataRequest;
}

export namespace SetMetadataRequest {
    export type AsObject = {
        key: string,
        value: string,
    }
}

export class GetConfigurationRequest extends jspb.Message { 
    getStoreName(): string;
    setStoreName(value: string): GetConfigurationRequest;
    clearKeysList(): void;
    getKeysList(): Array<string>;
    setKeysList(value: Array<string>): GetConfigurationRequest;
    addKeys(value: string, index?: number): string;

    getMetadataMap(): jspb.Map<string, string>;
    clearMetadataMap(): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetConfigurationRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetConfigurationRequest): GetConfigurationRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetConfigurationRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetConfigurationRequest;
    static deserializeBinaryFromReader(message: GetConfigurationRequest, reader: jspb.BinaryReader): GetConfigurationRequest;
}

export namespace GetConfigurationRequest {
    export type AsObject = {
        storeName: string,
        keysList: Array<string>,

        metadataMap: Array<[string, string]>,
    }
}

export class GetConfigurationResponse extends jspb.Message { 

    getItemsMap(): jspb.Map<string, dapr_proto_common_v1_common_pb.ConfigurationItem>;
    clearItemsMap(): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetConfigurationResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetConfigurationResponse): GetConfigurationResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetConfigurationResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetConfigurationResponse;
    static deserializeBinaryFromReader(message: GetConfigurationResponse, reader: jspb.BinaryReader): GetConfigurationResponse;
}

export namespace GetConfigurationResponse {
    export type AsObject = {

        itemsMap: Array<[string, dapr_proto_common_v1_common_pb.ConfigurationItem.AsObject]>,
    }
}

export class SubscribeConfigurationRequest extends jspb.Message { 
    getStoreName(): string;
    setStoreName(value: string): SubscribeConfigurationRequest;
    clearKeysList(): void;
    getKeysList(): Array<string>;
    setKeysList(value: Array<string>): SubscribeConfigurationRequest;
    addKeys(value: string, index?: number): string;

    getMetadataMap(): jspb.Map<string, string>;
    clearMetadataMap(): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SubscribeConfigurationRequest.AsObject;
    static toObject(includeInstance: boolean, msg: SubscribeConfigurationRequest): SubscribeConfigurationRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SubscribeConfigurationRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SubscribeConfigurationRequest;
    static deserializeBinaryFromReader(message: SubscribeConfigurationRequest, reader: jspb.BinaryReader): SubscribeConfigurationRequest;
}

export namespace SubscribeConfigurationRequest {
    export type AsObject = {
        storeName: string,
        keysList: Array<string>,

        metadataMap: Array<[string, string]>,
    }
}

export class UnsubscribeConfigurationRequest extends jspb.Message { 
    getStoreName(): string;
    setStoreName(value: string): UnsubscribeConfigurationRequest;
    getId(): string;
    setId(value: string): UnsubscribeConfigurationRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UnsubscribeConfigurationRequest.AsObject;
    static toObject(includeInstance: boolean, msg: UnsubscribeConfigurationRequest): UnsubscribeConfigurationRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UnsubscribeConfigurationRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UnsubscribeConfigurationRequest;
    static deserializeBinaryFromReader(message: UnsubscribeConfigurationRequest, reader: jspb.BinaryReader): UnsubscribeConfigurationRequest;
}

export namespace UnsubscribeConfigurationRequest {
    export type AsObject = {
        storeName: string,
        id: string,
    }
}

export class SubscribeConfigurationResponse extends jspb.Message { 
    getId(): string;
    setId(value: string): SubscribeConfigurationResponse;

    getItemsMap(): jspb.Map<string, dapr_proto_common_v1_common_pb.ConfigurationItem>;
    clearItemsMap(): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SubscribeConfigurationResponse.AsObject;
    static toObject(includeInstance: boolean, msg: SubscribeConfigurationResponse): SubscribeConfigurationResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SubscribeConfigurationResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SubscribeConfigurationResponse;
    static deserializeBinaryFromReader(message: SubscribeConfigurationResponse, reader: jspb.BinaryReader): SubscribeConfigurationResponse;
}

export namespace SubscribeConfigurationResponse {
    export type AsObject = {
        id: string,

        itemsMap: Array<[string, dapr_proto_common_v1_common_pb.ConfigurationItem.AsObject]>,
    }
}

export class UnsubscribeConfigurationResponse extends jspb.Message { 
    getOk(): boolean;
    setOk(value: boolean): UnsubscribeConfigurationResponse;
    getMessage(): string;
    setMessage(value: string): UnsubscribeConfigurationResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UnsubscribeConfigurationResponse.AsObject;
    static toObject(includeInstance: boolean, msg: UnsubscribeConfigurationResponse): UnsubscribeConfigurationResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UnsubscribeConfigurationResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UnsubscribeConfigurationResponse;
    static deserializeBinaryFromReader(message: UnsubscribeConfigurationResponse, reader: jspb.BinaryReader): UnsubscribeConfigurationResponse;
}

export namespace UnsubscribeConfigurationResponse {
    export type AsObject = {
        ok: boolean,
        message: string,
    }
}

export class TryLockRequest extends jspb.Message { 
    getStoreName(): string;
    setStoreName(value: string): TryLockRequest;
    getResourceId(): string;
    setResourceId(value: string): TryLockRequest;
    getLockOwner(): string;
    setLockOwner(value: string): TryLockRequest;
    getExpiryInSeconds(): number;
    setExpiryInSeconds(value: number): TryLockRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TryLockRequest.AsObject;
    static toObject(includeInstance: boolean, msg: TryLockRequest): TryLockRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TryLockRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TryLockRequest;
    static deserializeBinaryFromReader(message: TryLockRequest, reader: jspb.BinaryReader): TryLockRequest;
}

export namespace TryLockRequest {
    export type AsObject = {
        storeName: string,
        resourceId: string,
        lockOwner: string,
        expiryInSeconds: number,
    }
}

export class TryLockResponse extends jspb.Message { 
    getSuccess(): boolean;
    setSuccess(value: boolean): TryLockResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TryLockResponse.AsObject;
    static toObject(includeInstance: boolean, msg: TryLockResponse): TryLockResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TryLockResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TryLockResponse;
    static deserializeBinaryFromReader(message: TryLockResponse, reader: jspb.BinaryReader): TryLockResponse;
}

export namespace TryLockResponse {
    export type AsObject = {
        success: boolean,
    }
}

export class UnlockRequest extends jspb.Message { 
    getStoreName(): string;
    setStoreName(value: string): UnlockRequest;
    getResourceId(): string;
    setResourceId(value: string): UnlockRequest;
    getLockOwner(): string;
    setLockOwner(value: string): UnlockRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UnlockRequest.AsObject;
    static toObject(includeInstance: boolean, msg: UnlockRequest): UnlockRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UnlockRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UnlockRequest;
    static deserializeBinaryFromReader(message: UnlockRequest, reader: jspb.BinaryReader): UnlockRequest;
}

export namespace UnlockRequest {
    export type AsObject = {
        storeName: string,
        resourceId: string,
        lockOwner: string,
    }
}

export class UnlockResponse extends jspb.Message { 
    getStatus(): UnlockResponse.Status;
    setStatus(value: UnlockResponse.Status): UnlockResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UnlockResponse.AsObject;
    static toObject(includeInstance: boolean, msg: UnlockResponse): UnlockResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UnlockResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UnlockResponse;
    static deserializeBinaryFromReader(message: UnlockResponse, reader: jspb.BinaryReader): UnlockResponse;
}

export namespace UnlockResponse {
    export type AsObject = {
        status: UnlockResponse.Status,
    }

    export enum Status {
    SUCCESS = 0,
    LOCK_DOES_NOT_EXIST = 1,
    LOCK_BELONGS_TO_OTHERS = 2,
    INTERNAL_ERROR = 3,
    }

}

export class SubtleGetKeyRequest extends jspb.Message { 
    getComponentName(): string;
    setComponentName(value: string): SubtleGetKeyRequest;
    getName(): string;
    setName(value: string): SubtleGetKeyRequest;
    getFormat(): SubtleGetKeyRequest.KeyFormat;
    setFormat(value: SubtleGetKeyRequest.KeyFormat): SubtleGetKeyRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SubtleGetKeyRequest.AsObject;
    static toObject(includeInstance: boolean, msg: SubtleGetKeyRequest): SubtleGetKeyRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SubtleGetKeyRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SubtleGetKeyRequest;
    static deserializeBinaryFromReader(message: SubtleGetKeyRequest, reader: jspb.BinaryReader): SubtleGetKeyRequest;
}

export namespace SubtleGetKeyRequest {
    export type AsObject = {
        componentName: string,
        name: string,
        format: SubtleGetKeyRequest.KeyFormat,
    }

    export enum KeyFormat {
    PEM = 0,
    JSON = 1,
    }

}

export class SubtleGetKeyResponse extends jspb.Message { 
    getName(): string;
    setName(value: string): SubtleGetKeyResponse;
    getPublicKey(): string;
    setPublicKey(value: string): SubtleGetKeyResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SubtleGetKeyResponse.AsObject;
    static toObject(includeInstance: boolean, msg: SubtleGetKeyResponse): SubtleGetKeyResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SubtleGetKeyResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SubtleGetKeyResponse;
    static deserializeBinaryFromReader(message: SubtleGetKeyResponse, reader: jspb.BinaryReader): SubtleGetKeyResponse;
}

export namespace SubtleGetKeyResponse {
    export type AsObject = {
        name: string,
        publicKey: string,
    }
}

export class SubtleEncryptRequest extends jspb.Message { 
    getComponentName(): string;
    setComponentName(value: string): SubtleEncryptRequest;
    getPlaintext(): Uint8Array | string;
    getPlaintext_asU8(): Uint8Array;
    getPlaintext_asB64(): string;
    setPlaintext(value: Uint8Array | string): SubtleEncryptRequest;
    getAlgorithm(): string;
    setAlgorithm(value: string): SubtleEncryptRequest;
    getKeyName(): string;
    setKeyName(value: string): SubtleEncryptRequest;
    getNonce(): Uint8Array | string;
    getNonce_asU8(): Uint8Array;
    getNonce_asB64(): string;
    setNonce(value: Uint8Array | string): SubtleEncryptRequest;
    getAssociatedData(): Uint8Array | string;
    getAssociatedData_asU8(): Uint8Array;
    getAssociatedData_asB64(): string;
    setAssociatedData(value: Uint8Array | string): SubtleEncryptRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SubtleEncryptRequest.AsObject;
    static toObject(includeInstance: boolean, msg: SubtleEncryptRequest): SubtleEncryptRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SubtleEncryptRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SubtleEncryptRequest;
    static deserializeBinaryFromReader(message: SubtleEncryptRequest, reader: jspb.BinaryReader): SubtleEncryptRequest;
}

export namespace SubtleEncryptRequest {
    export type AsObject = {
        componentName: string,
        plaintext: Uint8Array | string,
        algorithm: string,
        keyName: string,
        nonce: Uint8Array | string,
        associatedData: Uint8Array | string,
    }
}

export class SubtleEncryptResponse extends jspb.Message { 
    getCiphertext(): Uint8Array | string;
    getCiphertext_asU8(): Uint8Array;
    getCiphertext_asB64(): string;
    setCiphertext(value: Uint8Array | string): SubtleEncryptResponse;
    getTag(): Uint8Array | string;
    getTag_asU8(): Uint8Array;
    getTag_asB64(): string;
    setTag(value: Uint8Array | string): SubtleEncryptResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SubtleEncryptResponse.AsObject;
    static toObject(includeInstance: boolean, msg: SubtleEncryptResponse): SubtleEncryptResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SubtleEncryptResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SubtleEncryptResponse;
    static deserializeBinaryFromReader(message: SubtleEncryptResponse, reader: jspb.BinaryReader): SubtleEncryptResponse;
}

export namespace SubtleEncryptResponse {
    export type AsObject = {
        ciphertext: Uint8Array | string,
        tag: Uint8Array | string,
    }
}

export class SubtleDecryptRequest extends jspb.Message { 
    getComponentName(): string;
    setComponentName(value: string): SubtleDecryptRequest;
    getCiphertext(): Uint8Array | string;
    getCiphertext_asU8(): Uint8Array;
    getCiphertext_asB64(): string;
    setCiphertext(value: Uint8Array | string): SubtleDecryptRequest;
    getAlgorithm(): string;
    setAlgorithm(value: string): SubtleDecryptRequest;
    getKeyName(): string;
    setKeyName(value: string): SubtleDecryptRequest;
    getNonce(): Uint8Array | string;
    getNonce_asU8(): Uint8Array;
    getNonce_asB64(): string;
    setNonce(value: Uint8Array | string): SubtleDecryptRequest;
    getTag(): Uint8Array | string;
    getTag_asU8(): Uint8Array;
    getTag_asB64(): string;
    setTag(value: Uint8Array | string): SubtleDecryptRequest;
    getAssociatedData(): Uint8Array | string;
    getAssociatedData_asU8(): Uint8Array;
    getAssociatedData_asB64(): string;
    setAssociatedData(value: Uint8Array | string): SubtleDecryptRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SubtleDecryptRequest.AsObject;
    static toObject(includeInstance: boolean, msg: SubtleDecryptRequest): SubtleDecryptRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SubtleDecryptRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SubtleDecryptRequest;
    static deserializeBinaryFromReader(message: SubtleDecryptRequest, reader: jspb.BinaryReader): SubtleDecryptRequest;
}

export namespace SubtleDecryptRequest {
    export type AsObject = {
        componentName: string,
        ciphertext: Uint8Array | string,
        algorithm: string,
        keyName: string,
        nonce: Uint8Array | string,
        tag: Uint8Array | string,
        associatedData: Uint8Array | string,
    }
}

export class SubtleDecryptResponse extends jspb.Message { 
    getPlaintext(): Uint8Array | string;
    getPlaintext_asU8(): Uint8Array;
    getPlaintext_asB64(): string;
    setPlaintext(value: Uint8Array | string): SubtleDecryptResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SubtleDecryptResponse.AsObject;
    static toObject(includeInstance: boolean, msg: SubtleDecryptResponse): SubtleDecryptResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SubtleDecryptResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SubtleDecryptResponse;
    static deserializeBinaryFromReader(message: SubtleDecryptResponse, reader: jspb.BinaryReader): SubtleDecryptResponse;
}

export namespace SubtleDecryptResponse {
    export type AsObject = {
        plaintext: Uint8Array | string,
    }
}

export class SubtleWrapKeyRequest extends jspb.Message { 
    getComponentName(): string;
    setComponentName(value: string): SubtleWrapKeyRequest;
    getPlaintextKey(): Uint8Array | string;
    getPlaintextKey_asU8(): Uint8Array;
    getPlaintextKey_asB64(): string;
    setPlaintextKey(value: Uint8Array | string): SubtleWrapKeyRequest;
    getAlgorithm(): string;
    setAlgorithm(value: string): SubtleWrapKeyRequest;
    getKeyName(): string;
    setKeyName(value: string): SubtleWrapKeyRequest;
    getNonce(): Uint8Array | string;
    getNonce_asU8(): Uint8Array;
    getNonce_asB64(): string;
    setNonce(value: Uint8Array | string): SubtleWrapKeyRequest;
    getAssociatedData(): Uint8Array | string;
    getAssociatedData_asU8(): Uint8Array;
    getAssociatedData_asB64(): string;
    setAssociatedData(value: Uint8Array | string): SubtleWrapKeyRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SubtleWrapKeyRequest.AsObject;
    static toObject(includeInstance: boolean, msg: SubtleWrapKeyRequest): SubtleWrapKeyRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SubtleWrapKeyRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SubtleWrapKeyRequest;
    static deserializeBinaryFromReader(message: SubtleWrapKeyRequest, reader: jspb.BinaryReader): SubtleWrapKeyRequest;
}

export namespace SubtleWrapKeyRequest {
    export type AsObject = {
        componentName: string,
        plaintextKey: Uint8Array | string,
        algorithm: string,
        keyName: string,
        nonce: Uint8Array | string,
        associatedData: Uint8Array | string,
    }
}

export class SubtleWrapKeyResponse extends jspb.Message { 
    getWrappedKey(): Uint8Array | string;
    getWrappedKey_asU8(): Uint8Array;
    getWrappedKey_asB64(): string;
    setWrappedKey(value: Uint8Array | string): SubtleWrapKeyResponse;
    getTag(): Uint8Array | string;
    getTag_asU8(): Uint8Array;
    getTag_asB64(): string;
    setTag(value: Uint8Array | string): SubtleWrapKeyResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SubtleWrapKeyResponse.AsObject;
    static toObject(includeInstance: boolean, msg: SubtleWrapKeyResponse): SubtleWrapKeyResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SubtleWrapKeyResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SubtleWrapKeyResponse;
    static deserializeBinaryFromReader(message: SubtleWrapKeyResponse, reader: jspb.BinaryReader): SubtleWrapKeyResponse;
}

export namespace SubtleWrapKeyResponse {
    export type AsObject = {
        wrappedKey: Uint8Array | string,
        tag: Uint8Array | string,
    }
}

export class SubtleUnwrapKeyRequest extends jspb.Message { 
    getComponentName(): string;
    setComponentName(value: string): SubtleUnwrapKeyRequest;
    getWrappedKey(): Uint8Array | string;
    getWrappedKey_asU8(): Uint8Array;
    getWrappedKey_asB64(): string;
    setWrappedKey(value: Uint8Array | string): SubtleUnwrapKeyRequest;
    getAlgorithm(): string;
    setAlgorithm(value: string): SubtleUnwrapKeyRequest;
    getKeyName(): string;
    setKeyName(value: string): SubtleUnwrapKeyRequest;
    getNonce(): Uint8Array | string;
    getNonce_asU8(): Uint8Array;
    getNonce_asB64(): string;
    setNonce(value: Uint8Array | string): SubtleUnwrapKeyRequest;
    getTag(): Uint8Array | string;
    getTag_asU8(): Uint8Array;
    getTag_asB64(): string;
    setTag(value: Uint8Array | string): SubtleUnwrapKeyRequest;
    getAssociatedData(): Uint8Array | string;
    getAssociatedData_asU8(): Uint8Array;
    getAssociatedData_asB64(): string;
    setAssociatedData(value: Uint8Array | string): SubtleUnwrapKeyRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SubtleUnwrapKeyRequest.AsObject;
    static toObject(includeInstance: boolean, msg: SubtleUnwrapKeyRequest): SubtleUnwrapKeyRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SubtleUnwrapKeyRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SubtleUnwrapKeyRequest;
    static deserializeBinaryFromReader(message: SubtleUnwrapKeyRequest, reader: jspb.BinaryReader): SubtleUnwrapKeyRequest;
}

export namespace SubtleUnwrapKeyRequest {
    export type AsObject = {
        componentName: string,
        wrappedKey: Uint8Array | string,
        algorithm: string,
        keyName: string,
        nonce: Uint8Array | string,
        tag: Uint8Array | string,
        associatedData: Uint8Array | string,
    }
}

export class SubtleUnwrapKeyResponse extends jspb.Message { 
    getPlaintextKey(): Uint8Array | string;
    getPlaintextKey_asU8(): Uint8Array;
    getPlaintextKey_asB64(): string;
    setPlaintextKey(value: Uint8Array | string): SubtleUnwrapKeyResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SubtleUnwrapKeyResponse.AsObject;
    static toObject(includeInstance: boolean, msg: SubtleUnwrapKeyResponse): SubtleUnwrapKeyResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SubtleUnwrapKeyResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SubtleUnwrapKeyResponse;
    static deserializeBinaryFromReader(message: SubtleUnwrapKeyResponse, reader: jspb.BinaryReader): SubtleUnwrapKeyResponse;
}

export namespace SubtleUnwrapKeyResponse {
    export type AsObject = {
        plaintextKey: Uint8Array | string,
    }
}

export class SubtleSignRequest extends jspb.Message { 
    getComponentName(): string;
    setComponentName(value: string): SubtleSignRequest;
    getDigest(): Uint8Array | string;
    getDigest_asU8(): Uint8Array;
    getDigest_asB64(): string;
    setDigest(value: Uint8Array | string): SubtleSignRequest;
    getAlgorithm(): string;
    setAlgorithm(value: string): SubtleSignRequest;
    getKeyName(): string;
    setKeyName(value: string): SubtleSignRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SubtleSignRequest.AsObject;
    static toObject(includeInstance: boolean, msg: SubtleSignRequest): SubtleSignRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SubtleSignRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SubtleSignRequest;
    static deserializeBinaryFromReader(message: SubtleSignRequest, reader: jspb.BinaryReader): SubtleSignRequest;
}

export namespace SubtleSignRequest {
    export type AsObject = {
        componentName: string,
        digest: Uint8Array | string,
        algorithm: string,
        keyName: string,
    }
}

export class SubtleSignResponse extends jspb.Message { 
    getSignature(): Uint8Array | string;
    getSignature_asU8(): Uint8Array;
    getSignature_asB64(): string;
    setSignature(value: Uint8Array | string): SubtleSignResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SubtleSignResponse.AsObject;
    static toObject(includeInstance: boolean, msg: SubtleSignResponse): SubtleSignResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SubtleSignResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SubtleSignResponse;
    static deserializeBinaryFromReader(message: SubtleSignResponse, reader: jspb.BinaryReader): SubtleSignResponse;
}

export namespace SubtleSignResponse {
    export type AsObject = {
        signature: Uint8Array | string,
    }
}

export class SubtleVerifyRequest extends jspb.Message { 
    getComponentName(): string;
    setComponentName(value: string): SubtleVerifyRequest;
    getDigest(): Uint8Array | string;
    getDigest_asU8(): Uint8Array;
    getDigest_asB64(): string;
    setDigest(value: Uint8Array | string): SubtleVerifyRequest;
    getAlgorithm(): string;
    setAlgorithm(value: string): SubtleVerifyRequest;
    getKeyName(): string;
    setKeyName(value: string): SubtleVerifyRequest;
    getSignature(): Uint8Array | string;
    getSignature_asU8(): Uint8Array;
    getSignature_asB64(): string;
    setSignature(value: Uint8Array | string): SubtleVerifyRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SubtleVerifyRequest.AsObject;
    static toObject(includeInstance: boolean, msg: SubtleVerifyRequest): SubtleVerifyRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SubtleVerifyRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SubtleVerifyRequest;
    static deserializeBinaryFromReader(message: SubtleVerifyRequest, reader: jspb.BinaryReader): SubtleVerifyRequest;
}

export namespace SubtleVerifyRequest {
    export type AsObject = {
        componentName: string,
        digest: Uint8Array | string,
        algorithm: string,
        keyName: string,
        signature: Uint8Array | string,
    }
}

export class SubtleVerifyResponse extends jspb.Message { 
    getValid(): boolean;
    setValid(value: boolean): SubtleVerifyResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SubtleVerifyResponse.AsObject;
    static toObject(includeInstance: boolean, msg: SubtleVerifyResponse): SubtleVerifyResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SubtleVerifyResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SubtleVerifyResponse;
    static deserializeBinaryFromReader(message: SubtleVerifyResponse, reader: jspb.BinaryReader): SubtleVerifyResponse;
}

export namespace SubtleVerifyResponse {
    export type AsObject = {
        valid: boolean,
    }
}

export class EncryptRequest extends jspb.Message { 

    hasOptions(): boolean;
    clearOptions(): void;
    getOptions(): EncryptRequestOptions | undefined;
    setOptions(value?: EncryptRequestOptions): EncryptRequest;

    hasPayload(): boolean;
    clearPayload(): void;
    getPayload(): dapr_proto_common_v1_common_pb.StreamPayload | undefined;
    setPayload(value?: dapr_proto_common_v1_common_pb.StreamPayload): EncryptRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): EncryptRequest.AsObject;
    static toObject(includeInstance: boolean, msg: EncryptRequest): EncryptRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: EncryptRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): EncryptRequest;
    static deserializeBinaryFromReader(message: EncryptRequest, reader: jspb.BinaryReader): EncryptRequest;
}

export namespace EncryptRequest {
    export type AsObject = {
        options?: EncryptRequestOptions.AsObject,
        payload?: dapr_proto_common_v1_common_pb.StreamPayload.AsObject,
    }
}

export class EncryptRequestOptions extends jspb.Message { 
    getComponentName(): string;
    setComponentName(value: string): EncryptRequestOptions;
    getKeyName(): string;
    setKeyName(value: string): EncryptRequestOptions;
    getKeyWrapAlgorithm(): string;
    setKeyWrapAlgorithm(value: string): EncryptRequestOptions;
    getDataEncryptionCipher(): string;
    setDataEncryptionCipher(value: string): EncryptRequestOptions;
    getOmitDecryptionKeyName(): boolean;
    setOmitDecryptionKeyName(value: boolean): EncryptRequestOptions;
    getDecryptionKeyName(): string;
    setDecryptionKeyName(value: string): EncryptRequestOptions;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): EncryptRequestOptions.AsObject;
    static toObject(includeInstance: boolean, msg: EncryptRequestOptions): EncryptRequestOptions.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: EncryptRequestOptions, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): EncryptRequestOptions;
    static deserializeBinaryFromReader(message: EncryptRequestOptions, reader: jspb.BinaryReader): EncryptRequestOptions;
}

export namespace EncryptRequestOptions {
    export type AsObject = {
        componentName: string,
        keyName: string,
        keyWrapAlgorithm: string,
        dataEncryptionCipher: string,
        omitDecryptionKeyName: boolean,
        decryptionKeyName: string,
    }
}

export class EncryptResponse extends jspb.Message { 

    hasPayload(): boolean;
    clearPayload(): void;
    getPayload(): dapr_proto_common_v1_common_pb.StreamPayload | undefined;
    setPayload(value?: dapr_proto_common_v1_common_pb.StreamPayload): EncryptResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): EncryptResponse.AsObject;
    static toObject(includeInstance: boolean, msg: EncryptResponse): EncryptResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: EncryptResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): EncryptResponse;
    static deserializeBinaryFromReader(message: EncryptResponse, reader: jspb.BinaryReader): EncryptResponse;
}

export namespace EncryptResponse {
    export type AsObject = {
        payload?: dapr_proto_common_v1_common_pb.StreamPayload.AsObject,
    }
}

export class DecryptRequest extends jspb.Message { 

    hasOptions(): boolean;
    clearOptions(): void;
    getOptions(): DecryptRequestOptions | undefined;
    setOptions(value?: DecryptRequestOptions): DecryptRequest;

    hasPayload(): boolean;
    clearPayload(): void;
    getPayload(): dapr_proto_common_v1_common_pb.StreamPayload | undefined;
    setPayload(value?: dapr_proto_common_v1_common_pb.StreamPayload): DecryptRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DecryptRequest.AsObject;
    static toObject(includeInstance: boolean, msg: DecryptRequest): DecryptRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DecryptRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DecryptRequest;
    static deserializeBinaryFromReader(message: DecryptRequest, reader: jspb.BinaryReader): DecryptRequest;
}

export namespace DecryptRequest {
    export type AsObject = {
        options?: DecryptRequestOptions.AsObject,
        payload?: dapr_proto_common_v1_common_pb.StreamPayload.AsObject,
    }
}

export class DecryptRequestOptions extends jspb.Message { 
    getComponentName(): string;
    setComponentName(value: string): DecryptRequestOptions;
    getKeyName(): string;
    setKeyName(value: string): DecryptRequestOptions;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DecryptRequestOptions.AsObject;
    static toObject(includeInstance: boolean, msg: DecryptRequestOptions): DecryptRequestOptions.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DecryptRequestOptions, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DecryptRequestOptions;
    static deserializeBinaryFromReader(message: DecryptRequestOptions, reader: jspb.BinaryReader): DecryptRequestOptions;
}

export namespace DecryptRequestOptions {
    export type AsObject = {
        componentName: string,
        keyName: string,
    }
}

export class DecryptResponse extends jspb.Message { 

    hasPayload(): boolean;
    clearPayload(): void;
    getPayload(): dapr_proto_common_v1_common_pb.StreamPayload | undefined;
    setPayload(value?: dapr_proto_common_v1_common_pb.StreamPayload): DecryptResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DecryptResponse.AsObject;
    static toObject(includeInstance: boolean, msg: DecryptResponse): DecryptResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DecryptResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DecryptResponse;
    static deserializeBinaryFromReader(message: DecryptResponse, reader: jspb.BinaryReader): DecryptResponse;
}

export namespace DecryptResponse {
    export type AsObject = {
        payload?: dapr_proto_common_v1_common_pb.StreamPayload.AsObject,
    }
}

export class GetWorkflowRequest extends jspb.Message { 
    getInstanceId(): string;
    setInstanceId(value: string): GetWorkflowRequest;
    getWorkflowComponent(): string;
    setWorkflowComponent(value: string): GetWorkflowRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetWorkflowRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetWorkflowRequest): GetWorkflowRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetWorkflowRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetWorkflowRequest;
    static deserializeBinaryFromReader(message: GetWorkflowRequest, reader: jspb.BinaryReader): GetWorkflowRequest;
}

export namespace GetWorkflowRequest {
    export type AsObject = {
        instanceId: string,
        workflowComponent: string,
    }
}

export class GetWorkflowResponse extends jspb.Message { 
    getInstanceId(): string;
    setInstanceId(value: string): GetWorkflowResponse;
    getWorkflowName(): string;
    setWorkflowName(value: string): GetWorkflowResponse;

    hasCreatedAt(): boolean;
    clearCreatedAt(): void;
    getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): GetWorkflowResponse;

    hasLastUpdatedAt(): boolean;
    clearLastUpdatedAt(): void;
    getLastUpdatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setLastUpdatedAt(value?: google_protobuf_timestamp_pb.Timestamp): GetWorkflowResponse;
    getRuntimeStatus(): string;
    setRuntimeStatus(value: string): GetWorkflowResponse;

    getPropertiesMap(): jspb.Map<string, string>;
    clearPropertiesMap(): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetWorkflowResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetWorkflowResponse): GetWorkflowResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetWorkflowResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetWorkflowResponse;
    static deserializeBinaryFromReader(message: GetWorkflowResponse, reader: jspb.BinaryReader): GetWorkflowResponse;
}

export namespace GetWorkflowResponse {
    export type AsObject = {
        instanceId: string,
        workflowName: string,
        createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
        lastUpdatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
        runtimeStatus: string,

        propertiesMap: Array<[string, string]>,
    }
}

export class StartWorkflowRequest extends jspb.Message { 
    getInstanceId(): string;
    setInstanceId(value: string): StartWorkflowRequest;
    getWorkflowComponent(): string;
    setWorkflowComponent(value: string): StartWorkflowRequest;
    getWorkflowName(): string;
    setWorkflowName(value: string): StartWorkflowRequest;

    getOptionsMap(): jspb.Map<string, string>;
    clearOptionsMap(): void;
    getInput(): Uint8Array | string;
    getInput_asU8(): Uint8Array;
    getInput_asB64(): string;
    setInput(value: Uint8Array | string): StartWorkflowRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): StartWorkflowRequest.AsObject;
    static toObject(includeInstance: boolean, msg: StartWorkflowRequest): StartWorkflowRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: StartWorkflowRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): StartWorkflowRequest;
    static deserializeBinaryFromReader(message: StartWorkflowRequest, reader: jspb.BinaryReader): StartWorkflowRequest;
}

export namespace StartWorkflowRequest {
    export type AsObject = {
        instanceId: string,
        workflowComponent: string,
        workflowName: string,

        optionsMap: Array<[string, string]>,
        input: Uint8Array | string,
    }
}

export class StartWorkflowResponse extends jspb.Message { 
    getInstanceId(): string;
    setInstanceId(value: string): StartWorkflowResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): StartWorkflowResponse.AsObject;
    static toObject(includeInstance: boolean, msg: StartWorkflowResponse): StartWorkflowResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: StartWorkflowResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): StartWorkflowResponse;
    static deserializeBinaryFromReader(message: StartWorkflowResponse, reader: jspb.BinaryReader): StartWorkflowResponse;
}

export namespace StartWorkflowResponse {
    export type AsObject = {
        instanceId: string,
    }
}

export class TerminateWorkflowRequest extends jspb.Message { 
    getInstanceId(): string;
    setInstanceId(value: string): TerminateWorkflowRequest;
    getWorkflowComponent(): string;
    setWorkflowComponent(value: string): TerminateWorkflowRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TerminateWorkflowRequest.AsObject;
    static toObject(includeInstance: boolean, msg: TerminateWorkflowRequest): TerminateWorkflowRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TerminateWorkflowRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TerminateWorkflowRequest;
    static deserializeBinaryFromReader(message: TerminateWorkflowRequest, reader: jspb.BinaryReader): TerminateWorkflowRequest;
}

export namespace TerminateWorkflowRequest {
    export type AsObject = {
        instanceId: string,
        workflowComponent: string,
    }
}

export class PauseWorkflowRequest extends jspb.Message { 
    getInstanceId(): string;
    setInstanceId(value: string): PauseWorkflowRequest;
    getWorkflowComponent(): string;
    setWorkflowComponent(value: string): PauseWorkflowRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PauseWorkflowRequest.AsObject;
    static toObject(includeInstance: boolean, msg: PauseWorkflowRequest): PauseWorkflowRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PauseWorkflowRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PauseWorkflowRequest;
    static deserializeBinaryFromReader(message: PauseWorkflowRequest, reader: jspb.BinaryReader): PauseWorkflowRequest;
}

export namespace PauseWorkflowRequest {
    export type AsObject = {
        instanceId: string,
        workflowComponent: string,
    }
}

export class ResumeWorkflowRequest extends jspb.Message { 
    getInstanceId(): string;
    setInstanceId(value: string): ResumeWorkflowRequest;
    getWorkflowComponent(): string;
    setWorkflowComponent(value: string): ResumeWorkflowRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ResumeWorkflowRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ResumeWorkflowRequest): ResumeWorkflowRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ResumeWorkflowRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ResumeWorkflowRequest;
    static deserializeBinaryFromReader(message: ResumeWorkflowRequest, reader: jspb.BinaryReader): ResumeWorkflowRequest;
}

export namespace ResumeWorkflowRequest {
    export type AsObject = {
        instanceId: string,
        workflowComponent: string,
    }
}

export class RaiseEventWorkflowRequest extends jspb.Message { 
    getInstanceId(): string;
    setInstanceId(value: string): RaiseEventWorkflowRequest;
    getWorkflowComponent(): string;
    setWorkflowComponent(value: string): RaiseEventWorkflowRequest;
    getEventName(): string;
    setEventName(value: string): RaiseEventWorkflowRequest;
    getEventData(): Uint8Array | string;
    getEventData_asU8(): Uint8Array;
    getEventData_asB64(): string;
    setEventData(value: Uint8Array | string): RaiseEventWorkflowRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RaiseEventWorkflowRequest.AsObject;
    static toObject(includeInstance: boolean, msg: RaiseEventWorkflowRequest): RaiseEventWorkflowRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RaiseEventWorkflowRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RaiseEventWorkflowRequest;
    static deserializeBinaryFromReader(message: RaiseEventWorkflowRequest, reader: jspb.BinaryReader): RaiseEventWorkflowRequest;
}

export namespace RaiseEventWorkflowRequest {
    export type AsObject = {
        instanceId: string,
        workflowComponent: string,
        eventName: string,
        eventData: Uint8Array | string,
    }
}

export class PurgeWorkflowRequest extends jspb.Message { 
    getInstanceId(): string;
    setInstanceId(value: string): PurgeWorkflowRequest;
    getWorkflowComponent(): string;
    setWorkflowComponent(value: string): PurgeWorkflowRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PurgeWorkflowRequest.AsObject;
    static toObject(includeInstance: boolean, msg: PurgeWorkflowRequest): PurgeWorkflowRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PurgeWorkflowRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PurgeWorkflowRequest;
    static deserializeBinaryFromReader(message: PurgeWorkflowRequest, reader: jspb.BinaryReader): PurgeWorkflowRequest;
}

export namespace PurgeWorkflowRequest {
    export type AsObject = {
        instanceId: string,
        workflowComponent: string,
    }
}

export class ShutdownRequest extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ShutdownRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ShutdownRequest): ShutdownRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ShutdownRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ShutdownRequest;
    static deserializeBinaryFromReader(message: ShutdownRequest, reader: jspb.BinaryReader): ShutdownRequest;
}

export namespace ShutdownRequest {
    export type AsObject = {
    }
}

export class Job extends jspb.Message { 
    getName(): string;
    setName(value: string): Job;

    hasSchedule(): boolean;
    clearSchedule(): void;
    getSchedule(): string | undefined;
    setSchedule(value: string): Job;

    hasRepeats(): boolean;
    clearRepeats(): void;
    getRepeats(): number | undefined;
    setRepeats(value: number): Job;

    hasDueTime(): boolean;
    clearDueTime(): void;
    getDueTime(): string | undefined;
    setDueTime(value: string): Job;

    hasTtl(): boolean;
    clearTtl(): void;
    getTtl(): string | undefined;
    setTtl(value: string): Job;

    hasData(): boolean;
    clearData(): void;
    getData(): google_protobuf_any_pb.Any | undefined;
    setData(value?: google_protobuf_any_pb.Any): Job;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Job.AsObject;
    static toObject(includeInstance: boolean, msg: Job): Job.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Job, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Job;
    static deserializeBinaryFromReader(message: Job, reader: jspb.BinaryReader): Job;
}

export namespace Job {
    export type AsObject = {
        name: string,
        schedule?: string,
        repeats?: number,
        dueTime?: string,
        ttl?: string,
        data?: google_protobuf_any_pb.Any.AsObject,
    }
}

export class ScheduleJobRequest extends jspb.Message { 

    hasJob(): boolean;
    clearJob(): void;
    getJob(): Job | undefined;
    setJob(value?: Job): ScheduleJobRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ScheduleJobRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ScheduleJobRequest): ScheduleJobRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ScheduleJobRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ScheduleJobRequest;
    static deserializeBinaryFromReader(message: ScheduleJobRequest, reader: jspb.BinaryReader): ScheduleJobRequest;
}

export namespace ScheduleJobRequest {
    export type AsObject = {
        job?: Job.AsObject,
    }
}

export class ScheduleJobResponse extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ScheduleJobResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ScheduleJobResponse): ScheduleJobResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ScheduleJobResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ScheduleJobResponse;
    static deserializeBinaryFromReader(message: ScheduleJobResponse, reader: jspb.BinaryReader): ScheduleJobResponse;
}

export namespace ScheduleJobResponse {
    export type AsObject = {
    }
}

export class GetJobRequest extends jspb.Message { 
    getName(): string;
    setName(value: string): GetJobRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetJobRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetJobRequest): GetJobRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetJobRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetJobRequest;
    static deserializeBinaryFromReader(message: GetJobRequest, reader: jspb.BinaryReader): GetJobRequest;
}

export namespace GetJobRequest {
    export type AsObject = {
        name: string,
    }
}

export class GetJobResponse extends jspb.Message { 

    hasJob(): boolean;
    clearJob(): void;
    getJob(): Job | undefined;
    setJob(value?: Job): GetJobResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetJobResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetJobResponse): GetJobResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetJobResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetJobResponse;
    static deserializeBinaryFromReader(message: GetJobResponse, reader: jspb.BinaryReader): GetJobResponse;
}

export namespace GetJobResponse {
    export type AsObject = {
        job?: Job.AsObject,
    }
}

export class DeleteJobRequest extends jspb.Message { 
    getName(): string;
    setName(value: string): DeleteJobRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DeleteJobRequest.AsObject;
    static toObject(includeInstance: boolean, msg: DeleteJobRequest): DeleteJobRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DeleteJobRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DeleteJobRequest;
    static deserializeBinaryFromReader(message: DeleteJobRequest, reader: jspb.BinaryReader): DeleteJobRequest;
}

export namespace DeleteJobRequest {
    export type AsObject = {
        name: string,
    }
}

export class DeleteJobResponse extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DeleteJobResponse.AsObject;
    static toObject(includeInstance: boolean, msg: DeleteJobResponse): DeleteJobResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DeleteJobResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DeleteJobResponse;
    static deserializeBinaryFromReader(message: DeleteJobResponse, reader: jspb.BinaryReader): DeleteJobResponse;
}

export namespace DeleteJobResponse {
    export type AsObject = {
    }
}

export enum PubsubSubscriptionType {
    UNKNOWN = 0,
    DECLARATIVE = 1,
    PROGRAMMATIC = 2,
    STREAMING = 3,
}
