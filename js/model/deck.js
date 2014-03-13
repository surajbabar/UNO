var deck = {};
var card = require('card.js').card;

deck.create =function(numberOfPacks){
	deck.cards=card.getCardPack(numberOfPacks);
};

deck.shuffle =function(){
	deck.cards.sort(function() { return 0.5 - Math.random()});
};

deck.draw =function(){
	deck.cards.splice(0,1); //removes first element
};

deck.add =function(card){
	deck.cards.push(card);
};

deck.lookAtLast =function(){
	return deck.cards[deck.cards.length-1];
};

deck.isEmpty=function(){
	return deck.cards.length==0;
};

deck.addAll =function(newCards[]){
	newCards.forEach(function(card){
	deck.cards.push(card);
	});
};

deck.drawAllButLast =function(){
		return deck.cards.splice(1,deck.cards.length-1);
};