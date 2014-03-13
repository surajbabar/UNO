var player = {name:"",cards:[],declaredUno:false};

player.createPlayer = function(name){
	player.name = name;
	return player;
}

player.takeCard = function(card) {
	player.cards.push(card);
	player.declaredUno = false;
}

player.populateSelf = function(snapshot){
	snapshot.myCards = [];
	player.cards.forEach(function(card){
		snapshot.myCards.push(card);
	});
}

player.generateSummary = function(){
	return {name:player.name,noOfCards:player.cards.length,unoStatus:player.declaredUno};
}

player.playCard = function(card){
	var i = 0;
	for (i; i < player.cards.length; i++) {
		if(player.cards[i].sign == card.sign && player.cards[i].color == card.color)
			break;
	};
	player.cards.splice(i,1);
}

player.declareUno = function(){
	player.declareUno = true;
}

player.checkUno = function(){
    return player.cards.length == 1 && !declaredUno;
}

player.hasWon = function(){
	return player.cards.length == 0;
}

player.generateResult = function(){
	return {name:player.name,cards:player.cards,points:calculatePoints()};
}

var calculatePoints = function(){
	var total = 0;
	player.cards.forEach(function(card){
		total+=card.sign[1];
	});
	return total;
}

exports.player = player;