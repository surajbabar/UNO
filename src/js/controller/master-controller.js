var uno = angular.module('uno', []);
var gameMaster = require('game-master.js');
var net = require('net');


uno.controller('startCtrl', function ($scope, $http) {
    $scope.masterName = "me";
    $scope.noOfPacks = 1;
    $scope.noOfPlayers = 1;
    $scope.gameNotCreated = true;

    $scope.createGame = function () {
        var data = {noOfPacks: $scope.noOfPacks, noOfPlayers: $scope.noOfPlayers, masterName: $scope.masterName};
        $http({method: 'post', url: 'http://uno-step2013.rhcloud.com/startGame', data: data}).success(function () {
            $scope.gameNotCreated = false;
        });
    }
});
