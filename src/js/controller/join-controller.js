var config = require('uno-config');

angular.module('clientController').controller('joinCtrl', function ($scope, $http, $location, $route, playerService) {
    $http({method: 'get', url: config.host + 'mastersList/'}).success(function (data) {
        $scope.gameMasters = data;
    });

    $scope.masterName = "me";
    $scope.playerName = "player";
    $scope.amIJoined = false;
    $scope.inUse = false;
    $scope.full = false;
    $scope.joinGame = function () {
        var playerData = {playerName: $scope.playerName, masterName: $scope.masterName};
        playerService.setPlayerDetails(playerData);
        $http({method: 'post', url: config.host + 'joinGame', data: playerData}).success(function (data) {
            if (data == 'INUSE') {
                $scope.inUse = true;
                return;
            }
            if (data == 'FULL') {
                $scope.full = true;
                return;
            }
            $scope.inUse = false;
            $scope.full = false;
            $scope.amIJoined = true;
        });

        function makeGetRequest() {
            var url = config.host + 'snapshot';
            $http({method: 'get', url: url, params: playerData}).success(function (data) {
                if (data != '')
                    switchToPlayerScreen(data);
            });
        };

        var continuousRequestForFirstSnapshot = setInterval(makeGetRequest, 1000);

        function switchToPlayerScreen(data) {
            clearInterval(continuousRequestForFirstSnapshot);
            gui.Window.get().hide();
            playerService.setData(data);
            $location.url('player');
            $route.reload();
            gui.Window.get().show();
            gui.Window.get().title = $scope.playerName;
        }
    };
});
