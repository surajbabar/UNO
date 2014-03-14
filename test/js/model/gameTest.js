var game = require("../../../js/model/game.js").game;
var player = require("../../../js/model/player.js").player;
var assert = require("assert");
var players;



describe('Game',function () {
	beforeEach(function() {
	    players = [];
	    players.push(player.createPlayer('me'));
		players.push(player.createPlayer('you'));
		players.push(player.createPlayer('somone'));
	});

	describe('#createGame',function(){
		it('should start a game for given players',function(){
			var gm = game.createGame(2,players);
			assert.deepEqual(gm.players,players);
		})
	})

	describe('#initialize',function(){
		it('should deal 7 cards to each player',function(){
			var gm = game.createGame(1,players);
			gm.initialize();
			players.forEach(function(plyr){
				var summry = player.generateSummary(plyr);
				assert.equal(7,summry.noOfCards);
			})
		})
	})
})