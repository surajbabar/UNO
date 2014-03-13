var deck =require('../../../js/model/deck.js').deck;
var card =require('../../../js/model/card.js').card;
var assert =require('assert');

describe('deck', function() {
    
    describe('create', function() {
        it('should create a deck with 2 packs ', function() {
            assert.equal(152,deck.create(2).cards.length);
	    });
    });
    
    describe('add', function() {
        it('should add a card in deck', function() {
        	var actualDeck = deck.create(1);
        	actualDeck.add(card.createCard(0,"red"));
        	assert.equal(77,actualDeck.cards.length);
	    });
    });

    describe('draw', function() {
        it('should draw a card from deck', function() {
        	var actualDeck = deck.create(1);
        	actualDeck.draw();
        	assert.equal(75,actualDeck.cards.length);
	    });
    });

    describe('lookAtLast', function() {
        it('should give a last card of deck', function() {
        	var actualDeck = deck.create(1);
        	var expected = {"sign":"9","value":9,"color":"green"};
        	assert.deepEqual(expected,actualDeck.lookAtLast());
	    });
    });
	
	describe('isEmpty', function() {
        it('should give true for empty deck', function() {
        	var emptyDeck = deck.create(0);
        	assert.equal(true,emptyDeck.isEmpty());
	    });
    });

	describe('isEmpty', function() {
        it('should give false for a deck containing cards', function() {
        	var Deck = deck.create(1);
        	assert.equal(false, Deck.isEmpty());
	    });
    });

    describe('addAll', function() {
        it('should add given cards to deck', function() {
        	var deck1 = deck.create(1);
        	var deck2 = deck.create(1);
        	deck2.addAll(deck1.cards);

        	assert.equal(152,deck2.cards.length);
	    });
    });

	describe('drawAllButLast', function() {
        it('should keep the last card and draw all other cards', function() {
        	var deck1 = deck.create(1);
        	assert.deepEqual(75,deck1.drawAllButLast().length);
	    });
    });

});