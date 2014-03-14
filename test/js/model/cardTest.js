var assert = require("assert");
var card = require("../../../js/model/card.js").card;

describe('Card', function(){
	describe('#creaetCard', function(){
		it('should give a card having sign, value and color', function(){
			var expected = {sign:"1",color:"red"};    
		  	var actual = card.createCard("1","red");
		  	assert.deepEqual(expected,actual);
		})
	})

	describe('#getCardPack', function(){
		it('should give a pack of 108 cards', function(){
			var cards = card.getCardPack(1);
			assert.equal(108,cards.length);
		})
	})

	describe('#getCardPack', function(){
		it('should give three packa of 108 cards each', function(){
			var cards = card.getCardPack(3);
			assert.equal(108 * 3,cards.length);
		})
	})
})