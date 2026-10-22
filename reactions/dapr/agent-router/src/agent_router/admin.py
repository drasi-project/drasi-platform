# Copyright 2026 The Drasi Authors.
# Licensed under the Apache License, Version 2.0.

"""Private operator inspection and cleanup, separate from the agent protocol."""

import logging
from collections.abc import Callable, Coroutine
from typing import Annotated, Any, Literal

from drasi_agent_router_contracts import Subscriber, SubscribeRequest, ToolError, to_wire
from drasi_agent_router_contracts.models.ToolError import Code
from fastapi import APIRouter, Query, Request
from fastapi.exceptions import RequestValidationError
from fastapi.routing import APIRoute
from jsonschema.exceptions import ValidationError as SchemaValidationError
from pydantic import (
    AfterValidator,
    BaseModel,
    ConfigDict,
    Field,
    StrictStr,
    model_validator,
)
from starlette.exceptions import HTTPException
from starlette.responses import JSONResponse, Response

from .subscriptions import (
    SubscriptionError,
    SubscriptionRegistry,
    SubscriptionRule,
    subscriber_identity,
    validate_query_id,
)

logger = logging.getLogger(__name__)
QueryId = Annotated[StrictStr, Field(min_length=1), AfterValidator(validate_query_id)]


def _validate_subscriber(value: Subscriber) -> Subscriber:
    try:
        subscriber_identity(value)
    except (SchemaValidationError, ValueError):
        raise ValueError("subscriber identity does not match the router contract") from None
    return value


ValidatedSubscriber = Annotated[Subscriber, AfterValidator(_validate_subscriber)]


class RuleFilters(BaseModel):
    model_config = ConfigDict(extra="forbid")

    query_id: QueryId | None = None
    namespace: StrictStr | None = None
    app_id: StrictStr | None = None
    agent_name: StrictStr | None = None

    @model_validator(mode="after")
    def complete_subscriber(self) -> "RuleFilters":
        self.get_subscriber()
        return self

    def get_subscriber(self) -> Subscriber | None:
        if self.namespace is None and self.app_id is None and self.agent_name is None:
            return None
        if self.namespace is None or self.app_id is None or self.agent_name is None:
            raise ValueError("namespace, app_id, and agent_name must be supplied together")
        return _validate_subscriber(
            Subscriber(
                namespace=self.namespace, app_id=self.app_id, agent_name=self.agent_name
            )
        )


class RuleView(SubscribeRequest):
    topic_name: str

    @classmethod
    def from_rule(cls, rule: SubscriptionRule) -> "RuleView":
        return cls(**to_wire(rule.request()), topic_name=rule.topic_name)


class RuleList(BaseModel):
    router_id: str
    view: Literal["routing_snapshot"] = "routing_snapshot"
    rules: list[RuleView]


class RemoveSubscriberRulesRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    subscriber: ValidatedSubscriber


class RemoveRuleRequest(RemoveSubscriberRulesRequest):
    query_id: QueryId


class RemoveRuleResponse(BaseModel):
    removed: bool


class RemoveSubscriberRulesResponse(BaseModel):
    removed_count: int


def _error(status_code: int, code: Code, message: str) -> JSONResponse:
    return JSONResponse(
        status_code=status_code, content=to_wire(ToolError(code=code, message=message))
    )


def create_admin_router(
    subscriptions: SubscriptionRegistry, is_ready: Callable[[], bool]
) -> APIRouter:
    class AdminRoute(APIRoute):
        def get_route_handler(self) -> Callable[[Request], Coroutine[Any, Any, Response]]:
            handler = super().get_route_handler()

            async def handle(request: Request) -> Response:
                context = {
                    "router_id": subscriptions.router_id,
                    "operation": self.name,
                    "outcome": "error",
                }
                if not is_ready():
                    logger.warning("router_admin_not_ready", extra=context)
                    return _error(
                        503, Code.state_unavailable, "Router initialization is incomplete"
                    )
                try:
                    return await handler(request)
                except (RequestValidationError, HTTPException) as error:
                    # FastAPI wraps invalid JSON byte encodings in HTTP 400.
                    if isinstance(error, HTTPException) and (
                        error.status_code != 400
                        or not isinstance(error.__cause__, UnicodeDecodeError)
                    ):
                        raise
                    logger.warning("router_admin_invalid_arguments", extra=context)
                    return _error(
                        422,
                        Code.invalid_arguments,
                        "Arguments do not match the operator API contract",
                    )
                except SubscriptionError as error:
                    logger.warning(
                        "router_admin_operation_failed",
                        extra={**context, "router_error_code": error.code.value},
                    )
                    return _error(503, error.code, str(error))

            return handle

    router = APIRouter(
        prefix="/admin",
        tags=["Administration"],
        route_class=AdminRoute,
        responses={422: {"model": ToolError}, 503: {"model": ToolError}},
    )

    @router.get("/rules")
    async def list_rules(filters: Annotated[RuleFilters, Query()]) -> RuleList:
        rules = subscriptions.list_rules(
            query_id=filters.query_id, subscriber=filters.get_subscriber()
        )
        return RuleList(
            router_id=subscriptions.router_id,
            rules=[RuleView.from_rule(rule) for rule in rules],
        )

    @router.post("/rules/remove")
    async def remove_rule(request: RemoveRuleRequest) -> RemoveRuleResponse:
        return RemoveRuleResponse(
            removed=await subscriptions.remove_rule(request.query_id, request.subscriber)
        )

    @router.post("/subscribers/remove-rules")
    async def remove_subscriber_rules(
        request: RemoveSubscriberRulesRequest,
    ) -> RemoveSubscriberRulesResponse:
        return RemoveSubscriberRulesResponse(
            removed_count=await subscriptions.remove_subscriber_rules(request.subscriber)
        )

    return router
