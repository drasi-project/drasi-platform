"""
Entrypoint for the Drasi Agent Router reaction.

This reaction:
1. Reads per-query configs from /etc/queries/ (YAML files)
2. Subscribes to {queryId}-results topics on drasi-pubsub
3. Transforms each ChangeEvent into CloudEvents and publishes to agent-pubsub topics
4. Hosts an MCP server on a separate port for query discovery

Environment variables:
    PubsubName         - Drasi pubsub component name (default: drasi-pubsub)
    DefaultPubsubName  - Default target pubsub for agents (default: agent-pubsub)
    DefaultFormat      - Default event format: packed or unpacked (default: packed)
    MCP_PORT           - Port for the MCP server (default: 3001)
    APP_PORT           - Port for the reaction HTTP server (default: 80)

Run:
    python -m src.main
    # or with dapr:
    dapr run --app-id drasi-agent-router --app-port 80 -- python -m src.main
"""
import logging
import os

from .mcp_server import set_query_configs, start_mcp_server
from .router import DrasiAgentRouter

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(name)s %(levelname)s %(message)s",
)
logger = logging.getLogger(__name__)


def main():
    mcp_port = int(os.getenv("MCP_PORT", "3001"))
    app_port = int(os.getenv("APP_PORT", "80"))

    # Create the router (does not start yet)
    router = DrasiAgentRouter(port=app_port)

    # Share the router's query config dict with the MCP server
    # (they share the same dict object, so MCP sees live updates as events arrive)
    set_query_configs(router._query_configs)

    # Start MCP server in a background thread
    start_mcp_server(port=mcp_port)

    # Start the router (blocks - processes events until stopped)
    router.start()


if __name__ == "__main__":
    main()
