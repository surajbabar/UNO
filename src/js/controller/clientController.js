var uno = angular.module('clientController', []);
var net = require('net');
var gui = require('nw.gui');

uno.service('playerService', function () {
    this.playerData = {data: '', socket: ''};
    this.changeData = function (value) {
        this.playerData.data = value;
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
        }

        client.on('data', function (data) {
            switchToPlayerScreen(data);
            if (firstTimeData) {
                firstTimeData = false;
            }
            else {
                playerService.changeData(data);
            }
        });
    };
});

var update = function (snapshot, $scope) {
    $scope.players = snapshot.playerSummaries;
    $scope.myCards = snapshot.myCards;
    $scope.activityLog = $scope.activityLog + '\n' + snapshot.currentTurnLog;
    $scope.openCard = snapshot.openCard;
    $scope.hint = snapshot.hint;
    $scope.directionSign = snapshot.isInAscendingOrder ? "=>" : "<=";
}

uno.controller('playerCtrl', function ($scope, playerService) {
    $scope.activityLog = "";
    $scope.hint = "";
    var channel = playerService.getSocket();

    var snapshot = JSON.parse(playerService.getData());
    update(snapshot, $scope);

    $scope.playCard = function (card) {
        var playedCardInfo = {type: 'playCardAction', card: card, color: 'blue'};
        channel.write(JSON.stringify(playedCardInfo));
    }
})