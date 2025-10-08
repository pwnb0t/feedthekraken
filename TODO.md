# New TODO stuff to be fixed/changed

## Overall

Theming using the pdf booklet style.

## Login screen

Only search for games created in the last 24 hr that are not in game over state

Needing to enter name to create new game is awkward. Need to make this better.


## Game Setup

During role selection, verify the roles.
During role selection, add a "Go back to role selection" button. Possibly make this a new state.


On Game Setup screen, on the host phone, add a message about "host should have their volumed turned up for sounds"
Add vibration to all
Add a way to disable sound


## Cult Gun Stash


## Cult Conversion


Make cult leader screen on CultConversion show all players and have ineligible ones show "Ineligible"

Change "Hide Role" to be a "Ready" button. Still hides role. Host auto moves on when all players are ready.


## Host Game Config panel

Add Host config/admin screen/panel.
- Add a way to modify the players in the game (add/remove players, go back to role screen, etc.)
- Turn sound host-only/all/off (vibration stays on)

## Game Over screen

On all phones, show a table of all players and their roles.
On the host phone, there is a "New Game with same players" button and a "New Game with different players" button.

"New Game with same players" will just create a new game with all the same players and transfer everyone to that and they should arrive at the screen to choose their role.

"New Game with different players" will send the host to the GameState.Setup page where they can enter the number of players. All the other players will be send back to the Join Game page, but hopefully with their existing name and the new Room Code pre-entered.



------

AI Output for Phase 3 stuff:




## Phase 3: Polish & End Game
Based on the original TODO.md, here's what's left to implement:
### 1. **Finished Game State**
- Show table of all players and their roles
- Host has "New Game" button to restart

### 2. **Session/Cookie Persistence** _(from TODO notes)_
- Store player name in cookie
- Check for existing room code and in-progress game on landing page
- Auto-reconnect players if they refresh/close browser

### 3. **Error Handling & Validation**
- Validate room codes (4 chars, valid characters)
- Handle edge cases (player leaves mid-game, host disconnects, etc.)
- Better error messages for users

### 4. **UI Polish**
- Consistent styling across all screens
- Better spacing/layout on mobile devices
- Loading states for transitions
- Animations for state changes

### 5. **Testing & Bug Fixes**
- Test full game flow with multiple players
- Test edge cases (disconnections, rapid clicks, etc.)
- Fix any issues discovered during playtesting

**Priority order** would probably be:
1. **Finished state** - completes the basic game loop
2. **Session persistence** - major UX improvement
3. **Error handling** - prevents crashes/confusion
4. **UI polish** - makes it production-ready
5. **Testing** - ensures everything works

Which would you like to tackle first?

