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
var dapr_proto_operator_v1_operator_pb = require('../../../../dapr/proto/operator/v1/operator_pb.js');
var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js');

function serialize_dapr_proto_operator_v1_ComponentUpdateEvent(arg) {
  if (!(arg instanceof dapr_proto_operator_v1_operator_pb.ComponentUpdateEvent)) {
    throw new Error('Expected argument of type dapr.proto.operator.v1.ComponentUpdateEvent');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_operator_v1_ComponentUpdateEvent(buffer_arg) {
  return dapr_proto_operator_v1_operator_pb.ComponentUpdateEvent.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_operator_v1_ComponentUpdateRequest(arg) {
  if (!(arg instanceof dapr_proto_operator_v1_operator_pb.ComponentUpdateRequest)) {
    throw new Error('Expected argument of type dapr.proto.operator.v1.ComponentUpdateRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_operator_v1_ComponentUpdateRequest(buffer_arg) {
  return dapr_proto_operator_v1_operator_pb.ComponentUpdateRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_operator_v1_GetConfigurationRequest(arg) {
  if (!(arg instanceof dapr_proto_operator_v1_operator_pb.GetConfigurationRequest)) {
    throw new Error('Expected argument of type dapr.proto.operator.v1.GetConfigurationRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_operator_v1_GetConfigurationRequest(buffer_arg) {
  return dapr_proto_operator_v1_operator_pb.GetConfigurationRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_operator_v1_GetConfigurationResponse(arg) {
  if (!(arg instanceof dapr_proto_operator_v1_operator_pb.GetConfigurationResponse)) {
    throw new Error('Expected argument of type dapr.proto.operator.v1.GetConfigurationResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_operator_v1_GetConfigurationResponse(buffer_arg) {
  return dapr_proto_operator_v1_operator_pb.GetConfigurationResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_operator_v1_GetResiliencyRequest(arg) {
  if (!(arg instanceof dapr_proto_operator_v1_operator_pb.GetResiliencyRequest)) {
    throw new Error('Expected argument of type dapr.proto.operator.v1.GetResiliencyRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_operator_v1_GetResiliencyRequest(buffer_arg) {
  return dapr_proto_operator_v1_operator_pb.GetResiliencyRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_operator_v1_GetResiliencyResponse(arg) {
  if (!(arg instanceof dapr_proto_operator_v1_operator_pb.GetResiliencyResponse)) {
    throw new Error('Expected argument of type dapr.proto.operator.v1.GetResiliencyResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_operator_v1_GetResiliencyResponse(buffer_arg) {
  return dapr_proto_operator_v1_operator_pb.GetResiliencyResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_operator_v1_HTTPEndpointUpdateEvent(arg) {
  if (!(arg instanceof dapr_proto_operator_v1_operator_pb.HTTPEndpointUpdateEvent)) {
    throw new Error('Expected argument of type dapr.proto.operator.v1.HTTPEndpointUpdateEvent');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_operator_v1_HTTPEndpointUpdateEvent(buffer_arg) {
  return dapr_proto_operator_v1_operator_pb.HTTPEndpointUpdateEvent.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_operator_v1_HTTPEndpointUpdateRequest(arg) {
  if (!(arg instanceof dapr_proto_operator_v1_operator_pb.HTTPEndpointUpdateRequest)) {
    throw new Error('Expected argument of type dapr.proto.operator.v1.HTTPEndpointUpdateRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_operator_v1_HTTPEndpointUpdateRequest(buffer_arg) {
  return dapr_proto_operator_v1_operator_pb.HTTPEndpointUpdateRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_operator_v1_ListComponentResponse(arg) {
  if (!(arg instanceof dapr_proto_operator_v1_operator_pb.ListComponentResponse)) {
    throw new Error('Expected argument of type dapr.proto.operator.v1.ListComponentResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_operator_v1_ListComponentResponse(buffer_arg) {
  return dapr_proto_operator_v1_operator_pb.ListComponentResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_operator_v1_ListComponentsRequest(arg) {
  if (!(arg instanceof dapr_proto_operator_v1_operator_pb.ListComponentsRequest)) {
    throw new Error('Expected argument of type dapr.proto.operator.v1.ListComponentsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_operator_v1_ListComponentsRequest(buffer_arg) {
  return dapr_proto_operator_v1_operator_pb.ListComponentsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_operator_v1_ListHTTPEndpointsRequest(arg) {
  if (!(arg instanceof dapr_proto_operator_v1_operator_pb.ListHTTPEndpointsRequest)) {
    throw new Error('Expected argument of type dapr.proto.operator.v1.ListHTTPEndpointsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_operator_v1_ListHTTPEndpointsRequest(buffer_arg) {
  return dapr_proto_operator_v1_operator_pb.ListHTTPEndpointsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_operator_v1_ListHTTPEndpointsResponse(arg) {
  if (!(arg instanceof dapr_proto_operator_v1_operator_pb.ListHTTPEndpointsResponse)) {
    throw new Error('Expected argument of type dapr.proto.operator.v1.ListHTTPEndpointsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_operator_v1_ListHTTPEndpointsResponse(buffer_arg) {
  return dapr_proto_operator_v1_operator_pb.ListHTTPEndpointsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_operator_v1_ListResiliencyRequest(arg) {
  if (!(arg instanceof dapr_proto_operator_v1_operator_pb.ListResiliencyRequest)) {
    throw new Error('Expected argument of type dapr.proto.operator.v1.ListResiliencyRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_operator_v1_ListResiliencyRequest(buffer_arg) {
  return dapr_proto_operator_v1_operator_pb.ListResiliencyRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_operator_v1_ListResiliencyResponse(arg) {
  if (!(arg instanceof dapr_proto_operator_v1_operator_pb.ListResiliencyResponse)) {
    throw new Error('Expected argument of type dapr.proto.operator.v1.ListResiliencyResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_operator_v1_ListResiliencyResponse(buffer_arg) {
  return dapr_proto_operator_v1_operator_pb.ListResiliencyResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_operator_v1_ListSubscriptionsRequest(arg) {
  if (!(arg instanceof dapr_proto_operator_v1_operator_pb.ListSubscriptionsRequest)) {
    throw new Error('Expected argument of type dapr.proto.operator.v1.ListSubscriptionsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_operator_v1_ListSubscriptionsRequest(buffer_arg) {
  return dapr_proto_operator_v1_operator_pb.ListSubscriptionsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_operator_v1_ListSubscriptionsResponse(arg) {
  if (!(arg instanceof dapr_proto_operator_v1_operator_pb.ListSubscriptionsResponse)) {
    throw new Error('Expected argument of type dapr.proto.operator.v1.ListSubscriptionsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_operator_v1_ListSubscriptionsResponse(buffer_arg) {
  return dapr_proto_operator_v1_operator_pb.ListSubscriptionsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_operator_v1_SubscriptionUpdateEvent(arg) {
  if (!(arg instanceof dapr_proto_operator_v1_operator_pb.SubscriptionUpdateEvent)) {
    throw new Error('Expected argument of type dapr.proto.operator.v1.SubscriptionUpdateEvent');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_operator_v1_SubscriptionUpdateEvent(buffer_arg) {
  return dapr_proto_operator_v1_operator_pb.SubscriptionUpdateEvent.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_operator_v1_SubscriptionUpdateRequest(arg) {
  if (!(arg instanceof dapr_proto_operator_v1_operator_pb.SubscriptionUpdateRequest)) {
    throw new Error('Expected argument of type dapr.proto.operator.v1.SubscriptionUpdateRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_operator_v1_SubscriptionUpdateRequest(buffer_arg) {
  return dapr_proto_operator_v1_operator_pb.SubscriptionUpdateRequest.deserializeBinary(new Uint8Array(buffer_arg));
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


var OperatorService = exports.OperatorService = {
  // Sends events to Dapr sidecars upon component changes.
componentUpdate: {
    path: '/dapr.proto.operator.v1.Operator/ComponentUpdate',
    requestStream: false,
    responseStream: true,
    requestType: dapr_proto_operator_v1_operator_pb.ComponentUpdateRequest,
    responseType: dapr_proto_operator_v1_operator_pb.ComponentUpdateEvent,
    requestSerialize: serialize_dapr_proto_operator_v1_ComponentUpdateRequest,
    requestDeserialize: deserialize_dapr_proto_operator_v1_ComponentUpdateRequest,
    responseSerialize: serialize_dapr_proto_operator_v1_ComponentUpdateEvent,
    responseDeserialize: deserialize_dapr_proto_operator_v1_ComponentUpdateEvent,
  },
  // Returns a list of available components
listComponents: {
    path: '/dapr.proto.operator.v1.Operator/ListComponents',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_operator_v1_operator_pb.ListComponentsRequest,
    responseType: dapr_proto_operator_v1_operator_pb.ListComponentResponse,
    requestSerialize: serialize_dapr_proto_operator_v1_ListComponentsRequest,
    requestDeserialize: deserialize_dapr_proto_operator_v1_ListComponentsRequest,
    responseSerialize: serialize_dapr_proto_operator_v1_ListComponentResponse,
    responseDeserialize: deserialize_dapr_proto_operator_v1_ListComponentResponse,
  },
  // Returns a given configuration by name
getConfiguration: {
    path: '/dapr.proto.operator.v1.Operator/GetConfiguration',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_operator_v1_operator_pb.GetConfigurationRequest,
    responseType: dapr_proto_operator_v1_operator_pb.GetConfigurationResponse,
    requestSerialize: serialize_dapr_proto_operator_v1_GetConfigurationRequest,
    requestDeserialize: deserialize_dapr_proto_operator_v1_GetConfigurationRequest,
    responseSerialize: serialize_dapr_proto_operator_v1_GetConfigurationResponse,
    responseDeserialize: deserialize_dapr_proto_operator_v1_GetConfigurationResponse,
  },
  // Returns a list of pub/sub subscriptions
listSubscriptions: {
    path: '/dapr.proto.operator.v1.Operator/ListSubscriptions',
    requestStream: false,
    responseStream: false,
    requestType: google_protobuf_empty_pb.Empty,
    responseType: dapr_proto_operator_v1_operator_pb.ListSubscriptionsResponse,
    requestSerialize: serialize_google_protobuf_Empty,
    requestDeserialize: deserialize_google_protobuf_Empty,
    responseSerialize: serialize_dapr_proto_operator_v1_ListSubscriptionsResponse,
    responseDeserialize: deserialize_dapr_proto_operator_v1_ListSubscriptionsResponse,
  },
  // Returns a given resiliency configuration by name
getResiliency: {
    path: '/dapr.proto.operator.v1.Operator/GetResiliency',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_operator_v1_operator_pb.GetResiliencyRequest,
    responseType: dapr_proto_operator_v1_operator_pb.GetResiliencyResponse,
    requestSerialize: serialize_dapr_proto_operator_v1_GetResiliencyRequest,
    requestDeserialize: deserialize_dapr_proto_operator_v1_GetResiliencyRequest,
    responseSerialize: serialize_dapr_proto_operator_v1_GetResiliencyResponse,
    responseDeserialize: deserialize_dapr_proto_operator_v1_GetResiliencyResponse,
  },
  // Returns a list of resiliency configurations
listResiliency: {
    path: '/dapr.proto.operator.v1.Operator/ListResiliency',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_operator_v1_operator_pb.ListResiliencyRequest,
    responseType: dapr_proto_operator_v1_operator_pb.ListResiliencyResponse,
    requestSerialize: serialize_dapr_proto_operator_v1_ListResiliencyRequest,
    requestDeserialize: deserialize_dapr_proto_operator_v1_ListResiliencyRequest,
    responseSerialize: serialize_dapr_proto_operator_v1_ListResiliencyResponse,
    responseDeserialize: deserialize_dapr_proto_operator_v1_ListResiliencyResponse,
  },
  // Returns a list of pub/sub subscriptions, ListSubscriptionsRequest to expose pod info
listSubscriptionsV2: {
    path: '/dapr.proto.operator.v1.Operator/ListSubscriptionsV2',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_operator_v1_operator_pb.ListSubscriptionsRequest,
    responseType: dapr_proto_operator_v1_operator_pb.ListSubscriptionsResponse,
    requestSerialize: serialize_dapr_proto_operator_v1_ListSubscriptionsRequest,
    requestDeserialize: deserialize_dapr_proto_operator_v1_ListSubscriptionsRequest,
    responseSerialize: serialize_dapr_proto_operator_v1_ListSubscriptionsResponse,
    responseDeserialize: deserialize_dapr_proto_operator_v1_ListSubscriptionsResponse,
  },
  // Sends events to Dapr sidecars upon subscription changes.
subscriptionUpdate: {
    path: '/dapr.proto.operator.v1.Operator/SubscriptionUpdate',
    requestStream: false,
    responseStream: true,
    requestType: dapr_proto_operator_v1_operator_pb.SubscriptionUpdateRequest,
    responseType: dapr_proto_operator_v1_operator_pb.SubscriptionUpdateEvent,
    requestSerialize: serialize_dapr_proto_operator_v1_SubscriptionUpdateRequest,
    requestDeserialize: deserialize_dapr_proto_operator_v1_SubscriptionUpdateRequest,
    responseSerialize: serialize_dapr_proto_operator_v1_SubscriptionUpdateEvent,
    responseDeserialize: deserialize_dapr_proto_operator_v1_SubscriptionUpdateEvent,
  },
  // Returns a list of http endpoints
listHTTPEndpoints: {
    path: '/dapr.proto.operator.v1.Operator/ListHTTPEndpoints',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_operator_v1_operator_pb.ListHTTPEndpointsRequest,
    responseType: dapr_proto_operator_v1_operator_pb.ListHTTPEndpointsResponse,
    requestSerialize: serialize_dapr_proto_operator_v1_ListHTTPEndpointsRequest,
    requestDeserialize: deserialize_dapr_proto_operator_v1_ListHTTPEndpointsRequest,
    responseSerialize: serialize_dapr_proto_operator_v1_ListHTTPEndpointsResponse,
    responseDeserialize: deserialize_dapr_proto_operator_v1_ListHTTPEndpointsResponse,
  },
  // Sends events to Dapr sidecars upon http endpoint changes.
hTTPEndpointUpdate: {
    path: '/dapr.proto.operator.v1.Operator/HTTPEndpointUpdate',
    requestStream: false,
    responseStream: true,
    requestType: dapr_proto_operator_v1_operator_pb.HTTPEndpointUpdateRequest,
    responseType: dapr_proto_operator_v1_operator_pb.HTTPEndpointUpdateEvent,
    requestSerialize: serialize_dapr_proto_operator_v1_HTTPEndpointUpdateRequest,
    requestDeserialize: deserialize_dapr_proto_operator_v1_HTTPEndpointUpdateRequest,
    responseSerialize: serialize_dapr_proto_operator_v1_HTTPEndpointUpdateEvent,
    responseDeserialize: deserialize_dapr_proto_operator_v1_HTTPEndpointUpdateEvent,
  },
};

exports.OperatorClient = grpc.makeGenericClientConstructor(OperatorService);
