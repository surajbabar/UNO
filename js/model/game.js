var game = {};
var player = require('./player.js').player;
var card = require('./card.js').card;
var deck = require('./deck.js').deck;

var currentPlayerIndex = 0;
var isInAscendingOrder = true;
var runningColor;
var closedDeck;
var openDeck;
var drawTwoRun = 0;
var log = [];

game.createGame = function (noOfPacks,givenPlayers) {
	game.players = givenPlayers;
	closedDeck = deck.create(noOfPacks);
	openDeck = deck.create(0);
	return game;

}

game.initialize = function() {
    game.players.sort(function() { return 0.5 - Math.random()});
    deck.shuffle(closedDeck);
    for (var i = 0; i < 7; i++) {
        game.players.forEach(function(plyr){
            player.takeCard(plyr,draw());
        });
    }

    var drawnCard = drawCardButWild();
    deck.add(openDeck,drawnCard);

    handleReverse(drawnCard);
    handleSkip(drawnCard);
    handleDrawTwo(drawnCard);

    updateLogAfterInitialize(drawnCard);
}

var drawCardButWild = function() {
    var drawnCard = draw();
    if (drawnCard.color == "black") {
        deck.add(closedDeck,drawnCard);
        deck.shuffle(closedDeck);
        return drawCardButWild();
    }
    return drawnCard;
}

var draw = function() {
    if (deck.isEmpty(closedDeck)) {
        deck.addAll(closedDeck,deck.drawAllButLast(openDeck));
        deck.shuffle(closedDeck);
    }
    return deck.draw(closedDeck);
}

var handleReverse = function(playedCard) {
    if (playedCard.sign != "Reverse") return;
    isInAscendingOrder = !isInAscendingOrder;
}

var handleSkip = function(playedCard) {
    if (playedCard.sign != "Skip" ) return;
    nextTurn();
}

var handleDrawTwo = function(playedCard) {
    if (playedCard.sign != "DrawTwo") return;
    draw2Run++;
}

var handleWildCard = function(playedCard,newColor) {
    runningColor = playedCard.color == "black" ? newColor : playedCard.color;
    if (playedCard.sign == "DrawFour") applyDrawFour();
}

var applyDrawFour = function() {
    nextTurn();
    var plyr = game.players[currentPlayerIndex];
    for (var i = 0; i < 4; i++) {
        player.takeCard(plyr,draw());
    }
}

var nextTurn = function() {
    var increment = isInAscendingOrder ? 1 : -1;
    currentPlayerIndex = currentPlayerIndex + increment + game.players.length;
    currentPlayerIndex %= game.players.length;
}

game.drawCard = function(plyr) {
    var newCard = draw();
    player.takeCard(plyr,newCard);
    updateLogAfterDraw(plyr);
    return newCard;
}

game.declareUno = function(plyr) {
    player.declareUno(plyr);
    log.push(plyr.name + " has declared uno\n");
}

game.catchUno = function(playerIndex) {
    var caughtPlayer = players[playerIndex];
    if (player.checkUno(caughtPlayer)) {
        player.takeCard(caughtPlayer,draw());
        player.takeCard(caughtPlayer,draw());
        log.push(getTime() + " " + caughtPlayer.name + " has been catched " + "\n");
    }
    else
        log.push(getTime() + " catch was not valid on " + caughtPlayer.name + " " + "\n");
}

game.populateResult = function(gameResult) {
    gameResult.players = [];
    game.players.forEach(function(plyr){
        gameResult.players.push(player.generateResult(plyr));
    });
}

var drawTwoCards = function(plyr) {
    for (var i = 0; i < draw2Run * 2; i++) player.takeCard(plyr,draw());
    draw2Run = 0;
    nextTurn();
}

var moveForwardAsPlayerTookNoActionOnDrawnCard = function(plyr) {
    log.push(getTime() + " no action played by " + plyr.name + "\n");
    nextTurn();
}

var getTime =function(){
    return new Date().toString().split(" ")[4]; //current system time
}

var updateLogAfterDraw = function(plyr) {
    log.push(getTime() +" " + plyr.name + " drew a card " + "\n");
}

var updateLogAfterPlay = function(plyr,playedCard) {
    log.push(getTime() + " "+plyr.name + " played a " + playedCard.color + " " + playedCard.sign + "\n");
}

var updateLogAfterInitialize = function(playedCard) {
    log.push(getTime() + " " +" Game starts with " + playedCard.color + " " +playedCard.sign + "\n");
}


game.populate = function(snapshot,plyr) {
    player.populateSelf(plyr,snapshot);
    snapshot.myPlayerIndex = game.players.indexOf(plyr);
    var summaries = [];
    game.players.forEach(function(p){
        summaries.push(player.generateSummary(p));
    });
    snapshot.playerSummaries = summaries;
    snapshot.currentPlayerIndex = currentPlayerIndex;
    snapshot.openCard = deck.lookAtLast(openDeck);
    snapshot.isInAscendingOrder = isInAscendingOrder;
    snapshot.runningColour = runningColour;
    snapshot.draw2Run = draw2Run;
    snapshot.currentTurnLog = log[log.length-1];
}

game.playCard = function(plyr,playedCard,newColor) {
    player.playCard(plyr,playedCard);
    deck.add(openDeck,playedCard);
    handleReverse(playedCard);
    handleSkip(playedCard);
    handleDrawTwo(playedCard);
    handleWildCard(playedCard, newColor);
    nextTurn();
    updateLogAfterPlay(plyr,playedCard);
}

exports.game = game;