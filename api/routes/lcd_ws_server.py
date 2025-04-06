from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
import serial
import asyncio

# Serial port to Arduino
ser = serial.Serial('/dev/tty.usbmodem1101', 9600, timeout=1)  # Update this port!

router = APIRouter(tags=["Server-Sent Events"])

async def event_generator():
    """
    Generator function that reads from the serial port and yields SSE-formatted events.
    """
    try:
        while True:
            # If there is data available on the serial port, read and yield it.
            if ser.in_waiting:
                line = ser.readline().decode('utf-8').strip()
                yield f"data: {line}\n\n"
            # Sleep briefly to avoid busy waiting.
            await asyncio.sleep(0.1)
    except Exception as e:
        # If an error occurs, send an event with the error message.
        yield f"data: Error: {str(e)}\n\n"

@router.get("/sse", summary="Server-Sent Events Endpoint")
async def sse_endpoint(request: Request):
    """
    SSE endpoint that streams events from the serial port to the client.
    """
    return StreamingResponse(event_generator(), media_type="text/event-stream")

# Optional: Separate endpoint to send commands to Arduino.
@router.post("/command", summary="Send Command to Arduino")
async def send_command(message: str):
    """
    Receives a command from the client (via HTTP POST) and writes it to the Arduino.
    """
    # Trim the message to the LCD's maximum width (for example, 16 characters
