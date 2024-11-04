// package: 
// file: orchestrator_service.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as orchestrator_service_pb from "./orchestrator_service_pb";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";
import * as google_protobuf_wrappers_pb from "google-protobuf/google/protobuf/wrappers_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

interface ITaskHubSidecarServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    hello: ITaskHubSidecarServiceService_IHello;
    startInstance: ITaskHubSidecarServiceService_IStartInstance;
    getInstance: ITaskHubSidecarServiceService_IGetInstance;
    rewindInstance: ITaskHubSidecarServiceService_IRewindInstance;
    waitForInstanceStart: ITaskHubSidecarServiceService_IWaitForInstanceStart;
    waitForInstanceCompletion: ITaskHubSidecarServiceService_IWaitForInstanceCompletion;
    raiseEvent: ITaskHubSidecarServiceService_IRaiseEvent;
    terminateInstance: ITaskHubSidecarServiceService_ITerminateInstance;
    suspendInstance: ITaskHubSidecarServiceService_ISuspendInstance;
    resumeInstance: ITaskHubSidecarServiceService_IResumeInstance;
    queryInstances: ITaskHubSidecarServiceService_IQueryInstances;
    purgeInstances: ITaskHubSidecarServiceService_IPurgeInstances;
    getWorkItems: ITaskHubSidecarServiceService_IGetWorkItems;
    completeActivityTask: ITaskHubSidecarServiceService_ICompleteActivityTask;
    completeOrchestratorTask: ITaskHubSidecarServiceService_ICompleteOrchestratorTask;
    createTaskHub: ITaskHubSidecarServiceService_ICreateTaskHub;
    deleteTaskHub: ITaskHubSidecarServiceService_IDeleteTaskHub;
}

interface ITaskHubSidecarServiceService_IHello extends grpc.MethodDefinition<google_protobuf_empty_pb.Empty, google_protobuf_empty_pb.Empty> {
    path: "/TaskHubSidecarService/Hello";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    requestDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface ITaskHubSidecarServiceService_IStartInstance extends grpc.MethodDefinition<orchestrator_service_pb.CreateInstanceRequest, orchestrator_service_pb.CreateInstanceResponse> {
    path: "/TaskHubSidecarService/StartInstance";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<orchestrator_service_pb.CreateInstanceRequest>;
    requestDeserialize: grpc.deserialize<orchestrator_service_pb.CreateInstanceRequest>;
    responseSerialize: grpc.serialize<orchestrator_service_pb.CreateInstanceResponse>;
    responseDeserialize: grpc.deserialize<orchestrator_service_pb.CreateInstanceResponse>;
}
interface ITaskHubSidecarServiceService_IGetInstance extends grpc.MethodDefinition<orchestrator_service_pb.GetInstanceRequest, orchestrator_service_pb.GetInstanceResponse> {
    path: "/TaskHubSidecarService/GetInstance";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<orchestrator_service_pb.GetInstanceRequest>;
    requestDeserialize: grpc.deserialize<orchestrator_service_pb.GetInstanceRequest>;
    responseSerialize: grpc.serialize<orchestrator_service_pb.GetInstanceResponse>;
    responseDeserialize: grpc.deserialize<orchestrator_service_pb.GetInstanceResponse>;
}
interface ITaskHubSidecarServiceService_IRewindInstance extends grpc.MethodDefinition<orchestrator_service_pb.RewindInstanceRequest, orchestrator_service_pb.RewindInstanceResponse> {
    path: "/TaskHubSidecarService/RewindInstance";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<orchestrator_service_pb.RewindInstanceRequest>;
    requestDeserialize: grpc.deserialize<orchestrator_service_pb.RewindInstanceRequest>;
    responseSerialize: grpc.serialize<orchestrator_service_pb.RewindInstanceResponse>;
    responseDeserialize: grpc.deserialize<orchestrator_service_pb.RewindInstanceResponse>;
}
interface ITaskHubSidecarServiceService_IWaitForInstanceStart extends grpc.MethodDefinition<orchestrator_service_pb.GetInstanceRequest, orchestrator_service_pb.GetInstanceResponse> {
    path: "/TaskHubSidecarService/WaitForInstanceStart";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<orchestrator_service_pb.GetInstanceRequest>;
    requestDeserialize: grpc.deserialize<orchestrator_service_pb.GetInstanceRequest>;
    responseSerialize: grpc.serialize<orchestrator_service_pb.GetInstanceResponse>;
    responseDeserialize: grpc.deserialize<orchestrator_service_pb.GetInstanceResponse>;
}
interface ITaskHubSidecarServiceService_IWaitForInstanceCompletion extends grpc.MethodDefinition<orchestrator_service_pb.GetInstanceRequest, orchestrator_service_pb.GetInstanceResponse> {
    path: "/TaskHubSidecarService/WaitForInstanceCompletion";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<orchestrator_service_pb.GetInstanceRequest>;
    requestDeserialize: grpc.deserialize<orchestrator_service_pb.GetInstanceRequest>;
    responseSerialize: grpc.serialize<orchestrator_service_pb.GetInstanceResponse>;
    responseDeserialize: grpc.deserialize<orchestrator_service_pb.GetInstanceResponse>;
}
interface ITaskHubSidecarServiceService_IRaiseEvent extends grpc.MethodDefinition<orchestrator_service_pb.RaiseEventRequest, orchestrator_service_pb.RaiseEventResponse> {
    path: "/TaskHubSidecarService/RaiseEvent";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<orchestrator_service_pb.RaiseEventRequest>;
    requestDeserialize: grpc.deserialize<orchestrator_service_pb.RaiseEventRequest>;
    responseSerialize: grpc.serialize<orchestrator_service_pb.RaiseEventResponse>;
    responseDeserialize: grpc.deserialize<orchestrator_service_pb.RaiseEventResponse>;
}
interface ITaskHubSidecarServiceService_ITerminateInstance extends grpc.MethodDefinition<orchestrator_service_pb.TerminateRequest, orchestrator_service_pb.TerminateResponse> {
    path: "/TaskHubSidecarService/TerminateInstance";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<orchestrator_service_pb.TerminateRequest>;
    requestDeserialize: grpc.deserialize<orchestrator_service_pb.TerminateRequest>;
    responseSerialize: grpc.serialize<orchestrator_service_pb.TerminateResponse>;
    responseDeserialize: grpc.deserialize<orchestrator_service_pb.TerminateResponse>;
}
interface ITaskHubSidecarServiceService_ISuspendInstance extends grpc.MethodDefinition<orchestrator_service_pb.SuspendRequest, orchestrator_service_pb.SuspendResponse> {
    path: "/TaskHubSidecarService/SuspendInstance";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<orchestrator_service_pb.SuspendRequest>;
    requestDeserialize: grpc.deserialize<orchestrator_service_pb.SuspendRequest>;
    responseSerialize: grpc.serialize<orchestrator_service_pb.SuspendResponse>;
    responseDeserialize: grpc.deserialize<orchestrator_service_pb.SuspendResponse>;
}
interface ITaskHubSidecarServiceService_IResumeInstance extends grpc.MethodDefinition<orchestrator_service_pb.ResumeRequest, orchestrator_service_pb.ResumeResponse> {
    path: "/TaskHubSidecarService/ResumeInstance";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<orchestrator_service_pb.ResumeRequest>;
    requestDeserialize: grpc.deserialize<orchestrator_service_pb.ResumeRequest>;
    responseSerialize: grpc.serialize<orchestrator_service_pb.ResumeResponse>;
    responseDeserialize: grpc.deserialize<orchestrator_service_pb.ResumeResponse>;
}
interface ITaskHubSidecarServiceService_IQueryInstances extends grpc.MethodDefinition<orchestrator_service_pb.QueryInstancesRequest, orchestrator_service_pb.QueryInstancesResponse> {
    path: "/TaskHubSidecarService/QueryInstances";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<orchestrator_service_pb.QueryInstancesRequest>;
    requestDeserialize: grpc.deserialize<orchestrator_service_pb.QueryInstancesRequest>;
    responseSerialize: grpc.serialize<orchestrator_service_pb.QueryInstancesResponse>;
    responseDeserialize: grpc.deserialize<orchestrator_service_pb.QueryInstancesResponse>;
}
interface ITaskHubSidecarServiceService_IPurgeInstances extends grpc.MethodDefinition<orchestrator_service_pb.PurgeInstancesRequest, orchestrator_service_pb.PurgeInstancesResponse> {
    path: "/TaskHubSidecarService/PurgeInstances";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<orchestrator_service_pb.PurgeInstancesRequest>;
    requestDeserialize: grpc.deserialize<orchestrator_service_pb.PurgeInstancesRequest>;
    responseSerialize: grpc.serialize<orchestrator_service_pb.PurgeInstancesResponse>;
    responseDeserialize: grpc.deserialize<orchestrator_service_pb.PurgeInstancesResponse>;
}
interface ITaskHubSidecarServiceService_IGetWorkItems extends grpc.MethodDefinition<orchestrator_service_pb.GetWorkItemsRequest, orchestrator_service_pb.WorkItem> {
    path: "/TaskHubSidecarService/GetWorkItems";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<orchestrator_service_pb.GetWorkItemsRequest>;
    requestDeserialize: grpc.deserialize<orchestrator_service_pb.GetWorkItemsRequest>;
    responseSerialize: grpc.serialize<orchestrator_service_pb.WorkItem>;
    responseDeserialize: grpc.deserialize<orchestrator_service_pb.WorkItem>;
}
interface ITaskHubSidecarServiceService_ICompleteActivityTask extends grpc.MethodDefinition<orchestrator_service_pb.ActivityResponse, orchestrator_service_pb.CompleteTaskResponse> {
    path: "/TaskHubSidecarService/CompleteActivityTask";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<orchestrator_service_pb.ActivityResponse>;
    requestDeserialize: grpc.deserialize<orchestrator_service_pb.ActivityResponse>;
    responseSerialize: grpc.serialize<orchestrator_service_pb.CompleteTaskResponse>;
    responseDeserialize: grpc.deserialize<orchestrator_service_pb.CompleteTaskResponse>;
}
interface ITaskHubSidecarServiceService_ICompleteOrchestratorTask extends grpc.MethodDefinition<orchestrator_service_pb.OrchestratorResponse, orchestrator_service_pb.CompleteTaskResponse> {
    path: "/TaskHubSidecarService/CompleteOrchestratorTask";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<orchestrator_service_pb.OrchestratorResponse>;
    requestDeserialize: grpc.deserialize<orchestrator_service_pb.OrchestratorResponse>;
    responseSerialize: grpc.serialize<orchestrator_service_pb.CompleteTaskResponse>;
    responseDeserialize: grpc.deserialize<orchestrator_service_pb.CompleteTaskResponse>;
}
interface ITaskHubSidecarServiceService_ICreateTaskHub extends grpc.MethodDefinition<orchestrator_service_pb.CreateTaskHubRequest, orchestrator_service_pb.CreateTaskHubResponse> {
    path: "/TaskHubSidecarService/CreateTaskHub";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<orchestrator_service_pb.CreateTaskHubRequest>;
    requestDeserialize: grpc.deserialize<orchestrator_service_pb.CreateTaskHubRequest>;
    responseSerialize: grpc.serialize<orchestrator_service_pb.CreateTaskHubResponse>;
    responseDeserialize: grpc.deserialize<orchestrator_service_pb.CreateTaskHubResponse>;
}
interface ITaskHubSidecarServiceService_IDeleteTaskHub extends grpc.MethodDefinition<orchestrator_service_pb.DeleteTaskHubRequest, orchestrator_service_pb.DeleteTaskHubResponse> {
    path: "/TaskHubSidecarService/DeleteTaskHub";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<orchestrator_service_pb.DeleteTaskHubRequest>;
    requestDeserialize: grpc.deserialize<orchestrator_service_pb.DeleteTaskHubRequest>;
    responseSerialize: grpc.serialize<orchestrator_service_pb.DeleteTaskHubResponse>;
    responseDeserialize: grpc.deserialize<orchestrator_service_pb.DeleteTaskHubResponse>;
}

export const TaskHubSidecarServiceService: ITaskHubSidecarServiceService;

export interface ITaskHubSidecarServiceServer extends grpc.UntypedServiceImplementation {
    hello: grpc.handleUnaryCall<google_protobuf_empty_pb.Empty, google_protobuf_empty_pb.Empty>;
    startInstance: grpc.handleUnaryCall<orchestrator_service_pb.CreateInstanceRequest, orchestrator_service_pb.CreateInstanceResponse>;
    getInstance: grpc.handleUnaryCall<orchestrator_service_pb.GetInstanceRequest, orchestrator_service_pb.GetInstanceResponse>;
    rewindInstance: grpc.handleUnaryCall<orchestrator_service_pb.RewindInstanceRequest, orchestrator_service_pb.RewindInstanceResponse>;
    waitForInstanceStart: grpc.handleUnaryCall<orchestrator_service_pb.GetInstanceRequest, orchestrator_service_pb.GetInstanceResponse>;
    waitForInstanceCompletion: grpc.handleUnaryCall<orchestrator_service_pb.GetInstanceRequest, orchestrator_service_pb.GetInstanceResponse>;
    raiseEvent: grpc.handleUnaryCall<orchestrator_service_pb.RaiseEventRequest, orchestrator_service_pb.RaiseEventResponse>;
    terminateInstance: grpc.handleUnaryCall<orchestrator_service_pb.TerminateRequest, orchestrator_service_pb.TerminateResponse>;
    suspendInstance: grpc.handleUnaryCall<orchestrator_service_pb.SuspendRequest, orchestrator_service_pb.SuspendResponse>;
    resumeInstance: grpc.handleUnaryCall<orchestrator_service_pb.ResumeRequest, orchestrator_service_pb.ResumeResponse>;
    queryInstances: grpc.handleUnaryCall<orchestrator_service_pb.QueryInstancesRequest, orchestrator_service_pb.QueryInstancesResponse>;
    purgeInstances: grpc.handleUnaryCall<orchestrator_service_pb.PurgeInstancesRequest, orchestrator_service_pb.PurgeInstancesResponse>;
    getWorkItems: grpc.handleServerStreamingCall<orchestrator_service_pb.GetWorkItemsRequest, orchestrator_service_pb.WorkItem>;
    completeActivityTask: grpc.handleUnaryCall<orchestrator_service_pb.ActivityResponse, orchestrator_service_pb.CompleteTaskResponse>;
    completeOrchestratorTask: grpc.handleUnaryCall<orchestrator_service_pb.OrchestratorResponse, orchestrator_service_pb.CompleteTaskResponse>;
    createTaskHub: grpc.handleUnaryCall<orchestrator_service_pb.CreateTaskHubRequest, orchestrator_service_pb.CreateTaskHubResponse>;
    deleteTaskHub: grpc.handleUnaryCall<orchestrator_service_pb.DeleteTaskHubRequest, orchestrator_service_pb.DeleteTaskHubResponse>;
}

export interface ITaskHubSidecarServiceClient {
    hello(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    hello(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    hello(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    startInstance(request: orchestrator_service_pb.CreateInstanceRequest, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.CreateInstanceResponse) => void): grpc.ClientUnaryCall;
    startInstance(request: orchestrator_service_pb.CreateInstanceRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.CreateInstanceResponse) => void): grpc.ClientUnaryCall;
    startInstance(request: orchestrator_service_pb.CreateInstanceRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.CreateInstanceResponse) => void): grpc.ClientUnaryCall;
    getInstance(request: orchestrator_service_pb.GetInstanceRequest, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.GetInstanceResponse) => void): grpc.ClientUnaryCall;
    getInstance(request: orchestrator_service_pb.GetInstanceRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.GetInstanceResponse) => void): grpc.ClientUnaryCall;
    getInstance(request: orchestrator_service_pb.GetInstanceRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.GetInstanceResponse) => void): grpc.ClientUnaryCall;
    rewindInstance(request: orchestrator_service_pb.RewindInstanceRequest, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.RewindInstanceResponse) => void): grpc.ClientUnaryCall;
    rewindInstance(request: orchestrator_service_pb.RewindInstanceRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.RewindInstanceResponse) => void): grpc.ClientUnaryCall;
    rewindInstance(request: orchestrator_service_pb.RewindInstanceRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.RewindInstanceResponse) => void): grpc.ClientUnaryCall;
    waitForInstanceStart(request: orchestrator_service_pb.GetInstanceRequest, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.GetInstanceResponse) => void): grpc.ClientUnaryCall;
    waitForInstanceStart(request: orchestrator_service_pb.GetInstanceRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.GetInstanceResponse) => void): grpc.ClientUnaryCall;
    waitForInstanceStart(request: orchestrator_service_pb.GetInstanceRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.GetInstanceResponse) => void): grpc.ClientUnaryCall;
    waitForInstanceCompletion(request: orchestrator_service_pb.GetInstanceRequest, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.GetInstanceResponse) => void): grpc.ClientUnaryCall;
    waitForInstanceCompletion(request: orchestrator_service_pb.GetInstanceRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.GetInstanceResponse) => void): grpc.ClientUnaryCall;
    waitForInstanceCompletion(request: orchestrator_service_pb.GetInstanceRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.GetInstanceResponse) => void): grpc.ClientUnaryCall;
    raiseEvent(request: orchestrator_service_pb.RaiseEventRequest, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.RaiseEventResponse) => void): grpc.ClientUnaryCall;
    raiseEvent(request: orchestrator_service_pb.RaiseEventRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.RaiseEventResponse) => void): grpc.ClientUnaryCall;
    raiseEvent(request: orchestrator_service_pb.RaiseEventRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.RaiseEventResponse) => void): grpc.ClientUnaryCall;
    terminateInstance(request: orchestrator_service_pb.TerminateRequest, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.TerminateResponse) => void): grpc.ClientUnaryCall;
    terminateInstance(request: orchestrator_service_pb.TerminateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.TerminateResponse) => void): grpc.ClientUnaryCall;
    terminateInstance(request: orchestrator_service_pb.TerminateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.TerminateResponse) => void): grpc.ClientUnaryCall;
    suspendInstance(request: orchestrator_service_pb.SuspendRequest, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.SuspendResponse) => void): grpc.ClientUnaryCall;
    suspendInstance(request: orchestrator_service_pb.SuspendRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.SuspendResponse) => void): grpc.ClientUnaryCall;
    suspendInstance(request: orchestrator_service_pb.SuspendRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.SuspendResponse) => void): grpc.ClientUnaryCall;
    resumeInstance(request: orchestrator_service_pb.ResumeRequest, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.ResumeResponse) => void): grpc.ClientUnaryCall;
    resumeInstance(request: orchestrator_service_pb.ResumeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.ResumeResponse) => void): grpc.ClientUnaryCall;
    resumeInstance(request: orchestrator_service_pb.ResumeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.ResumeResponse) => void): grpc.ClientUnaryCall;
    queryInstances(request: orchestrator_service_pb.QueryInstancesRequest, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.QueryInstancesResponse) => void): grpc.ClientUnaryCall;
    queryInstances(request: orchestrator_service_pb.QueryInstancesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.QueryInstancesResponse) => void): grpc.ClientUnaryCall;
    queryInstances(request: orchestrator_service_pb.QueryInstancesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.QueryInstancesResponse) => void): grpc.ClientUnaryCall;
    purgeInstances(request: orchestrator_service_pb.PurgeInstancesRequest, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.PurgeInstancesResponse) => void): grpc.ClientUnaryCall;
    purgeInstances(request: orchestrator_service_pb.PurgeInstancesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.PurgeInstancesResponse) => void): grpc.ClientUnaryCall;
    purgeInstances(request: orchestrator_service_pb.PurgeInstancesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.PurgeInstancesResponse) => void): grpc.ClientUnaryCall;
    getWorkItems(request: orchestrator_service_pb.GetWorkItemsRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<orchestrator_service_pb.WorkItem>;
    getWorkItems(request: orchestrator_service_pb.GetWorkItemsRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<orchestrator_service_pb.WorkItem>;
    completeActivityTask(request: orchestrator_service_pb.ActivityResponse, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.CompleteTaskResponse) => void): grpc.ClientUnaryCall;
    completeActivityTask(request: orchestrator_service_pb.ActivityResponse, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.CompleteTaskResponse) => void): grpc.ClientUnaryCall;
    completeActivityTask(request: orchestrator_service_pb.ActivityResponse, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.CompleteTaskResponse) => void): grpc.ClientUnaryCall;
    completeOrchestratorTask(request: orchestrator_service_pb.OrchestratorResponse, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.CompleteTaskResponse) => void): grpc.ClientUnaryCall;
    completeOrchestratorTask(request: orchestrator_service_pb.OrchestratorResponse, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.CompleteTaskResponse) => void): grpc.ClientUnaryCall;
    completeOrchestratorTask(request: orchestrator_service_pb.OrchestratorResponse, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.CompleteTaskResponse) => void): grpc.ClientUnaryCall;
    createTaskHub(request: orchestrator_service_pb.CreateTaskHubRequest, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.CreateTaskHubResponse) => void): grpc.ClientUnaryCall;
    createTaskHub(request: orchestrator_service_pb.CreateTaskHubRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.CreateTaskHubResponse) => void): grpc.ClientUnaryCall;
    createTaskHub(request: orchestrator_service_pb.CreateTaskHubRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.CreateTaskHubResponse) => void): grpc.ClientUnaryCall;
    deleteTaskHub(request: orchestrator_service_pb.DeleteTaskHubRequest, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.DeleteTaskHubResponse) => void): grpc.ClientUnaryCall;
    deleteTaskHub(request: orchestrator_service_pb.DeleteTaskHubRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.DeleteTaskHubResponse) => void): grpc.ClientUnaryCall;
    deleteTaskHub(request: orchestrator_service_pb.DeleteTaskHubRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.DeleteTaskHubResponse) => void): grpc.ClientUnaryCall;
}

export class TaskHubSidecarServiceClient extends grpc.Client implements ITaskHubSidecarServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public hello(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public hello(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public hello(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public startInstance(request: orchestrator_service_pb.CreateInstanceRequest, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.CreateInstanceResponse) => void): grpc.ClientUnaryCall;
    public startInstance(request: orchestrator_service_pb.CreateInstanceRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.CreateInstanceResponse) => void): grpc.ClientUnaryCall;
    public startInstance(request: orchestrator_service_pb.CreateInstanceRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.CreateInstanceResponse) => void): grpc.ClientUnaryCall;
    public getInstance(request: orchestrator_service_pb.GetInstanceRequest, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.GetInstanceResponse) => void): grpc.ClientUnaryCall;
    public getInstance(request: orchestrator_service_pb.GetInstanceRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.GetInstanceResponse) => void): grpc.ClientUnaryCall;
    public getInstance(request: orchestrator_service_pb.GetInstanceRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.GetInstanceResponse) => void): grpc.ClientUnaryCall;
    public rewindInstance(request: orchestrator_service_pb.RewindInstanceRequest, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.RewindInstanceResponse) => void): grpc.ClientUnaryCall;
    public rewindInstance(request: orchestrator_service_pb.RewindInstanceRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.RewindInstanceResponse) => void): grpc.ClientUnaryCall;
    public rewindInstance(request: orchestrator_service_pb.RewindInstanceRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.RewindInstanceResponse) => void): grpc.ClientUnaryCall;
    public waitForInstanceStart(request: orchestrator_service_pb.GetInstanceRequest, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.GetInstanceResponse) => void): grpc.ClientUnaryCall;
    public waitForInstanceStart(request: orchestrator_service_pb.GetInstanceRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.GetInstanceResponse) => void): grpc.ClientUnaryCall;
    public waitForInstanceStart(request: orchestrator_service_pb.GetInstanceRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.GetInstanceResponse) => void): grpc.ClientUnaryCall;
    public waitForInstanceCompletion(request: orchestrator_service_pb.GetInstanceRequest, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.GetInstanceResponse) => void): grpc.ClientUnaryCall;
    public waitForInstanceCompletion(request: orchestrator_service_pb.GetInstanceRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.GetInstanceResponse) => void): grpc.ClientUnaryCall;
    public waitForInstanceCompletion(request: orchestrator_service_pb.GetInstanceRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.GetInstanceResponse) => void): grpc.ClientUnaryCall;
    public raiseEvent(request: orchestrator_service_pb.RaiseEventRequest, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.RaiseEventResponse) => void): grpc.ClientUnaryCall;
    public raiseEvent(request: orchestrator_service_pb.RaiseEventRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.RaiseEventResponse) => void): grpc.ClientUnaryCall;
    public raiseEvent(request: orchestrator_service_pb.RaiseEventRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.RaiseEventResponse) => void): grpc.ClientUnaryCall;
    public terminateInstance(request: orchestrator_service_pb.TerminateRequest, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.TerminateResponse) => void): grpc.ClientUnaryCall;
    public terminateInstance(request: orchestrator_service_pb.TerminateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.TerminateResponse) => void): grpc.ClientUnaryCall;
    public terminateInstance(request: orchestrator_service_pb.TerminateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.TerminateResponse) => void): grpc.ClientUnaryCall;
    public suspendInstance(request: orchestrator_service_pb.SuspendRequest, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.SuspendResponse) => void): grpc.ClientUnaryCall;
    public suspendInstance(request: orchestrator_service_pb.SuspendRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.SuspendResponse) => void): grpc.ClientUnaryCall;
    public suspendInstance(request: orchestrator_service_pb.SuspendRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.SuspendResponse) => void): grpc.ClientUnaryCall;
    public resumeInstance(request: orchestrator_service_pb.ResumeRequest, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.ResumeResponse) => void): grpc.ClientUnaryCall;
    public resumeInstance(request: orchestrator_service_pb.ResumeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.ResumeResponse) => void): grpc.ClientUnaryCall;
    public resumeInstance(request: orchestrator_service_pb.ResumeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.ResumeResponse) => void): grpc.ClientUnaryCall;
    public queryInstances(request: orchestrator_service_pb.QueryInstancesRequest, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.QueryInstancesResponse) => void): grpc.ClientUnaryCall;
    public queryInstances(request: orchestrator_service_pb.QueryInstancesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.QueryInstancesResponse) => void): grpc.ClientUnaryCall;
    public queryInstances(request: orchestrator_service_pb.QueryInstancesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.QueryInstancesResponse) => void): grpc.ClientUnaryCall;
    public purgeInstances(request: orchestrator_service_pb.PurgeInstancesRequest, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.PurgeInstancesResponse) => void): grpc.ClientUnaryCall;
    public purgeInstances(request: orchestrator_service_pb.PurgeInstancesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.PurgeInstancesResponse) => void): grpc.ClientUnaryCall;
    public purgeInstances(request: orchestrator_service_pb.PurgeInstancesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.PurgeInstancesResponse) => void): grpc.ClientUnaryCall;
    public getWorkItems(request: orchestrator_service_pb.GetWorkItemsRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<orchestrator_service_pb.WorkItem>;
    public getWorkItems(request: orchestrator_service_pb.GetWorkItemsRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<orchestrator_service_pb.WorkItem>;
    public completeActivityTask(request: orchestrator_service_pb.ActivityResponse, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.CompleteTaskResponse) => void): grpc.ClientUnaryCall;
    public completeActivityTask(request: orchestrator_service_pb.ActivityResponse, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.CompleteTaskResponse) => void): grpc.ClientUnaryCall;
    public completeActivityTask(request: orchestrator_service_pb.ActivityResponse, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.CompleteTaskResponse) => void): grpc.ClientUnaryCall;
    public completeOrchestratorTask(request: orchestrator_service_pb.OrchestratorResponse, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.CompleteTaskResponse) => void): grpc.ClientUnaryCall;
    public completeOrchestratorTask(request: orchestrator_service_pb.OrchestratorResponse, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.CompleteTaskResponse) => void): grpc.ClientUnaryCall;
    public completeOrchestratorTask(request: orchestrator_service_pb.OrchestratorResponse, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.CompleteTaskResponse) => void): grpc.ClientUnaryCall;
    public createTaskHub(request: orchestrator_service_pb.CreateTaskHubRequest, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.CreateTaskHubResponse) => void): grpc.ClientUnaryCall;
    public createTaskHub(request: orchestrator_service_pb.CreateTaskHubRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.CreateTaskHubResponse) => void): grpc.ClientUnaryCall;
    public createTaskHub(request: orchestrator_service_pb.CreateTaskHubRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.CreateTaskHubResponse) => void): grpc.ClientUnaryCall;
    public deleteTaskHub(request: orchestrator_service_pb.DeleteTaskHubRequest, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.DeleteTaskHubResponse) => void): grpc.ClientUnaryCall;
    public deleteTaskHub(request: orchestrator_service_pb.DeleteTaskHubRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.DeleteTaskHubResponse) => void): grpc.ClientUnaryCall;
    public deleteTaskHub(request: orchestrator_service_pb.DeleteTaskHubRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: orchestrator_service_pb.DeleteTaskHubResponse) => void): grpc.ClientUnaryCall;
}
