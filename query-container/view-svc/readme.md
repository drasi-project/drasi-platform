# Result View Service

## API

Requesting a `GET` to `/<query id>` will retrieve the current result view for that query.
To get a historical snapshot, use `/<query id>?timestamp=<ms from unix epoch>`

The results will be [streamed](https://en.wikipedia.org/wiki/JSON_streaming) with [chunked transfer encoding](https://en.wikipedia.org/wiki/Chunked_transfer_encoding) in JSON array format.

The first item returns will be a header, that contains the latest sequence and timestamp of the last change as follows:

```json
{ 
    "header": { 
        "sequence": 0, 
        "timestamp": 0, 
        "state": "running" 
    }
}
```

All the following items will be data rows containing the output of the query as follows:

```json
{ 
    "data": { 
        "Field1": 0, 
        "Field2": 0 
    } 
}
```

An example of a complete stream:

```json
[
    {
        "header": {
            "sequence": 34,
            "timestamp": 1698861077609,
            "state": "running"
        }
    },
    {
        "data": {
            "Category": "1",
            "Id": 1,
            "Name": "Foo"
        }
    },
    {
        "data": {
            "Category": "1",
            "Id": 2,
            "Name": "Bar"
        }
    }
]
```