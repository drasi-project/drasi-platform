import logging


LOGGER_NAME = "drasi.reaction.sdk"


def get_logger() -> logging.Logger:
    """Return the SDK logger without changing application logging configuration."""

    logger = logging.getLogger(LOGGER_NAME)
    if not logger.handlers:
        logger.addHandler(logging.NullHandler())
    return logger
