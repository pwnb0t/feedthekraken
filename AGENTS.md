# AGENTS.md

# Project description
- Meteor JS app in React and Typescript.
- Feed the Kraken board game companion app for running the cultist rituals.
- Accessed by mobile browser during the board game.

# Game State Overview
- Join/Create game page (no game state yet); person can create game (becomes host); players enter their name and room code;
 
- GameState.Setup: host sets number of players
- GameState.Waiting: players select their role
- GameState.InProgress: Main screen where host can select cultist action to run or end the game
 
- GameState.CultGunStashSetup: Players set their current number of guns
- GameState.CultGunStashInProgress: Cult Leader distributes 3 guns to any player(s)
- GameState.CultGunStashResults: Players see how many guns they now have
 
- GameState.CultConversionSetup: Players set their eligibility for conversion
- GameState.CultConversionInProgress: Cult Leader converts an eligible player to a cultist
- GameState.RoleReveal: Players can see their role (which might have changed)

- GameState.GameOver: Players see list of all players and their roles; host can start a new game with same or different players