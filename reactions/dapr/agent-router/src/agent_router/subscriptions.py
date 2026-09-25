# Copyright 2026 The Drasi Authors.
# Licensed under the Apache License, Version 2.0.

"""Durable subscription mutations and isolated, storage-free routing snapshots."""

import asyncio
import hashlib
import json
import logging
from collections.abc import Awaitable
from dataclasses import dataclass
from typing import Literal, NamedTuple, TypeVar

from dapr.aio.clients import DaprClient
from dapr.clients.exceptions import DaprInternalError
from dapr.clients.grpc._state import Concurrency, Consistency, StateOptions
from drasi_agent_router_contracts import (
    Subscriber,
    SubscribeRequest,
    SubscribeResponse,
    UnsubscribeRequest,
    UnsubscribeResponse,
    agent_inbox_topic,
    parse,
    to_wire,
)
from drasi_agent_router_contracts.models.Operation import Operation
from drasi_agent_router_contracts.models.SubscribeResponse import Status
from drasi_agent_router_contracts.models.ToolError import Code
from grpc import RpcError
from jsonschema.exceptions import ValidationError as SchemaValidationError
from pydantic import ValidationError

logger = logging.getLogger(__name__)
_STATE_TIMEOUT_SECONDS = 30
_FORMAT_VERSION = 1
ResultT = TypeVar("ResultT")


class SubscriptionError(Exception):
    """A sanitized error suitable for the shared MCP error contract."""

    def __init__(self, code: Code, message: str) -> None:
        super().__init__(message)
        self.code = code


class SubscriberIdentity(NamedTuple):
    namespace: str
    app_id: str
    agent_name: str


RuleKey = tuple[str, SubscriberIdentity]


def subscriber_identity(subscriber: Subscriber) -> SubscriberIdentity:
    to_wire(subscriber)
    identity = SubscriberIdentity(
        subscriber.namespace, subscriber.app_id, subscriber.agent_name
    )
    for value in identity:
        value.encode("utf-8")
    return identity


def validate_query_id(query_id: str) -> str:
    if not isinstance(query_id, str) or not query_id:
        raise ValueError("query_id must be a non-empty string")
    query_id.encode("utf-8")
    return query_id


def _key(request: SubscribeRequest | UnsubscribeRequest) -> RuleKey:
    to_wire(request)
    request.subscription_incarnation.encode("utf-8")
    return validate_query_id(request.query_id), subscriber_identity(request.subscriber)


@dataclass(frozen=True)
class SubscriptionRule:
    query_id: str
    subscriber: SubscriberIdentity
    operations: frozenset[Operation]
    subscription_incarnation: str
    topic_name: str

    @property
    def key(self) -> RuleKey:
        return self.query_id, self.subscriber

    def request(self) -> SubscribeRequest:
        return SubscribeRequest(
            query_id=self.query_id,
            subscriber=Subscriber(**self.subscriber._asdict()),
            operations=[op for op in Operation if op in self.operations],
            subscription_incarnation=self.subscription_incarnation,
        )


class SubscriptionRegistry:
    def __init__(self, router_id: str, state_store_name: str) -> None:
        self.router_id = router_id
        self.state_store_name = state_store_name
        digest = hashlib.sha256(router_id.encode("utf-8")).hexdigest()
        self.state_key = f"drasi-agent-router:subscriptions:{digest}"
        self._client: DaprClient | None = None
        self._rules: dict[RuleKey, SubscriptionRule] = {}
        self._initialized = False
        self._lock = asyncio.Lock()

    async def initialize(self) -> None:
        async with self._lock:
            if self._client is not None:
                raise RuntimeError("subscription registry is already initialized")
            logger.info(
                "router_subscriptions_initializing",
                extra={**self._log_context(), "operation": "initialize"},
            )
            try:
                self._client = DaprClient()
            except (DaprInternalError, RpcError, TimeoutError):
                raise self._state_error(
                    "Unable to initialize the subscription state client"
                ) from None
            state = await self._read()
            if state is None:
                # Only the single supported writer may bootstrap the root document.
                await self._write({}, etag=None)
                state = await self._read()
            if state is None:
                raise self._state_error("Subscription registry bootstrap did not persist")
            self._rules, _ = state
            self._initialized = True
            logger.info(
                "router_subscriptions_loaded",
                extra={
                    **self._log_context(),
                    "operation": "initialize",
                    "outcome": "success",
                    "rule_count": len(self._rules),
                },
            )

    async def close(self) -> None:
        async with self._lock:
            self._initialized = False
            client, self._client = self._client, None
            if client is not None:
                await client.close()
            logger.info(
                "router_subscriptions_closed",
                extra={
                    **self._log_context(),
                    "operation": "close",
                    "outcome": "success",
                },
            )

    def snapshot(self, query_id: str) -> tuple[SubscriptionRule, ...]:
        self._require_initialized()
        return tuple(rule for rule in self._rules.values() if rule.query_id == query_id)

    def list_rules(
        self, *, query_id: str | None = None, subscriber: Subscriber | None = None
    ) -> tuple[SubscriptionRule, ...]:
        if query_id is not None:
            validate_query_id(query_id)
        identity = subscriber_identity(subscriber) if subscriber is not None else None
        self._require_initialized()
        return tuple(
            rule
            for key, rule in sorted(self._rules.items())
            if (query_id is None or key[0] == query_id)
            and (identity is None or key[1] == identity)
        )

    async def subscribe(self, request: SubscribeRequest) -> SubscribeResponse:
        rule = self._rule(request)
        async with self._lock:
            self._require_initialized()
            rules, etag = await self._read_existing()
            current = rules.get(rule.key)
            self._check_incarnation(current, rule.subscription_incarnation)
            result = SubscribeResponse(
                query_id=rule.query_id,
                operations=rule.request().operations,
                subscription_incarnation=rule.subscription_incarnation,
                topic_name=rule.topic_name,
                status=Status.updated if current is not None else Status.created,
            )
            rules[rule.key] = rule
            await self._write(rules, etag)
            self._rules = rules
            logger.info(
                "router_subscription_upserted",
                extra={
                    **self._log_context(),
                    "drasi_query_id": rule.query_id,
                    "subscriber": rule.subscriber._asdict(),
                    "subscription_status": result.status.value,
                    "operation": "subscribe",
                    "outcome": "success",
                },
            )
            return result

    async def unsubscribe(self, request: UnsubscribeRequest) -> UnsubscribeResponse:
        query_id, identity = _key(request)
        removed = await self._remove_rules(
            identity,
            query_id=query_id,
            incarnation=request.subscription_incarnation,
            operation="unsubscribe",
        )
        return UnsubscribeResponse(query_id=query_id, removed=bool(removed))

    async def remove_rule(self, query_id: str, subscriber: Subscriber) -> bool:
        removed = await self._remove_rules(
            subscriber_identity(subscriber),
            query_id=validate_query_id(query_id),
            operation="remove_rule",
        )
        return bool(removed)

    async def remove_subscriber_rules(self, subscriber: Subscriber) -> int:
        return await self._remove_rules(
            subscriber_identity(subscriber), operation="remove_subscriber_rules"
        )

    async def _remove_rules(
        self,
        identity: SubscriberIdentity,
        *,
        query_id: str | None = None,
        incarnation: str | None = None,
        operation: Literal["unsubscribe", "remove_rule", "remove_subscriber_rules"],
    ) -> int:
        context = {
            **self._log_context(),
            "subscriber": identity._asdict(),
            "operation": operation,
        }
        if query_id is not None:
            context["drasi_query_id"] = query_id
        try:
            async with self._lock:
                self._require_initialized()
                rules, etag = await self._read_existing()
                matches = [
                    key
                    for key in rules
                    if key[1] == identity and (query_id is None or key[0] == query_id)
                ]
                for key in matches:
                    if incarnation is not None:
                        self._check_incarnation(rules[key], incarnation)
                    del rules[key]
                if matches:
                    await self._write(rules, etag)
                self._rules = rules
                logger.info(
                    "router_subscription_removed"
                    if operation == "unsubscribe"
                    else "router_rules_cleaned",
                    extra={
                        **context,
                        "outcome": "success",
                        "subscription_removed": bool(matches),
                        "removed_count": len(matches),
                    },
                )
                return len(matches)
        except SubscriptionError as error:
            logger.warning(
                "router_rule_removal_failed",
                extra={
                    **context,
                    "outcome": "error",
                    "router_error_code": error.code.value,
                },
            )
            raise

    def _rule(self, request: SubscribeRequest) -> SubscriptionRule:
        query_id, subscriber = _key(request)
        return SubscriptionRule(
            query_id=query_id,
            subscriber=subscriber,
            operations=frozenset(request.operations),
            subscription_incarnation=request.subscription_incarnation,
            topic_name=agent_inbox_topic(self.router_id, request.subscriber),
        )

    @staticmethod
    def _check_incarnation(rule: SubscriptionRule | None, incarnation: str) -> None:
        if rule is not None and rule.subscription_incarnation != incarnation:
            raise SubscriptionError(
                Code.incarnation_conflict,
                "A subscription with a different incarnation already exists",
            )

    async def _read_existing(self) -> tuple[dict[RuleKey, SubscriptionRule], str]:
        state = await self._read()
        if state is None:
            raise self._state_error(
                "Subscription registry disappeared; restore its state before modifying rules"
            )
        return state

    async def _read(self) -> tuple[dict[RuleKey, SubscriptionRule], str] | None:
        if self._client is None:
            raise self._state_error("Subscription state client is not initialized")
        response = await self._state_call(
            self._client.get_state(
                store_name=self.state_store_name,
                key=self.state_key,
            ),
            "read",
        )
        if not response.data:
            if response.etag:
                raise self._state_error("Stored subscription registry has an empty payload")
            return None
        if not response.etag:
            raise self._state_error(
                "Subscription state store must supply ETags for conditional writes"
            )
        return self._decode(response.data), response.etag

    def _decode(self, data: bytes) -> dict[RuleKey, SubscriptionRule]:
        try:
            document = json.loads(data)
        except (ValueError, UnicodeDecodeError):
            raise self._state_error(
                "Stored subscription registry is not valid JSON"
            ) from None
        if not isinstance(document, dict) or set(document) != {
            "format_version",
            "router_id",
            "rules",
        }:
            raise self._state_error("Stored subscription registry has invalid fields")
        if (
            type(document["format_version"]) is not int
            or document["format_version"] != _FORMAT_VERSION
        ):
            raise self._state_error(
                "Unsupported subscription registry format; expected format_version 1"
            )
        if document["router_id"] != self.router_id:
            raise self._state_error(
                "Stored subscription registry belongs to a different router"
            )
        if not isinstance(document["rules"], list):
            raise self._state_error("Stored subscription registry rules must be an array")
        rules: dict[RuleKey, SubscriptionRule] = {}
        try:
            for entry in document["rules"]:
                if not isinstance(entry, dict) or "topic_name" not in entry:
                    raise ValueError("invalid rule")
                arguments = {
                    key: value for key, value in entry.items() if key != "topic_name"
                }
                rule = self._rule(parse(SubscribeRequest, arguments))
                if entry["topic_name"] != rule.topic_name or rule.key in rules:
                    raise ValueError("invalid topic or duplicate rule")
                rules[rule.key] = rule
        except (SchemaValidationError, ValidationError, ValueError):
            raise self._state_error(
                "Stored subscription registry contains invalid or duplicate rules"
            ) from None
        return rules

    async def _write(
        self, rules: dict[RuleKey, SubscriptionRule], etag: str | None
    ) -> None:
        if self._client is None:
            raise self._state_error("Subscription state client is not initialized")
        document = {
            "format_version": _FORMAT_VERSION,
            "router_id": self.router_id,
            "rules": [
                {**to_wire(rule.request()), "topic_name": rule.topic_name}
                for _, rule in sorted(rules.items())
            ],
        }
        await self._state_call(
            self._client.save_state(
                store_name=self.state_store_name,
                key=self.state_key,
                value=json.dumps(document, ensure_ascii=False),
                etag=etag,
                options=StateOptions(
                    concurrency=Concurrency.first_write,
                    consistency=Consistency.strong,
                ),
            ),
            "write",
        )

    async def _state_call(self, request: Awaitable[ResultT], operation: str) -> ResultT:
        try:
            return await asyncio.wait_for(request, timeout=_STATE_TIMEOUT_SECONDS)
        except (DaprInternalError, RpcError, asyncio.TimeoutError):
            raise self._state_error(
                f"Subscription state {operation} was not confirmed; "
                "retry the complete operation",
                operation=operation,
            ) from None

    def _require_initialized(self) -> None:
        if not self._initialized:
            raise self._state_error("Subscription registry initialization is incomplete")

    def _state_error(
        self, message: str, *, operation: str = "state"
    ) -> SubscriptionError:
        logger.error(
            "router_subscription_state_failed",
            extra={
                **self._log_context(),
                "operation": operation,
                "outcome": "error",
                "state_failure": message,
            },
        )
        return SubscriptionError(Code.state_unavailable, message)

    def _log_context(self) -> dict[str, str]:
        return {"router_id": self.router_id, "state_store": self.state_store_name}
