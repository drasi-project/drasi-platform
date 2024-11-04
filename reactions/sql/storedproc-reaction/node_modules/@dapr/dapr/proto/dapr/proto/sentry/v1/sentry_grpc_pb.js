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
var dapr_proto_sentry_v1_sentry_pb = require('../../../../dapr/proto/sentry/v1/sentry_pb.js');
var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js');

function serialize_dapr_proto_sentry_v1_SignCertificateRequest(arg) {
  if (!(arg instanceof dapr_proto_sentry_v1_sentry_pb.SignCertificateRequest)) {
    throw new Error('Expected argument of type dapr.proto.sentry.v1.SignCertificateRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_sentry_v1_SignCertificateRequest(buffer_arg) {
  return dapr_proto_sentry_v1_sentry_pb.SignCertificateRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_dapr_proto_sentry_v1_SignCertificateResponse(arg) {
  if (!(arg instanceof dapr_proto_sentry_v1_sentry_pb.SignCertificateResponse)) {
    throw new Error('Expected argument of type dapr.proto.sentry.v1.SignCertificateResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_dapr_proto_sentry_v1_SignCertificateResponse(buffer_arg) {
  return dapr_proto_sentry_v1_sentry_pb.SignCertificateResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var CAService = exports.CAService = {
  // A request for a time-bound certificate to be signed.
//
// The requesting side must provide an id for both loosely based
// And strong based identities.
signCertificate: {
    path: '/dapr.proto.sentry.v1.CA/SignCertificate',
    requestStream: false,
    responseStream: false,
    requestType: dapr_proto_sentry_v1_sentry_pb.SignCertificateRequest,
    responseType: dapr_proto_sentry_v1_sentry_pb.SignCertificateResponse,
    requestSerialize: serialize_dapr_proto_sentry_v1_SignCertificateRequest,
    requestDeserialize: deserialize_dapr_proto_sentry_v1_SignCertificateRequest,
    responseSerialize: serialize_dapr_proto_sentry_v1_SignCertificateResponse,
    responseDeserialize: deserialize_dapr_proto_sentry_v1_SignCertificateResponse,
  },
};

exports.CAClient = grpc.makeGenericClientConstructor(CAService);
