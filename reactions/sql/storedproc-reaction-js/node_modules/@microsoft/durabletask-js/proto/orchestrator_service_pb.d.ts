// package: 
// file: orchestrator_service.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";
import * as google_protobuf_wrappers_pb from "google-protobuf/google/protobuf/wrappers_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

export class OrchestrationInstance extends jspb.Message { 
    getInstanceid(): string;
    setInstanceid(value: string): OrchestrationInstance;

    hasExecutionid(): boolean;
    clearExecutionid(): void;
    getExecutionid(): google_protobuf_wrappers_pb.StringValue | undefined;
    setExecutionid(value?: google_protobuf_wrappers_pb.StringValue): OrchestrationInstance;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): OrchestrationInstance.AsObject;
    static toObject(includeInstance: boolean, msg: OrchestrationInstance): OrchestrationInstance.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: OrchestrationInstance, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): OrchestrationInstance;
    static deserializeBinaryFromReader(message: OrchestrationInstance, reader: jspb.BinaryReader): OrchestrationInstance;
}

export namespace OrchestrationInstance {
    export type AsObject = {
        instanceid: string,
        executionid?: google_protobuf_wrappers_pb.StringValue.AsObject,
    }
}

export class ActivityRequest extends jspb.Message { 
    getName(): string;
    setName(value: string): ActivityRequest;

    hasVersion(): boolean;
    clearVersion(): void;
    getVersion(): google_protobuf_wrappers_pb.StringValue | undefined;
    setVersion(value?: google_protobuf_wrappers_pb.StringValue): ActivityRequest;

    hasInput(): boolean;
    clearInput(): void;
    getInput(): google_protobuf_wrappers_pb.StringValue | undefined;
    setInput(value?: google_protobuf_wrappers_pb.StringValue): ActivityRequest;

    hasOrchestrationinstance(): boolean;
    clearOrchestrationinstance(): void;
    getOrchestrationinstance(): OrchestrationInstance | undefined;
    setOrchestrationinstance(value?: OrchestrationInstance): ActivityRequest;
    getTaskid(): number;
    setTaskid(value: number): ActivityRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ActivityRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ActivityRequest): ActivityRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ActivityRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ActivityRequest;
    static deserializeBinaryFromReader(message: ActivityRequest, reader: jspb.BinaryReader): ActivityRequest;
}

export namespace ActivityRequest {
    export type AsObject = {
        name: string,
        version?: google_protobuf_wrappers_pb.StringValue.AsObject,
        input?: google_protobuf_wrappers_pb.StringValue.AsObject,
        orchestrationinstance?: OrchestrationInstance.AsObject,
        taskid: number,
    }
}

export class ActivityResponse extends jspb.Message { 
    getInstanceid(): string;
    setInstanceid(value: string): ActivityResponse;
    getTaskid(): number;
    setTaskid(value: number): ActivityResponse;

    hasResult(): boolean;
    clearResult(): void;
    getResult(): google_protobuf_wrappers_pb.StringValue | undefined;
    setResult(value?: google_protobuf_wrappers_pb.StringValue): ActivityResponse;

    hasFailuredetails(): boolean;
    clearFailuredetails(): void;
    getFailuredetails(): TaskFailureDetails | undefined;
    setFailuredetails(value?: TaskFailureDetails): ActivityResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ActivityResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ActivityResponse): ActivityResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ActivityResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ActivityResponse;
    static deserializeBinaryFromReader(message: ActivityResponse, reader: jspb.BinaryReader): ActivityResponse;
}

export namespace ActivityResponse {
    export type AsObject = {
        instanceid: string,
        taskid: number,
        result?: google_protobuf_wrappers_pb.StringValue.AsObject,
        failuredetails?: TaskFailureDetails.AsObject,
    }
}

export class TaskFailureDetails extends jspb.Message { 
    getErrortype(): string;
    setErrortype(value: string): TaskFailureDetails;
    getErrormessage(): string;
    setErrormessage(value: string): TaskFailureDetails;

    hasStacktrace(): boolean;
    clearStacktrace(): void;
    getStacktrace(): google_protobuf_wrappers_pb.StringValue | undefined;
    setStacktrace(value?: google_protobuf_wrappers_pb.StringValue): TaskFailureDetails;

    hasInnerfailure(): boolean;
    clearInnerfailure(): void;
    getInnerfailure(): TaskFailureDetails | undefined;
    setInnerfailure(value?: TaskFailureDetails): TaskFailureDetails;
    getIsnonretriable(): boolean;
    setIsnonretriable(value: boolean): TaskFailureDetails;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TaskFailureDetails.AsObject;
    static toObject(includeInstance: boolean, msg: TaskFailureDetails): TaskFailureDetails.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TaskFailureDetails, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TaskFailureDetails;
    static deserializeBinaryFromReader(message: TaskFailureDetails, reader: jspb.BinaryReader): TaskFailureDetails;
}

export namespace TaskFailureDetails {
    export type AsObject = {
        errortype: string,
        errormessage: string,
        stacktrace?: google_protobuf_wrappers_pb.StringValue.AsObject,
        innerfailure?: TaskFailureDetails.AsObject,
        isnonretriable: boolean,
    }
}

export class ParentInstanceInfo extends jspb.Message { 
    getTaskscheduledid(): number;
    setTaskscheduledid(value: number): ParentInstanceInfo;

    hasName(): boolean;
    clearName(): void;
    getName(): google_protobuf_wrappers_pb.StringValue | undefined;
    setName(value?: google_protobuf_wrappers_pb.StringValue): ParentInstanceInfo;

    hasVersion(): boolean;
    clearVersion(): void;
    getVersion(): google_protobuf_wrappers_pb.StringValue | undefined;
    setVersion(value?: google_protobuf_wrappers_pb.StringValue): ParentInstanceInfo;

    hasOrchestrationinstance(): boolean;
    clearOrchestrationinstance(): void;
    getOrchestrationinstance(): OrchestrationInstance | undefined;
    setOrchestrationinstance(value?: OrchestrationInstance): ParentInstanceInfo;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ParentInstanceInfo.AsObject;
    static toObject(includeInstance: boolean, msg: ParentInstanceInfo): ParentInstanceInfo.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ParentInstanceInfo, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ParentInstanceInfo;
    static deserializeBinaryFromReader(message: ParentInstanceInfo, reader: jspb.BinaryReader): ParentInstanceInfo;
}

export namespace ParentInstanceInfo {
    export type AsObject = {
        taskscheduledid: number,
        name?: google_protobuf_wrappers_pb.StringValue.AsObject,
        version?: google_protobuf_wrappers_pb.StringValue.AsObject,
        orchestrationinstance?: OrchestrationInstance.AsObject,
    }
}

export class ExecutionStartedEvent extends jspb.Message { 
    getName(): string;
    setName(value: string): ExecutionStartedEvent;

    hasVersion(): boolean;
    clearVersion(): void;
    getVersion(): google_protobuf_wrappers_pb.StringValue | undefined;
    setVersion(value?: google_protobuf_wrappers_pb.StringValue): ExecutionStartedEvent;

    hasInput(): boolean;
    clearInput(): void;
    getInput(): google_protobuf_wrappers_pb.StringValue | undefined;
    setInput(value?: google_protobuf_wrappers_pb.StringValue): ExecutionStartedEvent;

    hasOrchestrationinstance(): boolean;
    clearOrchestrationinstance(): void;
    getOrchestrationinstance(): OrchestrationInstance | undefined;
    setOrchestrationinstance(value?: OrchestrationInstance): ExecutionStartedEvent;

    hasParentinstance(): boolean;
    clearParentinstance(): void;
    getParentinstance(): ParentInstanceInfo | undefined;
    setParentinstance(value?: ParentInstanceInfo): ExecutionStartedEvent;

    hasScheduledstarttimestamp(): boolean;
    clearScheduledstarttimestamp(): void;
    getScheduledstarttimestamp(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setScheduledstarttimestamp(value?: google_protobuf_timestamp_pb.Timestamp): ExecutionStartedEvent;

    hasCorrelationdata(): boolean;
    clearCorrelationdata(): void;
    getCorrelationdata(): google_protobuf_wrappers_pb.StringValue | undefined;
    setCorrelationdata(value?: google_protobuf_wrappers_pb.StringValue): ExecutionStartedEvent;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ExecutionStartedEvent.AsObject;
    static toObject(includeInstance: boolean, msg: ExecutionStartedEvent): ExecutionStartedEvent.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ExecutionStartedEvent, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ExecutionStartedEvent;
    static deserializeBinaryFromReader(message: ExecutionStartedEvent, reader: jspb.BinaryReader): ExecutionStartedEvent;
}

export namespace ExecutionStartedEvent {
    export type AsObject = {
        name: string,
        version?: google_protobuf_wrappers_pb.StringValue.AsObject,
        input?: google_protobuf_wrappers_pb.StringValue.AsObject,
        orchestrationinstance?: OrchestrationInstance.AsObject,
        parentinstance?: ParentInstanceInfo.AsObject,
        scheduledstarttimestamp?: google_protobuf_timestamp_pb.Timestamp.AsObject,
        correlationdata?: google_protobuf_wrappers_pb.StringValue.AsObject,
    }
}

export class ExecutionCompletedEvent extends jspb.Message { 
    getOrchestrationstatus(): OrchestrationStatus;
    setOrchestrationstatus(value: OrchestrationStatus): ExecutionCompletedEvent;

    hasResult(): boolean;
    clearResult(): void;
    getResult(): google_protobuf_wrappers_pb.StringValue | undefined;
    setResult(value?: google_protobuf_wrappers_pb.StringValue): ExecutionCompletedEvent;

    hasFailuredetails(): boolean;
    clearFailuredetails(): void;
    getFailuredetails(): TaskFailureDetails | undefined;
    setFailuredetails(value?: TaskFailureDetails): ExecutionCompletedEvent;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ExecutionCompletedEvent.AsObject;
    static toObject(includeInstance: boolean, msg: ExecutionCompletedEvent): ExecutionCompletedEvent.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ExecutionCompletedEvent, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ExecutionCompletedEvent;
    static deserializeBinaryFromReader(message: ExecutionCompletedEvent, reader: jspb.BinaryReader): ExecutionCompletedEvent;
}

export namespace ExecutionCompletedEvent {
    export type AsObject = {
        orchestrationstatus: OrchestrationStatus,
        result?: google_protobuf_wrappers_pb.StringValue.AsObject,
        failuredetails?: TaskFailureDetails.AsObject,
    }
}

export class ExecutionTerminatedEvent extends jspb.Message { 

    hasInput(): boolean;
    clearInput(): void;
    getInput(): google_protobuf_wrappers_pb.StringValue | undefined;
    setInput(value?: google_protobuf_wrappers_pb.StringValue): ExecutionTerminatedEvent;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ExecutionTerminatedEvent.AsObject;
    static toObject(includeInstance: boolean, msg: ExecutionTerminatedEvent): ExecutionTerminatedEvent.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ExecutionTerminatedEvent, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ExecutionTerminatedEvent;
    static deserializeBinaryFromReader(message: ExecutionTerminatedEvent, reader: jspb.BinaryReader): ExecutionTerminatedEvent;
}

export namespace ExecutionTerminatedEvent {
    export type AsObject = {
        input?: google_protobuf_wrappers_pb.StringValue.AsObject,
    }
}

export class TaskScheduledEvent extends jspb.Message { 
    getName(): string;
    setName(value: string): TaskScheduledEvent;

    hasVersion(): boolean;
    clearVersion(): void;
    getVersion(): google_protobuf_wrappers_pb.StringValue | undefined;
    setVersion(value?: google_protobuf_wrappers_pb.StringValue): TaskScheduledEvent;

    hasInput(): boolean;
    clearInput(): void;
    getInput(): google_protobuf_wrappers_pb.StringValue | undefined;
    setInput(value?: google_protobuf_wrappers_pb.StringValue): TaskScheduledEvent;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TaskScheduledEvent.AsObject;
    static toObject(includeInstance: boolean, msg: TaskScheduledEvent): TaskScheduledEvent.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TaskScheduledEvent, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TaskScheduledEvent;
    static deserializeBinaryFromReader(message: TaskScheduledEvent, reader: jspb.BinaryReader): TaskScheduledEvent;
}

export namespace TaskScheduledEvent {
    export type AsObject = {
        name: string,
        version?: google_protobuf_wrappers_pb.StringValue.AsObject,
        input?: google_protobuf_wrappers_pb.StringValue.AsObject,
    }
}

export class TaskCompletedEvent extends jspb.Message { 
    getTaskscheduledid(): number;
    setTaskscheduledid(value: number): TaskCompletedEvent;

    hasResult(): boolean;
    clearResult(): void;
    getResult(): google_protobuf_wrappers_pb.StringValue | undefined;
    setResult(value?: google_protobuf_wrappers_pb.StringValue): TaskCompletedEvent;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TaskCompletedEvent.AsObject;
    static toObject(includeInstance: boolean, msg: TaskCompletedEvent): TaskCompletedEvent.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TaskCompletedEvent, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TaskCompletedEvent;
    static deserializeBinaryFromReader(message: TaskCompletedEvent, reader: jspb.BinaryReader): TaskCompletedEvent;
}

export namespace TaskCompletedEvent {
    export type AsObject = {
        taskscheduledid: number,
        result?: google_protobuf_wrappers_pb.StringValue.AsObject,
    }
}

export class TaskFailedEvent extends jspb.Message { 
    getTaskscheduledid(): number;
    setTaskscheduledid(value: number): TaskFailedEvent;

    hasFailuredetails(): boolean;
    clearFailuredetails(): void;
    getFailuredetails(): TaskFailureDetails | undefined;
    setFailuredetails(value?: TaskFailureDetails): TaskFailedEvent;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TaskFailedEvent.AsObject;
    static toObject(includeInstance: boolean, msg: TaskFailedEvent): TaskFailedEvent.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TaskFailedEvent, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TaskFailedEvent;
    static deserializeBinaryFromReader(message: TaskFailedEvent, reader: jspb.BinaryReader): TaskFailedEvent;
}

export namespace TaskFailedEvent {
    export type AsObject = {
        taskscheduledid: number,
        failuredetails?: TaskFailureDetails.AsObject,
    }
}

export class SubOrchestrationInstanceCreatedEvent extends jspb.Message { 
    getInstanceid(): string;
    setInstanceid(value: string): SubOrchestrationInstanceCreatedEvent;
    getName(): string;
    setName(value: string): SubOrchestrationInstanceCreatedEvent;

    hasVersion(): boolean;
    clearVersion(): void;
    getVersion(): google_protobuf_wrappers_pb.StringValue | undefined;
    setVersion(value?: google_protobuf_wrappers_pb.StringValue): SubOrchestrationInstanceCreatedEvent;

    hasInput(): boolean;
    clearInput(): void;
    getInput(): google_protobuf_wrappers_pb.StringValue | undefined;
    setInput(value?: google_protobuf_wrappers_pb.StringValue): SubOrchestrationInstanceCreatedEvent;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SubOrchestrationInstanceCreatedEvent.AsObject;
    static toObject(includeInstance: boolean, msg: SubOrchestrationInstanceCreatedEvent): SubOrchestrationInstanceCreatedEvent.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SubOrchestrationInstanceCreatedEvent, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SubOrchestrationInstanceCreatedEvent;
    static deserializeBinaryFromReader(message: SubOrchestrationInstanceCreatedEvent, reader: jspb.BinaryReader): SubOrchestrationInstanceCreatedEvent;
}

export namespace SubOrchestrationInstanceCreatedEvent {
    export type AsObject = {
        instanceid: string,
        name: string,
        version?: google_protobuf_wrappers_pb.StringValue.AsObject,
        input?: google_protobuf_wrappers_pb.StringValue.AsObject,
    }
}

export class SubOrchestrationInstanceCompletedEvent extends jspb.Message { 
    getTaskscheduledid(): number;
    setTaskscheduledid(value: number): SubOrchestrationInstanceCompletedEvent;

    hasResult(): boolean;
    clearResult(): void;
    getResult(): google_protobuf_wrappers_pb.StringValue | undefined;
    setResult(value?: google_protobuf_wrappers_pb.StringValue): SubOrchestrationInstanceCompletedEvent;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SubOrchestrationInstanceCompletedEvent.AsObject;
    static toObject(includeInstance: boolean, msg: SubOrchestrationInstanceCompletedEvent): SubOrchestrationInstanceCompletedEvent.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SubOrchestrationInstanceCompletedEvent, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SubOrchestrationInstanceCompletedEvent;
    static deserializeBinaryFromReader(message: SubOrchestrationInstanceCompletedEvent, reader: jspb.BinaryReader): SubOrchestrationInstanceCompletedEvent;
}

export namespace SubOrchestrationInstanceCompletedEvent {
    export type AsObject = {
        taskscheduledid: number,
        result?: google_protobuf_wrappers_pb.StringValue.AsObject,
    }
}

export class SubOrchestrationInstanceFailedEvent extends jspb.Message { 
    getTaskscheduledid(): number;
    setTaskscheduledid(value: number): SubOrchestrationInstanceFailedEvent;

    hasFailuredetails(): boolean;
    clearFailuredetails(): void;
    getFailuredetails(): TaskFailureDetails | undefined;
    setFailuredetails(value?: TaskFailureDetails): SubOrchestrationInstanceFailedEvent;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SubOrchestrationInstanceFailedEvent.AsObject;
    static toObject(includeInstance: boolean, msg: SubOrchestrationInstanceFailedEvent): SubOrchestrationInstanceFailedEvent.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SubOrchestrationInstanceFailedEvent, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SubOrchestrationInstanceFailedEvent;
    static deserializeBinaryFromReader(message: SubOrchestrationInstanceFailedEvent, reader: jspb.BinaryReader): SubOrchestrationInstanceFailedEvent;
}

export namespace SubOrchestrationInstanceFailedEvent {
    export type AsObject = {
        taskscheduledid: number,
        failuredetails?: TaskFailureDetails.AsObject,
    }
}

export class TimerCreatedEvent extends jspb.Message { 

    hasFireat(): boolean;
    clearFireat(): void;
    getFireat(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setFireat(value?: google_protobuf_timestamp_pb.Timestamp): TimerCreatedEvent;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TimerCreatedEvent.AsObject;
    static toObject(includeInstance: boolean, msg: TimerCreatedEvent): TimerCreatedEvent.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TimerCreatedEvent, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TimerCreatedEvent;
    static deserializeBinaryFromReader(message: TimerCreatedEvent, reader: jspb.BinaryReader): TimerCreatedEvent;
}

export namespace TimerCreatedEvent {
    export type AsObject = {
        fireat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    }
}

export class TimerFiredEvent extends jspb.Message { 

    hasFireat(): boolean;
    clearFireat(): void;
    getFireat(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setFireat(value?: google_protobuf_timestamp_pb.Timestamp): TimerFiredEvent;
    getTimerid(): number;
    setTimerid(value: number): TimerFiredEvent;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TimerFiredEvent.AsObject;
    static toObject(includeInstance: boolean, msg: TimerFiredEvent): TimerFiredEvent.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TimerFiredEvent, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TimerFiredEvent;
    static deserializeBinaryFromReader(message: TimerFiredEvent, reader: jspb.BinaryReader): TimerFiredEvent;
}

export namespace TimerFiredEvent {
    export type AsObject = {
        fireat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
        timerid: number,
    }
}

export class OrchestratorStartedEvent extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): OrchestratorStartedEvent.AsObject;
    static toObject(includeInstance: boolean, msg: OrchestratorStartedEvent): OrchestratorStartedEvent.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: OrchestratorStartedEvent, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): OrchestratorStartedEvent;
    static deserializeBinaryFromReader(message: OrchestratorStartedEvent, reader: jspb.BinaryReader): OrchestratorStartedEvent;
}

export namespace OrchestratorStartedEvent {
    export type AsObject = {
    }
}

export class OrchestratorCompletedEvent extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): OrchestratorCompletedEvent.AsObject;
    static toObject(includeInstance: boolean, msg: OrchestratorCompletedEvent): OrchestratorCompletedEvent.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: OrchestratorCompletedEvent, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): OrchestratorCompletedEvent;
    static deserializeBinaryFromReader(message: OrchestratorCompletedEvent, reader: jspb.BinaryReader): OrchestratorCompletedEvent;
}

export namespace OrchestratorCompletedEvent {
    export type AsObject = {
    }
}

export class EventSentEvent extends jspb.Message { 
    getInstanceid(): string;
    setInstanceid(value: string): EventSentEvent;
    getName(): string;
    setName(value: string): EventSentEvent;

    hasInput(): boolean;
    clearInput(): void;
    getInput(): google_protobuf_wrappers_pb.StringValue | undefined;
    setInput(value?: google_protobuf_wrappers_pb.StringValue): EventSentEvent;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): EventSentEvent.AsObject;
    static toObject(includeInstance: boolean, msg: EventSentEvent): EventSentEvent.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: EventSentEvent, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): EventSentEvent;
    static deserializeBinaryFromReader(message: EventSentEvent, reader: jspb.BinaryReader): EventSentEvent;
}

export namespace EventSentEvent {
    export type AsObject = {
        instanceid: string,
        name: string,
        input?: google_protobuf_wrappers_pb.StringValue.AsObject,
    }
}

export class EventRaisedEvent extends jspb.Message { 
    getName(): string;
    setName(value: string): EventRaisedEvent;

    hasInput(): boolean;
    clearInput(): void;
    getInput(): google_protobuf_wrappers_pb.StringValue | undefined;
    setInput(value?: google_protobuf_wrappers_pb.StringValue): EventRaisedEvent;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): EventRaisedEvent.AsObject;
    static toObject(includeInstance: boolean, msg: EventRaisedEvent): EventRaisedEvent.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: EventRaisedEvent, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): EventRaisedEvent;
    static deserializeBinaryFromReader(message: EventRaisedEvent, reader: jspb.BinaryReader): EventRaisedEvent;
}

export namespace EventRaisedEvent {
    export type AsObject = {
        name: string,
        input?: google_protobuf_wrappers_pb.StringValue.AsObject,
    }
}

export class GenericEvent extends jspb.Message { 
    getData(): string;
    setData(value: string): GenericEvent;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GenericEvent.AsObject;
    static toObject(includeInstance: boolean, msg: GenericEvent): GenericEvent.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GenericEvent, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GenericEvent;
    static deserializeBinaryFromReader(message: GenericEvent, reader: jspb.BinaryReader): GenericEvent;
}

export namespace GenericEvent {
    export type AsObject = {
        data: string,
    }
}

export class HistoryStateEvent extends jspb.Message { 

    hasOrchestrationstate(): boolean;
    clearOrchestrationstate(): void;
    getOrchestrationstate(): OrchestrationState | undefined;
    setOrchestrationstate(value?: OrchestrationState): HistoryStateEvent;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): HistoryStateEvent.AsObject;
    static toObject(includeInstance: boolean, msg: HistoryStateEvent): HistoryStateEvent.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: HistoryStateEvent, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): HistoryStateEvent;
    static deserializeBinaryFromReader(message: HistoryStateEvent, reader: jspb.BinaryReader): HistoryStateEvent;
}

export namespace HistoryStateEvent {
    export type AsObject = {
        orchestrationstate?: OrchestrationState.AsObject,
    }
}

export class ContinueAsNewEvent extends jspb.Message { 

    hasInput(): boolean;
    clearInput(): void;
    getInput(): google_protobuf_wrappers_pb.StringValue | undefined;
    setInput(value?: google_protobuf_wrappers_pb.StringValue): ContinueAsNewEvent;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ContinueAsNewEvent.AsObject;
    static toObject(includeInstance: boolean, msg: ContinueAsNewEvent): ContinueAsNewEvent.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ContinueAsNewEvent, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ContinueAsNewEvent;
    static deserializeBinaryFromReader(message: ContinueAsNewEvent, reader: jspb.BinaryReader): ContinueAsNewEvent;
}

export namespace ContinueAsNewEvent {
    export type AsObject = {
        input?: google_protobuf_wrappers_pb.StringValue.AsObject,
    }
}

export class ExecutionSuspendedEvent extends jspb.Message { 

    hasInput(): boolean;
    clearInput(): void;
    getInput(): google_protobuf_wrappers_pb.StringValue | undefined;
    setInput(value?: google_protobuf_wrappers_pb.StringValue): ExecutionSuspendedEvent;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ExecutionSuspendedEvent.AsObject;
    static toObject(includeInstance: boolean, msg: ExecutionSuspendedEvent): ExecutionSuspendedEvent.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ExecutionSuspendedEvent, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ExecutionSuspendedEvent;
    static deserializeBinaryFromReader(message: ExecutionSuspendedEvent, reader: jspb.BinaryReader): ExecutionSuspendedEvent;
}

export namespace ExecutionSuspendedEvent {
    export type AsObject = {
        input?: google_protobuf_wrappers_pb.StringValue.AsObject,
    }
}

export class ExecutionResumedEvent extends jspb.Message { 

    hasInput(): boolean;
    clearInput(): void;
    getInput(): google_protobuf_wrappers_pb.StringValue | undefined;
    setInput(value?: google_protobuf_wrappers_pb.StringValue): ExecutionResumedEvent;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ExecutionResumedEvent.AsObject;
    static toObject(includeInstance: boolean, msg: ExecutionResumedEvent): ExecutionResumedEvent.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ExecutionResumedEvent, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ExecutionResumedEvent;
    static deserializeBinaryFromReader(message: ExecutionResumedEvent, reader: jspb.BinaryReader): ExecutionResumedEvent;
}

export namespace ExecutionResumedEvent {
    export type AsObject = {
        input?: google_protobuf_wrappers_pb.StringValue.AsObject,
    }
}

export class HistoryEvent extends jspb.Message { 
    getEventid(): number;
    setEventid(value: number): HistoryEvent;

    hasTimestamp(): boolean;
    clearTimestamp(): void;
    getTimestamp(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setTimestamp(value?: google_protobuf_timestamp_pb.Timestamp): HistoryEvent;

    hasExecutionstarted(): boolean;
    clearExecutionstarted(): void;
    getExecutionstarted(): ExecutionStartedEvent | undefined;
    setExecutionstarted(value?: ExecutionStartedEvent): HistoryEvent;

    hasExecutioncompleted(): boolean;
    clearExecutioncompleted(): void;
    getExecutioncompleted(): ExecutionCompletedEvent | undefined;
    setExecutioncompleted(value?: ExecutionCompletedEvent): HistoryEvent;

    hasExecutionterminated(): boolean;
    clearExecutionterminated(): void;
    getExecutionterminated(): ExecutionTerminatedEvent | undefined;
    setExecutionterminated(value?: ExecutionTerminatedEvent): HistoryEvent;

    hasTaskscheduled(): boolean;
    clearTaskscheduled(): void;
    getTaskscheduled(): TaskScheduledEvent | undefined;
    setTaskscheduled(value?: TaskScheduledEvent): HistoryEvent;

    hasTaskcompleted(): boolean;
    clearTaskcompleted(): void;
    getTaskcompleted(): TaskCompletedEvent | undefined;
    setTaskcompleted(value?: TaskCompletedEvent): HistoryEvent;

    hasTaskfailed(): boolean;
    clearTaskfailed(): void;
    getTaskfailed(): TaskFailedEvent | undefined;
    setTaskfailed(value?: TaskFailedEvent): HistoryEvent;

    hasSuborchestrationinstancecreated(): boolean;
    clearSuborchestrationinstancecreated(): void;
    getSuborchestrationinstancecreated(): SubOrchestrationInstanceCreatedEvent | undefined;
    setSuborchestrationinstancecreated(value?: SubOrchestrationInstanceCreatedEvent): HistoryEvent;

    hasSuborchestrationinstancecompleted(): boolean;
    clearSuborchestrationinstancecompleted(): void;
    getSuborchestrationinstancecompleted(): SubOrchestrationInstanceCompletedEvent | undefined;
    setSuborchestrationinstancecompleted(value?: SubOrchestrationInstanceCompletedEvent): HistoryEvent;

    hasSuborchestrationinstancefailed(): boolean;
    clearSuborchestrationinstancefailed(): void;
    getSuborchestrationinstancefailed(): SubOrchestrationInstanceFailedEvent | undefined;
    setSuborchestrationinstancefailed(value?: SubOrchestrationInstanceFailedEvent): HistoryEvent;

    hasTimercreated(): boolean;
    clearTimercreated(): void;
    getTimercreated(): TimerCreatedEvent | undefined;
    setTimercreated(value?: TimerCreatedEvent): HistoryEvent;

    hasTimerfired(): boolean;
    clearTimerfired(): void;
    getTimerfired(): TimerFiredEvent | undefined;
    setTimerfired(value?: TimerFiredEvent): HistoryEvent;

    hasOrchestratorstarted(): boolean;
    clearOrchestratorstarted(): void;
    getOrchestratorstarted(): OrchestratorStartedEvent | undefined;
    setOrchestratorstarted(value?: OrchestratorStartedEvent): HistoryEvent;

    hasOrchestratorcompleted(): boolean;
    clearOrchestratorcompleted(): void;
    getOrchestratorcompleted(): OrchestratorCompletedEvent | undefined;
    setOrchestratorcompleted(value?: OrchestratorCompletedEvent): HistoryEvent;

    hasEventsent(): boolean;
    clearEventsent(): void;
    getEventsent(): EventSentEvent | undefined;
    setEventsent(value?: EventSentEvent): HistoryEvent;

    hasEventraised(): boolean;
    clearEventraised(): void;
    getEventraised(): EventRaisedEvent | undefined;
    setEventraised(value?: EventRaisedEvent): HistoryEvent;

    hasGenericevent(): boolean;
    clearGenericevent(): void;
    getGenericevent(): GenericEvent | undefined;
    setGenericevent(value?: GenericEvent): HistoryEvent;

    hasHistorystate(): boolean;
    clearHistorystate(): void;
    getHistorystate(): HistoryStateEvent | undefined;
    setHistorystate(value?: HistoryStateEvent): HistoryEvent;

    hasContinueasnew(): boolean;
    clearContinueasnew(): void;
    getContinueasnew(): ContinueAsNewEvent | undefined;
    setContinueasnew(value?: ContinueAsNewEvent): HistoryEvent;

    hasExecutionsuspended(): boolean;
    clearExecutionsuspended(): void;
    getExecutionsuspended(): ExecutionSuspendedEvent | undefined;
    setExecutionsuspended(value?: ExecutionSuspendedEvent): HistoryEvent;

    hasExecutionresumed(): boolean;
    clearExecutionresumed(): void;
    getExecutionresumed(): ExecutionResumedEvent | undefined;
    setExecutionresumed(value?: ExecutionResumedEvent): HistoryEvent;

    getEventtypeCase(): HistoryEvent.EventtypeCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): HistoryEvent.AsObject;
    static toObject(includeInstance: boolean, msg: HistoryEvent): HistoryEvent.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: HistoryEvent, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): HistoryEvent;
    static deserializeBinaryFromReader(message: HistoryEvent, reader: jspb.BinaryReader): HistoryEvent;
}

export namespace HistoryEvent {
    export type AsObject = {
        eventid: number,
        timestamp?: google_protobuf_timestamp_pb.Timestamp.AsObject,
        executionstarted?: ExecutionStartedEvent.AsObject,
        executioncompleted?: ExecutionCompletedEvent.AsObject,
        executionterminated?: ExecutionTerminatedEvent.AsObject,
        taskscheduled?: TaskScheduledEvent.AsObject,
        taskcompleted?: TaskCompletedEvent.AsObject,
        taskfailed?: TaskFailedEvent.AsObject,
        suborchestrationinstancecreated?: SubOrchestrationInstanceCreatedEvent.AsObject,
        suborchestrationinstancecompleted?: SubOrchestrationInstanceCompletedEvent.AsObject,
        suborchestrationinstancefailed?: SubOrchestrationInstanceFailedEvent.AsObject,
        timercreated?: TimerCreatedEvent.AsObject,
        timerfired?: TimerFiredEvent.AsObject,
        orchestratorstarted?: OrchestratorStartedEvent.AsObject,
        orchestratorcompleted?: OrchestratorCompletedEvent.AsObject,
        eventsent?: EventSentEvent.AsObject,
        eventraised?: EventRaisedEvent.AsObject,
        genericevent?: GenericEvent.AsObject,
        historystate?: HistoryStateEvent.AsObject,
        continueasnew?: ContinueAsNewEvent.AsObject,
        executionsuspended?: ExecutionSuspendedEvent.AsObject,
        executionresumed?: ExecutionResumedEvent.AsObject,
    }

    export enum EventtypeCase {
        EVENTTYPE_NOT_SET = 0,
        EXECUTIONSTARTED = 3,
        EXECUTIONCOMPLETED = 4,
        EXECUTIONTERMINATED = 5,
        TASKSCHEDULED = 6,
        TASKCOMPLETED = 7,
        TASKFAILED = 8,
        SUBORCHESTRATIONINSTANCECREATED = 9,
        SUBORCHESTRATIONINSTANCECOMPLETED = 10,
        SUBORCHESTRATIONINSTANCEFAILED = 11,
        TIMERCREATED = 12,
        TIMERFIRED = 13,
        ORCHESTRATORSTARTED = 14,
        ORCHESTRATORCOMPLETED = 15,
        EVENTSENT = 16,
        EVENTRAISED = 17,
        GENERICEVENT = 18,
        HISTORYSTATE = 19,
        CONTINUEASNEW = 20,
        EXECUTIONSUSPENDED = 21,
        EXECUTIONRESUMED = 22,
    }

}

export class ScheduleTaskAction extends jspb.Message { 
    getName(): string;
    setName(value: string): ScheduleTaskAction;

    hasVersion(): boolean;
    clearVersion(): void;
    getVersion(): google_protobuf_wrappers_pb.StringValue | undefined;
    setVersion(value?: google_protobuf_wrappers_pb.StringValue): ScheduleTaskAction;

    hasInput(): boolean;
    clearInput(): void;
    getInput(): google_protobuf_wrappers_pb.StringValue | undefined;
    setInput(value?: google_protobuf_wrappers_pb.StringValue): ScheduleTaskAction;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ScheduleTaskAction.AsObject;
    static toObject(includeInstance: boolean, msg: ScheduleTaskAction): ScheduleTaskAction.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ScheduleTaskAction, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ScheduleTaskAction;
    static deserializeBinaryFromReader(message: ScheduleTaskAction, reader: jspb.BinaryReader): ScheduleTaskAction;
}

export namespace ScheduleTaskAction {
    export type AsObject = {
        name: string,
        version?: google_protobuf_wrappers_pb.StringValue.AsObject,
        input?: google_protobuf_wrappers_pb.StringValue.AsObject,
    }
}

export class CreateSubOrchestrationAction extends jspb.Message { 
    getInstanceid(): string;
    setInstanceid(value: string): CreateSubOrchestrationAction;
    getName(): string;
    setName(value: string): CreateSubOrchestrationAction;

    hasVersion(): boolean;
    clearVersion(): void;
    getVersion(): google_protobuf_wrappers_pb.StringValue | undefined;
    setVersion(value?: google_protobuf_wrappers_pb.StringValue): CreateSubOrchestrationAction;

    hasInput(): boolean;
    clearInput(): void;
    getInput(): google_protobuf_wrappers_pb.StringValue | undefined;
    setInput(value?: google_protobuf_wrappers_pb.StringValue): CreateSubOrchestrationAction;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CreateSubOrchestrationAction.AsObject;
    static toObject(includeInstance: boolean, msg: CreateSubOrchestrationAction): CreateSubOrchestrationAction.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CreateSubOrchestrationAction, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CreateSubOrchestrationAction;
    static deserializeBinaryFromReader(message: CreateSubOrchestrationAction, reader: jspb.BinaryReader): CreateSubOrchestrationAction;
}

export namespace CreateSubOrchestrationAction {
    export type AsObject = {
        instanceid: string,
        name: string,
        version?: google_protobuf_wrappers_pb.StringValue.AsObject,
        input?: google_protobuf_wrappers_pb.StringValue.AsObject,
    }
}

export class CreateTimerAction extends jspb.Message { 

    hasFireat(): boolean;
    clearFireat(): void;
    getFireat(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setFireat(value?: google_protobuf_timestamp_pb.Timestamp): CreateTimerAction;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CreateTimerAction.AsObject;
    static toObject(includeInstance: boolean, msg: CreateTimerAction): CreateTimerAction.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CreateTimerAction, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CreateTimerAction;
    static deserializeBinaryFromReader(message: CreateTimerAction, reader: jspb.BinaryReader): CreateTimerAction;
}

export namespace CreateTimerAction {
    export type AsObject = {
        fireat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    }
}

export class SendEventAction extends jspb.Message { 

    hasInstance(): boolean;
    clearInstance(): void;
    getInstance(): OrchestrationInstance | undefined;
    setInstance(value?: OrchestrationInstance): SendEventAction;
    getName(): string;
    setName(value: string): SendEventAction;

    hasData(): boolean;
    clearData(): void;
    getData(): google_protobuf_wrappers_pb.StringValue | undefined;
    setData(value?: google_protobuf_wrappers_pb.StringValue): SendEventAction;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SendEventAction.AsObject;
    static toObject(includeInstance: boolean, msg: SendEventAction): SendEventAction.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SendEventAction, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SendEventAction;
    static deserializeBinaryFromReader(message: SendEventAction, reader: jspb.BinaryReader): SendEventAction;
}

export namespace SendEventAction {
    export type AsObject = {
        instance?: OrchestrationInstance.AsObject,
        name: string,
        data?: google_protobuf_wrappers_pb.StringValue.AsObject,
    }
}

export class CompleteOrchestrationAction extends jspb.Message { 
    getOrchestrationstatus(): OrchestrationStatus;
    setOrchestrationstatus(value: OrchestrationStatus): CompleteOrchestrationAction;

    hasResult(): boolean;
    clearResult(): void;
    getResult(): google_protobuf_wrappers_pb.StringValue | undefined;
    setResult(value?: google_protobuf_wrappers_pb.StringValue): CompleteOrchestrationAction;

    hasDetails(): boolean;
    clearDetails(): void;
    getDetails(): google_protobuf_wrappers_pb.StringValue | undefined;
    setDetails(value?: google_protobuf_wrappers_pb.StringValue): CompleteOrchestrationAction;

    hasNewversion(): boolean;
    clearNewversion(): void;
    getNewversion(): google_protobuf_wrappers_pb.StringValue | undefined;
    setNewversion(value?: google_protobuf_wrappers_pb.StringValue): CompleteOrchestrationAction;
    clearCarryovereventsList(): void;
    getCarryovereventsList(): Array<HistoryEvent>;
    setCarryovereventsList(value: Array<HistoryEvent>): CompleteOrchestrationAction;
    addCarryoverevents(value?: HistoryEvent, index?: number): HistoryEvent;

    hasFailuredetails(): boolean;
    clearFailuredetails(): void;
    getFailuredetails(): TaskFailureDetails | undefined;
    setFailuredetails(value?: TaskFailureDetails): CompleteOrchestrationAction;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CompleteOrchestrationAction.AsObject;
    static toObject(includeInstance: boolean, msg: CompleteOrchestrationAction): CompleteOrchestrationAction.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CompleteOrchestrationAction, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CompleteOrchestrationAction;
    static deserializeBinaryFromReader(message: CompleteOrchestrationAction, reader: jspb.BinaryReader): CompleteOrchestrationAction;
}

export namespace CompleteOrchestrationAction {
    export type AsObject = {
        orchestrationstatus: OrchestrationStatus,
        result?: google_protobuf_wrappers_pb.StringValue.AsObject,
        details?: google_protobuf_wrappers_pb.StringValue.AsObject,
        newversion?: google_protobuf_wrappers_pb.StringValue.AsObject,
        carryovereventsList: Array<HistoryEvent.AsObject>,
        failuredetails?: TaskFailureDetails.AsObject,
    }
}

export class OrchestratorAction extends jspb.Message { 
    getId(): number;
    setId(value: number): OrchestratorAction;

    hasScheduletask(): boolean;
    clearScheduletask(): void;
    getScheduletask(): ScheduleTaskAction | undefined;
    setScheduletask(value?: ScheduleTaskAction): OrchestratorAction;

    hasCreatesuborchestration(): boolean;
    clearCreatesuborchestration(): void;
    getCreatesuborchestration(): CreateSubOrchestrationAction | undefined;
    setCreatesuborchestration(value?: CreateSubOrchestrationAction): OrchestratorAction;

    hasCreatetimer(): boolean;
    clearCreatetimer(): void;
    getCreatetimer(): CreateTimerAction | undefined;
    setCreatetimer(value?: CreateTimerAction): OrchestratorAction;

    hasSendevent(): boolean;
    clearSendevent(): void;
    getSendevent(): SendEventAction | undefined;
    setSendevent(value?: SendEventAction): OrchestratorAction;

    hasCompleteorchestration(): boolean;
    clearCompleteorchestration(): void;
    getCompleteorchestration(): CompleteOrchestrationAction | undefined;
    setCompleteorchestration(value?: CompleteOrchestrationAction): OrchestratorAction;

    getOrchestratoractiontypeCase(): OrchestratorAction.OrchestratoractiontypeCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): OrchestratorAction.AsObject;
    static toObject(includeInstance: boolean, msg: OrchestratorAction): OrchestratorAction.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: OrchestratorAction, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): OrchestratorAction;
    static deserializeBinaryFromReader(message: OrchestratorAction, reader: jspb.BinaryReader): OrchestratorAction;
}

export namespace OrchestratorAction {
    export type AsObject = {
        id: number,
        scheduletask?: ScheduleTaskAction.AsObject,
        createsuborchestration?: CreateSubOrchestrationAction.AsObject,
        createtimer?: CreateTimerAction.AsObject,
        sendevent?: SendEventAction.AsObject,
        completeorchestration?: CompleteOrchestrationAction.AsObject,
    }

    export enum OrchestratoractiontypeCase {
        ORCHESTRATORACTIONTYPE_NOT_SET = 0,
        SCHEDULETASK = 2,
        CREATESUBORCHESTRATION = 3,
        CREATETIMER = 4,
        SENDEVENT = 5,
        COMPLETEORCHESTRATION = 6,
    }

}

export class OrchestratorRequest extends jspb.Message { 
    getInstanceid(): string;
    setInstanceid(value: string): OrchestratorRequest;

    hasExecutionid(): boolean;
    clearExecutionid(): void;
    getExecutionid(): google_protobuf_wrappers_pb.StringValue | undefined;
    setExecutionid(value?: google_protobuf_wrappers_pb.StringValue): OrchestratorRequest;
    clearPasteventsList(): void;
    getPasteventsList(): Array<HistoryEvent>;
    setPasteventsList(value: Array<HistoryEvent>): OrchestratorRequest;
    addPastevents(value?: HistoryEvent, index?: number): HistoryEvent;
    clearNeweventsList(): void;
    getNeweventsList(): Array<HistoryEvent>;
    setNeweventsList(value: Array<HistoryEvent>): OrchestratorRequest;
    addNewevents(value?: HistoryEvent, index?: number): HistoryEvent;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): OrchestratorRequest.AsObject;
    static toObject(includeInstance: boolean, msg: OrchestratorRequest): OrchestratorRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: OrchestratorRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): OrchestratorRequest;
    static deserializeBinaryFromReader(message: OrchestratorRequest, reader: jspb.BinaryReader): OrchestratorRequest;
}

export namespace OrchestratorRequest {
    export type AsObject = {
        instanceid: string,
        executionid?: google_protobuf_wrappers_pb.StringValue.AsObject,
        pasteventsList: Array<HistoryEvent.AsObject>,
        neweventsList: Array<HistoryEvent.AsObject>,
    }
}

export class OrchestratorResponse extends jspb.Message { 
    getInstanceid(): string;
    setInstanceid(value: string): OrchestratorResponse;
    clearActionsList(): void;
    getActionsList(): Array<OrchestratorAction>;
    setActionsList(value: Array<OrchestratorAction>): OrchestratorResponse;
    addActions(value?: OrchestratorAction, index?: number): OrchestratorAction;

    hasCustomstatus(): boolean;
    clearCustomstatus(): void;
    getCustomstatus(): google_protobuf_wrappers_pb.StringValue | undefined;
    setCustomstatus(value?: google_protobuf_wrappers_pb.StringValue): OrchestratorResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): OrchestratorResponse.AsObject;
    static toObject(includeInstance: boolean, msg: OrchestratorResponse): OrchestratorResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: OrchestratorResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): OrchestratorResponse;
    static deserializeBinaryFromReader(message: OrchestratorResponse, reader: jspb.BinaryReader): OrchestratorResponse;
}

export namespace OrchestratorResponse {
    export type AsObject = {
        instanceid: string,
        actionsList: Array<OrchestratorAction.AsObject>,
        customstatus?: google_protobuf_wrappers_pb.StringValue.AsObject,
    }
}

export class CreateInstanceRequest extends jspb.Message { 
    getInstanceid(): string;
    setInstanceid(value: string): CreateInstanceRequest;
    getName(): string;
    setName(value: string): CreateInstanceRequest;

    hasVersion(): boolean;
    clearVersion(): void;
    getVersion(): google_protobuf_wrappers_pb.StringValue | undefined;
    setVersion(value?: google_protobuf_wrappers_pb.StringValue): CreateInstanceRequest;

    hasInput(): boolean;
    clearInput(): void;
    getInput(): google_protobuf_wrappers_pb.StringValue | undefined;
    setInput(value?: google_protobuf_wrappers_pb.StringValue): CreateInstanceRequest;

    hasScheduledstarttimestamp(): boolean;
    clearScheduledstarttimestamp(): void;
    getScheduledstarttimestamp(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setScheduledstarttimestamp(value?: google_protobuf_timestamp_pb.Timestamp): CreateInstanceRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CreateInstanceRequest.AsObject;
    static toObject(includeInstance: boolean, msg: CreateInstanceRequest): CreateInstanceRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CreateInstanceRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CreateInstanceRequest;
    static deserializeBinaryFromReader(message: CreateInstanceRequest, reader: jspb.BinaryReader): CreateInstanceRequest;
}

export namespace CreateInstanceRequest {
    export type AsObject = {
        instanceid: string,
        name: string,
        version?: google_protobuf_wrappers_pb.StringValue.AsObject,
        input?: google_protobuf_wrappers_pb.StringValue.AsObject,
        scheduledstarttimestamp?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    }
}

export class CreateInstanceResponse extends jspb.Message { 
    getInstanceid(): string;
    setInstanceid(value: string): CreateInstanceResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CreateInstanceResponse.AsObject;
    static toObject(includeInstance: boolean, msg: CreateInstanceResponse): CreateInstanceResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CreateInstanceResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CreateInstanceResponse;
    static deserializeBinaryFromReader(message: CreateInstanceResponse, reader: jspb.BinaryReader): CreateInstanceResponse;
}

export namespace CreateInstanceResponse {
    export type AsObject = {
        instanceid: string,
    }
}

export class GetInstanceRequest extends jspb.Message { 
    getInstanceid(): string;
    setInstanceid(value: string): GetInstanceRequest;
    getGetinputsandoutputs(): boolean;
    setGetinputsandoutputs(value: boolean): GetInstanceRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetInstanceRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetInstanceRequest): GetInstanceRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetInstanceRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetInstanceRequest;
    static deserializeBinaryFromReader(message: GetInstanceRequest, reader: jspb.BinaryReader): GetInstanceRequest;
}

export namespace GetInstanceRequest {
    export type AsObject = {
        instanceid: string,
        getinputsandoutputs: boolean,
    }
}

export class GetInstanceResponse extends jspb.Message { 
    getExists(): boolean;
    setExists(value: boolean): GetInstanceResponse;

    hasOrchestrationstate(): boolean;
    clearOrchestrationstate(): void;
    getOrchestrationstate(): OrchestrationState | undefined;
    setOrchestrationstate(value?: OrchestrationState): GetInstanceResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetInstanceResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetInstanceResponse): GetInstanceResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetInstanceResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetInstanceResponse;
    static deserializeBinaryFromReader(message: GetInstanceResponse, reader: jspb.BinaryReader): GetInstanceResponse;
}

export namespace GetInstanceResponse {
    export type AsObject = {
        exists: boolean,
        orchestrationstate?: OrchestrationState.AsObject,
    }
}

export class RewindInstanceRequest extends jspb.Message { 
    getInstanceid(): string;
    setInstanceid(value: string): RewindInstanceRequest;

    hasReason(): boolean;
    clearReason(): void;
    getReason(): google_protobuf_wrappers_pb.StringValue | undefined;
    setReason(value?: google_protobuf_wrappers_pb.StringValue): RewindInstanceRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RewindInstanceRequest.AsObject;
    static toObject(includeInstance: boolean, msg: RewindInstanceRequest): RewindInstanceRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RewindInstanceRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RewindInstanceRequest;
    static deserializeBinaryFromReader(message: RewindInstanceRequest, reader: jspb.BinaryReader): RewindInstanceRequest;
}

export namespace RewindInstanceRequest {
    export type AsObject = {
        instanceid: string,
        reason?: google_protobuf_wrappers_pb.StringValue.AsObject,
    }
}

export class RewindInstanceResponse extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RewindInstanceResponse.AsObject;
    static toObject(includeInstance: boolean, msg: RewindInstanceResponse): RewindInstanceResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RewindInstanceResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RewindInstanceResponse;
    static deserializeBinaryFromReader(message: RewindInstanceResponse, reader: jspb.BinaryReader): RewindInstanceResponse;
}

export namespace RewindInstanceResponse {
    export type AsObject = {
    }
}

export class OrchestrationState extends jspb.Message { 
    getInstanceid(): string;
    setInstanceid(value: string): OrchestrationState;
    getName(): string;
    setName(value: string): OrchestrationState;

    hasVersion(): boolean;
    clearVersion(): void;
    getVersion(): google_protobuf_wrappers_pb.StringValue | undefined;
    setVersion(value?: google_protobuf_wrappers_pb.StringValue): OrchestrationState;
    getOrchestrationstatus(): OrchestrationStatus;
    setOrchestrationstatus(value: OrchestrationStatus): OrchestrationState;

    hasScheduledstarttimestamp(): boolean;
    clearScheduledstarttimestamp(): void;
    getScheduledstarttimestamp(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setScheduledstarttimestamp(value?: google_protobuf_timestamp_pb.Timestamp): OrchestrationState;

    hasCreatedtimestamp(): boolean;
    clearCreatedtimestamp(): void;
    getCreatedtimestamp(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setCreatedtimestamp(value?: google_protobuf_timestamp_pb.Timestamp): OrchestrationState;

    hasLastupdatedtimestamp(): boolean;
    clearLastupdatedtimestamp(): void;
    getLastupdatedtimestamp(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setLastupdatedtimestamp(value?: google_protobuf_timestamp_pb.Timestamp): OrchestrationState;

    hasInput(): boolean;
    clearInput(): void;
    getInput(): google_protobuf_wrappers_pb.StringValue | undefined;
    setInput(value?: google_protobuf_wrappers_pb.StringValue): OrchestrationState;

    hasOutput(): boolean;
    clearOutput(): void;
    getOutput(): google_protobuf_wrappers_pb.StringValue | undefined;
    setOutput(value?: google_protobuf_wrappers_pb.StringValue): OrchestrationState;

    hasCustomstatus(): boolean;
    clearCustomstatus(): void;
    getCustomstatus(): google_protobuf_wrappers_pb.StringValue | undefined;
    setCustomstatus(value?: google_protobuf_wrappers_pb.StringValue): OrchestrationState;

    hasFailuredetails(): boolean;
    clearFailuredetails(): void;
    getFailuredetails(): TaskFailureDetails | undefined;
    setFailuredetails(value?: TaskFailureDetails): OrchestrationState;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): OrchestrationState.AsObject;
    static toObject(includeInstance: boolean, msg: OrchestrationState): OrchestrationState.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: OrchestrationState, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): OrchestrationState;
    static deserializeBinaryFromReader(message: OrchestrationState, reader: jspb.BinaryReader): OrchestrationState;
}

export namespace OrchestrationState {
    export type AsObject = {
        instanceid: string,
        name: string,
        version?: google_protobuf_wrappers_pb.StringValue.AsObject,
        orchestrationstatus: OrchestrationStatus,
        scheduledstarttimestamp?: google_protobuf_timestamp_pb.Timestamp.AsObject,
        createdtimestamp?: google_protobuf_timestamp_pb.Timestamp.AsObject,
        lastupdatedtimestamp?: google_protobuf_timestamp_pb.Timestamp.AsObject,
        input?: google_protobuf_wrappers_pb.StringValue.AsObject,
        output?: google_protobuf_wrappers_pb.StringValue.AsObject,
        customstatus?: google_protobuf_wrappers_pb.StringValue.AsObject,
        failuredetails?: TaskFailureDetails.AsObject,
    }
}

export class RaiseEventRequest extends jspb.Message { 
    getInstanceid(): string;
    setInstanceid(value: string): RaiseEventRequest;
    getName(): string;
    setName(value: string): RaiseEventRequest;

    hasInput(): boolean;
    clearInput(): void;
    getInput(): google_protobuf_wrappers_pb.StringValue | undefined;
    setInput(value?: google_protobuf_wrappers_pb.StringValue): RaiseEventRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RaiseEventRequest.AsObject;
    static toObject(includeInstance: boolean, msg: RaiseEventRequest): RaiseEventRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RaiseEventRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RaiseEventRequest;
    static deserializeBinaryFromReader(message: RaiseEventRequest, reader: jspb.BinaryReader): RaiseEventRequest;
}

export namespace RaiseEventRequest {
    export type AsObject = {
        instanceid: string,
        name: string,
        input?: google_protobuf_wrappers_pb.StringValue.AsObject,
    }
}

export class RaiseEventResponse extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RaiseEventResponse.AsObject;
    static toObject(includeInstance: boolean, msg: RaiseEventResponse): RaiseEventResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RaiseEventResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RaiseEventResponse;
    static deserializeBinaryFromReader(message: RaiseEventResponse, reader: jspb.BinaryReader): RaiseEventResponse;
}

export namespace RaiseEventResponse {
    export type AsObject = {
    }
}

export class TerminateRequest extends jspb.Message { 
    getInstanceid(): string;
    setInstanceid(value: string): TerminateRequest;

    hasOutput(): boolean;
    clearOutput(): void;
    getOutput(): google_protobuf_wrappers_pb.StringValue | undefined;
    setOutput(value?: google_protobuf_wrappers_pb.StringValue): TerminateRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TerminateRequest.AsObject;
    static toObject(includeInstance: boolean, msg: TerminateRequest): TerminateRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TerminateRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TerminateRequest;
    static deserializeBinaryFromReader(message: TerminateRequest, reader: jspb.BinaryReader): TerminateRequest;
}

export namespace TerminateRequest {
    export type AsObject = {
        instanceid: string,
        output?: google_protobuf_wrappers_pb.StringValue.AsObject,
    }
}

export class TerminateResponse extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TerminateResponse.AsObject;
    static toObject(includeInstance: boolean, msg: TerminateResponse): TerminateResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TerminateResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TerminateResponse;
    static deserializeBinaryFromReader(message: TerminateResponse, reader: jspb.BinaryReader): TerminateResponse;
}

export namespace TerminateResponse {
    export type AsObject = {
    }
}

export class SuspendRequest extends jspb.Message { 
    getInstanceid(): string;
    setInstanceid(value: string): SuspendRequest;

    hasReason(): boolean;
    clearReason(): void;
    getReason(): google_protobuf_wrappers_pb.StringValue | undefined;
    setReason(value?: google_protobuf_wrappers_pb.StringValue): SuspendRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SuspendRequest.AsObject;
    static toObject(includeInstance: boolean, msg: SuspendRequest): SuspendRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SuspendRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SuspendRequest;
    static deserializeBinaryFromReader(message: SuspendRequest, reader: jspb.BinaryReader): SuspendRequest;
}

export namespace SuspendRequest {
    export type AsObject = {
        instanceid: string,
        reason?: google_protobuf_wrappers_pb.StringValue.AsObject,
    }
}

export class SuspendResponse extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SuspendResponse.AsObject;
    static toObject(includeInstance: boolean, msg: SuspendResponse): SuspendResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SuspendResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SuspendResponse;
    static deserializeBinaryFromReader(message: SuspendResponse, reader: jspb.BinaryReader): SuspendResponse;
}

export namespace SuspendResponse {
    export type AsObject = {
    }
}

export class ResumeRequest extends jspb.Message { 
    getInstanceid(): string;
    setInstanceid(value: string): ResumeRequest;

    hasReason(): boolean;
    clearReason(): void;
    getReason(): google_protobuf_wrappers_pb.StringValue | undefined;
    setReason(value?: google_protobuf_wrappers_pb.StringValue): ResumeRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ResumeRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ResumeRequest): ResumeRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ResumeRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ResumeRequest;
    static deserializeBinaryFromReader(message: ResumeRequest, reader: jspb.BinaryReader): ResumeRequest;
}

export namespace ResumeRequest {
    export type AsObject = {
        instanceid: string,
        reason?: google_protobuf_wrappers_pb.StringValue.AsObject,
    }
}

export class ResumeResponse extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ResumeResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ResumeResponse): ResumeResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ResumeResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ResumeResponse;
    static deserializeBinaryFromReader(message: ResumeResponse, reader: jspb.BinaryReader): ResumeResponse;
}

export namespace ResumeResponse {
    export type AsObject = {
    }
}

export class QueryInstancesRequest extends jspb.Message { 

    hasQuery(): boolean;
    clearQuery(): void;
    getQuery(): InstanceQuery | undefined;
    setQuery(value?: InstanceQuery): QueryInstancesRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): QueryInstancesRequest.AsObject;
    static toObject(includeInstance: boolean, msg: QueryInstancesRequest): QueryInstancesRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: QueryInstancesRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): QueryInstancesRequest;
    static deserializeBinaryFromReader(message: QueryInstancesRequest, reader: jspb.BinaryReader): QueryInstancesRequest;
}

export namespace QueryInstancesRequest {
    export type AsObject = {
        query?: InstanceQuery.AsObject,
    }
}

export class InstanceQuery extends jspb.Message { 
    clearRuntimestatusList(): void;
    getRuntimestatusList(): Array<OrchestrationStatus>;
    setRuntimestatusList(value: Array<OrchestrationStatus>): InstanceQuery;
    addRuntimestatus(value: OrchestrationStatus, index?: number): OrchestrationStatus;

    hasCreatedtimefrom(): boolean;
    clearCreatedtimefrom(): void;
    getCreatedtimefrom(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setCreatedtimefrom(value?: google_protobuf_timestamp_pb.Timestamp): InstanceQuery;

    hasCreatedtimeto(): boolean;
    clearCreatedtimeto(): void;
    getCreatedtimeto(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setCreatedtimeto(value?: google_protobuf_timestamp_pb.Timestamp): InstanceQuery;
    clearTaskhubnamesList(): void;
    getTaskhubnamesList(): Array<google_protobuf_wrappers_pb.StringValue>;
    setTaskhubnamesList(value: Array<google_protobuf_wrappers_pb.StringValue>): InstanceQuery;
    addTaskhubnames(value?: google_protobuf_wrappers_pb.StringValue, index?: number): google_protobuf_wrappers_pb.StringValue;
    getMaxinstancecount(): number;
    setMaxinstancecount(value: number): InstanceQuery;

    hasContinuationtoken(): boolean;
    clearContinuationtoken(): void;
    getContinuationtoken(): google_protobuf_wrappers_pb.StringValue | undefined;
    setContinuationtoken(value?: google_protobuf_wrappers_pb.StringValue): InstanceQuery;

    hasInstanceidprefix(): boolean;
    clearInstanceidprefix(): void;
    getInstanceidprefix(): google_protobuf_wrappers_pb.StringValue | undefined;
    setInstanceidprefix(value?: google_protobuf_wrappers_pb.StringValue): InstanceQuery;
    getFetchinputsandoutputs(): boolean;
    setFetchinputsandoutputs(value: boolean): InstanceQuery;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): InstanceQuery.AsObject;
    static toObject(includeInstance: boolean, msg: InstanceQuery): InstanceQuery.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: InstanceQuery, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): InstanceQuery;
    static deserializeBinaryFromReader(message: InstanceQuery, reader: jspb.BinaryReader): InstanceQuery;
}

export namespace InstanceQuery {
    export type AsObject = {
        runtimestatusList: Array<OrchestrationStatus>,
        createdtimefrom?: google_protobuf_timestamp_pb.Timestamp.AsObject,
        createdtimeto?: google_protobuf_timestamp_pb.Timestamp.AsObject,
        taskhubnamesList: Array<google_protobuf_wrappers_pb.StringValue.AsObject>,
        maxinstancecount: number,
        continuationtoken?: google_protobuf_wrappers_pb.StringValue.AsObject,
        instanceidprefix?: google_protobuf_wrappers_pb.StringValue.AsObject,
        fetchinputsandoutputs: boolean,
    }
}

export class QueryInstancesResponse extends jspb.Message { 
    clearOrchestrationstateList(): void;
    getOrchestrationstateList(): Array<OrchestrationState>;
    setOrchestrationstateList(value: Array<OrchestrationState>): QueryInstancesResponse;
    addOrchestrationstate(value?: OrchestrationState, index?: number): OrchestrationState;

    hasContinuationtoken(): boolean;
    clearContinuationtoken(): void;
    getContinuationtoken(): google_protobuf_wrappers_pb.StringValue | undefined;
    setContinuationtoken(value?: google_protobuf_wrappers_pb.StringValue): QueryInstancesResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): QueryInstancesResponse.AsObject;
    static toObject(includeInstance: boolean, msg: QueryInstancesResponse): QueryInstancesResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: QueryInstancesResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): QueryInstancesResponse;
    static deserializeBinaryFromReader(message: QueryInstancesResponse, reader: jspb.BinaryReader): QueryInstancesResponse;
}

export namespace QueryInstancesResponse {
    export type AsObject = {
        orchestrationstateList: Array<OrchestrationState.AsObject>,
        continuationtoken?: google_protobuf_wrappers_pb.StringValue.AsObject,
    }
}

export class PurgeInstancesRequest extends jspb.Message { 

    hasInstanceid(): boolean;
    clearInstanceid(): void;
    getInstanceid(): string;
    setInstanceid(value: string): PurgeInstancesRequest;

    hasPurgeinstancefilter(): boolean;
    clearPurgeinstancefilter(): void;
    getPurgeinstancefilter(): PurgeInstanceFilter | undefined;
    setPurgeinstancefilter(value?: PurgeInstanceFilter): PurgeInstancesRequest;

    getRequestCase(): PurgeInstancesRequest.RequestCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PurgeInstancesRequest.AsObject;
    static toObject(includeInstance: boolean, msg: PurgeInstancesRequest): PurgeInstancesRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PurgeInstancesRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PurgeInstancesRequest;
    static deserializeBinaryFromReader(message: PurgeInstancesRequest, reader: jspb.BinaryReader): PurgeInstancesRequest;
}

export namespace PurgeInstancesRequest {
    export type AsObject = {
        instanceid: string,
        purgeinstancefilter?: PurgeInstanceFilter.AsObject,
    }

    export enum RequestCase {
        REQUEST_NOT_SET = 0,
        INSTANCEID = 1,
        PURGEINSTANCEFILTER = 2,
    }

}

export class PurgeInstanceFilter extends jspb.Message { 

    hasCreatedtimefrom(): boolean;
    clearCreatedtimefrom(): void;
    getCreatedtimefrom(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setCreatedtimefrom(value?: google_protobuf_timestamp_pb.Timestamp): PurgeInstanceFilter;

    hasCreatedtimeto(): boolean;
    clearCreatedtimeto(): void;
    getCreatedtimeto(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setCreatedtimeto(value?: google_protobuf_timestamp_pb.Timestamp): PurgeInstanceFilter;
    clearRuntimestatusList(): void;
    getRuntimestatusList(): Array<OrchestrationStatus>;
    setRuntimestatusList(value: Array<OrchestrationStatus>): PurgeInstanceFilter;
    addRuntimestatus(value: OrchestrationStatus, index?: number): OrchestrationStatus;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PurgeInstanceFilter.AsObject;
    static toObject(includeInstance: boolean, msg: PurgeInstanceFilter): PurgeInstanceFilter.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PurgeInstanceFilter, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PurgeInstanceFilter;
    static deserializeBinaryFromReader(message: PurgeInstanceFilter, reader: jspb.BinaryReader): PurgeInstanceFilter;
}

export namespace PurgeInstanceFilter {
    export type AsObject = {
        createdtimefrom?: google_protobuf_timestamp_pb.Timestamp.AsObject,
        createdtimeto?: google_protobuf_timestamp_pb.Timestamp.AsObject,
        runtimestatusList: Array<OrchestrationStatus>,
    }
}

export class PurgeInstancesResponse extends jspb.Message { 
    getDeletedinstancecount(): number;
    setDeletedinstancecount(value: number): PurgeInstancesResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PurgeInstancesResponse.AsObject;
    static toObject(includeInstance: boolean, msg: PurgeInstancesResponse): PurgeInstancesResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PurgeInstancesResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PurgeInstancesResponse;
    static deserializeBinaryFromReader(message: PurgeInstancesResponse, reader: jspb.BinaryReader): PurgeInstancesResponse;
}

export namespace PurgeInstancesResponse {
    export type AsObject = {
        deletedinstancecount: number,
    }
}

export class CreateTaskHubRequest extends jspb.Message { 
    getRecreateifexists(): boolean;
    setRecreateifexists(value: boolean): CreateTaskHubRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CreateTaskHubRequest.AsObject;
    static toObject(includeInstance: boolean, msg: CreateTaskHubRequest): CreateTaskHubRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CreateTaskHubRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CreateTaskHubRequest;
    static deserializeBinaryFromReader(message: CreateTaskHubRequest, reader: jspb.BinaryReader): CreateTaskHubRequest;
}

export namespace CreateTaskHubRequest {
    export type AsObject = {
        recreateifexists: boolean,
    }
}

export class CreateTaskHubResponse extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CreateTaskHubResponse.AsObject;
    static toObject(includeInstance: boolean, msg: CreateTaskHubResponse): CreateTaskHubResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CreateTaskHubResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CreateTaskHubResponse;
    static deserializeBinaryFromReader(message: CreateTaskHubResponse, reader: jspb.BinaryReader): CreateTaskHubResponse;
}

export namespace CreateTaskHubResponse {
    export type AsObject = {
    }
}

export class DeleteTaskHubRequest extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DeleteTaskHubRequest.AsObject;
    static toObject(includeInstance: boolean, msg: DeleteTaskHubRequest): DeleteTaskHubRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DeleteTaskHubRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DeleteTaskHubRequest;
    static deserializeBinaryFromReader(message: DeleteTaskHubRequest, reader: jspb.BinaryReader): DeleteTaskHubRequest;
}

export namespace DeleteTaskHubRequest {
    export type AsObject = {
    }
}

export class DeleteTaskHubResponse extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DeleteTaskHubResponse.AsObject;
    static toObject(includeInstance: boolean, msg: DeleteTaskHubResponse): DeleteTaskHubResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DeleteTaskHubResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DeleteTaskHubResponse;
    static deserializeBinaryFromReader(message: DeleteTaskHubResponse, reader: jspb.BinaryReader): DeleteTaskHubResponse;
}

export namespace DeleteTaskHubResponse {
    export type AsObject = {
    }
}

export class GetWorkItemsRequest extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetWorkItemsRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetWorkItemsRequest): GetWorkItemsRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetWorkItemsRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetWorkItemsRequest;
    static deserializeBinaryFromReader(message: GetWorkItemsRequest, reader: jspb.BinaryReader): GetWorkItemsRequest;
}

export namespace GetWorkItemsRequest {
    export type AsObject = {
    }
}

export class WorkItem extends jspb.Message { 

    hasOrchestratorrequest(): boolean;
    clearOrchestratorrequest(): void;
    getOrchestratorrequest(): OrchestratorRequest | undefined;
    setOrchestratorrequest(value?: OrchestratorRequest): WorkItem;

    hasActivityrequest(): boolean;
    clearActivityrequest(): void;
    getActivityrequest(): ActivityRequest | undefined;
    setActivityrequest(value?: ActivityRequest): WorkItem;

    getRequestCase(): WorkItem.RequestCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): WorkItem.AsObject;
    static toObject(includeInstance: boolean, msg: WorkItem): WorkItem.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: WorkItem, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): WorkItem;
    static deserializeBinaryFromReader(message: WorkItem, reader: jspb.BinaryReader): WorkItem;
}

export namespace WorkItem {
    export type AsObject = {
        orchestratorrequest?: OrchestratorRequest.AsObject,
        activityrequest?: ActivityRequest.AsObject,
    }

    export enum RequestCase {
        REQUEST_NOT_SET = 0,
        ORCHESTRATORREQUEST = 1,
        ACTIVITYREQUEST = 2,
    }

}

export class CompleteTaskResponse extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CompleteTaskResponse.AsObject;
    static toObject(includeInstance: boolean, msg: CompleteTaskResponse): CompleteTaskResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CompleteTaskResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CompleteTaskResponse;
    static deserializeBinaryFromReader(message: CompleteTaskResponse, reader: jspb.BinaryReader): CompleteTaskResponse;
}

export namespace CompleteTaskResponse {
    export type AsObject = {
    }
}

export enum OrchestrationStatus {
    ORCHESTRATION_STATUS_RUNNING = 0,
    ORCHESTRATION_STATUS_COMPLETED = 1,
    ORCHESTRATION_STATUS_CONTINUED_AS_NEW = 2,
    ORCHESTRATION_STATUS_FAILED = 3,
    ORCHESTRATION_STATUS_CANCELED = 4,
    ORCHESTRATION_STATUS_TERMINATED = 5,
    ORCHESTRATION_STATUS_PENDING = 6,
    ORCHESTRATION_STATUS_SUSPENDED = 7,
}
