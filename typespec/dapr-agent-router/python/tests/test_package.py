# Copyright 2026 The Drasi Authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import subprocess
import sys
import tarfile
from pathlib import Path, PurePosixPath
from zipfile import ZipFile

import pytest

PACKAGE = Path(__file__).resolve().parents[1]
IMPORT_NAME = "drasi_agent_router_contracts"


@pytest.fixture(scope="module")
def distributions(tmp_path_factory):
    output = tmp_path_factory.mktemp("contract-distributions")
    subprocess.run(
        ["uv", "build", "--out-dir", str(output), "--quiet"],
        cwd=PACKAGE,
        check=True,
    )
    return output


def test_distributions_include_contract_and_license(distributions):
    license_text = (PACKAGE / "LICENSE").read_bytes()
    assert license_text == (PACKAGE.parents[2] / "LICENSE").read_bytes()
    expected = {
        path.relative_to(PACKAGE / "src").as_posix(): path.read_bytes()
        for path in (PACKAGE / "src" / IMPORT_NAME).rglob("*")
        if path.suffix in (".py", ".json") or path.name == "py.typed"
    }
    assert f"{IMPORT_NAME}/py.typed" in expected
    assert any("/schemas/" in name for name in expected)
    for fixture in (PACKAGE.parent / "fixtures").glob("*.json"):
        assert (
            expected[f"{IMPORT_NAME}/fixtures/{fixture.name}"] == fixture.read_bytes()
        )
    with ZipFile(next(distributions.glob("*.whl"))) as wheel:
        packaged = {
            name
            for name in wheel.namelist()
            if name.startswith(f"{IMPORT_NAME}/")
            and (
                PurePosixPath(name).suffix in (".py", ".json")
                or PurePosixPath(name).name == "py.typed"
            )
        }
        assert packaged == set(expected)
        licenses = [
            name for name in wheel.namelist() if name.endswith("/licenses/LICENSE")
        ]
        assert len(licenses) == 1
        assert wheel.read(licenses[0]) == license_text
        for name, content in expected.items():
            assert wheel.read(name) == content
    with tarfile.open(next(distributions.glob("*.tar.gz"))) as sdist:
        members = {member.name: member for member in sdist.getmembers()}
        licenses = [name for name in members if PurePosixPath(name).name == "LICENSE"]
        assert len(licenses) == 1
        with sdist.extractfile(licenses[0]) as source_license:
            assert source_license.read() == license_text
        root = PurePosixPath(licenses[0]).parent
        packaged = {
            str(PurePosixPath(name).relative_to(root / "src"))
            for name, member in members.items()
            if member.isfile()
            and PurePosixPath(name).is_relative_to(root / "src" / IMPORT_NAME)
            and (
                PurePosixPath(name).suffix in (".py", ".json")
                or PurePosixPath(name).name == "py.typed"
            )
        }
        assert packaged == set(expected)
        for name, content in expected.items():
            with sdist.extractfile(str(root / "src" / name)) as source_file:
                assert source_file.read() == content


@pytest.mark.parametrize("artifact_glob", ["*.whl", "*.tar.gz"])
def test_installed_package_needs_no_application_or_codegen(
    distributions, tmp_path, artifact_glob
):
    artifact = next(distributions.glob(artifact_glob))
    script = """
import importlib.util
from importlib import metadata, resources
import json
import drasi_agent_router_contracts as protocol
from jsonschema.exceptions import ValidationError

assert metadata.version("drasi-agent-router-contracts")
package = resources.files(protocol)
assert package.joinpath("py.typed").is_file()
cases = json.loads(package.joinpath("fixtures/messages.json").read_text())
for case in cases:
    try:
        parsed = protocol.parse(getattr(protocol, case["model"]), case["message"])
        assert protocol.to_wire(parsed) == case["message"]
    except (ValueError, ValidationError):
        assert not case["valid"], case["name"]
    else:
        assert case["valid"], case["name"]
for name in ("agent_router", "drasi", "dapr", "dapr_agents", "mcp", "datamodel_code_generator"):
    assert importlib.util.find_spec(name) is None, name
"""
    subprocess.run(
        [
            "uv",
            "run",
            "--isolated",
            "--no-project",
            "--python",
            sys.executable,
            "--with",
            str(artifact),
            "python",
            "-I",
            "-c",
            script,
        ],
        cwd=tmp_path,
        check=True,
    )
