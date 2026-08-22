
# Hordes.io Telemetry

> Create Hordes.io Telemetry with Tampermonkey

## Why?

I am a video game teacher.   
Playing games with code is fun and a great way to learn.  

You can apply the knowledge of how to scrape a game with Tampermonkey to almost any web game.

Making bots for World of Warcraft in a white-hat context is my hobby.   
Don't abuse this code to create PvP or market bots.  
If you find bots, report them.   

Hordes.io is a small island, so you will be quickly spotted and banned anyway.   

If Dek, the creator of Hordes.io, reads this message:   
- Add code to block the game when Tampermonkey is detected in the addons.
- Add code to detect whether Selenium is being used.
  
Block these tools if they are detected.      
They are not a lots of them and they are the two main one.      

Making bots is one of the best ways to learn how to fight them.     
So, feel free to learn for educational purposes about how this works.     

Note: Creating a bot is not against the law.     
However, if you harm the community by botting, I would not risk it.     

So, be gentle, discreet, and harmless if you are learning to make bots for fun in the game.   

### The Workshop: Movement

Learn how to inject or simulate keyboard stroke first.   
With https://github.com/EloiStree/s2w  

- Try to move the player:
  - Move left and right.
  - Rotate.
  - Move forward.
- Try to fire a power repeatedly in a loop.
- Create a WebSocket server that listens to the scraped information.
- Convert the scraped information into X/Y coordinates that your code can use.
- Manually or programmatically make the player move and rotate for 10 seconds to estimate movement and rotation speeds.
- Give your code an X/Y destination and make the player:
  - Rotate to the correct angle.
  - Move the estimated distance required to reach the destination.
- Keyboard simulation is not perfectly precise, so estimate when the player has reached the intended destination.
- Instead of moving toward a single point, make the player follow a list of points.
- Try to make the player follow a road from one point to another.
- Record several paths between villages.
- Implement a Dijkstra algorithm to find the best path to take.
- Save your code on Git and use the project as part of your portfolio when applying for a junior developer position.
  - If you can complete all the previous steps, you have a solid coding level—and you clearly enjoy math. 😊

### Workshop: Challenges

**Wow Head Client**:
- Try to create a WoWHead-style client for Hordes.io.
  - [WoWHead Client](https://www.wowhead.com/client) is a tool that collects World of Warcraft data to generate information such as public drop percentages and mob locations.

**Auction House Website**:
- Extract Auction House data and create a public website that keeps a historical log of item prices.
  - For inspiration, see [WoW Auction House](https://wowauction.us/commodities/eu/Fel%20Iron%20Ore?realm=aegwynn).
- **Bonus:** Detect price patterns that could be associated with black-market bots and use the data to help Dek identify suspicious activity.
  - Bot users can sometimes be detected through auction anomalies because they may use the Auction House to transfer gold.
  

------------

NOTE: I NEED TO CHECK FOR SPELLING IT IS 2AM and I am sleeping on the keyboard.

# How to create telemetry from Hordes.io

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


Example in Godot:

Download Godot
[<img width="1344" height="479" alt="image" src="https://github.com/user-attachments/assets/1acdeee3-55f0-43a9-a076-4e00b3d1531e" />](https://godotengine.org/releases/4.7/)   
https://godotengine.org/releases/4.7/

Create a project
<img width="1133" height="641" alt="image" src="https://github.com/user-attachments/assets/58591382-754c-48e5-8abb-cb8392ff4da2" />

Download with git clone if you know how the addons.
```
git clone https://github.com/EloiStree/2025_10_28_gdp_trusted_websocket.git addons/2025_10_28_gdp_trusted_websocket
```

Else download the zip https://github.com/EloiStree/2025_10_28_gdp_trusted_websocket
[<img width="972" height="491" alt="image" src="https://github.com/user-attachments/assets/fc28edfd-d6ea-4830-87f7-07b3eab6c1a6" />](https://github.com/EloiStree/2025_10_28_gdp_trusted_websocket)  
https://github.com/EloiStree/2025_10_28_gdp_trusted_websocket    

Go in import of asset store
<img width="929" height="254" alt="image" src="https://github.com/user-attachments/assets/b878d44e-1d6e-4dfa-940f-ac9c19121efd" />

Aim the Zip
<img width="728" height="304" alt="image" src="https://github.com/user-attachments/assets/a0273ee6-8263-46bf-ba75-39a1e0296735" />

Import the addons
<img width="772" height="603" alt="image" src="https://github.com/user-attachments/assets/e583b556-c17f-40b3-9137-def493a9d6b6" />

Move it in a folder addons
<img width="913" height="239" alt="image" src="https://github.com/user-attachments/assets/6d0415d4-095a-4d9a-b93b-2efea8028637" />

Add a server
<img width="1152" height="344" alt="image" src="https://github.com/user-attachments/assets/cbb7208a-bae0-4e7c-89bd-5716065b8a9a" />

Change the port
<img width="493" height="275" alt="image" src="https://github.com/user-attachments/assets/cd7add2e-9588-40cb-8a5f-b4db5ad2e123" />

The server give you the received message with the peer(user id)
If you read this text I will add a any peer to listen at incoming text.
<img width="908" height="626" alt="image" src="https://github.com/user-attachments/assets/b4bbe4a4-dda6-43bc-b7bc-e732456d9474" />

Add a tool to merge the peer message to one signal and a label
<img width="724" height="427" alt="image" src="https://github.com/user-attachments/assets/a716b138-463e-42ed-8e8e-a4a9238847e4" />

Connect the signal message to the label (2D or 3D)
<img width="1365" height="472" alt="image" src="https://github.com/user-attachments/assets/32d02047-501b-409f-a3ca-8209dd8d8d67" />

And the server to your merge script
<img width="1365" height="606" alt="image" src="https://github.com/user-attachments/assets/4cfc573b-d7b3-4493-8e66-b04ff1b4a770" />


Move the camera and add light if in 3d
Then save and press play

<img width="762" height="313" alt="image" src="https://github.com/user-attachments/assets/e9450ab0-588a-4e14-8c47-c977f3ef732a" />

<img width="878" height="412" alt="image" src="https://github.com/user-attachments/assets/b72a775e-6a6f-4fa0-835e-841f0de72860" />

Go in the game
You should have a server connected
<img width="884" height="378" alt="image" src="https://github.com/user-attachments/assets/fd373b7a-e214-429f-aef5-b40bb2098f7a" />


Not that you may need to validate an authorisation
<img width="666" height="205" alt="image" src="https://github.com/user-attachments/assets/d757aed9-489c-4be7-9677-ddc5b6ca7338" />

<img width="659" height="430" alt="image" src="https://github.com/user-attachments/assets/85c1e666-8104-4fa9-93b5-3b3458e8087a" />


Tadaaam    
<img width="1360" height="729" alt="image" src="https://github.com/user-attachments/assets/b34205de-6ffb-4b68-b894-e43aae520058" />


______________

# Behind the vibed code.

I gave a code I did a long time ago the to hack Scratch (https://scratch.mit.edu/) to an AI to vibe code this one.


**You can only aim localhost with WS**
Browser are very protected to avoid hacker to do harms.
You can contact Secure Web Socket from Tamper Monkey Script.
But setup a server in that is secure is out of beginner reach.

So my solution is to send the information on a local webserver in python that him know how to redirection to the target of the moment: Unity, Godot, MQTT, UDP...

Note: If you are blocked it may be because you need to unlock unsecure websocket in the security setting
<img width="559" height="308" alt="image" src="https://github.com/user-attachments/assets/bde52468-01b7-4844-950d-db55746640a2" />

**Unity3D does not have server websocket**
You can add some websocket in Unity3D with some external tool but that are not multiplatform.


The header is there to give information but also to make sure the script only run on the page you want.
```
// ==UserScript==
// @name         Hordes.io Player Data to Local WebSocket
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Send Hordes.io game data to a local WebSocket server
// @match        https://hordes.io/*
// @grant        none
// ==/UserScript==
```

Change name to what you need
```
// @name         Hordes.io Player Data to Local WebSocket
```

Make sure it run on the website you want to scrap (here the hordes.io)
```
// @match        https://hordes.io/*
```

The following part allows to create a web socket client.
```   
const socketUrl = 'ws://localhost:7072';
let socket = null;  
try {

        socket = new WebSocket(socketUrl);


        socket.addEventListener(
            'open',
            function() {

                connectionInProgress = false;
                isConnectionValid = true;

                console.log(
                    '[Hordes.io WS] Connected to ' +
                    socketUrl
                );
            }
        );


        socket.addEventListener(
            'message',
            function(event) {

                debugLog(
                    'Server message: ' +
                    event.data
                );
            }
        );


        socket.addEventListener(
            'close',
            function() {

                connectionInProgress = false;
                isConnectionValid = false;

                debugLog(
                    'WebSocket connection closed'
                );
            }
        );


        socket.addEventListener(
            'error',
            function(error) {

                connectionInProgress = false;
                isConnectionValid = false;

                console.error(
                    '[Hordes.io WS] WebSocket error:',
                    error
                );
            }
        );

    } catch (error) {

        connectionInProgress = false;
        isConnectionValid = false;

        console.error(
            '[Hordes.io WS] Connection error:',
            error
        );
    }
```

You can look around for class with that code
```
const elements =  document.querySelectorAll('.textyellow');
```
And extract the content of it like that
```
  const text = elements[i].textContent.trim();
```


Use your knowedge of javascript or your best vibing skills to scrap and extract data to a text to send.

And then check if the webscoket is still on
```
 if (
            !socket ||
            socket.readyState !==
            WebSocket.OPEN
        ) {
            return;
        }
```

To send the data
```
        socket.send(message);
```

If the data change yo avoid spamming
```
if (
            message ===
            previousData
        ) {
            return;
        }
```



I am not a javascript or typescript developer.
So dont take those code seriously.

The only aim here to scrap data on the momement.

Note that if anything change in the website you scrap, you need to adjust the code.

So try to understand how to establish a websocket connection and how to parse the data to an abstract format you want.
Then tweek the script when something broke.

Have fun.   
Hope you learn some stuff here.
