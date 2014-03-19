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
            console.log(Object.keys(data));
        }

        client.on('data', function (data) {
            var message = JSON.parse(data);
            if (firstTimeData) {
                firstTimeData = false;
                switchToPlayerScreen(message);
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
}

uno.controller('playerCtrl', function ($scope, playerService) {
    $scope.activityLog = "";
    $scope.hint = "";
    var channel = playerService.getSocket();

    var snapshot = playerService.getData();

    update(snapshot, $scope);
    $scope.playCard = function (card) {
//        if (!cardModel.canFollowCard(card, snapshot.openCard, snapshot.drawTwoRun, snapshot.runningColor)) {
//            alert("you cann't play this card");
//            return;
//        }
        var playedCardInfo = {type: 'playCardAction', card: card, color: 'blue'};
        channel.write(JSON.stringify(playedCardInfo));
    }

    $scope.$on('dataChanged', function (data) {
        snapshot = playerService.getData();
        update(snapshot, $scope);
        $scope.$apply();
    })
})