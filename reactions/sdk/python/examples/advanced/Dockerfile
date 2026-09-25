FROM python:3.13.8-slim AS builder

ARG POETRY_VERSION=1.8

ENV POETRY_HOME=/opt/poetry
ENV POETRY_NO_INTERACTION=1
ENV POETRY_VIRTUALENVS_IN_PROJECT=1
ENV POETRY_VIRTUALENVS_CREATE=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV POETRY_CACHE_DIR=/opt/.cache

RUN pip install "poetry==${POETRY_VERSION}"

WORKDIR /sdk

COPY pyproject.toml poetry.lock README.md ./
COPY drasi ./drasi
COPY examples/advanced/pyproject.toml examples/advanced/poetry.lock ./examples/advanced/

WORKDIR /sdk/examples/advanced

RUN poetry install --no-root && rm -rf $POETRY_CACHE_DIR

FROM python:3.13.8-slim AS runtime

ENV VIRTUAL_ENV=/app/.venv
ENV PATH="/app/.venv/bin:$PATH"

COPY --from=builder /sdk/examples/advanced/.venv ${VIRTUAL_ENV}
COPY examples/advanced/main.py /app/main.py

WORKDIR /app

ENTRYPOINT ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
