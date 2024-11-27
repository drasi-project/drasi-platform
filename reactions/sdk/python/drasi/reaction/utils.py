""" Utility functions for creating a `DrasiReaction` class"""

import json
import os
from io import TextIOWrapper
from typing import Any

import yaml


def get_config_value(key: str, default_value: Any = None) -> Any:
    """Retrieves a configuration value for the Reaction properties.

    Args:
        key (str): The configuration key to retrieve.
        default_value (Any): The default value to return if the key is not found.
            Default is None

    Returns:
        Any: The configuration value or the default value if the key is not found.

    Examples:
        Retrieve the value of the `MyConnectionString` configuration key:

        >>> connection_string = get_config_value("MyConnectionString")

        The above code retrieves the value of the `MyConnectionString` configuration key,
        as defined in the reaction manifest:

        ```yaml
        kind: Reaction
        apiVersion: v1
        name: test
        spec:
          kind: MyReaction
          properties:
            MyConnectionString: "some connection string"
          queries:
            query1:
        ```
    """
    return os.getenv(key, default_value)


def json_query_configs(json_string: TextIOWrapper) -> dict[str, Any]:
    """Parses a JSON configuration string into a dictionary.

    Args:
        json_string (str): The JSON string to parse.

    Returns:
        dict: The parsed configuration as a dictionary.

    Examples:
        Pass the `parse_json_config` function as a parameter to initialize a `DrasiReaction`:

        >>> my_reaction = DrasiReaction(on_change_event, parse_query_configs=parse_json_config)
    """
    return json.load(json_string)


def yaml_query_configs(yaml_string: TextIOWrapper) -> dict[str, Any]:
    """Parses a YAML configuration string into a dictionary.

    Args:
        yaml_string (str): The YAML string to parse.

    Returns:
        dict: The parsed configuration as a dictionary.

    Examples:
        Pass the `parse_yaml_config` function as a parameter to initialize a `DrasiReaction`:

        >>> my_reaction = DrasiReaction(on_change_event, parse_query_configs=parse_yaml_config)
    """
    return yaml.safe_load(yaml_string)
