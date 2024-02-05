# JeopardyGame
A buzzer system for Jeopardy (and other trivia-related games)
<br />
<br />
Inspired by 'levi-rocha' buzzer system. Initial setup based on their code: https://github.com/levi-rocha/buzzer
<br />
<br />
<br />
The following improvements were made to the code to suit my requirements and situations better:
- Added a Team Name page to allow for more customization (instead of just having the team/player names being numbers)
- Improved reliability of the server by using the ping-pong method to prevent the socket from timing out and kicking the client out
- Added a 'power-up' system to move away from a conventional buzzer system and make my system a bit more unique
- Added a timer to the screen that would automatically buzz in people
- Allows users to disconnect (i.e. turn off their phones), without being kicked out of the server. Stores their 'credentials' which can be used to restore the connection. This helps to make the system less tedious to use.
<br />
Note: timer and power-up system can be disabled if not desired
<br />
<br />
<br />

How to run:
- Run the starting.js file in the command line using 'node starting.js'
- Open the host page first by navigating to '10.0.0.10:8008/host.html'
- Ask participants to navigate to '10.0.0.10:8008/player_name.html'
- Once the participants enter their team/player name, their name should now show up on the host page (this can be used to verify a successful connection)
  
Note: There is currently no check to see if the player name is unique
