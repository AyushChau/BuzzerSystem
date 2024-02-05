# JeopardyGame
A buzzer system for Jeopardy (and other trivia-related games)


Inspired by 'levi-rocha' buzzer system. Initial setup based on their code: https://github.com/levi-rocha/buzzer


The following improvements were made to the code to suit my requirements and situations better:
- Added a Team Name page to allow for more customization (instead of just having the team/player names being numbers)
- Improved reliability of the server by using the ping-pong method to prevent the socket from timing out and kicking the client out
- Added a 'power-up' system to move away from a conventional buzzer system and make my system a bit more unique
- Added a timer to the screen that would automatically buzz in people
- Allows users to disconnect (i.e. turn off their phones), without being kicked out of the server. Stores their 'credentials' which can be used to restore the connection. This helps to make the system less tedious to use.


Note: timer and power-up system can be disabled if not desired
