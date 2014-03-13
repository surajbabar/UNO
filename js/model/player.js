var player = {};

player.createPlayer = function(name){
	return {name:name,cards:[],declaredUno:false};
}

player.takeCard = function(plyer,card) {
	plyer.cards.push(card);
	plyer.declaredUno = false;
}

player.populateSelf = function(plyer,snapshot){
	snapshot.myCards = [];
	plyer.cards.forEach(function(card){
		snapshot.myCards.push(card);
	});
}

player.generateSummary = function(plyer){
	return {name:plyer.name,noOfCards:plyer.cards.length,unoStatus:plyer.declaredUno};
}

player.playCard = function(plyer,card){
	var i = 0;
	for (i; i < plyer.cards.length; i++) {
		if(plyer.cards[i].sign == card.sign && plyer.cards[i].color == card.color)
			break;
	};
	plyer.cards.splice(i,1);
}

player.declareUno = function(plyer){
	plyer.declaredUno = true;
}

player.checkUno = function(plyer){
    return plyer.cards.length == 1 && !plyer.declaredUno;
}

player.hasWon = function(plyer){
	return plyer.cards.length == 0;
}

player.generateResult = function(plyer){
	return {name:plyer.name,cards:plyer.cards,points:calculatePoints(plyer)};
}

var calculatePoints = function(plyer){
	var total = 0;
	plyer.cards.forEach(function(card){
		total+=card.value;
	});
	return total;
}

exports.player = player;