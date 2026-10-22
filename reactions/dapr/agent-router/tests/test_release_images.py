# Copyright 2026 The Drasi Authors.
# Licensed under the Apache License, Version 2.0.

from __future__ import annotations

import json
import os
import shutil
import subprocess
from pathlib import Path

import pytest
import yaml

PACKAGE = Path(__file__).resolve().parents[1]
REPOSITORY = PACKAGE.parents[2]
WORKFLOWS = REPOSITORY / ".github/workflows"
IMAGE = "reaction-dapr-agent-router"
TAG = "1.2.3"


def load_yaml(path: Path):
    return yaml.safe_load(path.read_text(encoding="utf-8"))


def manifest_script() -> str:
    workflow = load_yaml(WORKFLOWS / "draft-release.yml")
    steps = workflow["jobs"]["create-all-manifests"]["steps"]
    step = next(
        item
        for item in steps
        if item["name"] == "Create and push manifest lists for all components"
    )
    assert step["env"] == {
        "IMAGE_PREFIX": "${{ inputs.image_prefix }}",
        "RELEASE_TAG": "${{ inputs.tag }}",
    }
    script = step["run"]
    script = script.replace(
        "${{ env.BUILD_CONFIGS }}",
        json.dumps([{"name": "default"}, {"name": "azure-linux"}]),
    )
    return script.replace(
        "${{ env.ALL_COMPONENTS }}",
        json.dumps(
            [
                {
                    "name": IMAGE,
                    "platforms": "linux/amd64,linux/arm64",
                }
            ]
        ),
    )


@pytest.mark.parametrize(
    "image_prefix",
    ["ghcr.io/drasi-project", "registry.example/teams/drasi"],
)
def test_manifest_generation_uses_configured_prefix(
    image_prefix: str, tmp_path: Path
) -> None:
    if shutil.which("jq") is None:
        pytest.skip("jq is required by the release workflow")

    script = manifest_script()
    assert 'docker manifest inspect "${image}:${amd64_tag}"' in script
    assert 'docker manifest inspect "${image}:${arm64_tag}"' in script
    assert '"${manifests[@]}"' in script

    docker_log = tmp_path / "docker.log"
    mocked_script = f"""
docker() {{
  printf '%s\\n' "$*" >> "$DOCKER_LOG"
}}
{script}
"""
    result = subprocess.run(
        ["bash", "-eu", "-o", "pipefail", "-c", mocked_script],
        cwd=REPOSITORY,
        env={
            **os.environ,
            "DOCKER_LOG": str(docker_log),
            "IMAGE_PREFIX": image_prefix,
            "RELEASE_TAG": TAG,
        },
        capture_output=True,
        text=True,
        check=False,
    )
    assert result.returncode == 0, result.stderr

    image = f"{image_prefix}/{IMAGE}"
    assert docker_log.read_text(encoding="utf-8").splitlines() == [
        f"manifest inspect {image}:{TAG}-amd64",
        f"manifest inspect {image}:{TAG}-arm64",
        (
            f"buildx imagetools create -t {image}:{TAG} "
            f"{image}:{TAG}-amd64 {image}:{TAG}-arm64"
        ),
        f"manifest inspect {image}:{TAG}-azure-linux-amd64",
        f"manifest inspect {image}:{TAG}-azure-linux-arm64",
        (
            f"buildx imagetools create -t {image}:{TAG}-azure-linux "
            f"{image}:{TAG}-azure-linux-amd64 "
            f"{image}:{TAG}-azure-linux-arm64"
        ),
    ]


def test_draft_release_passes_prefix_to_image_validation() -> None:
    release = load_yaml(WORKFLOWS / "draft-release.yml")
    validation_job = release["jobs"]["validate-images"]
    assert validation_job["with"]["image_prefix"] == "${{ inputs.image_prefix }}"

    validation = load_yaml(WORKFLOWS / "image-validation.yml")
    triggers = validation.get("on") or validation[True]
    inputs = triggers["workflow_call"]["inputs"]
    assert inputs["image_prefix"] == {
        "description": "Image prefix to validate",
        "required": False,
        "default": "ghcr.io/drasi-project",
        "type": "string",
    }
    assert validation["env"]["IMAGE_PREFIX"] == "${{ inputs.image_prefix }}"
    for job_name in ("multi-arch-validation", "image-pull-test"):
        run = validation["jobs"][job_name]["steps"][0]["run"]
        assert 'image="${IMAGE_PREFIX}/${configured_image##*/}"' in run
    assert validation["env"]["DRASI_IMAGES"].split().count(
        f"ghcr.io/drasi-project/{IMAGE}"
    ) == 1
