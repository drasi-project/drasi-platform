// GENERATED CODE -- DO NOT EDIT!

// Original file comments:
//
// Copyright 2021 The Dapr Authors
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
'use strict';
var grpc = require('@grpc/grpc-js');
var dapr_proto_runtime_v1_dapr_pb = require('../../../../dapr/proto/runtime/v1/dapr_pb.js');
var google_protobuf_any_pb = require('google-protobuf/google/protobuf/any_pb.js');
var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js');
var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js');
var dapr_proto_common_v1_common_pb = require('../../../../dapr/proto/common/v1/common_pb.js');
var dapr_proto_runtime_v1_appcallback_pb = require('../../../../dapr/proto/runtime/v1/appcallback_pb.js');

function serialize_dapr_proto_common_v1_InvokeResponse(arg) {
  if (!(arg instanceof dapr_proto_common_v1_common_pb.InvokeResponse)) {
    throw new Error('Expected argument of type dapr.proto.common.v1.InvokeResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_common_v1_InvokeResponse(buffer_arg) {
  return dapr_proto_common_v1_common_pb.InvokeResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_BulkPublishRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.BulkPublishRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.BulkPublishRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_BulkPublishRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.BulkPublishRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_BulkPublishResponse(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.BulkPublishResponse)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.BulkPublishResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_BulkPublishResponse(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.BulkPublishResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_DecryptRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.DecryptRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.DecryptRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_DecryptRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.DecryptRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_DecryptResponse(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.DecryptResponse)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.DecryptResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_DecryptResponse(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.DecryptResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_DeleteBulkStateRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.DeleteBulkStateRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.DeleteBulkStateRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_DeleteBulkStateRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.DeleteBulkStateRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_DeleteJobRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.DeleteJobRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.DeleteJobRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_DeleteJobRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.DeleteJobRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_DeleteJobResponse(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.DeleteJobResponse)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.DeleteJobResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_DeleteJobResponse(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.DeleteJobResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_DeleteStateRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.DeleteStateRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.DeleteStateRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_DeleteStateRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.DeleteStateRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_EncryptRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.EncryptRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.EncryptRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_EncryptRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.EncryptRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_EncryptResponse(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.EncryptResponse)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.EncryptResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_EncryptResponse(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.EncryptResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_ExecuteActorStateTransactionRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.ExecuteActorStateTransactionRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.ExecuteActorStateTransactionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_ExecuteActorStateTransactionRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.ExecuteActorStateTransactionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_ExecuteStateTransactionRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.ExecuteStateTransactionRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.ExecuteStateTransactionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_ExecuteStateTransactionRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.ExecuteStateTransactionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_GetActorStateRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.GetActorStateRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.GetActorStateRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_GetActorStateRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.GetActorStateRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_GetActorStateResponse(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.GetActorStateResponse)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.GetActorStateResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_GetActorStateResponse(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.GetActorStateResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_GetBulkSecretRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.GetBulkSecretRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.GetBulkSecretRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_GetBulkSecretRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.GetBulkSecretRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_GetBulkSecretResponse(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.GetBulkSecretResponse)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.GetBulkSecretResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_GetBulkSecretResponse(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.GetBulkSecretResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_GetBulkStateRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.GetBulkStateRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.GetBulkStateRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_GetBulkStateRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.GetBulkStateRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_GetBulkStateResponse(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.GetBulkStateResponse)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.GetBulkStateResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_GetBulkStateResponse(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.GetBulkStateResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_GetConfigurationRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.GetConfigurationRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.GetConfigurationRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_GetConfigurationRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.GetConfigurationRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_GetConfigurationResponse(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.GetConfigurationResponse)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.GetConfigurationResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_GetConfigurationResponse(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.GetConfigurationResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_GetJobRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.GetJobRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.GetJobRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_GetJobRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.GetJobRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_GetJobResponse(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.GetJobResponse)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.GetJobResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_GetJobResponse(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.GetJobResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_GetMetadataRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.GetMetadataRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.GetMetadataRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_GetMetadataRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.GetMetadataRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_GetMetadataResponse(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.GetMetadataResponse)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.GetMetadataResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_GetMetadataResponse(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.GetMetadataResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_GetSecretRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.GetSecretRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.GetSecretRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_GetSecretRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.GetSecretRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_GetSecretResponse(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.GetSecretResponse)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.GetSecretResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_GetSecretResponse(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.GetSecretResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_GetStateRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.GetStateRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.GetStateRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_GetStateRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.GetStateRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_GetStateResponse(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.GetStateResponse)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.GetStateResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_GetStateResponse(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.GetStateResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_GetWorkflowRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.GetWorkflowRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.GetWorkflowRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_GetWorkflowRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.GetWorkflowRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_GetWorkflowResponse(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.GetWorkflowResponse)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.GetWorkflowResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_GetWorkflowResponse(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.GetWorkflowResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_InvokeActorRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.InvokeActorRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.InvokeActorRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_InvokeActorRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.InvokeActorRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_InvokeActorResponse(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.InvokeActorResponse)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.InvokeActorResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_InvokeActorResponse(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.InvokeActorResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_InvokeBindingRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.InvokeBindingRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.InvokeBindingRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_InvokeBindingRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.InvokeBindingRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_InvokeBindingResponse(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.InvokeBindingResponse)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.InvokeBindingResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_InvokeBindingResponse(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.InvokeBindingResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_InvokeServiceRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.InvokeServiceRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.InvokeServiceRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_InvokeServiceRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.InvokeServiceRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_PauseWorkflowRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.PauseWorkflowRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.PauseWorkflowRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_PauseWorkflowRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.PauseWorkflowRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_PublishEventRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.PublishEventRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.PublishEventRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_PublishEventRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.PublishEventRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_PurgeWorkflowRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.PurgeWorkflowRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.PurgeWorkflowRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_PurgeWorkflowRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.PurgeWorkflowRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_QueryStateRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.QueryStateRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.QueryStateRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_QueryStateRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.QueryStateRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_QueryStateResponse(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.QueryStateResponse)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.QueryStateResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_QueryStateResponse(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.QueryStateResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_RaiseEventWorkflowRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.RaiseEventWorkflowRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.RaiseEventWorkflowRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_RaiseEventWorkflowRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.RaiseEventWorkflowRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_RegisterActorReminderRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.RegisterActorReminderRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.RegisterActorReminderRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_RegisterActorReminderRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.RegisterActorReminderRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_RegisterActorTimerRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.RegisterActorTimerRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.RegisterActorTimerRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_RegisterActorTimerRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.RegisterActorTimerRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_ResumeWorkflowRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.ResumeWorkflowRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.ResumeWorkflowRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_ResumeWorkflowRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.ResumeWorkflowRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_SaveStateRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.SaveStateRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.SaveStateRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_SaveStateRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.SaveStateRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_ScheduleJobRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.ScheduleJobRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.ScheduleJobRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_ScheduleJobRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.ScheduleJobRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_ScheduleJobResponse(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.ScheduleJobResponse)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.ScheduleJobResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_ScheduleJobResponse(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.ScheduleJobResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_SetMetadataRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.SetMetadataRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.SetMetadataRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_SetMetadataRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.SetMetadataRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_ShutdownRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.ShutdownRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.ShutdownRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_ShutdownRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.ShutdownRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_StartWorkflowRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.StartWorkflowRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.StartWorkflowRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_StartWorkflowRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.StartWorkflowRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_StartWorkflowResponse(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.StartWorkflowResponse)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.StartWorkflowResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_StartWorkflowResponse(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.StartWorkflowResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_SubscribeConfigurationRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.SubscribeConfigurationRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.SubscribeConfigurationRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_SubscribeConfigurationRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.SubscribeConfigurationRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_SubscribeConfigurationResponse(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.SubscribeConfigurationResponse)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.SubscribeConfigurationResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_SubscribeConfigurationResponse(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.SubscribeConfigurationResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_SubscribeTopicEventsRequestAlpha1(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.SubscribeTopicEventsRequestAlpha1)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.SubscribeTopicEventsRequestAlpha1');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_SubscribeTopicEventsRequestAlpha1(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.SubscribeTopicEventsRequestAlpha1.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_SubscribeTopicEventsResponseAlpha1(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.SubscribeTopicEventsResponseAlpha1)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.SubscribeTopicEventsResponseAlpha1');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_SubscribeTopicEventsResponseAlpha1(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.SubscribeTopicEventsResponseAlpha1.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_SubtleDecryptRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.SubtleDecryptRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.SubtleDecryptRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_SubtleDecryptRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.SubtleDecryptRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_SubtleDecryptResponse(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.SubtleDecryptResponse)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.SubtleDecryptResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_SubtleDecryptResponse(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.SubtleDecryptResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_SubtleEncryptRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.SubtleEncryptRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.SubtleEncryptRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_SubtleEncryptRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.SubtleEncryptRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_SubtleEncryptResponse(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.SubtleEncryptResponse)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.SubtleEncryptResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_SubtleEncryptResponse(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.SubtleEncryptResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_SubtleGetKeyRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.SubtleGetKeyRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.SubtleGetKeyRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_SubtleGetKeyRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.SubtleGetKeyRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_SubtleGetKeyResponse(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.SubtleGetKeyResponse)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.SubtleGetKeyResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_SubtleGetKeyResponse(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.SubtleGetKeyResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_SubtleSignRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.SubtleSignRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.SubtleSignRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_SubtleSignRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.SubtleSignRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_SubtleSignResponse(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.SubtleSignResponse)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.SubtleSignResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_SubtleSignResponse(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.SubtleSignResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_SubtleUnwrapKeyRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.SubtleUnwrapKeyRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.SubtleUnwrapKeyRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_SubtleUnwrapKeyRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.SubtleUnwrapKeyRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_SubtleUnwrapKeyResponse(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.SubtleUnwrapKeyResponse)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.SubtleUnwrapKeyResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_SubtleUnwrapKeyResponse(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.SubtleUnwrapKeyResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_SubtleVerifyRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.SubtleVerifyRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.SubtleVerifyRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_SubtleVerifyRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.SubtleVerifyRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_SubtleVerifyResponse(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.SubtleVerifyResponse)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.SubtleVerifyResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_SubtleVerifyResponse(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.SubtleVerifyResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_SubtleWrapKeyRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.SubtleWrapKeyRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.SubtleWrapKeyRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_SubtleWrapKeyRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.SubtleWrapKeyRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_SubtleWrapKeyResponse(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.SubtleWrapKeyResponse)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.SubtleWrapKeyResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_SubtleWrapKeyResponse(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.SubtleWrapKeyResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_TerminateWorkflowRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.TerminateWorkflowRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.TerminateWorkflowRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_TerminateWorkflowRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.TerminateWorkflowRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_TryLockRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.TryLockRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.TryLockRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_TryLockRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.TryLockRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_TryLockResponse(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.TryLockResponse)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.TryLockResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_TryLockResponse(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.TryLockResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_UnlockRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.UnlockRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.UnlockRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_UnlockRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.UnlockRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_UnlockResponse(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.UnlockResponse)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.UnlockResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_UnlockResponse(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.UnlockResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_UnregisterActorReminderRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.UnregisterActorReminderRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.UnregisterActorReminderRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_UnregisterActorReminderRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.UnregisterActorReminderRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_UnregisterActorTimerRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.UnregisterActorTimerRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.UnregisterActorTimerRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_UnregisterActorTimerRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.UnregisterActorTimerRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_UnsubscribeConfigurationRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.UnsubscribeConfigurationRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_UnsubscribeConfigurationRequest(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_UnsubscribeConfigurationResponse(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationResponse)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.UnsubscribeConfigurationResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_UnsubscribeConfigurationResponse(buffer_arg) {
  return dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationResponse.deserializeBinary(new Uint8Array(buffer_arg));
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


// Dapr service provides APIs to user application to access Dapr building blocks.
var DaprService = exports.DaprService = {
  // Invokes a method on a remote Dapr app.
// Deprecated: Use proxy mode service invocation instead.
invokeService: {
    path: '/dapr.proto.runtime.v1.Dapr/InvokeService',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.InvokeServiceRequest,
    responseType: dapr_proto_common_v1_common_pb.InvokeResponse,
    requestSerialize: serialize_dapr_proto_runtime_v1_InvokeServiceRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_InvokeServiceRequest,
    responseSerialize: serialize_dapr_proto_common_v1_InvokeResponse,
    responseDeserialize: deserialize_dapr_proto_common_v1_InvokeResponse,
  },
  // Gets the state for a specific key.
getState: {
    path: '/dapr.proto.runtime.v1.Dapr/GetState',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.GetStateRequest,
    responseType: dapr_proto_runtime_v1_dapr_pb.GetStateResponse,
    requestSerialize: serialize_dapr_proto_runtime_v1_GetStateRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_GetStateRequest,
    responseSerialize: serialize_dapr_proto_runtime_v1_GetStateResponse,
    responseDeserialize: deserialize_dapr_proto_runtime_v1_GetStateResponse,
  },
  // Gets a bulk of state items for a list of keys
getBulkState: {
    path: '/dapr.proto.runtime.v1.Dapr/GetBulkState',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.GetBulkStateRequest,
    responseType: dapr_proto_runtime_v1_dapr_pb.GetBulkStateResponse,
    requestSerialize: serialize_dapr_proto_runtime_v1_GetBulkStateRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_GetBulkStateRequest,
    responseSerialize: serialize_dapr_proto_runtime_v1_GetBulkStateResponse,
    responseDeserialize: deserialize_dapr_proto_runtime_v1_GetBulkStateResponse,
  },
  // Saves the state for a specific key.
saveState: {
    path: '/dapr.proto.runtime.v1.Dapr/SaveState',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.SaveStateRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_dapr_proto_runtime_v1_SaveStateRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_SaveStateRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  // Queries the state.
queryStateAlpha1: {
    path: '/dapr.proto.runtime.v1.Dapr/QueryStateAlpha1',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.QueryStateRequest,
    responseType: dapr_proto_runtime_v1_dapr_pb.QueryStateResponse,
    requestSerialize: serialize_dapr_proto_runtime_v1_QueryStateRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_QueryStateRequest,
    responseSerialize: serialize_dapr_proto_runtime_v1_QueryStateResponse,
    responseDeserialize: deserialize_dapr_proto_runtime_v1_QueryStateResponse,
  },
  // Deletes the state for a specific key.
deleteState: {
    path: '/dapr.proto.runtime.v1.Dapr/DeleteState',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.DeleteStateRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_dapr_proto_runtime_v1_DeleteStateRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_DeleteStateRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  // Deletes a bulk of state items for a list of keys
deleteBulkState: {
    path: '/dapr.proto.runtime.v1.Dapr/DeleteBulkState',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.DeleteBulkStateRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_dapr_proto_runtime_v1_DeleteBulkStateRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_DeleteBulkStateRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  // Executes transactions for a specified store
executeStateTransaction: {
    path: '/dapr.proto.runtime.v1.Dapr/ExecuteStateTransaction',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.ExecuteStateTransactionRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_dapr_proto_runtime_v1_ExecuteStateTransactionRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_ExecuteStateTransactionRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  // Publishes events to the specific topic.
publishEvent: {
    path: '/dapr.proto.runtime.v1.Dapr/PublishEvent',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.PublishEventRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_dapr_proto_runtime_v1_PublishEventRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_PublishEventRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  // Bulk Publishes multiple events to the specified topic.
bulkPublishEventAlpha1: {
    path: '/dapr.proto.runtime.v1.Dapr/BulkPublishEventAlpha1',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.BulkPublishRequest,
    responseType: dapr_proto_runtime_v1_dapr_pb.BulkPublishResponse,
    requestSerialize: serialize_dapr_proto_runtime_v1_BulkPublishRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_BulkPublishRequest,
    responseSerialize: serialize_dapr_proto_runtime_v1_BulkPublishResponse,
    responseDeserialize: deserialize_dapr_proto_runtime_v1_BulkPublishResponse,
  },
  // SubscribeTopicEventsAlpha1 subscribes to a PubSub topic and receives topic
// events from it.
subscribeTopicEventsAlpha1: {
    path: '/dapr.proto.runtime.v1.Dapr/SubscribeTopicEventsAlpha1',
    requestStream: true,
    responseStream: true,
    requestType: dapr_proto_runtime_v1_dapr_pb.SubscribeTopicEventsRequestAlpha1,
    responseType: dapr_proto_runtime_v1_dapr_pb.SubscribeTopicEventsResponseAlpha1,
    requestSerialize: serialize_dapr_proto_runtime_v1_SubscribeTopicEventsRequestAlpha1,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_SubscribeTopicEventsRequestAlpha1,
    responseSerialize: serialize_dapr_proto_runtime_v1_SubscribeTopicEventsResponseAlpha1,
    responseDeserialize: deserialize_dapr_proto_runtime_v1_SubscribeTopicEventsResponseAlpha1,
  },
  // Invokes binding data to specific output bindings
invokeBinding: {
    path: '/dapr.proto.runtime.v1.Dapr/InvokeBinding',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.InvokeBindingRequest,
    responseType: dapr_proto_runtime_v1_dapr_pb.InvokeBindingResponse,
    requestSerialize: serialize_dapr_proto_runtime_v1_InvokeBindingRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_InvokeBindingRequest,
    responseSerialize: serialize_dapr_proto_runtime_v1_InvokeBindingResponse,
    responseDeserialize: deserialize_dapr_proto_runtime_v1_InvokeBindingResponse,
  },
  // Gets secrets from secret stores.
getSecret: {
    path: '/dapr.proto.runtime.v1.Dapr/GetSecret',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.GetSecretRequest,
    responseType: dapr_proto_runtime_v1_dapr_pb.GetSecretResponse,
    requestSerialize: serialize_dapr_proto_runtime_v1_GetSecretRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_GetSecretRequest,
    responseSerialize: serialize_dapr_proto_runtime_v1_GetSecretResponse,
    responseDeserialize: deserialize_dapr_proto_runtime_v1_GetSecretResponse,
  },
  // Gets a bulk of secrets
getBulkSecret: {
    path: '/dapr.proto.runtime.v1.Dapr/GetBulkSecret',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.GetBulkSecretRequest,
    responseType: dapr_proto_runtime_v1_dapr_pb.GetBulkSecretResponse,
    requestSerialize: serialize_dapr_proto_runtime_v1_GetBulkSecretRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_GetBulkSecretRequest,
    responseSerialize: serialize_dapr_proto_runtime_v1_GetBulkSecretResponse,
    responseDeserialize: deserialize_dapr_proto_runtime_v1_GetBulkSecretResponse,
  },
  // Register an actor timer.
registerActorTimer: {
    path: '/dapr.proto.runtime.v1.Dapr/RegisterActorTimer',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.RegisterActorTimerRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_dapr_proto_runtime_v1_RegisterActorTimerRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_RegisterActorTimerRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  // Unregister an actor timer.
unregisterActorTimer: {
    path: '/dapr.proto.runtime.v1.Dapr/UnregisterActorTimer',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.UnregisterActorTimerRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_dapr_proto_runtime_v1_UnregisterActorTimerRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_UnregisterActorTimerRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  // Register an actor reminder.
registerActorReminder: {
    path: '/dapr.proto.runtime.v1.Dapr/RegisterActorReminder',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.RegisterActorReminderRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_dapr_proto_runtime_v1_RegisterActorReminderRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_RegisterActorReminderRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  // Unregister an actor reminder.
unregisterActorReminder: {
    path: '/dapr.proto.runtime.v1.Dapr/UnregisterActorReminder',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.UnregisterActorReminderRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_dapr_proto_runtime_v1_UnregisterActorReminderRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_UnregisterActorReminderRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  // Gets the state for a specific actor.
getActorState: {
    path: '/dapr.proto.runtime.v1.Dapr/GetActorState',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.GetActorStateRequest,
    responseType: dapr_proto_runtime_v1_dapr_pb.GetActorStateResponse,
    requestSerialize: serialize_dapr_proto_runtime_v1_GetActorStateRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_GetActorStateRequest,
    responseSerialize: serialize_dapr_proto_runtime_v1_GetActorStateResponse,
    responseDeserialize: deserialize_dapr_proto_runtime_v1_GetActorStateResponse,
  },
  // Executes state transactions for a specified actor
executeActorStateTransaction: {
    path: '/dapr.proto.runtime.v1.Dapr/ExecuteActorStateTransaction',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.ExecuteActorStateTransactionRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_dapr_proto_runtime_v1_ExecuteActorStateTransactionRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_ExecuteActorStateTransactionRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  // InvokeActor calls a method on an actor.
invokeActor: {
    path: '/dapr.proto.runtime.v1.Dapr/InvokeActor',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.InvokeActorRequest,
    responseType: dapr_proto_runtime_v1_dapr_pb.InvokeActorResponse,
    requestSerialize: serialize_dapr_proto_runtime_v1_InvokeActorRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_InvokeActorRequest,
    responseSerialize: serialize_dapr_proto_runtime_v1_InvokeActorResponse,
    responseDeserialize: deserialize_dapr_proto_runtime_v1_InvokeActorResponse,
  },
  // GetConfiguration gets configuration from configuration store.
getConfigurationAlpha1: {
    path: '/dapr.proto.runtime.v1.Dapr/GetConfigurationAlpha1',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.GetConfigurationRequest,
    responseType: dapr_proto_runtime_v1_dapr_pb.GetConfigurationResponse,
    requestSerialize: serialize_dapr_proto_runtime_v1_GetConfigurationRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_GetConfigurationRequest,
    responseSerialize: serialize_dapr_proto_runtime_v1_GetConfigurationResponse,
    responseDeserialize: deserialize_dapr_proto_runtime_v1_GetConfigurationResponse,
  },
  // GetConfiguration gets configuration from configuration store.
getConfiguration: {
    path: '/dapr.proto.runtime.v1.Dapr/GetConfiguration',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.GetConfigurationRequest,
    responseType: dapr_proto_runtime_v1_dapr_pb.GetConfigurationResponse,
    requestSerialize: serialize_dapr_proto_runtime_v1_GetConfigurationRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_GetConfigurationRequest,
    responseSerialize: serialize_dapr_proto_runtime_v1_GetConfigurationResponse,
    responseDeserialize: deserialize_dapr_proto_runtime_v1_GetConfigurationResponse,
  },
  // SubscribeConfiguration gets configuration from configuration store and subscribe the updates event by grpc stream
subscribeConfigurationAlpha1: {
    path: '/dapr.proto.runtime.v1.Dapr/SubscribeConfigurationAlpha1',
    requestStream: false,
    responseStream: true,
    requestType: dapr_proto_runtime_v1_dapr_pb.SubscribeConfigurationRequest,
    responseType: dapr_proto_runtime_v1_dapr_pb.SubscribeConfigurationResponse,
    requestSerialize: serialize_dapr_proto_runtime_v1_SubscribeConfigurationRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_SubscribeConfigurationRequest,
    responseSerialize: serialize_dapr_proto_runtime_v1_SubscribeConfigurationResponse,
    responseDeserialize: deserialize_dapr_proto_runtime_v1_SubscribeConfigurationResponse,
  },
  // SubscribeConfiguration gets configuration from configuration store and subscribe the updates event by grpc stream
subscribeConfiguration: {
    path: '/dapr.proto.runtime.v1.Dapr/SubscribeConfiguration',
    requestStream: false,
    responseStream: true,
    requestType: dapr_proto_runtime_v1_dapr_pb.SubscribeConfigurationRequest,
    responseType: dapr_proto_runtime_v1_dapr_pb.SubscribeConfigurationResponse,
    requestSerialize: serialize_dapr_proto_runtime_v1_SubscribeConfigurationRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_SubscribeConfigurationRequest,
    responseSerialize: serialize_dapr_proto_runtime_v1_SubscribeConfigurationResponse,
    responseDeserialize: deserialize_dapr_proto_runtime_v1_SubscribeConfigurationResponse,
  },
  // UnSubscribeConfiguration unsubscribe the subscription of configuration
unsubscribeConfigurationAlpha1: {
    path: '/dapr.proto.runtime.v1.Dapr/UnsubscribeConfigurationAlpha1',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationRequest,
    responseType: dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationResponse,
    requestSerialize: serialize_dapr_proto_runtime_v1_UnsubscribeConfigurationRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_UnsubscribeConfigurationRequest,
    responseSerialize: serialize_dapr_proto_runtime_v1_UnsubscribeConfigurationResponse,
    responseDeserialize: deserialize_dapr_proto_runtime_v1_UnsubscribeConfigurationResponse,
  },
  // UnSubscribeConfiguration unsubscribe the subscription of configuration
unsubscribeConfiguration: {
    path: '/dapr.proto.runtime.v1.Dapr/UnsubscribeConfiguration',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationRequest,
    responseType: dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationResponse,
    requestSerialize: serialize_dapr_proto_runtime_v1_UnsubscribeConfigurationRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_UnsubscribeConfigurationRequest,
    responseSerialize: serialize_dapr_proto_runtime_v1_UnsubscribeConfigurationResponse,
    responseDeserialize: deserialize_dapr_proto_runtime_v1_UnsubscribeConfigurationResponse,
  },
  // TryLockAlpha1 tries to get a lock with an expiry.
tryLockAlpha1: {
    path: '/dapr.proto.runtime.v1.Dapr/TryLockAlpha1',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.TryLockRequest,
    responseType: dapr_proto_runtime_v1_dapr_pb.TryLockResponse,
    requestSerialize: serialize_dapr_proto_runtime_v1_TryLockRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_TryLockRequest,
    responseSerialize: serialize_dapr_proto_runtime_v1_TryLockResponse,
    responseDeserialize: deserialize_dapr_proto_runtime_v1_TryLockResponse,
  },
  // UnlockAlpha1 unlocks a lock.
unlockAlpha1: {
    path: '/dapr.proto.runtime.v1.Dapr/UnlockAlpha1',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.UnlockRequest,
    responseType: dapr_proto_runtime_v1_dapr_pb.UnlockResponse,
    requestSerialize: serialize_dapr_proto_runtime_v1_UnlockRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_UnlockRequest,
    responseSerialize: serialize_dapr_proto_runtime_v1_UnlockResponse,
    responseDeserialize: deserialize_dapr_proto_runtime_v1_UnlockResponse,
  },
  // EncryptAlpha1 encrypts a message using the Dapr encryption scheme and a key stored in the vault.
encryptAlpha1: {
    path: '/dapr.proto.runtime.v1.Dapr/EncryptAlpha1',
    requestStream: true,
    responseStream: true,
    requestType: dapr_proto_runtime_v1_dapr_pb.EncryptRequest,
    responseType: dapr_proto_runtime_v1_dapr_pb.EncryptResponse,
    requestSerialize: serialize_dapr_proto_runtime_v1_EncryptRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_EncryptRequest,
    responseSerialize: serialize_dapr_proto_runtime_v1_EncryptResponse,
    responseDeserialize: deserialize_dapr_proto_runtime_v1_EncryptResponse,
  },
  // DecryptAlpha1 decrypts a message using the Dapr encryption scheme and a key stored in the vault.
decryptAlpha1: {
    path: '/dapr.proto.runtime.v1.Dapr/DecryptAlpha1',
    requestStream: true,
    responseStream: true,
    requestType: dapr_proto_runtime_v1_dapr_pb.DecryptRequest,
    responseType: dapr_proto_runtime_v1_dapr_pb.DecryptResponse,
    requestSerialize: serialize_dapr_proto_runtime_v1_DecryptRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_DecryptRequest,
    responseSerialize: serialize_dapr_proto_runtime_v1_DecryptResponse,
    responseDeserialize: deserialize_dapr_proto_runtime_v1_DecryptResponse,
  },
  // Gets metadata of the sidecar
getMetadata: {
    path: '/dapr.proto.runtime.v1.Dapr/GetMetadata',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.GetMetadataRequest,
    responseType: dapr_proto_runtime_v1_dapr_pb.GetMetadataResponse,
    requestSerialize: serialize_dapr_proto_runtime_v1_GetMetadataRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_GetMetadataRequest,
    responseSerialize: serialize_dapr_proto_runtime_v1_GetMetadataResponse,
    responseDeserialize: deserialize_dapr_proto_runtime_v1_GetMetadataResponse,
  },
  // Sets value in extended metadata of the sidecar
setMetadata: {
    path: '/dapr.proto.runtime.v1.Dapr/SetMetadata',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.SetMetadataRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_dapr_proto_runtime_v1_SetMetadataRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_SetMetadataRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  // SubtleGetKeyAlpha1 returns the public part of an asymmetric key stored in the vault.
subtleGetKeyAlpha1: {
    path: '/dapr.proto.runtime.v1.Dapr/SubtleGetKeyAlpha1',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.SubtleGetKeyRequest,
    responseType: dapr_proto_runtime_v1_dapr_pb.SubtleGetKeyResponse,
    requestSerialize: serialize_dapr_proto_runtime_v1_SubtleGetKeyRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_SubtleGetKeyRequest,
    responseSerialize: serialize_dapr_proto_runtime_v1_SubtleGetKeyResponse,
    responseDeserialize: deserialize_dapr_proto_runtime_v1_SubtleGetKeyResponse,
  },
  // SubtleEncryptAlpha1 encrypts a small message using a key stored in the vault.
subtleEncryptAlpha1: {
    path: '/dapr.proto.runtime.v1.Dapr/SubtleEncryptAlpha1',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.SubtleEncryptRequest,
    responseType: dapr_proto_runtime_v1_dapr_pb.SubtleEncryptResponse,
    requestSerialize: serialize_dapr_proto_runtime_v1_SubtleEncryptRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_SubtleEncryptRequest,
    responseSerialize: serialize_dapr_proto_runtime_v1_SubtleEncryptResponse,
    responseDeserialize: deserialize_dapr_proto_runtime_v1_SubtleEncryptResponse,
  },
  // SubtleDecryptAlpha1 decrypts a small message using a key stored in the vault.
subtleDecryptAlpha1: {
    path: '/dapr.proto.runtime.v1.Dapr/SubtleDecryptAlpha1',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.SubtleDecryptRequest,
    responseType: dapr_proto_runtime_v1_dapr_pb.SubtleDecryptResponse,
    requestSerialize: serialize_dapr_proto_runtime_v1_SubtleDecryptRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_SubtleDecryptRequest,
    responseSerialize: serialize_dapr_proto_runtime_v1_SubtleDecryptResponse,
    responseDeserialize: deserialize_dapr_proto_runtime_v1_SubtleDecryptResponse,
  },
  // SubtleWrapKeyAlpha1 wraps a key using a key stored in the vault.
subtleWrapKeyAlpha1: {
    path: '/dapr.proto.runtime.v1.Dapr/SubtleWrapKeyAlpha1',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.SubtleWrapKeyRequest,
    responseType: dapr_proto_runtime_v1_dapr_pb.SubtleWrapKeyResponse,
    requestSerialize: serialize_dapr_proto_runtime_v1_SubtleWrapKeyRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_SubtleWrapKeyRequest,
    responseSerialize: serialize_dapr_proto_runtime_v1_SubtleWrapKeyResponse,
    responseDeserialize: deserialize_dapr_proto_runtime_v1_SubtleWrapKeyResponse,
  },
  // SubtleUnwrapKeyAlpha1 unwraps a key using a key stored in the vault.
subtleUnwrapKeyAlpha1: {
    path: '/dapr.proto.runtime.v1.Dapr/SubtleUnwrapKeyAlpha1',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.SubtleUnwrapKeyRequest,
    responseType: dapr_proto_runtime_v1_dapr_pb.SubtleUnwrapKeyResponse,
    requestSerialize: serialize_dapr_proto_runtime_v1_SubtleUnwrapKeyRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_SubtleUnwrapKeyRequest,
    responseSerialize: serialize_dapr_proto_runtime_v1_SubtleUnwrapKeyResponse,
    responseDeserialize: deserialize_dapr_proto_runtime_v1_SubtleUnwrapKeyResponse,
  },
  // SubtleSignAlpha1 signs a message using a key stored in the vault.
subtleSignAlpha1: {
    path: '/dapr.proto.runtime.v1.Dapr/SubtleSignAlpha1',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.SubtleSignRequest,
    responseType: dapr_proto_runtime_v1_dapr_pb.SubtleSignResponse,
    requestSerialize: serialize_dapr_proto_runtime_v1_SubtleSignRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_SubtleSignRequest,
    responseSerialize: serialize_dapr_proto_runtime_v1_SubtleSignResponse,
    responseDeserialize: deserialize_dapr_proto_runtime_v1_SubtleSignResponse,
  },
  // SubtleVerifyAlpha1 verifies the signature of a message using a key stored in the vault.
subtleVerifyAlpha1: {
    path: '/dapr.proto.runtime.v1.Dapr/SubtleVerifyAlpha1',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.SubtleVerifyRequest,
    responseType: dapr_proto_runtime_v1_dapr_pb.SubtleVerifyResponse,
    requestSerialize: serialize_dapr_proto_runtime_v1_SubtleVerifyRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_SubtleVerifyRequest,
    responseSerialize: serialize_dapr_proto_runtime_v1_SubtleVerifyResponse,
    responseDeserialize: deserialize_dapr_proto_runtime_v1_SubtleVerifyResponse,
  },
  // Starts a new instance of a workflow
startWorkflowAlpha1: {
    path: '/dapr.proto.runtime.v1.Dapr/StartWorkflowAlpha1',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.StartWorkflowRequest,
    responseType: dapr_proto_runtime_v1_dapr_pb.StartWorkflowResponse,
    requestSerialize: serialize_dapr_proto_runtime_v1_StartWorkflowRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_StartWorkflowRequest,
    responseSerialize: serialize_dapr_proto_runtime_v1_StartWorkflowResponse,
    responseDeserialize: deserialize_dapr_proto_runtime_v1_StartWorkflowResponse,
  },
  // Gets details about a started workflow instance
getWorkflowAlpha1: {
    path: '/dapr.proto.runtime.v1.Dapr/GetWorkflowAlpha1',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.GetWorkflowRequest,
    responseType: dapr_proto_runtime_v1_dapr_pb.GetWorkflowResponse,
    requestSerialize: serialize_dapr_proto_runtime_v1_GetWorkflowRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_GetWorkflowRequest,
    responseSerialize: serialize_dapr_proto_runtime_v1_GetWorkflowResponse,
    responseDeserialize: deserialize_dapr_proto_runtime_v1_GetWorkflowResponse,
  },
  // Purge Workflow
purgeWorkflowAlpha1: {
    path: '/dapr.proto.runtime.v1.Dapr/PurgeWorkflowAlpha1',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.PurgeWorkflowRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_dapr_proto_runtime_v1_PurgeWorkflowRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_PurgeWorkflowRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  // Terminates a running workflow instance
terminateWorkflowAlpha1: {
    path: '/dapr.proto.runtime.v1.Dapr/TerminateWorkflowAlpha1',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.TerminateWorkflowRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_dapr_proto_runtime_v1_TerminateWorkflowRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_TerminateWorkflowRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  // Pauses a running workflow instance
pauseWorkflowAlpha1: {
    path: '/dapr.proto.runtime.v1.Dapr/PauseWorkflowAlpha1',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.PauseWorkflowRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_dapr_proto_runtime_v1_PauseWorkflowRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_PauseWorkflowRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  // Resumes a paused workflow instance
resumeWorkflowAlpha1: {
    path: '/dapr.proto.runtime.v1.Dapr/ResumeWorkflowAlpha1',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.ResumeWorkflowRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_dapr_proto_runtime_v1_ResumeWorkflowRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_ResumeWorkflowRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  // Raise an event to a running workflow instance
raiseEventWorkflowAlpha1: {
    path: '/dapr.proto.runtime.v1.Dapr/RaiseEventWorkflowAlpha1',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.RaiseEventWorkflowRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_dapr_proto_runtime_v1_RaiseEventWorkflowRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_RaiseEventWorkflowRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  // Starts a new instance of a workflow
startWorkflowBeta1: {
    path: '/dapr.proto.runtime.v1.Dapr/StartWorkflowBeta1',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.StartWorkflowRequest,
    responseType: dapr_proto_runtime_v1_dapr_pb.StartWorkflowResponse,
    requestSerialize: serialize_dapr_proto_runtime_v1_StartWorkflowRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_StartWorkflowRequest,
    responseSerialize: serialize_dapr_proto_runtime_v1_StartWorkflowResponse,
    responseDeserialize: deserialize_dapr_proto_runtime_v1_StartWorkflowResponse,
  },
  // Gets details about a started workflow instance
getWorkflowBeta1: {
    path: '/dapr.proto.runtime.v1.Dapr/GetWorkflowBeta1',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.GetWorkflowRequest,
    responseType: dapr_proto_runtime_v1_dapr_pb.GetWorkflowResponse,
    requestSerialize: serialize_dapr_proto_runtime_v1_GetWorkflowRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_GetWorkflowRequest,
    responseSerialize: serialize_dapr_proto_runtime_v1_GetWorkflowResponse,
    responseDeserialize: deserialize_dapr_proto_runtime_v1_GetWorkflowResponse,
  },
  // Purge Workflow
purgeWorkflowBeta1: {
    path: '/dapr.proto.runtime.v1.Dapr/PurgeWorkflowBeta1',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.PurgeWorkflowRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_dapr_proto_runtime_v1_PurgeWorkflowRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_PurgeWorkflowRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  // Terminates a running workflow instance
terminateWorkflowBeta1: {
    path: '/dapr.proto.runtime.v1.Dapr/TerminateWorkflowBeta1',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.TerminateWorkflowRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_dapr_proto_runtime_v1_TerminateWorkflowRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_TerminateWorkflowRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  // Pauses a running workflow instance
pauseWorkflowBeta1: {
    path: '/dapr.proto.runtime.v1.Dapr/PauseWorkflowBeta1',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.PauseWorkflowRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_dapr_proto_runtime_v1_PauseWorkflowRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_PauseWorkflowRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  // Resumes a paused workflow instance
resumeWorkflowBeta1: {
    path: '/dapr.proto.runtime.v1.Dapr/ResumeWorkflowBeta1',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.ResumeWorkflowRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_dapr_proto_runtime_v1_ResumeWorkflowRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_ResumeWorkflowRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  // Raise an event to a running workflow instance
raiseEventWorkflowBeta1: {
    path: '/dapr.proto.runtime.v1.Dapr/RaiseEventWorkflowBeta1',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.RaiseEventWorkflowRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_dapr_proto_runtime_v1_RaiseEventWorkflowRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_RaiseEventWorkflowRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  // Shutdown the sidecar
shutdown: {
    path: '/dapr.proto.runtime.v1.Dapr/Shutdown',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.ShutdownRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_dapr_proto_runtime_v1_ShutdownRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_ShutdownRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  // Create and schedule a job
scheduleJobAlpha1: {
    path: '/dapr.proto.runtime.v1.Dapr/ScheduleJobAlpha1',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.ScheduleJobRequest,
    responseType: dapr_proto_runtime_v1_dapr_pb.ScheduleJobResponse,
    requestSerialize: serialize_dapr_proto_runtime_v1_ScheduleJobRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_ScheduleJobRequest,
    responseSerialize: serialize_dapr_proto_runtime_v1_ScheduleJobResponse,
    responseDeserialize: deserialize_dapr_proto_runtime_v1_ScheduleJobResponse,
  },
  // Gets a scheduled job
getJobAlpha1: {
    path: '/dapr.proto.runtime.v1.Dapr/GetJobAlpha1',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.GetJobRequest,
    responseType: dapr_proto_runtime_v1_dapr_pb.GetJobResponse,
    requestSerialize: serialize_dapr_proto_runtime_v1_GetJobRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_GetJobRequest,
    responseSerialize: serialize_dapr_proto_runtime_v1_GetJobResponse,
    responseDeserialize: deserialize_dapr_proto_runtime_v1_GetJobResponse,
  },
  // Delete a job
deleteJobAlpha1: {
    path: '/dapr.proto.runtime.v1.Dapr/DeleteJobAlpha1',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_dapr_pb.DeleteJobRequest,
    responseType: dapr_proto_runtime_v1_dapr_pb.DeleteJobResponse,
    requestSerialize: serialize_dapr_proto_runtime_v1_DeleteJobRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_DeleteJobRequest,
    responseSerialize: serialize_dapr_proto_runtime_v1_DeleteJobResponse,
    responseDeserialize: deserialize_dapr_proto_runtime_v1_DeleteJobResponse,
  },
};

exports.DaprClient = grpc.makeGenericClientConstructor(DaprService);
