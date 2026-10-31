# Copyright 2026 The Drasi Authors.
# Licensed under the Apache License, Version 2.0.

from __future__ import annotations

from pathlib import Path

import pytest
from fastapi import FastAPI

from agent_router import create_app
from agent_router.catalog import parse_query_config
from drasi.reaction import DeliveryOutcome, DrasiReaction


@pytest.mark.parametrize(
    "name",
    ["routerId", "egressPubsubName", "PubsubName", "StateStoreName"],
)
@pytest.mark.parametrize("value", [None, "", " ", "contains whitespace"])
def test_required_configuration_rejects_missing_or_blank_values(
    monkeypatch: pytest.MonkeyPatch,
    query_directory: Path,
    name: str,
    value: str | None,
) -> None:
    if value is None:
        monkeypatch.delenv(name)
    else:
        monkeypatch.setenv(name, value)

    with pytest.raises(ValueError, match=rf"^{name} must be"):
        create_app()


@pytest.mark.parametrize("egress", ["drasi-pubsub", "router-inbound"])
def test_egress_must_not_collide_with_platform_or_inbound_pubsub(
    monkeypatch: pytest.MonkeyPatch,
    query_directory: Path,
    egress: str,
) -> None:
    monkeypatch.setenv("egressPubsubName", egress)

    with pytest.raises(ValueError, match="egressPubsubName must differ"):
        create_app()


@pytest.mark.parametrize(
    "router_id",
    ["router", "/app", "namespace/", "namespace/app/extra"],
)
def test_router_identity_must_be_namespace_and_dapr_app_id(
    monkeypatch: pytest.MonkeyPatch,
    query_directory: Path,
    router_id: str,
) -> None:
    monkeypatch.setenv("routerId", router_id)

    with pytest.raises(
        ValueError,
        match=r"routerId must be a valid <namespace>/<dapr-app-id> identity",
    ):
        create_app()


def test_catalog_accepts_json_yaml_full_ids_and_is_a_startup_snapshot(
    app_factory,
    query_directory: Path,
) -> None:
    (query_directory / ".ignored").write_text("not: [valid", encoding="utf-8")
    (query_directory / "ignored-directory").mkdir()
    (query_directory / "ignored-directory" / "entry").write_text(
        "not: [valid",
        encoding="utf-8",
    )
    app = app_factory(
        {
            "alerts.prod.yaml": (
                "title: Production alerts\n"
                "description: Newly matching production alerts.\n"
                "usage: Use inserted rows only.\n"
            ),
            "z-last.json": (
                '{"title":"Last query","description":"Valid JSON metadata."}'
            ),
        }
    )

    reaction = app.state.reaction
    assert isinstance(reaction, DrasiReaction)
    assert list(reaction.query_registrations) == ["alerts.prod.yaml", "z-last.json"]
    assert reaction.query_configs["alerts.prod.yaml"].usage == "Use inserted rows only."
    assert reaction.query_configs["z-last.json"].usage is None

    (query_directory / "alerts.prod.yaml").write_text(
        "title: Changed\n"
        "description: This must not change the running snapshot.\n",
        encoding="utf-8",
    )
    (query_directory / "new-query").write_text(
        "title: New\n"
        "description: This requires a restart.\n",
        encoding="utf-8",
    )
    exposed = reaction.query_registrations["alerts.prod.yaml"]
    assert exposed.config is not None
    exposed.config.title = "Mutated copy"

    current = reaction.query_registrations
    assert list(current) == ["alerts.prod.yaml", "z-last.json"]
    assert current["alerts.prod.yaml"].config.title == "Production alerts"


def test_existing_empty_query_directory_is_valid(app_factory) -> None:
    app = app_factory()

    assert app.state.reaction.query_registrations == {}


def test_missing_query_mount_fails_application_creation(
    monkeypatch: pytest.MonkeyPatch,
    query_directory: Path,
) -> None:
    monkeypatch.setenv("QueryConfigPath", str(query_directory / "missing"))

    with pytest.raises(FileNotFoundError, match="does not exist"):
        create_app()


@pytest.mark.parametrize(
    "document",
    [
        pytest.param("null\n", id="null-document"),
        pytest.param("- title\n- description\n", id="non-object-document"),
        pytest.param(
            "title: null\ndescription: Present\n",
            id="null-title",
        ),
        pytest.param(
            'title: "  "\ndescription: Present\n',
            id="blank-title",
        ),
        pytest.param(
            'title: Present\ndescription: "\\t"\n',
            id="blank-description",
        ),
        pytest.param(
            "title: Present\ndescription: Present\nusage: null\n",
            id="null-usage",
        ),
        pytest.param(
            'title: Present\ndescription: Present\nusage: " "\n',
            id="blank-usage",
        ),
        pytest.param(
            "title: Present\ndescription: Present\nextra: private\n",
            id="extra-field",
        ),
        pytest.param(
            "query_id: embedded\ntitle: Present\ndescription: Present\n",
            id="embedded-query-id",
        ),
    ],
)
def test_invalid_metadata_fails_atomically_without_partial_routes(
    query_directory: Path,
    document: str,
) -> None:
    (query_directory / "a-valid").write_text(
        "title: Valid\ndescription: Parsed before the invalid entry.\n",
        encoding="utf-8",
    )
    (query_directory / "z-invalid").write_text(document, encoding="utf-8")
    app = FastAPI()
    original_routes = tuple(app.router.routes)

    async def on_change(_message):
        return DeliveryOutcome.SUCCESS

    reaction = DrasiReaction(
        on_change_event=on_change,
        parse_query_configs=parse_query_config,
    )

    with pytest.raises(ValueError, match="'z-invalid'"):
        reaction.install(app)

    assert reaction.query_registrations == {}
    assert tuple(app.router.routes) == original_routes
