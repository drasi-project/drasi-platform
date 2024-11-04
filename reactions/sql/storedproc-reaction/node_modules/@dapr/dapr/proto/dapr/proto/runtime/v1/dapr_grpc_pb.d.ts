// package: dapr.proto.runtime.v1
// file: dapr/proto/runtime/v1/dapr.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as dapr_proto_runtime_v1_dapr_pb from "../../../../dapr/proto/runtime/v1/dapr_pb";
import * as google_protobuf_any_pb from "google-protobuf/google/protobuf/any_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";
import * as dapr_proto_common_v1_common_pb from "../../../../dapr/proto/common/v1/common_pb";
import * as dapr_proto_runtime_v1_appcallback_pb from "../../../../dapr/proto/runtime/v1/appcallback_pb";

interface IDaprService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    invokeService: IDaprService_IInvokeService;
    getState: IDaprService_IGetState;
    getBulkState: IDaprService_IGetBulkState;
    saveState: IDaprService_ISaveState;
    queryStateAlpha1: IDaprService_IQueryStateAlpha1;
    deleteState: IDaprService_IDeleteState;
    deleteBulkState: IDaprService_IDeleteBulkState;
    executeStateTransaction: IDaprService_IExecuteStateTransaction;
    publishEvent: IDaprService_IPublishEvent;
    bulkPublishEventAlpha1: IDaprService_IBulkPublishEventAlpha1;
    subscribeTopicEventsAlpha1: IDaprService_ISubscribeTopicEventsAlpha1;
    invokeBinding: IDaprService_IInvokeBinding;
    getSecret: IDaprService_IGetSecret;
    getBulkSecret: IDaprService_IGetBulkSecret;
    registerActorTimer: IDaprService_IRegisterActorTimer;
    unregisterActorTimer: IDaprService_IUnregisterActorTimer;
    registerActorReminder: IDaprService_IRegisterActorReminder;
    unregisterActorReminder: IDaprService_IUnregisterActorReminder;
    getActorState: IDaprService_IGetActorState;
    executeActorStateTransaction: IDaprService_IExecuteActorStateTransaction;
    invokeActor: IDaprService_IInvokeActor;
    getConfigurationAlpha1: IDaprService_IGetConfigurationAlpha1;
    getConfiguration: IDaprService_IGetConfiguration;
    subscribeConfigurationAlpha1: IDaprService_ISubscribeConfigurationAlpha1;
    subscribeConfiguration: IDaprService_ISubscribeConfiguration;
    unsubscribeConfigurationAlpha1: IDaprService_IUnsubscribeConfigurationAlpha1;
    unsubscribeConfiguration: IDaprService_IUnsubscribeConfiguration;
    tryLockAlpha1: IDaprService_ITryLockAlpha1;
    unlockAlpha1: IDaprService_IUnlockAlpha1;
    encryptAlpha1: IDaprService_IEncryptAlpha1;
    decryptAlpha1: IDaprService_IDecryptAlpha1;
    getMetadata: IDaprService_IGetMetadata;
    setMetadata: IDaprService_ISetMetadata;
    subtleGetKeyAlpha1: IDaprService_ISubtleGetKeyAlpha1;
    subtleEncryptAlpha1: IDaprService_ISubtleEncryptAlpha1;
    subtleDecryptAlpha1: IDaprService_ISubtleDecryptAlpha1;
    subtleWrapKeyAlpha1: IDaprService_ISubtleWrapKeyAlpha1;
    subtleUnwrapKeyAlpha1: IDaprService_ISubtleUnwrapKeyAlpha1;
    subtleSignAlpha1: IDaprService_ISubtleSignAlpha1;
    subtleVerifyAlpha1: IDaprService_ISubtleVerifyAlpha1;
    startWorkflowAlpha1: IDaprService_IStartWorkflowAlpha1;
    getWorkflowAlpha1: IDaprService_IGetWorkflowAlpha1;
    purgeWorkflowAlpha1: IDaprService_IPurgeWorkflowAlpha1;
    terminateWorkflowAlpha1: IDaprService_ITerminateWorkflowAlpha1;
    pauseWorkflowAlpha1: IDaprService_IPauseWorkflowAlpha1;
    resumeWorkflowAlpha1: IDaprService_IResumeWorkflowAlpha1;
    raiseEventWorkflowAlpha1: IDaprService_IRaiseEventWorkflowAlpha1;
    startWorkflowBeta1: IDaprService_IStartWorkflowBeta1;
    getWorkflowBeta1: IDaprService_IGetWorkflowBeta1;
    purgeWorkflowBeta1: IDaprService_IPurgeWorkflowBeta1;
    terminateWorkflowBeta1: IDaprService_ITerminateWorkflowBeta1;
    pauseWorkflowBeta1: IDaprService_IPauseWorkflowBeta1;
    resumeWorkflowBeta1: IDaprService_IResumeWorkflowBeta1;
    raiseEventWorkflowBeta1: IDaprService_IRaiseEventWorkflowBeta1;
    shutdown: IDaprService_IShutdown;
    scheduleJobAlpha1: IDaprService_IScheduleJobAlpha1;
    getJobAlpha1: IDaprService_IGetJobAlpha1;
    deleteJobAlpha1: IDaprService_IDeleteJobAlpha1;
}

interface IDaprService_IInvokeService extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.InvokeServiceRequest, dapr_proto_common_v1_common_pb.InvokeResponse> {
    path: "/dapr.proto.runtime.v1.Dapr/InvokeService";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.InvokeServiceRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.InvokeServiceRequest>;
    responseSerialize: grpc.serialize<dapr_proto_common_v1_common_pb.InvokeResponse>;
    responseDeserialize: grpc.deserialize<dapr_proto_common_v1_common_pb.InvokeResponse>;
}
interface IDaprService_IGetState extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.GetStateRequest, dapr_proto_runtime_v1_dapr_pb.GetStateResponse> {
    path: "/dapr.proto.runtime.v1.Dapr/GetState";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.GetStateRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.GetStateRequest>;
    responseSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.GetStateResponse>;
    responseDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.GetStateResponse>;
}
interface IDaprService_IGetBulkState extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.GetBulkStateRequest, dapr_proto_runtime_v1_dapr_pb.GetBulkStateResponse> {
    path: "/dapr.proto.runtime.v1.Dapr/GetBulkState";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.GetBulkStateRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.GetBulkStateRequest>;
    responseSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.GetBulkStateResponse>;
    responseDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.GetBulkStateResponse>;
}
interface IDaprService_ISaveState extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.SaveStateRequest, google_protobuf_empty_pb.Empty> {
    path: "/dapr.proto.runtime.v1.Dapr/SaveState";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.SaveStateRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.SaveStateRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface IDaprService_IQueryStateAlpha1 extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.QueryStateRequest, dapr_proto_runtime_v1_dapr_pb.QueryStateResponse> {
    path: "/dapr.proto.runtime.v1.Dapr/QueryStateAlpha1";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.QueryStateRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.QueryStateRequest>;
    responseSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.QueryStateResponse>;
    responseDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.QueryStateResponse>;
}
interface IDaprService_IDeleteState extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.DeleteStateRequest, google_protobuf_empty_pb.Empty> {
    path: "/dapr.proto.runtime.v1.Dapr/DeleteState";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.DeleteStateRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.DeleteStateRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface IDaprService_IDeleteBulkState extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.DeleteBulkStateRequest, google_protobuf_empty_pb.Empty> {
    path: "/dapr.proto.runtime.v1.Dapr/DeleteBulkState";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.DeleteBulkStateRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.DeleteBulkStateRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface IDaprService_IExecuteStateTransaction extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.ExecuteStateTransactionRequest, google_protobuf_empty_pb.Empty> {
    path: "/dapr.proto.runtime.v1.Dapr/ExecuteStateTransaction";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.ExecuteStateTransactionRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.ExecuteStateTransactionRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface IDaprService_IPublishEvent extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.PublishEventRequest, google_protobuf_empty_pb.Empty> {
    path: "/dapr.proto.runtime.v1.Dapr/PublishEvent";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.PublishEventRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.PublishEventRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface IDaprService_IBulkPublishEventAlpha1 extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.BulkPublishRequest, dapr_proto_runtime_v1_dapr_pb.BulkPublishResponse> {
    path: "/dapr.proto.runtime.v1.Dapr/BulkPublishEventAlpha1";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.BulkPublishRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.BulkPublishRequest>;
    responseSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.BulkPublishResponse>;
    responseDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.BulkPublishResponse>;
}
interface IDaprService_ISubscribeTopicEventsAlpha1 extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.SubscribeTopicEventsRequestAlpha1, dapr_proto_runtime_v1_dapr_pb.SubscribeTopicEventsResponseAlpha1> {
    path: "/dapr.proto.runtime.v1.Dapr/SubscribeTopicEventsAlpha1";
    requestStream: true;
    responseStream: true;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.SubscribeTopicEventsRequestAlpha1>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.SubscribeTopicEventsRequestAlpha1>;
    responseSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.SubscribeTopicEventsResponseAlpha1>;
    responseDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.SubscribeTopicEventsResponseAlpha1>;
}
interface IDaprService_IInvokeBinding extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.InvokeBindingRequest, dapr_proto_runtime_v1_dapr_pb.InvokeBindingResponse> {
    path: "/dapr.proto.runtime.v1.Dapr/InvokeBinding";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.InvokeBindingRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.InvokeBindingRequest>;
    responseSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.InvokeBindingResponse>;
    responseDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.InvokeBindingResponse>;
}
interface IDaprService_IGetSecret extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.GetSecretRequest, dapr_proto_runtime_v1_dapr_pb.GetSecretResponse> {
    path: "/dapr.proto.runtime.v1.Dapr/GetSecret";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.GetSecretRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.GetSecretRequest>;
    responseSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.GetSecretResponse>;
    responseDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.GetSecretResponse>;
}
interface IDaprService_IGetBulkSecret extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.GetBulkSecretRequest, dapr_proto_runtime_v1_dapr_pb.GetBulkSecretResponse> {
    path: "/dapr.proto.runtime.v1.Dapr/GetBulkSecret";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.GetBulkSecretRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.GetBulkSecretRequest>;
    responseSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.GetBulkSecretResponse>;
    responseDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.GetBulkSecretResponse>;
}
interface IDaprService_IRegisterActorTimer extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.RegisterActorTimerRequest, google_protobuf_empty_pb.Empty> {
    path: "/dapr.proto.runtime.v1.Dapr/RegisterActorTimer";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.RegisterActorTimerRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.RegisterActorTimerRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface IDaprService_IUnregisterActorTimer extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.UnregisterActorTimerRequest, google_protobuf_empty_pb.Empty> {
    path: "/dapr.proto.runtime.v1.Dapr/UnregisterActorTimer";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.UnregisterActorTimerRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.UnregisterActorTimerRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface IDaprService_IRegisterActorReminder extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.RegisterActorReminderRequest, google_protobuf_empty_pb.Empty> {
    path: "/dapr.proto.runtime.v1.Dapr/RegisterActorReminder";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.RegisterActorReminderRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.RegisterActorReminderRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface IDaprService_IUnregisterActorReminder extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.UnregisterActorReminderRequest, google_protobuf_empty_pb.Empty> {
    path: "/dapr.proto.runtime.v1.Dapr/UnregisterActorReminder";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.UnregisterActorReminderRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.UnregisterActorReminderRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface IDaprService_IGetActorState extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.GetActorStateRequest, dapr_proto_runtime_v1_dapr_pb.GetActorStateResponse> {
    path: "/dapr.proto.runtime.v1.Dapr/GetActorState";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.GetActorStateRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.GetActorStateRequest>;
    responseSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.GetActorStateResponse>;
    responseDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.GetActorStateResponse>;
}
interface IDaprService_IExecuteActorStateTransaction extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.ExecuteActorStateTransactionRequest, google_protobuf_empty_pb.Empty> {
    path: "/dapr.proto.runtime.v1.Dapr/ExecuteActorStateTransaction";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.ExecuteActorStateTransactionRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.ExecuteActorStateTransactionRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface IDaprService_IInvokeActor extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.InvokeActorRequest, dapr_proto_runtime_v1_dapr_pb.InvokeActorResponse> {
    path: "/dapr.proto.runtime.v1.Dapr/InvokeActor";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.InvokeActorRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.InvokeActorRequest>;
    responseSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.InvokeActorResponse>;
    responseDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.InvokeActorResponse>;
}
interface IDaprService_IGetConfigurationAlpha1 extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.GetConfigurationRequest, dapr_proto_runtime_v1_dapr_pb.GetConfigurationResponse> {
    path: "/dapr.proto.runtime.v1.Dapr/GetConfigurationAlpha1";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.GetConfigurationRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.GetConfigurationRequest>;
    responseSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.GetConfigurationResponse>;
    responseDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.GetConfigurationResponse>;
}
interface IDaprService_IGetConfiguration extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.GetConfigurationRequest, dapr_proto_runtime_v1_dapr_pb.GetConfigurationResponse> {
    path: "/dapr.proto.runtime.v1.Dapr/GetConfiguration";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.GetConfigurationRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.GetConfigurationRequest>;
    responseSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.GetConfigurationResponse>;
    responseDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.GetConfigurationResponse>;
}
interface IDaprService_ISubscribeConfigurationAlpha1 extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.SubscribeConfigurationRequest, dapr_proto_runtime_v1_dapr_pb.SubscribeConfigurationResponse> {
    path: "/dapr.proto.runtime.v1.Dapr/SubscribeConfigurationAlpha1";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.SubscribeConfigurationRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.SubscribeConfigurationRequest>;
    responseSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.SubscribeConfigurationResponse>;
    responseDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.SubscribeConfigurationResponse>;
}
interface IDaprService_ISubscribeConfiguration extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.SubscribeConfigurationRequest, dapr_proto_runtime_v1_dapr_pb.SubscribeConfigurationResponse> {
    path: "/dapr.proto.runtime.v1.Dapr/SubscribeConfiguration";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.SubscribeConfigurationRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.SubscribeConfigurationRequest>;
    responseSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.SubscribeConfigurationResponse>;
    responseDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.SubscribeConfigurationResponse>;
}
interface IDaprService_IUnsubscribeConfigurationAlpha1 extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationRequest, dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationResponse> {
    path: "/dapr.proto.runtime.v1.Dapr/UnsubscribeConfigurationAlpha1";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationRequest>;
    responseSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationResponse>;
    responseDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationResponse>;
}
interface IDaprService_IUnsubscribeConfiguration extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationRequest, dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationResponse> {
    path: "/dapr.proto.runtime.v1.Dapr/UnsubscribeConfiguration";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationRequest>;
    responseSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationResponse>;
    responseDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationResponse>;
}
interface IDaprService_ITryLockAlpha1 extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.TryLockRequest, dapr_proto_runtime_v1_dapr_pb.TryLockResponse> {
    path: "/dapr.proto.runtime.v1.Dapr/TryLockAlpha1";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.TryLockRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.TryLockRequest>;
    responseSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.TryLockResponse>;
    responseDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.TryLockResponse>;
}
interface IDaprService_IUnlockAlpha1 extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.UnlockRequest, dapr_proto_runtime_v1_dapr_pb.UnlockResponse> {
    path: "/dapr.proto.runtime.v1.Dapr/UnlockAlpha1";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.UnlockRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.UnlockRequest>;
    responseSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.UnlockResponse>;
    responseDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.UnlockResponse>;
}
interface IDaprService_IEncryptAlpha1 extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.EncryptRequest, dapr_proto_runtime_v1_dapr_pb.EncryptResponse> {
    path: "/dapr.proto.runtime.v1.Dapr/EncryptAlpha1";
    requestStream: true;
    responseStream: true;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.EncryptRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.EncryptRequest>;
    responseSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.EncryptResponse>;
    responseDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.EncryptResponse>;
}
interface IDaprService_IDecryptAlpha1 extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.DecryptRequest, dapr_proto_runtime_v1_dapr_pb.DecryptResponse> {
    path: "/dapr.proto.runtime.v1.Dapr/DecryptAlpha1";
    requestStream: true;
    responseStream: true;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.DecryptRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.DecryptRequest>;
    responseSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.DecryptResponse>;
    responseDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.DecryptResponse>;
}
interface IDaprService_IGetMetadata extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.GetMetadataRequest, dapr_proto_runtime_v1_dapr_pb.GetMetadataResponse> {
    path: "/dapr.proto.runtime.v1.Dapr/GetMetadata";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.GetMetadataRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.GetMetadataRequest>;
    responseSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.GetMetadataResponse>;
    responseDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.GetMetadataResponse>;
}
interface IDaprService_ISetMetadata extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.SetMetadataRequest, google_protobuf_empty_pb.Empty> {
    path: "/dapr.proto.runtime.v1.Dapr/SetMetadata";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.SetMetadataRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.SetMetadataRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface IDaprService_ISubtleGetKeyAlpha1 extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.SubtleGetKeyRequest, dapr_proto_runtime_v1_dapr_pb.SubtleGetKeyResponse> {
    path: "/dapr.proto.runtime.v1.Dapr/SubtleGetKeyAlpha1";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.SubtleGetKeyRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.SubtleGetKeyRequest>;
    responseSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.SubtleGetKeyResponse>;
    responseDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.SubtleGetKeyResponse>;
}
interface IDaprService_ISubtleEncryptAlpha1 extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.SubtleEncryptRequest, dapr_proto_runtime_v1_dapr_pb.SubtleEncryptResponse> {
    path: "/dapr.proto.runtime.v1.Dapr/SubtleEncryptAlpha1";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.SubtleEncryptRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.SubtleEncryptRequest>;
    responseSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.SubtleEncryptResponse>;
    responseDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.SubtleEncryptResponse>;
}
interface IDaprService_ISubtleDecryptAlpha1 extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.SubtleDecryptRequest, dapr_proto_runtime_v1_dapr_pb.SubtleDecryptResponse> {
    path: "/dapr.proto.runtime.v1.Dapr/SubtleDecryptAlpha1";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.SubtleDecryptRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.SubtleDecryptRequest>;
    responseSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.SubtleDecryptResponse>;
    responseDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.SubtleDecryptResponse>;
}
interface IDaprService_ISubtleWrapKeyAlpha1 extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.SubtleWrapKeyRequest, dapr_proto_runtime_v1_dapr_pb.SubtleWrapKeyResponse> {
    path: "/dapr.proto.runtime.v1.Dapr/SubtleWrapKeyAlpha1";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.SubtleWrapKeyRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.SubtleWrapKeyRequest>;
    responseSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.SubtleWrapKeyResponse>;
    responseDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.SubtleWrapKeyResponse>;
}
interface IDaprService_ISubtleUnwrapKeyAlpha1 extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.SubtleUnwrapKeyRequest, dapr_proto_runtime_v1_dapr_pb.SubtleUnwrapKeyResponse> {
    path: "/dapr.proto.runtime.v1.Dapr/SubtleUnwrapKeyAlpha1";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.SubtleUnwrapKeyRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.SubtleUnwrapKeyRequest>;
    responseSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.SubtleUnwrapKeyResponse>;
    responseDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.SubtleUnwrapKeyResponse>;
}
interface IDaprService_ISubtleSignAlpha1 extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.SubtleSignRequest, dapr_proto_runtime_v1_dapr_pb.SubtleSignResponse> {
    path: "/dapr.proto.runtime.v1.Dapr/SubtleSignAlpha1";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.SubtleSignRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.SubtleSignRequest>;
    responseSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.SubtleSignResponse>;
    responseDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.SubtleSignResponse>;
}
interface IDaprService_ISubtleVerifyAlpha1 extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.SubtleVerifyRequest, dapr_proto_runtime_v1_dapr_pb.SubtleVerifyResponse> {
    path: "/dapr.proto.runtime.v1.Dapr/SubtleVerifyAlpha1";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.SubtleVerifyRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.SubtleVerifyRequest>;
    responseSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.SubtleVerifyResponse>;
    responseDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.SubtleVerifyResponse>;
}
interface IDaprService_IStartWorkflowAlpha1 extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.StartWorkflowRequest, dapr_proto_runtime_v1_dapr_pb.StartWorkflowResponse> {
    path: "/dapr.proto.runtime.v1.Dapr/StartWorkflowAlpha1";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.StartWorkflowRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.StartWorkflowRequest>;
    responseSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.StartWorkflowResponse>;
    responseDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.StartWorkflowResponse>;
}
interface IDaprService_IGetWorkflowAlpha1 extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.GetWorkflowRequest, dapr_proto_runtime_v1_dapr_pb.GetWorkflowResponse> {
    path: "/dapr.proto.runtime.v1.Dapr/GetWorkflowAlpha1";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.GetWorkflowRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.GetWorkflowRequest>;
    responseSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.GetWorkflowResponse>;
    responseDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.GetWorkflowResponse>;
}
interface IDaprService_IPurgeWorkflowAlpha1 extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.PurgeWorkflowRequest, google_protobuf_empty_pb.Empty> {
    path: "/dapr.proto.runtime.v1.Dapr/PurgeWorkflowAlpha1";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.PurgeWorkflowRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.PurgeWorkflowRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface IDaprService_ITerminateWorkflowAlpha1 extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.TerminateWorkflowRequest, google_protobuf_empty_pb.Empty> {
    path: "/dapr.proto.runtime.v1.Dapr/TerminateWorkflowAlpha1";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.TerminateWorkflowRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.TerminateWorkflowRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface IDaprService_IPauseWorkflowAlpha1 extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.PauseWorkflowRequest, google_protobuf_empty_pb.Empty> {
    path: "/dapr.proto.runtime.v1.Dapr/PauseWorkflowAlpha1";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.PauseWorkflowRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.PauseWorkflowRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface IDaprService_IResumeWorkflowAlpha1 extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.ResumeWorkflowRequest, google_protobuf_empty_pb.Empty> {
    path: "/dapr.proto.runtime.v1.Dapr/ResumeWorkflowAlpha1";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.ResumeWorkflowRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.ResumeWorkflowRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface IDaprService_IRaiseEventWorkflowAlpha1 extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.RaiseEventWorkflowRequest, google_protobuf_empty_pb.Empty> {
    path: "/dapr.proto.runtime.v1.Dapr/RaiseEventWorkflowAlpha1";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.RaiseEventWorkflowRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.RaiseEventWorkflowRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface IDaprService_IStartWorkflowBeta1 extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.StartWorkflowRequest, dapr_proto_runtime_v1_dapr_pb.StartWorkflowResponse> {
    path: "/dapr.proto.runtime.v1.Dapr/StartWorkflowBeta1";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.StartWorkflowRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.StartWorkflowRequest>;
    responseSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.StartWorkflowResponse>;
    responseDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.StartWorkflowResponse>;
}
interface IDaprService_IGetWorkflowBeta1 extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.GetWorkflowRequest, dapr_proto_runtime_v1_dapr_pb.GetWorkflowResponse> {
    path: "/dapr.proto.runtime.v1.Dapr/GetWorkflowBeta1";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.GetWorkflowRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.GetWorkflowRequest>;
    responseSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.GetWorkflowResponse>;
    responseDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.GetWorkflowResponse>;
}
interface IDaprService_IPurgeWorkflowBeta1 extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.PurgeWorkflowRequest, google_protobuf_empty_pb.Empty> {
    path: "/dapr.proto.runtime.v1.Dapr/PurgeWorkflowBeta1";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.PurgeWorkflowRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.PurgeWorkflowRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface IDaprService_ITerminateWorkflowBeta1 extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.TerminateWorkflowRequest, google_protobuf_empty_pb.Empty> {
    path: "/dapr.proto.runtime.v1.Dapr/TerminateWorkflowBeta1";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.TerminateWorkflowRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.TerminateWorkflowRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface IDaprService_IPauseWorkflowBeta1 extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.PauseWorkflowRequest, google_protobuf_empty_pb.Empty> {
    path: "/dapr.proto.runtime.v1.Dapr/PauseWorkflowBeta1";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.PauseWorkflowRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.PauseWorkflowRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface IDaprService_IResumeWorkflowBeta1 extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.ResumeWorkflowRequest, google_protobuf_empty_pb.Empty> {
    path: "/dapr.proto.runtime.v1.Dapr/ResumeWorkflowBeta1";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.ResumeWorkflowRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.ResumeWorkflowRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface IDaprService_IRaiseEventWorkflowBeta1 extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.RaiseEventWorkflowRequest, google_protobuf_empty_pb.Empty> {
    path: "/dapr.proto.runtime.v1.Dapr/RaiseEventWorkflowBeta1";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.RaiseEventWorkflowRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.RaiseEventWorkflowRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface IDaprService_IShutdown extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.ShutdownRequest, google_protobuf_empty_pb.Empty> {
    path: "/dapr.proto.runtime.v1.Dapr/Shutdown";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.ShutdownRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.ShutdownRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface IDaprService_IScheduleJobAlpha1 extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.ScheduleJobRequest, dapr_proto_runtime_v1_dapr_pb.ScheduleJobResponse> {
    path: "/dapr.proto.runtime.v1.Dapr/ScheduleJobAlpha1";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.ScheduleJobRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.ScheduleJobRequest>;
    responseSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.ScheduleJobResponse>;
    responseDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.ScheduleJobResponse>;
}
interface IDaprService_IGetJobAlpha1 extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.GetJobRequest, dapr_proto_runtime_v1_dapr_pb.GetJobResponse> {
    path: "/dapr.proto.runtime.v1.Dapr/GetJobAlpha1";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.GetJobRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.GetJobRequest>;
    responseSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.GetJobResponse>;
    responseDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.GetJobResponse>;
}
interface IDaprService_IDeleteJobAlpha1 extends grpc.MethodDefinition<dapr_proto_runtime_v1_dapr_pb.DeleteJobRequest, dapr_proto_runtime_v1_dapr_pb.DeleteJobResponse> {
    path: "/dapr.proto.runtime.v1.Dapr/DeleteJobAlpha1";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.DeleteJobRequest>;
    requestDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.DeleteJobRequest>;
    responseSerialize: grpc.serialize<dapr_proto_runtime_v1_dapr_pb.DeleteJobResponse>;
    responseDeserialize: grpc.deserialize<dapr_proto_runtime_v1_dapr_pb.DeleteJobResponse>;
}

export const DaprService: IDaprService;

export interface IDaprServer extends grpc.UntypedServiceImplementation {
    invokeService: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.InvokeServiceRequest, dapr_proto_common_v1_common_pb.InvokeResponse>;
    getState: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.GetStateRequest, dapr_proto_runtime_v1_dapr_pb.GetStateResponse>;
    getBulkState: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.GetBulkStateRequest, dapr_proto_runtime_v1_dapr_pb.GetBulkStateResponse>;
    saveState: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.SaveStateRequest, google_protobuf_empty_pb.Empty>;
    queryStateAlpha1: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.QueryStateRequest, dapr_proto_runtime_v1_dapr_pb.QueryStateResponse>;
    deleteState: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.DeleteStateRequest, google_protobuf_empty_pb.Empty>;
    deleteBulkState: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.DeleteBulkStateRequest, google_protobuf_empty_pb.Empty>;
    executeStateTransaction: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.ExecuteStateTransactionRequest, google_protobuf_empty_pb.Empty>;
    publishEvent: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.PublishEventRequest, google_protobuf_empty_pb.Empty>;
    bulkPublishEventAlpha1: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.BulkPublishRequest, dapr_proto_runtime_v1_dapr_pb.BulkPublishResponse>;
    subscribeTopicEventsAlpha1: grpc.handleBidiStreamingCall<dapr_proto_runtime_v1_dapr_pb.SubscribeTopicEventsRequestAlpha1, dapr_proto_runtime_v1_dapr_pb.SubscribeTopicEventsResponseAlpha1>;
    invokeBinding: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.InvokeBindingRequest, dapr_proto_runtime_v1_dapr_pb.InvokeBindingResponse>;
    getSecret: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.GetSecretRequest, dapr_proto_runtime_v1_dapr_pb.GetSecretResponse>;
    getBulkSecret: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.GetBulkSecretRequest, dapr_proto_runtime_v1_dapr_pb.GetBulkSecretResponse>;
    registerActorTimer: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.RegisterActorTimerRequest, google_protobuf_empty_pb.Empty>;
    unregisterActorTimer: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.UnregisterActorTimerRequest, google_protobuf_empty_pb.Empty>;
    registerActorReminder: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.RegisterActorReminderRequest, google_protobuf_empty_pb.Empty>;
    unregisterActorReminder: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.UnregisterActorReminderRequest, google_protobuf_empty_pb.Empty>;
    getActorState: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.GetActorStateRequest, dapr_proto_runtime_v1_dapr_pb.GetActorStateResponse>;
    executeActorStateTransaction: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.ExecuteActorStateTransactionRequest, google_protobuf_empty_pb.Empty>;
    invokeActor: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.InvokeActorRequest, dapr_proto_runtime_v1_dapr_pb.InvokeActorResponse>;
    getConfigurationAlpha1: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.GetConfigurationRequest, dapr_proto_runtime_v1_dapr_pb.GetConfigurationResponse>;
    getConfiguration: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.GetConfigurationRequest, dapr_proto_runtime_v1_dapr_pb.GetConfigurationResponse>;
    subscribeConfigurationAlpha1: grpc.handleServerStreamingCall<dapr_proto_runtime_v1_dapr_pb.SubscribeConfigurationRequest, dapr_proto_runtime_v1_dapr_pb.SubscribeConfigurationResponse>;
    subscribeConfiguration: grpc.handleServerStreamingCall<dapr_proto_runtime_v1_dapr_pb.SubscribeConfigurationRequest, dapr_proto_runtime_v1_dapr_pb.SubscribeConfigurationResponse>;
    unsubscribeConfigurationAlpha1: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationRequest, dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationResponse>;
    unsubscribeConfiguration: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationRequest, dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationResponse>;
    tryLockAlpha1: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.TryLockRequest, dapr_proto_runtime_v1_dapr_pb.TryLockResponse>;
    unlockAlpha1: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.UnlockRequest, dapr_proto_runtime_v1_dapr_pb.UnlockResponse>;
    encryptAlpha1: grpc.handleBidiStreamingCall<dapr_proto_runtime_v1_dapr_pb.EncryptRequest, dapr_proto_runtime_v1_dapr_pb.EncryptResponse>;
    decryptAlpha1: grpc.handleBidiStreamingCall<dapr_proto_runtime_v1_dapr_pb.DecryptRequest, dapr_proto_runtime_v1_dapr_pb.DecryptResponse>;
    getMetadata: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.GetMetadataRequest, dapr_proto_runtime_v1_dapr_pb.GetMetadataResponse>;
    setMetadata: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.SetMetadataRequest, google_protobuf_empty_pb.Empty>;
    subtleGetKeyAlpha1: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.SubtleGetKeyRequest, dapr_proto_runtime_v1_dapr_pb.SubtleGetKeyResponse>;
    subtleEncryptAlpha1: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.SubtleEncryptRequest, dapr_proto_runtime_v1_dapr_pb.SubtleEncryptResponse>;
    subtleDecryptAlpha1: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.SubtleDecryptRequest, dapr_proto_runtime_v1_dapr_pb.SubtleDecryptResponse>;
    subtleWrapKeyAlpha1: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.SubtleWrapKeyRequest, dapr_proto_runtime_v1_dapr_pb.SubtleWrapKeyResponse>;
    subtleUnwrapKeyAlpha1: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.SubtleUnwrapKeyRequest, dapr_proto_runtime_v1_dapr_pb.SubtleUnwrapKeyResponse>;
    subtleSignAlpha1: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.SubtleSignRequest, dapr_proto_runtime_v1_dapr_pb.SubtleSignResponse>;
    subtleVerifyAlpha1: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.SubtleVerifyRequest, dapr_proto_runtime_v1_dapr_pb.SubtleVerifyResponse>;
    startWorkflowAlpha1: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.StartWorkflowRequest, dapr_proto_runtime_v1_dapr_pb.StartWorkflowResponse>;
    getWorkflowAlpha1: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.GetWorkflowRequest, dapr_proto_runtime_v1_dapr_pb.GetWorkflowResponse>;
    purgeWorkflowAlpha1: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.PurgeWorkflowRequest, google_protobuf_empty_pb.Empty>;
    terminateWorkflowAlpha1: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.TerminateWorkflowRequest, google_protobuf_empty_pb.Empty>;
    pauseWorkflowAlpha1: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.PauseWorkflowRequest, google_protobuf_empty_pb.Empty>;
    resumeWorkflowAlpha1: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.ResumeWorkflowRequest, google_protobuf_empty_pb.Empty>;
    raiseEventWorkflowAlpha1: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.RaiseEventWorkflowRequest, google_protobuf_empty_pb.Empty>;
    startWorkflowBeta1: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.StartWorkflowRequest, dapr_proto_runtime_v1_dapr_pb.StartWorkflowResponse>;
    getWorkflowBeta1: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.GetWorkflowRequest, dapr_proto_runtime_v1_dapr_pb.GetWorkflowResponse>;
    purgeWorkflowBeta1: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.PurgeWorkflowRequest, google_protobuf_empty_pb.Empty>;
    terminateWorkflowBeta1: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.TerminateWorkflowRequest, google_protobuf_empty_pb.Empty>;
    pauseWorkflowBeta1: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.PauseWorkflowRequest, google_protobuf_empty_pb.Empty>;
    resumeWorkflowBeta1: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.ResumeWorkflowRequest, google_protobuf_empty_pb.Empty>;
    raiseEventWorkflowBeta1: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.RaiseEventWorkflowRequest, google_protobuf_empty_pb.Empty>;
    shutdown: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.ShutdownRequest, google_protobuf_empty_pb.Empty>;
    scheduleJobAlpha1: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.ScheduleJobRequest, dapr_proto_runtime_v1_dapr_pb.ScheduleJobResponse>;
    getJobAlpha1: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.GetJobRequest, dapr_proto_runtime_v1_dapr_pb.GetJobResponse>;
    deleteJobAlpha1: grpc.handleUnaryCall<dapr_proto_runtime_v1_dapr_pb.DeleteJobRequest, dapr_proto_runtime_v1_dapr_pb.DeleteJobResponse>;
}

export interface IDaprClient {
    invokeService(request: dapr_proto_runtime_v1_dapr_pb.InvokeServiceRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_common_v1_common_pb.InvokeResponse) => void): grpc.ClientUnaryCall;
    invokeService(request: dapr_proto_runtime_v1_dapr_pb.InvokeServiceRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_common_v1_common_pb.InvokeResponse) => void): grpc.ClientUnaryCall;
    invokeService(request: dapr_proto_runtime_v1_dapr_pb.InvokeServiceRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_common_v1_common_pb.InvokeResponse) => void): grpc.ClientUnaryCall;
    getState(request: dapr_proto_runtime_v1_dapr_pb.GetStateRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetStateResponse) => void): grpc.ClientUnaryCall;
    getState(request: dapr_proto_runtime_v1_dapr_pb.GetStateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetStateResponse) => void): grpc.ClientUnaryCall;
    getState(request: dapr_proto_runtime_v1_dapr_pb.GetStateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetStateResponse) => void): grpc.ClientUnaryCall;
    getBulkState(request: dapr_proto_runtime_v1_dapr_pb.GetBulkStateRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetBulkStateResponse) => void): grpc.ClientUnaryCall;
    getBulkState(request: dapr_proto_runtime_v1_dapr_pb.GetBulkStateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetBulkStateResponse) => void): grpc.ClientUnaryCall;
    getBulkState(request: dapr_proto_runtime_v1_dapr_pb.GetBulkStateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetBulkStateResponse) => void): grpc.ClientUnaryCall;
    saveState(request: dapr_proto_runtime_v1_dapr_pb.SaveStateRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    saveState(request: dapr_proto_runtime_v1_dapr_pb.SaveStateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    saveState(request: dapr_proto_runtime_v1_dapr_pb.SaveStateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    queryStateAlpha1(request: dapr_proto_runtime_v1_dapr_pb.QueryStateRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.QueryStateResponse) => void): grpc.ClientUnaryCall;
    queryStateAlpha1(request: dapr_proto_runtime_v1_dapr_pb.QueryStateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.QueryStateResponse) => void): grpc.ClientUnaryCall;
    queryStateAlpha1(request: dapr_proto_runtime_v1_dapr_pb.QueryStateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.QueryStateResponse) => void): grpc.ClientUnaryCall;
    deleteState(request: dapr_proto_runtime_v1_dapr_pb.DeleteStateRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    deleteState(request: dapr_proto_runtime_v1_dapr_pb.DeleteStateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    deleteState(request: dapr_proto_runtime_v1_dapr_pb.DeleteStateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    deleteBulkState(request: dapr_proto_runtime_v1_dapr_pb.DeleteBulkStateRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    deleteBulkState(request: dapr_proto_runtime_v1_dapr_pb.DeleteBulkStateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    deleteBulkState(request: dapr_proto_runtime_v1_dapr_pb.DeleteBulkStateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    executeStateTransaction(request: dapr_proto_runtime_v1_dapr_pb.ExecuteStateTransactionRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    executeStateTransaction(request: dapr_proto_runtime_v1_dapr_pb.ExecuteStateTransactionRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    executeStateTransaction(request: dapr_proto_runtime_v1_dapr_pb.ExecuteStateTransactionRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    publishEvent(request: dapr_proto_runtime_v1_dapr_pb.PublishEventRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    publishEvent(request: dapr_proto_runtime_v1_dapr_pb.PublishEventRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    publishEvent(request: dapr_proto_runtime_v1_dapr_pb.PublishEventRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    bulkPublishEventAlpha1(request: dapr_proto_runtime_v1_dapr_pb.BulkPublishRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.BulkPublishResponse) => void): grpc.ClientUnaryCall;
    bulkPublishEventAlpha1(request: dapr_proto_runtime_v1_dapr_pb.BulkPublishRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.BulkPublishResponse) => void): grpc.ClientUnaryCall;
    bulkPublishEventAlpha1(request: dapr_proto_runtime_v1_dapr_pb.BulkPublishRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.BulkPublishResponse) => void): grpc.ClientUnaryCall;
    subscribeTopicEventsAlpha1(): grpc.ClientDuplexStream<dapr_proto_runtime_v1_dapr_pb.SubscribeTopicEventsRequestAlpha1, dapr_proto_runtime_v1_dapr_pb.SubscribeTopicEventsResponseAlpha1>;
    subscribeTopicEventsAlpha1(options: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<dapr_proto_runtime_v1_dapr_pb.SubscribeTopicEventsRequestAlpha1, dapr_proto_runtime_v1_dapr_pb.SubscribeTopicEventsResponseAlpha1>;
    subscribeTopicEventsAlpha1(metadata: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<dapr_proto_runtime_v1_dapr_pb.SubscribeTopicEventsRequestAlpha1, dapr_proto_runtime_v1_dapr_pb.SubscribeTopicEventsResponseAlpha1>;
    invokeBinding(request: dapr_proto_runtime_v1_dapr_pb.InvokeBindingRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.InvokeBindingResponse) => void): grpc.ClientUnaryCall;
    invokeBinding(request: dapr_proto_runtime_v1_dapr_pb.InvokeBindingRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.InvokeBindingResponse) => void): grpc.ClientUnaryCall;
    invokeBinding(request: dapr_proto_runtime_v1_dapr_pb.InvokeBindingRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.InvokeBindingResponse) => void): grpc.ClientUnaryCall;
    getSecret(request: dapr_proto_runtime_v1_dapr_pb.GetSecretRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetSecretResponse) => void): grpc.ClientUnaryCall;
    getSecret(request: dapr_proto_runtime_v1_dapr_pb.GetSecretRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetSecretResponse) => void): grpc.ClientUnaryCall;
    getSecret(request: dapr_proto_runtime_v1_dapr_pb.GetSecretRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetSecretResponse) => void): grpc.ClientUnaryCall;
    getBulkSecret(request: dapr_proto_runtime_v1_dapr_pb.GetBulkSecretRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetBulkSecretResponse) => void): grpc.ClientUnaryCall;
    getBulkSecret(request: dapr_proto_runtime_v1_dapr_pb.GetBulkSecretRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetBulkSecretResponse) => void): grpc.ClientUnaryCall;
    getBulkSecret(request: dapr_proto_runtime_v1_dapr_pb.GetBulkSecretRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetBulkSecretResponse) => void): grpc.ClientUnaryCall;
    registerActorTimer(request: dapr_proto_runtime_v1_dapr_pb.RegisterActorTimerRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    registerActorTimer(request: dapr_proto_runtime_v1_dapr_pb.RegisterActorTimerRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    registerActorTimer(request: dapr_proto_runtime_v1_dapr_pb.RegisterActorTimerRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    unregisterActorTimer(request: dapr_proto_runtime_v1_dapr_pb.UnregisterActorTimerRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    unregisterActorTimer(request: dapr_proto_runtime_v1_dapr_pb.UnregisterActorTimerRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    unregisterActorTimer(request: dapr_proto_runtime_v1_dapr_pb.UnregisterActorTimerRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    registerActorReminder(request: dapr_proto_runtime_v1_dapr_pb.RegisterActorReminderRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    registerActorReminder(request: dapr_proto_runtime_v1_dapr_pb.RegisterActorReminderRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    registerActorReminder(request: dapr_proto_runtime_v1_dapr_pb.RegisterActorReminderRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    unregisterActorReminder(request: dapr_proto_runtime_v1_dapr_pb.UnregisterActorReminderRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    unregisterActorReminder(request: dapr_proto_runtime_v1_dapr_pb.UnregisterActorReminderRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    unregisterActorReminder(request: dapr_proto_runtime_v1_dapr_pb.UnregisterActorReminderRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    getActorState(request: dapr_proto_runtime_v1_dapr_pb.GetActorStateRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetActorStateResponse) => void): grpc.ClientUnaryCall;
    getActorState(request: dapr_proto_runtime_v1_dapr_pb.GetActorStateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetActorStateResponse) => void): grpc.ClientUnaryCall;
    getActorState(request: dapr_proto_runtime_v1_dapr_pb.GetActorStateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetActorStateResponse) => void): grpc.ClientUnaryCall;
    executeActorStateTransaction(request: dapr_proto_runtime_v1_dapr_pb.ExecuteActorStateTransactionRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    executeActorStateTransaction(request: dapr_proto_runtime_v1_dapr_pb.ExecuteActorStateTransactionRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    executeActorStateTransaction(request: dapr_proto_runtime_v1_dapr_pb.ExecuteActorStateTransactionRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    invokeActor(request: dapr_proto_runtime_v1_dapr_pb.InvokeActorRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.InvokeActorResponse) => void): grpc.ClientUnaryCall;
    invokeActor(request: dapr_proto_runtime_v1_dapr_pb.InvokeActorRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.InvokeActorResponse) => void): grpc.ClientUnaryCall;
    invokeActor(request: dapr_proto_runtime_v1_dapr_pb.InvokeActorRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.InvokeActorResponse) => void): grpc.ClientUnaryCall;
    getConfigurationAlpha1(request: dapr_proto_runtime_v1_dapr_pb.GetConfigurationRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetConfigurationResponse) => void): grpc.ClientUnaryCall;
    getConfigurationAlpha1(request: dapr_proto_runtime_v1_dapr_pb.GetConfigurationRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetConfigurationResponse) => void): grpc.ClientUnaryCall;
    getConfigurationAlpha1(request: dapr_proto_runtime_v1_dapr_pb.GetConfigurationRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetConfigurationResponse) => void): grpc.ClientUnaryCall;
    getConfiguration(request: dapr_proto_runtime_v1_dapr_pb.GetConfigurationRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetConfigurationResponse) => void): grpc.ClientUnaryCall;
    getConfiguration(request: dapr_proto_runtime_v1_dapr_pb.GetConfigurationRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetConfigurationResponse) => void): grpc.ClientUnaryCall;
    getConfiguration(request: dapr_proto_runtime_v1_dapr_pb.GetConfigurationRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetConfigurationResponse) => void): grpc.ClientUnaryCall;
    subscribeConfigurationAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubscribeConfigurationRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<dapr_proto_runtime_v1_dapr_pb.SubscribeConfigurationResponse>;
    subscribeConfigurationAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubscribeConfigurationRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<dapr_proto_runtime_v1_dapr_pb.SubscribeConfigurationResponse>;
    subscribeConfiguration(request: dapr_proto_runtime_v1_dapr_pb.SubscribeConfigurationRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<dapr_proto_runtime_v1_dapr_pb.SubscribeConfigurationResponse>;
    subscribeConfiguration(request: dapr_proto_runtime_v1_dapr_pb.SubscribeConfigurationRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<dapr_proto_runtime_v1_dapr_pb.SubscribeConfigurationResponse>;
    unsubscribeConfigurationAlpha1(request: dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationResponse) => void): grpc.ClientUnaryCall;
    unsubscribeConfigurationAlpha1(request: dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationResponse) => void): grpc.ClientUnaryCall;
    unsubscribeConfigurationAlpha1(request: dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationResponse) => void): grpc.ClientUnaryCall;
    unsubscribeConfiguration(request: dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationResponse) => void): grpc.ClientUnaryCall;
    unsubscribeConfiguration(request: dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationResponse) => void): grpc.ClientUnaryCall;
    unsubscribeConfiguration(request: dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationResponse) => void): grpc.ClientUnaryCall;
    tryLockAlpha1(request: dapr_proto_runtime_v1_dapr_pb.TryLockRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.TryLockResponse) => void): grpc.ClientUnaryCall;
    tryLockAlpha1(request: dapr_proto_runtime_v1_dapr_pb.TryLockRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.TryLockResponse) => void): grpc.ClientUnaryCall;
    tryLockAlpha1(request: dapr_proto_runtime_v1_dapr_pb.TryLockRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.TryLockResponse) => void): grpc.ClientUnaryCall;
    unlockAlpha1(request: dapr_proto_runtime_v1_dapr_pb.UnlockRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.UnlockResponse) => void): grpc.ClientUnaryCall;
    unlockAlpha1(request: dapr_proto_runtime_v1_dapr_pb.UnlockRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.UnlockResponse) => void): grpc.ClientUnaryCall;
    unlockAlpha1(request: dapr_proto_runtime_v1_dapr_pb.UnlockRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.UnlockResponse) => void): grpc.ClientUnaryCall;
    encryptAlpha1(): grpc.ClientDuplexStream<dapr_proto_runtime_v1_dapr_pb.EncryptRequest, dapr_proto_runtime_v1_dapr_pb.EncryptResponse>;
    encryptAlpha1(options: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<dapr_proto_runtime_v1_dapr_pb.EncryptRequest, dapr_proto_runtime_v1_dapr_pb.EncryptResponse>;
    encryptAlpha1(metadata: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<dapr_proto_runtime_v1_dapr_pb.EncryptRequest, dapr_proto_runtime_v1_dapr_pb.EncryptResponse>;
    decryptAlpha1(): grpc.ClientDuplexStream<dapr_proto_runtime_v1_dapr_pb.DecryptRequest, dapr_proto_runtime_v1_dapr_pb.DecryptResponse>;
    decryptAlpha1(options: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<dapr_proto_runtime_v1_dapr_pb.DecryptRequest, dapr_proto_runtime_v1_dapr_pb.DecryptResponse>;
    decryptAlpha1(metadata: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<dapr_proto_runtime_v1_dapr_pb.DecryptRequest, dapr_proto_runtime_v1_dapr_pb.DecryptResponse>;
    getMetadata(request: dapr_proto_runtime_v1_dapr_pb.GetMetadataRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetMetadataResponse) => void): grpc.ClientUnaryCall;
    getMetadata(request: dapr_proto_runtime_v1_dapr_pb.GetMetadataRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetMetadataResponse) => void): grpc.ClientUnaryCall;
    getMetadata(request: dapr_proto_runtime_v1_dapr_pb.GetMetadataRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetMetadataResponse) => void): grpc.ClientUnaryCall;
    setMetadata(request: dapr_proto_runtime_v1_dapr_pb.SetMetadataRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    setMetadata(request: dapr_proto_runtime_v1_dapr_pb.SetMetadataRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    setMetadata(request: dapr_proto_runtime_v1_dapr_pb.SetMetadataRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    subtleGetKeyAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubtleGetKeyRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.SubtleGetKeyResponse) => void): grpc.ClientUnaryCall;
    subtleGetKeyAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubtleGetKeyRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.SubtleGetKeyResponse) => void): grpc.ClientUnaryCall;
    subtleGetKeyAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubtleGetKeyRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.SubtleGetKeyResponse) => void): grpc.ClientUnaryCall;
    subtleEncryptAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubtleEncryptRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.SubtleEncryptResponse) => void): grpc.ClientUnaryCall;
    subtleEncryptAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubtleEncryptRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.SubtleEncryptResponse) => void): grpc.ClientUnaryCall;
    subtleEncryptAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubtleEncryptRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.SubtleEncryptResponse) => void): grpc.ClientUnaryCall;
    subtleDecryptAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubtleDecryptRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.SubtleDecryptResponse) => void): grpc.ClientUnaryCall;
    subtleDecryptAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubtleDecryptRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.SubtleDecryptResponse) => void): grpc.ClientUnaryCall;
    subtleDecryptAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubtleDecryptRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.SubtleDecryptResponse) => void): grpc.ClientUnaryCall;
    subtleWrapKeyAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubtleWrapKeyRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.SubtleWrapKeyResponse) => void): grpc.ClientUnaryCall;
    subtleWrapKeyAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubtleWrapKeyRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.SubtleWrapKeyResponse) => void): grpc.ClientUnaryCall;
    subtleWrapKeyAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubtleWrapKeyRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.SubtleWrapKeyResponse) => void): grpc.ClientUnaryCall;
    subtleUnwrapKeyAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubtleUnwrapKeyRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.SubtleUnwrapKeyResponse) => void): grpc.ClientUnaryCall;
    subtleUnwrapKeyAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubtleUnwrapKeyRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.SubtleUnwrapKeyResponse) => void): grpc.ClientUnaryCall;
    subtleUnwrapKeyAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubtleUnwrapKeyRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.SubtleUnwrapKeyResponse) => void): grpc.ClientUnaryCall;
    subtleSignAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubtleSignRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.SubtleSignResponse) => void): grpc.ClientUnaryCall;
    subtleSignAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubtleSignRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.SubtleSignResponse) => void): grpc.ClientUnaryCall;
    subtleSignAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubtleSignRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.SubtleSignResponse) => void): grpc.ClientUnaryCall;
    subtleVerifyAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubtleVerifyRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.SubtleVerifyResponse) => void): grpc.ClientUnaryCall;
    subtleVerifyAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubtleVerifyRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.SubtleVerifyResponse) => void): grpc.ClientUnaryCall;
    subtleVerifyAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubtleVerifyRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.SubtleVerifyResponse) => void): grpc.ClientUnaryCall;
    startWorkflowAlpha1(request: dapr_proto_runtime_v1_dapr_pb.StartWorkflowRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.StartWorkflowResponse) => void): grpc.ClientUnaryCall;
    startWorkflowAlpha1(request: dapr_proto_runtime_v1_dapr_pb.StartWorkflowRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.StartWorkflowResponse) => void): grpc.ClientUnaryCall;
    startWorkflowAlpha1(request: dapr_proto_runtime_v1_dapr_pb.StartWorkflowRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.StartWorkflowResponse) => void): grpc.ClientUnaryCall;
    getWorkflowAlpha1(request: dapr_proto_runtime_v1_dapr_pb.GetWorkflowRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetWorkflowResponse) => void): grpc.ClientUnaryCall;
    getWorkflowAlpha1(request: dapr_proto_runtime_v1_dapr_pb.GetWorkflowRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetWorkflowResponse) => void): grpc.ClientUnaryCall;
    getWorkflowAlpha1(request: dapr_proto_runtime_v1_dapr_pb.GetWorkflowRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetWorkflowResponse) => void): grpc.ClientUnaryCall;
    purgeWorkflowAlpha1(request: dapr_proto_runtime_v1_dapr_pb.PurgeWorkflowRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    purgeWorkflowAlpha1(request: dapr_proto_runtime_v1_dapr_pb.PurgeWorkflowRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    purgeWorkflowAlpha1(request: dapr_proto_runtime_v1_dapr_pb.PurgeWorkflowRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    terminateWorkflowAlpha1(request: dapr_proto_runtime_v1_dapr_pb.TerminateWorkflowRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    terminateWorkflowAlpha1(request: dapr_proto_runtime_v1_dapr_pb.TerminateWorkflowRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    terminateWorkflowAlpha1(request: dapr_proto_runtime_v1_dapr_pb.TerminateWorkflowRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    pauseWorkflowAlpha1(request: dapr_proto_runtime_v1_dapr_pb.PauseWorkflowRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    pauseWorkflowAlpha1(request: dapr_proto_runtime_v1_dapr_pb.PauseWorkflowRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    pauseWorkflowAlpha1(request: dapr_proto_runtime_v1_dapr_pb.PauseWorkflowRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    resumeWorkflowAlpha1(request: dapr_proto_runtime_v1_dapr_pb.ResumeWorkflowRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    resumeWorkflowAlpha1(request: dapr_proto_runtime_v1_dapr_pb.ResumeWorkflowRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    resumeWorkflowAlpha1(request: dapr_proto_runtime_v1_dapr_pb.ResumeWorkflowRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    raiseEventWorkflowAlpha1(request: dapr_proto_runtime_v1_dapr_pb.RaiseEventWorkflowRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    raiseEventWorkflowAlpha1(request: dapr_proto_runtime_v1_dapr_pb.RaiseEventWorkflowRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    raiseEventWorkflowAlpha1(request: dapr_proto_runtime_v1_dapr_pb.RaiseEventWorkflowRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    startWorkflowBeta1(request: dapr_proto_runtime_v1_dapr_pb.StartWorkflowRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.StartWorkflowResponse) => void): grpc.ClientUnaryCall;
    startWorkflowBeta1(request: dapr_proto_runtime_v1_dapr_pb.StartWorkflowRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.StartWorkflowResponse) => void): grpc.ClientUnaryCall;
    startWorkflowBeta1(request: dapr_proto_runtime_v1_dapr_pb.StartWorkflowRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.StartWorkflowResponse) => void): grpc.ClientUnaryCall;
    getWorkflowBeta1(request: dapr_proto_runtime_v1_dapr_pb.GetWorkflowRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetWorkflowResponse) => void): grpc.ClientUnaryCall;
    getWorkflowBeta1(request: dapr_proto_runtime_v1_dapr_pb.GetWorkflowRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetWorkflowResponse) => void): grpc.ClientUnaryCall;
    getWorkflowBeta1(request: dapr_proto_runtime_v1_dapr_pb.GetWorkflowRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetWorkflowResponse) => void): grpc.ClientUnaryCall;
    purgeWorkflowBeta1(request: dapr_proto_runtime_v1_dapr_pb.PurgeWorkflowRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    purgeWorkflowBeta1(request: dapr_proto_runtime_v1_dapr_pb.PurgeWorkflowRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    purgeWorkflowBeta1(request: dapr_proto_runtime_v1_dapr_pb.PurgeWorkflowRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    terminateWorkflowBeta1(request: dapr_proto_runtime_v1_dapr_pb.TerminateWorkflowRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    terminateWorkflowBeta1(request: dapr_proto_runtime_v1_dapr_pb.TerminateWorkflowRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    terminateWorkflowBeta1(request: dapr_proto_runtime_v1_dapr_pb.TerminateWorkflowRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    pauseWorkflowBeta1(request: dapr_proto_runtime_v1_dapr_pb.PauseWorkflowRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    pauseWorkflowBeta1(request: dapr_proto_runtime_v1_dapr_pb.PauseWorkflowRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    pauseWorkflowBeta1(request: dapr_proto_runtime_v1_dapr_pb.PauseWorkflowRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    resumeWorkflowBeta1(request: dapr_proto_runtime_v1_dapr_pb.ResumeWorkflowRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    resumeWorkflowBeta1(request: dapr_proto_runtime_v1_dapr_pb.ResumeWorkflowRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    resumeWorkflowBeta1(request: dapr_proto_runtime_v1_dapr_pb.ResumeWorkflowRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    raiseEventWorkflowBeta1(request: dapr_proto_runtime_v1_dapr_pb.RaiseEventWorkflowRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    raiseEventWorkflowBeta1(request: dapr_proto_runtime_v1_dapr_pb.RaiseEventWorkflowRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    raiseEventWorkflowBeta1(request: dapr_proto_runtime_v1_dapr_pb.RaiseEventWorkflowRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    shutdown(request: dapr_proto_runtime_v1_dapr_pb.ShutdownRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    shutdown(request: dapr_proto_runtime_v1_dapr_pb.ShutdownRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    shutdown(request: dapr_proto_runtime_v1_dapr_pb.ShutdownRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    scheduleJobAlpha1(request: dapr_proto_runtime_v1_dapr_pb.ScheduleJobRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.ScheduleJobResponse) => void): grpc.ClientUnaryCall;
    scheduleJobAlpha1(request: dapr_proto_runtime_v1_dapr_pb.ScheduleJobRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.ScheduleJobResponse) => void): grpc.ClientUnaryCall;
    scheduleJobAlpha1(request: dapr_proto_runtime_v1_dapr_pb.ScheduleJobRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.ScheduleJobResponse) => void): grpc.ClientUnaryCall;
    getJobAlpha1(request: dapr_proto_runtime_v1_dapr_pb.GetJobRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetJobResponse) => void): grpc.ClientUnaryCall;
    getJobAlpha1(request: dapr_proto_runtime_v1_dapr_pb.GetJobRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetJobResponse) => void): grpc.ClientUnaryCall;
    getJobAlpha1(request: dapr_proto_runtime_v1_dapr_pb.GetJobRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetJobResponse) => void): grpc.ClientUnaryCall;
    deleteJobAlpha1(request: dapr_proto_runtime_v1_dapr_pb.DeleteJobRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.DeleteJobResponse) => void): grpc.ClientUnaryCall;
    deleteJobAlpha1(request: dapr_proto_runtime_v1_dapr_pb.DeleteJobRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.DeleteJobResponse) => void): grpc.ClientUnaryCall;
    deleteJobAlpha1(request: dapr_proto_runtime_v1_dapr_pb.DeleteJobRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.DeleteJobResponse) => void): grpc.ClientUnaryCall;
}

export class DaprClient extends grpc.Client implements IDaprClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public invokeService(request: dapr_proto_runtime_v1_dapr_pb.InvokeServiceRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_common_v1_common_pb.InvokeResponse) => void): grpc.ClientUnaryCall;
    public invokeService(request: dapr_proto_runtime_v1_dapr_pb.InvokeServiceRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_common_v1_common_pb.InvokeResponse) => void): grpc.ClientUnaryCall;
    public invokeService(request: dapr_proto_runtime_v1_dapr_pb.InvokeServiceRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_common_v1_common_pb.InvokeResponse) => void): grpc.ClientUnaryCall;
    public getState(request: dapr_proto_runtime_v1_dapr_pb.GetStateRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetStateResponse) => void): grpc.ClientUnaryCall;
    public getState(request: dapr_proto_runtime_v1_dapr_pb.GetStateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetStateResponse) => void): grpc.ClientUnaryCall;
    public getState(request: dapr_proto_runtime_v1_dapr_pb.GetStateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetStateResponse) => void): grpc.ClientUnaryCall;
    public getBulkState(request: dapr_proto_runtime_v1_dapr_pb.GetBulkStateRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetBulkStateResponse) => void): grpc.ClientUnaryCall;
    public getBulkState(request: dapr_proto_runtime_v1_dapr_pb.GetBulkStateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetBulkStateResponse) => void): grpc.ClientUnaryCall;
    public getBulkState(request: dapr_proto_runtime_v1_dapr_pb.GetBulkStateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetBulkStateResponse) => void): grpc.ClientUnaryCall;
    public saveState(request: dapr_proto_runtime_v1_dapr_pb.SaveStateRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public saveState(request: dapr_proto_runtime_v1_dapr_pb.SaveStateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public saveState(request: dapr_proto_runtime_v1_dapr_pb.SaveStateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public queryStateAlpha1(request: dapr_proto_runtime_v1_dapr_pb.QueryStateRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.QueryStateResponse) => void): grpc.ClientUnaryCall;
    public queryStateAlpha1(request: dapr_proto_runtime_v1_dapr_pb.QueryStateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.QueryStateResponse) => void): grpc.ClientUnaryCall;
    public queryStateAlpha1(request: dapr_proto_runtime_v1_dapr_pb.QueryStateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.QueryStateResponse) => void): grpc.ClientUnaryCall;
    public deleteState(request: dapr_proto_runtime_v1_dapr_pb.DeleteStateRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public deleteState(request: dapr_proto_runtime_v1_dapr_pb.DeleteStateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public deleteState(request: dapr_proto_runtime_v1_dapr_pb.DeleteStateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public deleteBulkState(request: dapr_proto_runtime_v1_dapr_pb.DeleteBulkStateRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public deleteBulkState(request: dapr_proto_runtime_v1_dapr_pb.DeleteBulkStateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public deleteBulkState(request: dapr_proto_runtime_v1_dapr_pb.DeleteBulkStateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public executeStateTransaction(request: dapr_proto_runtime_v1_dapr_pb.ExecuteStateTransactionRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public executeStateTransaction(request: dapr_proto_runtime_v1_dapr_pb.ExecuteStateTransactionRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public executeStateTransaction(request: dapr_proto_runtime_v1_dapr_pb.ExecuteStateTransactionRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public publishEvent(request: dapr_proto_runtime_v1_dapr_pb.PublishEventRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public publishEvent(request: dapr_proto_runtime_v1_dapr_pb.PublishEventRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public publishEvent(request: dapr_proto_runtime_v1_dapr_pb.PublishEventRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public bulkPublishEventAlpha1(request: dapr_proto_runtime_v1_dapr_pb.BulkPublishRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.BulkPublishResponse) => void): grpc.ClientUnaryCall;
    public bulkPublishEventAlpha1(request: dapr_proto_runtime_v1_dapr_pb.BulkPublishRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.BulkPublishResponse) => void): grpc.ClientUnaryCall;
    public bulkPublishEventAlpha1(request: dapr_proto_runtime_v1_dapr_pb.BulkPublishRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.BulkPublishResponse) => void): grpc.ClientUnaryCall;
    public subscribeTopicEventsAlpha1(options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<dapr_proto_runtime_v1_dapr_pb.SubscribeTopicEventsRequestAlpha1, dapr_proto_runtime_v1_dapr_pb.SubscribeTopicEventsResponseAlpha1>;
    public subscribeTopicEventsAlpha1(metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<dapr_proto_runtime_v1_dapr_pb.SubscribeTopicEventsRequestAlpha1, dapr_proto_runtime_v1_dapr_pb.SubscribeTopicEventsResponseAlpha1>;
    public invokeBinding(request: dapr_proto_runtime_v1_dapr_pb.InvokeBindingRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.InvokeBindingResponse) => void): grpc.ClientUnaryCall;
    public invokeBinding(request: dapr_proto_runtime_v1_dapr_pb.InvokeBindingRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.InvokeBindingResponse) => void): grpc.ClientUnaryCall;
    public invokeBinding(request: dapr_proto_runtime_v1_dapr_pb.InvokeBindingRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.InvokeBindingResponse) => void): grpc.ClientUnaryCall;
    public getSecret(request: dapr_proto_runtime_v1_dapr_pb.GetSecretRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetSecretResponse) => void): grpc.ClientUnaryCall;
    public getSecret(request: dapr_proto_runtime_v1_dapr_pb.GetSecretRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetSecretResponse) => void): grpc.ClientUnaryCall;
    public getSecret(request: dapr_proto_runtime_v1_dapr_pb.GetSecretRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetSecretResponse) => void): grpc.ClientUnaryCall;
    public getBulkSecret(request: dapr_proto_runtime_v1_dapr_pb.GetBulkSecretRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetBulkSecretResponse) => void): grpc.ClientUnaryCall;
    public getBulkSecret(request: dapr_proto_runtime_v1_dapr_pb.GetBulkSecretRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetBulkSecretResponse) => void): grpc.ClientUnaryCall;
    public getBulkSecret(request: dapr_proto_runtime_v1_dapr_pb.GetBulkSecretRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetBulkSecretResponse) => void): grpc.ClientUnaryCall;
    public registerActorTimer(request: dapr_proto_runtime_v1_dapr_pb.RegisterActorTimerRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public registerActorTimer(request: dapr_proto_runtime_v1_dapr_pb.RegisterActorTimerRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public registerActorTimer(request: dapr_proto_runtime_v1_dapr_pb.RegisterActorTimerRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public unregisterActorTimer(request: dapr_proto_runtime_v1_dapr_pb.UnregisterActorTimerRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public unregisterActorTimer(request: dapr_proto_runtime_v1_dapr_pb.UnregisterActorTimerRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public unregisterActorTimer(request: dapr_proto_runtime_v1_dapr_pb.UnregisterActorTimerRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public registerActorReminder(request: dapr_proto_runtime_v1_dapr_pb.RegisterActorReminderRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public registerActorReminder(request: dapr_proto_runtime_v1_dapr_pb.RegisterActorReminderRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public registerActorReminder(request: dapr_proto_runtime_v1_dapr_pb.RegisterActorReminderRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public unregisterActorReminder(request: dapr_proto_runtime_v1_dapr_pb.UnregisterActorReminderRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public unregisterActorReminder(request: dapr_proto_runtime_v1_dapr_pb.UnregisterActorReminderRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public unregisterActorReminder(request: dapr_proto_runtime_v1_dapr_pb.UnregisterActorReminderRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public getActorState(request: dapr_proto_runtime_v1_dapr_pb.GetActorStateRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetActorStateResponse) => void): grpc.ClientUnaryCall;
    public getActorState(request: dapr_proto_runtime_v1_dapr_pb.GetActorStateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetActorStateResponse) => void): grpc.ClientUnaryCall;
    public getActorState(request: dapr_proto_runtime_v1_dapr_pb.GetActorStateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetActorStateResponse) => void): grpc.ClientUnaryCall;
    public executeActorStateTransaction(request: dapr_proto_runtime_v1_dapr_pb.ExecuteActorStateTransactionRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public executeActorStateTransaction(request: dapr_proto_runtime_v1_dapr_pb.ExecuteActorStateTransactionRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public executeActorStateTransaction(request: dapr_proto_runtime_v1_dapr_pb.ExecuteActorStateTransactionRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public invokeActor(request: dapr_proto_runtime_v1_dapr_pb.InvokeActorRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.InvokeActorResponse) => void): grpc.ClientUnaryCall;
    public invokeActor(request: dapr_proto_runtime_v1_dapr_pb.InvokeActorRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.InvokeActorResponse) => void): grpc.ClientUnaryCall;
    public invokeActor(request: dapr_proto_runtime_v1_dapr_pb.InvokeActorRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.InvokeActorResponse) => void): grpc.ClientUnaryCall;
    public getConfigurationAlpha1(request: dapr_proto_runtime_v1_dapr_pb.GetConfigurationRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetConfigurationResponse) => void): grpc.ClientUnaryCall;
    public getConfigurationAlpha1(request: dapr_proto_runtime_v1_dapr_pb.GetConfigurationRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetConfigurationResponse) => void): grpc.ClientUnaryCall;
    public getConfigurationAlpha1(request: dapr_proto_runtime_v1_dapr_pb.GetConfigurationRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetConfigurationResponse) => void): grpc.ClientUnaryCall;
    public getConfiguration(request: dapr_proto_runtime_v1_dapr_pb.GetConfigurationRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetConfigurationResponse) => void): grpc.ClientUnaryCall;
    public getConfiguration(request: dapr_proto_runtime_v1_dapr_pb.GetConfigurationRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetConfigurationResponse) => void): grpc.ClientUnaryCall;
    public getConfiguration(request: dapr_proto_runtime_v1_dapr_pb.GetConfigurationRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetConfigurationResponse) => void): grpc.ClientUnaryCall;
    public subscribeConfigurationAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubscribeConfigurationRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<dapr_proto_runtime_v1_dapr_pb.SubscribeConfigurationResponse>;
    public subscribeConfigurationAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubscribeConfigurationRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<dapr_proto_runtime_v1_dapr_pb.SubscribeConfigurationResponse>;
    public subscribeConfiguration(request: dapr_proto_runtime_v1_dapr_pb.SubscribeConfigurationRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<dapr_proto_runtime_v1_dapr_pb.SubscribeConfigurationResponse>;
    public subscribeConfiguration(request: dapr_proto_runtime_v1_dapr_pb.SubscribeConfigurationRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<dapr_proto_runtime_v1_dapr_pb.SubscribeConfigurationResponse>;
    public unsubscribeConfigurationAlpha1(request: dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationResponse) => void): grpc.ClientUnaryCall;
    public unsubscribeConfigurationAlpha1(request: dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationResponse) => void): grpc.ClientUnaryCall;
    public unsubscribeConfigurationAlpha1(request: dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationResponse) => void): grpc.ClientUnaryCall;
    public unsubscribeConfiguration(request: dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationResponse) => void): grpc.ClientUnaryCall;
    public unsubscribeConfiguration(request: dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationResponse) => void): grpc.ClientUnaryCall;
    public unsubscribeConfiguration(request: dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.UnsubscribeConfigurationResponse) => void): grpc.ClientUnaryCall;
    public tryLockAlpha1(request: dapr_proto_runtime_v1_dapr_pb.TryLockRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.TryLockResponse) => void): grpc.ClientUnaryCall;
    public tryLockAlpha1(request: dapr_proto_runtime_v1_dapr_pb.TryLockRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.TryLockResponse) => void): grpc.ClientUnaryCall;
    public tryLockAlpha1(request: dapr_proto_runtime_v1_dapr_pb.TryLockRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.TryLockResponse) => void): grpc.ClientUnaryCall;
    public unlockAlpha1(request: dapr_proto_runtime_v1_dapr_pb.UnlockRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.UnlockResponse) => void): grpc.ClientUnaryCall;
    public unlockAlpha1(request: dapr_proto_runtime_v1_dapr_pb.UnlockRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.UnlockResponse) => void): grpc.ClientUnaryCall;
    public unlockAlpha1(request: dapr_proto_runtime_v1_dapr_pb.UnlockRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.UnlockResponse) => void): grpc.ClientUnaryCall;
    public encryptAlpha1(options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<dapr_proto_runtime_v1_dapr_pb.EncryptRequest, dapr_proto_runtime_v1_dapr_pb.EncryptResponse>;
    public encryptAlpha1(metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<dapr_proto_runtime_v1_dapr_pb.EncryptRequest, dapr_proto_runtime_v1_dapr_pb.EncryptResponse>;
    public decryptAlpha1(options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<dapr_proto_runtime_v1_dapr_pb.DecryptRequest, dapr_proto_runtime_v1_dapr_pb.DecryptResponse>;
    public decryptAlpha1(metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<dapr_proto_runtime_v1_dapr_pb.DecryptRequest, dapr_proto_runtime_v1_dapr_pb.DecryptResponse>;
    public getMetadata(request: dapr_proto_runtime_v1_dapr_pb.GetMetadataRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetMetadataResponse) => void): grpc.ClientUnaryCall;
    public getMetadata(request: dapr_proto_runtime_v1_dapr_pb.GetMetadataRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetMetadataResponse) => void): grpc.ClientUnaryCall;
    public getMetadata(request: dapr_proto_runtime_v1_dapr_pb.GetMetadataRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetMetadataResponse) => void): grpc.ClientUnaryCall;
    public setMetadata(request: dapr_proto_runtime_v1_dapr_pb.SetMetadataRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public setMetadata(request: dapr_proto_runtime_v1_dapr_pb.SetMetadataRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public setMetadata(request: dapr_proto_runtime_v1_dapr_pb.SetMetadataRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public subtleGetKeyAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubtleGetKeyRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.SubtleGetKeyResponse) => void): grpc.ClientUnaryCall;
    public subtleGetKeyAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubtleGetKeyRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.SubtleGetKeyResponse) => void): grpc.ClientUnaryCall;
    public subtleGetKeyAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubtleGetKeyRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.SubtleGetKeyResponse) => void): grpc.ClientUnaryCall;
    public subtleEncryptAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubtleEncryptRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.SubtleEncryptResponse) => void): grpc.ClientUnaryCall;
    public subtleEncryptAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubtleEncryptRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.SubtleEncryptResponse) => void): grpc.ClientUnaryCall;
    public subtleEncryptAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubtleEncryptRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.SubtleEncryptResponse) => void): grpc.ClientUnaryCall;
    public subtleDecryptAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubtleDecryptRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.SubtleDecryptResponse) => void): grpc.ClientUnaryCall;
    public subtleDecryptAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubtleDecryptRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.SubtleDecryptResponse) => void): grpc.ClientUnaryCall;
    public subtleDecryptAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubtleDecryptRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.SubtleDecryptResponse) => void): grpc.ClientUnaryCall;
    public subtleWrapKeyAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubtleWrapKeyRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.SubtleWrapKeyResponse) => void): grpc.ClientUnaryCall;
    public subtleWrapKeyAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubtleWrapKeyRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.SubtleWrapKeyResponse) => void): grpc.ClientUnaryCall;
    public subtleWrapKeyAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubtleWrapKeyRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.SubtleWrapKeyResponse) => void): grpc.ClientUnaryCall;
    public subtleUnwrapKeyAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubtleUnwrapKeyRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.SubtleUnwrapKeyResponse) => void): grpc.ClientUnaryCall;
    public subtleUnwrapKeyAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubtleUnwrapKeyRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.SubtleUnwrapKeyResponse) => void): grpc.ClientUnaryCall;
    public subtleUnwrapKeyAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubtleUnwrapKeyRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.SubtleUnwrapKeyResponse) => void): grpc.ClientUnaryCall;
    public subtleSignAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubtleSignRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.SubtleSignResponse) => void): grpc.ClientUnaryCall;
    public subtleSignAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubtleSignRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.SubtleSignResponse) => void): grpc.ClientUnaryCall;
    public subtleSignAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubtleSignRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.SubtleSignResponse) => void): grpc.ClientUnaryCall;
    public subtleVerifyAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubtleVerifyRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.SubtleVerifyResponse) => void): grpc.ClientUnaryCall;
    public subtleVerifyAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubtleVerifyRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.SubtleVerifyResponse) => void): grpc.ClientUnaryCall;
    public subtleVerifyAlpha1(request: dapr_proto_runtime_v1_dapr_pb.SubtleVerifyRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.SubtleVerifyResponse) => void): grpc.ClientUnaryCall;
    public startWorkflowAlpha1(request: dapr_proto_runtime_v1_dapr_pb.StartWorkflowRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.StartWorkflowResponse) => void): grpc.ClientUnaryCall;
    public startWorkflowAlpha1(request: dapr_proto_runtime_v1_dapr_pb.StartWorkflowRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.StartWorkflowResponse) => void): grpc.ClientUnaryCall;
    public startWorkflowAlpha1(request: dapr_proto_runtime_v1_dapr_pb.StartWorkflowRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.StartWorkflowResponse) => void): grpc.ClientUnaryCall;
    public getWorkflowAlpha1(request: dapr_proto_runtime_v1_dapr_pb.GetWorkflowRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetWorkflowResponse) => void): grpc.ClientUnaryCall;
    public getWorkflowAlpha1(request: dapr_proto_runtime_v1_dapr_pb.GetWorkflowRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetWorkflowResponse) => void): grpc.ClientUnaryCall;
    public getWorkflowAlpha1(request: dapr_proto_runtime_v1_dapr_pb.GetWorkflowRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetWorkflowResponse) => void): grpc.ClientUnaryCall;
    public purgeWorkflowAlpha1(request: dapr_proto_runtime_v1_dapr_pb.PurgeWorkflowRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public purgeWorkflowAlpha1(request: dapr_proto_runtime_v1_dapr_pb.PurgeWorkflowRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public purgeWorkflowAlpha1(request: dapr_proto_runtime_v1_dapr_pb.PurgeWorkflowRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public terminateWorkflowAlpha1(request: dapr_proto_runtime_v1_dapr_pb.TerminateWorkflowRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public terminateWorkflowAlpha1(request: dapr_proto_runtime_v1_dapr_pb.TerminateWorkflowRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public terminateWorkflowAlpha1(request: dapr_proto_runtime_v1_dapr_pb.TerminateWorkflowRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public pauseWorkflowAlpha1(request: dapr_proto_runtime_v1_dapr_pb.PauseWorkflowRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public pauseWorkflowAlpha1(request: dapr_proto_runtime_v1_dapr_pb.PauseWorkflowRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public pauseWorkflowAlpha1(request: dapr_proto_runtime_v1_dapr_pb.PauseWorkflowRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public resumeWorkflowAlpha1(request: dapr_proto_runtime_v1_dapr_pb.ResumeWorkflowRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public resumeWorkflowAlpha1(request: dapr_proto_runtime_v1_dapr_pb.ResumeWorkflowRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public resumeWorkflowAlpha1(request: dapr_proto_runtime_v1_dapr_pb.ResumeWorkflowRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public raiseEventWorkflowAlpha1(request: dapr_proto_runtime_v1_dapr_pb.RaiseEventWorkflowRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public raiseEventWorkflowAlpha1(request: dapr_proto_runtime_v1_dapr_pb.RaiseEventWorkflowRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public raiseEventWorkflowAlpha1(request: dapr_proto_runtime_v1_dapr_pb.RaiseEventWorkflowRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public startWorkflowBeta1(request: dapr_proto_runtime_v1_dapr_pb.StartWorkflowRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.StartWorkflowResponse) => void): grpc.ClientUnaryCall;
    public startWorkflowBeta1(request: dapr_proto_runtime_v1_dapr_pb.StartWorkflowRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.StartWorkflowResponse) => void): grpc.ClientUnaryCall;
    public startWorkflowBeta1(request: dapr_proto_runtime_v1_dapr_pb.StartWorkflowRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.StartWorkflowResponse) => void): grpc.ClientUnaryCall;
    public getWorkflowBeta1(request: dapr_proto_runtime_v1_dapr_pb.GetWorkflowRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetWorkflowResponse) => void): grpc.ClientUnaryCall;
    public getWorkflowBeta1(request: dapr_proto_runtime_v1_dapr_pb.GetWorkflowRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetWorkflowResponse) => void): grpc.ClientUnaryCall;
    public getWorkflowBeta1(request: dapr_proto_runtime_v1_dapr_pb.GetWorkflowRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetWorkflowResponse) => void): grpc.ClientUnaryCall;
    public purgeWorkflowBeta1(request: dapr_proto_runtime_v1_dapr_pb.PurgeWorkflowRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public purgeWorkflowBeta1(request: dapr_proto_runtime_v1_dapr_pb.PurgeWorkflowRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public purgeWorkflowBeta1(request: dapr_proto_runtime_v1_dapr_pb.PurgeWorkflowRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public terminateWorkflowBeta1(request: dapr_proto_runtime_v1_dapr_pb.TerminateWorkflowRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public terminateWorkflowBeta1(request: dapr_proto_runtime_v1_dapr_pb.TerminateWorkflowRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public terminateWorkflowBeta1(request: dapr_proto_runtime_v1_dapr_pb.TerminateWorkflowRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public pauseWorkflowBeta1(request: dapr_proto_runtime_v1_dapr_pb.PauseWorkflowRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public pauseWorkflowBeta1(request: dapr_proto_runtime_v1_dapr_pb.PauseWorkflowRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public pauseWorkflowBeta1(request: dapr_proto_runtime_v1_dapr_pb.PauseWorkflowRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public resumeWorkflowBeta1(request: dapr_proto_runtime_v1_dapr_pb.ResumeWorkflowRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public resumeWorkflowBeta1(request: dapr_proto_runtime_v1_dapr_pb.ResumeWorkflowRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public resumeWorkflowBeta1(request: dapr_proto_runtime_v1_dapr_pb.ResumeWorkflowRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public raiseEventWorkflowBeta1(request: dapr_proto_runtime_v1_dapr_pb.RaiseEventWorkflowRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public raiseEventWorkflowBeta1(request: dapr_proto_runtime_v1_dapr_pb.RaiseEventWorkflowRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public raiseEventWorkflowBeta1(request: dapr_proto_runtime_v1_dapr_pb.RaiseEventWorkflowRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public shutdown(request: dapr_proto_runtime_v1_dapr_pb.ShutdownRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public shutdown(request: dapr_proto_runtime_v1_dapr_pb.ShutdownRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public shutdown(request: dapr_proto_runtime_v1_dapr_pb.ShutdownRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public scheduleJobAlpha1(request: dapr_proto_runtime_v1_dapr_pb.ScheduleJobRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.ScheduleJobResponse) => void): grpc.ClientUnaryCall;
    public scheduleJobAlpha1(request: dapr_proto_runtime_v1_dapr_pb.ScheduleJobRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.ScheduleJobResponse) => void): grpc.ClientUnaryCall;
    public scheduleJobAlpha1(request: dapr_proto_runtime_v1_dapr_pb.ScheduleJobRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.ScheduleJobResponse) => void): grpc.ClientUnaryCall;
    public getJobAlpha1(request: dapr_proto_runtime_v1_dapr_pb.GetJobRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetJobResponse) => void): grpc.ClientUnaryCall;
    public getJobAlpha1(request: dapr_proto_runtime_v1_dapr_pb.GetJobRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetJobResponse) => void): grpc.ClientUnaryCall;
    public getJobAlpha1(request: dapr_proto_runtime_v1_dapr_pb.GetJobRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.GetJobResponse) => void): grpc.ClientUnaryCall;
    public deleteJobAlpha1(request: dapr_proto_runtime_v1_dapr_pb.DeleteJobRequest, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.DeleteJobResponse) => void): grpc.ClientUnaryCall;
    public deleteJobAlpha1(request: dapr_proto_runtime_v1_dapr_pb.DeleteJobRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.DeleteJobResponse) => void): grpc.ClientUnaryCall;
    public deleteJobAlpha1(request: dapr_proto_runtime_v1_dapr_pb.DeleteJobRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: dapr_proto_runtime_v1_dapr_pb.DeleteJobResponse) => void): grpc.ClientUnaryCall;
}
