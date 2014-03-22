UNO
======

UNO is a stand-alone app implemented using angularjs and node-webkit. It's a multiplayer game.

##How to Install
  * Clone the url `https://github.com/surajbabar/UNO.git` into your machine.
  * If you don't have `nodewebkit` installed globally on your machine do a `npm install -g nodewebkit@0.8.5`.

##How to Start
  * Go to the folder where you have cloned the repo.
  * run `nodewebkit` and game will start with a screen which will ask weather you will be a game-master or game-player.

###Game-Master
  * In game master screen you will get two options to give `Number of Packs` and `Number of Players` for the game. It's by default set to 1 and 1.
  * After filling these two fields you will click on `create game` button.
  * It will show the message that game creation message.

###Game-Player
  * In game player screen you will get two options `Game-Master` to give address of master and `Player Name` for the game. It's by default set to `127.0.0.1` and `me`.
  * After filling these two fields you will click on `join` button.
  * You will wait till all the players join the game.
  * After joining all players you will get the player screen.
  * As title of screen your name will be shown.
  * After that there will be current player's name and turn direction will be shown.
  * All the player's catch buttons will be there.
  * At the right side of screen activity log of game will be shown.
  * In the center of screen the `draw` button,`hint` and `open pile` will be shown.
  * At the bottom of screen player's card will be there.
  * UNO button will be there to declare `uno`.
  
## How To Play

#### Play a card
  * In your turn you can play a card.
  * If the played card will not match the rules player will get a warning message.

#### Draw Cards
  * You can draw a card in your turn.
  * After draw you will get 5 seconds to play the card after 5 seconds turn will go to next player
  * After a draw of `Draw Two` turn will immediately go to next player.
   
#### Play a wild or Draw Four
  * After playing a wild card or draw four a screen will appear where you have to fill the color name you want to chhose.
  * You can only fill red,blue,yellow or green color names.
  

