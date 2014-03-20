var assert = require("assert");
var card = require("card.js").card;

describe('Card', function () {
    describe('#creaetCard', function () {
        it('should give a card having sign, value and color', function () {
            var expected = {sign: "1", color: "red"};
            var actual = card.createCard("1", "red");
            assert.deepEqual(expected, actual);
        })
    })

    describe('#getCardPack', function () {
        it('should give a pack of 108 cards', function () {
            var cards = card.getCardPack(1);
            assert.equal(108, cards.length);
        })
    })

    describe('#getCardPack', function () {
        it('should give three pack of 108 cards each', function () {
            var cards = card.getCardPack(3);
            assert.equal(108 * 3, cards.length);
        })
    })

    describe('#getPoints', function () {
        it('should give points of given card accordingly', function () {
            var blueCard = card.createCard("Reverse", "blue");
            var wild = card.createCard("Wild", "black");
            assert.equal(20, card.getPoints(blueCard));
            assert.equal(50, card.getPoints(wild));
        })
    })

    describe('#canFollow', function () {
        it('should tell you can play a card which matches to open pile card in sign or color', function () {
            var snapshot = {};
            snapshot.myCards = [];
            snapshot.runningColor = "red";
            snapshot.drawTwoRun = 0;
            snapshot.openCard = card.createCard("2", "red");
            var redCard = card.createCard("+4", "black");
            var _2card = card.createCard("2", "blue");

            var expected = card.canFollowCard(redCard, snapshot);
            assert.equal(true, expected);
            expected = card.canFollowCard(_2card, snapshot);
            assert.equal(true, expected);
        })
    })

    describe('#canFollow', function () {
        it('should tell you can not play a +4 when you have running color', function () {
            var snapshot = {};
            snapshot.myCards = [card.createCard("1", "red")];
            snapshot.runningColor = "red";
            snapshot.drawTwoRun = 0;
            snapshot.openCard = card.createCard("2", "red");
            var drawFour = card.createCard("+4", "black");

            var expected = card.canFollowCard(drawFour, snapshot);
            assert.equal(false, expected);
        })
    })
})