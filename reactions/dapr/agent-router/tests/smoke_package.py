# Copyright 2026 The Drasi Authors.
# Licensed under the Apache License, Version 2.0.

"""Install the built wheel outside the checkout and import its application."""

from __future__ import annotations

import os
import subprocess
import sys
import tempfile
from importlib.metadata import version
from pathlib import Path


def check_package() -> None:
    package = Path(__file__).resolve().parents[1]
    package_version = version("drasi-agent-router")
    wheels = list(
        (package / "dist").glob(f"drasi_agent_router-{package_version}-*.whl")
    )
    if len(wheels) != 1:
        raise RuntimeError(
            f"Expected one built wheel for drasi-agent-router {package_version}"
        )

    environment = os.environ.copy()
    for name in ("PYTHONPATH", "VIRTUAL_ENV", "UV_PROJECT_ENVIRONMENT"):
        environment.pop(name, None)

    with tempfile.TemporaryDirectory(prefix="drasi-router-package-") as directory:
        root = Path(directory)
        virtualenv = root / "venv"
        subprocess.run(
            ["uv", "venv", "--python", sys.executable, str(virtualenv)],
            cwd=root,
            env=environment,
            check=True,
        )
        python = virtualenv / (
            "Scripts/python.exe" if os.name == "nt" else "bin/python"
        )
        subprocess.run(
            [
                "uv", "pip", "install", "--no-config",
                "--python", str(python), str(wheels[0]),
            ],
            cwd=root,
            env=environment,
            check=True,
        )
        subprocess.run(
            [
                str(python), "-I", "-c",
                "from agent_router import create_app; assert callable(create_app)",
            ],
            cwd=root,
            env=environment,
            check=True,
        )

    print(f"Standalone wheel installation passed: {wheels[0].name}")


if __name__ == "__main__":
    check_package()
