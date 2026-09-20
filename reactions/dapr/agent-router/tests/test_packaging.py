# Copyright 2026 The Drasi Authors.
# Licensed under the Apache License, Version 2.0.

from __future__ import annotations

import json
import subprocess
from importlib.metadata import distribution
from pathlib import Path

import pytest
import yaml
from jsonschema import Draft7Validator
from jsonschema.exceptions import ValidationError

PACKAGE = Path(__file__).resolve().parents[1]
REPOSITORY = PACKAGE.parents[2]
IMAGE = "reaction-dapr-agent-router"


def load_yaml(path: Path):
    return yaml.safe_load(path.read_text(encoding="utf-8"))


@pytest.fixture
def provider():
    return load_yaml(PACKAGE / "reaction-provider.yaml")


def test_default_installation_registers_the_same_provider_only(provider) -> None:
    defaults = REPOSITORY / "cli/installers/resources/default-reaction-providers.yaml"
    documents = list(yaml.safe_load_all(defaults.read_text(encoding="utf-8")))
    routers = [document for document in documents if document["name"] == "DaprAgentRouter"]

    assert routers == [provider]
    assert all(document["kind"] == "ReactionProvider" for document in documents)
    assert provider["apiVersion"] == "v1"
    assert provider["spec"]["state_store"] is True
    services = provider["spec"]["services"]
    assert set(services) == {"reaction"}
    assert services["reaction"] == {
        "image": IMAGE,
        "supportsConcurrentInstances": False,
        "dapr": {"app-port": "8000", "app-protocol": "http"},
    }


def test_provider_requires_only_operator_owned_configuration(provider) -> None:
    schema = provider["spec"]["config_schema"]
    Draft7Validator.check_schema(schema)
    assert set(schema["properties"]) == {"routerId", "egressPubsubName"}
    assert set(schema["required"]) == {"routerId", "egressPubsubName"}

    valid = {
        "routerId": "drasi-system/sre-router-reaction",
        "egressPubsubName": "agent-egress",
    }
    validator = Draft7Validator(schema)
    validator.validate(valid)
    for name in valid:
        missing = {key: value for key, value in valid.items() if key != name}
        with pytest.raises(ValidationError):
            validator.validate(missing)
        for invalid in ("", None, 8000):
            with pytest.raises(ValidationError):
                validator.validate({**valid, name: invalid})


@pytest.mark.parametrize("variant", ["default", "azure-linux"])
def test_make_build_and_load_targets_use_the_same_image_tag(variant: str) -> None:
    arguments = [
        "IMAGE_PREFIX=example.invalid/drasi",
        "DOCKER_TAG_VERSION=packaging",
        f"BUILD_CONFIG={variant}",
        "TAG_SUFFIX=-arm64",
        "CLUSTER_NAME=packaging-test",
        "DOCKERX_OPTS=--load",
    ]
    suffix = "" if variant == "default" else f"-{variant}"
    image = f"example.invalid/drasi/{IMAGE}:packaging{suffix}-arm64"

    def dry_run(*targets: str) -> str:
        return subprocess.check_output(
            ["make", "--no-print-directory", "-n", *arguments, *targets],
            cwd=PACKAGE,
            text=True,
        )

    build = dry_run()
    assert "docker buildx build" in build
    assert "--build-context reaction_sdk=../../sdk/python" in build
    assert f"Dockerfile.{variant}" in build
    assert f"-t {image}" in build
    assert "--load" in build
    assert (PACKAGE / f"Dockerfile.{variant}").is_file()
    assert image in dry_run("kind-load")
    assert image in dry_run("k3d-load")
    assert "packaging-test" in dry_run("kind-load", "k3d-load")
    assert image in dry_run("image-test")
    assert "smoke_image.py" in dry_run("image-test")


def test_development_uses_the_same_checkout_reaction_sdk() -> None:
    source = distribution("drasi-reaction-sdk").read_text("direct_url.json")
    assert source is not None
    assert json.loads(source)["url"] == (
        REPOSITORY / "reactions/sdk/python"
    ).as_uri()


def test_image_is_in_build_release_and_validation_workflows() -> None:
    workflows = REPOSITORY / ".github/workflows"
    build = load_yaml(workflows / "build-test.yml")
    matrix = build["jobs"]["build-images"]["strategy"]["matrix"]
    component = [item for item in matrix["component"] if item["name"] == IMAGE]
    assert len(component) == 1
    assert Path(component[0]["path"]) == Path("reactions/dapr/agent-router")
    assert {item["build_config"] for item in matrix["variant"]} >= {
        "default",
        "azure-linux",
    }

    release = load_yaml(workflows / "draft-release.yml")
    components = json.loads(release["env"]["ALL_COMPONENTS"])
    released = [item for item in components if item["name"] == IMAGE]
    assert len(released) == 1
    assert Path(released[0]["path"]) == Path(component[0]["path"])
    assert set(released[0]["platforms"].split(",")) == {"linux/amd64", "linux/arm64"}

    validation = load_yaml(workflows / "image-validation.yml")
    assert validation["env"]["DRASI_IMAGES"].split().count(
        f"ghcr.io/drasi-project/{IMAGE}"
    ) == 1
