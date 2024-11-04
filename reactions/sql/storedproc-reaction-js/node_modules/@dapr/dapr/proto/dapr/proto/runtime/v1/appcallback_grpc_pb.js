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
var dapr_proto_runtime_v1_appcallback_pb = require('../../../../dapr/proto/runtime/v1/appcallback_pb.js');
var google_protobuf_any_pb = require('google-protobuf/google/protobuf/any_pb.js');
var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js');
var dapr_proto_common_v1_common_pb = require('../../../../dapr/proto/common/v1/common_pb.js');
var google_protobuf_struct_pb = require('google-protobuf/google/protobuf/struct_pb.js');

function serialize_dapr_proto_common_v1_InvokeRequest(arg) {
  if (!(arg instanceof dapr_proto_common_v1_common_pb.InvokeRequest)) {
    throw new Error('Expected argument of type dapr.proto.common.v1.InvokeRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_common_v1_InvokeRequest(buffer_arg) {
  return dapr_proto_common_v1_common_pb.InvokeRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_common_v1_InvokeResponse(arg) {
  if (!(arg instanceof dapr_proto_common_v1_common_pb.InvokeResponse)) {
    throw new Error('Expected argument of type dapr.proto.common.v1.InvokeResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_common_v1_InvokeResponse(buffer_arg) {
  return dapr_proto_common_v1_common_pb.InvokeResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_BindingEventRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_appcallback_pb.BindingEventRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.BindingEventRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_BindingEventRequest(buffer_arg) {
  return dapr_proto_runtime_v1_appcallback_pb.BindingEventRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_BindingEventResponse(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_appcallback_pb.BindingEventResponse)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.BindingEventResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_BindingEventResponse(buffer_arg) {
  return dapr_proto_runtime_v1_appcallback_pb.BindingEventResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_HealthCheckResponse(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_appcallback_pb.HealthCheckResponse)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.HealthCheckResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_HealthCheckResponse(buffer_arg) {
  return dapr_proto_runtime_v1_appcallback_pb.HealthCheckResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_JobEventRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_appcallback_pb.JobEventRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.JobEventRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_JobEventRequest(buffer_arg) {
  return dapr_proto_runtime_v1_appcallback_pb.JobEventRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_JobEventResponse(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_appcallback_pb.JobEventResponse)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.JobEventResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_JobEventResponse(buffer_arg) {
  return dapr_proto_runtime_v1_appcallback_pb.JobEventResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_ListInputBindingsResponse(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_appcallback_pb.ListInputBindingsResponse)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.ListInputBindingsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_ListInputBindingsResponse(buffer_arg) {
  return dapr_proto_runtime_v1_appcallback_pb.ListInputBindingsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_ListTopicSubscriptionsResponse(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_appcallback_pb.ListTopicSubscriptionsResponse)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.ListTopicSubscriptionsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_ListTopicSubscriptionsResponse(buffer_arg) {
  return dapr_proto_runtime_v1_appcallback_pb.ListTopicSubscriptionsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_TopicEventBulkRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_appcallback_pb.TopicEventBulkRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.TopicEventBulkRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_TopicEventBulkRequest(buffer_arg) {
  return dapr_proto_runtime_v1_appcallback_pb.TopicEventBulkRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_TopicEventBulkResponse(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_appcallback_pb.TopicEventBulkResponse)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.TopicEventBulkResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_TopicEventBulkResponse(buffer_arg) {
  return dapr_proto_runtime_v1_appcallback_pb.TopicEventBulkResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_TopicEventRequest(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_appcallback_pb.TopicEventRequest)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.TopicEventRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_TopicEventRequest(buffer_arg) {
  return dapr_proto_runtime_v1_appcallback_pb.TopicEventRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_runtime_v1_TopicEventResponse(arg) {
  if (!(arg instanceof dapr_proto_runtime_v1_appcallback_pb.TopicEventResponse)) {
    throw new Error('Expected argument of type dapr.proto.runtime.v1.TopicEventResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_runtime_v1_TopicEventResponse(buffer_arg) {
  return dapr_proto_runtime_v1_appcallback_pb.TopicEventResponse.deserializeBinary(new Uint8Array(buffer_arg));
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


// AppCallback V1 allows user application to interact with Dapr runtime.
// User application needs to implement AppCallback service if it needs to
// receive message from dapr runtime.
var AppCallbackService = exports.AppCallbackService = {
  // Invokes service method with InvokeRequest.
onInvoke: {
    path: '/dapr.proto.runtime.v1.AppCallback/OnInvoke',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_common_v1_common_pb.InvokeRequest,
    responseType: dapr_proto_common_v1_common_pb.InvokeResponse,
    requestSerialize: serialize_dapr_proto_common_v1_InvokeRequest,
    requestDeserialize: deserialize_dapr_proto_common_v1_InvokeRequest,
    responseSerialize: serialize_dapr_proto_common_v1_InvokeResponse,
    responseDeserialize: deserialize_dapr_proto_common_v1_InvokeResponse,
  },
  // Lists all topics subscribed by this app.
listTopicSubscriptions: {
    path: '/dapr.proto.runtime.v1.AppCallback/ListTopicSubscriptions',
    requestStream: false,
    responseStream: false,
    requestType: google_protobuf_empty_pb.Empty,
    responseType: dapr_proto_runtime_v1_appcallback_pb.ListTopicSubscriptionsResponse,
    requestSerialize: serialize_google_protobuf_Empty,
    requestDeserialize: deserialize_google_protobuf_Empty,
    responseSerialize: serialize_dapr_proto_runtime_v1_ListTopicSubscriptionsResponse,
    responseDeserialize: deserialize_dapr_proto_runtime_v1_ListTopicSubscriptionsResponse,
  },
  // Subscribes events from Pubsub
onTopicEvent: {
    path: '/dapr.proto.runtime.v1.AppCallback/OnTopicEvent',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_appcallback_pb.TopicEventRequest,
    responseType: dapr_proto_runtime_v1_appcallback_pb.TopicEventResponse,
    requestSerialize: serialize_dapr_proto_runtime_v1_TopicEventRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_TopicEventRequest,
    responseSerialize: serialize_dapr_proto_runtime_v1_TopicEventResponse,
    responseDeserialize: deserialize_dapr_proto_runtime_v1_TopicEventResponse,
  },
  // Lists all input bindings subscribed by this app.
listInputBindings: {
    path: '/dapr.proto.runtime.v1.AppCallback/ListInputBindings',
    requestStream: false,
    responseStream: false,
    requestType: google_protobuf_empty_pb.Empty,
    responseType: dapr_proto_runtime_v1_appcallback_pb.ListInputBindingsResponse,
    requestSerialize: serialize_google_protobuf_Empty,
    requestDeserialize: deserialize_google_protobuf_Empty,
    responseSerialize: serialize_dapr_proto_runtime_v1_ListInputBindingsResponse,
    responseDeserialize: deserialize_dapr_proto_runtime_v1_ListInputBindingsResponse,
  },
  // Listens events from the input bindings
//
// User application can save the states or send the events to the output
// bindings optionally by returning BindingEventResponse.
onBindingEvent: {
    path: '/dapr.proto.runtime.v1.AppCallback/OnBindingEvent',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_appcallback_pb.BindingEventRequest,
    responseType: dapr_proto_runtime_v1_appcallback_pb.BindingEventResponse,
    requestSerialize: serialize_dapr_proto_runtime_v1_BindingEventRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_BindingEventRequest,
    responseSerialize: serialize_dapr_proto_runtime_v1_BindingEventResponse,
    responseDeserialize: deserialize_dapr_proto_runtime_v1_BindingEventResponse,
  },
};

exports.AppCallbackClient = grpc.makeGenericClientConstructor(AppCallbackService);
// AppCallbackHealthCheck V1 is an optional extension to AppCallback V1 to implement
// the HealthCheck method.
var AppCallbackHealthCheckService = exports.AppCallbackHealthCheckService = {
  // Health check.
healthCheck: {
    path: '/dapr.proto.runtime.v1.AppCallbackHealthCheck/HealthCheck',
    requestStream: false,
    responseStream: false,
    requestType: google_protobuf_empty_pb.Empty,
    responseType: dapr_proto_runtime_v1_appcallback_pb.HealthCheckResponse,
    requestSerialize: serialize_google_protobuf_Empty,
    requestDeserialize: deserialize_google_protobuf_Empty,
    responseSerialize: serialize_dapr_proto_runtime_v1_HealthCheckResponse,
    responseDeserialize: deserialize_dapr_proto_runtime_v1_HealthCheckResponse,
  },
};

exports.AppCallbackHealthCheckClient = grpc.makeGenericClientConstructor(AppCallbackHealthCheckService);
// AppCallbackAlpha V1 is an optional extension to AppCallback V1 to opt
// for Alpha RPCs.
var AppCallbackAlphaService = exports.AppCallbackAlphaService = {
  // Subscribes bulk events from Pubsub
onBulkTopicEventAlpha1: {
    path: '/dapr.proto.runtime.v1.AppCallbackAlpha/OnBulkTopicEventAlpha1',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_appcallback_pb.TopicEventBulkRequest,
    responseType: dapr_proto_runtime_v1_appcallback_pb.TopicEventBulkResponse,
    requestSerialize: serialize_dapr_proto_runtime_v1_TopicEventBulkRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_TopicEventBulkRequest,
    responseSerialize: serialize_dapr_proto_runtime_v1_TopicEventBulkResponse,
    responseDeserialize: deserialize_dapr_proto_runtime_v1_TopicEventBulkResponse,
  },
  // Sends job back to the app's endpoint at trigger time.
onJobEventAlpha1: {
    path: '/dapr.proto.runtime.v1.AppCallbackAlpha/OnJobEventAlpha1',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_runtime_v1_appcallback_pb.JobEventRequest,
    responseType: dapr_proto_runtime_v1_appcallback_pb.JobEventResponse,
    requestSerialize: serialize_dapr_proto_runtime_v1_JobEventRequest,
    requestDeserialize: deserialize_dapr_proto_runtime_v1_JobEventRequest,
    responseSerialize: serialize_dapr_proto_runtime_v1_JobEventResponse,
    responseDeserialize: deserialize_dapr_proto_runtime_v1_JobEventResponse,
  },
};

exports.AppCallbackAlphaClient = grpc.makeGenericClientConstructor(AppCallbackAlphaService);
