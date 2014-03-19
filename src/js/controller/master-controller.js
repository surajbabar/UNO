var uno = angular.module('uno', []);
var gameMaster = require('game-master.js');
var net = require('net');


uno.controller('startCtrl', function ($scope) {
    $scope.createGame = function(){
        gameMaster.startGameMaster($scope.noOfPacks,$scope.noOfPlayers);
    }
});
