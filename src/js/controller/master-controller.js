var uno = angular.module('uno', []);
var config = require('uno-config');
var gui = require('nw.gui');

uno.controller('startCtrl', function ($scope, $http) {
    $scope.masterName = "me";
    $scope.noOfPacks = 1;
    $scope.noOfPlayers = 1;
    $scope.gameCreated = false;
    $scope.inUse = false;
    var dataCleared = false;

    $scope.createGame = function () {
        var data = {noOfPacks: $scope.noOfPacks, noOfPlayers: $scope.noOfPlayers, masterName: $scope.masterName};
        var url = config.host + 'startGame';
        $http({method: 'post', url: url, data: data}).success(function (data) {
            if (data == 'INUSE') {
                $scope.inUse = true;
                return;
            }
            $scope.gameCreated = true;
            $scope.inUse = false;
        });
    };
    $scope.clearData = function () {
        dataCleared = true;
        $http({method: 'post', url: config.host + 'gameOver', data: {master: $scope.masterName}});
        window.close();
    }

    var window = gui.Window.get();
    window.on('close', function () {
        if ($scope.gameCreated)
            $http({method: 'post', url: config.host + 'gameOver', data: {master: $scope.masterName}});
        this.close(true);
    });
});
