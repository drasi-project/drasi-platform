# generated by datamodel-codegen:
#   filename:  HeaderItem.yaml
#   timestamp: 2024-11-22T20:54:01+00:00

from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field
from typing_extensions import Annotated


class HeaderItem(BaseModel):
    sequence: Annotated[int, Field(description='The sequence number of the event')]
    timestamp: Annotated[
        int, Field(description='The time at which the source change was recorded')
    ]
    state: Optional[str] = None
