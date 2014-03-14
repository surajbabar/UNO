var card = {};

card.createCard = function(sign, color){
	return {sign:sign,color:color};
}

card.getPoints = function(card){
	var points = {"0":0,"1":1,"2":2,"3":3,"4":4,"5":5,"6":6,"7":7,"8":8,"9":9,
					"Reverse":20,"Skip":20,"DrawTwo":20,"DrawFour":50,"Wild":50};
	return points[card.sign];
	
}

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
		pack.push(card.createCard("0",color));
		for (var times = 0; times < 2; times++) {
                for (var i = 1; i < 10; i++) {
                    pack.push(card.createCard(i.toString(),color));
                }
                pack.push(card.createCard("Reverse",color));
                pack.push(card.createCard("Skip",color));
                pack.push(card.createCard("DrawTwo",color));
        }
	});

	for (var times = 0; times < 4; times++) {
	    pack.push(card.createCard("Wild","black"));
	    pack.push(card.createCard("DrawFour","black"));
	}
	return pack;
}

exports.card = card;