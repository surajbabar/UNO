var uno = angular.module('uno', []);
var config = require('uno-config');

uno.controller('startCtrl', function ($scope, $http) {
    $scope.masterName = "me";
    $scope.noOfPacks = 1;
    $scope.noOfPlayers = 1;
    $scope.gameNotCreated = true;

    $scope.createGame = function () {
        var data = {noOfPacks: $scope.noOfPacks, noOfPlayers: $scope.noOfPlayers, masterName: $scope.masterName};
        var url = config.host + 'startGame';
        $http({method: 'post', url: url, data: data}).success(function () {
            $scope.gameNotCreated = false;
        });
    }
});
