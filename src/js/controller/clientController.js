var uno = angular.module('clientController', []);
var net = require('net');
var gui = require('nw.gui');
var cardModel = require('card.js').card;

uno.service('playerService', function ($rootScope) {
    var playerData = {data: '', socket: ''};
    var result = {};
    this.changeData = function (value) {
        playerData.data = value;
        $rootScope.$broadcast('dataChanged');
    }
    this.getData = function () {
        return playerData.data;
    }
    this.setSocket = function (socket) {
        playerData.socket = socket;
    }
    this.getSocket = function () {
        return playerData.socket;
    }
    this.setGameResult = function (data) {
        result = data;
    }
    this.getGameResult = function () {
        return result;
    }
})

uno.controller('joinCtrl', function ($scope, $location, $route, playerService) {
    $scope.masterName = "127.0.0.1";
    $scope.playerName = "me";
    var client;
    var firstTimeData = true;
    $scope.joinGame = function () {
        client = net.connect({port: 8080, host: $scope.masterName}, function () {
            var introduction = {type: 'introduction', playerName: $scope.playerName};
            client.write(JSON.stringify(introduction));
            gui.Window.get().hide();
        });

        function switchToPlayerScreen(data) {
            playerService.changeData(data);
            playerService.setSocket(client);
            $location.url('player');
            $route.reload();
            gui.Window.get().show();
            gui.Window.get().title = $scope.playerName;
        }

        client.on('data', function (data) {
            var message = JSON.parse(data);

            if (firstTimeData) {
                firstTimeData = false;
                switchToPlayerScreen(message);
            }
            if (message.type == 'gameResult') {
                playerService.setGameResult(message);
                gui.Window.get().hide();
                $location.url('result');
                $route.reload();
                gui.Window.get().show();
                gui.Window.get().title = "Game Result";
            }
            else {
                playerService.changeData(message);
            }
        });

    };
});

var setProperColors = function (myCards) {
    myCards.forEach(function (card) {
        card.foreColor = card.color == "blue" || card.color == "black" ? "white" : "black";
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
            }, 1500);
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
//        if (!cardModel.canFollowCard(card, snapshot)) {
//            $scope.warningMessage = "you can not  play this card.";
//            $scope.showWarning = true;
//            return;
//        }
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
    })
})


uno.controller('gameOverCtrl', function ($scope, playerService) {
    var result = playerService.getGameResult();
    $scope.players = result.playerResults;

    $scope.$watch("players.cards", function () {
        $scope.numberOfCardsLeft = function (player) {
            return {
                width: (player.cards.length * 85) + 'px'
            };
        };
    });

})