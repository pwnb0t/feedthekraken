# Model

MongoDB-backed Meteor.js app (TypeScript and React).

Game
- id
- roomCode
- numberOfPlayers
- gameState: GameState enum
- players (Array[Player])
- created

Player
- id
- gameId
- name
- isHost
- role (Role enum: None, Sailor, Pirate, CultLeader, Cultist)
- isConvertEligible
- gunCount

GameState enum:
- Setup
- Waiting
- InProgress
- CultGunStashSetup
- CultGunStashInProgress
- CultConversionSetup
- CultConversionInProgress
- RoleReveal
- Finished

# Web App

## Landing Page

"Room Code"
<room code input>
"Name"
<name input>
<play button>

"Or create a new game" link

(Later: check and see if they have an existing cookie/session and there is a stored roomCode and inProgress game)
(Keep Name in a cookie as well)

## Create Game

Creates a Game with a random RoomCode: 4 char [A-HJ-NP-Z]

takes them to GameState.Setup as the host

## Play Button Action (join game)

Looks for a game with specified RoomCode
Looks for a player with specified name in that game
    if found, assume that player
    if not found, create a new player with specified name in that game

takes them to the Game page in whatever state the game is in

## Game common

### Header bar (constant for all states)
Always shown in the top of all the Game pages
- Player.name in the top left corner
- RoomCode in the top right corner



------



## Game (GameState.Setup)

### Setup Room (Player.isHost == true)

select the number of players (min 5, max 11)

Room Code: ABCD

Number of Players
| - | 5 | + |

"Start Waiting Room" button (change gameState to GameState.Waiting)

### Setup Room (Player.isHost == false)
This is for a player that has joined before the room moved to Waiting, which is ok

Waiting for Host to start waiting room...



------


## Game (GameState.Waiting)

### Select Role (Player.role == Role.None)
Show roles as buttons
Use assets/sailor.png, assets/pirate.png, assets/cultleader.png, assets/cultist.png inside rounded square image buttons
when tapped/clicked, set Player.role to the selected role
take player to Waiting For Game

Select Role
- Sailor
- Pirate
- Cult Leader
- Cultist


### Waiting For Game (Player.role != Role.None, Player.isHost == false)
shows text

#### When Game.numberOfPlayers==Game.players.length and players have selected a role

Role Selected

Waiting for host to start game...

#### While Game.numberOfPlayers!=Game.players.length or not all players have selected a role

Role Selected

Waiting for other players (5/9 ready)...

### Waiting For Game (Player.role != Role.None, Player.isHost == true)

#### When Game.numberOfPlayers==Game.players.length and players have selected a role

Role Selected

Test Sound button (Play boat-horn.mp3 sound effect on the host phone)

"Start Game" button (change gameState to GameState.InProgress)

#### While Game.numberOfPlayers!=Game.players.length or not all players have selected a role

Role Selected

Test Sound button (Play boat-horn.mp3 sound effect on the host phone)

Waiting for other players (5/9 ready)...




------



## Game (GameState.InProgress)

### Host player
use assets/cult-gun-stash.png and assets/cult-conversion.png inside rounded square image buttons

Select Cultist Action
- Cult's Guns Stash (change gameState to GameState.CultGunStashSetup)
- Conversion to Cult (change gameState to GameState.CultConversionSetup)

End Game button (after confirmation, change gameState to GameState.Finished)

### Non-host players

Waiting for host to select cult action ...






------


## Game (GameState.CultGunStashSetup)


### Gun count section, shown to all players

<gun.png>
Set your gun count
<minus button> gunCount <plus button>


### Start button section, shown to host only

"Start Cult Gun Stash Step" button

when pressed, counts down 3 seconds and then changes gameState to GameState.CultGunStashInProgress



------


## Game (GameState.CultGunStashInProgress)

### Cult Leader view
Shows a list of all players (including themselves) and their gun count
Shows how many guns there are left to distribute
Shows a plus button to add a gun to that player. There is no undo button or minus button.

Remaining Guns: 3
Evan | 2 | +
Josh | 3 | +
...

When the last gun is distributed, wait random 2-5 seconds, play boat-horn.mp3, then change gameState to GameState.InProgress

### Non-Cult Leader View
show text:

Eyes closed.



------


## Game (GameState.CultConversionSetup)

### Convertibility section

Are you eligible to be converted?
Yes button
No button
<italics>You are ineligible if you have been cabin-searched, flogged, or converted. This question is asked of all players, even cultists. If you are a cultist, your answer here does not matter.</italics>


For cult leader and cultists, their Player.isConvertEligible should be set to false.
For all other players, set their Player.isConvertEligible to the value of their response.


### Start button section, shown to host only

"Start Cult Conversion Step" button

when pressed, counts down 3 seconds and then changes gameState to GameState.CultConversionInProgress


------


## Game (GameState.CultConversionInProgress)

### Cult Leader view
Shows a list of players that are eligible to be converted (Player.isConvertEligible == true)
Have a convert button for each player. Allow cult leader to click on a player to convert them.

Remaining Guns: 3
Evan | Convert
Josh | Convert
...


When a player is clicked/tapped, show message and countdown:


Close your eyes

Moving to results screen in 3...


After the timer ends
Change gameState to GameState.RoleReveal


### Non-Cult Leader View

Eyes closed


------


## Game (GameState.RoleReveal)


Play boat-horn.mp3 sound effect on the host phone only


On all phones, show a countdown:
Revealing role in 3...


After countdown:
Role: Pirate/Sailor/Cult Leader/Cultist. 

Ok button (when clicked/tapped, hides role and just says "Waiting...")


After 3 second countdown, whether or not Host clicked Ok button, Host phone changes gameState to GameState.InProgress

------



## Game (GameState.Finished)

On all phones, show a table of all players and their roles.


On the host phone, there is a "New Game" button that will start a new game.




