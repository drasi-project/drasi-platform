# Copyright 2026 The Drasi Authors.
# Licensed under the Apache License, Version 2.0.

"""Validated metadata from the Reaction SDK's static query registrations."""

from collections.abc import Mapping
from pathlib import Path
from typing import TextIO

from drasi.reaction import QueryRegistration
from drasi.reaction.utils import yaml_query_configs
from drasi_agent_router_contracts import ListQueriesResponse, parse, to_wire
from drasi_agent_router_contracts.models.Query import Query
from jsonschema.exceptions import ValidationError as SchemaValidationError
from pydantic import ValidationError
from yaml import YAMLError


def parse_query_config(query_file: TextIO) -> Query:
    query_id = Path(query_file.name).name
    try:
        metadata = yaml_query_configs(query_file)
        if not isinstance(metadata, dict) or "query_id" in metadata:
            raise ValueError("metadata must be an object without a query_id")
        query = parse(Query, {"query_id": query_id, **metadata})
        if any(
            not value.strip()
            for value in (query.title, query.description, query.usage)
            if value is not None
        ):
            raise ValueError("catalog metadata must not be blank")
        return query
    except (YAMLError, SchemaValidationError, ValidationError, ValueError):
        raise ValueError(
            f"Invalid catalog metadata for query {query_id!r}: expected non-empty "
            "title and description strings, optional non-empty usage, and no "
            "other fields"
        ) from None


def build_catalog(
    router_id: str,
    registrations: Mapping[str, QueryRegistration[Query]],
) -> ListQueriesResponse:
    queries = []
    for query_id, registration in registrations.items():
        query = registration.config
        if query is None or query.query_id != query_id:
            raise ValueError(f"Catalog does not match registration {query_id!r}")
        queries.append(to_wire(query))
    return parse(
        ListQueriesResponse,
        {"protocol_version": 1, "router_id": router_id, "queries": queries},
    )
