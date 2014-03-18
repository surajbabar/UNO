var uno = angular.module('clientController', []);
var net = require('net');
var gui = require('nw.gui');

uno.service('playerService', function () {
    this.playerData = {data: '', socket: ''};
    this.setData = function (value) {
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
    $scope.joinGame = function () {
        gui.Window.get().hide();
        client = net.connect({port: 8080, host: $scope.masterName}, function () {
            var introduction = {type: 'introduction', playerName: $scope.playerName};
            client.write(JSON.stringify(introduction));
        });

        client.on('data', function (data) {
            playerService.setData(data);
            playerService.setSocket(client);
            $location.url('player');
            $route.reload();
            gui.Window.get().show();
        });
    };
});

var update = function (snapshot, $scope) {
    $scope.activityLog = "";
    $scope.hint = "";
    $scope.players = snapshot.playerSummaries;
    $scope.myCards = snapshot.myCards;
    $scope.activityLog = $scope.activityLog + '\n' + snapshot.currentTurnLog;
    $scope.openCard = snapshot.openCard;
    $scope.hint = snapshot.hint;
}

uno.controller('playerCtrl', function ($scope, playerService) {
    var snapshot = JSON.parse(playerService.getData());
    console.log(snapshot);
    update(snapshot, $scope);
})