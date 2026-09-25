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

"""Generate only the agent-router contract, leaving existing formats untouched."""

import argparse
import subprocess
import sys
from pathlib import Path
from tempfile import TemporaryDirectory

CONTRACT = Path(__file__).resolve().parent
ROOT = CONTRACT.parents[1]
BUNDLE = CONTRACT / "python/src/drasi_agent_router_contracts"
MODELS = BUNDLE / "models"


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Fail on generated drift.")
    args = parser.parse_args()

    with TemporaryDirectory(prefix="drasi-agent-router-") as temporary:
        output = Path(temporary)
        subprocess.run(
            [
                "npm",
                "run",
                "build",
                "--",
                str(CONTRACT),
                "--output-dir",
                str(output),
            ],
            cwd=CONTRACT.parent,
            check=True,
        )
        schemas = output / "@typespec/json-schema"
        files = sorted(schemas.glob("*.json"))
        if not files:
            raise RuntimeError("TypeSpec did not emit agent-router JSON Schemas")

        models = output / "agent_router"
        subprocess.run(
            [
                sys.executable,
                "-m",
                "datamodel_code_generator",
                "--input-file-type",
                "jsonschema",
                "--input",
                str(schemas),
                "--output",
                str(models),
                "--output-model-type",
                "pydantic_v2.BaseModel",
                "--target-python-version",
                "3.10",
                "--use-annotated",
                "--collapse-root-models",
                "--field-constraints",
                "--strict-types",
                "str",
                "int",
                "bool",
                "--disable-timestamp",
                "--formatters",
                "black",
                "isort",
            ],
            check=True,
        )
        model_files = sorted(models.rglob("*.py"))
        if not model_files:
            raise RuntimeError(
                "Code generation did not emit agent-router Python models"
            )
        generated = {
            BUNDLE / "schemas" / file.name: file.read_bytes() for file in files
        }
        generated.update(
            {
                MODELS / path.relative_to(models): path.read_bytes()
                for path in model_files
            }
        )
        fixtures = sorted((CONTRACT / "fixtures").glob("*.json"))
        if not fixtures:
            raise RuntimeError("No shared protocol fixtures were found")
        generated.update(
            {BUNDLE / "fixtures" / path.name: path.read_bytes() for path in fixtures}
        )
        stale = (
            set((BUNDLE / "schemas").glob("*.json"))
            | set((BUNDLE / "fixtures").glob("*.json"))
            | set(MODELS.rglob("*.py"))
        ) - set(generated)
        changed = [
            path
            for path, content in generated.items()
            if not path.exists() or path.read_bytes() != content
        ]
        if args.check:
            if changed or stale:
                paths = "\n".join(
                    str(path.relative_to(ROOT)) for path in sorted(set(changed) | stale)
                )
                raise SystemExit(f"Agent-router artifacts are out of date:\n{paths}")
            return
        for path, content in generated.items():
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(content)
        for path in stale:
            path.unlink()


if __name__ == "__main__":
    main()
