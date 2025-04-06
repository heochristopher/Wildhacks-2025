import json
import asyncio
import serial
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter(tags=["WebSocket"])

# Initialize serial connection to Arduino (update the port as needed)
# ser = serial.Serial('/dev/tty.usbmodem1101', 9600, timeout=1)
try:
    ser = serial.Serial('/dev/tty.usbmodem1101', 9600, timeout=1)
    print("Serial connection established.")
except Exception as e:
    print(f"Serial port connection not found: {e}")
    ser = None

if ser is not None:
    def binary_string_to_bytes(binary_string: str) -> bytes:
        """
        Convert a binary string (e.g. "01001010") to bytes.
        If the string length is not a multiple of 8, pad with leading zeros.
        """
        if len(binary_string) % 8 != 0:
            padding_length = 8 - (len(binary_string) % 8)
            binary_string = "0" * padding_length + binary_string
        # Split the string into chunks of 8 bits and convert to bytes
        byte_chunks = [binary_string[i:i+8] for i in range(0, len(binary_string), 8)]
        return bytes(int(chunk, 2) for chunk in byte_chunks)

    @router.websocket("/ws")
    async def websocket_endpoint(websocket: WebSocket):
        await websocket.accept()
        print("Client connected via WebSocket")

        async def send_serial_data():
            """
            Read from the serial port (keyboard input) and forward to the client.
            """
            try:
                while True:
                    if ser.in_waiting:
                        # Read a line from the Arduino and decode it
                        line = ser.readline().decode('utf-8').strip()
                        # Create a JSON message with type "keyboard"
                        message = {"type": "keyboard", "payload": line}
                        await websocket.send_json(message)
                    await asyncio.sleep(0.1)
            except Exception as e:
                error_msg = {"type": "error", "payload": f"Serial read error: {str(e)}"}
                await websocket.send_json(error_msg)

        async def receive_client_messages():
            """
            Listen for incoming messages from the client and process them.
            For LCD commands, the client should send a JSON message with type "lcd".
            """
            try:
                while True:
                    message_text = await websocket.receive_text()
                    try:
                        data = json.loads(message_text)
                    except json.JSONDecodeError as e:
                        await websocket.send_json({"type": "error", "payload": "Invalid JSON format"})
                        continue

                    message_type = data.get("type")
                    payload = data.get("payload")

                    if message_type == "lcd":
                        try:
                            # Convert the binary string to bytes and send to Arduino
                            binary_bytes = binary_string_to_bytes(payload)
                            ser.write(binary_bytes)
                            # Optionally, acknowledge receipt
                            await websocket.send_json({"type": "ack", "payload": "LCD command sent"})
                        except Exception as e:
                            await websocket.send_json({"type": "error", "payload": f"Error sending LCD command: {str(e)}"})
                    else:
                        # Handle unknown message types
                        await websocket.send_json({"type": "error", "payload": "Unknown message type"})
            except WebSocketDisconnect:
                print("Client disconnected")
            except Exception as e:
                await websocket.send_json({"type": "error", "payload": f"Error processing message: {str(e)}"})

        # Run both tasks concurrently
        send_task = asyncio.create_task(send_serial_data())
        recv_task = asyncio.create_task(receive_client_messages())

        # Wait until one of the tasks terminates (e.g. client disconnects)
        await asyncio.gather(send_task, recv_task)

else:
    @router.websocket("/ws")
    async def websocket_endpoint(websocket: WebSocket):
        await websocket.accept()
        await websocket.send_json({"type": "error", "payload": "Serial port not available"})
        print("Client connected via WebSocket, but serial port is not available.")