
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
