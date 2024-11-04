// GENERATED CODE -- DO NOT EDIT!

// Original file comments:
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
//
'use strict';
var grpc = require('@grpc/grpc-js');
var orchestrator_service_pb = require('./orchestrator_service_pb.js');
var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js');
var google_protobuf_wrappers_pb = require('google-protobuf/google/protobuf/wrappers_pb.js');
var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js');

function serialize_ActivityResponse(arg) {
  if (!(arg instanceof orchestrator_service_pb.ActivityResponse)) {
    throw new Error('Expected argument of type ActivityResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ActivityResponse(buffer_arg) {
  return orchestrator_service_pb.ActivityResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_CompleteTaskResponse(arg) {
  if (!(arg instanceof orchestrator_service_pb.CompleteTaskResponse)) {
    throw new Error('Expected argument of type CompleteTaskResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_CompleteTaskResponse(buffer_arg) {
  return orchestrator_service_pb.CompleteTaskResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_CreateInstanceRequest(arg) {
  if (!(arg instanceof orchestrator_service_pb.CreateInstanceRequest)) {
    throw new Error('Expected argument of type CreateInstanceRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_CreateInstanceRequest(buffer_arg) {
  return orchestrator_service_pb.CreateInstanceRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_CreateInstanceResponse(arg) {
  if (!(arg instanceof orchestrator_service_pb.CreateInstanceResponse)) {
    throw new Error('Expected argument of type CreateInstanceResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_CreateInstanceResponse(buffer_arg) {
  return orchestrator_service_pb.CreateInstanceResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_CreateTaskHubRequest(arg) {
  if (!(arg instanceof orchestrator_service_pb.CreateTaskHubRequest)) {
    throw new Error('Expected argument of type CreateTaskHubRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_CreateTaskHubRequest(buffer_arg) {
  return orchestrator_service_pb.CreateTaskHubRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_CreateTaskHubResponse(arg) {
  if (!(arg instanceof orchestrator_service_pb.CreateTaskHubResponse)) {
    throw new Error('Expected argument of type CreateTaskHubResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_CreateTaskHubResponse(buffer_arg) {
  return orchestrator_service_pb.CreateTaskHubResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_DeleteTaskHubRequest(arg) {
  if (!(arg instanceof orchestrator_service_pb.DeleteTaskHubRequest)) {
    throw new Error('Expected argument of type DeleteTaskHubRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_DeleteTaskHubRequest(buffer_arg) {
  return orchestrator_service_pb.DeleteTaskHubRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_DeleteTaskHubResponse(arg) {
  if (!(arg instanceof orchestrator_service_pb.DeleteTaskHubResponse)) {
    throw new Error('Expected argument of type DeleteTaskHubResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_DeleteTaskHubResponse(buffer_arg) {
  return orchestrator_service_pb.DeleteTaskHubResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_GetInstanceRequest(arg) {
  if (!(arg instanceof orchestrator_service_pb.GetInstanceRequest)) {
    throw new Error('Expected argument of type GetInstanceRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_GetInstanceRequest(buffer_arg) {
  return orchestrator_service_pb.GetInstanceRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_GetInstanceResponse(arg) {
  if (!(arg instanceof orchestrator_service_pb.GetInstanceResponse)) {
    throw new Error('Expected argument of type GetInstanceResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_GetInstanceResponse(buffer_arg) {
  return orchestrator_service_pb.GetInstanceResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_GetWorkItemsRequest(arg) {
  if (!(arg instanceof orchestrator_service_pb.GetWorkItemsRequest)) {
    throw new Error('Expected argument of type GetWorkItemsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_GetWorkItemsRequest(buffer_arg) {
  return orchestrator_service_pb.GetWorkItemsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_OrchestratorResponse(arg) {
  if (!(arg instanceof orchestrator_service_pb.OrchestratorResponse)) {
    throw new Error('Expected argument of type OrchestratorResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_OrchestratorResponse(buffer_arg) {
  return orchestrator_service_pb.OrchestratorResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_PurgeInstancesRequest(arg) {
  if (!(arg instanceof orchestrator_service_pb.PurgeInstancesRequest)) {
    throw new Error('Expected argument of type PurgeInstancesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_PurgeInstancesRequest(buffer_arg) {
  return orchestrator_service_pb.PurgeInstancesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_PurgeInstancesResponse(arg) {
  if (!(arg instanceof orchestrator_service_pb.PurgeInstancesResponse)) {
    throw new Error('Expected argument of type PurgeInstancesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_PurgeInstancesResponse(buffer_arg) {
  return orchestrator_service_pb.PurgeInstancesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_QueryInstancesRequest(arg) {
  if (!(arg instanceof orchestrator_service_pb.QueryInstancesRequest)) {
    throw new Error('Expected argument of type QueryInstancesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_QueryInstancesRequest(buffer_arg) {
  return orchestrator_service_pb.QueryInstancesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_QueryInstancesResponse(arg) {
  if (!(arg instanceof orchestrator_service_pb.QueryInstancesResponse)) {
    throw new Error('Expected argument of type QueryInstancesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_QueryInstancesResponse(buffer_arg) {
  return orchestrator_service_pb.QueryInstancesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_RaiseEventRequest(arg) {
  if (!(arg instanceof orchestrator_service_pb.RaiseEventRequest)) {
    throw new Error('Expected argument of type RaiseEventRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_RaiseEventRequest(buffer_arg) {
  return orchestrator_service_pb.RaiseEventRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_RaiseEventResponse(arg) {
  if (!(arg instanceof orchestrator_service_pb.RaiseEventResponse)) {
    throw new Error('Expected argument of type RaiseEventResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_RaiseEventResponse(buffer_arg) {
  return orchestrator_service_pb.RaiseEventResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ResumeRequest(arg) {
  if (!(arg instanceof orchestrator_service_pb.ResumeRequest)) {
    throw new Error('Expected argument of type ResumeRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ResumeRequest(buffer_arg) {
  return orchestrator_service_pb.ResumeRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ResumeResponse(arg) {
  if (!(arg instanceof orchestrator_service_pb.ResumeResponse)) {
    throw new Error('Expected argument of type ResumeResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ResumeResponse(buffer_arg) {
  return orchestrator_service_pb.ResumeResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_RewindInstanceRequest(arg) {
  if (!(arg instanceof orchestrator_service_pb.RewindInstanceRequest)) {
    throw new Error('Expected argument of type RewindInstanceRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_RewindInstanceRequest(buffer_arg) {
  return orchestrator_service_pb.RewindInstanceRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_RewindInstanceResponse(arg) {
  if (!(arg instanceof orchestrator_service_pb.RewindInstanceResponse)) {
    throw new Error('Expected argument of type RewindInstanceResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_RewindInstanceResponse(buffer_arg) {
  return orchestrator_service_pb.RewindInstanceResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_SuspendRequest(arg) {
  if (!(arg instanceof orchestrator_service_pb.SuspendRequest)) {
    throw new Error('Expected argument of type SuspendRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_SuspendRequest(buffer_arg) {
  return orchestrator_service_pb.SuspendRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_SuspendResponse(arg) {
  if (!(arg instanceof orchestrator_service_pb.SuspendResponse)) {
    throw new Error('Expected argument of type SuspendResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_SuspendResponse(buffer_arg) {
  return orchestrator_service_pb.SuspendResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_TerminateRequest(arg) {
  if (!(arg instanceof orchestrator_service_pb.TerminateRequest)) {
    throw new Error('Expected argument of type TerminateRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_TerminateRequest(buffer_arg) {
  return orchestrator_service_pb.TerminateRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_TerminateResponse(arg) {
  if (!(arg instanceof orchestrator_service_pb.TerminateResponse)) {
    throw new Error('Expected argument of type TerminateResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_TerminateResponse(buffer_arg) {
  return orchestrator_service_pb.TerminateResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_WorkItem(arg) {
  if (!(arg instanceof orchestrator_service_pb.WorkItem)) {
    throw new Error('Expected argument of type WorkItem');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_WorkItem(buffer_arg) {
  return orchestrator_service_pb.WorkItem.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_google_protobuf_Empty(arg) {
  if (!(arg instanceof google_protobuf_empty_pb.Empty)) {
    throw new Error('Expected argument of type google.protobuf.Empty');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_google_protobuf_Empty(buffer_arg) {
  return google_protobuf_empty_pb.Empty.deserializeBinary(new Uint8Array(buffer_arg));
}


var TaskHubSidecarServiceService = exports.TaskHubSidecarServiceService = {
  // Sends a hello request to the sidecar service.
hello: {
    path: '/TaskHubSidecarService/Hello',
    requestStream: false,
    responseStream: false,
    requestType: google_protobuf_empty_pb.Empty,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_google_protobuf_Empty,
    requestDeserialize: deserialize_google_protobuf_Empty,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  // Starts a new orchestration instance.
startInstance: {
    path: '/TaskHubSidecarService/StartInstance',
    requestStream: false,
    responseStream: false,
    requestType: orchestrator_service_pb.CreateInstanceRequest,
    responseType: orchestrator_service_pb.CreateInstanceResponse,
    requestSerialize: serialize_CreateInstanceRequest,
    requestDeserialize: deserialize_CreateInstanceRequest,
    responseSerialize: serialize_CreateInstanceResponse,
    responseDeserialize: deserialize_CreateInstanceResponse,
  },
  // Gets the status of an existing orchestration instance.
getInstance: {
    path: '/TaskHubSidecarService/GetInstance',
    requestStream: false,
    responseStream: false,
    requestType: orchestrator_service_pb.GetInstanceRequest,
    responseType: orchestrator_service_pb.GetInstanceResponse,
    requestSerialize: serialize_GetInstanceRequest,
    requestDeserialize: deserialize_GetInstanceRequest,
    responseSerialize: serialize_GetInstanceResponse,
    responseDeserialize: deserialize_GetInstanceResponse,
  },
  // Rewinds an orchestration instance to last known good state and replays from there.
rewindInstance: {
    path: '/TaskHubSidecarService/RewindInstance',
    requestStream: false,
    responseStream: false,
    requestType: orchestrator_service_pb.RewindInstanceRequest,
    responseType: orchestrator_service_pb.RewindInstanceResponse,
    requestSerialize: serialize_RewindInstanceRequest,
    requestDeserialize: deserialize_RewindInstanceRequest,
    responseSerialize: serialize_RewindInstanceResponse,
    responseDeserialize: deserialize_RewindInstanceResponse,
  },
  // Waits for an orchestration instance to reach a running or completion state.
waitForInstanceStart: {
    path: '/TaskHubSidecarService/WaitForInstanceStart',
    requestStream: false,
    responseStream: false,
    requestType: orchestrator_service_pb.GetInstanceRequest,
    responseType: orchestrator_service_pb.GetInstanceResponse,
    requestSerialize: serialize_GetInstanceRequest,
    requestDeserialize: deserialize_GetInstanceRequest,
    responseSerialize: serialize_GetInstanceResponse,
    responseDeserialize: deserialize_GetInstanceResponse,
  },
  // Waits for an orchestration instance to reach a completion state (completed, failed, terminated, etc.).
waitForInstanceCompletion: {
    path: '/TaskHubSidecarService/WaitForInstanceCompletion',
    requestStream: false,
    responseStream: false,
    requestType: orchestrator_service_pb.GetInstanceRequest,
    responseType: orchestrator_service_pb.GetInstanceResponse,
    requestSerialize: serialize_GetInstanceRequest,
    requestDeserialize: deserialize_GetInstanceRequest,
    responseSerialize: serialize_GetInstanceResponse,
    responseDeserialize: deserialize_GetInstanceResponse,
  },
  // Raises an event to a running orchestration instance.
raiseEvent: {
    path: '/TaskHubSidecarService/RaiseEvent',
    requestStream: false,
    responseStream: false,
    requestType: orchestrator_service_pb.RaiseEventRequest,
    responseType: orchestrator_service_pb.RaiseEventResponse,
    requestSerialize: serialize_RaiseEventRequest,
    requestDeserialize: deserialize_RaiseEventRequest,
    responseSerialize: serialize_RaiseEventResponse,
    responseDeserialize: deserialize_RaiseEventResponse,
  },
  // Terminates a running orchestration instance.
terminateInstance: {
    path: '/TaskHubSidecarService/TerminateInstance',
    requestStream: false,
    responseStream: false,
    requestType: orchestrator_service_pb.TerminateRequest,
    responseType: orchestrator_service_pb.TerminateResponse,
    requestSerialize: serialize_TerminateRequest,
    requestDeserialize: deserialize_TerminateRequest,
    responseSerialize: serialize_TerminateResponse,
    responseDeserialize: deserialize_TerminateResponse,
  },
  // Suspends a running orchestration instance.
suspendInstance: {
    path: '/TaskHubSidecarService/SuspendInstance',
    requestStream: false,
    responseStream: false,
    requestType: orchestrator_service_pb.SuspendRequest,
    responseType: orchestrator_service_pb.SuspendResponse,
    requestSerialize: serialize_SuspendRequest,
    requestDeserialize: deserialize_SuspendRequest,
    responseSerialize: serialize_SuspendResponse,
    responseDeserialize: deserialize_SuspendResponse,
  },
  // Resumes a suspended orchestration instance.
resumeInstance: {
    path: '/TaskHubSidecarService/ResumeInstance',
    requestStream: false,
    responseStream: false,
    requestType: orchestrator_service_pb.ResumeRequest,
    responseType: orchestrator_service_pb.ResumeResponse,
    requestSerialize: serialize_ResumeRequest,
    requestDeserialize: deserialize_ResumeRequest,
    responseSerialize: serialize_ResumeResponse,
    responseDeserialize: deserialize_ResumeResponse,
  },
  // rpc DeleteInstance(DeleteInstanceRequest) returns (DeleteInstanceResponse);
//
queryInstances: {
    path: '/TaskHubSidecarService/QueryInstances',
    requestStream: false,
    responseStream: false,
    requestType: orchestrator_service_pb.QueryInstancesRequest,
    responseType: orchestrator_service_pb.QueryInstancesResponse,
    requestSerialize: serialize_QueryInstancesRequest,
    requestDeserialize: deserialize_QueryInstancesRequest,
    responseSerialize: serialize_QueryInstancesResponse,
    responseDeserialize: deserialize_QueryInstancesResponse,
  },
  purgeInstances: {
    path: '/TaskHubSidecarService/PurgeInstances',
    requestStream: false,
    responseStream: false,
    requestType: orchestrator_service_pb.PurgeInstancesRequest,
    responseType: orchestrator_service_pb.PurgeInstancesResponse,
    requestSerialize: serialize_PurgeInstancesRequest,
    requestDeserialize: deserialize_PurgeInstancesRequest,
    responseSerialize: serialize_PurgeInstancesResponse,
    responseDeserialize: deserialize_PurgeInstancesResponse,
  },
  getWorkItems: {
    path: '/TaskHubSidecarService/GetWorkItems',
    requestStream: false,
    responseStream: true,
    requestType: orchestrator_service_pb.GetWorkItemsRequest,
    responseType: orchestrator_service_pb.WorkItem,
    requestSerialize: serialize_GetWorkItemsRequest,
    requestDeserialize: deserialize_GetWorkItemsRequest,
    responseSerialize: serialize_WorkItem,
    responseDeserialize: deserialize_WorkItem,
  },
  completeActivityTask: {
    path: '/TaskHubSidecarService/CompleteActivityTask',
    requestStream: false,
    responseStream: false,
    requestType: orchestrator_service_pb.ActivityResponse,
    responseType: orchestrator_service_pb.CompleteTaskResponse,
    requestSerialize: serialize_ActivityResponse,
    requestDeserialize: deserialize_ActivityResponse,
    responseSerialize: serialize_CompleteTaskResponse,
    responseDeserialize: deserialize_CompleteTaskResponse,
  },
  completeOrchestratorTask: {
    path: '/TaskHubSidecarService/CompleteOrchestratorTask',
    requestStream: false,
    responseStream: false,
    requestType: orchestrator_service_pb.OrchestratorResponse,
    responseType: orchestrator_service_pb.CompleteTaskResponse,
    requestSerialize: serialize_OrchestratorResponse,
    requestDeserialize: deserialize_OrchestratorResponse,
    responseSerialize: serialize_CompleteTaskResponse,
    responseDeserialize: deserialize_CompleteTaskResponse,
  },
  // Deletes and Creates the necessary resources for the orchestration service and the instance store
createTaskHub: {
    path: '/TaskHubSidecarService/CreateTaskHub',
    requestStream: false,
    responseStream: false,
    requestType: orchestrator_service_pb.CreateTaskHubRequest,
    responseType: orchestrator_service_pb.CreateTaskHubResponse,
    requestSerialize: serialize_CreateTaskHubRequest,
    requestDeserialize: deserialize_CreateTaskHubRequest,
    responseSerialize: serialize_CreateTaskHubResponse,
    responseDeserialize: deserialize_CreateTaskHubResponse,
  },
  // Deletes the resources for the orchestration service and optionally the instance store
deleteTaskHub: {
    path: '/TaskHubSidecarService/DeleteTaskHub',
    requestStream: false,
    responseStream: false,
    requestType: orchestrator_service_pb.DeleteTaskHubRequest,
    responseType: orchestrator_service_pb.DeleteTaskHubResponse,
    requestSerialize: serialize_DeleteTaskHubRequest,
    requestDeserialize: deserialize_DeleteTaskHubRequest,
    responseSerialize: serialize_DeleteTaskHubResponse,
    responseDeserialize: deserialize_DeleteTaskHubResponse,
  },
};

exports.TaskHubSidecarServiceClient = grpc.makeGenericClientConstructor(TaskHubSidecarServiceService);
