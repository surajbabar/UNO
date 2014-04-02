var uno = angular.module('clientController');
var setProperColors = function (myCards) {
    myCards.forEach(function (card) {
        card.foreColor = card.color == "blue" || card.color == "black" ? "white" : "black";
        card.color = getProperImage(card);
    });
    return myCards;
};
var checkForUno = function (playerSummaries) {
    playerSummaries.forEach(function (summary) {
        if (summary.unoStatus)
            summary.noOfCards = "uno";
    });
    return playerSummaries;
}
var getProperImage = function (card) {
    var colors = {
        "blue": "../images/blue.png",
        "red": "../images/red.png",
        "green": "../images/green.png",
        "yellow": "../images/yellow.png",
        "black": card.sign == "Wild" ? "../images/wild.png" : "../images/+4.png"
    };
    return colors[card.color] || card.color;
}
var getColorNameFor = function (color) {
    var colors = {
        "../images/blue.png": "blue",
        "../images/red.png": "red",
        "../images/green.png": "green",
        "../images/yellow.png": "yellow",
        "../images/wild.png": "black",
        "../images/+4.png": "black"

    };
    return colors[color] || color;

}

var update = function (snapshot, $scope) {
    $scope.players = checkForUno(snapshot.playerSummaries);
    $scope.myCards = setProperColors(snapshot.myCards);
    if (snapshot.currentTurnLog != '')
        $scope.activityLog = snapshot.currentTurnLog + '\n----------------------------\n' + $scope.activityLog;
    $scope.openCard = snapshot.openCard;
    $scope.openPileProp = {"background-image": 'url(' + getProperImage(snapshot.openCard) + ')'};
    $scope.hint = snapshot.hint;
    $scope.directionSign = snapshot.isInAscendingOrder ? "=>" : "<=";
    $scope.currentPlayer = snapshot.playerSummaries[snapshot.currentPlayerIndex].name;
    $scope.enable = snapshot.playerSummaries[snapshot.currentPlayerIndex] != snapshot.playerSummaries[snapshot.myPlayerIndex];
    $scope.disableDraw = snapshot.disableDraw || $scope.enable;
}

uno.controller('playerCtrl', function ($scope, playerService) {
    $scope.activityLog = "";
    $scope.hint = "";
    var channel = playerService.getSocket();

    var snapshot = playerService.getData();
    update(snapshot, $scope);

    $scope.$watch("showWarning", function () {
        if ($scope.showWarning) {
            setTimeout(function () {
                $scope.showWarning = false;
                $scope.$apply();
            }, 2000);
        }
    });

    $scope.$watch("myCards", function () {
        $scope.numberOfCards = function () {
            return {
                width: ($scope.myCards.length * 85) + 'px'
            };
        };
        $scope.showCardSign = function (card) {
            return card.color == 'black' ? '' : card.sign;
        }
        $scope.setCardProperties = function (card) {
            return {"background-image": 'url(' + getProperImage(card) + ')'};
        }
    });

    var timeout;
    $scope.playCard = function (card) {
        card.color = getColorNameFor(card.color);
        snapshot.myCards.forEach(function (card) {
            card.color = getColorNameFor(card.color);
        })
        console.log(card, snapshot);
        if (!cardModel.canFollowCard(card, snapshot)) {
            $scope.warningMessage = "you can not  play this card.";
            $scope.showWarning = true;
            return;
        }
        if (timeout) {
            clearTimeout(timeout);
        }
        var playedCardInfo = {type: 'playCardAction', card: card, color: "blue"};
        if (card.color == "black") {
            var color = prompt('please choose a color');
            playedCardInfo.color = color && color.toLowerCase();
            if (['red', 'green', 'blue', 'yellow'].indexOf(playedCardInfo.color) < 0) {
                $scope.warningMessage = "You can choose red,green,blue or yellow.";
                $scope.showWarning = true;
                return;
            }
            channel.write(JSON.stringify(playedCardInfo));
            return;
        }
        channel.write(JSON.stringify(playedCardInfo));
    }

    $scope.catchPlayer = function (player) {
        var playerIndex = snapshot.playerSummaries.indexOf(player);
        if (playerIndex == snapshot.myPlayerIndex)
            return;
        if (player.noOfCards != 1) {
            $scope.warningMessage = player.name + " has more than one card";
            $scope.showWarning = true;
            return;
        }
        channel.write(JSON.stringify({type: 'playerCaught', playerIndex: playerIndex}));
    }

    $scope.declareUno = function () {
        if (snapshot.myCards.length != 1) {
            $scope.warningMessage = "you can say uno if you have only one card";
            $scope.showWarning = true;
            return;
        }
        channel.write(JSON.stringify({type: 'declaredUno' }));
        $scope.players[snapshot.myPlayerIndex].noOfCards = "uno";

    }

    $scope.drawCard = function () {
        if (snapshot.drawTwoRun > 0) {
            channel.write(JSON.stringify({type: 'drawTwoAction'}));
        }
        else {
            channel.write(JSON.stringify({type: 'drawAction'}));
            timeout = setTimeout(function () {
                channel.write(JSON.stringify({type: 'noActionAfterDraw'}));
            }, 5000);
        }
    }

    $scope.$on('dataChanged', function (data) {
        snapshot = playerService.getData();
        update(snapshot, $scope);
        $scope.$apply();
    });
});