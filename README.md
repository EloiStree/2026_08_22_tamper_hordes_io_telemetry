# Hordes.io Telemetry

> Create Hordes Io Telemetry with Tamper Monkey



Install Firefox:
[<img width="837" height="262" alt="image" src="https://github.com/user-attachments/assets/eea463b2-641a-407d-b5b8-7a7ef3d153aa" />](https://www.firefox.com/fr/
)   
https://www.firefox.com/fr/   


Add Tamper Monkey
[<img width="1297" height="307" alt="image" src="https://github.com/user-attachments/assets/8441ef4d-1786-49f1-ba72-ea305f905a04" />](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)

https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/   


Allows it:
<img width="468" height="355" alt="image" src="https://github.com/user-attachments/assets/c07f39d6-1e12-4085-9091-c64b8d7b2b3f" />

<img width="433" height="225" alt="image" src="https://github.com/user-attachments/assets/8c970834-2dfe-4135-a907-1595fce9e97c" />

Go in Dashboard
<img width="323" height="448" alt="image" src="https://github.com/user-attachments/assets/3d5e47b9-1838-4e02-a048-4f7d454c126b" />

Add a script
<img width="282" height="90" alt="image" src="https://github.com/user-attachments/assets/9c799404-e583-4365-b8e5-e1bae76b3e49" />


That a blank script:
<img width="861" height="475" alt="image" src="https://github.com/user-attachments/assets/1c4cbec3-5698-4b4f-bb9d-5093894f6ddd" />

Go fecth a script here the player position:
[<img width="1109" height="411" alt="image" src="https://github.com/user-attachments/assets/bea796d6-9cca-4d04-8334-931e2639fe5b" />](https://github.com/EloiStree/2026_08_22_tamper_hordes_io_telemetry/blob/main/tamper/)    
https://github.com/EloiStree/2026_08_22_tamper_hordes_io_telemetry/blob/main/tamper/   

Copy the code
[<img width="1049" height="377" alt="image" src="https://github.com/user-attachments/assets/17367ff2-7353-463d-b399-ddda63cbbd68" />](https://github.com/EloiStree/2026_08_22_tamper_hordes_io_telemetry/blob/main/tamper/telemetry_of_position_and_player.ts)   
https://github.com/EloiStree/2026_08_22_tamper_hordes_io_telemetry/blob/main/tamper/telemetry_of_position_and_player.ts   


And save it.
<img width="1348" height="599" alt="image" src="https://github.com/user-attachments/assets/19e5a5d9-74c3-46d3-9549-1070d7841af1" />

<img width="1365" height="122" alt="image" src="https://github.com/user-attachments/assets/a6938f0f-24f9-4ab3-98e2-a94dd7d5d511" />


Go in the game and create a google account
[<img width="1360" height="497" alt="image" src="https://github.com/user-attachments/assets/f3fbb6f1-c295-430a-a41d-3ba281107627" />](https://hordes.io/)   
https://hordes.io/  

Press F12
<img width="1036" height="648" alt="image" src="https://github.com/user-attachments/assets/6efd4322-789c-4633-8021-968c4c0dec78" />

In Console you can see that the script is loaded and try to connect to web socket server
<img width="1025" height="451" alt="image" src="https://github.com/user-attachments/assets/8104413c-b7a4-4fec-930f-71be3d8e6d7f" />

It only work with server on the computer:
Change the port if needed.
`ws://localhost:7072`

Now you need a code to be webserver.   

You can use my Godot listener:
- Godot: https://github.com/EloiStree/2025_10_28_gdp_trusted_websocket

Or the python script I was using to redirect the websocket server to a udp target:
[https://github.com/EloiStree/S2W/.../LocalWebsocketServerToLocalUDP.py](https://github.com/EloiStree/S2W/blob/ee7ca095806e0479bd8a9953fb16876f8b681e43/PythonBridge/LocalWebsocketServerToLocalUDP.py)   

For Rust user:
https://crates.io/crates/tokio-tungstenite













