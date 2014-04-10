UNO
======

UNO is a stand-alone app implemented using angularjs and node-webkit. It's a multi-player game.

##Prerequisites
  * node
  * npm

##How to Install
  * Clone the url `https://github.com/surajbabar/UNO.git` into your machine.
  * run command `npm install` into UNO folder.

##How to Start
  * Go to the folder where you have cloned the repo.
  * run `nodewebkit` and game will start with a screen which will ask weather you will be a game-master or game-player.

###Game-Master
  * In game master screen you will get three options to give `master-name`, `Number of Packs` and `Number of Players` for the game.
  * After filling these fields you will click on `create game` button.
  * It will show the message that game creation message.

###Game-Player
  * In game player screen you will get two options `Game-Master` to give name of master who started the game and `Player Name` for the game.
  * After filling these two fields you will click on `join` button.
  * You will wait till all the players join the game.
  * After joining all players you will get the player screen.
  * As title of screen your name will be shown.
  * After that turn direction will be shown.
  * All the player's catch buttons will be there.
  * At the right side of screen activity log of game will be shown.
  * In the center of screen the `close pile` button,`hint` and `open pile` will be shown.
  * At the bottom of screen player's card will be there.
  * UNO button will be there to declare `uno`.
  
## How To Play

#### Play a card
  * In your turn you can play a card.
  * If the played card will not match the rules player will get a warning message.

#### Draw Cards
  * You can draw a card in your turn.
  * After draw you will get 5 seconds to play the card after 5 seconds turn will go to next player.
  * After a draw of `Draw Two` turn will immediately go to next player.
   
#### Play a wild or Draw Four
  * After playing a wild card or draw four a screen will appear having four buttons of colors red,blue,green and yellow.
  * If you won't choose the color in 2 seconds the game will go back to it's last played state.

#### Declare Uno
  * You can declare `UNO` when you have only one card in your hand.

#### Catch Player
  * You can `catch` a player who has only one card and has not declare `UNO`.
  * The caught player will get two cards.

#### Game Over
  * The game will be over when a player will finish all cards in hand.
  * The next screen will be calculating points of players.
  * After that the Result Screen will be shown.

