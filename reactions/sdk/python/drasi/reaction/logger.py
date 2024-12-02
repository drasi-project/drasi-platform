import logging.config
from typing import Any

LOGGING_CONFIG: dict[str, Any] = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "format": "%(levelname)s:\t  %(asctime)s %(name)s %(message)s",
        },
    },
    "handlers": {
        "stdout": {
            "class": "logging.StreamHandler",
            "level": "INFO",
            "formatter": "default",
            "stream": "ext://sys.stdout",
        }
    },
    "loggers": {
        "reaction.sdk": {
            "handlers": ["stdout"],
            "level": "INFO",
            "propagate": False,
        },
    },
}


def config_logging():
    logging.config.dictConfig(LOGGING_CONFIG)
    return logging.getLogger("reaction.sdk")
