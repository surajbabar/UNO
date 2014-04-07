var config = require('uno-config');

angular.module('clientController').controller('joinCtrl', function ($scope, $http, $location, $route, playerService) {
    $http({method: 'get', url: config.host + 'mastersList/'}).success(function (data) {
        $scope.gameMasters = data;
    });

    $scope.masterName = "me";
    $scope.playerName = "add";
    $scope.amIJoined = false;
    $scope.joinGame = function () {
        var data = {playerName: $scope.playerName, masterName: $scope.masterName};
        $http({method: 'post', url: config.host + 'joinGame', data: data}).success(function () {
            $scope.amIJoined = true;
        });

        function makeGetRequest() {
            var url = config.host + 'snapshot';
            $http({method: 'get', url: url, params: data}).success(function (data) {
                if (data != '')
                    switchToPlayerScreen(data);
            });
        }

        var continuousRequestForFirstSnapshot = setInterval(makeGetRequest, 5000);

        function switchToPlayerScreen(data) {
            clearInterval(continuousRequestForFirstSnapshot);
            gui.Window.get().hide();
            playerService.changeData(data);
            $location.url('player');
            $route.reload();
            gui.Window.get().show();
            gui.Window.get().title = $scope.playerName;
        }
    };
});
