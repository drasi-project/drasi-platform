// source: dapr/proto/runtime/v1/dapr.proto
/**
 * @fileoverview
 * @enhanceable
 * @suppress {missingRequire} reports error on implicit type usages.
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!
/* eslint-disable */
// @ts-nocheck

var jspb = require('google-protobuf');
var goog = jspb;
var global =
    (typeof globalThis !== 'undefined' && globalThis) ||
    (typeof window !== 'undefined' && window) ||
    (typeof global !== 'undefined' && global) ||
    (typeof self !== 'undefined' && self) ||
    (function () { return this; }).call(null) ||
    Function('return this')();

var google_protobuf_any_pb = require('google-protobuf/google/protobuf/any_pb.js');
goog.object.extend(proto, google_protobuf_any_pb);
var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js');
goog.object.extend(proto, google_protobuf_empty_pb);
var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js');
goog.object.extend(proto, google_protobuf_timestamp_pb);
var dapr_proto_common_v1_common_pb = require('../../../../dapr/proto/common/v1/common_pb.js');
goog.object.extend(proto, dapr_proto_common_v1_common_pb);
var dapr_proto_runtime_v1_appcallback_pb = require('../../../../dapr/proto/runtime/v1/appcallback_pb.js');
goog.object.extend(proto, dapr_proto_runtime_v1_appcallback_pb);
goog.exportSymbol('proto.dapr.proto.runtime.v1.ActiveActorsCount', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.ActorRuntime', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.ActorRuntime.ActorRuntimeStatus', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.AppConnectionHealthProperties', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.AppConnectionProperties', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.BulkPublishRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.BulkPublishRequestEntry', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.BulkPublishResponse', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.BulkPublishResponseFailedEntry', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.BulkStateItem', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.DecryptRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.DecryptRequestOptions', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.DecryptResponse', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.DeleteBulkStateRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.DeleteJobRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.DeleteJobResponse', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.DeleteStateRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.EncryptRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.EncryptRequestOptions', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.EncryptResponse', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.ExecuteActorStateTransactionRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.ExecuteStateTransactionRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.GetActorStateRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.GetActorStateResponse', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.GetBulkSecretRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.GetBulkSecretResponse', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.GetBulkStateRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.GetBulkStateResponse', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.GetConfigurationRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.GetConfigurationResponse', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.GetJobRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.GetJobResponse', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.GetMetadataRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.GetMetadataResponse', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.GetSecretRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.GetSecretResponse', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.GetStateRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.GetStateResponse', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.GetWorkflowRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.GetWorkflowResponse', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.InvokeActorRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.InvokeActorResponse', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.InvokeBindingRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.InvokeBindingResponse', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.InvokeServiceRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.Job', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.MetadataHTTPEndpoint', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.PauseWorkflowRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.PublishEventRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.PubsubSubscription', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.PubsubSubscriptionRule', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.PubsubSubscriptionRules', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.PubsubSubscriptionType', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.PurgeWorkflowRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.QueryStateItem', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.QueryStateRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.QueryStateResponse', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.RaiseEventWorkflowRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.RegisterActorReminderRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.RegisterActorTimerRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.RegisteredComponents', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.ResumeWorkflowRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.SaveStateRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.ScheduleJobRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.ScheduleJobResponse', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.SecretResponse', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.SetMetadataRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.ShutdownRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.StartWorkflowRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.StartWorkflowResponse', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.SubscribeConfigurationRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.SubscribeConfigurationResponse', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestAlpha1', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestAlpha1.SubscribeTopicEventsRequestTypeCase', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestInitialAlpha1', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestProcessedAlpha1', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseAlpha1', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseAlpha1.SubscribeTopicEventsResponseTypeCase', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseInitialAlpha1', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.SubtleDecryptRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.SubtleDecryptResponse', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.SubtleEncryptRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.SubtleEncryptResponse', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.SubtleGetKeyRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.SubtleGetKeyRequest.KeyFormat', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.SubtleGetKeyResponse', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.SubtleSignRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.SubtleSignResponse', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.SubtleUnwrapKeyResponse', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.SubtleVerifyRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.SubtleVerifyResponse', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.SubtleWrapKeyResponse', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.TerminateWorkflowRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.TransactionalActorStateOperation', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.TransactionalStateOperation', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.TryLockRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.TryLockResponse', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.UnlockRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.UnlockResponse', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.UnlockResponse.Status', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.UnregisterActorReminderRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.UnregisterActorTimerRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.UnsubscribeConfigurationRequest', null, global);
goog.exportSymbol('proto.dapr.proto.runtime.v1.UnsubscribeConfigurationResponse', null, global);
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.InvokeServiceRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.InvokeServiceRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.InvokeServiceRequest.displayName = 'proto.dapr.proto.runtime.v1.InvokeServiceRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.GetStateRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.GetStateRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.GetStateRequest.displayName = 'proto.dapr.proto.runtime.v1.GetStateRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.GetBulkStateRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.dapr.proto.runtime.v1.GetBulkStateRequest.repeatedFields_, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.GetBulkStateRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.GetBulkStateRequest.displayName = 'proto.dapr.proto.runtime.v1.GetBulkStateRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.GetBulkStateResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.dapr.proto.runtime.v1.GetBulkStateResponse.repeatedFields_, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.GetBulkStateResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.GetBulkStateResponse.displayName = 'proto.dapr.proto.runtime.v1.GetBulkStateResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.BulkStateItem = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.BulkStateItem, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.BulkStateItem.displayName = 'proto.dapr.proto.runtime.v1.BulkStateItem';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.GetStateResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.GetStateResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.GetStateResponse.displayName = 'proto.dapr.proto.runtime.v1.GetStateResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.DeleteStateRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.DeleteStateRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.DeleteStateRequest.displayName = 'proto.dapr.proto.runtime.v1.DeleteStateRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.DeleteBulkStateRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.dapr.proto.runtime.v1.DeleteBulkStateRequest.repeatedFields_, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.DeleteBulkStateRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.DeleteBulkStateRequest.displayName = 'proto.dapr.proto.runtime.v1.DeleteBulkStateRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.SaveStateRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.dapr.proto.runtime.v1.SaveStateRequest.repeatedFields_, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.SaveStateRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.SaveStateRequest.displayName = 'proto.dapr.proto.runtime.v1.SaveStateRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.QueryStateRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.QueryStateRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.QueryStateRequest.displayName = 'proto.dapr.proto.runtime.v1.QueryStateRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.QueryStateItem = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.QueryStateItem, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.QueryStateItem.displayName = 'proto.dapr.proto.runtime.v1.QueryStateItem';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.QueryStateResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.dapr.proto.runtime.v1.QueryStateResponse.repeatedFields_, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.QueryStateResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.QueryStateResponse.displayName = 'proto.dapr.proto.runtime.v1.QueryStateResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.PublishEventRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.PublishEventRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.PublishEventRequest.displayName = 'proto.dapr.proto.runtime.v1.PublishEventRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.BulkPublishRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.dapr.proto.runtime.v1.BulkPublishRequest.repeatedFields_, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.BulkPublishRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.BulkPublishRequest.displayName = 'proto.dapr.proto.runtime.v1.BulkPublishRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.BulkPublishRequestEntry = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.BulkPublishRequestEntry, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.BulkPublishRequestEntry.displayName = 'proto.dapr.proto.runtime.v1.BulkPublishRequestEntry';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.BulkPublishResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.dapr.proto.runtime.v1.BulkPublishResponse.repeatedFields_, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.BulkPublishResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.BulkPublishResponse.displayName = 'proto.dapr.proto.runtime.v1.BulkPublishResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.BulkPublishResponseFailedEntry = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.BulkPublishResponseFailedEntry, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.BulkPublishResponseFailedEntry.displayName = 'proto.dapr.proto.runtime.v1.BulkPublishResponseFailedEntry';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestAlpha1 = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestAlpha1.oneofGroups_);
};
goog.inherits(proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestAlpha1, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestAlpha1.displayName = 'proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestAlpha1';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestInitialAlpha1 = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestInitialAlpha1, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestInitialAlpha1.displayName = 'proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestInitialAlpha1';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestProcessedAlpha1 = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestProcessedAlpha1, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestProcessedAlpha1.displayName = 'proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestProcessedAlpha1';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseAlpha1 = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseAlpha1.oneofGroups_);
};
goog.inherits(proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseAlpha1, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseAlpha1.displayName = 'proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseAlpha1';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseInitialAlpha1 = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseInitialAlpha1, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseInitialAlpha1.displayName = 'proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseInitialAlpha1';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.InvokeBindingRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.InvokeBindingRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.InvokeBindingRequest.displayName = 'proto.dapr.proto.runtime.v1.InvokeBindingRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.InvokeBindingResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.InvokeBindingResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.InvokeBindingResponse.displayName = 'proto.dapr.proto.runtime.v1.InvokeBindingResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.GetSecretRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.GetSecretRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.GetSecretRequest.displayName = 'proto.dapr.proto.runtime.v1.GetSecretRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.GetSecretResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.GetSecretResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.GetSecretResponse.displayName = 'proto.dapr.proto.runtime.v1.GetSecretResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.GetBulkSecretRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.GetBulkSecretRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.GetBulkSecretRequest.displayName = 'proto.dapr.proto.runtime.v1.GetBulkSecretRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.SecretResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.SecretResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.SecretResponse.displayName = 'proto.dapr.proto.runtime.v1.SecretResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.GetBulkSecretResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.GetBulkSecretResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.GetBulkSecretResponse.displayName = 'proto.dapr.proto.runtime.v1.GetBulkSecretResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.TransactionalStateOperation = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.TransactionalStateOperation, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.TransactionalStateOperation.displayName = 'proto.dapr.proto.runtime.v1.TransactionalStateOperation';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.ExecuteStateTransactionRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.dapr.proto.runtime.v1.ExecuteStateTransactionRequest.repeatedFields_, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.ExecuteStateTransactionRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.ExecuteStateTransactionRequest.displayName = 'proto.dapr.proto.runtime.v1.ExecuteStateTransactionRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.RegisterActorTimerRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.RegisterActorTimerRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.RegisterActorTimerRequest.displayName = 'proto.dapr.proto.runtime.v1.RegisterActorTimerRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.UnregisterActorTimerRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.UnregisterActorTimerRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.UnregisterActorTimerRequest.displayName = 'proto.dapr.proto.runtime.v1.UnregisterActorTimerRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.RegisterActorReminderRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.RegisterActorReminderRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.RegisterActorReminderRequest.displayName = 'proto.dapr.proto.runtime.v1.RegisterActorReminderRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.UnregisterActorReminderRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.UnregisterActorReminderRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.UnregisterActorReminderRequest.displayName = 'proto.dapr.proto.runtime.v1.UnregisterActorReminderRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.GetActorStateRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.GetActorStateRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.GetActorStateRequest.displayName = 'proto.dapr.proto.runtime.v1.GetActorStateRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.GetActorStateResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.GetActorStateResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.GetActorStateResponse.displayName = 'proto.dapr.proto.runtime.v1.GetActorStateResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.ExecuteActorStateTransactionRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.dapr.proto.runtime.v1.ExecuteActorStateTransactionRequest.repeatedFields_, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.ExecuteActorStateTransactionRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.ExecuteActorStateTransactionRequest.displayName = 'proto.dapr.proto.runtime.v1.ExecuteActorStateTransactionRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.TransactionalActorStateOperation = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.TransactionalActorStateOperation, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.TransactionalActorStateOperation.displayName = 'proto.dapr.proto.runtime.v1.TransactionalActorStateOperation';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.InvokeActorRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.InvokeActorRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.InvokeActorRequest.displayName = 'proto.dapr.proto.runtime.v1.InvokeActorRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.InvokeActorResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.InvokeActorResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.InvokeActorResponse.displayName = 'proto.dapr.proto.runtime.v1.InvokeActorResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.GetMetadataRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.GetMetadataRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.GetMetadataRequest.displayName = 'proto.dapr.proto.runtime.v1.GetMetadataRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.GetMetadataResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.dapr.proto.runtime.v1.GetMetadataResponse.repeatedFields_, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.GetMetadataResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.GetMetadataResponse.displayName = 'proto.dapr.proto.runtime.v1.GetMetadataResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.ActorRuntime = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.dapr.proto.runtime.v1.ActorRuntime.repeatedFields_, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.ActorRuntime, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.ActorRuntime.displayName = 'proto.dapr.proto.runtime.v1.ActorRuntime';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.ActiveActorsCount = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.ActiveActorsCount, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.ActiveActorsCount.displayName = 'proto.dapr.proto.runtime.v1.ActiveActorsCount';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.RegisteredComponents = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.dapr.proto.runtime.v1.RegisteredComponents.repeatedFields_, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.RegisteredComponents, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.RegisteredComponents.displayName = 'proto.dapr.proto.runtime.v1.RegisteredComponents';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.MetadataHTTPEndpoint = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.MetadataHTTPEndpoint, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.MetadataHTTPEndpoint.displayName = 'proto.dapr.proto.runtime.v1.MetadataHTTPEndpoint';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.AppConnectionProperties = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.AppConnectionProperties, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.AppConnectionProperties.displayName = 'proto.dapr.proto.runtime.v1.AppConnectionProperties';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.AppConnectionHealthProperties = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.AppConnectionHealthProperties, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.AppConnectionHealthProperties.displayName = 'proto.dapr.proto.runtime.v1.AppConnectionHealthProperties';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.PubsubSubscription = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.PubsubSubscription, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.PubsubSubscription.displayName = 'proto.dapr.proto.runtime.v1.PubsubSubscription';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.PubsubSubscriptionRules = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.dapr.proto.runtime.v1.PubsubSubscriptionRules.repeatedFields_, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.PubsubSubscriptionRules, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.PubsubSubscriptionRules.displayName = 'proto.dapr.proto.runtime.v1.PubsubSubscriptionRules';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.PubsubSubscriptionRule = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.PubsubSubscriptionRule, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.PubsubSubscriptionRule.displayName = 'proto.dapr.proto.runtime.v1.PubsubSubscriptionRule';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.SetMetadataRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.SetMetadataRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.SetMetadataRequest.displayName = 'proto.dapr.proto.runtime.v1.SetMetadataRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.GetConfigurationRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.dapr.proto.runtime.v1.GetConfigurationRequest.repeatedFields_, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.GetConfigurationRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.GetConfigurationRequest.displayName = 'proto.dapr.proto.runtime.v1.GetConfigurationRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.GetConfigurationResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.GetConfigurationResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.GetConfigurationResponse.displayName = 'proto.dapr.proto.runtime.v1.GetConfigurationResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.SubscribeConfigurationRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.dapr.proto.runtime.v1.SubscribeConfigurationRequest.repeatedFields_, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.SubscribeConfigurationRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.SubscribeConfigurationRequest.displayName = 'proto.dapr.proto.runtime.v1.SubscribeConfigurationRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.UnsubscribeConfigurationRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.UnsubscribeConfigurationRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.UnsubscribeConfigurationRequest.displayName = 'proto.dapr.proto.runtime.v1.UnsubscribeConfigurationRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.SubscribeConfigurationResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.SubscribeConfigurationResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.SubscribeConfigurationResponse.displayName = 'proto.dapr.proto.runtime.v1.SubscribeConfigurationResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.UnsubscribeConfigurationResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.UnsubscribeConfigurationResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.UnsubscribeConfigurationResponse.displayName = 'proto.dapr.proto.runtime.v1.UnsubscribeConfigurationResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.TryLockRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.TryLockRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.TryLockRequest.displayName = 'proto.dapr.proto.runtime.v1.TryLockRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.TryLockResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.TryLockResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.TryLockResponse.displayName = 'proto.dapr.proto.runtime.v1.TryLockResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.UnlockRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.UnlockRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.UnlockRequest.displayName = 'proto.dapr.proto.runtime.v1.UnlockRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.UnlockResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.UnlockResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.UnlockResponse.displayName = 'proto.dapr.proto.runtime.v1.UnlockResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.SubtleGetKeyRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.SubtleGetKeyRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.SubtleGetKeyRequest.displayName = 'proto.dapr.proto.runtime.v1.SubtleGetKeyRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.SubtleGetKeyResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.SubtleGetKeyResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.SubtleGetKeyResponse.displayName = 'proto.dapr.proto.runtime.v1.SubtleGetKeyResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.SubtleEncryptRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.SubtleEncryptRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.SubtleEncryptRequest.displayName = 'proto.dapr.proto.runtime.v1.SubtleEncryptRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.SubtleEncryptResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.SubtleEncryptResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.SubtleEncryptResponse.displayName = 'proto.dapr.proto.runtime.v1.SubtleEncryptResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.SubtleDecryptRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.SubtleDecryptRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.SubtleDecryptRequest.displayName = 'proto.dapr.proto.runtime.v1.SubtleDecryptRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.SubtleDecryptResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.SubtleDecryptResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.SubtleDecryptResponse.displayName = 'proto.dapr.proto.runtime.v1.SubtleDecryptResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest.displayName = 'proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.SubtleWrapKeyResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.SubtleWrapKeyResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.SubtleWrapKeyResponse.displayName = 'proto.dapr.proto.runtime.v1.SubtleWrapKeyResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest.displayName = 'proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.SubtleUnwrapKeyResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.SubtleUnwrapKeyResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.SubtleUnwrapKeyResponse.displayName = 'proto.dapr.proto.runtime.v1.SubtleUnwrapKeyResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.SubtleSignRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.SubtleSignRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.SubtleSignRequest.displayName = 'proto.dapr.proto.runtime.v1.SubtleSignRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.SubtleSignResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.SubtleSignResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.SubtleSignResponse.displayName = 'proto.dapr.proto.runtime.v1.SubtleSignResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.SubtleVerifyRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.SubtleVerifyRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.SubtleVerifyRequest.displayName = 'proto.dapr.proto.runtime.v1.SubtleVerifyRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.SubtleVerifyResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.SubtleVerifyResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.SubtleVerifyResponse.displayName = 'proto.dapr.proto.runtime.v1.SubtleVerifyResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.EncryptRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.EncryptRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.EncryptRequest.displayName = 'proto.dapr.proto.runtime.v1.EncryptRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.EncryptRequestOptions = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.EncryptRequestOptions, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.EncryptRequestOptions.displayName = 'proto.dapr.proto.runtime.v1.EncryptRequestOptions';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.EncryptResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.EncryptResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.EncryptResponse.displayName = 'proto.dapr.proto.runtime.v1.EncryptResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.DecryptRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.DecryptRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.DecryptRequest.displayName = 'proto.dapr.proto.runtime.v1.DecryptRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.DecryptRequestOptions = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.DecryptRequestOptions, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.DecryptRequestOptions.displayName = 'proto.dapr.proto.runtime.v1.DecryptRequestOptions';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.DecryptResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.DecryptResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.DecryptResponse.displayName = 'proto.dapr.proto.runtime.v1.DecryptResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.GetWorkflowRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.GetWorkflowRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.GetWorkflowRequest.displayName = 'proto.dapr.proto.runtime.v1.GetWorkflowRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.GetWorkflowResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.GetWorkflowResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.GetWorkflowResponse.displayName = 'proto.dapr.proto.runtime.v1.GetWorkflowResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.StartWorkflowRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.StartWorkflowRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.StartWorkflowRequest.displayName = 'proto.dapr.proto.runtime.v1.StartWorkflowRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.StartWorkflowResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.StartWorkflowResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.StartWorkflowResponse.displayName = 'proto.dapr.proto.runtime.v1.StartWorkflowResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.TerminateWorkflowRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.TerminateWorkflowRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.TerminateWorkflowRequest.displayName = 'proto.dapr.proto.runtime.v1.TerminateWorkflowRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.PauseWorkflowRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.PauseWorkflowRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.PauseWorkflowRequest.displayName = 'proto.dapr.proto.runtime.v1.PauseWorkflowRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.ResumeWorkflowRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.ResumeWorkflowRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.ResumeWorkflowRequest.displayName = 'proto.dapr.proto.runtime.v1.ResumeWorkflowRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.RaiseEventWorkflowRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.RaiseEventWorkflowRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.RaiseEventWorkflowRequest.displayName = 'proto.dapr.proto.runtime.v1.RaiseEventWorkflowRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.PurgeWorkflowRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.PurgeWorkflowRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.PurgeWorkflowRequest.displayName = 'proto.dapr.proto.runtime.v1.PurgeWorkflowRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.ShutdownRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.ShutdownRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.ShutdownRequest.displayName = 'proto.dapr.proto.runtime.v1.ShutdownRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.Job = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.Job, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.Job.displayName = 'proto.dapr.proto.runtime.v1.Job';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.ScheduleJobRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.ScheduleJobRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.ScheduleJobRequest.displayName = 'proto.dapr.proto.runtime.v1.ScheduleJobRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.ScheduleJobResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.ScheduleJobResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.ScheduleJobResponse.displayName = 'proto.dapr.proto.runtime.v1.ScheduleJobResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.GetJobRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.GetJobRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.GetJobRequest.displayName = 'proto.dapr.proto.runtime.v1.GetJobRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.GetJobResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.GetJobResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.GetJobResponse.displayName = 'proto.dapr.proto.runtime.v1.GetJobResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.DeleteJobRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.DeleteJobRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.DeleteJobRequest.displayName = 'proto.dapr.proto.runtime.v1.DeleteJobRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.dapr.proto.runtime.v1.DeleteJobResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.dapr.proto.runtime.v1.DeleteJobResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.dapr.proto.runtime.v1.DeleteJobResponse.displayName = 'proto.dapr.proto.runtime.v1.DeleteJobResponse';
}



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.InvokeServiceRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.InvokeServiceRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.InvokeServiceRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.InvokeServiceRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, ""),
    message: (f = msg.getMessage()) && dapr_proto_common_v1_common_pb.InvokeRequest.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.InvokeServiceRequest}
 */
proto.dapr.proto.runtime.v1.InvokeServiceRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.InvokeServiceRequest;
  return proto.dapr.proto.runtime.v1.InvokeServiceRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.InvokeServiceRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.InvokeServiceRequest}
 */
proto.dapr.proto.runtime.v1.InvokeServiceRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    case 3:
      var value = new dapr_proto_common_v1_common_pb.InvokeRequest;
      reader.readMessage(value,dapr_proto_common_v1_common_pb.InvokeRequest.deserializeBinaryFromReader);
      msg.setMessage(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.InvokeServiceRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.InvokeServiceRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.InvokeServiceRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.InvokeServiceRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getMessage();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      dapr_proto_common_v1_common_pb.InvokeRequest.serializeBinaryToWriter
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.InvokeServiceRequest.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.InvokeServiceRequest} returns this
 */
proto.dapr.proto.runtime.v1.InvokeServiceRequest.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional dapr.proto.common.v1.InvokeRequest message = 3;
 * @return {?proto.dapr.proto.common.v1.InvokeRequest}
 */
proto.dapr.proto.runtime.v1.InvokeServiceRequest.prototype.getMessage = function() {
  return /** @type{?proto.dapr.proto.common.v1.InvokeRequest} */ (
    jspb.Message.getWrapperField(this, dapr_proto_common_v1_common_pb.InvokeRequest, 3));
};


/**
 * @param {?proto.dapr.proto.common.v1.InvokeRequest|undefined} value
 * @return {!proto.dapr.proto.runtime.v1.InvokeServiceRequest} returns this
*/
proto.dapr.proto.runtime.v1.InvokeServiceRequest.prototype.setMessage = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.dapr.proto.runtime.v1.InvokeServiceRequest} returns this
 */
proto.dapr.proto.runtime.v1.InvokeServiceRequest.prototype.clearMessage = function() {
  return this.setMessage(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.dapr.proto.runtime.v1.InvokeServiceRequest.prototype.hasMessage = function() {
  return jspb.Message.getField(this, 3) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.GetStateRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.GetStateRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.GetStateRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.GetStateRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    storeName: jspb.Message.getFieldWithDefault(msg, 1, ""),
    key: jspb.Message.getFieldWithDefault(msg, 2, ""),
    consistency: jspb.Message.getFieldWithDefault(msg, 3, 0),
    metadataMap: (f = msg.getMetadataMap()) ? f.toObject(includeInstance, undefined) : []
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.GetStateRequest}
 */
proto.dapr.proto.runtime.v1.GetStateRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.GetStateRequest;
  return proto.dapr.proto.runtime.v1.GetStateRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.GetStateRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.GetStateRequest}
 */
proto.dapr.proto.runtime.v1.GetStateRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setStoreName(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setKey(value);
      break;
    case 3:
      var value = /** @type {!proto.dapr.proto.common.v1.StateOptions.StateConsistency} */ (reader.readEnum());
      msg.setConsistency(value);
      break;
    case 4:
      var value = msg.getMetadataMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readString, null, "", "");
         });
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.GetStateRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.GetStateRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.GetStateRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.GetStateRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getStoreName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getKey();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getConsistency();
  if (f !== 0.0) {
    writer.writeEnum(
      3,
      f
    );
  }
  f = message.getMetadataMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(4, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeString);
  }
};


/**
 * optional string store_name = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.GetStateRequest.prototype.getStoreName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.GetStateRequest} returns this
 */
proto.dapr.proto.runtime.v1.GetStateRequest.prototype.setStoreName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string key = 2;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.GetStateRequest.prototype.getKey = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.GetStateRequest} returns this
 */
proto.dapr.proto.runtime.v1.GetStateRequest.prototype.setKey = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional dapr.proto.common.v1.StateOptions.StateConsistency consistency = 3;
 * @return {!proto.dapr.proto.common.v1.StateOptions.StateConsistency}
 */
proto.dapr.proto.runtime.v1.GetStateRequest.prototype.getConsistency = function() {
  return /** @type {!proto.dapr.proto.common.v1.StateOptions.StateConsistency} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {!proto.dapr.proto.common.v1.StateOptions.StateConsistency} value
 * @return {!proto.dapr.proto.runtime.v1.GetStateRequest} returns this
 */
proto.dapr.proto.runtime.v1.GetStateRequest.prototype.setConsistency = function(value) {
  return jspb.Message.setProto3EnumField(this, 3, value);
};


/**
 * map<string, string> metadata = 4;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,string>}
 */
proto.dapr.proto.runtime.v1.GetStateRequest.prototype.getMetadataMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,string>} */ (
      jspb.Message.getMapField(this, 4, opt_noLazyCreate,
      null));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.dapr.proto.runtime.v1.GetStateRequest} returns this
 */
proto.dapr.proto.runtime.v1.GetStateRequest.prototype.clearMetadataMap = function() {
  this.getMetadataMap().clear();
  return this;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.dapr.proto.runtime.v1.GetBulkStateRequest.repeatedFields_ = [2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.GetBulkStateRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.GetBulkStateRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.GetBulkStateRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.GetBulkStateRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    storeName: jspb.Message.getFieldWithDefault(msg, 1, ""),
    keysList: (f = jspb.Message.getRepeatedField(msg, 2)) == null ? undefined : f,
    parallelism: jspb.Message.getFieldWithDefault(msg, 3, 0),
    metadataMap: (f = msg.getMetadataMap()) ? f.toObject(includeInstance, undefined) : []
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.GetBulkStateRequest}
 */
proto.dapr.proto.runtime.v1.GetBulkStateRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.GetBulkStateRequest;
  return proto.dapr.proto.runtime.v1.GetBulkStateRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.GetBulkStateRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.GetBulkStateRequest}
 */
proto.dapr.proto.runtime.v1.GetBulkStateRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setStoreName(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.addKeys(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setParallelism(value);
      break;
    case 4:
      var value = msg.getMetadataMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readString, null, "", "");
         });
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.GetBulkStateRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.GetBulkStateRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.GetBulkStateRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.GetBulkStateRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getStoreName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getKeysList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      2,
      f
    );
  }
  f = message.getParallelism();
  if (f !== 0) {
    writer.writeInt32(
      3,
      f
    );
  }
  f = message.getMetadataMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(4, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeString);
  }
};


/**
 * optional string store_name = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.GetBulkStateRequest.prototype.getStoreName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.GetBulkStateRequest} returns this
 */
proto.dapr.proto.runtime.v1.GetBulkStateRequest.prototype.setStoreName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * repeated string keys = 2;
 * @return {!Array<string>}
 */
proto.dapr.proto.runtime.v1.GetBulkStateRequest.prototype.getKeysList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 2));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.dapr.proto.runtime.v1.GetBulkStateRequest} returns this
 */
proto.dapr.proto.runtime.v1.GetBulkStateRequest.prototype.setKeysList = function(value) {
  return jspb.Message.setField(this, 2, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.dapr.proto.runtime.v1.GetBulkStateRequest} returns this
 */
proto.dapr.proto.runtime.v1.GetBulkStateRequest.prototype.addKeys = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 2, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.dapr.proto.runtime.v1.GetBulkStateRequest} returns this
 */
proto.dapr.proto.runtime.v1.GetBulkStateRequest.prototype.clearKeysList = function() {
  return this.setKeysList([]);
};


/**
 * optional int32 parallelism = 3;
 * @return {number}
 */
proto.dapr.proto.runtime.v1.GetBulkStateRequest.prototype.getParallelism = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.dapr.proto.runtime.v1.GetBulkStateRequest} returns this
 */
proto.dapr.proto.runtime.v1.GetBulkStateRequest.prototype.setParallelism = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};


/**
 * map<string, string> metadata = 4;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,string>}
 */
proto.dapr.proto.runtime.v1.GetBulkStateRequest.prototype.getMetadataMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,string>} */ (
      jspb.Message.getMapField(this, 4, opt_noLazyCreate,
      null));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.dapr.proto.runtime.v1.GetBulkStateRequest} returns this
 */
proto.dapr.proto.runtime.v1.GetBulkStateRequest.prototype.clearMetadataMap = function() {
  this.getMetadataMap().clear();
  return this;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.dapr.proto.runtime.v1.GetBulkStateResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.GetBulkStateResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.GetBulkStateResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.GetBulkStateResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.GetBulkStateResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    itemsList: jspb.Message.toObjectList(msg.getItemsList(),
    proto.dapr.proto.runtime.v1.BulkStateItem.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.GetBulkStateResponse}
 */
proto.dapr.proto.runtime.v1.GetBulkStateResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.GetBulkStateResponse;
  return proto.dapr.proto.runtime.v1.GetBulkStateResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.GetBulkStateResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.GetBulkStateResponse}
 */
proto.dapr.proto.runtime.v1.GetBulkStateResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.dapr.proto.runtime.v1.BulkStateItem;
      reader.readMessage(value,proto.dapr.proto.runtime.v1.BulkStateItem.deserializeBinaryFromReader);
      msg.addItems(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.GetBulkStateResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.GetBulkStateResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.GetBulkStateResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.GetBulkStateResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getItemsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.dapr.proto.runtime.v1.BulkStateItem.serializeBinaryToWriter
    );
  }
};


/**
 * repeated BulkStateItem items = 1;
 * @return {!Array<!proto.dapr.proto.runtime.v1.BulkStateItem>}
 */
proto.dapr.proto.runtime.v1.GetBulkStateResponse.prototype.getItemsList = function() {
  return /** @type{!Array<!proto.dapr.proto.runtime.v1.BulkStateItem>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.dapr.proto.runtime.v1.BulkStateItem, 1));
};


/**
 * @param {!Array<!proto.dapr.proto.runtime.v1.BulkStateItem>} value
 * @return {!proto.dapr.proto.runtime.v1.GetBulkStateResponse} returns this
*/
proto.dapr.proto.runtime.v1.GetBulkStateResponse.prototype.setItemsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.dapr.proto.runtime.v1.BulkStateItem=} opt_value
 * @param {number=} opt_index
 * @return {!proto.dapr.proto.runtime.v1.BulkStateItem}
 */
proto.dapr.proto.runtime.v1.GetBulkStateResponse.prototype.addItems = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.dapr.proto.runtime.v1.BulkStateItem, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.dapr.proto.runtime.v1.GetBulkStateResponse} returns this
 */
proto.dapr.proto.runtime.v1.GetBulkStateResponse.prototype.clearItemsList = function() {
  return this.setItemsList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.BulkStateItem.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.BulkStateItem.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.BulkStateItem} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.BulkStateItem.toObject = function(includeInstance, msg) {
  var f, obj = {
    key: jspb.Message.getFieldWithDefault(msg, 1, ""),
    data: msg.getData_asB64(),
    etag: jspb.Message.getFieldWithDefault(msg, 3, ""),
    error: jspb.Message.getFieldWithDefault(msg, 4, ""),
    metadataMap: (f = msg.getMetadataMap()) ? f.toObject(includeInstance, undefined) : []
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.BulkStateItem}
 */
proto.dapr.proto.runtime.v1.BulkStateItem.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.BulkStateItem;
  return proto.dapr.proto.runtime.v1.BulkStateItem.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.BulkStateItem} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.BulkStateItem}
 */
proto.dapr.proto.runtime.v1.BulkStateItem.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setKey(value);
      break;
    case 2:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setData(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setEtag(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setError(value);
      break;
    case 5:
      var value = msg.getMetadataMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readString, null, "", "");
         });
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.BulkStateItem.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.BulkStateItem.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.BulkStateItem} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.BulkStateItem.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getKey();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getData_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      2,
      f
    );
  }
  f = message.getEtag();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getError();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getMetadataMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(5, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeString);
  }
};


/**
 * optional string key = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.BulkStateItem.prototype.getKey = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.BulkStateItem} returns this
 */
proto.dapr.proto.runtime.v1.BulkStateItem.prototype.setKey = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional bytes data = 2;
 * @return {!(string|Uint8Array)}
 */
proto.dapr.proto.runtime.v1.BulkStateItem.prototype.getData = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * optional bytes data = 2;
 * This is a type-conversion wrapper around `getData()`
 * @return {string}
 */
proto.dapr.proto.runtime.v1.BulkStateItem.prototype.getData_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getData()));
};


/**
 * optional bytes data = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getData()`
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.BulkStateItem.prototype.getData_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getData()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dapr.proto.runtime.v1.BulkStateItem} returns this
 */
proto.dapr.proto.runtime.v1.BulkStateItem.prototype.setData = function(value) {
  return jspb.Message.setProto3BytesField(this, 2, value);
};


/**
 * optional string etag = 3;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.BulkStateItem.prototype.getEtag = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.BulkStateItem} returns this
 */
proto.dapr.proto.runtime.v1.BulkStateItem.prototype.setEtag = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string error = 4;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.BulkStateItem.prototype.getError = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.BulkStateItem} returns this
 */
proto.dapr.proto.runtime.v1.BulkStateItem.prototype.setError = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * map<string, string> metadata = 5;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,string>}
 */
proto.dapr.proto.runtime.v1.BulkStateItem.prototype.getMetadataMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,string>} */ (
      jspb.Message.getMapField(this, 5, opt_noLazyCreate,
      null));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.dapr.proto.runtime.v1.BulkStateItem} returns this
 */
proto.dapr.proto.runtime.v1.BulkStateItem.prototype.clearMetadataMap = function() {
  this.getMetadataMap().clear();
  return this;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.GetStateResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.GetStateResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.GetStateResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.GetStateResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    data: msg.getData_asB64(),
    etag: jspb.Message.getFieldWithDefault(msg, 2, ""),
    metadataMap: (f = msg.getMetadataMap()) ? f.toObject(includeInstance, undefined) : []
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.GetStateResponse}
 */
proto.dapr.proto.runtime.v1.GetStateResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.GetStateResponse;
  return proto.dapr.proto.runtime.v1.GetStateResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.GetStateResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.GetStateResponse}
 */
proto.dapr.proto.runtime.v1.GetStateResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setData(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setEtag(value);
      break;
    case 3:
      var value = msg.getMetadataMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readString, null, "", "");
         });
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.GetStateResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.GetStateResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.GetStateResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.GetStateResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getData_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = message.getEtag();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getMetadataMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(3, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeString);
  }
};


/**
 * optional bytes data = 1;
 * @return {!(string|Uint8Array)}
 */
proto.dapr.proto.runtime.v1.GetStateResponse.prototype.getData = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes data = 1;
 * This is a type-conversion wrapper around `getData()`
 * @return {string}
 */
proto.dapr.proto.runtime.v1.GetStateResponse.prototype.getData_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getData()));
};


/**
 * optional bytes data = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getData()`
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.GetStateResponse.prototype.getData_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getData()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dapr.proto.runtime.v1.GetStateResponse} returns this
 */
proto.dapr.proto.runtime.v1.GetStateResponse.prototype.setData = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};


/**
 * optional string etag = 2;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.GetStateResponse.prototype.getEtag = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.GetStateResponse} returns this
 */
proto.dapr.proto.runtime.v1.GetStateResponse.prototype.setEtag = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * map<string, string> metadata = 3;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,string>}
 */
proto.dapr.proto.runtime.v1.GetStateResponse.prototype.getMetadataMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,string>} */ (
      jspb.Message.getMapField(this, 3, opt_noLazyCreate,
      null));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.dapr.proto.runtime.v1.GetStateResponse} returns this
 */
proto.dapr.proto.runtime.v1.GetStateResponse.prototype.clearMetadataMap = function() {
  this.getMetadataMap().clear();
  return this;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.DeleteStateRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.DeleteStateRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.DeleteStateRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.DeleteStateRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    storeName: jspb.Message.getFieldWithDefault(msg, 1, ""),
    key: jspb.Message.getFieldWithDefault(msg, 2, ""),
    etag: (f = msg.getEtag()) && dapr_proto_common_v1_common_pb.Etag.toObject(includeInstance, f),
    options: (f = msg.getOptions()) && dapr_proto_common_v1_common_pb.StateOptions.toObject(includeInstance, f),
    metadataMap: (f = msg.getMetadataMap()) ? f.toObject(includeInstance, undefined) : []
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.DeleteStateRequest}
 */
proto.dapr.proto.runtime.v1.DeleteStateRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.DeleteStateRequest;
  return proto.dapr.proto.runtime.v1.DeleteStateRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.DeleteStateRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.DeleteStateRequest}
 */
proto.dapr.proto.runtime.v1.DeleteStateRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setStoreName(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setKey(value);
      break;
    case 3:
      var value = new dapr_proto_common_v1_common_pb.Etag;
      reader.readMessage(value,dapr_proto_common_v1_common_pb.Etag.deserializeBinaryFromReader);
      msg.setEtag(value);
      break;
    case 4:
      var value = new dapr_proto_common_v1_common_pb.StateOptions;
      reader.readMessage(value,dapr_proto_common_v1_common_pb.StateOptions.deserializeBinaryFromReader);
      msg.setOptions(value);
      break;
    case 5:
      var value = msg.getMetadataMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readString, null, "", "");
         });
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.DeleteStateRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.DeleteStateRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.DeleteStateRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.DeleteStateRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getStoreName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getKey();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getEtag();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      dapr_proto_common_v1_common_pb.Etag.serializeBinaryToWriter
    );
  }
  f = message.getOptions();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      dapr_proto_common_v1_common_pb.StateOptions.serializeBinaryToWriter
    );
  }
  f = message.getMetadataMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(5, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeString);
  }
};


/**
 * optional string store_name = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.DeleteStateRequest.prototype.getStoreName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.DeleteStateRequest} returns this
 */
proto.dapr.proto.runtime.v1.DeleteStateRequest.prototype.setStoreName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string key = 2;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.DeleteStateRequest.prototype.getKey = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.DeleteStateRequest} returns this
 */
proto.dapr.proto.runtime.v1.DeleteStateRequest.prototype.setKey = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional dapr.proto.common.v1.Etag etag = 3;
 * @return {?proto.dapr.proto.common.v1.Etag}
 */
proto.dapr.proto.runtime.v1.DeleteStateRequest.prototype.getEtag = function() {
  return /** @type{?proto.dapr.proto.common.v1.Etag} */ (
    jspb.Message.getWrapperField(this, dapr_proto_common_v1_common_pb.Etag, 3));
};


/**
 * @param {?proto.dapr.proto.common.v1.Etag|undefined} value
 * @return {!proto.dapr.proto.runtime.v1.DeleteStateRequest} returns this
*/
proto.dapr.proto.runtime.v1.DeleteStateRequest.prototype.setEtag = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.dapr.proto.runtime.v1.DeleteStateRequest} returns this
 */
proto.dapr.proto.runtime.v1.DeleteStateRequest.prototype.clearEtag = function() {
  return this.setEtag(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.dapr.proto.runtime.v1.DeleteStateRequest.prototype.hasEtag = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional dapr.proto.common.v1.StateOptions options = 4;
 * @return {?proto.dapr.proto.common.v1.StateOptions}
 */
proto.dapr.proto.runtime.v1.DeleteStateRequest.prototype.getOptions = function() {
  return /** @type{?proto.dapr.proto.common.v1.StateOptions} */ (
    jspb.Message.getWrapperField(this, dapr_proto_common_v1_common_pb.StateOptions, 4));
};


/**
 * @param {?proto.dapr.proto.common.v1.StateOptions|undefined} value
 * @return {!proto.dapr.proto.runtime.v1.DeleteStateRequest} returns this
*/
proto.dapr.proto.runtime.v1.DeleteStateRequest.prototype.setOptions = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.dapr.proto.runtime.v1.DeleteStateRequest} returns this
 */
proto.dapr.proto.runtime.v1.DeleteStateRequest.prototype.clearOptions = function() {
  return this.setOptions(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.dapr.proto.runtime.v1.DeleteStateRequest.prototype.hasOptions = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * map<string, string> metadata = 5;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,string>}
 */
proto.dapr.proto.runtime.v1.DeleteStateRequest.prototype.getMetadataMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,string>} */ (
      jspb.Message.getMapField(this, 5, opt_noLazyCreate,
      null));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.dapr.proto.runtime.v1.DeleteStateRequest} returns this
 */
proto.dapr.proto.runtime.v1.DeleteStateRequest.prototype.clearMetadataMap = function() {
  this.getMetadataMap().clear();
  return this;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.dapr.proto.runtime.v1.DeleteBulkStateRequest.repeatedFields_ = [2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.DeleteBulkStateRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.DeleteBulkStateRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.DeleteBulkStateRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.DeleteBulkStateRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    storeName: jspb.Message.getFieldWithDefault(msg, 1, ""),
    statesList: jspb.Message.toObjectList(msg.getStatesList(),
    dapr_proto_common_v1_common_pb.StateItem.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.DeleteBulkStateRequest}
 */
proto.dapr.proto.runtime.v1.DeleteBulkStateRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.DeleteBulkStateRequest;
  return proto.dapr.proto.runtime.v1.DeleteBulkStateRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.DeleteBulkStateRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.DeleteBulkStateRequest}
 */
proto.dapr.proto.runtime.v1.DeleteBulkStateRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setStoreName(value);
      break;
    case 2:
      var value = new dapr_proto_common_v1_common_pb.StateItem;
      reader.readMessage(value,dapr_proto_common_v1_common_pb.StateItem.deserializeBinaryFromReader);
      msg.addStates(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.DeleteBulkStateRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.DeleteBulkStateRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.DeleteBulkStateRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.DeleteBulkStateRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getStoreName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getStatesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      2,
      f,
      dapr_proto_common_v1_common_pb.StateItem.serializeBinaryToWriter
    );
  }
};


/**
 * optional string store_name = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.DeleteBulkStateRequest.prototype.getStoreName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.DeleteBulkStateRequest} returns this
 */
proto.dapr.proto.runtime.v1.DeleteBulkStateRequest.prototype.setStoreName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * repeated dapr.proto.common.v1.StateItem states = 2;
 * @return {!Array<!proto.dapr.proto.common.v1.StateItem>}
 */
proto.dapr.proto.runtime.v1.DeleteBulkStateRequest.prototype.getStatesList = function() {
  return /** @type{!Array<!proto.dapr.proto.common.v1.StateItem>} */ (
    jspb.Message.getRepeatedWrapperField(this, dapr_proto_common_v1_common_pb.StateItem, 2));
};


/**
 * @param {!Array<!proto.dapr.proto.common.v1.StateItem>} value
 * @return {!proto.dapr.proto.runtime.v1.DeleteBulkStateRequest} returns this
*/
proto.dapr.proto.runtime.v1.DeleteBulkStateRequest.prototype.setStatesList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 2, value);
};


/**
 * @param {!proto.dapr.proto.common.v1.StateItem=} opt_value
 * @param {number=} opt_index
 * @return {!proto.dapr.proto.common.v1.StateItem}
 */
proto.dapr.proto.runtime.v1.DeleteBulkStateRequest.prototype.addStates = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.dapr.proto.common.v1.StateItem, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.dapr.proto.runtime.v1.DeleteBulkStateRequest} returns this
 */
proto.dapr.proto.runtime.v1.DeleteBulkStateRequest.prototype.clearStatesList = function() {
  return this.setStatesList([]);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.dapr.proto.runtime.v1.SaveStateRequest.repeatedFields_ = [2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.SaveStateRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.SaveStateRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.SaveStateRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SaveStateRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    storeName: jspb.Message.getFieldWithDefault(msg, 1, ""),
    statesList: jspb.Message.toObjectList(msg.getStatesList(),
    dapr_proto_common_v1_common_pb.StateItem.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.SaveStateRequest}
 */
proto.dapr.proto.runtime.v1.SaveStateRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.SaveStateRequest;
  return proto.dapr.proto.runtime.v1.SaveStateRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.SaveStateRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.SaveStateRequest}
 */
proto.dapr.proto.runtime.v1.SaveStateRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setStoreName(value);
      break;
    case 2:
      var value = new dapr_proto_common_v1_common_pb.StateItem;
      reader.readMessage(value,dapr_proto_common_v1_common_pb.StateItem.deserializeBinaryFromReader);
      msg.addStates(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SaveStateRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.SaveStateRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.SaveStateRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SaveStateRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getStoreName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getStatesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      2,
      f,
      dapr_proto_common_v1_common_pb.StateItem.serializeBinaryToWriter
    );
  }
};


/**
 * optional string store_name = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SaveStateRequest.prototype.getStoreName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.SaveStateRequest} returns this
 */
proto.dapr.proto.runtime.v1.SaveStateRequest.prototype.setStoreName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * repeated dapr.proto.common.v1.StateItem states = 2;
 * @return {!Array<!proto.dapr.proto.common.v1.StateItem>}
 */
proto.dapr.proto.runtime.v1.SaveStateRequest.prototype.getStatesList = function() {
  return /** @type{!Array<!proto.dapr.proto.common.v1.StateItem>} */ (
    jspb.Message.getRepeatedWrapperField(this, dapr_proto_common_v1_common_pb.StateItem, 2));
};


/**
 * @param {!Array<!proto.dapr.proto.common.v1.StateItem>} value
 * @return {!proto.dapr.proto.runtime.v1.SaveStateRequest} returns this
*/
proto.dapr.proto.runtime.v1.SaveStateRequest.prototype.setStatesList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 2, value);
};


/**
 * @param {!proto.dapr.proto.common.v1.StateItem=} opt_value
 * @param {number=} opt_index
 * @return {!proto.dapr.proto.common.v1.StateItem}
 */
proto.dapr.proto.runtime.v1.SaveStateRequest.prototype.addStates = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.dapr.proto.common.v1.StateItem, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.dapr.proto.runtime.v1.SaveStateRequest} returns this
 */
proto.dapr.proto.runtime.v1.SaveStateRequest.prototype.clearStatesList = function() {
  return this.setStatesList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.QueryStateRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.QueryStateRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.QueryStateRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.QueryStateRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    storeName: jspb.Message.getFieldWithDefault(msg, 1, ""),
    query: jspb.Message.getFieldWithDefault(msg, 2, ""),
    metadataMap: (f = msg.getMetadataMap()) ? f.toObject(includeInstance, undefined) : []
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.QueryStateRequest}
 */
proto.dapr.proto.runtime.v1.QueryStateRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.QueryStateRequest;
  return proto.dapr.proto.runtime.v1.QueryStateRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.QueryStateRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.QueryStateRequest}
 */
proto.dapr.proto.runtime.v1.QueryStateRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setStoreName(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setQuery(value);
      break;
    case 3:
      var value = msg.getMetadataMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readString, null, "", "");
         });
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.QueryStateRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.QueryStateRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.QueryStateRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.QueryStateRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getStoreName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getQuery();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getMetadataMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(3, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeString);
  }
};


/**
 * optional string store_name = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.QueryStateRequest.prototype.getStoreName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.QueryStateRequest} returns this
 */
proto.dapr.proto.runtime.v1.QueryStateRequest.prototype.setStoreName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string query = 2;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.QueryStateRequest.prototype.getQuery = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.QueryStateRequest} returns this
 */
proto.dapr.proto.runtime.v1.QueryStateRequest.prototype.setQuery = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * map<string, string> metadata = 3;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,string>}
 */
proto.dapr.proto.runtime.v1.QueryStateRequest.prototype.getMetadataMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,string>} */ (
      jspb.Message.getMapField(this, 3, opt_noLazyCreate,
      null));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.dapr.proto.runtime.v1.QueryStateRequest} returns this
 */
proto.dapr.proto.runtime.v1.QueryStateRequest.prototype.clearMetadataMap = function() {
  this.getMetadataMap().clear();
  return this;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.QueryStateItem.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.QueryStateItem.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.QueryStateItem} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.QueryStateItem.toObject = function(includeInstance, msg) {
  var f, obj = {
    key: jspb.Message.getFieldWithDefault(msg, 1, ""),
    data: msg.getData_asB64(),
    etag: jspb.Message.getFieldWithDefault(msg, 3, ""),
    error: jspb.Message.getFieldWithDefault(msg, 4, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.QueryStateItem}
 */
proto.dapr.proto.runtime.v1.QueryStateItem.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.QueryStateItem;
  return proto.dapr.proto.runtime.v1.QueryStateItem.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.QueryStateItem} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.QueryStateItem}
 */
proto.dapr.proto.runtime.v1.QueryStateItem.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setKey(value);
      break;
    case 2:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setData(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setEtag(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setError(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.QueryStateItem.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.QueryStateItem.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.QueryStateItem} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.QueryStateItem.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getKey();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getData_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      2,
      f
    );
  }
  f = message.getEtag();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getError();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
};


/**
 * optional string key = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.QueryStateItem.prototype.getKey = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.QueryStateItem} returns this
 */
proto.dapr.proto.runtime.v1.QueryStateItem.prototype.setKey = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional bytes data = 2;
 * @return {!(string|Uint8Array)}
 */
proto.dapr.proto.runtime.v1.QueryStateItem.prototype.getData = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * optional bytes data = 2;
 * This is a type-conversion wrapper around `getData()`
 * @return {string}
 */
proto.dapr.proto.runtime.v1.QueryStateItem.prototype.getData_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getData()));
};


/**
 * optional bytes data = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getData()`
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.QueryStateItem.prototype.getData_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getData()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dapr.proto.runtime.v1.QueryStateItem} returns this
 */
proto.dapr.proto.runtime.v1.QueryStateItem.prototype.setData = function(value) {
  return jspb.Message.setProto3BytesField(this, 2, value);
};


/**
 * optional string etag = 3;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.QueryStateItem.prototype.getEtag = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.QueryStateItem} returns this
 */
proto.dapr.proto.runtime.v1.QueryStateItem.prototype.setEtag = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string error = 4;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.QueryStateItem.prototype.getError = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.QueryStateItem} returns this
 */
proto.dapr.proto.runtime.v1.QueryStateItem.prototype.setError = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.dapr.proto.runtime.v1.QueryStateResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.QueryStateResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.QueryStateResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.QueryStateResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.QueryStateResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    resultsList: jspb.Message.toObjectList(msg.getResultsList(),
    proto.dapr.proto.runtime.v1.QueryStateItem.toObject, includeInstance),
    token: jspb.Message.getFieldWithDefault(msg, 2, ""),
    metadataMap: (f = msg.getMetadataMap()) ? f.toObject(includeInstance, undefined) : []
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.QueryStateResponse}
 */
proto.dapr.proto.runtime.v1.QueryStateResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.QueryStateResponse;
  return proto.dapr.proto.runtime.v1.QueryStateResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.QueryStateResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.QueryStateResponse}
 */
proto.dapr.proto.runtime.v1.QueryStateResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.dapr.proto.runtime.v1.QueryStateItem;
      reader.readMessage(value,proto.dapr.proto.runtime.v1.QueryStateItem.deserializeBinaryFromReader);
      msg.addResults(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setToken(value);
      break;
    case 3:
      var value = msg.getMetadataMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readString, null, "", "");
         });
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.QueryStateResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.QueryStateResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.QueryStateResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.QueryStateResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getResultsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.dapr.proto.runtime.v1.QueryStateItem.serializeBinaryToWriter
    );
  }
  f = message.getToken();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getMetadataMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(3, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeString);
  }
};


/**
 * repeated QueryStateItem results = 1;
 * @return {!Array<!proto.dapr.proto.runtime.v1.QueryStateItem>}
 */
proto.dapr.proto.runtime.v1.QueryStateResponse.prototype.getResultsList = function() {
  return /** @type{!Array<!proto.dapr.proto.runtime.v1.QueryStateItem>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.dapr.proto.runtime.v1.QueryStateItem, 1));
};


/**
 * @param {!Array<!proto.dapr.proto.runtime.v1.QueryStateItem>} value
 * @return {!proto.dapr.proto.runtime.v1.QueryStateResponse} returns this
*/
proto.dapr.proto.runtime.v1.QueryStateResponse.prototype.setResultsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.dapr.proto.runtime.v1.QueryStateItem=} opt_value
 * @param {number=} opt_index
 * @return {!proto.dapr.proto.runtime.v1.QueryStateItem}
 */
proto.dapr.proto.runtime.v1.QueryStateResponse.prototype.addResults = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.dapr.proto.runtime.v1.QueryStateItem, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.dapr.proto.runtime.v1.QueryStateResponse} returns this
 */
proto.dapr.proto.runtime.v1.QueryStateResponse.prototype.clearResultsList = function() {
  return this.setResultsList([]);
};


/**
 * optional string token = 2;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.QueryStateResponse.prototype.getToken = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.QueryStateResponse} returns this
 */
proto.dapr.proto.runtime.v1.QueryStateResponse.prototype.setToken = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * map<string, string> metadata = 3;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,string>}
 */
proto.dapr.proto.runtime.v1.QueryStateResponse.prototype.getMetadataMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,string>} */ (
      jspb.Message.getMapField(this, 3, opt_noLazyCreate,
      null));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.dapr.proto.runtime.v1.QueryStateResponse} returns this
 */
proto.dapr.proto.runtime.v1.QueryStateResponse.prototype.clearMetadataMap = function() {
  this.getMetadataMap().clear();
  return this;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.PublishEventRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.PublishEventRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.PublishEventRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.PublishEventRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    pubsubName: jspb.Message.getFieldWithDefault(msg, 1, ""),
    topic: jspb.Message.getFieldWithDefault(msg, 2, ""),
    data: msg.getData_asB64(),
    dataContentType: jspb.Message.getFieldWithDefault(msg, 4, ""),
    metadataMap: (f = msg.getMetadataMap()) ? f.toObject(includeInstance, undefined) : []
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.PublishEventRequest}
 */
proto.dapr.proto.runtime.v1.PublishEventRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.PublishEventRequest;
  return proto.dapr.proto.runtime.v1.PublishEventRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.PublishEventRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.PublishEventRequest}
 */
proto.dapr.proto.runtime.v1.PublishEventRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setPubsubName(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setTopic(value);
      break;
    case 3:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setData(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setDataContentType(value);
      break;
    case 5:
      var value = msg.getMetadataMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readString, null, "", "");
         });
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.PublishEventRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.PublishEventRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.PublishEventRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.PublishEventRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPubsubName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getTopic();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getData_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      3,
      f
    );
  }
  f = message.getDataContentType();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getMetadataMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(5, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeString);
  }
};


/**
 * optional string pubsub_name = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.PublishEventRequest.prototype.getPubsubName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.PublishEventRequest} returns this
 */
proto.dapr.proto.runtime.v1.PublishEventRequest.prototype.setPubsubName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string topic = 2;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.PublishEventRequest.prototype.getTopic = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.PublishEventRequest} returns this
 */
proto.dapr.proto.runtime.v1.PublishEventRequest.prototype.setTopic = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional bytes data = 3;
 * @return {!(string|Uint8Array)}
 */
proto.dapr.proto.runtime.v1.PublishEventRequest.prototype.getData = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * optional bytes data = 3;
 * This is a type-conversion wrapper around `getData()`
 * @return {string}
 */
proto.dapr.proto.runtime.v1.PublishEventRequest.prototype.getData_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getData()));
};


/**
 * optional bytes data = 3;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getData()`
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.PublishEventRequest.prototype.getData_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getData()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dapr.proto.runtime.v1.PublishEventRequest} returns this
 */
proto.dapr.proto.runtime.v1.PublishEventRequest.prototype.setData = function(value) {
  return jspb.Message.setProto3BytesField(this, 3, value);
};


/**
 * optional string data_content_type = 4;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.PublishEventRequest.prototype.getDataContentType = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.PublishEventRequest} returns this
 */
proto.dapr.proto.runtime.v1.PublishEventRequest.prototype.setDataContentType = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * map<string, string> metadata = 5;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,string>}
 */
proto.dapr.proto.runtime.v1.PublishEventRequest.prototype.getMetadataMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,string>} */ (
      jspb.Message.getMapField(this, 5, opt_noLazyCreate,
      null));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.dapr.proto.runtime.v1.PublishEventRequest} returns this
 */
proto.dapr.proto.runtime.v1.PublishEventRequest.prototype.clearMetadataMap = function() {
  this.getMetadataMap().clear();
  return this;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.dapr.proto.runtime.v1.BulkPublishRequest.repeatedFields_ = [3];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.BulkPublishRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.BulkPublishRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.BulkPublishRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.BulkPublishRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    pubsubName: jspb.Message.getFieldWithDefault(msg, 1, ""),
    topic: jspb.Message.getFieldWithDefault(msg, 2, ""),
    entriesList: jspb.Message.toObjectList(msg.getEntriesList(),
    proto.dapr.proto.runtime.v1.BulkPublishRequestEntry.toObject, includeInstance),
    metadataMap: (f = msg.getMetadataMap()) ? f.toObject(includeInstance, undefined) : []
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.BulkPublishRequest}
 */
proto.dapr.proto.runtime.v1.BulkPublishRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.BulkPublishRequest;
  return proto.dapr.proto.runtime.v1.BulkPublishRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.BulkPublishRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.BulkPublishRequest}
 */
proto.dapr.proto.runtime.v1.BulkPublishRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setPubsubName(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setTopic(value);
      break;
    case 3:
      var value = new proto.dapr.proto.runtime.v1.BulkPublishRequestEntry;
      reader.readMessage(value,proto.dapr.proto.runtime.v1.BulkPublishRequestEntry.deserializeBinaryFromReader);
      msg.addEntries(value);
      break;
    case 4:
      var value = msg.getMetadataMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readString, null, "", "");
         });
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.BulkPublishRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.BulkPublishRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.BulkPublishRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.BulkPublishRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPubsubName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getTopic();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getEntriesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      3,
      f,
      proto.dapr.proto.runtime.v1.BulkPublishRequestEntry.serializeBinaryToWriter
    );
  }
  f = message.getMetadataMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(4, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeString);
  }
};


/**
 * optional string pubsub_name = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.BulkPublishRequest.prototype.getPubsubName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.BulkPublishRequest} returns this
 */
proto.dapr.proto.runtime.v1.BulkPublishRequest.prototype.setPubsubName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string topic = 2;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.BulkPublishRequest.prototype.getTopic = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.BulkPublishRequest} returns this
 */
proto.dapr.proto.runtime.v1.BulkPublishRequest.prototype.setTopic = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * repeated BulkPublishRequestEntry entries = 3;
 * @return {!Array<!proto.dapr.proto.runtime.v1.BulkPublishRequestEntry>}
 */
proto.dapr.proto.runtime.v1.BulkPublishRequest.prototype.getEntriesList = function() {
  return /** @type{!Array<!proto.dapr.proto.runtime.v1.BulkPublishRequestEntry>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.dapr.proto.runtime.v1.BulkPublishRequestEntry, 3));
};


/**
 * @param {!Array<!proto.dapr.proto.runtime.v1.BulkPublishRequestEntry>} value
 * @return {!proto.dapr.proto.runtime.v1.BulkPublishRequest} returns this
*/
proto.dapr.proto.runtime.v1.BulkPublishRequest.prototype.setEntriesList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 3, value);
};


/**
 * @param {!proto.dapr.proto.runtime.v1.BulkPublishRequestEntry=} opt_value
 * @param {number=} opt_index
 * @return {!proto.dapr.proto.runtime.v1.BulkPublishRequestEntry}
 */
proto.dapr.proto.runtime.v1.BulkPublishRequest.prototype.addEntries = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 3, opt_value, proto.dapr.proto.runtime.v1.BulkPublishRequestEntry, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.dapr.proto.runtime.v1.BulkPublishRequest} returns this
 */
proto.dapr.proto.runtime.v1.BulkPublishRequest.prototype.clearEntriesList = function() {
  return this.setEntriesList([]);
};


/**
 * map<string, string> metadata = 4;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,string>}
 */
proto.dapr.proto.runtime.v1.BulkPublishRequest.prototype.getMetadataMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,string>} */ (
      jspb.Message.getMapField(this, 4, opt_noLazyCreate,
      null));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.dapr.proto.runtime.v1.BulkPublishRequest} returns this
 */
proto.dapr.proto.runtime.v1.BulkPublishRequest.prototype.clearMetadataMap = function() {
  this.getMetadataMap().clear();
  return this;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.BulkPublishRequestEntry.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.BulkPublishRequestEntry.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.BulkPublishRequestEntry} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.BulkPublishRequestEntry.toObject = function(includeInstance, msg) {
  var f, obj = {
    entryId: jspb.Message.getFieldWithDefault(msg, 1, ""),
    event: msg.getEvent_asB64(),
    contentType: jspb.Message.getFieldWithDefault(msg, 3, ""),
    metadataMap: (f = msg.getMetadataMap()) ? f.toObject(includeInstance, undefined) : []
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.BulkPublishRequestEntry}
 */
proto.dapr.proto.runtime.v1.BulkPublishRequestEntry.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.BulkPublishRequestEntry;
  return proto.dapr.proto.runtime.v1.BulkPublishRequestEntry.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.BulkPublishRequestEntry} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.BulkPublishRequestEntry}
 */
proto.dapr.proto.runtime.v1.BulkPublishRequestEntry.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setEntryId(value);
      break;
    case 2:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setEvent(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setContentType(value);
      break;
    case 4:
      var value = msg.getMetadataMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readString, null, "", "");
         });
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.BulkPublishRequestEntry.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.BulkPublishRequestEntry.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.BulkPublishRequestEntry} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.BulkPublishRequestEntry.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getEntryId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getEvent_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      2,
      f
    );
  }
  f = message.getContentType();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getMetadataMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(4, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeString);
  }
};


/**
 * optional string entry_id = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.BulkPublishRequestEntry.prototype.getEntryId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.BulkPublishRequestEntry} returns this
 */
proto.dapr.proto.runtime.v1.BulkPublishRequestEntry.prototype.setEntryId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional bytes event = 2;
 * @return {!(string|Uint8Array)}
 */
proto.dapr.proto.runtime.v1.BulkPublishRequestEntry.prototype.getEvent = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * optional bytes event = 2;
 * This is a type-conversion wrapper around `getEvent()`
 * @return {string}
 */
proto.dapr.proto.runtime.v1.BulkPublishRequestEntry.prototype.getEvent_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getEvent()));
};


/**
 * optional bytes event = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getEvent()`
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.BulkPublishRequestEntry.prototype.getEvent_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getEvent()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dapr.proto.runtime.v1.BulkPublishRequestEntry} returns this
 */
proto.dapr.proto.runtime.v1.BulkPublishRequestEntry.prototype.setEvent = function(value) {
  return jspb.Message.setProto3BytesField(this, 2, value);
};


/**
 * optional string content_type = 3;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.BulkPublishRequestEntry.prototype.getContentType = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.BulkPublishRequestEntry} returns this
 */
proto.dapr.proto.runtime.v1.BulkPublishRequestEntry.prototype.setContentType = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * map<string, string> metadata = 4;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,string>}
 */
proto.dapr.proto.runtime.v1.BulkPublishRequestEntry.prototype.getMetadataMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,string>} */ (
      jspb.Message.getMapField(this, 4, opt_noLazyCreate,
      null));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.dapr.proto.runtime.v1.BulkPublishRequestEntry} returns this
 */
proto.dapr.proto.runtime.v1.BulkPublishRequestEntry.prototype.clearMetadataMap = function() {
  this.getMetadataMap().clear();
  return this;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.dapr.proto.runtime.v1.BulkPublishResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.BulkPublishResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.BulkPublishResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.BulkPublishResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.BulkPublishResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    failedentriesList: jspb.Message.toObjectList(msg.getFailedentriesList(),
    proto.dapr.proto.runtime.v1.BulkPublishResponseFailedEntry.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.BulkPublishResponse}
 */
proto.dapr.proto.runtime.v1.BulkPublishResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.BulkPublishResponse;
  return proto.dapr.proto.runtime.v1.BulkPublishResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.BulkPublishResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.BulkPublishResponse}
 */
proto.dapr.proto.runtime.v1.BulkPublishResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.dapr.proto.runtime.v1.BulkPublishResponseFailedEntry;
      reader.readMessage(value,proto.dapr.proto.runtime.v1.BulkPublishResponseFailedEntry.deserializeBinaryFromReader);
      msg.addFailedentries(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.BulkPublishResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.BulkPublishResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.BulkPublishResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.BulkPublishResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getFailedentriesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.dapr.proto.runtime.v1.BulkPublishResponseFailedEntry.serializeBinaryToWriter
    );
  }
};


/**
 * repeated BulkPublishResponseFailedEntry failedEntries = 1;
 * @return {!Array<!proto.dapr.proto.runtime.v1.BulkPublishResponseFailedEntry>}
 */
proto.dapr.proto.runtime.v1.BulkPublishResponse.prototype.getFailedentriesList = function() {
  return /** @type{!Array<!proto.dapr.proto.runtime.v1.BulkPublishResponseFailedEntry>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.dapr.proto.runtime.v1.BulkPublishResponseFailedEntry, 1));
};


/**
 * @param {!Array<!proto.dapr.proto.runtime.v1.BulkPublishResponseFailedEntry>} value
 * @return {!proto.dapr.proto.runtime.v1.BulkPublishResponse} returns this
*/
proto.dapr.proto.runtime.v1.BulkPublishResponse.prototype.setFailedentriesList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.dapr.proto.runtime.v1.BulkPublishResponseFailedEntry=} opt_value
 * @param {number=} opt_index
 * @return {!proto.dapr.proto.runtime.v1.BulkPublishResponseFailedEntry}
 */
proto.dapr.proto.runtime.v1.BulkPublishResponse.prototype.addFailedentries = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.dapr.proto.runtime.v1.BulkPublishResponseFailedEntry, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.dapr.proto.runtime.v1.BulkPublishResponse} returns this
 */
proto.dapr.proto.runtime.v1.BulkPublishResponse.prototype.clearFailedentriesList = function() {
  return this.setFailedentriesList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.BulkPublishResponseFailedEntry.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.BulkPublishResponseFailedEntry.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.BulkPublishResponseFailedEntry} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.BulkPublishResponseFailedEntry.toObject = function(includeInstance, msg) {
  var f, obj = {
    entryId: jspb.Message.getFieldWithDefault(msg, 1, ""),
    error: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.BulkPublishResponseFailedEntry}
 */
proto.dapr.proto.runtime.v1.BulkPublishResponseFailedEntry.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.BulkPublishResponseFailedEntry;
  return proto.dapr.proto.runtime.v1.BulkPublishResponseFailedEntry.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.BulkPublishResponseFailedEntry} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.BulkPublishResponseFailedEntry}
 */
proto.dapr.proto.runtime.v1.BulkPublishResponseFailedEntry.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setEntryId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setError(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.BulkPublishResponseFailedEntry.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.BulkPublishResponseFailedEntry.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.BulkPublishResponseFailedEntry} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.BulkPublishResponseFailedEntry.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getEntryId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getError();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional string entry_id = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.BulkPublishResponseFailedEntry.prototype.getEntryId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.BulkPublishResponseFailedEntry} returns this
 */
proto.dapr.proto.runtime.v1.BulkPublishResponseFailedEntry.prototype.setEntryId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string error = 2;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.BulkPublishResponseFailedEntry.prototype.getError = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.BulkPublishResponseFailedEntry} returns this
 */
proto.dapr.proto.runtime.v1.BulkPublishResponseFailedEntry.prototype.setError = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};



/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestAlpha1.oneofGroups_ = [[1,2]];

/**
 * @enum {number}
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestAlpha1.SubscribeTopicEventsRequestTypeCase = {
  SUBSCRIBE_TOPIC_EVENTS_REQUEST_TYPE_NOT_SET: 0,
  INITIAL_REQUEST: 1,
  EVENT_PROCESSED: 2
};

/**
 * @return {proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestAlpha1.SubscribeTopicEventsRequestTypeCase}
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestAlpha1.prototype.getSubscribeTopicEventsRequestTypeCase = function() {
  return /** @type {proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestAlpha1.SubscribeTopicEventsRequestTypeCase} */(jspb.Message.computeOneofCase(this, proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestAlpha1.oneofGroups_[0]));
};



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestAlpha1.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestAlpha1.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestAlpha1} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestAlpha1.toObject = function(includeInstance, msg) {
  var f, obj = {
    initialRequest: (f = msg.getInitialRequest()) && proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestInitialAlpha1.toObject(includeInstance, f),
    eventProcessed: (f = msg.getEventProcessed()) && proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestProcessedAlpha1.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestAlpha1}
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestAlpha1.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestAlpha1;
  return proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestAlpha1.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestAlpha1} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestAlpha1}
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestAlpha1.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestInitialAlpha1;
      reader.readMessage(value,proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestInitialAlpha1.deserializeBinaryFromReader);
      msg.setInitialRequest(value);
      break;
    case 2:
      var value = new proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestProcessedAlpha1;
      reader.readMessage(value,proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestProcessedAlpha1.deserializeBinaryFromReader);
      msg.setEventProcessed(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestAlpha1.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestAlpha1.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestAlpha1} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestAlpha1.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getInitialRequest();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestInitialAlpha1.serializeBinaryToWriter
    );
  }
  f = message.getEventProcessed();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestProcessedAlpha1.serializeBinaryToWriter
    );
  }
};


/**
 * optional SubscribeTopicEventsRequestInitialAlpha1 initial_request = 1;
 * @return {?proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestInitialAlpha1}
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestAlpha1.prototype.getInitialRequest = function() {
  return /** @type{?proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestInitialAlpha1} */ (
    jspb.Message.getWrapperField(this, proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestInitialAlpha1, 1));
};


/**
 * @param {?proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestInitialAlpha1|undefined} value
 * @return {!proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestAlpha1} returns this
*/
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestAlpha1.prototype.setInitialRequest = function(value) {
  return jspb.Message.setOneofWrapperField(this, 1, proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestAlpha1.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestAlpha1} returns this
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestAlpha1.prototype.clearInitialRequest = function() {
  return this.setInitialRequest(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestAlpha1.prototype.hasInitialRequest = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional SubscribeTopicEventsRequestProcessedAlpha1 event_processed = 2;
 * @return {?proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestProcessedAlpha1}
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestAlpha1.prototype.getEventProcessed = function() {
  return /** @type{?proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestProcessedAlpha1} */ (
    jspb.Message.getWrapperField(this, proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestProcessedAlpha1, 2));
};


/**
 * @param {?proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestProcessedAlpha1|undefined} value
 * @return {!proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestAlpha1} returns this
*/
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestAlpha1.prototype.setEventProcessed = function(value) {
  return jspb.Message.setOneofWrapperField(this, 2, proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestAlpha1.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestAlpha1} returns this
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestAlpha1.prototype.clearEventProcessed = function() {
  return this.setEventProcessed(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestAlpha1.prototype.hasEventProcessed = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestInitialAlpha1.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestInitialAlpha1.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestInitialAlpha1} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestInitialAlpha1.toObject = function(includeInstance, msg) {
  var f, obj = {
    pubsubName: jspb.Message.getFieldWithDefault(msg, 1, ""),
    topic: jspb.Message.getFieldWithDefault(msg, 2, ""),
    metadataMap: (f = msg.getMetadataMap()) ? f.toObject(includeInstance, undefined) : [],
    deadLetterTopic: jspb.Message.getFieldWithDefault(msg, 4, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestInitialAlpha1}
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestInitialAlpha1.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestInitialAlpha1;
  return proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestInitialAlpha1.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestInitialAlpha1} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestInitialAlpha1}
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestInitialAlpha1.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setPubsubName(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setTopic(value);
      break;
    case 3:
      var value = msg.getMetadataMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readString, null, "", "");
         });
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setDeadLetterTopic(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestInitialAlpha1.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestInitialAlpha1.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestInitialAlpha1} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestInitialAlpha1.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPubsubName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getTopic();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getMetadataMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(3, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeString);
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 4));
  if (f != null) {
    writer.writeString(
      4,
      f
    );
  }
};


/**
 * optional string pubsub_name = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestInitialAlpha1.prototype.getPubsubName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestInitialAlpha1} returns this
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestInitialAlpha1.prototype.setPubsubName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string topic = 2;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestInitialAlpha1.prototype.getTopic = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestInitialAlpha1} returns this
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestInitialAlpha1.prototype.setTopic = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * map<string, string> metadata = 3;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,string>}
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestInitialAlpha1.prototype.getMetadataMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,string>} */ (
      jspb.Message.getMapField(this, 3, opt_noLazyCreate,
      null));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestInitialAlpha1} returns this
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestInitialAlpha1.prototype.clearMetadataMap = function() {
  this.getMetadataMap().clear();
  return this;
};


/**
 * optional string dead_letter_topic = 4;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestInitialAlpha1.prototype.getDeadLetterTopic = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestInitialAlpha1} returns this
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestInitialAlpha1.prototype.setDeadLetterTopic = function(value) {
  return jspb.Message.setField(this, 4, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestInitialAlpha1} returns this
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestInitialAlpha1.prototype.clearDeadLetterTopic = function() {
  return jspb.Message.setField(this, 4, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestInitialAlpha1.prototype.hasDeadLetterTopic = function() {
  return jspb.Message.getField(this, 4) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestProcessedAlpha1.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestProcessedAlpha1.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestProcessedAlpha1} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestProcessedAlpha1.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, ""),
    status: (f = msg.getStatus()) && dapr_proto_runtime_v1_appcallback_pb.TopicEventResponse.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestProcessedAlpha1}
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestProcessedAlpha1.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestProcessedAlpha1;
  return proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestProcessedAlpha1.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestProcessedAlpha1} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestProcessedAlpha1}
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestProcessedAlpha1.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    case 2:
      var value = new dapr_proto_runtime_v1_appcallback_pb.TopicEventResponse;
      reader.readMessage(value,dapr_proto_runtime_v1_appcallback_pb.TopicEventResponse.deserializeBinaryFromReader);
      msg.setStatus(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestProcessedAlpha1.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestProcessedAlpha1.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestProcessedAlpha1} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestProcessedAlpha1.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getStatus();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      dapr_proto_runtime_v1_appcallback_pb.TopicEventResponse.serializeBinaryToWriter
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestProcessedAlpha1.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestProcessedAlpha1} returns this
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestProcessedAlpha1.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional TopicEventResponse status = 2;
 * @return {?proto.dapr.proto.runtime.v1.TopicEventResponse}
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestProcessedAlpha1.prototype.getStatus = function() {
  return /** @type{?proto.dapr.proto.runtime.v1.TopicEventResponse} */ (
    jspb.Message.getWrapperField(this, dapr_proto_runtime_v1_appcallback_pb.TopicEventResponse, 2));
};


/**
 * @param {?proto.dapr.proto.runtime.v1.TopicEventResponse|undefined} value
 * @return {!proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestProcessedAlpha1} returns this
*/
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestProcessedAlpha1.prototype.setStatus = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestProcessedAlpha1} returns this
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestProcessedAlpha1.prototype.clearStatus = function() {
  return this.setStatus(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsRequestProcessedAlpha1.prototype.hasStatus = function() {
  return jspb.Message.getField(this, 2) != null;
};



/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseAlpha1.oneofGroups_ = [[1,2]];

/**
 * @enum {number}
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseAlpha1.SubscribeTopicEventsResponseTypeCase = {
  SUBSCRIBE_TOPIC_EVENTS_RESPONSE_TYPE_NOT_SET: 0,
  INITIAL_RESPONSE: 1,
  EVENT_MESSAGE: 2
};

/**
 * @return {proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseAlpha1.SubscribeTopicEventsResponseTypeCase}
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseAlpha1.prototype.getSubscribeTopicEventsResponseTypeCase = function() {
  return /** @type {proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseAlpha1.SubscribeTopicEventsResponseTypeCase} */(jspb.Message.computeOneofCase(this, proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseAlpha1.oneofGroups_[0]));
};



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseAlpha1.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseAlpha1.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseAlpha1} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseAlpha1.toObject = function(includeInstance, msg) {
  var f, obj = {
    initialResponse: (f = msg.getInitialResponse()) && proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseInitialAlpha1.toObject(includeInstance, f),
    eventMessage: (f = msg.getEventMessage()) && dapr_proto_runtime_v1_appcallback_pb.TopicEventRequest.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseAlpha1}
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseAlpha1.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseAlpha1;
  return proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseAlpha1.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseAlpha1} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseAlpha1}
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseAlpha1.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseInitialAlpha1;
      reader.readMessage(value,proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseInitialAlpha1.deserializeBinaryFromReader);
      msg.setInitialResponse(value);
      break;
    case 2:
      var value = new dapr_proto_runtime_v1_appcallback_pb.TopicEventRequest;
      reader.readMessage(value,dapr_proto_runtime_v1_appcallback_pb.TopicEventRequest.deserializeBinaryFromReader);
      msg.setEventMessage(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseAlpha1.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseAlpha1.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseAlpha1} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseAlpha1.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getInitialResponse();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseInitialAlpha1.serializeBinaryToWriter
    );
  }
  f = message.getEventMessage();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      dapr_proto_runtime_v1_appcallback_pb.TopicEventRequest.serializeBinaryToWriter
    );
  }
};


/**
 * optional SubscribeTopicEventsResponseInitialAlpha1 initial_response = 1;
 * @return {?proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseInitialAlpha1}
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseAlpha1.prototype.getInitialResponse = function() {
  return /** @type{?proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseInitialAlpha1} */ (
    jspb.Message.getWrapperField(this, proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseInitialAlpha1, 1));
};


/**
 * @param {?proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseInitialAlpha1|undefined} value
 * @return {!proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseAlpha1} returns this
*/
proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseAlpha1.prototype.setInitialResponse = function(value) {
  return jspb.Message.setOneofWrapperField(this, 1, proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseAlpha1.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseAlpha1} returns this
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseAlpha1.prototype.clearInitialResponse = function() {
  return this.setInitialResponse(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseAlpha1.prototype.hasInitialResponse = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional TopicEventRequest event_message = 2;
 * @return {?proto.dapr.proto.runtime.v1.TopicEventRequest}
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseAlpha1.prototype.getEventMessage = function() {
  return /** @type{?proto.dapr.proto.runtime.v1.TopicEventRequest} */ (
    jspb.Message.getWrapperField(this, dapr_proto_runtime_v1_appcallback_pb.TopicEventRequest, 2));
};


/**
 * @param {?proto.dapr.proto.runtime.v1.TopicEventRequest|undefined} value
 * @return {!proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseAlpha1} returns this
*/
proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseAlpha1.prototype.setEventMessage = function(value) {
  return jspb.Message.setOneofWrapperField(this, 2, proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseAlpha1.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseAlpha1} returns this
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseAlpha1.prototype.clearEventMessage = function() {
  return this.setEventMessage(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseAlpha1.prototype.hasEventMessage = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseInitialAlpha1.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseInitialAlpha1.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseInitialAlpha1} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseInitialAlpha1.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseInitialAlpha1}
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseInitialAlpha1.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseInitialAlpha1;
  return proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseInitialAlpha1.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseInitialAlpha1} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseInitialAlpha1}
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseInitialAlpha1.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseInitialAlpha1.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseInitialAlpha1.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseInitialAlpha1} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SubscribeTopicEventsResponseInitialAlpha1.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.InvokeBindingRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.InvokeBindingRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.InvokeBindingRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.InvokeBindingRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    name: jspb.Message.getFieldWithDefault(msg, 1, ""),
    data: msg.getData_asB64(),
    metadataMap: (f = msg.getMetadataMap()) ? f.toObject(includeInstance, undefined) : [],
    operation: jspb.Message.getFieldWithDefault(msg, 4, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.InvokeBindingRequest}
 */
proto.dapr.proto.runtime.v1.InvokeBindingRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.InvokeBindingRequest;
  return proto.dapr.proto.runtime.v1.InvokeBindingRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.InvokeBindingRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.InvokeBindingRequest}
 */
proto.dapr.proto.runtime.v1.InvokeBindingRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 2:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setData(value);
      break;
    case 3:
      var value = msg.getMetadataMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readString, null, "", "");
         });
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setOperation(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.InvokeBindingRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.InvokeBindingRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.InvokeBindingRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.InvokeBindingRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getData_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      2,
      f
    );
  }
  f = message.getMetadataMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(3, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeString);
  }
  f = message.getOperation();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
};


/**
 * optional string name = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.InvokeBindingRequest.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.InvokeBindingRequest} returns this
 */
proto.dapr.proto.runtime.v1.InvokeBindingRequest.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional bytes data = 2;
 * @return {!(string|Uint8Array)}
 */
proto.dapr.proto.runtime.v1.InvokeBindingRequest.prototype.getData = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * optional bytes data = 2;
 * This is a type-conversion wrapper around `getData()`
 * @return {string}
 */
proto.dapr.proto.runtime.v1.InvokeBindingRequest.prototype.getData_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getData()));
};


/**
 * optional bytes data = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getData()`
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.InvokeBindingRequest.prototype.getData_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getData()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dapr.proto.runtime.v1.InvokeBindingRequest} returns this
 */
proto.dapr.proto.runtime.v1.InvokeBindingRequest.prototype.setData = function(value) {
  return jspb.Message.setProto3BytesField(this, 2, value);
};


/**
 * map<string, string> metadata = 3;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,string>}
 */
proto.dapr.proto.runtime.v1.InvokeBindingRequest.prototype.getMetadataMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,string>} */ (
      jspb.Message.getMapField(this, 3, opt_noLazyCreate,
      null));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.dapr.proto.runtime.v1.InvokeBindingRequest} returns this
 */
proto.dapr.proto.runtime.v1.InvokeBindingRequest.prototype.clearMetadataMap = function() {
  this.getMetadataMap().clear();
  return this;
};


/**
 * optional string operation = 4;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.InvokeBindingRequest.prototype.getOperation = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.InvokeBindingRequest} returns this
 */
proto.dapr.proto.runtime.v1.InvokeBindingRequest.prototype.setOperation = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.InvokeBindingResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.InvokeBindingResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.InvokeBindingResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.InvokeBindingResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    data: msg.getData_asB64(),
    metadataMap: (f = msg.getMetadataMap()) ? f.toObject(includeInstance, undefined) : []
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.InvokeBindingResponse}
 */
proto.dapr.proto.runtime.v1.InvokeBindingResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.InvokeBindingResponse;
  return proto.dapr.proto.runtime.v1.InvokeBindingResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.InvokeBindingResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.InvokeBindingResponse}
 */
proto.dapr.proto.runtime.v1.InvokeBindingResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setData(value);
      break;
    case 2:
      var value = msg.getMetadataMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readString, null, "", "");
         });
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.InvokeBindingResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.InvokeBindingResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.InvokeBindingResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.InvokeBindingResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getData_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = message.getMetadataMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(2, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeString);
  }
};


/**
 * optional bytes data = 1;
 * @return {!(string|Uint8Array)}
 */
proto.dapr.proto.runtime.v1.InvokeBindingResponse.prototype.getData = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes data = 1;
 * This is a type-conversion wrapper around `getData()`
 * @return {string}
 */
proto.dapr.proto.runtime.v1.InvokeBindingResponse.prototype.getData_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getData()));
};


/**
 * optional bytes data = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getData()`
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.InvokeBindingResponse.prototype.getData_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getData()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dapr.proto.runtime.v1.InvokeBindingResponse} returns this
 */
proto.dapr.proto.runtime.v1.InvokeBindingResponse.prototype.setData = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};


/**
 * map<string, string> metadata = 2;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,string>}
 */
proto.dapr.proto.runtime.v1.InvokeBindingResponse.prototype.getMetadataMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,string>} */ (
      jspb.Message.getMapField(this, 2, opt_noLazyCreate,
      null));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.dapr.proto.runtime.v1.InvokeBindingResponse} returns this
 */
proto.dapr.proto.runtime.v1.InvokeBindingResponse.prototype.clearMetadataMap = function() {
  this.getMetadataMap().clear();
  return this;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.GetSecretRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.GetSecretRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.GetSecretRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.GetSecretRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    storeName: jspb.Message.getFieldWithDefault(msg, 1, ""),
    key: jspb.Message.getFieldWithDefault(msg, 2, ""),
    metadataMap: (f = msg.getMetadataMap()) ? f.toObject(includeInstance, undefined) : []
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.GetSecretRequest}
 */
proto.dapr.proto.runtime.v1.GetSecretRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.GetSecretRequest;
  return proto.dapr.proto.runtime.v1.GetSecretRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.GetSecretRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.GetSecretRequest}
 */
proto.dapr.proto.runtime.v1.GetSecretRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setStoreName(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setKey(value);
      break;
    case 3:
      var value = msg.getMetadataMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readString, null, "", "");
         });
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.GetSecretRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.GetSecretRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.GetSecretRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.GetSecretRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getStoreName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getKey();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getMetadataMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(3, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeString);
  }
};


/**
 * optional string store_name = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.GetSecretRequest.prototype.getStoreName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.GetSecretRequest} returns this
 */
proto.dapr.proto.runtime.v1.GetSecretRequest.prototype.setStoreName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string key = 2;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.GetSecretRequest.prototype.getKey = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.GetSecretRequest} returns this
 */
proto.dapr.proto.runtime.v1.GetSecretRequest.prototype.setKey = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * map<string, string> metadata = 3;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,string>}
 */
proto.dapr.proto.runtime.v1.GetSecretRequest.prototype.getMetadataMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,string>} */ (
      jspb.Message.getMapField(this, 3, opt_noLazyCreate,
      null));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.dapr.proto.runtime.v1.GetSecretRequest} returns this
 */
proto.dapr.proto.runtime.v1.GetSecretRequest.prototype.clearMetadataMap = function() {
  this.getMetadataMap().clear();
  return this;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.GetSecretResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.GetSecretResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.GetSecretResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.GetSecretResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    dataMap: (f = msg.getDataMap()) ? f.toObject(includeInstance, undefined) : []
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.GetSecretResponse}
 */
proto.dapr.proto.runtime.v1.GetSecretResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.GetSecretResponse;
  return proto.dapr.proto.runtime.v1.GetSecretResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.GetSecretResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.GetSecretResponse}
 */
proto.dapr.proto.runtime.v1.GetSecretResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = msg.getDataMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readString, null, "", "");
         });
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.GetSecretResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.GetSecretResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.GetSecretResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.GetSecretResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDataMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(1, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeString);
  }
};


/**
 * map<string, string> data = 1;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,string>}
 */
proto.dapr.proto.runtime.v1.GetSecretResponse.prototype.getDataMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,string>} */ (
      jspb.Message.getMapField(this, 1, opt_noLazyCreate,
      null));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.dapr.proto.runtime.v1.GetSecretResponse} returns this
 */
proto.dapr.proto.runtime.v1.GetSecretResponse.prototype.clearDataMap = function() {
  this.getDataMap().clear();
  return this;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.GetBulkSecretRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.GetBulkSecretRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.GetBulkSecretRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.GetBulkSecretRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    storeName: jspb.Message.getFieldWithDefault(msg, 1, ""),
    metadataMap: (f = msg.getMetadataMap()) ? f.toObject(includeInstance, undefined) : []
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.GetBulkSecretRequest}
 */
proto.dapr.proto.runtime.v1.GetBulkSecretRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.GetBulkSecretRequest;
  return proto.dapr.proto.runtime.v1.GetBulkSecretRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.GetBulkSecretRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.GetBulkSecretRequest}
 */
proto.dapr.proto.runtime.v1.GetBulkSecretRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setStoreName(value);
      break;
    case 2:
      var value = msg.getMetadataMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readString, null, "", "");
         });
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.GetBulkSecretRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.GetBulkSecretRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.GetBulkSecretRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.GetBulkSecretRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getStoreName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getMetadataMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(2, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeString);
  }
};


/**
 * optional string store_name = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.GetBulkSecretRequest.prototype.getStoreName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.GetBulkSecretRequest} returns this
 */
proto.dapr.proto.runtime.v1.GetBulkSecretRequest.prototype.setStoreName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * map<string, string> metadata = 2;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,string>}
 */
proto.dapr.proto.runtime.v1.GetBulkSecretRequest.prototype.getMetadataMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,string>} */ (
      jspb.Message.getMapField(this, 2, opt_noLazyCreate,
      null));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.dapr.proto.runtime.v1.GetBulkSecretRequest} returns this
 */
proto.dapr.proto.runtime.v1.GetBulkSecretRequest.prototype.clearMetadataMap = function() {
  this.getMetadataMap().clear();
  return this;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.SecretResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.SecretResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.SecretResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SecretResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    secretsMap: (f = msg.getSecretsMap()) ? f.toObject(includeInstance, undefined) : []
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.SecretResponse}
 */
proto.dapr.proto.runtime.v1.SecretResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.SecretResponse;
  return proto.dapr.proto.runtime.v1.SecretResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.SecretResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.SecretResponse}
 */
proto.dapr.proto.runtime.v1.SecretResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = msg.getSecretsMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readString, null, "", "");
         });
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SecretResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.SecretResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.SecretResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SecretResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSecretsMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(1, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeString);
  }
};


/**
 * map<string, string> secrets = 1;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,string>}
 */
proto.dapr.proto.runtime.v1.SecretResponse.prototype.getSecretsMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,string>} */ (
      jspb.Message.getMapField(this, 1, opt_noLazyCreate,
      null));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.dapr.proto.runtime.v1.SecretResponse} returns this
 */
proto.dapr.proto.runtime.v1.SecretResponse.prototype.clearSecretsMap = function() {
  this.getSecretsMap().clear();
  return this;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.GetBulkSecretResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.GetBulkSecretResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.GetBulkSecretResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.GetBulkSecretResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    dataMap: (f = msg.getDataMap()) ? f.toObject(includeInstance, proto.dapr.proto.runtime.v1.SecretResponse.toObject) : []
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.GetBulkSecretResponse}
 */
proto.dapr.proto.runtime.v1.GetBulkSecretResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.GetBulkSecretResponse;
  return proto.dapr.proto.runtime.v1.GetBulkSecretResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.GetBulkSecretResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.GetBulkSecretResponse}
 */
proto.dapr.proto.runtime.v1.GetBulkSecretResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = msg.getDataMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readMessage, proto.dapr.proto.runtime.v1.SecretResponse.deserializeBinaryFromReader, "", new proto.dapr.proto.runtime.v1.SecretResponse());
         });
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.GetBulkSecretResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.GetBulkSecretResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.GetBulkSecretResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.GetBulkSecretResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDataMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(1, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeMessage, proto.dapr.proto.runtime.v1.SecretResponse.serializeBinaryToWriter);
  }
};


/**
 * map<string, SecretResponse> data = 1;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,!proto.dapr.proto.runtime.v1.SecretResponse>}
 */
proto.dapr.proto.runtime.v1.GetBulkSecretResponse.prototype.getDataMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,!proto.dapr.proto.runtime.v1.SecretResponse>} */ (
      jspb.Message.getMapField(this, 1, opt_noLazyCreate,
      proto.dapr.proto.runtime.v1.SecretResponse));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.dapr.proto.runtime.v1.GetBulkSecretResponse} returns this
 */
proto.dapr.proto.runtime.v1.GetBulkSecretResponse.prototype.clearDataMap = function() {
  this.getDataMap().clear();
  return this;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.TransactionalStateOperation.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.TransactionalStateOperation.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.TransactionalStateOperation} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.TransactionalStateOperation.toObject = function(includeInstance, msg) {
  var f, obj = {
    operationtype: jspb.Message.getFieldWithDefault(msg, 1, ""),
    request: (f = msg.getRequest()) && dapr_proto_common_v1_common_pb.StateItem.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.TransactionalStateOperation}
 */
proto.dapr.proto.runtime.v1.TransactionalStateOperation.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.TransactionalStateOperation;
  return proto.dapr.proto.runtime.v1.TransactionalStateOperation.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.TransactionalStateOperation} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.TransactionalStateOperation}
 */
proto.dapr.proto.runtime.v1.TransactionalStateOperation.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setOperationtype(value);
      break;
    case 2:
      var value = new dapr_proto_common_v1_common_pb.StateItem;
      reader.readMessage(value,dapr_proto_common_v1_common_pb.StateItem.deserializeBinaryFromReader);
      msg.setRequest(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.TransactionalStateOperation.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.TransactionalStateOperation.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.TransactionalStateOperation} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.TransactionalStateOperation.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getOperationtype();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getRequest();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      dapr_proto_common_v1_common_pb.StateItem.serializeBinaryToWriter
    );
  }
};


/**
 * optional string operationType = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.TransactionalStateOperation.prototype.getOperationtype = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.TransactionalStateOperation} returns this
 */
proto.dapr.proto.runtime.v1.TransactionalStateOperation.prototype.setOperationtype = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional dapr.proto.common.v1.StateItem request = 2;
 * @return {?proto.dapr.proto.common.v1.StateItem}
 */
proto.dapr.proto.runtime.v1.TransactionalStateOperation.prototype.getRequest = function() {
  return /** @type{?proto.dapr.proto.common.v1.StateItem} */ (
    jspb.Message.getWrapperField(this, dapr_proto_common_v1_common_pb.StateItem, 2));
};


/**
 * @param {?proto.dapr.proto.common.v1.StateItem|undefined} value
 * @return {!proto.dapr.proto.runtime.v1.TransactionalStateOperation} returns this
*/
proto.dapr.proto.runtime.v1.TransactionalStateOperation.prototype.setRequest = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.dapr.proto.runtime.v1.TransactionalStateOperation} returns this
 */
proto.dapr.proto.runtime.v1.TransactionalStateOperation.prototype.clearRequest = function() {
  return this.setRequest(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.dapr.proto.runtime.v1.TransactionalStateOperation.prototype.hasRequest = function() {
  return jspb.Message.getField(this, 2) != null;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.dapr.proto.runtime.v1.ExecuteStateTransactionRequest.repeatedFields_ = [2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.ExecuteStateTransactionRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.ExecuteStateTransactionRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.ExecuteStateTransactionRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.ExecuteStateTransactionRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    storename: jspb.Message.getFieldWithDefault(msg, 1, ""),
    operationsList: jspb.Message.toObjectList(msg.getOperationsList(),
    proto.dapr.proto.runtime.v1.TransactionalStateOperation.toObject, includeInstance),
    metadataMap: (f = msg.getMetadataMap()) ? f.toObject(includeInstance, undefined) : []
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.ExecuteStateTransactionRequest}
 */
proto.dapr.proto.runtime.v1.ExecuteStateTransactionRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.ExecuteStateTransactionRequest;
  return proto.dapr.proto.runtime.v1.ExecuteStateTransactionRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.ExecuteStateTransactionRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.ExecuteStateTransactionRequest}
 */
proto.dapr.proto.runtime.v1.ExecuteStateTransactionRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setStorename(value);
      break;
    case 2:
      var value = new proto.dapr.proto.runtime.v1.TransactionalStateOperation;
      reader.readMessage(value,proto.dapr.proto.runtime.v1.TransactionalStateOperation.deserializeBinaryFromReader);
      msg.addOperations(value);
      break;
    case 3:
      var value = msg.getMetadataMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readString, null, "", "");
         });
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.ExecuteStateTransactionRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.ExecuteStateTransactionRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.ExecuteStateTransactionRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.ExecuteStateTransactionRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getStorename();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getOperationsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      2,
      f,
      proto.dapr.proto.runtime.v1.TransactionalStateOperation.serializeBinaryToWriter
    );
  }
  f = message.getMetadataMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(3, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeString);
  }
};


/**
 * optional string storeName = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.ExecuteStateTransactionRequest.prototype.getStorename = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.ExecuteStateTransactionRequest} returns this
 */
proto.dapr.proto.runtime.v1.ExecuteStateTransactionRequest.prototype.setStorename = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * repeated TransactionalStateOperation operations = 2;
 * @return {!Array<!proto.dapr.proto.runtime.v1.TransactionalStateOperation>}
 */
proto.dapr.proto.runtime.v1.ExecuteStateTransactionRequest.prototype.getOperationsList = function() {
  return /** @type{!Array<!proto.dapr.proto.runtime.v1.TransactionalStateOperation>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.dapr.proto.runtime.v1.TransactionalStateOperation, 2));
};


/**
 * @param {!Array<!proto.dapr.proto.runtime.v1.TransactionalStateOperation>} value
 * @return {!proto.dapr.proto.runtime.v1.ExecuteStateTransactionRequest} returns this
*/
proto.dapr.proto.runtime.v1.ExecuteStateTransactionRequest.prototype.setOperationsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 2, value);
};


/**
 * @param {!proto.dapr.proto.runtime.v1.TransactionalStateOperation=} opt_value
 * @param {number=} opt_index
 * @return {!proto.dapr.proto.runtime.v1.TransactionalStateOperation}
 */
proto.dapr.proto.runtime.v1.ExecuteStateTransactionRequest.prototype.addOperations = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.dapr.proto.runtime.v1.TransactionalStateOperation, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.dapr.proto.runtime.v1.ExecuteStateTransactionRequest} returns this
 */
proto.dapr.proto.runtime.v1.ExecuteStateTransactionRequest.prototype.clearOperationsList = function() {
  return this.setOperationsList([]);
};


/**
 * map<string, string> metadata = 3;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,string>}
 */
proto.dapr.proto.runtime.v1.ExecuteStateTransactionRequest.prototype.getMetadataMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,string>} */ (
      jspb.Message.getMapField(this, 3, opt_noLazyCreate,
      null));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.dapr.proto.runtime.v1.ExecuteStateTransactionRequest} returns this
 */
proto.dapr.proto.runtime.v1.ExecuteStateTransactionRequest.prototype.clearMetadataMap = function() {
  this.getMetadataMap().clear();
  return this;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.RegisterActorTimerRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.RegisterActorTimerRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.RegisterActorTimerRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.RegisterActorTimerRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    actorType: jspb.Message.getFieldWithDefault(msg, 1, ""),
    actorId: jspb.Message.getFieldWithDefault(msg, 2, ""),
    name: jspb.Message.getFieldWithDefault(msg, 3, ""),
    dueTime: jspb.Message.getFieldWithDefault(msg, 4, ""),
    period: jspb.Message.getFieldWithDefault(msg, 5, ""),
    callback: jspb.Message.getFieldWithDefault(msg, 6, ""),
    data: msg.getData_asB64(),
    ttl: jspb.Message.getFieldWithDefault(msg, 8, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.RegisterActorTimerRequest}
 */
proto.dapr.proto.runtime.v1.RegisterActorTimerRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.RegisterActorTimerRequest;
  return proto.dapr.proto.runtime.v1.RegisterActorTimerRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.RegisterActorTimerRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.RegisterActorTimerRequest}
 */
proto.dapr.proto.runtime.v1.RegisterActorTimerRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setActorType(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setActorId(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setDueTime(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setPeriod(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setCallback(value);
      break;
    case 7:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setData(value);
      break;
    case 8:
      var value = /** @type {string} */ (reader.readString());
      msg.setTtl(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.RegisterActorTimerRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.RegisterActorTimerRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.RegisterActorTimerRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.RegisterActorTimerRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getActorType();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getActorId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getDueTime();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getPeriod();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getCallback();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
  f = message.getData_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      7,
      f
    );
  }
  f = message.getTtl();
  if (f.length > 0) {
    writer.writeString(
      8,
      f
    );
  }
};


/**
 * optional string actor_type = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.RegisterActorTimerRequest.prototype.getActorType = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.RegisterActorTimerRequest} returns this
 */
proto.dapr.proto.runtime.v1.RegisterActorTimerRequest.prototype.setActorType = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string actor_id = 2;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.RegisterActorTimerRequest.prototype.getActorId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.RegisterActorTimerRequest} returns this
 */
proto.dapr.proto.runtime.v1.RegisterActorTimerRequest.prototype.setActorId = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string name = 3;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.RegisterActorTimerRequest.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.RegisterActorTimerRequest} returns this
 */
proto.dapr.proto.runtime.v1.RegisterActorTimerRequest.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string due_time = 4;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.RegisterActorTimerRequest.prototype.getDueTime = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.RegisterActorTimerRequest} returns this
 */
proto.dapr.proto.runtime.v1.RegisterActorTimerRequest.prototype.setDueTime = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional string period = 5;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.RegisterActorTimerRequest.prototype.getPeriod = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.RegisterActorTimerRequest} returns this
 */
proto.dapr.proto.runtime.v1.RegisterActorTimerRequest.prototype.setPeriod = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};


/**
 * optional string callback = 6;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.RegisterActorTimerRequest.prototype.getCallback = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.RegisterActorTimerRequest} returns this
 */
proto.dapr.proto.runtime.v1.RegisterActorTimerRequest.prototype.setCallback = function(value) {
  return jspb.Message.setProto3StringField(this, 6, value);
};


/**
 * optional bytes data = 7;
 * @return {!(string|Uint8Array)}
 */
proto.dapr.proto.runtime.v1.RegisterActorTimerRequest.prototype.getData = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 7, ""));
};


/**
 * optional bytes data = 7;
 * This is a type-conversion wrapper around `getData()`
 * @return {string}
 */
proto.dapr.proto.runtime.v1.RegisterActorTimerRequest.prototype.getData_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getData()));
};


/**
 * optional bytes data = 7;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getData()`
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.RegisterActorTimerRequest.prototype.getData_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getData()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dapr.proto.runtime.v1.RegisterActorTimerRequest} returns this
 */
proto.dapr.proto.runtime.v1.RegisterActorTimerRequest.prototype.setData = function(value) {
  return jspb.Message.setProto3BytesField(this, 7, value);
};


/**
 * optional string ttl = 8;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.RegisterActorTimerRequest.prototype.getTtl = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 8, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.RegisterActorTimerRequest} returns this
 */
proto.dapr.proto.runtime.v1.RegisterActorTimerRequest.prototype.setTtl = function(value) {
  return jspb.Message.setProto3StringField(this, 8, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.UnregisterActorTimerRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.UnregisterActorTimerRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.UnregisterActorTimerRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.UnregisterActorTimerRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    actorType: jspb.Message.getFieldWithDefault(msg, 1, ""),
    actorId: jspb.Message.getFieldWithDefault(msg, 2, ""),
    name: jspb.Message.getFieldWithDefault(msg, 3, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.UnregisterActorTimerRequest}
 */
proto.dapr.proto.runtime.v1.UnregisterActorTimerRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.UnregisterActorTimerRequest;
  return proto.dapr.proto.runtime.v1.UnregisterActorTimerRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.UnregisterActorTimerRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.UnregisterActorTimerRequest}
 */
proto.dapr.proto.runtime.v1.UnregisterActorTimerRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setActorType(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setActorId(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.UnregisterActorTimerRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.UnregisterActorTimerRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.UnregisterActorTimerRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.UnregisterActorTimerRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getActorType();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getActorId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
};


/**
 * optional string actor_type = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.UnregisterActorTimerRequest.prototype.getActorType = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.UnregisterActorTimerRequest} returns this
 */
proto.dapr.proto.runtime.v1.UnregisterActorTimerRequest.prototype.setActorType = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string actor_id = 2;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.UnregisterActorTimerRequest.prototype.getActorId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.UnregisterActorTimerRequest} returns this
 */
proto.dapr.proto.runtime.v1.UnregisterActorTimerRequest.prototype.setActorId = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string name = 3;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.UnregisterActorTimerRequest.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.UnregisterActorTimerRequest} returns this
 */
proto.dapr.proto.runtime.v1.UnregisterActorTimerRequest.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.RegisterActorReminderRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.RegisterActorReminderRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.RegisterActorReminderRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.RegisterActorReminderRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    actorType: jspb.Message.getFieldWithDefault(msg, 1, ""),
    actorId: jspb.Message.getFieldWithDefault(msg, 2, ""),
    name: jspb.Message.getFieldWithDefault(msg, 3, ""),
    dueTime: jspb.Message.getFieldWithDefault(msg, 4, ""),
    period: jspb.Message.getFieldWithDefault(msg, 5, ""),
    data: msg.getData_asB64(),
    ttl: jspb.Message.getFieldWithDefault(msg, 7, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.RegisterActorReminderRequest}
 */
proto.dapr.proto.runtime.v1.RegisterActorReminderRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.RegisterActorReminderRequest;
  return proto.dapr.proto.runtime.v1.RegisterActorReminderRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.RegisterActorReminderRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.RegisterActorReminderRequest}
 */
proto.dapr.proto.runtime.v1.RegisterActorReminderRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setActorType(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setActorId(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setDueTime(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setPeriod(value);
      break;
    case 6:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setData(value);
      break;
    case 7:
      var value = /** @type {string} */ (reader.readString());
      msg.setTtl(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.RegisterActorReminderRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.RegisterActorReminderRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.RegisterActorReminderRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.RegisterActorReminderRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getActorType();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getActorId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getDueTime();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getPeriod();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getData_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      6,
      f
    );
  }
  f = message.getTtl();
  if (f.length > 0) {
    writer.writeString(
      7,
      f
    );
  }
};


/**
 * optional string actor_type = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.RegisterActorReminderRequest.prototype.getActorType = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.RegisterActorReminderRequest} returns this
 */
proto.dapr.proto.runtime.v1.RegisterActorReminderRequest.prototype.setActorType = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string actor_id = 2;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.RegisterActorReminderRequest.prototype.getActorId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.RegisterActorReminderRequest} returns this
 */
proto.dapr.proto.runtime.v1.RegisterActorReminderRequest.prototype.setActorId = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string name = 3;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.RegisterActorReminderRequest.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.RegisterActorReminderRequest} returns this
 */
proto.dapr.proto.runtime.v1.RegisterActorReminderRequest.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string due_time = 4;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.RegisterActorReminderRequest.prototype.getDueTime = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.RegisterActorReminderRequest} returns this
 */
proto.dapr.proto.runtime.v1.RegisterActorReminderRequest.prototype.setDueTime = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional string period = 5;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.RegisterActorReminderRequest.prototype.getPeriod = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.RegisterActorReminderRequest} returns this
 */
proto.dapr.proto.runtime.v1.RegisterActorReminderRequest.prototype.setPeriod = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};


/**
 * optional bytes data = 6;
 * @return {!(string|Uint8Array)}
 */
proto.dapr.proto.runtime.v1.RegisterActorReminderRequest.prototype.getData = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/**
 * optional bytes data = 6;
 * This is a type-conversion wrapper around `getData()`
 * @return {string}
 */
proto.dapr.proto.runtime.v1.RegisterActorReminderRequest.prototype.getData_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getData()));
};


/**
 * optional bytes data = 6;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getData()`
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.RegisterActorReminderRequest.prototype.getData_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getData()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dapr.proto.runtime.v1.RegisterActorReminderRequest} returns this
 */
proto.dapr.proto.runtime.v1.RegisterActorReminderRequest.prototype.setData = function(value) {
  return jspb.Message.setProto3BytesField(this, 6, value);
};


/**
 * optional string ttl = 7;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.RegisterActorReminderRequest.prototype.getTtl = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.RegisterActorReminderRequest} returns this
 */
proto.dapr.proto.runtime.v1.RegisterActorReminderRequest.prototype.setTtl = function(value) {
  return jspb.Message.setProto3StringField(this, 7, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.UnregisterActorReminderRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.UnregisterActorReminderRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.UnregisterActorReminderRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.UnregisterActorReminderRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    actorType: jspb.Message.getFieldWithDefault(msg, 1, ""),
    actorId: jspb.Message.getFieldWithDefault(msg, 2, ""),
    name: jspb.Message.getFieldWithDefault(msg, 3, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.UnregisterActorReminderRequest}
 */
proto.dapr.proto.runtime.v1.UnregisterActorReminderRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.UnregisterActorReminderRequest;
  return proto.dapr.proto.runtime.v1.UnregisterActorReminderRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.UnregisterActorReminderRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.UnregisterActorReminderRequest}
 */
proto.dapr.proto.runtime.v1.UnregisterActorReminderRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setActorType(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setActorId(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.UnregisterActorReminderRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.UnregisterActorReminderRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.UnregisterActorReminderRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.UnregisterActorReminderRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getActorType();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getActorId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
};


/**
 * optional string actor_type = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.UnregisterActorReminderRequest.prototype.getActorType = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.UnregisterActorReminderRequest} returns this
 */
proto.dapr.proto.runtime.v1.UnregisterActorReminderRequest.prototype.setActorType = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string actor_id = 2;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.UnregisterActorReminderRequest.prototype.getActorId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.UnregisterActorReminderRequest} returns this
 */
proto.dapr.proto.runtime.v1.UnregisterActorReminderRequest.prototype.setActorId = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string name = 3;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.UnregisterActorReminderRequest.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.UnregisterActorReminderRequest} returns this
 */
proto.dapr.proto.runtime.v1.UnregisterActorReminderRequest.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.GetActorStateRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.GetActorStateRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.GetActorStateRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.GetActorStateRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    actorType: jspb.Message.getFieldWithDefault(msg, 1, ""),
    actorId: jspb.Message.getFieldWithDefault(msg, 2, ""),
    key: jspb.Message.getFieldWithDefault(msg, 3, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.GetActorStateRequest}
 */
proto.dapr.proto.runtime.v1.GetActorStateRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.GetActorStateRequest;
  return proto.dapr.proto.runtime.v1.GetActorStateRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.GetActorStateRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.GetActorStateRequest}
 */
proto.dapr.proto.runtime.v1.GetActorStateRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setActorType(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setActorId(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setKey(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.GetActorStateRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.GetActorStateRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.GetActorStateRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.GetActorStateRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getActorType();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getActorId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getKey();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
};


/**
 * optional string actor_type = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.GetActorStateRequest.prototype.getActorType = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.GetActorStateRequest} returns this
 */
proto.dapr.proto.runtime.v1.GetActorStateRequest.prototype.setActorType = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string actor_id = 2;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.GetActorStateRequest.prototype.getActorId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.GetActorStateRequest} returns this
 */
proto.dapr.proto.runtime.v1.GetActorStateRequest.prototype.setActorId = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string key = 3;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.GetActorStateRequest.prototype.getKey = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.GetActorStateRequest} returns this
 */
proto.dapr.proto.runtime.v1.GetActorStateRequest.prototype.setKey = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.GetActorStateResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.GetActorStateResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.GetActorStateResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.GetActorStateResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    data: msg.getData_asB64(),
    metadataMap: (f = msg.getMetadataMap()) ? f.toObject(includeInstance, undefined) : []
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.GetActorStateResponse}
 */
proto.dapr.proto.runtime.v1.GetActorStateResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.GetActorStateResponse;
  return proto.dapr.proto.runtime.v1.GetActorStateResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.GetActorStateResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.GetActorStateResponse}
 */
proto.dapr.proto.runtime.v1.GetActorStateResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setData(value);
      break;
    case 2:
      var value = msg.getMetadataMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readString, null, "", "");
         });
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.GetActorStateResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.GetActorStateResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.GetActorStateResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.GetActorStateResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getData_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = message.getMetadataMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(2, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeString);
  }
};


/**
 * optional bytes data = 1;
 * @return {!(string|Uint8Array)}
 */
proto.dapr.proto.runtime.v1.GetActorStateResponse.prototype.getData = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes data = 1;
 * This is a type-conversion wrapper around `getData()`
 * @return {string}
 */
proto.dapr.proto.runtime.v1.GetActorStateResponse.prototype.getData_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getData()));
};


/**
 * optional bytes data = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getData()`
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.GetActorStateResponse.prototype.getData_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getData()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dapr.proto.runtime.v1.GetActorStateResponse} returns this
 */
proto.dapr.proto.runtime.v1.GetActorStateResponse.prototype.setData = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};


/**
 * map<string, string> metadata = 2;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,string>}
 */
proto.dapr.proto.runtime.v1.GetActorStateResponse.prototype.getMetadataMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,string>} */ (
      jspb.Message.getMapField(this, 2, opt_noLazyCreate,
      null));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.dapr.proto.runtime.v1.GetActorStateResponse} returns this
 */
proto.dapr.proto.runtime.v1.GetActorStateResponse.prototype.clearMetadataMap = function() {
  this.getMetadataMap().clear();
  return this;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.dapr.proto.runtime.v1.ExecuteActorStateTransactionRequest.repeatedFields_ = [3];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.ExecuteActorStateTransactionRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.ExecuteActorStateTransactionRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.ExecuteActorStateTransactionRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.ExecuteActorStateTransactionRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    actorType: jspb.Message.getFieldWithDefault(msg, 1, ""),
    actorId: jspb.Message.getFieldWithDefault(msg, 2, ""),
    operationsList: jspb.Message.toObjectList(msg.getOperationsList(),
    proto.dapr.proto.runtime.v1.TransactionalActorStateOperation.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.ExecuteActorStateTransactionRequest}
 */
proto.dapr.proto.runtime.v1.ExecuteActorStateTransactionRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.ExecuteActorStateTransactionRequest;
  return proto.dapr.proto.runtime.v1.ExecuteActorStateTransactionRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.ExecuteActorStateTransactionRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.ExecuteActorStateTransactionRequest}
 */
proto.dapr.proto.runtime.v1.ExecuteActorStateTransactionRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setActorType(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setActorId(value);
      break;
    case 3:
      var value = new proto.dapr.proto.runtime.v1.TransactionalActorStateOperation;
      reader.readMessage(value,proto.dapr.proto.runtime.v1.TransactionalActorStateOperation.deserializeBinaryFromReader);
      msg.addOperations(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.ExecuteActorStateTransactionRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.ExecuteActorStateTransactionRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.ExecuteActorStateTransactionRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.ExecuteActorStateTransactionRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getActorType();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getActorId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getOperationsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      3,
      f,
      proto.dapr.proto.runtime.v1.TransactionalActorStateOperation.serializeBinaryToWriter
    );
  }
};


/**
 * optional string actor_type = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.ExecuteActorStateTransactionRequest.prototype.getActorType = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.ExecuteActorStateTransactionRequest} returns this
 */
proto.dapr.proto.runtime.v1.ExecuteActorStateTransactionRequest.prototype.setActorType = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string actor_id = 2;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.ExecuteActorStateTransactionRequest.prototype.getActorId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.ExecuteActorStateTransactionRequest} returns this
 */
proto.dapr.proto.runtime.v1.ExecuteActorStateTransactionRequest.prototype.setActorId = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * repeated TransactionalActorStateOperation operations = 3;
 * @return {!Array<!proto.dapr.proto.runtime.v1.TransactionalActorStateOperation>}
 */
proto.dapr.proto.runtime.v1.ExecuteActorStateTransactionRequest.prototype.getOperationsList = function() {
  return /** @type{!Array<!proto.dapr.proto.runtime.v1.TransactionalActorStateOperation>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.dapr.proto.runtime.v1.TransactionalActorStateOperation, 3));
};


/**
 * @param {!Array<!proto.dapr.proto.runtime.v1.TransactionalActorStateOperation>} value
 * @return {!proto.dapr.proto.runtime.v1.ExecuteActorStateTransactionRequest} returns this
*/
proto.dapr.proto.runtime.v1.ExecuteActorStateTransactionRequest.prototype.setOperationsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 3, value);
};


/**
 * @param {!proto.dapr.proto.runtime.v1.TransactionalActorStateOperation=} opt_value
 * @param {number=} opt_index
 * @return {!proto.dapr.proto.runtime.v1.TransactionalActorStateOperation}
 */
proto.dapr.proto.runtime.v1.ExecuteActorStateTransactionRequest.prototype.addOperations = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 3, opt_value, proto.dapr.proto.runtime.v1.TransactionalActorStateOperation, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.dapr.proto.runtime.v1.ExecuteActorStateTransactionRequest} returns this
 */
proto.dapr.proto.runtime.v1.ExecuteActorStateTransactionRequest.prototype.clearOperationsList = function() {
  return this.setOperationsList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.TransactionalActorStateOperation.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.TransactionalActorStateOperation.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.TransactionalActorStateOperation} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.TransactionalActorStateOperation.toObject = function(includeInstance, msg) {
  var f, obj = {
    operationtype: jspb.Message.getFieldWithDefault(msg, 1, ""),
    key: jspb.Message.getFieldWithDefault(msg, 2, ""),
    value: (f = msg.getValue()) && google_protobuf_any_pb.Any.toObject(includeInstance, f),
    metadataMap: (f = msg.getMetadataMap()) ? f.toObject(includeInstance, undefined) : []
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.TransactionalActorStateOperation}
 */
proto.dapr.proto.runtime.v1.TransactionalActorStateOperation.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.TransactionalActorStateOperation;
  return proto.dapr.proto.runtime.v1.TransactionalActorStateOperation.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.TransactionalActorStateOperation} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.TransactionalActorStateOperation}
 */
proto.dapr.proto.runtime.v1.TransactionalActorStateOperation.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setOperationtype(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setKey(value);
      break;
    case 3:
      var value = new google_protobuf_any_pb.Any;
      reader.readMessage(value,google_protobuf_any_pb.Any.deserializeBinaryFromReader);
      msg.setValue(value);
      break;
    case 4:
      var value = msg.getMetadataMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readString, null, "", "");
         });
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.TransactionalActorStateOperation.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.TransactionalActorStateOperation.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.TransactionalActorStateOperation} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.TransactionalActorStateOperation.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getOperationtype();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getKey();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getValue();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      google_protobuf_any_pb.Any.serializeBinaryToWriter
    );
  }
  f = message.getMetadataMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(4, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeString);
  }
};


/**
 * optional string operationType = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.TransactionalActorStateOperation.prototype.getOperationtype = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.TransactionalActorStateOperation} returns this
 */
proto.dapr.proto.runtime.v1.TransactionalActorStateOperation.prototype.setOperationtype = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string key = 2;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.TransactionalActorStateOperation.prototype.getKey = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.TransactionalActorStateOperation} returns this
 */
proto.dapr.proto.runtime.v1.TransactionalActorStateOperation.prototype.setKey = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional google.protobuf.Any value = 3;
 * @return {?proto.google.protobuf.Any}
 */
proto.dapr.proto.runtime.v1.TransactionalActorStateOperation.prototype.getValue = function() {
  return /** @type{?proto.google.protobuf.Any} */ (
    jspb.Message.getWrapperField(this, google_protobuf_any_pb.Any, 3));
};


/**
 * @param {?proto.google.protobuf.Any|undefined} value
 * @return {!proto.dapr.proto.runtime.v1.TransactionalActorStateOperation} returns this
*/
proto.dapr.proto.runtime.v1.TransactionalActorStateOperation.prototype.setValue = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.dapr.proto.runtime.v1.TransactionalActorStateOperation} returns this
 */
proto.dapr.proto.runtime.v1.TransactionalActorStateOperation.prototype.clearValue = function() {
  return this.setValue(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.dapr.proto.runtime.v1.TransactionalActorStateOperation.prototype.hasValue = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * map<string, string> metadata = 4;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,string>}
 */
proto.dapr.proto.runtime.v1.TransactionalActorStateOperation.prototype.getMetadataMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,string>} */ (
      jspb.Message.getMapField(this, 4, opt_noLazyCreate,
      null));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.dapr.proto.runtime.v1.TransactionalActorStateOperation} returns this
 */
proto.dapr.proto.runtime.v1.TransactionalActorStateOperation.prototype.clearMetadataMap = function() {
  this.getMetadataMap().clear();
  return this;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.InvokeActorRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.InvokeActorRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.InvokeActorRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.InvokeActorRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    actorType: jspb.Message.getFieldWithDefault(msg, 1, ""),
    actorId: jspb.Message.getFieldWithDefault(msg, 2, ""),
    method: jspb.Message.getFieldWithDefault(msg, 3, ""),
    data: msg.getData_asB64(),
    metadataMap: (f = msg.getMetadataMap()) ? f.toObject(includeInstance, undefined) : []
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.InvokeActorRequest}
 */
proto.dapr.proto.runtime.v1.InvokeActorRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.InvokeActorRequest;
  return proto.dapr.proto.runtime.v1.InvokeActorRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.InvokeActorRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.InvokeActorRequest}
 */
proto.dapr.proto.runtime.v1.InvokeActorRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setActorType(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setActorId(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setMethod(value);
      break;
    case 4:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setData(value);
      break;
    case 5:
      var value = msg.getMetadataMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readString, null, "", "");
         });
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.InvokeActorRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.InvokeActorRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.InvokeActorRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.InvokeActorRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getActorType();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getActorId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getMethod();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getData_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      4,
      f
    );
  }
  f = message.getMetadataMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(5, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeString);
  }
};


/**
 * optional string actor_type = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.InvokeActorRequest.prototype.getActorType = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.InvokeActorRequest} returns this
 */
proto.dapr.proto.runtime.v1.InvokeActorRequest.prototype.setActorType = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string actor_id = 2;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.InvokeActorRequest.prototype.getActorId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.InvokeActorRequest} returns this
 */
proto.dapr.proto.runtime.v1.InvokeActorRequest.prototype.setActorId = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string method = 3;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.InvokeActorRequest.prototype.getMethod = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.InvokeActorRequest} returns this
 */
proto.dapr.proto.runtime.v1.InvokeActorRequest.prototype.setMethod = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional bytes data = 4;
 * @return {!(string|Uint8Array)}
 */
proto.dapr.proto.runtime.v1.InvokeActorRequest.prototype.getData = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * optional bytes data = 4;
 * This is a type-conversion wrapper around `getData()`
 * @return {string}
 */
proto.dapr.proto.runtime.v1.InvokeActorRequest.prototype.getData_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getData()));
};


/**
 * optional bytes data = 4;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getData()`
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.InvokeActorRequest.prototype.getData_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getData()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dapr.proto.runtime.v1.InvokeActorRequest} returns this
 */
proto.dapr.proto.runtime.v1.InvokeActorRequest.prototype.setData = function(value) {
  return jspb.Message.setProto3BytesField(this, 4, value);
};


/**
 * map<string, string> metadata = 5;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,string>}
 */
proto.dapr.proto.runtime.v1.InvokeActorRequest.prototype.getMetadataMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,string>} */ (
      jspb.Message.getMapField(this, 5, opt_noLazyCreate,
      null));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.dapr.proto.runtime.v1.InvokeActorRequest} returns this
 */
proto.dapr.proto.runtime.v1.InvokeActorRequest.prototype.clearMetadataMap = function() {
  this.getMetadataMap().clear();
  return this;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.InvokeActorResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.InvokeActorResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.InvokeActorResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.InvokeActorResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    data: msg.getData_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.InvokeActorResponse}
 */
proto.dapr.proto.runtime.v1.InvokeActorResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.InvokeActorResponse;
  return proto.dapr.proto.runtime.v1.InvokeActorResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.InvokeActorResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.InvokeActorResponse}
 */
proto.dapr.proto.runtime.v1.InvokeActorResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setData(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.InvokeActorResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.InvokeActorResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.InvokeActorResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.InvokeActorResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getData_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
};


/**
 * optional bytes data = 1;
 * @return {!(string|Uint8Array)}
 */
proto.dapr.proto.runtime.v1.InvokeActorResponse.prototype.getData = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes data = 1;
 * This is a type-conversion wrapper around `getData()`
 * @return {string}
 */
proto.dapr.proto.runtime.v1.InvokeActorResponse.prototype.getData_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getData()));
};


/**
 * optional bytes data = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getData()`
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.InvokeActorResponse.prototype.getData_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getData()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dapr.proto.runtime.v1.InvokeActorResponse} returns this
 */
proto.dapr.proto.runtime.v1.InvokeActorResponse.prototype.setData = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.GetMetadataRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.GetMetadataRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.GetMetadataRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.GetMetadataRequest.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.GetMetadataRequest}
 */
proto.dapr.proto.runtime.v1.GetMetadataRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.GetMetadataRequest;
  return proto.dapr.proto.runtime.v1.GetMetadataRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.GetMetadataRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.GetMetadataRequest}
 */
proto.dapr.proto.runtime.v1.GetMetadataRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.GetMetadataRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.GetMetadataRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.GetMetadataRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.GetMetadataRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.dapr.proto.runtime.v1.GetMetadataResponse.repeatedFields_ = [2,3,5,6,9];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.GetMetadataResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.GetMetadataResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.GetMetadataResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.GetMetadataResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, ""),
    activeActorsCountList: jspb.Message.toObjectList(msg.getActiveActorsCountList(),
    proto.dapr.proto.runtime.v1.ActiveActorsCount.toObject, includeInstance),
    registeredComponentsList: jspb.Message.toObjectList(msg.getRegisteredComponentsList(),
    proto.dapr.proto.runtime.v1.RegisteredComponents.toObject, includeInstance),
    extendedMetadataMap: (f = msg.getExtendedMetadataMap()) ? f.toObject(includeInstance, undefined) : [],
    subscriptionsList: jspb.Message.toObjectList(msg.getSubscriptionsList(),
    proto.dapr.proto.runtime.v1.PubsubSubscription.toObject, includeInstance),
    httpEndpointsList: jspb.Message.toObjectList(msg.getHttpEndpointsList(),
    proto.dapr.proto.runtime.v1.MetadataHTTPEndpoint.toObject, includeInstance),
    appConnectionProperties: (f = msg.getAppConnectionProperties()) && proto.dapr.proto.runtime.v1.AppConnectionProperties.toObject(includeInstance, f),
    runtimeVersion: jspb.Message.getFieldWithDefault(msg, 8, ""),
    enabledFeaturesList: (f = jspb.Message.getRepeatedField(msg, 9)) == null ? undefined : f,
    actorRuntime: (f = msg.getActorRuntime()) && proto.dapr.proto.runtime.v1.ActorRuntime.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.GetMetadataResponse}
 */
proto.dapr.proto.runtime.v1.GetMetadataResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.GetMetadataResponse;
  return proto.dapr.proto.runtime.v1.GetMetadataResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.GetMetadataResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.GetMetadataResponse}
 */
proto.dapr.proto.runtime.v1.GetMetadataResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    case 2:
      var value = new proto.dapr.proto.runtime.v1.ActiveActorsCount;
      reader.readMessage(value,proto.dapr.proto.runtime.v1.ActiveActorsCount.deserializeBinaryFromReader);
      msg.addActiveActorsCount(value);
      break;
    case 3:
      var value = new proto.dapr.proto.runtime.v1.RegisteredComponents;
      reader.readMessage(value,proto.dapr.proto.runtime.v1.RegisteredComponents.deserializeBinaryFromReader);
      msg.addRegisteredComponents(value);
      break;
    case 4:
      var value = msg.getExtendedMetadataMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readString, null, "", "");
         });
      break;
    case 5:
      var value = new proto.dapr.proto.runtime.v1.PubsubSubscription;
      reader.readMessage(value,proto.dapr.proto.runtime.v1.PubsubSubscription.deserializeBinaryFromReader);
      msg.addSubscriptions(value);
      break;
    case 6:
      var value = new proto.dapr.proto.runtime.v1.MetadataHTTPEndpoint;
      reader.readMessage(value,proto.dapr.proto.runtime.v1.MetadataHTTPEndpoint.deserializeBinaryFromReader);
      msg.addHttpEndpoints(value);
      break;
    case 7:
      var value = new proto.dapr.proto.runtime.v1.AppConnectionProperties;
      reader.readMessage(value,proto.dapr.proto.runtime.v1.AppConnectionProperties.deserializeBinaryFromReader);
      msg.setAppConnectionProperties(value);
      break;
    case 8:
      var value = /** @type {string} */ (reader.readString());
      msg.setRuntimeVersion(value);
      break;
    case 9:
      var value = /** @type {string} */ (reader.readString());
      msg.addEnabledFeatures(value);
      break;
    case 10:
      var value = new proto.dapr.proto.runtime.v1.ActorRuntime;
      reader.readMessage(value,proto.dapr.proto.runtime.v1.ActorRuntime.deserializeBinaryFromReader);
      msg.setActorRuntime(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.GetMetadataResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.GetMetadataResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.GetMetadataResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.GetMetadataResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getActiveActorsCountList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      2,
      f,
      proto.dapr.proto.runtime.v1.ActiveActorsCount.serializeBinaryToWriter
    );
  }
  f = message.getRegisteredComponentsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      3,
      f,
      proto.dapr.proto.runtime.v1.RegisteredComponents.serializeBinaryToWriter
    );
  }
  f = message.getExtendedMetadataMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(4, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeString);
  }
  f = message.getSubscriptionsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      5,
      f,
      proto.dapr.proto.runtime.v1.PubsubSubscription.serializeBinaryToWriter
    );
  }
  f = message.getHttpEndpointsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      6,
      f,
      proto.dapr.proto.runtime.v1.MetadataHTTPEndpoint.serializeBinaryToWriter
    );
  }
  f = message.getAppConnectionProperties();
  if (f != null) {
    writer.writeMessage(
      7,
      f,
      proto.dapr.proto.runtime.v1.AppConnectionProperties.serializeBinaryToWriter
    );
  }
  f = message.getRuntimeVersion();
  if (f.length > 0) {
    writer.writeString(
      8,
      f
    );
  }
  f = message.getEnabledFeaturesList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      9,
      f
    );
  }
  f = message.getActorRuntime();
  if (f != null) {
    writer.writeMessage(
      10,
      f,
      proto.dapr.proto.runtime.v1.ActorRuntime.serializeBinaryToWriter
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.GetMetadataResponse.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.GetMetadataResponse} returns this
 */
proto.dapr.proto.runtime.v1.GetMetadataResponse.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * repeated ActiveActorsCount active_actors_count = 2;
 * @return {!Array<!proto.dapr.proto.runtime.v1.ActiveActorsCount>}
 */
proto.dapr.proto.runtime.v1.GetMetadataResponse.prototype.getActiveActorsCountList = function() {
  return /** @type{!Array<!proto.dapr.proto.runtime.v1.ActiveActorsCount>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.dapr.proto.runtime.v1.ActiveActorsCount, 2));
};


/**
 * @param {!Array<!proto.dapr.proto.runtime.v1.ActiveActorsCount>} value
 * @return {!proto.dapr.proto.runtime.v1.GetMetadataResponse} returns this
*/
proto.dapr.proto.runtime.v1.GetMetadataResponse.prototype.setActiveActorsCountList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 2, value);
};


/**
 * @param {!proto.dapr.proto.runtime.v1.ActiveActorsCount=} opt_value
 * @param {number=} opt_index
 * @return {!proto.dapr.proto.runtime.v1.ActiveActorsCount}
 */
proto.dapr.proto.runtime.v1.GetMetadataResponse.prototype.addActiveActorsCount = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.dapr.proto.runtime.v1.ActiveActorsCount, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.dapr.proto.runtime.v1.GetMetadataResponse} returns this
 */
proto.dapr.proto.runtime.v1.GetMetadataResponse.prototype.clearActiveActorsCountList = function() {
  return this.setActiveActorsCountList([]);
};


/**
 * repeated RegisteredComponents registered_components = 3;
 * @return {!Array<!proto.dapr.proto.runtime.v1.RegisteredComponents>}
 */
proto.dapr.proto.runtime.v1.GetMetadataResponse.prototype.getRegisteredComponentsList = function() {
  return /** @type{!Array<!proto.dapr.proto.runtime.v1.RegisteredComponents>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.dapr.proto.runtime.v1.RegisteredComponents, 3));
};


/**
 * @param {!Array<!proto.dapr.proto.runtime.v1.RegisteredComponents>} value
 * @return {!proto.dapr.proto.runtime.v1.GetMetadataResponse} returns this
*/
proto.dapr.proto.runtime.v1.GetMetadataResponse.prototype.setRegisteredComponentsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 3, value);
};


/**
 * @param {!proto.dapr.proto.runtime.v1.RegisteredComponents=} opt_value
 * @param {number=} opt_index
 * @return {!proto.dapr.proto.runtime.v1.RegisteredComponents}
 */
proto.dapr.proto.runtime.v1.GetMetadataResponse.prototype.addRegisteredComponents = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 3, opt_value, proto.dapr.proto.runtime.v1.RegisteredComponents, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.dapr.proto.runtime.v1.GetMetadataResponse} returns this
 */
proto.dapr.proto.runtime.v1.GetMetadataResponse.prototype.clearRegisteredComponentsList = function() {
  return this.setRegisteredComponentsList([]);
};


/**
 * map<string, string> extended_metadata = 4;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,string>}
 */
proto.dapr.proto.runtime.v1.GetMetadataResponse.prototype.getExtendedMetadataMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,string>} */ (
      jspb.Message.getMapField(this, 4, opt_noLazyCreate,
      null));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.dapr.proto.runtime.v1.GetMetadataResponse} returns this
 */
proto.dapr.proto.runtime.v1.GetMetadataResponse.prototype.clearExtendedMetadataMap = function() {
  this.getExtendedMetadataMap().clear();
  return this;
};


/**
 * repeated PubsubSubscription subscriptions = 5;
 * @return {!Array<!proto.dapr.proto.runtime.v1.PubsubSubscription>}
 */
proto.dapr.proto.runtime.v1.GetMetadataResponse.prototype.getSubscriptionsList = function() {
  return /** @type{!Array<!proto.dapr.proto.runtime.v1.PubsubSubscription>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.dapr.proto.runtime.v1.PubsubSubscription, 5));
};


/**
 * @param {!Array<!proto.dapr.proto.runtime.v1.PubsubSubscription>} value
 * @return {!proto.dapr.proto.runtime.v1.GetMetadataResponse} returns this
*/
proto.dapr.proto.runtime.v1.GetMetadataResponse.prototype.setSubscriptionsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 5, value);
};


/**
 * @param {!proto.dapr.proto.runtime.v1.PubsubSubscription=} opt_value
 * @param {number=} opt_index
 * @return {!proto.dapr.proto.runtime.v1.PubsubSubscription}
 */
proto.dapr.proto.runtime.v1.GetMetadataResponse.prototype.addSubscriptions = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 5, opt_value, proto.dapr.proto.runtime.v1.PubsubSubscription, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.dapr.proto.runtime.v1.GetMetadataResponse} returns this
 */
proto.dapr.proto.runtime.v1.GetMetadataResponse.prototype.clearSubscriptionsList = function() {
  return this.setSubscriptionsList([]);
};


/**
 * repeated MetadataHTTPEndpoint http_endpoints = 6;
 * @return {!Array<!proto.dapr.proto.runtime.v1.MetadataHTTPEndpoint>}
 */
proto.dapr.proto.runtime.v1.GetMetadataResponse.prototype.getHttpEndpointsList = function() {
  return /** @type{!Array<!proto.dapr.proto.runtime.v1.MetadataHTTPEndpoint>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.dapr.proto.runtime.v1.MetadataHTTPEndpoint, 6));
};


/**
 * @param {!Array<!proto.dapr.proto.runtime.v1.MetadataHTTPEndpoint>} value
 * @return {!proto.dapr.proto.runtime.v1.GetMetadataResponse} returns this
*/
proto.dapr.proto.runtime.v1.GetMetadataResponse.prototype.setHttpEndpointsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 6, value);
};


/**
 * @param {!proto.dapr.proto.runtime.v1.MetadataHTTPEndpoint=} opt_value
 * @param {number=} opt_index
 * @return {!proto.dapr.proto.runtime.v1.MetadataHTTPEndpoint}
 */
proto.dapr.proto.runtime.v1.GetMetadataResponse.prototype.addHttpEndpoints = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 6, opt_value, proto.dapr.proto.runtime.v1.MetadataHTTPEndpoint, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.dapr.proto.runtime.v1.GetMetadataResponse} returns this
 */
proto.dapr.proto.runtime.v1.GetMetadataResponse.prototype.clearHttpEndpointsList = function() {
  return this.setHttpEndpointsList([]);
};


/**
 * optional AppConnectionProperties app_connection_properties = 7;
 * @return {?proto.dapr.proto.runtime.v1.AppConnectionProperties}
 */
proto.dapr.proto.runtime.v1.GetMetadataResponse.prototype.getAppConnectionProperties = function() {
  return /** @type{?proto.dapr.proto.runtime.v1.AppConnectionProperties} */ (
    jspb.Message.getWrapperField(this, proto.dapr.proto.runtime.v1.AppConnectionProperties, 7));
};


/**
 * @param {?proto.dapr.proto.runtime.v1.AppConnectionProperties|undefined} value
 * @return {!proto.dapr.proto.runtime.v1.GetMetadataResponse} returns this
*/
proto.dapr.proto.runtime.v1.GetMetadataResponse.prototype.setAppConnectionProperties = function(value) {
  return jspb.Message.setWrapperField(this, 7, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.dapr.proto.runtime.v1.GetMetadataResponse} returns this
 */
proto.dapr.proto.runtime.v1.GetMetadataResponse.prototype.clearAppConnectionProperties = function() {
  return this.setAppConnectionProperties(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.dapr.proto.runtime.v1.GetMetadataResponse.prototype.hasAppConnectionProperties = function() {
  return jspb.Message.getField(this, 7) != null;
};


/**
 * optional string runtime_version = 8;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.GetMetadataResponse.prototype.getRuntimeVersion = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 8, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.GetMetadataResponse} returns this
 */
proto.dapr.proto.runtime.v1.GetMetadataResponse.prototype.setRuntimeVersion = function(value) {
  return jspb.Message.setProto3StringField(this, 8, value);
};


/**
 * repeated string enabled_features = 9;
 * @return {!Array<string>}
 */
proto.dapr.proto.runtime.v1.GetMetadataResponse.prototype.getEnabledFeaturesList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 9));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.dapr.proto.runtime.v1.GetMetadataResponse} returns this
 */
proto.dapr.proto.runtime.v1.GetMetadataResponse.prototype.setEnabledFeaturesList = function(value) {
  return jspb.Message.setField(this, 9, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.dapr.proto.runtime.v1.GetMetadataResponse} returns this
 */
proto.dapr.proto.runtime.v1.GetMetadataResponse.prototype.addEnabledFeatures = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 9, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.dapr.proto.runtime.v1.GetMetadataResponse} returns this
 */
proto.dapr.proto.runtime.v1.GetMetadataResponse.prototype.clearEnabledFeaturesList = function() {
  return this.setEnabledFeaturesList([]);
};


/**
 * optional ActorRuntime actor_runtime = 10;
 * @return {?proto.dapr.proto.runtime.v1.ActorRuntime}
 */
proto.dapr.proto.runtime.v1.GetMetadataResponse.prototype.getActorRuntime = function() {
  return /** @type{?proto.dapr.proto.runtime.v1.ActorRuntime} */ (
    jspb.Message.getWrapperField(this, proto.dapr.proto.runtime.v1.ActorRuntime, 10));
};


/**
 * @param {?proto.dapr.proto.runtime.v1.ActorRuntime|undefined} value
 * @return {!proto.dapr.proto.runtime.v1.GetMetadataResponse} returns this
*/
proto.dapr.proto.runtime.v1.GetMetadataResponse.prototype.setActorRuntime = function(value) {
  return jspb.Message.setWrapperField(this, 10, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.dapr.proto.runtime.v1.GetMetadataResponse} returns this
 */
proto.dapr.proto.runtime.v1.GetMetadataResponse.prototype.clearActorRuntime = function() {
  return this.setActorRuntime(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.dapr.proto.runtime.v1.GetMetadataResponse.prototype.hasActorRuntime = function() {
  return jspb.Message.getField(this, 10) != null;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.dapr.proto.runtime.v1.ActorRuntime.repeatedFields_ = [2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.ActorRuntime.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.ActorRuntime.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.ActorRuntime} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.ActorRuntime.toObject = function(includeInstance, msg) {
  var f, obj = {
    runtimeStatus: jspb.Message.getFieldWithDefault(msg, 1, 0),
    activeActorsList: jspb.Message.toObjectList(msg.getActiveActorsList(),
    proto.dapr.proto.runtime.v1.ActiveActorsCount.toObject, includeInstance),
    hostReady: jspb.Message.getBooleanFieldWithDefault(msg, 3, false),
    placement: jspb.Message.getFieldWithDefault(msg, 4, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.ActorRuntime}
 */
proto.dapr.proto.runtime.v1.ActorRuntime.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.ActorRuntime;
  return proto.dapr.proto.runtime.v1.ActorRuntime.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.ActorRuntime} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.ActorRuntime}
 */
proto.dapr.proto.runtime.v1.ActorRuntime.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.dapr.proto.runtime.v1.ActorRuntime.ActorRuntimeStatus} */ (reader.readEnum());
      msg.setRuntimeStatus(value);
      break;
    case 2:
      var value = new proto.dapr.proto.runtime.v1.ActiveActorsCount;
      reader.readMessage(value,proto.dapr.proto.runtime.v1.ActiveActorsCount.deserializeBinaryFromReader);
      msg.addActiveActors(value);
      break;
    case 3:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setHostReady(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setPlacement(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.ActorRuntime.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.ActorRuntime.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.ActorRuntime} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.ActorRuntime.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getRuntimeStatus();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getActiveActorsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      2,
      f,
      proto.dapr.proto.runtime.v1.ActiveActorsCount.serializeBinaryToWriter
    );
  }
  f = message.getHostReady();
  if (f) {
    writer.writeBool(
      3,
      f
    );
  }
  f = message.getPlacement();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.dapr.proto.runtime.v1.ActorRuntime.ActorRuntimeStatus = {
  INITIALIZING: 0,
  DISABLED: 1,
  RUNNING: 2
};

/**
 * optional ActorRuntimeStatus runtime_status = 1;
 * @return {!proto.dapr.proto.runtime.v1.ActorRuntime.ActorRuntimeStatus}
 */
proto.dapr.proto.runtime.v1.ActorRuntime.prototype.getRuntimeStatus = function() {
  return /** @type {!proto.dapr.proto.runtime.v1.ActorRuntime.ActorRuntimeStatus} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.dapr.proto.runtime.v1.ActorRuntime.ActorRuntimeStatus} value
 * @return {!proto.dapr.proto.runtime.v1.ActorRuntime} returns this
 */
proto.dapr.proto.runtime.v1.ActorRuntime.prototype.setRuntimeStatus = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};


/**
 * repeated ActiveActorsCount active_actors = 2;
 * @return {!Array<!proto.dapr.proto.runtime.v1.ActiveActorsCount>}
 */
proto.dapr.proto.runtime.v1.ActorRuntime.prototype.getActiveActorsList = function() {
  return /** @type{!Array<!proto.dapr.proto.runtime.v1.ActiveActorsCount>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.dapr.proto.runtime.v1.ActiveActorsCount, 2));
};


/**
 * @param {!Array<!proto.dapr.proto.runtime.v1.ActiveActorsCount>} value
 * @return {!proto.dapr.proto.runtime.v1.ActorRuntime} returns this
*/
proto.dapr.proto.runtime.v1.ActorRuntime.prototype.setActiveActorsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 2, value);
};


/**
 * @param {!proto.dapr.proto.runtime.v1.ActiveActorsCount=} opt_value
 * @param {number=} opt_index
 * @return {!proto.dapr.proto.runtime.v1.ActiveActorsCount}
 */
proto.dapr.proto.runtime.v1.ActorRuntime.prototype.addActiveActors = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.dapr.proto.runtime.v1.ActiveActorsCount, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.dapr.proto.runtime.v1.ActorRuntime} returns this
 */
proto.dapr.proto.runtime.v1.ActorRuntime.prototype.clearActiveActorsList = function() {
  return this.setActiveActorsList([]);
};


/**
 * optional bool host_ready = 3;
 * @return {boolean}
 */
proto.dapr.proto.runtime.v1.ActorRuntime.prototype.getHostReady = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 3, false));
};


/**
 * @param {boolean} value
 * @return {!proto.dapr.proto.runtime.v1.ActorRuntime} returns this
 */
proto.dapr.proto.runtime.v1.ActorRuntime.prototype.setHostReady = function(value) {
  return jspb.Message.setProto3BooleanField(this, 3, value);
};


/**
 * optional string placement = 4;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.ActorRuntime.prototype.getPlacement = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.ActorRuntime} returns this
 */
proto.dapr.proto.runtime.v1.ActorRuntime.prototype.setPlacement = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.ActiveActorsCount.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.ActiveActorsCount.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.ActiveActorsCount} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.ActiveActorsCount.toObject = function(includeInstance, msg) {
  var f, obj = {
    type: jspb.Message.getFieldWithDefault(msg, 1, ""),
    count: jspb.Message.getFieldWithDefault(msg, 2, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.ActiveActorsCount}
 */
proto.dapr.proto.runtime.v1.ActiveActorsCount.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.ActiveActorsCount;
  return proto.dapr.proto.runtime.v1.ActiveActorsCount.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.ActiveActorsCount} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.ActiveActorsCount}
 */
proto.dapr.proto.runtime.v1.ActiveActorsCount.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setType(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setCount(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.ActiveActorsCount.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.ActiveActorsCount.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.ActiveActorsCount} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.ActiveActorsCount.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getType();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getCount();
  if (f !== 0) {
    writer.writeInt32(
      2,
      f
    );
  }
};


/**
 * optional string type = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.ActiveActorsCount.prototype.getType = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.ActiveActorsCount} returns this
 */
proto.dapr.proto.runtime.v1.ActiveActorsCount.prototype.setType = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional int32 count = 2;
 * @return {number}
 */
proto.dapr.proto.runtime.v1.ActiveActorsCount.prototype.getCount = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.dapr.proto.runtime.v1.ActiveActorsCount} returns this
 */
proto.dapr.proto.runtime.v1.ActiveActorsCount.prototype.setCount = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.dapr.proto.runtime.v1.RegisteredComponents.repeatedFields_ = [4];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.RegisteredComponents.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.RegisteredComponents.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.RegisteredComponents} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.RegisteredComponents.toObject = function(includeInstance, msg) {
  var f, obj = {
    name: jspb.Message.getFieldWithDefault(msg, 1, ""),
    type: jspb.Message.getFieldWithDefault(msg, 2, ""),
    version: jspb.Message.getFieldWithDefault(msg, 3, ""),
    capabilitiesList: (f = jspb.Message.getRepeatedField(msg, 4)) == null ? undefined : f
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.RegisteredComponents}
 */
proto.dapr.proto.runtime.v1.RegisteredComponents.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.RegisteredComponents;
  return proto.dapr.proto.runtime.v1.RegisteredComponents.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.RegisteredComponents} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.RegisteredComponents}
 */
proto.dapr.proto.runtime.v1.RegisteredComponents.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setType(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setVersion(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.addCapabilities(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.RegisteredComponents.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.RegisteredComponents.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.RegisteredComponents} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.RegisteredComponents.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getType();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getVersion();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getCapabilitiesList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      4,
      f
    );
  }
};


/**
 * optional string name = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.RegisteredComponents.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.RegisteredComponents} returns this
 */
proto.dapr.proto.runtime.v1.RegisteredComponents.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string type = 2;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.RegisteredComponents.prototype.getType = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.RegisteredComponents} returns this
 */
proto.dapr.proto.runtime.v1.RegisteredComponents.prototype.setType = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string version = 3;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.RegisteredComponents.prototype.getVersion = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.RegisteredComponents} returns this
 */
proto.dapr.proto.runtime.v1.RegisteredComponents.prototype.setVersion = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * repeated string capabilities = 4;
 * @return {!Array<string>}
 */
proto.dapr.proto.runtime.v1.RegisteredComponents.prototype.getCapabilitiesList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 4));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.dapr.proto.runtime.v1.RegisteredComponents} returns this
 */
proto.dapr.proto.runtime.v1.RegisteredComponents.prototype.setCapabilitiesList = function(value) {
  return jspb.Message.setField(this, 4, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.dapr.proto.runtime.v1.RegisteredComponents} returns this
 */
proto.dapr.proto.runtime.v1.RegisteredComponents.prototype.addCapabilities = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 4, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.dapr.proto.runtime.v1.RegisteredComponents} returns this
 */
proto.dapr.proto.runtime.v1.RegisteredComponents.prototype.clearCapabilitiesList = function() {
  return this.setCapabilitiesList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.MetadataHTTPEndpoint.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.MetadataHTTPEndpoint.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.MetadataHTTPEndpoint} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.MetadataHTTPEndpoint.toObject = function(includeInstance, msg) {
  var f, obj = {
    name: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.MetadataHTTPEndpoint}
 */
proto.dapr.proto.runtime.v1.MetadataHTTPEndpoint.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.MetadataHTTPEndpoint;
  return proto.dapr.proto.runtime.v1.MetadataHTTPEndpoint.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.MetadataHTTPEndpoint} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.MetadataHTTPEndpoint}
 */
proto.dapr.proto.runtime.v1.MetadataHTTPEndpoint.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.MetadataHTTPEndpoint.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.MetadataHTTPEndpoint.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.MetadataHTTPEndpoint} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.MetadataHTTPEndpoint.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string name = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.MetadataHTTPEndpoint.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.MetadataHTTPEndpoint} returns this
 */
proto.dapr.proto.runtime.v1.MetadataHTTPEndpoint.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.AppConnectionProperties.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.AppConnectionProperties.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.AppConnectionProperties} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.AppConnectionProperties.toObject = function(includeInstance, msg) {
  var f, obj = {
    port: jspb.Message.getFieldWithDefault(msg, 1, 0),
    protocol: jspb.Message.getFieldWithDefault(msg, 2, ""),
    channelAddress: jspb.Message.getFieldWithDefault(msg, 3, ""),
    maxConcurrency: jspb.Message.getFieldWithDefault(msg, 4, 0),
    health: (f = msg.getHealth()) && proto.dapr.proto.runtime.v1.AppConnectionHealthProperties.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.AppConnectionProperties}
 */
proto.dapr.proto.runtime.v1.AppConnectionProperties.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.AppConnectionProperties;
  return proto.dapr.proto.runtime.v1.AppConnectionProperties.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.AppConnectionProperties} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.AppConnectionProperties}
 */
proto.dapr.proto.runtime.v1.AppConnectionProperties.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setPort(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setProtocol(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setChannelAddress(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setMaxConcurrency(value);
      break;
    case 5:
      var value = new proto.dapr.proto.runtime.v1.AppConnectionHealthProperties;
      reader.readMessage(value,proto.dapr.proto.runtime.v1.AppConnectionHealthProperties.deserializeBinaryFromReader);
      msg.setHealth(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.AppConnectionProperties.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.AppConnectionProperties.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.AppConnectionProperties} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.AppConnectionProperties.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPort();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
  f = message.getProtocol();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getChannelAddress();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getMaxConcurrency();
  if (f !== 0) {
    writer.writeInt32(
      4,
      f
    );
  }
  f = message.getHealth();
  if (f != null) {
    writer.writeMessage(
      5,
      f,
      proto.dapr.proto.runtime.v1.AppConnectionHealthProperties.serializeBinaryToWriter
    );
  }
};


/**
 * optional int32 port = 1;
 * @return {number}
 */
proto.dapr.proto.runtime.v1.AppConnectionProperties.prototype.getPort = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.dapr.proto.runtime.v1.AppConnectionProperties} returns this
 */
proto.dapr.proto.runtime.v1.AppConnectionProperties.prototype.setPort = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional string protocol = 2;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.AppConnectionProperties.prototype.getProtocol = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.AppConnectionProperties} returns this
 */
proto.dapr.proto.runtime.v1.AppConnectionProperties.prototype.setProtocol = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string channel_address = 3;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.AppConnectionProperties.prototype.getChannelAddress = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.AppConnectionProperties} returns this
 */
proto.dapr.proto.runtime.v1.AppConnectionProperties.prototype.setChannelAddress = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional int32 max_concurrency = 4;
 * @return {number}
 */
proto.dapr.proto.runtime.v1.AppConnectionProperties.prototype.getMaxConcurrency = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/**
 * @param {number} value
 * @return {!proto.dapr.proto.runtime.v1.AppConnectionProperties} returns this
 */
proto.dapr.proto.runtime.v1.AppConnectionProperties.prototype.setMaxConcurrency = function(value) {
  return jspb.Message.setProto3IntField(this, 4, value);
};


/**
 * optional AppConnectionHealthProperties health = 5;
 * @return {?proto.dapr.proto.runtime.v1.AppConnectionHealthProperties}
 */
proto.dapr.proto.runtime.v1.AppConnectionProperties.prototype.getHealth = function() {
  return /** @type{?proto.dapr.proto.runtime.v1.AppConnectionHealthProperties} */ (
    jspb.Message.getWrapperField(this, proto.dapr.proto.runtime.v1.AppConnectionHealthProperties, 5));
};


/**
 * @param {?proto.dapr.proto.runtime.v1.AppConnectionHealthProperties|undefined} value
 * @return {!proto.dapr.proto.runtime.v1.AppConnectionProperties} returns this
*/
proto.dapr.proto.runtime.v1.AppConnectionProperties.prototype.setHealth = function(value) {
  return jspb.Message.setWrapperField(this, 5, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.dapr.proto.runtime.v1.AppConnectionProperties} returns this
 */
proto.dapr.proto.runtime.v1.AppConnectionProperties.prototype.clearHealth = function() {
  return this.setHealth(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.dapr.proto.runtime.v1.AppConnectionProperties.prototype.hasHealth = function() {
  return jspb.Message.getField(this, 5) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.AppConnectionHealthProperties.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.AppConnectionHealthProperties.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.AppConnectionHealthProperties} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.AppConnectionHealthProperties.toObject = function(includeInstance, msg) {
  var f, obj = {
    healthCheckPath: jspb.Message.getFieldWithDefault(msg, 1, ""),
    healthProbeInterval: jspb.Message.getFieldWithDefault(msg, 2, ""),
    healthProbeTimeout: jspb.Message.getFieldWithDefault(msg, 3, ""),
    healthThreshold: jspb.Message.getFieldWithDefault(msg, 4, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.AppConnectionHealthProperties}
 */
proto.dapr.proto.runtime.v1.AppConnectionHealthProperties.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.AppConnectionHealthProperties;
  return proto.dapr.proto.runtime.v1.AppConnectionHealthProperties.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.AppConnectionHealthProperties} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.AppConnectionHealthProperties}
 */
proto.dapr.proto.runtime.v1.AppConnectionHealthProperties.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setHealthCheckPath(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setHealthProbeInterval(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setHealthProbeTimeout(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setHealthThreshold(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.AppConnectionHealthProperties.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.AppConnectionHealthProperties.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.AppConnectionHealthProperties} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.AppConnectionHealthProperties.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getHealthCheckPath();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getHealthProbeInterval();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getHealthProbeTimeout();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getHealthThreshold();
  if (f !== 0) {
    writer.writeInt32(
      4,
      f
    );
  }
};


/**
 * optional string health_check_path = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.AppConnectionHealthProperties.prototype.getHealthCheckPath = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.AppConnectionHealthProperties} returns this
 */
proto.dapr.proto.runtime.v1.AppConnectionHealthProperties.prototype.setHealthCheckPath = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string health_probe_interval = 2;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.AppConnectionHealthProperties.prototype.getHealthProbeInterval = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.AppConnectionHealthProperties} returns this
 */
proto.dapr.proto.runtime.v1.AppConnectionHealthProperties.prototype.setHealthProbeInterval = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string health_probe_timeout = 3;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.AppConnectionHealthProperties.prototype.getHealthProbeTimeout = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.AppConnectionHealthProperties} returns this
 */
proto.dapr.proto.runtime.v1.AppConnectionHealthProperties.prototype.setHealthProbeTimeout = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional int32 health_threshold = 4;
 * @return {number}
 */
proto.dapr.proto.runtime.v1.AppConnectionHealthProperties.prototype.getHealthThreshold = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/**
 * @param {number} value
 * @return {!proto.dapr.proto.runtime.v1.AppConnectionHealthProperties} returns this
 */
proto.dapr.proto.runtime.v1.AppConnectionHealthProperties.prototype.setHealthThreshold = function(value) {
  return jspb.Message.setProto3IntField(this, 4, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.PubsubSubscription.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.PubsubSubscription.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.PubsubSubscription} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.PubsubSubscription.toObject = function(includeInstance, msg) {
  var f, obj = {
    pubsubName: jspb.Message.getFieldWithDefault(msg, 1, ""),
    topic: jspb.Message.getFieldWithDefault(msg, 2, ""),
    metadataMap: (f = msg.getMetadataMap()) ? f.toObject(includeInstance, undefined) : [],
    rules: (f = msg.getRules()) && proto.dapr.proto.runtime.v1.PubsubSubscriptionRules.toObject(includeInstance, f),
    deadLetterTopic: jspb.Message.getFieldWithDefault(msg, 5, ""),
    type: jspb.Message.getFieldWithDefault(msg, 6, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.PubsubSubscription}
 */
proto.dapr.proto.runtime.v1.PubsubSubscription.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.PubsubSubscription;
  return proto.dapr.proto.runtime.v1.PubsubSubscription.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.PubsubSubscription} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.PubsubSubscription}
 */
proto.dapr.proto.runtime.v1.PubsubSubscription.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setPubsubName(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setTopic(value);
      break;
    case 3:
      var value = msg.getMetadataMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readString, null, "", "");
         });
      break;
    case 4:
      var value = new proto.dapr.proto.runtime.v1.PubsubSubscriptionRules;
      reader.readMessage(value,proto.dapr.proto.runtime.v1.PubsubSubscriptionRules.deserializeBinaryFromReader);
      msg.setRules(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setDeadLetterTopic(value);
      break;
    case 6:
      var value = /** @type {!proto.dapr.proto.runtime.v1.PubsubSubscriptionType} */ (reader.readEnum());
      msg.setType(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.PubsubSubscription.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.PubsubSubscription.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.PubsubSubscription} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.PubsubSubscription.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPubsubName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getTopic();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getMetadataMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(3, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeString);
  }
  f = message.getRules();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.dapr.proto.runtime.v1.PubsubSubscriptionRules.serializeBinaryToWriter
    );
  }
  f = message.getDeadLetterTopic();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getType();
  if (f !== 0.0) {
    writer.writeEnum(
      6,
      f
    );
  }
};


/**
 * optional string pubsub_name = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.PubsubSubscription.prototype.getPubsubName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.PubsubSubscription} returns this
 */
proto.dapr.proto.runtime.v1.PubsubSubscription.prototype.setPubsubName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string topic = 2;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.PubsubSubscription.prototype.getTopic = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.PubsubSubscription} returns this
 */
proto.dapr.proto.runtime.v1.PubsubSubscription.prototype.setTopic = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * map<string, string> metadata = 3;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,string>}
 */
proto.dapr.proto.runtime.v1.PubsubSubscription.prototype.getMetadataMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,string>} */ (
      jspb.Message.getMapField(this, 3, opt_noLazyCreate,
      null));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.dapr.proto.runtime.v1.PubsubSubscription} returns this
 */
proto.dapr.proto.runtime.v1.PubsubSubscription.prototype.clearMetadataMap = function() {
  this.getMetadataMap().clear();
  return this;
};


/**
 * optional PubsubSubscriptionRules rules = 4;
 * @return {?proto.dapr.proto.runtime.v1.PubsubSubscriptionRules}
 */
proto.dapr.proto.runtime.v1.PubsubSubscription.prototype.getRules = function() {
  return /** @type{?proto.dapr.proto.runtime.v1.PubsubSubscriptionRules} */ (
    jspb.Message.getWrapperField(this, proto.dapr.proto.runtime.v1.PubsubSubscriptionRules, 4));
};


/**
 * @param {?proto.dapr.proto.runtime.v1.PubsubSubscriptionRules|undefined} value
 * @return {!proto.dapr.proto.runtime.v1.PubsubSubscription} returns this
*/
proto.dapr.proto.runtime.v1.PubsubSubscription.prototype.setRules = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.dapr.proto.runtime.v1.PubsubSubscription} returns this
 */
proto.dapr.proto.runtime.v1.PubsubSubscription.prototype.clearRules = function() {
  return this.setRules(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.dapr.proto.runtime.v1.PubsubSubscription.prototype.hasRules = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional string dead_letter_topic = 5;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.PubsubSubscription.prototype.getDeadLetterTopic = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.PubsubSubscription} returns this
 */
proto.dapr.proto.runtime.v1.PubsubSubscription.prototype.setDeadLetterTopic = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};


/**
 * optional PubsubSubscriptionType type = 6;
 * @return {!proto.dapr.proto.runtime.v1.PubsubSubscriptionType}
 */
proto.dapr.proto.runtime.v1.PubsubSubscription.prototype.getType = function() {
  return /** @type {!proto.dapr.proto.runtime.v1.PubsubSubscriptionType} */ (jspb.Message.getFieldWithDefault(this, 6, 0));
};


/**
 * @param {!proto.dapr.proto.runtime.v1.PubsubSubscriptionType} value
 * @return {!proto.dapr.proto.runtime.v1.PubsubSubscription} returns this
 */
proto.dapr.proto.runtime.v1.PubsubSubscription.prototype.setType = function(value) {
  return jspb.Message.setProto3EnumField(this, 6, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.dapr.proto.runtime.v1.PubsubSubscriptionRules.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.PubsubSubscriptionRules.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.PubsubSubscriptionRules.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.PubsubSubscriptionRules} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.PubsubSubscriptionRules.toObject = function(includeInstance, msg) {
  var f, obj = {
    rulesList: jspb.Message.toObjectList(msg.getRulesList(),
    proto.dapr.proto.runtime.v1.PubsubSubscriptionRule.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.PubsubSubscriptionRules}
 */
proto.dapr.proto.runtime.v1.PubsubSubscriptionRules.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.PubsubSubscriptionRules;
  return proto.dapr.proto.runtime.v1.PubsubSubscriptionRules.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.PubsubSubscriptionRules} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.PubsubSubscriptionRules}
 */
proto.dapr.proto.runtime.v1.PubsubSubscriptionRules.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.dapr.proto.runtime.v1.PubsubSubscriptionRule;
      reader.readMessage(value,proto.dapr.proto.runtime.v1.PubsubSubscriptionRule.deserializeBinaryFromReader);
      msg.addRules(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.PubsubSubscriptionRules.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.PubsubSubscriptionRules.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.PubsubSubscriptionRules} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.PubsubSubscriptionRules.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getRulesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.dapr.proto.runtime.v1.PubsubSubscriptionRule.serializeBinaryToWriter
    );
  }
};


/**
 * repeated PubsubSubscriptionRule rules = 1;
 * @return {!Array<!proto.dapr.proto.runtime.v1.PubsubSubscriptionRule>}
 */
proto.dapr.proto.runtime.v1.PubsubSubscriptionRules.prototype.getRulesList = function() {
  return /** @type{!Array<!proto.dapr.proto.runtime.v1.PubsubSubscriptionRule>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.dapr.proto.runtime.v1.PubsubSubscriptionRule, 1));
};


/**
 * @param {!Array<!proto.dapr.proto.runtime.v1.PubsubSubscriptionRule>} value
 * @return {!proto.dapr.proto.runtime.v1.PubsubSubscriptionRules} returns this
*/
proto.dapr.proto.runtime.v1.PubsubSubscriptionRules.prototype.setRulesList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.dapr.proto.runtime.v1.PubsubSubscriptionRule=} opt_value
 * @param {number=} opt_index
 * @return {!proto.dapr.proto.runtime.v1.PubsubSubscriptionRule}
 */
proto.dapr.proto.runtime.v1.PubsubSubscriptionRules.prototype.addRules = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.dapr.proto.runtime.v1.PubsubSubscriptionRule, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.dapr.proto.runtime.v1.PubsubSubscriptionRules} returns this
 */
proto.dapr.proto.runtime.v1.PubsubSubscriptionRules.prototype.clearRulesList = function() {
  return this.setRulesList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.PubsubSubscriptionRule.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.PubsubSubscriptionRule.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.PubsubSubscriptionRule} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.PubsubSubscriptionRule.toObject = function(includeInstance, msg) {
  var f, obj = {
    match: jspb.Message.getFieldWithDefault(msg, 1, ""),
    path: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.PubsubSubscriptionRule}
 */
proto.dapr.proto.runtime.v1.PubsubSubscriptionRule.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.PubsubSubscriptionRule;
  return proto.dapr.proto.runtime.v1.PubsubSubscriptionRule.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.PubsubSubscriptionRule} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.PubsubSubscriptionRule}
 */
proto.dapr.proto.runtime.v1.PubsubSubscriptionRule.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setMatch(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setPath(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.PubsubSubscriptionRule.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.PubsubSubscriptionRule.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.PubsubSubscriptionRule} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.PubsubSubscriptionRule.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getMatch();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getPath();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional string match = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.PubsubSubscriptionRule.prototype.getMatch = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.PubsubSubscriptionRule} returns this
 */
proto.dapr.proto.runtime.v1.PubsubSubscriptionRule.prototype.setMatch = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string path = 2;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.PubsubSubscriptionRule.prototype.getPath = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.PubsubSubscriptionRule} returns this
 */
proto.dapr.proto.runtime.v1.PubsubSubscriptionRule.prototype.setPath = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.SetMetadataRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.SetMetadataRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.SetMetadataRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SetMetadataRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    key: jspb.Message.getFieldWithDefault(msg, 1, ""),
    value: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.SetMetadataRequest}
 */
proto.dapr.proto.runtime.v1.SetMetadataRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.SetMetadataRequest;
  return proto.dapr.proto.runtime.v1.SetMetadataRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.SetMetadataRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.SetMetadataRequest}
 */
proto.dapr.proto.runtime.v1.SetMetadataRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setKey(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setValue(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SetMetadataRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.SetMetadataRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.SetMetadataRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SetMetadataRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getKey();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getValue();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional string key = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SetMetadataRequest.prototype.getKey = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.SetMetadataRequest} returns this
 */
proto.dapr.proto.runtime.v1.SetMetadataRequest.prototype.setKey = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string value = 2;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SetMetadataRequest.prototype.getValue = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.SetMetadataRequest} returns this
 */
proto.dapr.proto.runtime.v1.SetMetadataRequest.prototype.setValue = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.dapr.proto.runtime.v1.GetConfigurationRequest.repeatedFields_ = [2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.GetConfigurationRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.GetConfigurationRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.GetConfigurationRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.GetConfigurationRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    storeName: jspb.Message.getFieldWithDefault(msg, 1, ""),
    keysList: (f = jspb.Message.getRepeatedField(msg, 2)) == null ? undefined : f,
    metadataMap: (f = msg.getMetadataMap()) ? f.toObject(includeInstance, undefined) : []
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.GetConfigurationRequest}
 */
proto.dapr.proto.runtime.v1.GetConfigurationRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.GetConfigurationRequest;
  return proto.dapr.proto.runtime.v1.GetConfigurationRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.GetConfigurationRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.GetConfigurationRequest}
 */
proto.dapr.proto.runtime.v1.GetConfigurationRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setStoreName(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.addKeys(value);
      break;
    case 3:
      var value = msg.getMetadataMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readString, null, "", "");
         });
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.GetConfigurationRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.GetConfigurationRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.GetConfigurationRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.GetConfigurationRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getStoreName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getKeysList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      2,
      f
    );
  }
  f = message.getMetadataMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(3, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeString);
  }
};


/**
 * optional string store_name = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.GetConfigurationRequest.prototype.getStoreName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.GetConfigurationRequest} returns this
 */
proto.dapr.proto.runtime.v1.GetConfigurationRequest.prototype.setStoreName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * repeated string keys = 2;
 * @return {!Array<string>}
 */
proto.dapr.proto.runtime.v1.GetConfigurationRequest.prototype.getKeysList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 2));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.dapr.proto.runtime.v1.GetConfigurationRequest} returns this
 */
proto.dapr.proto.runtime.v1.GetConfigurationRequest.prototype.setKeysList = function(value) {
  return jspb.Message.setField(this, 2, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.dapr.proto.runtime.v1.GetConfigurationRequest} returns this
 */
proto.dapr.proto.runtime.v1.GetConfigurationRequest.prototype.addKeys = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 2, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.dapr.proto.runtime.v1.GetConfigurationRequest} returns this
 */
proto.dapr.proto.runtime.v1.GetConfigurationRequest.prototype.clearKeysList = function() {
  return this.setKeysList([]);
};


/**
 * map<string, string> metadata = 3;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,string>}
 */
proto.dapr.proto.runtime.v1.GetConfigurationRequest.prototype.getMetadataMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,string>} */ (
      jspb.Message.getMapField(this, 3, opt_noLazyCreate,
      null));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.dapr.proto.runtime.v1.GetConfigurationRequest} returns this
 */
proto.dapr.proto.runtime.v1.GetConfigurationRequest.prototype.clearMetadataMap = function() {
  this.getMetadataMap().clear();
  return this;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.GetConfigurationResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.GetConfigurationResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.GetConfigurationResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.GetConfigurationResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    itemsMap: (f = msg.getItemsMap()) ? f.toObject(includeInstance, proto.dapr.proto.common.v1.ConfigurationItem.toObject) : []
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.GetConfigurationResponse}
 */
proto.dapr.proto.runtime.v1.GetConfigurationResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.GetConfigurationResponse;
  return proto.dapr.proto.runtime.v1.GetConfigurationResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.GetConfigurationResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.GetConfigurationResponse}
 */
proto.dapr.proto.runtime.v1.GetConfigurationResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = msg.getItemsMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readMessage, proto.dapr.proto.common.v1.ConfigurationItem.deserializeBinaryFromReader, "", new proto.dapr.proto.common.v1.ConfigurationItem());
         });
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.GetConfigurationResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.GetConfigurationResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.GetConfigurationResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.GetConfigurationResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getItemsMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(1, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeMessage, proto.dapr.proto.common.v1.ConfigurationItem.serializeBinaryToWriter);
  }
};


/**
 * map<string, dapr.proto.common.v1.ConfigurationItem> items = 1;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,!proto.dapr.proto.common.v1.ConfigurationItem>}
 */
proto.dapr.proto.runtime.v1.GetConfigurationResponse.prototype.getItemsMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,!proto.dapr.proto.common.v1.ConfigurationItem>} */ (
      jspb.Message.getMapField(this, 1, opt_noLazyCreate,
      proto.dapr.proto.common.v1.ConfigurationItem));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.dapr.proto.runtime.v1.GetConfigurationResponse} returns this
 */
proto.dapr.proto.runtime.v1.GetConfigurationResponse.prototype.clearItemsMap = function() {
  this.getItemsMap().clear();
  return this;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.dapr.proto.runtime.v1.SubscribeConfigurationRequest.repeatedFields_ = [2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.SubscribeConfigurationRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.SubscribeConfigurationRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.SubscribeConfigurationRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SubscribeConfigurationRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    storeName: jspb.Message.getFieldWithDefault(msg, 1, ""),
    keysList: (f = jspb.Message.getRepeatedField(msg, 2)) == null ? undefined : f,
    metadataMap: (f = msg.getMetadataMap()) ? f.toObject(includeInstance, undefined) : []
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.SubscribeConfigurationRequest}
 */
proto.dapr.proto.runtime.v1.SubscribeConfigurationRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.SubscribeConfigurationRequest;
  return proto.dapr.proto.runtime.v1.SubscribeConfigurationRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.SubscribeConfigurationRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.SubscribeConfigurationRequest}
 */
proto.dapr.proto.runtime.v1.SubscribeConfigurationRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setStoreName(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.addKeys(value);
      break;
    case 3:
      var value = msg.getMetadataMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readString, null, "", "");
         });
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubscribeConfigurationRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.SubscribeConfigurationRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.SubscribeConfigurationRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SubscribeConfigurationRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getStoreName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getKeysList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      2,
      f
    );
  }
  f = message.getMetadataMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(3, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeString);
  }
};


/**
 * optional string store_name = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubscribeConfigurationRequest.prototype.getStoreName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.SubscribeConfigurationRequest} returns this
 */
proto.dapr.proto.runtime.v1.SubscribeConfigurationRequest.prototype.setStoreName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * repeated string keys = 2;
 * @return {!Array<string>}
 */
proto.dapr.proto.runtime.v1.SubscribeConfigurationRequest.prototype.getKeysList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 2));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.dapr.proto.runtime.v1.SubscribeConfigurationRequest} returns this
 */
proto.dapr.proto.runtime.v1.SubscribeConfigurationRequest.prototype.setKeysList = function(value) {
  return jspb.Message.setField(this, 2, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.dapr.proto.runtime.v1.SubscribeConfigurationRequest} returns this
 */
proto.dapr.proto.runtime.v1.SubscribeConfigurationRequest.prototype.addKeys = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 2, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.dapr.proto.runtime.v1.SubscribeConfigurationRequest} returns this
 */
proto.dapr.proto.runtime.v1.SubscribeConfigurationRequest.prototype.clearKeysList = function() {
  return this.setKeysList([]);
};


/**
 * map<string, string> metadata = 3;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,string>}
 */
proto.dapr.proto.runtime.v1.SubscribeConfigurationRequest.prototype.getMetadataMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,string>} */ (
      jspb.Message.getMapField(this, 3, opt_noLazyCreate,
      null));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.dapr.proto.runtime.v1.SubscribeConfigurationRequest} returns this
 */
proto.dapr.proto.runtime.v1.SubscribeConfigurationRequest.prototype.clearMetadataMap = function() {
  this.getMetadataMap().clear();
  return this;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.UnsubscribeConfigurationRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.UnsubscribeConfigurationRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.UnsubscribeConfigurationRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.UnsubscribeConfigurationRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    storeName: jspb.Message.getFieldWithDefault(msg, 1, ""),
    id: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.UnsubscribeConfigurationRequest}
 */
proto.dapr.proto.runtime.v1.UnsubscribeConfigurationRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.UnsubscribeConfigurationRequest;
  return proto.dapr.proto.runtime.v1.UnsubscribeConfigurationRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.UnsubscribeConfigurationRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.UnsubscribeConfigurationRequest}
 */
proto.dapr.proto.runtime.v1.UnsubscribeConfigurationRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setStoreName(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.UnsubscribeConfigurationRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.UnsubscribeConfigurationRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.UnsubscribeConfigurationRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.UnsubscribeConfigurationRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getStoreName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional string store_name = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.UnsubscribeConfigurationRequest.prototype.getStoreName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.UnsubscribeConfigurationRequest} returns this
 */
proto.dapr.proto.runtime.v1.UnsubscribeConfigurationRequest.prototype.setStoreName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string id = 2;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.UnsubscribeConfigurationRequest.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.UnsubscribeConfigurationRequest} returns this
 */
proto.dapr.proto.runtime.v1.UnsubscribeConfigurationRequest.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.SubscribeConfigurationResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.SubscribeConfigurationResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.SubscribeConfigurationResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SubscribeConfigurationResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, ""),
    itemsMap: (f = msg.getItemsMap()) ? f.toObject(includeInstance, proto.dapr.proto.common.v1.ConfigurationItem.toObject) : []
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.SubscribeConfigurationResponse}
 */
proto.dapr.proto.runtime.v1.SubscribeConfigurationResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.SubscribeConfigurationResponse;
  return proto.dapr.proto.runtime.v1.SubscribeConfigurationResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.SubscribeConfigurationResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.SubscribeConfigurationResponse}
 */
proto.dapr.proto.runtime.v1.SubscribeConfigurationResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    case 2:
      var value = msg.getItemsMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readMessage, proto.dapr.proto.common.v1.ConfigurationItem.deserializeBinaryFromReader, "", new proto.dapr.proto.common.v1.ConfigurationItem());
         });
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubscribeConfigurationResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.SubscribeConfigurationResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.SubscribeConfigurationResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SubscribeConfigurationResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getItemsMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(2, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeMessage, proto.dapr.proto.common.v1.ConfigurationItem.serializeBinaryToWriter);
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubscribeConfigurationResponse.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.SubscribeConfigurationResponse} returns this
 */
proto.dapr.proto.runtime.v1.SubscribeConfigurationResponse.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * map<string, dapr.proto.common.v1.ConfigurationItem> items = 2;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,!proto.dapr.proto.common.v1.ConfigurationItem>}
 */
proto.dapr.proto.runtime.v1.SubscribeConfigurationResponse.prototype.getItemsMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,!proto.dapr.proto.common.v1.ConfigurationItem>} */ (
      jspb.Message.getMapField(this, 2, opt_noLazyCreate,
      proto.dapr.proto.common.v1.ConfigurationItem));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.dapr.proto.runtime.v1.SubscribeConfigurationResponse} returns this
 */
proto.dapr.proto.runtime.v1.SubscribeConfigurationResponse.prototype.clearItemsMap = function() {
  this.getItemsMap().clear();
  return this;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.UnsubscribeConfigurationResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.UnsubscribeConfigurationResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.UnsubscribeConfigurationResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.UnsubscribeConfigurationResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    ok: jspb.Message.getBooleanFieldWithDefault(msg, 1, false),
    message: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.UnsubscribeConfigurationResponse}
 */
proto.dapr.proto.runtime.v1.UnsubscribeConfigurationResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.UnsubscribeConfigurationResponse;
  return proto.dapr.proto.runtime.v1.UnsubscribeConfigurationResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.UnsubscribeConfigurationResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.UnsubscribeConfigurationResponse}
 */
proto.dapr.proto.runtime.v1.UnsubscribeConfigurationResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setOk(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setMessage(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.UnsubscribeConfigurationResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.UnsubscribeConfigurationResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.UnsubscribeConfigurationResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.UnsubscribeConfigurationResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getOk();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
  f = message.getMessage();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional bool ok = 1;
 * @return {boolean}
 */
proto.dapr.proto.runtime.v1.UnsubscribeConfigurationResponse.prototype.getOk = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.dapr.proto.runtime.v1.UnsubscribeConfigurationResponse} returns this
 */
proto.dapr.proto.runtime.v1.UnsubscribeConfigurationResponse.prototype.setOk = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};


/**
 * optional string message = 2;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.UnsubscribeConfigurationResponse.prototype.getMessage = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.UnsubscribeConfigurationResponse} returns this
 */
proto.dapr.proto.runtime.v1.UnsubscribeConfigurationResponse.prototype.setMessage = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.TryLockRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.TryLockRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.TryLockRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.TryLockRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    storeName: jspb.Message.getFieldWithDefault(msg, 1, ""),
    resourceId: jspb.Message.getFieldWithDefault(msg, 2, ""),
    lockOwner: jspb.Message.getFieldWithDefault(msg, 3, ""),
    expiryInSeconds: jspb.Message.getFieldWithDefault(msg, 4, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.TryLockRequest}
 */
proto.dapr.proto.runtime.v1.TryLockRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.TryLockRequest;
  return proto.dapr.proto.runtime.v1.TryLockRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.TryLockRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.TryLockRequest}
 */
proto.dapr.proto.runtime.v1.TryLockRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setStoreName(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setResourceId(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setLockOwner(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setExpiryInSeconds(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.TryLockRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.TryLockRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.TryLockRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.TryLockRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getStoreName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getResourceId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getLockOwner();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getExpiryInSeconds();
  if (f !== 0) {
    writer.writeInt32(
      4,
      f
    );
  }
};


/**
 * optional string store_name = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.TryLockRequest.prototype.getStoreName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.TryLockRequest} returns this
 */
proto.dapr.proto.runtime.v1.TryLockRequest.prototype.setStoreName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string resource_id = 2;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.TryLockRequest.prototype.getResourceId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.TryLockRequest} returns this
 */
proto.dapr.proto.runtime.v1.TryLockRequest.prototype.setResourceId = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string lock_owner = 3;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.TryLockRequest.prototype.getLockOwner = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.TryLockRequest} returns this
 */
proto.dapr.proto.runtime.v1.TryLockRequest.prototype.setLockOwner = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional int32 expiry_in_seconds = 4;
 * @return {number}
 */
proto.dapr.proto.runtime.v1.TryLockRequest.prototype.getExpiryInSeconds = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/**
 * @param {number} value
 * @return {!proto.dapr.proto.runtime.v1.TryLockRequest} returns this
 */
proto.dapr.proto.runtime.v1.TryLockRequest.prototype.setExpiryInSeconds = function(value) {
  return jspb.Message.setProto3IntField(this, 4, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.TryLockResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.TryLockResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.TryLockResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.TryLockResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    success: jspb.Message.getBooleanFieldWithDefault(msg, 1, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.TryLockResponse}
 */
proto.dapr.proto.runtime.v1.TryLockResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.TryLockResponse;
  return proto.dapr.proto.runtime.v1.TryLockResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.TryLockResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.TryLockResponse}
 */
proto.dapr.proto.runtime.v1.TryLockResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setSuccess(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.TryLockResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.TryLockResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.TryLockResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.TryLockResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSuccess();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
};


/**
 * optional bool success = 1;
 * @return {boolean}
 */
proto.dapr.proto.runtime.v1.TryLockResponse.prototype.getSuccess = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.dapr.proto.runtime.v1.TryLockResponse} returns this
 */
proto.dapr.proto.runtime.v1.TryLockResponse.prototype.setSuccess = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.UnlockRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.UnlockRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.UnlockRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.UnlockRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    storeName: jspb.Message.getFieldWithDefault(msg, 1, ""),
    resourceId: jspb.Message.getFieldWithDefault(msg, 2, ""),
    lockOwner: jspb.Message.getFieldWithDefault(msg, 3, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.UnlockRequest}
 */
proto.dapr.proto.runtime.v1.UnlockRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.UnlockRequest;
  return proto.dapr.proto.runtime.v1.UnlockRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.UnlockRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.UnlockRequest}
 */
proto.dapr.proto.runtime.v1.UnlockRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setStoreName(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setResourceId(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setLockOwner(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.UnlockRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.UnlockRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.UnlockRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.UnlockRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getStoreName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getResourceId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getLockOwner();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
};


/**
 * optional string store_name = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.UnlockRequest.prototype.getStoreName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.UnlockRequest} returns this
 */
proto.dapr.proto.runtime.v1.UnlockRequest.prototype.setStoreName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string resource_id = 2;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.UnlockRequest.prototype.getResourceId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.UnlockRequest} returns this
 */
proto.dapr.proto.runtime.v1.UnlockRequest.prototype.setResourceId = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string lock_owner = 3;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.UnlockRequest.prototype.getLockOwner = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.UnlockRequest} returns this
 */
proto.dapr.proto.runtime.v1.UnlockRequest.prototype.setLockOwner = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.UnlockResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.UnlockResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.UnlockResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.UnlockResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    status: jspb.Message.getFieldWithDefault(msg, 1, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.UnlockResponse}
 */
proto.dapr.proto.runtime.v1.UnlockResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.UnlockResponse;
  return proto.dapr.proto.runtime.v1.UnlockResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.UnlockResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.UnlockResponse}
 */
proto.dapr.proto.runtime.v1.UnlockResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.dapr.proto.runtime.v1.UnlockResponse.Status} */ (reader.readEnum());
      msg.setStatus(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.UnlockResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.UnlockResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.UnlockResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.UnlockResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getStatus();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.dapr.proto.runtime.v1.UnlockResponse.Status = {
  SUCCESS: 0,
  LOCK_DOES_NOT_EXIST: 1,
  LOCK_BELONGS_TO_OTHERS: 2,
  INTERNAL_ERROR: 3
};

/**
 * optional Status status = 1;
 * @return {!proto.dapr.proto.runtime.v1.UnlockResponse.Status}
 */
proto.dapr.proto.runtime.v1.UnlockResponse.prototype.getStatus = function() {
  return /** @type {!proto.dapr.proto.runtime.v1.UnlockResponse.Status} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.dapr.proto.runtime.v1.UnlockResponse.Status} value
 * @return {!proto.dapr.proto.runtime.v1.UnlockResponse} returns this
 */
proto.dapr.proto.runtime.v1.UnlockResponse.prototype.setStatus = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.SubtleGetKeyRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.SubtleGetKeyRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.SubtleGetKeyRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SubtleGetKeyRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    componentName: jspb.Message.getFieldWithDefault(msg, 1, ""),
    name: jspb.Message.getFieldWithDefault(msg, 2, ""),
    format: jspb.Message.getFieldWithDefault(msg, 3, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.SubtleGetKeyRequest}
 */
proto.dapr.proto.runtime.v1.SubtleGetKeyRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.SubtleGetKeyRequest;
  return proto.dapr.proto.runtime.v1.SubtleGetKeyRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.SubtleGetKeyRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.SubtleGetKeyRequest}
 */
proto.dapr.proto.runtime.v1.SubtleGetKeyRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setComponentName(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 3:
      var value = /** @type {!proto.dapr.proto.runtime.v1.SubtleGetKeyRequest.KeyFormat} */ (reader.readEnum());
      msg.setFormat(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubtleGetKeyRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.SubtleGetKeyRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.SubtleGetKeyRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SubtleGetKeyRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getComponentName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getFormat();
  if (f !== 0.0) {
    writer.writeEnum(
      3,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.dapr.proto.runtime.v1.SubtleGetKeyRequest.KeyFormat = {
  PEM: 0,
  JSON: 1
};

/**
 * optional string component_name = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleGetKeyRequest.prototype.getComponentName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleGetKeyRequest} returns this
 */
proto.dapr.proto.runtime.v1.SubtleGetKeyRequest.prototype.setComponentName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string name = 2;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleGetKeyRequest.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleGetKeyRequest} returns this
 */
proto.dapr.proto.runtime.v1.SubtleGetKeyRequest.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional KeyFormat format = 3;
 * @return {!proto.dapr.proto.runtime.v1.SubtleGetKeyRequest.KeyFormat}
 */
proto.dapr.proto.runtime.v1.SubtleGetKeyRequest.prototype.getFormat = function() {
  return /** @type {!proto.dapr.proto.runtime.v1.SubtleGetKeyRequest.KeyFormat} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {!proto.dapr.proto.runtime.v1.SubtleGetKeyRequest.KeyFormat} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleGetKeyRequest} returns this
 */
proto.dapr.proto.runtime.v1.SubtleGetKeyRequest.prototype.setFormat = function(value) {
  return jspb.Message.setProto3EnumField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.SubtleGetKeyResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.SubtleGetKeyResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.SubtleGetKeyResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SubtleGetKeyResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    name: jspb.Message.getFieldWithDefault(msg, 1, ""),
    publicKey: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.SubtleGetKeyResponse}
 */
proto.dapr.proto.runtime.v1.SubtleGetKeyResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.SubtleGetKeyResponse;
  return proto.dapr.proto.runtime.v1.SubtleGetKeyResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.SubtleGetKeyResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.SubtleGetKeyResponse}
 */
proto.dapr.proto.runtime.v1.SubtleGetKeyResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setPublicKey(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubtleGetKeyResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.SubtleGetKeyResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.SubtleGetKeyResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SubtleGetKeyResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getPublicKey();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional string name = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleGetKeyResponse.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleGetKeyResponse} returns this
 */
proto.dapr.proto.runtime.v1.SubtleGetKeyResponse.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string public_key = 2;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleGetKeyResponse.prototype.getPublicKey = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleGetKeyResponse} returns this
 */
proto.dapr.proto.runtime.v1.SubtleGetKeyResponse.prototype.setPublicKey = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.SubtleEncryptRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.SubtleEncryptRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.SubtleEncryptRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SubtleEncryptRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    componentName: jspb.Message.getFieldWithDefault(msg, 1, ""),
    plaintext: msg.getPlaintext_asB64(),
    algorithm: jspb.Message.getFieldWithDefault(msg, 3, ""),
    keyName: jspb.Message.getFieldWithDefault(msg, 4, ""),
    nonce: msg.getNonce_asB64(),
    associatedData: msg.getAssociatedData_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.SubtleEncryptRequest}
 */
proto.dapr.proto.runtime.v1.SubtleEncryptRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.SubtleEncryptRequest;
  return proto.dapr.proto.runtime.v1.SubtleEncryptRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.SubtleEncryptRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.SubtleEncryptRequest}
 */
proto.dapr.proto.runtime.v1.SubtleEncryptRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setComponentName(value);
      break;
    case 2:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setPlaintext(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setAlgorithm(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setKeyName(value);
      break;
    case 5:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setNonce(value);
      break;
    case 6:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setAssociatedData(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubtleEncryptRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.SubtleEncryptRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.SubtleEncryptRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SubtleEncryptRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getComponentName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getPlaintext_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      2,
      f
    );
  }
  f = message.getAlgorithm();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getKeyName();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getNonce_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      5,
      f
    );
  }
  f = message.getAssociatedData_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      6,
      f
    );
  }
};


/**
 * optional string component_name = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleEncryptRequest.prototype.getComponentName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleEncryptRequest} returns this
 */
proto.dapr.proto.runtime.v1.SubtleEncryptRequest.prototype.setComponentName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional bytes plaintext = 2;
 * @return {!(string|Uint8Array)}
 */
proto.dapr.proto.runtime.v1.SubtleEncryptRequest.prototype.getPlaintext = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * optional bytes plaintext = 2;
 * This is a type-conversion wrapper around `getPlaintext()`
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleEncryptRequest.prototype.getPlaintext_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getPlaintext()));
};


/**
 * optional bytes plaintext = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getPlaintext()`
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubtleEncryptRequest.prototype.getPlaintext_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getPlaintext()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleEncryptRequest} returns this
 */
proto.dapr.proto.runtime.v1.SubtleEncryptRequest.prototype.setPlaintext = function(value) {
  return jspb.Message.setProto3BytesField(this, 2, value);
};


/**
 * optional string algorithm = 3;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleEncryptRequest.prototype.getAlgorithm = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleEncryptRequest} returns this
 */
proto.dapr.proto.runtime.v1.SubtleEncryptRequest.prototype.setAlgorithm = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string key_name = 4;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleEncryptRequest.prototype.getKeyName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleEncryptRequest} returns this
 */
proto.dapr.proto.runtime.v1.SubtleEncryptRequest.prototype.setKeyName = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional bytes nonce = 5;
 * @return {!(string|Uint8Array)}
 */
proto.dapr.proto.runtime.v1.SubtleEncryptRequest.prototype.getNonce = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * optional bytes nonce = 5;
 * This is a type-conversion wrapper around `getNonce()`
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleEncryptRequest.prototype.getNonce_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getNonce()));
};


/**
 * optional bytes nonce = 5;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getNonce()`
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubtleEncryptRequest.prototype.getNonce_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getNonce()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleEncryptRequest} returns this
 */
proto.dapr.proto.runtime.v1.SubtleEncryptRequest.prototype.setNonce = function(value) {
  return jspb.Message.setProto3BytesField(this, 5, value);
};


/**
 * optional bytes associated_data = 6;
 * @return {!(string|Uint8Array)}
 */
proto.dapr.proto.runtime.v1.SubtleEncryptRequest.prototype.getAssociatedData = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/**
 * optional bytes associated_data = 6;
 * This is a type-conversion wrapper around `getAssociatedData()`
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleEncryptRequest.prototype.getAssociatedData_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getAssociatedData()));
};


/**
 * optional bytes associated_data = 6;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getAssociatedData()`
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubtleEncryptRequest.prototype.getAssociatedData_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getAssociatedData()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleEncryptRequest} returns this
 */
proto.dapr.proto.runtime.v1.SubtleEncryptRequest.prototype.setAssociatedData = function(value) {
  return jspb.Message.setProto3BytesField(this, 6, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.SubtleEncryptResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.SubtleEncryptResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.SubtleEncryptResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SubtleEncryptResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    ciphertext: msg.getCiphertext_asB64(),
    tag: msg.getTag_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.SubtleEncryptResponse}
 */
proto.dapr.proto.runtime.v1.SubtleEncryptResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.SubtleEncryptResponse;
  return proto.dapr.proto.runtime.v1.SubtleEncryptResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.SubtleEncryptResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.SubtleEncryptResponse}
 */
proto.dapr.proto.runtime.v1.SubtleEncryptResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setCiphertext(value);
      break;
    case 2:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setTag(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubtleEncryptResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.SubtleEncryptResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.SubtleEncryptResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SubtleEncryptResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getCiphertext_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = message.getTag_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      2,
      f
    );
  }
};


/**
 * optional bytes ciphertext = 1;
 * @return {!(string|Uint8Array)}
 */
proto.dapr.proto.runtime.v1.SubtleEncryptResponse.prototype.getCiphertext = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes ciphertext = 1;
 * This is a type-conversion wrapper around `getCiphertext()`
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleEncryptResponse.prototype.getCiphertext_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getCiphertext()));
};


/**
 * optional bytes ciphertext = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getCiphertext()`
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubtleEncryptResponse.prototype.getCiphertext_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getCiphertext()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleEncryptResponse} returns this
 */
proto.dapr.proto.runtime.v1.SubtleEncryptResponse.prototype.setCiphertext = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};


/**
 * optional bytes tag = 2;
 * @return {!(string|Uint8Array)}
 */
proto.dapr.proto.runtime.v1.SubtleEncryptResponse.prototype.getTag = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * optional bytes tag = 2;
 * This is a type-conversion wrapper around `getTag()`
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleEncryptResponse.prototype.getTag_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getTag()));
};


/**
 * optional bytes tag = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getTag()`
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubtleEncryptResponse.prototype.getTag_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getTag()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleEncryptResponse} returns this
 */
proto.dapr.proto.runtime.v1.SubtleEncryptResponse.prototype.setTag = function(value) {
  return jspb.Message.setProto3BytesField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.SubtleDecryptRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.SubtleDecryptRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.SubtleDecryptRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SubtleDecryptRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    componentName: jspb.Message.getFieldWithDefault(msg, 1, ""),
    ciphertext: msg.getCiphertext_asB64(),
    algorithm: jspb.Message.getFieldWithDefault(msg, 3, ""),
    keyName: jspb.Message.getFieldWithDefault(msg, 4, ""),
    nonce: msg.getNonce_asB64(),
    tag: msg.getTag_asB64(),
    associatedData: msg.getAssociatedData_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.SubtleDecryptRequest}
 */
proto.dapr.proto.runtime.v1.SubtleDecryptRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.SubtleDecryptRequest;
  return proto.dapr.proto.runtime.v1.SubtleDecryptRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.SubtleDecryptRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.SubtleDecryptRequest}
 */
proto.dapr.proto.runtime.v1.SubtleDecryptRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setComponentName(value);
      break;
    case 2:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setCiphertext(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setAlgorithm(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setKeyName(value);
      break;
    case 5:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setNonce(value);
      break;
    case 6:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setTag(value);
      break;
    case 7:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setAssociatedData(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubtleDecryptRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.SubtleDecryptRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.SubtleDecryptRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SubtleDecryptRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getComponentName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getCiphertext_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      2,
      f
    );
  }
  f = message.getAlgorithm();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getKeyName();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getNonce_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      5,
      f
    );
  }
  f = message.getTag_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      6,
      f
    );
  }
  f = message.getAssociatedData_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      7,
      f
    );
  }
};


/**
 * optional string component_name = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleDecryptRequest.prototype.getComponentName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleDecryptRequest} returns this
 */
proto.dapr.proto.runtime.v1.SubtleDecryptRequest.prototype.setComponentName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional bytes ciphertext = 2;
 * @return {!(string|Uint8Array)}
 */
proto.dapr.proto.runtime.v1.SubtleDecryptRequest.prototype.getCiphertext = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * optional bytes ciphertext = 2;
 * This is a type-conversion wrapper around `getCiphertext()`
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleDecryptRequest.prototype.getCiphertext_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getCiphertext()));
};


/**
 * optional bytes ciphertext = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getCiphertext()`
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubtleDecryptRequest.prototype.getCiphertext_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getCiphertext()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleDecryptRequest} returns this
 */
proto.dapr.proto.runtime.v1.SubtleDecryptRequest.prototype.setCiphertext = function(value) {
  return jspb.Message.setProto3BytesField(this, 2, value);
};


/**
 * optional string algorithm = 3;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleDecryptRequest.prototype.getAlgorithm = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleDecryptRequest} returns this
 */
proto.dapr.proto.runtime.v1.SubtleDecryptRequest.prototype.setAlgorithm = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string key_name = 4;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleDecryptRequest.prototype.getKeyName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleDecryptRequest} returns this
 */
proto.dapr.proto.runtime.v1.SubtleDecryptRequest.prototype.setKeyName = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional bytes nonce = 5;
 * @return {!(string|Uint8Array)}
 */
proto.dapr.proto.runtime.v1.SubtleDecryptRequest.prototype.getNonce = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * optional bytes nonce = 5;
 * This is a type-conversion wrapper around `getNonce()`
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleDecryptRequest.prototype.getNonce_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getNonce()));
};


/**
 * optional bytes nonce = 5;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getNonce()`
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubtleDecryptRequest.prototype.getNonce_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getNonce()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleDecryptRequest} returns this
 */
proto.dapr.proto.runtime.v1.SubtleDecryptRequest.prototype.setNonce = function(value) {
  return jspb.Message.setProto3BytesField(this, 5, value);
};


/**
 * optional bytes tag = 6;
 * @return {!(string|Uint8Array)}
 */
proto.dapr.proto.runtime.v1.SubtleDecryptRequest.prototype.getTag = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/**
 * optional bytes tag = 6;
 * This is a type-conversion wrapper around `getTag()`
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleDecryptRequest.prototype.getTag_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getTag()));
};


/**
 * optional bytes tag = 6;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getTag()`
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubtleDecryptRequest.prototype.getTag_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getTag()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleDecryptRequest} returns this
 */
proto.dapr.proto.runtime.v1.SubtleDecryptRequest.prototype.setTag = function(value) {
  return jspb.Message.setProto3BytesField(this, 6, value);
};


/**
 * optional bytes associated_data = 7;
 * @return {!(string|Uint8Array)}
 */
proto.dapr.proto.runtime.v1.SubtleDecryptRequest.prototype.getAssociatedData = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 7, ""));
};


/**
 * optional bytes associated_data = 7;
 * This is a type-conversion wrapper around `getAssociatedData()`
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleDecryptRequest.prototype.getAssociatedData_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getAssociatedData()));
};


/**
 * optional bytes associated_data = 7;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getAssociatedData()`
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubtleDecryptRequest.prototype.getAssociatedData_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getAssociatedData()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleDecryptRequest} returns this
 */
proto.dapr.proto.runtime.v1.SubtleDecryptRequest.prototype.setAssociatedData = function(value) {
  return jspb.Message.setProto3BytesField(this, 7, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.SubtleDecryptResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.SubtleDecryptResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.SubtleDecryptResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SubtleDecryptResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    plaintext: msg.getPlaintext_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.SubtleDecryptResponse}
 */
proto.dapr.proto.runtime.v1.SubtleDecryptResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.SubtleDecryptResponse;
  return proto.dapr.proto.runtime.v1.SubtleDecryptResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.SubtleDecryptResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.SubtleDecryptResponse}
 */
proto.dapr.proto.runtime.v1.SubtleDecryptResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setPlaintext(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubtleDecryptResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.SubtleDecryptResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.SubtleDecryptResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SubtleDecryptResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPlaintext_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
};


/**
 * optional bytes plaintext = 1;
 * @return {!(string|Uint8Array)}
 */
proto.dapr.proto.runtime.v1.SubtleDecryptResponse.prototype.getPlaintext = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes plaintext = 1;
 * This is a type-conversion wrapper around `getPlaintext()`
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleDecryptResponse.prototype.getPlaintext_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getPlaintext()));
};


/**
 * optional bytes plaintext = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getPlaintext()`
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubtleDecryptResponse.prototype.getPlaintext_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getPlaintext()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleDecryptResponse} returns this
 */
proto.dapr.proto.runtime.v1.SubtleDecryptResponse.prototype.setPlaintext = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    componentName: jspb.Message.getFieldWithDefault(msg, 1, ""),
    plaintextKey: msg.getPlaintextKey_asB64(),
    algorithm: jspb.Message.getFieldWithDefault(msg, 3, ""),
    keyName: jspb.Message.getFieldWithDefault(msg, 4, ""),
    nonce: msg.getNonce_asB64(),
    associatedData: msg.getAssociatedData_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest}
 */
proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest;
  return proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest}
 */
proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setComponentName(value);
      break;
    case 2:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setPlaintextKey(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setAlgorithm(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setKeyName(value);
      break;
    case 5:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setNonce(value);
      break;
    case 6:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setAssociatedData(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getComponentName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getPlaintextKey_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      2,
      f
    );
  }
  f = message.getAlgorithm();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getKeyName();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getNonce_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      5,
      f
    );
  }
  f = message.getAssociatedData_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      6,
      f
    );
  }
};


/**
 * optional string component_name = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest.prototype.getComponentName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest} returns this
 */
proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest.prototype.setComponentName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional bytes plaintext_key = 2;
 * @return {!(string|Uint8Array)}
 */
proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest.prototype.getPlaintextKey = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * optional bytes plaintext_key = 2;
 * This is a type-conversion wrapper around `getPlaintextKey()`
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest.prototype.getPlaintextKey_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getPlaintextKey()));
};


/**
 * optional bytes plaintext_key = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getPlaintextKey()`
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest.prototype.getPlaintextKey_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getPlaintextKey()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest} returns this
 */
proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest.prototype.setPlaintextKey = function(value) {
  return jspb.Message.setProto3BytesField(this, 2, value);
};


/**
 * optional string algorithm = 3;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest.prototype.getAlgorithm = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest} returns this
 */
proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest.prototype.setAlgorithm = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string key_name = 4;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest.prototype.getKeyName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest} returns this
 */
proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest.prototype.setKeyName = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional bytes nonce = 5;
 * @return {!(string|Uint8Array)}
 */
proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest.prototype.getNonce = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * optional bytes nonce = 5;
 * This is a type-conversion wrapper around `getNonce()`
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest.prototype.getNonce_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getNonce()));
};


/**
 * optional bytes nonce = 5;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getNonce()`
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest.prototype.getNonce_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getNonce()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest} returns this
 */
proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest.prototype.setNonce = function(value) {
  return jspb.Message.setProto3BytesField(this, 5, value);
};


/**
 * optional bytes associated_data = 6;
 * @return {!(string|Uint8Array)}
 */
proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest.prototype.getAssociatedData = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/**
 * optional bytes associated_data = 6;
 * This is a type-conversion wrapper around `getAssociatedData()`
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest.prototype.getAssociatedData_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getAssociatedData()));
};


/**
 * optional bytes associated_data = 6;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getAssociatedData()`
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest.prototype.getAssociatedData_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getAssociatedData()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest} returns this
 */
proto.dapr.proto.runtime.v1.SubtleWrapKeyRequest.prototype.setAssociatedData = function(value) {
  return jspb.Message.setProto3BytesField(this, 6, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.SubtleWrapKeyResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.SubtleWrapKeyResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.SubtleWrapKeyResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SubtleWrapKeyResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    wrappedKey: msg.getWrappedKey_asB64(),
    tag: msg.getTag_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.SubtleWrapKeyResponse}
 */
proto.dapr.proto.runtime.v1.SubtleWrapKeyResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.SubtleWrapKeyResponse;
  return proto.dapr.proto.runtime.v1.SubtleWrapKeyResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.SubtleWrapKeyResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.SubtleWrapKeyResponse}
 */
proto.dapr.proto.runtime.v1.SubtleWrapKeyResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setWrappedKey(value);
      break;
    case 2:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setTag(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubtleWrapKeyResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.SubtleWrapKeyResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.SubtleWrapKeyResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SubtleWrapKeyResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getWrappedKey_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = message.getTag_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      2,
      f
    );
  }
};


/**
 * optional bytes wrapped_key = 1;
 * @return {!(string|Uint8Array)}
 */
proto.dapr.proto.runtime.v1.SubtleWrapKeyResponse.prototype.getWrappedKey = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes wrapped_key = 1;
 * This is a type-conversion wrapper around `getWrappedKey()`
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleWrapKeyResponse.prototype.getWrappedKey_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getWrappedKey()));
};


/**
 * optional bytes wrapped_key = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getWrappedKey()`
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubtleWrapKeyResponse.prototype.getWrappedKey_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getWrappedKey()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleWrapKeyResponse} returns this
 */
proto.dapr.proto.runtime.v1.SubtleWrapKeyResponse.prototype.setWrappedKey = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};


/**
 * optional bytes tag = 2;
 * @return {!(string|Uint8Array)}
 */
proto.dapr.proto.runtime.v1.SubtleWrapKeyResponse.prototype.getTag = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * optional bytes tag = 2;
 * This is a type-conversion wrapper around `getTag()`
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleWrapKeyResponse.prototype.getTag_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getTag()));
};


/**
 * optional bytes tag = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getTag()`
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubtleWrapKeyResponse.prototype.getTag_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getTag()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleWrapKeyResponse} returns this
 */
proto.dapr.proto.runtime.v1.SubtleWrapKeyResponse.prototype.setTag = function(value) {
  return jspb.Message.setProto3BytesField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    componentName: jspb.Message.getFieldWithDefault(msg, 1, ""),
    wrappedKey: msg.getWrappedKey_asB64(),
    algorithm: jspb.Message.getFieldWithDefault(msg, 3, ""),
    keyName: jspb.Message.getFieldWithDefault(msg, 4, ""),
    nonce: msg.getNonce_asB64(),
    tag: msg.getTag_asB64(),
    associatedData: msg.getAssociatedData_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest}
 */
proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest;
  return proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest}
 */
proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setComponentName(value);
      break;
    case 2:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setWrappedKey(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setAlgorithm(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setKeyName(value);
      break;
    case 5:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setNonce(value);
      break;
    case 6:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setTag(value);
      break;
    case 7:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setAssociatedData(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getComponentName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getWrappedKey_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      2,
      f
    );
  }
  f = message.getAlgorithm();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getKeyName();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getNonce_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      5,
      f
    );
  }
  f = message.getTag_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      6,
      f
    );
  }
  f = message.getAssociatedData_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      7,
      f
    );
  }
};


/**
 * optional string component_name = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest.prototype.getComponentName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest} returns this
 */
proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest.prototype.setComponentName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional bytes wrapped_key = 2;
 * @return {!(string|Uint8Array)}
 */
proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest.prototype.getWrappedKey = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * optional bytes wrapped_key = 2;
 * This is a type-conversion wrapper around `getWrappedKey()`
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest.prototype.getWrappedKey_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getWrappedKey()));
};


/**
 * optional bytes wrapped_key = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getWrappedKey()`
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest.prototype.getWrappedKey_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getWrappedKey()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest} returns this
 */
proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest.prototype.setWrappedKey = function(value) {
  return jspb.Message.setProto3BytesField(this, 2, value);
};


/**
 * optional string algorithm = 3;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest.prototype.getAlgorithm = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest} returns this
 */
proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest.prototype.setAlgorithm = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string key_name = 4;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest.prototype.getKeyName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest} returns this
 */
proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest.prototype.setKeyName = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional bytes nonce = 5;
 * @return {!(string|Uint8Array)}
 */
proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest.prototype.getNonce = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * optional bytes nonce = 5;
 * This is a type-conversion wrapper around `getNonce()`
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest.prototype.getNonce_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getNonce()));
};


/**
 * optional bytes nonce = 5;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getNonce()`
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest.prototype.getNonce_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getNonce()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest} returns this
 */
proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest.prototype.setNonce = function(value) {
  return jspb.Message.setProto3BytesField(this, 5, value);
};


/**
 * optional bytes tag = 6;
 * @return {!(string|Uint8Array)}
 */
proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest.prototype.getTag = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/**
 * optional bytes tag = 6;
 * This is a type-conversion wrapper around `getTag()`
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest.prototype.getTag_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getTag()));
};


/**
 * optional bytes tag = 6;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getTag()`
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest.prototype.getTag_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getTag()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest} returns this
 */
proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest.prototype.setTag = function(value) {
  return jspb.Message.setProto3BytesField(this, 6, value);
};


/**
 * optional bytes associated_data = 7;
 * @return {!(string|Uint8Array)}
 */
proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest.prototype.getAssociatedData = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 7, ""));
};


/**
 * optional bytes associated_data = 7;
 * This is a type-conversion wrapper around `getAssociatedData()`
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest.prototype.getAssociatedData_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getAssociatedData()));
};


/**
 * optional bytes associated_data = 7;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getAssociatedData()`
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest.prototype.getAssociatedData_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getAssociatedData()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest} returns this
 */
proto.dapr.proto.runtime.v1.SubtleUnwrapKeyRequest.prototype.setAssociatedData = function(value) {
  return jspb.Message.setProto3BytesField(this, 7, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.SubtleUnwrapKeyResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.SubtleUnwrapKeyResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.SubtleUnwrapKeyResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SubtleUnwrapKeyResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    plaintextKey: msg.getPlaintextKey_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.SubtleUnwrapKeyResponse}
 */
proto.dapr.proto.runtime.v1.SubtleUnwrapKeyResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.SubtleUnwrapKeyResponse;
  return proto.dapr.proto.runtime.v1.SubtleUnwrapKeyResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.SubtleUnwrapKeyResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.SubtleUnwrapKeyResponse}
 */
proto.dapr.proto.runtime.v1.SubtleUnwrapKeyResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setPlaintextKey(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubtleUnwrapKeyResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.SubtleUnwrapKeyResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.SubtleUnwrapKeyResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SubtleUnwrapKeyResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPlaintextKey_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
};


/**
 * optional bytes plaintext_key = 1;
 * @return {!(string|Uint8Array)}
 */
proto.dapr.proto.runtime.v1.SubtleUnwrapKeyResponse.prototype.getPlaintextKey = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes plaintext_key = 1;
 * This is a type-conversion wrapper around `getPlaintextKey()`
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleUnwrapKeyResponse.prototype.getPlaintextKey_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getPlaintextKey()));
};


/**
 * optional bytes plaintext_key = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getPlaintextKey()`
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubtleUnwrapKeyResponse.prototype.getPlaintextKey_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getPlaintextKey()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleUnwrapKeyResponse} returns this
 */
proto.dapr.proto.runtime.v1.SubtleUnwrapKeyResponse.prototype.setPlaintextKey = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.SubtleSignRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.SubtleSignRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.SubtleSignRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SubtleSignRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    componentName: jspb.Message.getFieldWithDefault(msg, 1, ""),
    digest: msg.getDigest_asB64(),
    algorithm: jspb.Message.getFieldWithDefault(msg, 3, ""),
    keyName: jspb.Message.getFieldWithDefault(msg, 4, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.SubtleSignRequest}
 */
proto.dapr.proto.runtime.v1.SubtleSignRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.SubtleSignRequest;
  return proto.dapr.proto.runtime.v1.SubtleSignRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.SubtleSignRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.SubtleSignRequest}
 */
proto.dapr.proto.runtime.v1.SubtleSignRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setComponentName(value);
      break;
    case 2:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setDigest(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setAlgorithm(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setKeyName(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubtleSignRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.SubtleSignRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.SubtleSignRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SubtleSignRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getComponentName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getDigest_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      2,
      f
    );
  }
  f = message.getAlgorithm();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getKeyName();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
};


/**
 * optional string component_name = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleSignRequest.prototype.getComponentName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleSignRequest} returns this
 */
proto.dapr.proto.runtime.v1.SubtleSignRequest.prototype.setComponentName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional bytes digest = 2;
 * @return {!(string|Uint8Array)}
 */
proto.dapr.proto.runtime.v1.SubtleSignRequest.prototype.getDigest = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * optional bytes digest = 2;
 * This is a type-conversion wrapper around `getDigest()`
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleSignRequest.prototype.getDigest_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getDigest()));
};


/**
 * optional bytes digest = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getDigest()`
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubtleSignRequest.prototype.getDigest_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getDigest()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleSignRequest} returns this
 */
proto.dapr.proto.runtime.v1.SubtleSignRequest.prototype.setDigest = function(value) {
  return jspb.Message.setProto3BytesField(this, 2, value);
};


/**
 * optional string algorithm = 3;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleSignRequest.prototype.getAlgorithm = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleSignRequest} returns this
 */
proto.dapr.proto.runtime.v1.SubtleSignRequest.prototype.setAlgorithm = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string key_name = 4;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleSignRequest.prototype.getKeyName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleSignRequest} returns this
 */
proto.dapr.proto.runtime.v1.SubtleSignRequest.prototype.setKeyName = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.SubtleSignResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.SubtleSignResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.SubtleSignResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SubtleSignResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    signature: msg.getSignature_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.SubtleSignResponse}
 */
proto.dapr.proto.runtime.v1.SubtleSignResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.SubtleSignResponse;
  return proto.dapr.proto.runtime.v1.SubtleSignResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.SubtleSignResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.SubtleSignResponse}
 */
proto.dapr.proto.runtime.v1.SubtleSignResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setSignature(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubtleSignResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.SubtleSignResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.SubtleSignResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SubtleSignResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSignature_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
};


/**
 * optional bytes signature = 1;
 * @return {!(string|Uint8Array)}
 */
proto.dapr.proto.runtime.v1.SubtleSignResponse.prototype.getSignature = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes signature = 1;
 * This is a type-conversion wrapper around `getSignature()`
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleSignResponse.prototype.getSignature_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getSignature()));
};


/**
 * optional bytes signature = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSignature()`
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubtleSignResponse.prototype.getSignature_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getSignature()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleSignResponse} returns this
 */
proto.dapr.proto.runtime.v1.SubtleSignResponse.prototype.setSignature = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.SubtleVerifyRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.SubtleVerifyRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.SubtleVerifyRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SubtleVerifyRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    componentName: jspb.Message.getFieldWithDefault(msg, 1, ""),
    digest: msg.getDigest_asB64(),
    algorithm: jspb.Message.getFieldWithDefault(msg, 3, ""),
    keyName: jspb.Message.getFieldWithDefault(msg, 4, ""),
    signature: msg.getSignature_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.SubtleVerifyRequest}
 */
proto.dapr.proto.runtime.v1.SubtleVerifyRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.SubtleVerifyRequest;
  return proto.dapr.proto.runtime.v1.SubtleVerifyRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.SubtleVerifyRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.SubtleVerifyRequest}
 */
proto.dapr.proto.runtime.v1.SubtleVerifyRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setComponentName(value);
      break;
    case 2:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setDigest(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setAlgorithm(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setKeyName(value);
      break;
    case 5:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setSignature(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubtleVerifyRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.SubtleVerifyRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.SubtleVerifyRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SubtleVerifyRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getComponentName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getDigest_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      2,
      f
    );
  }
  f = message.getAlgorithm();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getKeyName();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getSignature_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      5,
      f
    );
  }
};


/**
 * optional string component_name = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleVerifyRequest.prototype.getComponentName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleVerifyRequest} returns this
 */
proto.dapr.proto.runtime.v1.SubtleVerifyRequest.prototype.setComponentName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional bytes digest = 2;
 * @return {!(string|Uint8Array)}
 */
proto.dapr.proto.runtime.v1.SubtleVerifyRequest.prototype.getDigest = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * optional bytes digest = 2;
 * This is a type-conversion wrapper around `getDigest()`
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleVerifyRequest.prototype.getDigest_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getDigest()));
};


/**
 * optional bytes digest = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getDigest()`
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubtleVerifyRequest.prototype.getDigest_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getDigest()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleVerifyRequest} returns this
 */
proto.dapr.proto.runtime.v1.SubtleVerifyRequest.prototype.setDigest = function(value) {
  return jspb.Message.setProto3BytesField(this, 2, value);
};


/**
 * optional string algorithm = 3;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleVerifyRequest.prototype.getAlgorithm = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleVerifyRequest} returns this
 */
proto.dapr.proto.runtime.v1.SubtleVerifyRequest.prototype.setAlgorithm = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string key_name = 4;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleVerifyRequest.prototype.getKeyName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleVerifyRequest} returns this
 */
proto.dapr.proto.runtime.v1.SubtleVerifyRequest.prototype.setKeyName = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional bytes signature = 5;
 * @return {!(string|Uint8Array)}
 */
proto.dapr.proto.runtime.v1.SubtleVerifyRequest.prototype.getSignature = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * optional bytes signature = 5;
 * This is a type-conversion wrapper around `getSignature()`
 * @return {string}
 */
proto.dapr.proto.runtime.v1.SubtleVerifyRequest.prototype.getSignature_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getSignature()));
};


/**
 * optional bytes signature = 5;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSignature()`
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubtleVerifyRequest.prototype.getSignature_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getSignature()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleVerifyRequest} returns this
 */
proto.dapr.proto.runtime.v1.SubtleVerifyRequest.prototype.setSignature = function(value) {
  return jspb.Message.setProto3BytesField(this, 5, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.SubtleVerifyResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.SubtleVerifyResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.SubtleVerifyResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SubtleVerifyResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    valid: jspb.Message.getBooleanFieldWithDefault(msg, 1, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.SubtleVerifyResponse}
 */
proto.dapr.proto.runtime.v1.SubtleVerifyResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.SubtleVerifyResponse;
  return proto.dapr.proto.runtime.v1.SubtleVerifyResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.SubtleVerifyResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.SubtleVerifyResponse}
 */
proto.dapr.proto.runtime.v1.SubtleVerifyResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setValid(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.SubtleVerifyResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.SubtleVerifyResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.SubtleVerifyResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.SubtleVerifyResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getValid();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
};


/**
 * optional bool valid = 1;
 * @return {boolean}
 */
proto.dapr.proto.runtime.v1.SubtleVerifyResponse.prototype.getValid = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.dapr.proto.runtime.v1.SubtleVerifyResponse} returns this
 */
proto.dapr.proto.runtime.v1.SubtleVerifyResponse.prototype.setValid = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.EncryptRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.EncryptRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.EncryptRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.EncryptRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    options: (f = msg.getOptions()) && proto.dapr.proto.runtime.v1.EncryptRequestOptions.toObject(includeInstance, f),
    payload: (f = msg.getPayload()) && dapr_proto_common_v1_common_pb.StreamPayload.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.EncryptRequest}
 */
proto.dapr.proto.runtime.v1.EncryptRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.EncryptRequest;
  return proto.dapr.proto.runtime.v1.EncryptRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.EncryptRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.EncryptRequest}
 */
proto.dapr.proto.runtime.v1.EncryptRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.dapr.proto.runtime.v1.EncryptRequestOptions;
      reader.readMessage(value,proto.dapr.proto.runtime.v1.EncryptRequestOptions.deserializeBinaryFromReader);
      msg.setOptions(value);
      break;
    case 2:
      var value = new dapr_proto_common_v1_common_pb.StreamPayload;
      reader.readMessage(value,dapr_proto_common_v1_common_pb.StreamPayload.deserializeBinaryFromReader);
      msg.setPayload(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.EncryptRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.EncryptRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.EncryptRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.EncryptRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getOptions();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.dapr.proto.runtime.v1.EncryptRequestOptions.serializeBinaryToWriter
    );
  }
  f = message.getPayload();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      dapr_proto_common_v1_common_pb.StreamPayload.serializeBinaryToWriter
    );
  }
};


/**
 * optional EncryptRequestOptions options = 1;
 * @return {?proto.dapr.proto.runtime.v1.EncryptRequestOptions}
 */
proto.dapr.proto.runtime.v1.EncryptRequest.prototype.getOptions = function() {
  return /** @type{?proto.dapr.proto.runtime.v1.EncryptRequestOptions} */ (
    jspb.Message.getWrapperField(this, proto.dapr.proto.runtime.v1.EncryptRequestOptions, 1));
};


/**
 * @param {?proto.dapr.proto.runtime.v1.EncryptRequestOptions|undefined} value
 * @return {!proto.dapr.proto.runtime.v1.EncryptRequest} returns this
*/
proto.dapr.proto.runtime.v1.EncryptRequest.prototype.setOptions = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.dapr.proto.runtime.v1.EncryptRequest} returns this
 */
proto.dapr.proto.runtime.v1.EncryptRequest.prototype.clearOptions = function() {
  return this.setOptions(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.dapr.proto.runtime.v1.EncryptRequest.prototype.hasOptions = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional dapr.proto.common.v1.StreamPayload payload = 2;
 * @return {?proto.dapr.proto.common.v1.StreamPayload}
 */
proto.dapr.proto.runtime.v1.EncryptRequest.prototype.getPayload = function() {
  return /** @type{?proto.dapr.proto.common.v1.StreamPayload} */ (
    jspb.Message.getWrapperField(this, dapr_proto_common_v1_common_pb.StreamPayload, 2));
};


/**
 * @param {?proto.dapr.proto.common.v1.StreamPayload|undefined} value
 * @return {!proto.dapr.proto.runtime.v1.EncryptRequest} returns this
*/
proto.dapr.proto.runtime.v1.EncryptRequest.prototype.setPayload = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.dapr.proto.runtime.v1.EncryptRequest} returns this
 */
proto.dapr.proto.runtime.v1.EncryptRequest.prototype.clearPayload = function() {
  return this.setPayload(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.dapr.proto.runtime.v1.EncryptRequest.prototype.hasPayload = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.EncryptRequestOptions.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.EncryptRequestOptions.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.EncryptRequestOptions} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.EncryptRequestOptions.toObject = function(includeInstance, msg) {
  var f, obj = {
    componentName: jspb.Message.getFieldWithDefault(msg, 1, ""),
    keyName: jspb.Message.getFieldWithDefault(msg, 2, ""),
    keyWrapAlgorithm: jspb.Message.getFieldWithDefault(msg, 3, ""),
    dataEncryptionCipher: jspb.Message.getFieldWithDefault(msg, 10, ""),
    omitDecryptionKeyName: jspb.Message.getBooleanFieldWithDefault(msg, 11, false),
    decryptionKeyName: jspb.Message.getFieldWithDefault(msg, 12, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.EncryptRequestOptions}
 */
proto.dapr.proto.runtime.v1.EncryptRequestOptions.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.EncryptRequestOptions;
  return proto.dapr.proto.runtime.v1.EncryptRequestOptions.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.EncryptRequestOptions} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.EncryptRequestOptions}
 */
proto.dapr.proto.runtime.v1.EncryptRequestOptions.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setComponentName(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setKeyName(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setKeyWrapAlgorithm(value);
      break;
    case 10:
      var value = /** @type {string} */ (reader.readString());
      msg.setDataEncryptionCipher(value);
      break;
    case 11:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setOmitDecryptionKeyName(value);
      break;
    case 12:
      var value = /** @type {string} */ (reader.readString());
      msg.setDecryptionKeyName(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.EncryptRequestOptions.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.EncryptRequestOptions.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.EncryptRequestOptions} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.EncryptRequestOptions.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getComponentName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getKeyName();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getKeyWrapAlgorithm();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getDataEncryptionCipher();
  if (f.length > 0) {
    writer.writeString(
      10,
      f
    );
  }
  f = message.getOmitDecryptionKeyName();
  if (f) {
    writer.writeBool(
      11,
      f
    );
  }
  f = message.getDecryptionKeyName();
  if (f.length > 0) {
    writer.writeString(
      12,
      f
    );
  }
};


/**
 * optional string component_name = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.EncryptRequestOptions.prototype.getComponentName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.EncryptRequestOptions} returns this
 */
proto.dapr.proto.runtime.v1.EncryptRequestOptions.prototype.setComponentName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string key_name = 2;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.EncryptRequestOptions.prototype.getKeyName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.EncryptRequestOptions} returns this
 */
proto.dapr.proto.runtime.v1.EncryptRequestOptions.prototype.setKeyName = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string key_wrap_algorithm = 3;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.EncryptRequestOptions.prototype.getKeyWrapAlgorithm = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.EncryptRequestOptions} returns this
 */
proto.dapr.proto.runtime.v1.EncryptRequestOptions.prototype.setKeyWrapAlgorithm = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string data_encryption_cipher = 10;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.EncryptRequestOptions.prototype.getDataEncryptionCipher = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 10, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.EncryptRequestOptions} returns this
 */
proto.dapr.proto.runtime.v1.EncryptRequestOptions.prototype.setDataEncryptionCipher = function(value) {
  return jspb.Message.setProto3StringField(this, 10, value);
};


/**
 * optional bool omit_decryption_key_name = 11;
 * @return {boolean}
 */
proto.dapr.proto.runtime.v1.EncryptRequestOptions.prototype.getOmitDecryptionKeyName = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 11, false));
};


/**
 * @param {boolean} value
 * @return {!proto.dapr.proto.runtime.v1.EncryptRequestOptions} returns this
 */
proto.dapr.proto.runtime.v1.EncryptRequestOptions.prototype.setOmitDecryptionKeyName = function(value) {
  return jspb.Message.setProto3BooleanField(this, 11, value);
};


/**
 * optional string decryption_key_name = 12;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.EncryptRequestOptions.prototype.getDecryptionKeyName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 12, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.EncryptRequestOptions} returns this
 */
proto.dapr.proto.runtime.v1.EncryptRequestOptions.prototype.setDecryptionKeyName = function(value) {
  return jspb.Message.setProto3StringField(this, 12, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.EncryptResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.EncryptResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.EncryptResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.EncryptResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    payload: (f = msg.getPayload()) && dapr_proto_common_v1_common_pb.StreamPayload.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.EncryptResponse}
 */
proto.dapr.proto.runtime.v1.EncryptResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.EncryptResponse;
  return proto.dapr.proto.runtime.v1.EncryptResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.EncryptResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.EncryptResponse}
 */
proto.dapr.proto.runtime.v1.EncryptResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new dapr_proto_common_v1_common_pb.StreamPayload;
      reader.readMessage(value,dapr_proto_common_v1_common_pb.StreamPayload.deserializeBinaryFromReader);
      msg.setPayload(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.EncryptResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.EncryptResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.EncryptResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.EncryptResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPayload();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      dapr_proto_common_v1_common_pb.StreamPayload.serializeBinaryToWriter
    );
  }
};


/**
 * optional dapr.proto.common.v1.StreamPayload payload = 1;
 * @return {?proto.dapr.proto.common.v1.StreamPayload}
 */
proto.dapr.proto.runtime.v1.EncryptResponse.prototype.getPayload = function() {
  return /** @type{?proto.dapr.proto.common.v1.StreamPayload} */ (
    jspb.Message.getWrapperField(this, dapr_proto_common_v1_common_pb.StreamPayload, 1));
};


/**
 * @param {?proto.dapr.proto.common.v1.StreamPayload|undefined} value
 * @return {!proto.dapr.proto.runtime.v1.EncryptResponse} returns this
*/
proto.dapr.proto.runtime.v1.EncryptResponse.prototype.setPayload = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.dapr.proto.runtime.v1.EncryptResponse} returns this
 */
proto.dapr.proto.runtime.v1.EncryptResponse.prototype.clearPayload = function() {
  return this.setPayload(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.dapr.proto.runtime.v1.EncryptResponse.prototype.hasPayload = function() {
  return jspb.Message.getField(this, 1) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.DecryptRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.DecryptRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.DecryptRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.DecryptRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    options: (f = msg.getOptions()) && proto.dapr.proto.runtime.v1.DecryptRequestOptions.toObject(includeInstance, f),
    payload: (f = msg.getPayload()) && dapr_proto_common_v1_common_pb.StreamPayload.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.DecryptRequest}
 */
proto.dapr.proto.runtime.v1.DecryptRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.DecryptRequest;
  return proto.dapr.proto.runtime.v1.DecryptRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.DecryptRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.DecryptRequest}
 */
proto.dapr.proto.runtime.v1.DecryptRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.dapr.proto.runtime.v1.DecryptRequestOptions;
      reader.readMessage(value,proto.dapr.proto.runtime.v1.DecryptRequestOptions.deserializeBinaryFromReader);
      msg.setOptions(value);
      break;
    case 2:
      var value = new dapr_proto_common_v1_common_pb.StreamPayload;
      reader.readMessage(value,dapr_proto_common_v1_common_pb.StreamPayload.deserializeBinaryFromReader);
      msg.setPayload(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.DecryptRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.DecryptRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.DecryptRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.DecryptRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getOptions();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.dapr.proto.runtime.v1.DecryptRequestOptions.serializeBinaryToWriter
    );
  }
  f = message.getPayload();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      dapr_proto_common_v1_common_pb.StreamPayload.serializeBinaryToWriter
    );
  }
};


/**
 * optional DecryptRequestOptions options = 1;
 * @return {?proto.dapr.proto.runtime.v1.DecryptRequestOptions}
 */
proto.dapr.proto.runtime.v1.DecryptRequest.prototype.getOptions = function() {
  return /** @type{?proto.dapr.proto.runtime.v1.DecryptRequestOptions} */ (
    jspb.Message.getWrapperField(this, proto.dapr.proto.runtime.v1.DecryptRequestOptions, 1));
};


/**
 * @param {?proto.dapr.proto.runtime.v1.DecryptRequestOptions|undefined} value
 * @return {!proto.dapr.proto.runtime.v1.DecryptRequest} returns this
*/
proto.dapr.proto.runtime.v1.DecryptRequest.prototype.setOptions = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.dapr.proto.runtime.v1.DecryptRequest} returns this
 */
proto.dapr.proto.runtime.v1.DecryptRequest.prototype.clearOptions = function() {
  return this.setOptions(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.dapr.proto.runtime.v1.DecryptRequest.prototype.hasOptions = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional dapr.proto.common.v1.StreamPayload payload = 2;
 * @return {?proto.dapr.proto.common.v1.StreamPayload}
 */
proto.dapr.proto.runtime.v1.DecryptRequest.prototype.getPayload = function() {
  return /** @type{?proto.dapr.proto.common.v1.StreamPayload} */ (
    jspb.Message.getWrapperField(this, dapr_proto_common_v1_common_pb.StreamPayload, 2));
};


/**
 * @param {?proto.dapr.proto.common.v1.StreamPayload|undefined} value
 * @return {!proto.dapr.proto.runtime.v1.DecryptRequest} returns this
*/
proto.dapr.proto.runtime.v1.DecryptRequest.prototype.setPayload = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.dapr.proto.runtime.v1.DecryptRequest} returns this
 */
proto.dapr.proto.runtime.v1.DecryptRequest.prototype.clearPayload = function() {
  return this.setPayload(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.dapr.proto.runtime.v1.DecryptRequest.prototype.hasPayload = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.DecryptRequestOptions.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.DecryptRequestOptions.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.DecryptRequestOptions} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.DecryptRequestOptions.toObject = function(includeInstance, msg) {
  var f, obj = {
    componentName: jspb.Message.getFieldWithDefault(msg, 1, ""),
    keyName: jspb.Message.getFieldWithDefault(msg, 12, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.DecryptRequestOptions}
 */
proto.dapr.proto.runtime.v1.DecryptRequestOptions.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.DecryptRequestOptions;
  return proto.dapr.proto.runtime.v1.DecryptRequestOptions.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.DecryptRequestOptions} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.DecryptRequestOptions}
 */
proto.dapr.proto.runtime.v1.DecryptRequestOptions.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setComponentName(value);
      break;
    case 12:
      var value = /** @type {string} */ (reader.readString());
      msg.setKeyName(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.DecryptRequestOptions.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.DecryptRequestOptions.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.DecryptRequestOptions} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.DecryptRequestOptions.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getComponentName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getKeyName();
  if (f.length > 0) {
    writer.writeString(
      12,
      f
    );
  }
};


/**
 * optional string component_name = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.DecryptRequestOptions.prototype.getComponentName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.DecryptRequestOptions} returns this
 */
proto.dapr.proto.runtime.v1.DecryptRequestOptions.prototype.setComponentName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string key_name = 12;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.DecryptRequestOptions.prototype.getKeyName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 12, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.DecryptRequestOptions} returns this
 */
proto.dapr.proto.runtime.v1.DecryptRequestOptions.prototype.setKeyName = function(value) {
  return jspb.Message.setProto3StringField(this, 12, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.DecryptResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.DecryptResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.DecryptResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.DecryptResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    payload: (f = msg.getPayload()) && dapr_proto_common_v1_common_pb.StreamPayload.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.DecryptResponse}
 */
proto.dapr.proto.runtime.v1.DecryptResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.DecryptResponse;
  return proto.dapr.proto.runtime.v1.DecryptResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.DecryptResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.DecryptResponse}
 */
proto.dapr.proto.runtime.v1.DecryptResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new dapr_proto_common_v1_common_pb.StreamPayload;
      reader.readMessage(value,dapr_proto_common_v1_common_pb.StreamPayload.deserializeBinaryFromReader);
      msg.setPayload(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.DecryptResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.DecryptResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.DecryptResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.DecryptResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPayload();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      dapr_proto_common_v1_common_pb.StreamPayload.serializeBinaryToWriter
    );
  }
};


/**
 * optional dapr.proto.common.v1.StreamPayload payload = 1;
 * @return {?proto.dapr.proto.common.v1.StreamPayload}
 */
proto.dapr.proto.runtime.v1.DecryptResponse.prototype.getPayload = function() {
  return /** @type{?proto.dapr.proto.common.v1.StreamPayload} */ (
    jspb.Message.getWrapperField(this, dapr_proto_common_v1_common_pb.StreamPayload, 1));
};


/**
 * @param {?proto.dapr.proto.common.v1.StreamPayload|undefined} value
 * @return {!proto.dapr.proto.runtime.v1.DecryptResponse} returns this
*/
proto.dapr.proto.runtime.v1.DecryptResponse.prototype.setPayload = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.dapr.proto.runtime.v1.DecryptResponse} returns this
 */
proto.dapr.proto.runtime.v1.DecryptResponse.prototype.clearPayload = function() {
  return this.setPayload(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.dapr.proto.runtime.v1.DecryptResponse.prototype.hasPayload = function() {
  return jspb.Message.getField(this, 1) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.GetWorkflowRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.GetWorkflowRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.GetWorkflowRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.GetWorkflowRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    instanceId: jspb.Message.getFieldWithDefault(msg, 1, ""),
    workflowComponent: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.GetWorkflowRequest}
 */
proto.dapr.proto.runtime.v1.GetWorkflowRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.GetWorkflowRequest;
  return proto.dapr.proto.runtime.v1.GetWorkflowRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.GetWorkflowRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.GetWorkflowRequest}
 */
proto.dapr.proto.runtime.v1.GetWorkflowRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setInstanceId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setWorkflowComponent(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.GetWorkflowRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.GetWorkflowRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.GetWorkflowRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.GetWorkflowRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getInstanceId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getWorkflowComponent();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional string instance_id = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.GetWorkflowRequest.prototype.getInstanceId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.GetWorkflowRequest} returns this
 */
proto.dapr.proto.runtime.v1.GetWorkflowRequest.prototype.setInstanceId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string workflow_component = 2;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.GetWorkflowRequest.prototype.getWorkflowComponent = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.GetWorkflowRequest} returns this
 */
proto.dapr.proto.runtime.v1.GetWorkflowRequest.prototype.setWorkflowComponent = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.GetWorkflowResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.GetWorkflowResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.GetWorkflowResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.GetWorkflowResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    instanceId: jspb.Message.getFieldWithDefault(msg, 1, ""),
    workflowName: jspb.Message.getFieldWithDefault(msg, 2, ""),
    createdAt: (f = msg.getCreatedAt()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f),
    lastUpdatedAt: (f = msg.getLastUpdatedAt()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f),
    runtimeStatus: jspb.Message.getFieldWithDefault(msg, 5, ""),
    propertiesMap: (f = msg.getPropertiesMap()) ? f.toObject(includeInstance, undefined) : []
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.GetWorkflowResponse}
 */
proto.dapr.proto.runtime.v1.GetWorkflowResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.GetWorkflowResponse;
  return proto.dapr.proto.runtime.v1.GetWorkflowResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.GetWorkflowResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.GetWorkflowResponse}
 */
proto.dapr.proto.runtime.v1.GetWorkflowResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setInstanceId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setWorkflowName(value);
      break;
    case 3:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setCreatedAt(value);
      break;
    case 4:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setLastUpdatedAt(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setRuntimeStatus(value);
      break;
    case 6:
      var value = msg.getPropertiesMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readString, null, "", "");
         });
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.GetWorkflowResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.GetWorkflowResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.GetWorkflowResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.GetWorkflowResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getInstanceId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getWorkflowName();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getCreatedAt();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
  f = message.getLastUpdatedAt();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
  f = message.getRuntimeStatus();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getPropertiesMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(6, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeString);
  }
};


/**
 * optional string instance_id = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.GetWorkflowResponse.prototype.getInstanceId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.GetWorkflowResponse} returns this
 */
proto.dapr.proto.runtime.v1.GetWorkflowResponse.prototype.setInstanceId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string workflow_name = 2;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.GetWorkflowResponse.prototype.getWorkflowName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.GetWorkflowResponse} returns this
 */
proto.dapr.proto.runtime.v1.GetWorkflowResponse.prototype.setWorkflowName = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional google.protobuf.Timestamp created_at = 3;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.dapr.proto.runtime.v1.GetWorkflowResponse.prototype.getCreatedAt = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 3));
};


/**
 * @param {?proto.google.protobuf.Timestamp|undefined} value
 * @return {!proto.dapr.proto.runtime.v1.GetWorkflowResponse} returns this
*/
proto.dapr.proto.runtime.v1.GetWorkflowResponse.prototype.setCreatedAt = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.dapr.proto.runtime.v1.GetWorkflowResponse} returns this
 */
proto.dapr.proto.runtime.v1.GetWorkflowResponse.prototype.clearCreatedAt = function() {
  return this.setCreatedAt(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.dapr.proto.runtime.v1.GetWorkflowResponse.prototype.hasCreatedAt = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional google.protobuf.Timestamp last_updated_at = 4;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.dapr.proto.runtime.v1.GetWorkflowResponse.prototype.getLastUpdatedAt = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 4));
};


/**
 * @param {?proto.google.protobuf.Timestamp|undefined} value
 * @return {!proto.dapr.proto.runtime.v1.GetWorkflowResponse} returns this
*/
proto.dapr.proto.runtime.v1.GetWorkflowResponse.prototype.setLastUpdatedAt = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.dapr.proto.runtime.v1.GetWorkflowResponse} returns this
 */
proto.dapr.proto.runtime.v1.GetWorkflowResponse.prototype.clearLastUpdatedAt = function() {
  return this.setLastUpdatedAt(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.dapr.proto.runtime.v1.GetWorkflowResponse.prototype.hasLastUpdatedAt = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional string runtime_status = 5;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.GetWorkflowResponse.prototype.getRuntimeStatus = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.GetWorkflowResponse} returns this
 */
proto.dapr.proto.runtime.v1.GetWorkflowResponse.prototype.setRuntimeStatus = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};


/**
 * map<string, string> properties = 6;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,string>}
 */
proto.dapr.proto.runtime.v1.GetWorkflowResponse.prototype.getPropertiesMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,string>} */ (
      jspb.Message.getMapField(this, 6, opt_noLazyCreate,
      null));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.dapr.proto.runtime.v1.GetWorkflowResponse} returns this
 */
proto.dapr.proto.runtime.v1.GetWorkflowResponse.prototype.clearPropertiesMap = function() {
  this.getPropertiesMap().clear();
  return this;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.StartWorkflowRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.StartWorkflowRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.StartWorkflowRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.StartWorkflowRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    instanceId: jspb.Message.getFieldWithDefault(msg, 1, ""),
    workflowComponent: jspb.Message.getFieldWithDefault(msg, 2, ""),
    workflowName: jspb.Message.getFieldWithDefault(msg, 3, ""),
    optionsMap: (f = msg.getOptionsMap()) ? f.toObject(includeInstance, undefined) : [],
    input: msg.getInput_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.StartWorkflowRequest}
 */
proto.dapr.proto.runtime.v1.StartWorkflowRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.StartWorkflowRequest;
  return proto.dapr.proto.runtime.v1.StartWorkflowRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.StartWorkflowRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.StartWorkflowRequest}
 */
proto.dapr.proto.runtime.v1.StartWorkflowRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setInstanceId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setWorkflowComponent(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setWorkflowName(value);
      break;
    case 4:
      var value = msg.getOptionsMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readString, null, "", "");
         });
      break;
    case 5:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setInput(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.StartWorkflowRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.StartWorkflowRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.StartWorkflowRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.StartWorkflowRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getInstanceId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getWorkflowComponent();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getWorkflowName();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getOptionsMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(4, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeString);
  }
  f = message.getInput_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      5,
      f
    );
  }
};


/**
 * optional string instance_id = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.StartWorkflowRequest.prototype.getInstanceId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.StartWorkflowRequest} returns this
 */
proto.dapr.proto.runtime.v1.StartWorkflowRequest.prototype.setInstanceId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string workflow_component = 2;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.StartWorkflowRequest.prototype.getWorkflowComponent = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.StartWorkflowRequest} returns this
 */
proto.dapr.proto.runtime.v1.StartWorkflowRequest.prototype.setWorkflowComponent = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string workflow_name = 3;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.StartWorkflowRequest.prototype.getWorkflowName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.StartWorkflowRequest} returns this
 */
proto.dapr.proto.runtime.v1.StartWorkflowRequest.prototype.setWorkflowName = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * map<string, string> options = 4;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,string>}
 */
proto.dapr.proto.runtime.v1.StartWorkflowRequest.prototype.getOptionsMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,string>} */ (
      jspb.Message.getMapField(this, 4, opt_noLazyCreate,
      null));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.dapr.proto.runtime.v1.StartWorkflowRequest} returns this
 */
proto.dapr.proto.runtime.v1.StartWorkflowRequest.prototype.clearOptionsMap = function() {
  this.getOptionsMap().clear();
  return this;
};


/**
 * optional bytes input = 5;
 * @return {!(string|Uint8Array)}
 */
proto.dapr.proto.runtime.v1.StartWorkflowRequest.prototype.getInput = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * optional bytes input = 5;
 * This is a type-conversion wrapper around `getInput()`
 * @return {string}
 */
proto.dapr.proto.runtime.v1.StartWorkflowRequest.prototype.getInput_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getInput()));
};


/**
 * optional bytes input = 5;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getInput()`
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.StartWorkflowRequest.prototype.getInput_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getInput()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dapr.proto.runtime.v1.StartWorkflowRequest} returns this
 */
proto.dapr.proto.runtime.v1.StartWorkflowRequest.prototype.setInput = function(value) {
  return jspb.Message.setProto3BytesField(this, 5, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.StartWorkflowResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.StartWorkflowResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.StartWorkflowResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.StartWorkflowResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    instanceId: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.StartWorkflowResponse}
 */
proto.dapr.proto.runtime.v1.StartWorkflowResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.StartWorkflowResponse;
  return proto.dapr.proto.runtime.v1.StartWorkflowResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.StartWorkflowResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.StartWorkflowResponse}
 */
proto.dapr.proto.runtime.v1.StartWorkflowResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setInstanceId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.StartWorkflowResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.StartWorkflowResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.StartWorkflowResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.StartWorkflowResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getInstanceId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string instance_id = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.StartWorkflowResponse.prototype.getInstanceId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.StartWorkflowResponse} returns this
 */
proto.dapr.proto.runtime.v1.StartWorkflowResponse.prototype.setInstanceId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.TerminateWorkflowRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.TerminateWorkflowRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.TerminateWorkflowRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.TerminateWorkflowRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    instanceId: jspb.Message.getFieldWithDefault(msg, 1, ""),
    workflowComponent: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.TerminateWorkflowRequest}
 */
proto.dapr.proto.runtime.v1.TerminateWorkflowRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.TerminateWorkflowRequest;
  return proto.dapr.proto.runtime.v1.TerminateWorkflowRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.TerminateWorkflowRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.TerminateWorkflowRequest}
 */
proto.dapr.proto.runtime.v1.TerminateWorkflowRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setInstanceId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setWorkflowComponent(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.TerminateWorkflowRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.TerminateWorkflowRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.TerminateWorkflowRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.TerminateWorkflowRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getInstanceId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getWorkflowComponent();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional string instance_id = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.TerminateWorkflowRequest.prototype.getInstanceId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.TerminateWorkflowRequest} returns this
 */
proto.dapr.proto.runtime.v1.TerminateWorkflowRequest.prototype.setInstanceId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string workflow_component = 2;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.TerminateWorkflowRequest.prototype.getWorkflowComponent = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.TerminateWorkflowRequest} returns this
 */
proto.dapr.proto.runtime.v1.TerminateWorkflowRequest.prototype.setWorkflowComponent = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.PauseWorkflowRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.PauseWorkflowRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.PauseWorkflowRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.PauseWorkflowRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    instanceId: jspb.Message.getFieldWithDefault(msg, 1, ""),
    workflowComponent: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.PauseWorkflowRequest}
 */
proto.dapr.proto.runtime.v1.PauseWorkflowRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.PauseWorkflowRequest;
  return proto.dapr.proto.runtime.v1.PauseWorkflowRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.PauseWorkflowRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.PauseWorkflowRequest}
 */
proto.dapr.proto.runtime.v1.PauseWorkflowRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setInstanceId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setWorkflowComponent(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.PauseWorkflowRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.PauseWorkflowRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.PauseWorkflowRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.PauseWorkflowRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getInstanceId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getWorkflowComponent();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional string instance_id = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.PauseWorkflowRequest.prototype.getInstanceId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.PauseWorkflowRequest} returns this
 */
proto.dapr.proto.runtime.v1.PauseWorkflowRequest.prototype.setInstanceId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string workflow_component = 2;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.PauseWorkflowRequest.prototype.getWorkflowComponent = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.PauseWorkflowRequest} returns this
 */
proto.dapr.proto.runtime.v1.PauseWorkflowRequest.prototype.setWorkflowComponent = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.ResumeWorkflowRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.ResumeWorkflowRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.ResumeWorkflowRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.ResumeWorkflowRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    instanceId: jspb.Message.getFieldWithDefault(msg, 1, ""),
    workflowComponent: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.ResumeWorkflowRequest}
 */
proto.dapr.proto.runtime.v1.ResumeWorkflowRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.ResumeWorkflowRequest;
  return proto.dapr.proto.runtime.v1.ResumeWorkflowRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.ResumeWorkflowRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.ResumeWorkflowRequest}
 */
proto.dapr.proto.runtime.v1.ResumeWorkflowRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setInstanceId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setWorkflowComponent(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.ResumeWorkflowRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.ResumeWorkflowRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.ResumeWorkflowRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.ResumeWorkflowRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getInstanceId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getWorkflowComponent();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional string instance_id = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.ResumeWorkflowRequest.prototype.getInstanceId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.ResumeWorkflowRequest} returns this
 */
proto.dapr.proto.runtime.v1.ResumeWorkflowRequest.prototype.setInstanceId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string workflow_component = 2;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.ResumeWorkflowRequest.prototype.getWorkflowComponent = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.ResumeWorkflowRequest} returns this
 */
proto.dapr.proto.runtime.v1.ResumeWorkflowRequest.prototype.setWorkflowComponent = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.RaiseEventWorkflowRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.RaiseEventWorkflowRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.RaiseEventWorkflowRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.RaiseEventWorkflowRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    instanceId: jspb.Message.getFieldWithDefault(msg, 1, ""),
    workflowComponent: jspb.Message.getFieldWithDefault(msg, 2, ""),
    eventName: jspb.Message.getFieldWithDefault(msg, 3, ""),
    eventData: msg.getEventData_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.RaiseEventWorkflowRequest}
 */
proto.dapr.proto.runtime.v1.RaiseEventWorkflowRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.RaiseEventWorkflowRequest;
  return proto.dapr.proto.runtime.v1.RaiseEventWorkflowRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.RaiseEventWorkflowRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.RaiseEventWorkflowRequest}
 */
proto.dapr.proto.runtime.v1.RaiseEventWorkflowRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setInstanceId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setWorkflowComponent(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setEventName(value);
      break;
    case 4:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setEventData(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.RaiseEventWorkflowRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.RaiseEventWorkflowRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.RaiseEventWorkflowRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.RaiseEventWorkflowRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getInstanceId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getWorkflowComponent();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getEventName();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getEventData_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      4,
      f
    );
  }
};


/**
 * optional string instance_id = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.RaiseEventWorkflowRequest.prototype.getInstanceId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.RaiseEventWorkflowRequest} returns this
 */
proto.dapr.proto.runtime.v1.RaiseEventWorkflowRequest.prototype.setInstanceId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string workflow_component = 2;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.RaiseEventWorkflowRequest.prototype.getWorkflowComponent = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.RaiseEventWorkflowRequest} returns this
 */
proto.dapr.proto.runtime.v1.RaiseEventWorkflowRequest.prototype.setWorkflowComponent = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string event_name = 3;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.RaiseEventWorkflowRequest.prototype.getEventName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.RaiseEventWorkflowRequest} returns this
 */
proto.dapr.proto.runtime.v1.RaiseEventWorkflowRequest.prototype.setEventName = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional bytes event_data = 4;
 * @return {!(string|Uint8Array)}
 */
proto.dapr.proto.runtime.v1.RaiseEventWorkflowRequest.prototype.getEventData = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * optional bytes event_data = 4;
 * This is a type-conversion wrapper around `getEventData()`
 * @return {string}
 */
proto.dapr.proto.runtime.v1.RaiseEventWorkflowRequest.prototype.getEventData_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getEventData()));
};


/**
 * optional bytes event_data = 4;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getEventData()`
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.RaiseEventWorkflowRequest.prototype.getEventData_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getEventData()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.dapr.proto.runtime.v1.RaiseEventWorkflowRequest} returns this
 */
proto.dapr.proto.runtime.v1.RaiseEventWorkflowRequest.prototype.setEventData = function(value) {
  return jspb.Message.setProto3BytesField(this, 4, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.PurgeWorkflowRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.PurgeWorkflowRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.PurgeWorkflowRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.PurgeWorkflowRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    instanceId: jspb.Message.getFieldWithDefault(msg, 1, ""),
    workflowComponent: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.PurgeWorkflowRequest}
 */
proto.dapr.proto.runtime.v1.PurgeWorkflowRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.PurgeWorkflowRequest;
  return proto.dapr.proto.runtime.v1.PurgeWorkflowRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.PurgeWorkflowRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.PurgeWorkflowRequest}
 */
proto.dapr.proto.runtime.v1.PurgeWorkflowRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setInstanceId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setWorkflowComponent(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.PurgeWorkflowRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.PurgeWorkflowRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.PurgeWorkflowRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.PurgeWorkflowRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getInstanceId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getWorkflowComponent();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional string instance_id = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.PurgeWorkflowRequest.prototype.getInstanceId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.PurgeWorkflowRequest} returns this
 */
proto.dapr.proto.runtime.v1.PurgeWorkflowRequest.prototype.setInstanceId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string workflow_component = 2;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.PurgeWorkflowRequest.prototype.getWorkflowComponent = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.PurgeWorkflowRequest} returns this
 */
proto.dapr.proto.runtime.v1.PurgeWorkflowRequest.prototype.setWorkflowComponent = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.ShutdownRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.ShutdownRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.ShutdownRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.ShutdownRequest.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.ShutdownRequest}
 */
proto.dapr.proto.runtime.v1.ShutdownRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.ShutdownRequest;
  return proto.dapr.proto.runtime.v1.ShutdownRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.ShutdownRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.ShutdownRequest}
 */
proto.dapr.proto.runtime.v1.ShutdownRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.ShutdownRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.ShutdownRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.ShutdownRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.ShutdownRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.Job.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.Job.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.Job} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.Job.toObject = function(includeInstance, msg) {
  var f, obj = {
    name: jspb.Message.getFieldWithDefault(msg, 1, ""),
    schedule: jspb.Message.getFieldWithDefault(msg, 2, ""),
    repeats: jspb.Message.getFieldWithDefault(msg, 3, 0),
    dueTime: jspb.Message.getFieldWithDefault(msg, 4, ""),
    ttl: jspb.Message.getFieldWithDefault(msg, 5, ""),
    data: (f = msg.getData()) && google_protobuf_any_pb.Any.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.Job}
 */
proto.dapr.proto.runtime.v1.Job.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.Job;
  return proto.dapr.proto.runtime.v1.Job.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.Job} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.Job}
 */
proto.dapr.proto.runtime.v1.Job.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setSchedule(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setRepeats(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setDueTime(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setTtl(value);
      break;
    case 6:
      var value = new google_protobuf_any_pb.Any;
      reader.readMessage(value,google_protobuf_any_pb.Any.deserializeBinaryFromReader);
      msg.setData(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.Job.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.Job.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.Job} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.Job.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 2));
  if (f != null) {
    writer.writeString(
      2,
      f
    );
  }
  f = /** @type {number} */ (jspb.Message.getField(message, 3));
  if (f != null) {
    writer.writeUint32(
      3,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 4));
  if (f != null) {
    writer.writeString(
      4,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 5));
  if (f != null) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getData();
  if (f != null) {
    writer.writeMessage(
      6,
      f,
      google_protobuf_any_pb.Any.serializeBinaryToWriter
    );
  }
};


/**
 * optional string name = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.Job.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.Job} returns this
 */
proto.dapr.proto.runtime.v1.Job.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string schedule = 2;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.Job.prototype.getSchedule = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.Job} returns this
 */
proto.dapr.proto.runtime.v1.Job.prototype.setSchedule = function(value) {
  return jspb.Message.setField(this, 2, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.dapr.proto.runtime.v1.Job} returns this
 */
proto.dapr.proto.runtime.v1.Job.prototype.clearSchedule = function() {
  return jspb.Message.setField(this, 2, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.dapr.proto.runtime.v1.Job.prototype.hasSchedule = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional uint32 repeats = 3;
 * @return {number}
 */
proto.dapr.proto.runtime.v1.Job.prototype.getRepeats = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.dapr.proto.runtime.v1.Job} returns this
 */
proto.dapr.proto.runtime.v1.Job.prototype.setRepeats = function(value) {
  return jspb.Message.setField(this, 3, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.dapr.proto.runtime.v1.Job} returns this
 */
proto.dapr.proto.runtime.v1.Job.prototype.clearRepeats = function() {
  return jspb.Message.setField(this, 3, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.dapr.proto.runtime.v1.Job.prototype.hasRepeats = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional string due_time = 4;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.Job.prototype.getDueTime = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.Job} returns this
 */
proto.dapr.proto.runtime.v1.Job.prototype.setDueTime = function(value) {
  return jspb.Message.setField(this, 4, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.dapr.proto.runtime.v1.Job} returns this
 */
proto.dapr.proto.runtime.v1.Job.prototype.clearDueTime = function() {
  return jspb.Message.setField(this, 4, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.dapr.proto.runtime.v1.Job.prototype.hasDueTime = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional string ttl = 5;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.Job.prototype.getTtl = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.Job} returns this
 */
proto.dapr.proto.runtime.v1.Job.prototype.setTtl = function(value) {
  return jspb.Message.setField(this, 5, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.dapr.proto.runtime.v1.Job} returns this
 */
proto.dapr.proto.runtime.v1.Job.prototype.clearTtl = function() {
  return jspb.Message.setField(this, 5, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.dapr.proto.runtime.v1.Job.prototype.hasTtl = function() {
  return jspb.Message.getField(this, 5) != null;
};


/**
 * optional google.protobuf.Any data = 6;
 * @return {?proto.google.protobuf.Any}
 */
proto.dapr.proto.runtime.v1.Job.prototype.getData = function() {
  return /** @type{?proto.google.protobuf.Any} */ (
    jspb.Message.getWrapperField(this, google_protobuf_any_pb.Any, 6));
};


/**
 * @param {?proto.google.protobuf.Any|undefined} value
 * @return {!proto.dapr.proto.runtime.v1.Job} returns this
*/
proto.dapr.proto.runtime.v1.Job.prototype.setData = function(value) {
  return jspb.Message.setWrapperField(this, 6, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.dapr.proto.runtime.v1.Job} returns this
 */
proto.dapr.proto.runtime.v1.Job.prototype.clearData = function() {
  return this.setData(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.dapr.proto.runtime.v1.Job.prototype.hasData = function() {
  return jspb.Message.getField(this, 6) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.ScheduleJobRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.ScheduleJobRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.ScheduleJobRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.ScheduleJobRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    job: (f = msg.getJob()) && proto.dapr.proto.runtime.v1.Job.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.ScheduleJobRequest}
 */
proto.dapr.proto.runtime.v1.ScheduleJobRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.ScheduleJobRequest;
  return proto.dapr.proto.runtime.v1.ScheduleJobRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.ScheduleJobRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.ScheduleJobRequest}
 */
proto.dapr.proto.runtime.v1.ScheduleJobRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.dapr.proto.runtime.v1.Job;
      reader.readMessage(value,proto.dapr.proto.runtime.v1.Job.deserializeBinaryFromReader);
      msg.setJob(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.ScheduleJobRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.ScheduleJobRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.ScheduleJobRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.ScheduleJobRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getJob();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.dapr.proto.runtime.v1.Job.serializeBinaryToWriter
    );
  }
};


/**
 * optional Job job = 1;
 * @return {?proto.dapr.proto.runtime.v1.Job}
 */
proto.dapr.proto.runtime.v1.ScheduleJobRequest.prototype.getJob = function() {
  return /** @type{?proto.dapr.proto.runtime.v1.Job} */ (
    jspb.Message.getWrapperField(this, proto.dapr.proto.runtime.v1.Job, 1));
};


/**
 * @param {?proto.dapr.proto.runtime.v1.Job|undefined} value
 * @return {!proto.dapr.proto.runtime.v1.ScheduleJobRequest} returns this
*/
proto.dapr.proto.runtime.v1.ScheduleJobRequest.prototype.setJob = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.dapr.proto.runtime.v1.ScheduleJobRequest} returns this
 */
proto.dapr.proto.runtime.v1.ScheduleJobRequest.prototype.clearJob = function() {
  return this.setJob(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.dapr.proto.runtime.v1.ScheduleJobRequest.prototype.hasJob = function() {
  return jspb.Message.getField(this, 1) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.ScheduleJobResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.ScheduleJobResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.ScheduleJobResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.ScheduleJobResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.ScheduleJobResponse}
 */
proto.dapr.proto.runtime.v1.ScheduleJobResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.ScheduleJobResponse;
  return proto.dapr.proto.runtime.v1.ScheduleJobResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.ScheduleJobResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.ScheduleJobResponse}
 */
proto.dapr.proto.runtime.v1.ScheduleJobResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.ScheduleJobResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.ScheduleJobResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.ScheduleJobResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.ScheduleJobResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.GetJobRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.GetJobRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.GetJobRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.GetJobRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    name: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.GetJobRequest}
 */
proto.dapr.proto.runtime.v1.GetJobRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.GetJobRequest;
  return proto.dapr.proto.runtime.v1.GetJobRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.GetJobRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.GetJobRequest}
 */
proto.dapr.proto.runtime.v1.GetJobRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.GetJobRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.GetJobRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.GetJobRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.GetJobRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string name = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.GetJobRequest.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.GetJobRequest} returns this
 */
proto.dapr.proto.runtime.v1.GetJobRequest.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.GetJobResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.GetJobResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.GetJobResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.GetJobResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    job: (f = msg.getJob()) && proto.dapr.proto.runtime.v1.Job.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.GetJobResponse}
 */
proto.dapr.proto.runtime.v1.GetJobResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.GetJobResponse;
  return proto.dapr.proto.runtime.v1.GetJobResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.GetJobResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.GetJobResponse}
 */
proto.dapr.proto.runtime.v1.GetJobResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.dapr.proto.runtime.v1.Job;
      reader.readMessage(value,proto.dapr.proto.runtime.v1.Job.deserializeBinaryFromReader);
      msg.setJob(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.GetJobResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.GetJobResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.GetJobResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.GetJobResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getJob();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.dapr.proto.runtime.v1.Job.serializeBinaryToWriter
    );
  }
};


/**
 * optional Job job = 1;
 * @return {?proto.dapr.proto.runtime.v1.Job}
 */
proto.dapr.proto.runtime.v1.GetJobResponse.prototype.getJob = function() {
  return /** @type{?proto.dapr.proto.runtime.v1.Job} */ (
    jspb.Message.getWrapperField(this, proto.dapr.proto.runtime.v1.Job, 1));
};


/**
 * @param {?proto.dapr.proto.runtime.v1.Job|undefined} value
 * @return {!proto.dapr.proto.runtime.v1.GetJobResponse} returns this
*/
proto.dapr.proto.runtime.v1.GetJobResponse.prototype.setJob = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.dapr.proto.runtime.v1.GetJobResponse} returns this
 */
proto.dapr.proto.runtime.v1.GetJobResponse.prototype.clearJob = function() {
  return this.setJob(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.dapr.proto.runtime.v1.GetJobResponse.prototype.hasJob = function() {
  return jspb.Message.getField(this, 1) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.DeleteJobRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.DeleteJobRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.DeleteJobRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.DeleteJobRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    name: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.DeleteJobRequest}
 */
proto.dapr.proto.runtime.v1.DeleteJobRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.DeleteJobRequest;
  return proto.dapr.proto.runtime.v1.DeleteJobRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.DeleteJobRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.DeleteJobRequest}
 */
proto.dapr.proto.runtime.v1.DeleteJobRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.DeleteJobRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.DeleteJobRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.DeleteJobRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.DeleteJobRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string name = 1;
 * @return {string}
 */
proto.dapr.proto.runtime.v1.DeleteJobRequest.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.dapr.proto.runtime.v1.DeleteJobRequest} returns this
 */
proto.dapr.proto.runtime.v1.DeleteJobRequest.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.dapr.proto.runtime.v1.DeleteJobResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.dapr.proto.runtime.v1.DeleteJobResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.dapr.proto.runtime.v1.DeleteJobResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.DeleteJobResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.dapr.proto.runtime.v1.DeleteJobResponse}
 */
proto.dapr.proto.runtime.v1.DeleteJobResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.dapr.proto.runtime.v1.DeleteJobResponse;
  return proto.dapr.proto.runtime.v1.DeleteJobResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.dapr.proto.runtime.v1.DeleteJobResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.dapr.proto.runtime.v1.DeleteJobResponse}
 */
proto.dapr.proto.runtime.v1.DeleteJobResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.dapr.proto.runtime.v1.DeleteJobResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.dapr.proto.runtime.v1.DeleteJobResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.dapr.proto.runtime.v1.DeleteJobResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.dapr.proto.runtime.v1.DeleteJobResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};


/**
 * @enum {number}
 */
proto.dapr.proto.runtime.v1.PubsubSubscriptionType = {
  UNKNOWN: 0,
  DECLARATIVE: 1,
  PROGRAMMATIC: 2,
  STREAMING: 3
};

goog.object.extend(exports, proto.dapr.proto.runtime.v1);
