var deck =require('../../../js/model/deck.js').deck;
var card =require('../../../js/model/card.js').card;
var assert =require('assert');

describe('Deck', function() {
    
    describe('#create', function() {
        it('should create a deck with 2 packs ', function() {
            var deckWith2Packs = deck.create(2);
            assert.equal(152,deckWith2Packs.cards.length);
	    });
    });
    
    describe('#add', function() {
        it('should add a card in deck', function() {
        	var actualDeck = deck.create(1);
        	deck.add(actualDeck,card.createCard(0,"red"));
        	assert.equal(77,actualDeck.cards.length);
	    });
    });

    describe('#draw', function() {
        it('should draw a card from deck', function() {
        	var actualDeck = deck.create(1);
        	deck.draw(actualDeck);
        	assert.equal(75,actualDeck.cards.length);
	    });
    });

    describe('#lookAtLast', function() {
        it('should give a last card of deck', function() {
        	var actualDeck = deck.create(1);
        	var expected = {"sign":"9","value":9,"color":"green"};
        	assert.deepEqual(expected,deck.lookAtLast(actualDeck));
	    });
    });
	
	describe('#isEmpty', function() {
        it('should give true for empty deck', function() {
        	var emptyDeck = deck.create(0);
        	assert.equal(true,deck.isEmpty(emptyDeck));
	    });
    });

	describe('#isEmpty', function() {
        it('should give false for a deck containing cards', function() {
        	var actualDeck = deck.create(1);
        	assert.equal(false, deck.isEmpty(actualDeck));
	    });
    });

    describe('#addAll', function() {
        it('should add given cards to deck', function() {
        	var deck1 = deck.create(1);
        	var deck2 = deck.create(1);
        	deck.addAll(deck2,deck1.cards);

        	assert.equal(152,deck2.cards.length);
	    });
    });

	describe('#drawAllButLast', function() {
        it('should keep the last card and draw all other cards', function() {
        	var deck1 = deck.create(1);
            var drawnCards = deck.drawAllButLast(deck1);
        	assert.equal(75,drawnCards.length);
	    });
    });

});