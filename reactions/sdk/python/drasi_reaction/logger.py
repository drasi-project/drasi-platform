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
        },
        "stderr": {
            "class": "logging.FileHandler",
            "level": "ERROR",
            "formatter": "default",
            "filename": "/dev/termination-log",
            "formatter": "default",
            "mode": "w",
        },
    },
    "loggers": {
        "reaction.sdk": {
            "handlers": ["stdout", "stderr"],
            "level": "INFO",
            "propagate": False,
        },
    },
}


def config_logging():
    try:
        logging.config.dictConfig(LOGGING_CONFIG)
    except ValueError as _:
        LOGGING_CONFIG["handlers"]["stderr"]["filename"] = "termination-log"
        logging.config.dictConfig(LOGGING_CONFIG)
