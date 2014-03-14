var assert = require("assert");
var game = require("../../../js/model/game.js").game;
var card = require("../../../js/model/card.js").card;
var player = require("../../../js/model/player.js").player;

var gm;
var players;
var snapshot;


describe('Game',function () {
	beforeEach(function() {
		snapshot = {};
	    players = [];
	    players.push(player.createPlayer('me'));
		players.push(player.createPlayer('you'));
		players.push(player.createPlayer('somone'));
	    gm = game.createGame(1,players);
		gm.initialize();
	});

	describe('#createGame',function(){
		it('should start a game for given players',function(){
			assert.deepEqual(gm.players,players);
		})
	})

	describe('#initialize',function(){
		it('should deal 7 cards to each player',function(){
			players.forEach(function(plyr){
				var summry = player.generateSummary(plyr);
				assert.equal(7,summry.noOfCards);
			})
		})
	})

	describe('#populate',function(){
		it('should populate the snapshot of game status',function(){
			game.populate(snapshot,players[0]);
			assert.equal(0,snapshot.currentPlayerIndex);
			assert.equal(0,snapshot.drawTwoRun);
			assert.equal(true,snapshot.isInAscendingOrder);
			assert.equal(7,snapshot.myCards.length);
		})
	})

	describe('#playCard',function(){
		it('should skip next player when played card is Skip',function(){
			var skipCard = card.createCard("Skip","blue");
			game.populate(snapshot,players[0]);
			var currentPlayerIndex = snapshot.currentPlayerIndex;
			game.playCard(players[0],skipCard,'blue');
			game.populate(snapshot,players[0]);
			assert.equal(currentPlayerIndex+2,snapshot.currentPlayerIndex);
		})
	})

	describe('#playCard',function(){
		it('should reverse the sequence when played card is Reverse',function(){
			var reverseCard = card.createCard("Reverse","blue");
			game.populate(snapshot,players[0]);
			var isInAscendingOrder = snapshot.isInAscendingOrder;
			game.playCard(players[0],reverseCard,'blue');
			game.populate(snapshot,players[0]);
			assert.notEqual(isInAscendingOrder,snapshot.isInAscendingOrder);
		})
	})

	describe('#playCard',function(){
		it('should increment the drawTwoRun by 1 when played card is DrawTwo',function(){
			var drawTwo = card.createCard("DrawTwo","blue");
			game.populate(snapshot,players[0]);
			var drawTwoRun = snapshot.drawTwoRun;
			game.playCard(players[0],drawTwo,'blue');
			game.populate(snapshot,players[0]);
			assert.equal(drawTwoRun+1,snapshot.drawTwoRun);
		})
	})

	describe('#playCard',function(){
		it('should update the log of the game',function(){
			var drawTwo = card.createCard("DrawTwo","blue");
			game.playCard(players[0],drawTwo,'blue');
			game.populate(snapshot,players[0]);
			assert.equal(players[0].name+' played a blue DrawTwo\n',snapshot.currentTurnLog.slice(9)); 
		})
	})

	describe('#initialize',function(){
		it('should update the log of the game',function(){
			var drawTwo = card.createCard("DrawTwo","blue");
			game.populate(snapshot,players[0]);
			assert.equal('Game starts with',snapshot.currentTurnLog.slice(10,26)); 
		})
	})

	describe('#playCard',function(){
		it('should update the log of the game',function(){
			var drawTwo = card.createCard("DrawTwo","blue");
			game.playCard(players[0],drawTwo,'blue');
			game.populate(snapshot,players[0]);
			assert.equal(players[0].name+' played a blue DrawTwo\n',snapshot.currentTurnLog.slice(9)); 
		})
	})

	describe('#drawCard',function(){
		it('should update the log of the game',function(){
			game.drawCard(players[0]);
			game.populate(snapshot,players[0]);
			assert.equal(players[0].name+' drew a card\n',snapshot.currentTurnLog.slice(9)); 
		})
	})

	// describe('#playCard',function(){
	// 	it('should give cards to next player according to drawTwoRun',function(){
	// 		var drawTwo = card.createCard("DrawTwo","blue");
	// 		game.populate(snapshot,players[1]);
	// 		console.log(snapshot.drawTwoRun)
	// 		var noOfCards = snapshot.myCards.length;
	// 		var drawTwoRun = snapshot.drawTwoRun;
	// 		game.playCard(players[0],drawTwo,'blue');
	// 		game.populate(snapshot,players[1]);
	// 		assert.equal(noOfCards+drawTwoRun+2,snapshot.myCards.length);
	// 	})
	// })

})