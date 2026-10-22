FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /sdk

COPY pyproject.toml README.md ./
COPY drasi ./drasi
RUN pip install --no-cache-dir .

WORKDIR /app
COPY examples/state-store/main.py .

ENTRYPOINT ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
