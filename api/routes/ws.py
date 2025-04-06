import asyncio
import serial
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter(tags=["WebSocket"])

# Initialize serial connection to Arduino (update the port as needed)
ser = serial.Serial('/dev/tty.usbmodem1101', 9600, timeout=1)

@router.websocket("/ws/keyboard")
async def keyboard_websocket(websocket: WebSocket):
    """
    WebSocket endpoint for keyboard input.
    This endpoint reads data from the Arduino (e.g., from a custom keyboard) via the serial port 
    and streams it to the client.
    """
    await websocket.accept()
    print("Client connected for keyboard events")
    
    try:
        while True:
            # Check if there's data from the Arduino (keyboard input)
            if ser.in_waiting:
                line = ser.readline().decode('utf-8').strip()
                # Send the keyboard input to the client as plain text
                await websocket.send_text(line)
            # Brief sleep to prevent busy waiting
            await asyncio.sleep(0.1)
    except WebSocketDisconnect:
        print("Client disconnected from keyboard endpoint")
    except Exception as e:
        print(f"Error in keyboard WebSocket: {e}")

@router.websocket("/ws/lcd")
async def lcd_websocket(websocket: WebSocket):
    """
    WebSocket endpoint for LCD commands.
    This endpoint receives raw binary data from the client (via WebSocket binary frames) 
    and writes the data directly to the Arduino's serial port for updating the LCD display.
    """
    await websocket.accept()
    print("Client connected for LCD binary commands")
    
    try:
        while True:
            # Wait for binary data from the client
            binary_data = await websocket.receive_bytes()
            print(f"Received binary data for LCD: {binary_data}")
            
            # Write the received binary data to the Arduino for the LCD display
            ser.write(binary_data)
            
            # Optionally, send an acknowledgement back to the client
            await websocket.send_text("LCD command sent")
    except WebSocketDisconnect:
        print("Client disconnected from LCD endpoint")
    except Exception as e:
        print(f"Error in LCD WebSocket: {e}")
