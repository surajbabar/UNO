var uno = angular.module('clientController', []);
var net = require('net');
var gui = require('nw.gui');
var cardModel = require('card.js').card;

uno.service('playerService', function ($rootScope) {
    this.playerData = {data: '', socket: ''};

    this.changeData = function (value) {
        this.playerData.data = value;
        $rootScope.$broadcast('dataChanged');
    }
    this.getData = function () {
        return this.playerData.data;
    }
    this.setSocket = function (socket) {
        this.playerData.socket = socket;
    }
    this.getSocket = function () {
        return this.playerData.socket;
    }
})

uno.controller('joinCtrl', function ($scope, $location, $route, playerService) {
    $scope.masterName = "127.0.0.1";
    $scope.playerName = "me";
    var client;
    var firstTimeData = true;
    $scope.joinGame = function () {
        gui.Window.get().hide();
        client = net.connect({port: 8080, host: $scope.masterName}, function () {
            var introduction = {type: 'introduction', playerName: $scope.playerName};
            client.write(JSON.stringify(introduction));
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
                console.log(message);
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
var update = function (snapshot, $scope) {
    $scope.players = snapshot.playerSummaries;
    $scope.myCards = setProperColors(snapshot.myCards);
    $scope.activityLog = $scope.activityLog + '\n' + snapshot.currentTurnLog;
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

    $scope.$watch("myCards", function () {
        $scope.numberOfCards = function () {
            return {
                width: ($scope.myCards.length * 85 * 2) + 'px'
            };
        };
    });

    var timeout;
    $scope.playCard = function (card) {
        if (!cardModel.canFollowCard(card, snapshot)) {
            alert("you can't play this card");
            return;
        }
        if (timeout) {
            clearTimeout(timeout);
        }
        var playedCardInfo = {type: 'playCardAction', card: card, color: "blue"};
        if (card.color == "black") {
            var color = prompt('please choose a color');
            playedCardInfo.color = color && color.toLowerCase() || playedCardInfo.color;
        }
        channel.write(JSON.stringify(playedCardInfo));
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