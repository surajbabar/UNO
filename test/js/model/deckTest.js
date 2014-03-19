var deck = require('deck.js').deck;
var card = require('card.js').card;
var assert = require('assert');

describe('Deck', function () {

    describe('#create', function () {
        it('should create a deck with 2 packs ', function () {
            var deckWith2Packs = deck.create(2);
            assert.equal(216, deckWith2Packs.cards.length);
        });
    });

    describe('#add', function () {
        it('should add a card in deck', function () {
            var actualDeck = deck.create(1);
            deck.add(actualDeck, card.createCard(0, "red"));
            assert.equal(109, actualDeck.cards.length);
        });
    });

    describe('#draw', function () {
        it('should give first card from deck', function () {
            var actualDeck = deck.create(1);
            var drawnCard = deck.draw(actualDeck);
            assert.deepEqual({sign: 0, color: 'red'}, drawnCard);
        });
    })

    describe('#draw', function () {
        it('should remove a card from deck', function () {
            var actualDeck = deck.create(1);
            deck.draw(actualDeck);
            assert.equal(107, actualDeck.cards.length);
        });
    });

    describe('#lookAtLast', function () {
        it('should give a last card of deck', function () {
            var actualDeck = deck.create(1);
            var expected = card.createCard("+4", "black");
            assert.deepEqual(expected, deck.lookAtLast(actualDeck));
        });
    });

    describe('#isEmpty', function () {
        it('should give true for empty deck', function () {
            var emptyDeck = deck.create(0);
            assert.equal(true, deck.isEmpty(emptyDeck));
        });
    });

    describe('#isEmpty', function () {
        it('should give false for a deck containing cards', function () {
            var actualDeck = deck.create(1);
            assert.equal(false, deck.isEmpty(actualDeck));
        });
    });

    describe('#addAll', function () {
        it('should add given cards to deck', function () {
            var deck1 = deck.create(1);
            var deck2 = deck.create(1);
            deck.addAll(deck2, deck1.cards);

            assert.equal(216, deck2.cards.length);
        });
    });

    describe('#drawAllButLast', function () {
        it('should keep the last card and draw all other cards', function () {
            var deck1 = deck.create(1);
            var drawnCards = deck.drawAllButLast(deck1);
            assert.equal(107, drawnCards.length);
        });
    });

});