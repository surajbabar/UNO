var assert = require("assert");
var card = require("card.js").card;
var player = require("player.js").player;

var game;
var players;
var snapshot;


describe('Game', function () {
    beforeEach(function () {
        snapshot = {};
        players = [];
        players.push(player.createPlayer('me'));
        players.push(player.createPlayer('you'));
        players.push(player.createPlayer('someone'));
        game = require('game').createGame(1, players);
        game.initialize();
    });

    describe('#initialize', function () {
        it('should deal 7 cards to each player', function () {
            players.forEach(function (plyr) {
                var summry = player.generateSummary(plyr);
                assert.equal(7, summry.noOfCards);
            })
        })
    })

    describe('#populate', function () {
        it('should populate the snapshot of game status', function () {
            game.populate(snapshot, players[0]);
            assert.equal(7, snapshot.myCards.length);
        })
    })

    describe('#playCard', function () {
        it('should reverse the sequence when played card is Reverse', function () {
            var reverseCard = card.createCard("Reverse", "blue");
            game.populate(snapshot, players[0]);
            var isInAscendingOrder = snapshot.isInAscendingOrder;
            game.playCard(players[0], reverseCard, 'blue');
            game.populate(snapshot, players[0]);
            assert.notEqual(isInAscendingOrder, snapshot.isInAscendingOrder);
        })
    })

    describe('#playCard', function () {
        it('should increment the drawTwoRun by 1 when played card is +2', function () {
            var drawTwo = card.createCard("+2", "blue");
            game.populate(snapshot, players[0]);
            var drawTwoRun = snapshot.drawTwoRun;
            game.playCard(players[0], drawTwo, 'blue');
            game.populate(snapshot, players[0]);
            assert.equal(drawTwoRun + 1, snapshot.drawTwoRun);
        })
    })

    describe('#playCard', function () {
        it('should update the log of the game', function () {
            var drawTwo = card.createCard("+2", "blue");
            game.playCard(players[0], drawTwo, 'blue');
            game.populate(snapshot, players[0]);
            assert.equal(players[0].name + ' played a blue +2 ', snapshot.currentTurnLog.split('\n')[0]);
        })
    })

    describe('#initialize', function () {
        it('should update the log of the game', function () {
            var drawTwo = card.createCard("+2", "blue");
            game.populate(snapshot, players[0]);
            assert.equal('Game starts with', snapshot.currentTurnLog.slice(0, 16));
        })
    })
})