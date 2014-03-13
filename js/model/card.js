var card = {};

card.getCardPack = function(noOfPacks){
	var cards = [];
	for (var i = 0; i < noOfPacks; i++){
		var pack = createPack();
		pack.forEach(function(card){
			cards.push(card);
		});
	}
	return cards;
}

var createPack = function(){
	var pack = [];
	var colors = ["red","blue","yellow","green"];
	colors.forEach(function(color){
		pack.push({sign:["0",0],color:color});
		for (var i = 1; i < 10; i++) {
			pack.push({sign:i.toString(),value:i,color:color});
			pack.push({sign:i.toString(),value:i,color:color});
		}
	});
	return pack;
}

card.createCard = function(sign,color){
	return {sign:sign,value:(+sign),color:color};
}


exports.card = card;