from fastapi import FastAPI, Request, HTTPException
from cloudevents.http import from_http
import json
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

DAPR_PUBSUB_NAME = "messagebus"
TARGET_TOPIC = "topic-alpha"

@app.get("/dapr/subscribe")
async def dapr_subscribe():
    logger.info(f"Subscriber Alpha: Dapr requesting subscriptions. Subscribing to {DAPR_PUBSUB_NAME}.{TARGET_TOPIC}")
    return [
        {
            "pubsubname": DAPR_PUBSUB_NAME,
            "topic": TARGET_TOPIC,
            "route": f"/{TARGET_TOPIC}"
        }
    ]

@app.post(f"/{TARGET_TOPIC}")
async def handle_topic_alpha_event(request: Request):
    try:
        content_type = request.headers.get("Content-Type", "")
        if "application/cloudevents+json" in content_type:
            event = from_http(request.headers, await request.body())
            event_id = event["id"]
            data = event.data
            logger.info(f"Subscriber Alpha (CloudEvent) on '{TARGET_TOPIC}' with ID {event_id}: {json.dumps(data)}")
        else:
            # Raw JSON payload
            data = await request.json()
            logger.info(f"Subscriber Alpha (Raw JSON) on '{TARGET_TOPIC}': {json.dumps(data)}")
        return {"status": "SUCCESS"}
    except Exception as e:
        logger.error(f"Subscriber Alpha: Error processing message on '{TARGET_TOPIC}': {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)