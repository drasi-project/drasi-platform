from pathlib import Path
from unittest.mock import Mock

import pytest

from drasi_reaction.sdk import DrasiReaction
from drasi_reaction.utils import yaml_query_configs

SUBSCRIBE_QUERIES = {"query1": "foo: bar", "query2": ""}


@pytest.fixture(scope="session")
def query_config_dir(tmp_path_factory):
    mock_dir = tmp_path_factory.mktemp("queries")

    for query, content in SUBSCRIBE_QUERIES.items():
        qconfig: Path = mock_dir / query
        qconfig.write_text(content)

    return mock_dir


def test_reaction_reads_qconfigs(query_config_dir):
    reaction = DrasiReaction(
        on_change_event=Mock(),
        on_control_event=Mock(),
        parse_query_configs=yaml_query_configs,
    )
    reaction._config_directory = query_config_dir
    reaction.subscribe()

    qconfigs = reaction.query_configs

    for query, expected_config in SUBSCRIBE_QUERIES.items():
        assert query in qconfigs
        if expected_config:
            parsed_config = yaml_query_configs(expected_config)
            assert qconfigs[query] == parsed_config
        else:
            assert qconfigs[query] is None


def test_reaction_adds_routes_to_router(query_config_dir):
    reaction = DrasiReaction(
        on_change_event=Mock(),
        on_control_event=Mock(),
        parse_query_configs=yaml_query_configs,
    )
    reaction._config_directory = query_config_dir
    reaction.subscribe()

    routes = [route.path for route in reaction._app.router.routes]
    for query in SUBSCRIBE_QUERIES.keys():
        assert f"/{query}" in routes
