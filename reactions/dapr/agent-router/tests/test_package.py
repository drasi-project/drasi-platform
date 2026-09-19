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
import tarfile
from pathlib import Path, PurePosixPath
from zipfile import ZipFile

PACKAGE = Path(__file__).resolve().parents[1]


def test_distributions_include_contract_and_license(tmp_path):
    license_text = (PACKAGE / "LICENSE").read_bytes()
    assert license_text == (PACKAGE.parents[2] / "LICENSE").read_bytes()
    subprocess.run(
        ["uv", "build", "--out-dir", str(tmp_path), "--quiet"],
        cwd=PACKAGE,
        check=True,
    )
    expected = {
        path.relative_to(PACKAGE / "src").as_posix(): path.read_bytes()
        for path in (PACKAGE / "src/agent_router").rglob("*")
        if path.suffix in (".py", ".json")
    }
    assert any(name.endswith(".json") for name in expected)
    with ZipFile(next(tmp_path.glob("*.whl"))) as wheel:
        licenses = [
            name for name in wheel.namelist() if name.endswith("/licenses/LICENSE")
        ]
        assert len(licenses) == 1
        assert wheel.read(licenses[0]) == license_text
        for name, content in expected.items():
            assert wheel.read(name) == content
    with tarfile.open(next(tmp_path.glob("*.tar.gz"))) as sdist:
        members = {member.name: member for member in sdist.getmembers()}
        licenses = [name for name in members if PurePosixPath(name).name == "LICENSE"]
        assert len(licenses) == 1
        with sdist.extractfile(licenses[0]) as source_license:
            assert source_license.read() == license_text
        root = PurePosixPath(licenses[0]).parent
        for name, content in expected.items():
            with sdist.extractfile(str(root / "src" / name)) as source_file:
                assert source_file.read() == content
