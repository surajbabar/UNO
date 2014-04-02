var uno = angular.module('clientController');

var setProperColors = function (myCards) {
    function getNiceLookingColorFor(color) {
        var colors = {
            "blue": "rgb(41, 128, 185)",
            "red": "rgb(192, 57, 43)",
            "green": "rgb(46, 204, 113)",
            "yellow": "rgb(241, 196, 15)"
        };
        return colors[color] || color;
    }

    myCards.forEach(function (card) {
        card.foreColor = card.color == "blue" || card.color == "black" ? "white" : "black";
        card.color = getNiceLookingColorFor(card.color);
    });
    return myCards;
}
var checkForUno = function (playerSummaries) {
    playerSummaries.forEach(function (summary) {
        if (summary.unoStatus)
            summary.noOfCards = "uno";
    });
    return playerSummaries;
}
var update = function (snapshot, $scope) {
    $scope.players = checkForUno(snapshot.playerSummaries);
    $scope.myCards = setProperColors(snapshot.myCards);
    if (snapshot.currentTurnLog != '')
        $scope.activityLog = snapshot.currentTurnLog + '\n----------------------------\n' + $scope.activityLog;
    $scope.openCard = snapshot.openCard;
    var foreColor = $scope.openCard.color == "blue" || $scope.openCard.color == "black" ? "white" : "black";
    $scope.openPileProp = {background: snapshot.openCard.color, color: foreColor};
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
    });

    var timeout;
    $scope.playCard = function (card) {
        function getColorNameFor(color) {
            var colors = {
                "rgb(41, 128, 185)": "blue",
                "rgb(192, 57, 43)": "red",
                "rgb(46, 204, 113)": "green",
                "rgb(241, 196, 15)": "yellow"
            };
            return colors[color] || color;

        }

        card.color = getColorNameFor(card.color);
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
        if (player.noOfCards != 1) {
            $scope.warningMessage = player.name + " has more than one card";
            $scope.showWarning = true;
            return;
        }
        channel.write(JSON.stringify({type: 'playerCaught', playerIndex: snapshot.playerSummaries.indexOf(player)}));
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