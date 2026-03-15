FROM python:3.11-slim

WORKDIR /app

# Install the Drasi Python SDK from the local reactions/sdk/python path
# (in production this would be from PyPI once published)
COPY ../../sdk/python /tmp/drasi-sdk
RUN pip install /tmp/drasi-sdk

# Install this reaction
COPY . .
RUN pip install -e .

CMD ["python", "-m", "src.main"]
