var uno = angular.module('uno', []);
var gameMaster = require('game-master.js');
var net = require('net');


uno.controller('startCtrl', function ($scope) {
    $scope.noOfPacks = 1;
    $scope.noOfPlayers = 1;
    $scope.createGame = function(){
        gameMaster.startGameMaster($scope.noOfPacks,$scope.noOfPlayers);
    }
});
