# generated by datamodel-codegen:
#   filename:  ViewItem.yaml
#   timestamp: 2024-11-22T20:54:01+00:00

from __future__ import annotations

from typing import Union

from pydantic import Field, RootModel
from typing_extensions import Annotated

from .Data import Data
from .Header import Header


class ViewItem(RootModel[Union[Header, Data]]):
    root: Annotated[Union[Header, Data], Field(title="ViewItem")]
