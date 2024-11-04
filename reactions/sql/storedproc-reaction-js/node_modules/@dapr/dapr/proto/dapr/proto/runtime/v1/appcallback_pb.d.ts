// package: dapr.proto.runtime.v1
// file: dapr/proto/runtime/v1/appcallback.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as google_protobuf_any_pb from "google-protobuf/google/protobuf/any_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";
import * as dapr_proto_common_v1_common_pb from "../../../../dapr/proto/common/v1/common_pb";
import * as google_protobuf_struct_pb from "google-protobuf/google/protobuf/struct_pb";

export class JobEventRequest extends jspb.Message { 
    getName(): string;
    setName(value: string): JobEventRequest;

    hasData(): boolean;
    clearData(): void;
    getData(): google_protobuf_any_pb.Any | undefined;
    setData(value?: google_protobuf_any_pb.Any): JobEventRequest;
    getMethod(): string;
    setMethod(value: string): JobEventRequest;
    getContentType(): string;
    setContentType(value: string): JobEventRequest;

    hasHttpExtension(): boolean;
    clearHttpExtension(): void;
    getHttpExtension(): dapr_proto_common_v1_common_pb.HTTPExtension | undefined;
    setHttpExtension(value?: dapr_proto_common_v1_common_pb.HTTPExtension): JobEventRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): JobEventRequest.AsObject;
    static toObject(includeInstance: boolean, msg: JobEventRequest): JobEventRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: JobEventRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): JobEventRequest;
    static deserializeBinaryFromReader(message: JobEventRequest, reader: jspb.BinaryReader): JobEventRequest;
}

export namespace JobEventRequest {
    export type AsObject = {
        name: string,
        data?: google_protobuf_any_pb.Any.AsObject,
        method: string,
        contentType: string,
        httpExtension?: dapr_proto_common_v1_common_pb.HTTPExtension.AsObject,
    }
}

export class JobEventResponse extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): JobEventResponse.AsObject;
    static toObject(includeInstance: boolean, msg: JobEventResponse): JobEventResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: JobEventResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): JobEventResponse;
    static deserializeBinaryFromReader(message: JobEventResponse, reader: jspb.BinaryReader): JobEventResponse;
}

export namespace JobEventResponse {
    export type AsObject = {
    }
}

export class TopicEventRequest extends jspb.Message { 
    getId(): string;
    setId(value: string): TopicEventRequest;
    getSource(): string;
    setSource(value: string): TopicEventRequest;
    getType(): string;
    setType(value: string): TopicEventRequest;
    getSpecVersion(): string;
    setSpecVersion(value: string): TopicEventRequest;
    getDataContentType(): string;
    setDataContentType(value: string): TopicEventRequest;
    getData(): Uint8Array | string;
    getData_asU8(): Uint8Array;
    getData_asB64(): string;
    setData(value: Uint8Array | string): TopicEventRequest;
    getTopic(): string;
    setTopic(value: string): TopicEventRequest;
    getPubsubName(): string;
    setPubsubName(value: string): TopicEventRequest;
    getPath(): string;
    setPath(value: string): TopicEventRequest;

    hasExtensions(): boolean;
    clearExtensions(): void;
    getExtensions(): google_protobuf_struct_pb.Struct | undefined;
    setExtensions(value?: google_protobuf_struct_pb.Struct): TopicEventRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TopicEventRequest.AsObject;
    static toObject(includeInstance: boolean, msg: TopicEventRequest): TopicEventRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TopicEventRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TopicEventRequest;
    static deserializeBinaryFromReader(message: TopicEventRequest, reader: jspb.BinaryReader): TopicEventRequest;
}

export namespace TopicEventRequest {
    export type AsObject = {
        id: string,
        source: string,
        type: string,
        specVersion: string,
        dataContentType: string,
        data: Uint8Array | string,
        topic: string,
        pubsubName: string,
        path: string,
        extensions?: google_protobuf_struct_pb.Struct.AsObject,
    }
}

export class TopicEventResponse extends jspb.Message { 
    getStatus(): TopicEventResponse.TopicEventResponseStatus;
    setStatus(value: TopicEventResponse.TopicEventResponseStatus): TopicEventResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TopicEventResponse.AsObject;
    static toObject(includeInstance: boolean, msg: TopicEventResponse): TopicEventResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TopicEventResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TopicEventResponse;
    static deserializeBinaryFromReader(message: TopicEventResponse, reader: jspb.BinaryReader): TopicEventResponse;
}

export namespace TopicEventResponse {
    export type AsObject = {
        status: TopicEventResponse.TopicEventResponseStatus,
    }

    export enum TopicEventResponseStatus {
    SUCCESS = 0,
    RETRY = 1,
    DROP = 2,
    }

}

export class TopicEventCERequest extends jspb.Message { 
    getId(): string;
    setId(value: string): TopicEventCERequest;
    getSource(): string;
    setSource(value: string): TopicEventCERequest;
    getType(): string;
    setType(value: string): TopicEventCERequest;
    getSpecVersion(): string;
    setSpecVersion(value: string): TopicEventCERequest;
    getDataContentType(): string;
    setDataContentType(value: string): TopicEventCERequest;
    getData(): Uint8Array | string;
    getData_asU8(): Uint8Array;
    getData_asB64(): string;
    setData(value: Uint8Array | string): TopicEventCERequest;

    hasExtensions(): boolean;
    clearExtensions(): void;
    getExtensions(): google_protobuf_struct_pb.Struct | undefined;
    setExtensions(value?: google_protobuf_struct_pb.Struct): TopicEventCERequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TopicEventCERequest.AsObject;
    static toObject(includeInstance: boolean, msg: TopicEventCERequest): TopicEventCERequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TopicEventCERequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TopicEventCERequest;
    static deserializeBinaryFromReader(message: TopicEventCERequest, reader: jspb.BinaryReader): TopicEventCERequest;
}

export namespace TopicEventCERequest {
    export type AsObject = {
        id: string,
        source: string,
        type: string,
        specVersion: string,
        dataContentType: string,
        data: Uint8Array | string,
        extensions?: google_protobuf_struct_pb.Struct.AsObject,
    }
}

export class TopicEventBulkRequestEntry extends jspb.Message { 
    getEntryId(): string;
    setEntryId(value: string): TopicEventBulkRequestEntry;

    hasBytes(): boolean;
    clearBytes(): void;
    getBytes(): Uint8Array | string;
    getBytes_asU8(): Uint8Array;
    getBytes_asB64(): string;
    setBytes(value: Uint8Array | string): TopicEventBulkRequestEntry;

    hasCloudEvent(): boolean;
    clearCloudEvent(): void;
    getCloudEvent(): TopicEventCERequest | undefined;
    setCloudEvent(value?: TopicEventCERequest): TopicEventBulkRequestEntry;
    getContentType(): string;
    setContentType(value: string): TopicEventBulkRequestEntry;

    getMetadataMap(): jspb.Map<string, string>;
    clearMetadataMap(): void;

    getEventCase(): TopicEventBulkRequestEntry.EventCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TopicEventBulkRequestEntry.AsObject;
    static toObject(includeInstance: boolean, msg: TopicEventBulkRequestEntry): TopicEventBulkRequestEntry.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TopicEventBulkRequestEntry, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TopicEventBulkRequestEntry;
    static deserializeBinaryFromReader(message: TopicEventBulkRequestEntry, reader: jspb.BinaryReader): TopicEventBulkRequestEntry;
}

export namespace TopicEventBulkRequestEntry {
    export type AsObject = {
        entryId: string,
        bytes: Uint8Array | string,
        cloudEvent?: TopicEventCERequest.AsObject,
        contentType: string,

        metadataMap: Array<[string, string]>,
    }

    export enum EventCase {
        EVENT_NOT_SET = 0,
        BYTES = 2,
        CLOUD_EVENT = 3,
    }

}

export class TopicEventBulkRequest extends jspb.Message { 
    getId(): string;
    setId(value: string): TopicEventBulkRequest;
    clearEntriesList(): void;
    getEntriesList(): Array<TopicEventBulkRequestEntry>;
    setEntriesList(value: Array<TopicEventBulkRequestEntry>): TopicEventBulkRequest;
    addEntries(value?: TopicEventBulkRequestEntry, index?: number): TopicEventBulkRequestEntry;

    getMetadataMap(): jspb.Map<string, string>;
    clearMetadataMap(): void;
    getTopic(): string;
    setTopic(value: string): TopicEventBulkRequest;
    getPubsubName(): string;
    setPubsubName(value: string): TopicEventBulkRequest;
    getType(): string;
    setType(value: string): TopicEventBulkRequest;
    getPath(): string;
    setPath(value: string): TopicEventBulkRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TopicEventBulkRequest.AsObject;
    static toObject(includeInstance: boolean, msg: TopicEventBulkRequest): TopicEventBulkRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TopicEventBulkRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TopicEventBulkRequest;
    static deserializeBinaryFromReader(message: TopicEventBulkRequest, reader: jspb.BinaryReader): TopicEventBulkRequest;
}

export namespace TopicEventBulkRequest {
    export type AsObject = {
        id: string,
        entriesList: Array<TopicEventBulkRequestEntry.AsObject>,

        metadataMap: Array<[string, string]>,
        topic: string,
        pubsubName: string,
        type: string,
        path: string,
    }
}

export class TopicEventBulkResponseEntry extends jspb.Message { 
    getEntryId(): string;
    setEntryId(value: string): TopicEventBulkResponseEntry;
    getStatus(): TopicEventResponse.TopicEventResponseStatus;
    setStatus(value: TopicEventResponse.TopicEventResponseStatus): TopicEventBulkResponseEntry;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TopicEventBulkResponseEntry.AsObject;
    static toObject(includeInstance: boolean, msg: TopicEventBulkResponseEntry): TopicEventBulkResponseEntry.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TopicEventBulkResponseEntry, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TopicEventBulkResponseEntry;
    static deserializeBinaryFromReader(message: TopicEventBulkResponseEntry, reader: jspb.BinaryReader): TopicEventBulkResponseEntry;
}

export namespace TopicEventBulkResponseEntry {
    export type AsObject = {
        entryId: string,
        status: TopicEventResponse.TopicEventResponseStatus,
    }
}

export class TopicEventBulkResponse extends jspb.Message { 
    clearStatusesList(): void;
    getStatusesList(): Array<TopicEventBulkResponseEntry>;
    setStatusesList(value: Array<TopicEventBulkResponseEntry>): TopicEventBulkResponse;
    addStatuses(value?: TopicEventBulkResponseEntry, index?: number): TopicEventBulkResponseEntry;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TopicEventBulkResponse.AsObject;
    static toObject(includeInstance: boolean, msg: TopicEventBulkResponse): TopicEventBulkResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TopicEventBulkResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TopicEventBulkResponse;
    static deserializeBinaryFromReader(message: TopicEventBulkResponse, reader: jspb.BinaryReader): TopicEventBulkResponse;
}

export namespace TopicEventBulkResponse {
    export type AsObject = {
        statusesList: Array<TopicEventBulkResponseEntry.AsObject>,
    }
}

export class BindingEventRequest extends jspb.Message { 
    getName(): string;
    setName(value: string): BindingEventRequest;
    getData(): Uint8Array | string;
    getData_asU8(): Uint8Array;
    getData_asB64(): string;
    setData(value: Uint8Array | string): BindingEventRequest;

    getMetadataMap(): jspb.Map<string, string>;
    clearMetadataMap(): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BindingEventRequest.AsObject;
    static toObject(includeInstance: boolean, msg: BindingEventRequest): BindingEventRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: BindingEventRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BindingEventRequest;
    static deserializeBinaryFromReader(message: BindingEventRequest, reader: jspb.BinaryReader): BindingEventRequest;
}

export namespace BindingEventRequest {
    export type AsObject = {
        name: string,
        data: Uint8Array | string,

        metadataMap: Array<[string, string]>,
    }
}

export class BindingEventResponse extends jspb.Message { 
    getStoreName(): string;
    setStoreName(value: string): BindingEventResponse;
    clearStatesList(): void;
    getStatesList(): Array<dapr_proto_common_v1_common_pb.StateItem>;
    setStatesList(value: Array<dapr_proto_common_v1_common_pb.StateItem>): BindingEventResponse;
    addStates(value?: dapr_proto_common_v1_common_pb.StateItem, index?: number): dapr_proto_common_v1_common_pb.StateItem;
    clearToList(): void;
    getToList(): Array<string>;
    setToList(value: Array<string>): BindingEventResponse;
    addTo(value: string, index?: number): string;
    getData(): Uint8Array | string;
    getData_asU8(): Uint8Array;
    getData_asB64(): string;
    setData(value: Uint8Array | string): BindingEventResponse;
    getConcurrency(): BindingEventResponse.BindingEventConcurrency;
    setConcurrency(value: BindingEventResponse.BindingEventConcurrency): BindingEventResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BindingEventResponse.AsObject;
    static toObject(includeInstance: boolean, msg: BindingEventResponse): BindingEventResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: BindingEventResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BindingEventResponse;
    static deserializeBinaryFromReader(message: BindingEventResponse, reader: jspb.BinaryReader): BindingEventResponse;
}

export namespace BindingEventResponse {
    export type AsObject = {
        storeName: string,
        statesList: Array<dapr_proto_common_v1_common_pb.StateItem.AsObject>,
        toList: Array<string>,
        data: Uint8Array | string,
        concurrency: BindingEventResponse.BindingEventConcurrency,
    }

    export enum BindingEventConcurrency {
    SEQUENTIAL = 0,
    PARALLEL = 1,
    }

}

export class ListTopicSubscriptionsResponse extends jspb.Message { 
    clearSubscriptionsList(): void;
    getSubscriptionsList(): Array<TopicSubscription>;
    setSubscriptionsList(value: Array<TopicSubscription>): ListTopicSubscriptionsResponse;
    addSubscriptions(value?: TopicSubscription, index?: number): TopicSubscription;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListTopicSubscriptionsResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ListTopicSubscriptionsResponse): ListTopicSubscriptionsResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListTopicSubscriptionsResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListTopicSubscriptionsResponse;
    static deserializeBinaryFromReader(message: ListTopicSubscriptionsResponse, reader: jspb.BinaryReader): ListTopicSubscriptionsResponse;
}

export namespace ListTopicSubscriptionsResponse {
    export type AsObject = {
        subscriptionsList: Array<TopicSubscription.AsObject>,
    }
}

export class TopicSubscription extends jspb.Message { 
    getPubsubName(): string;
    setPubsubName(value: string): TopicSubscription;
    getTopic(): string;
    setTopic(value: string): TopicSubscription;

    getMetadataMap(): jspb.Map<string, string>;
    clearMetadataMap(): void;

    hasRoutes(): boolean;
    clearRoutes(): void;
    getRoutes(): TopicRoutes | undefined;
    setRoutes(value?: TopicRoutes): TopicSubscription;
    getDeadLetterTopic(): string;
    setDeadLetterTopic(value: string): TopicSubscription;

    hasBulkSubscribe(): boolean;
    clearBulkSubscribe(): void;
    getBulkSubscribe(): BulkSubscribeConfig | undefined;
    setBulkSubscribe(value?: BulkSubscribeConfig): TopicSubscription;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TopicSubscription.AsObject;
    static toObject(includeInstance: boolean, msg: TopicSubscription): TopicSubscription.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TopicSubscription, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TopicSubscription;
    static deserializeBinaryFromReader(message: TopicSubscription, reader: jspb.BinaryReader): TopicSubscription;
}

export namespace TopicSubscription {
    export type AsObject = {
        pubsubName: string,
        topic: string,

        metadataMap: Array<[string, string]>,
        routes?: TopicRoutes.AsObject,
        deadLetterTopic: string,
        bulkSubscribe?: BulkSubscribeConfig.AsObject,
    }
}

export class TopicRoutes extends jspb.Message { 
    clearRulesList(): void;
    getRulesList(): Array<TopicRule>;
    setRulesList(value: Array<TopicRule>): TopicRoutes;
    addRules(value?: TopicRule, index?: number): TopicRule;
    getDefault(): string;
    setDefault(value: string): TopicRoutes;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TopicRoutes.AsObject;
    static toObject(includeInstance: boolean, msg: TopicRoutes): TopicRoutes.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TopicRoutes, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TopicRoutes;
    static deserializeBinaryFromReader(message: TopicRoutes, reader: jspb.BinaryReader): TopicRoutes;
}

export namespace TopicRoutes {
    export type AsObject = {
        rulesList: Array<TopicRule.AsObject>,
        pb_default: string,
    }
}

export class TopicRule extends jspb.Message { 
    getMatch(): string;
    setMatch(value: string): TopicRule;
    getPath(): string;
    setPath(value: string): TopicRule;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TopicRule.AsObject;
    static toObject(includeInstance: boolean, msg: TopicRule): TopicRule.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TopicRule, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TopicRule;
    static deserializeBinaryFromReader(message: TopicRule, reader: jspb.BinaryReader): TopicRule;
}

export namespace TopicRule {
    export type AsObject = {
        match: string,
        path: string,
    }
}

export class BulkSubscribeConfig extends jspb.Message { 
    getEnabled(): boolean;
    setEnabled(value: boolean): BulkSubscribeConfig;
    getMaxMessagesCount(): number;
    setMaxMessagesCount(value: number): BulkSubscribeConfig;
    getMaxAwaitDurationMs(): number;
    setMaxAwaitDurationMs(value: number): BulkSubscribeConfig;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BulkSubscribeConfig.AsObject;
    static toObject(includeInstance: boolean, msg: BulkSubscribeConfig): BulkSubscribeConfig.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: BulkSubscribeConfig, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BulkSubscribeConfig;
    static deserializeBinaryFromReader(message: BulkSubscribeConfig, reader: jspb.BinaryReader): BulkSubscribeConfig;
}

export namespace BulkSubscribeConfig {
    export type AsObject = {
        enabled: boolean,
        maxMessagesCount: number,
        maxAwaitDurationMs: number,
    }
}

export class ListInputBindingsResponse extends jspb.Message { 
    clearBindingsList(): void;
    getBindingsList(): Array<string>;
    setBindingsList(value: Array<string>): ListInputBindingsResponse;
    addBindings(value: string, index?: number): string;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListInputBindingsResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ListInputBindingsResponse): ListInputBindingsResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListInputBindingsResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListInputBindingsResponse;
    static deserializeBinaryFromReader(message: ListInputBindingsResponse, reader: jspb.BinaryReader): ListInputBindingsResponse;
}

export namespace ListInputBindingsResponse {
    export type AsObject = {
        bindingsList: Array<string>,
    }
}

export class HealthCheckResponse extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): HealthCheckResponse.AsObject;
    static toObject(includeInstance: boolean, msg: HealthCheckResponse): HealthCheckResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: HealthCheckResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): HealthCheckResponse;
    static deserializeBinaryFromReader(message: HealthCheckResponse, reader: jspb.BinaryReader): HealthCheckResponse;
}

export namespace HealthCheckResponse {
    export type AsObject = {
    }
}
