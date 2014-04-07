angular.module('clientController').controller('joinCtrl', function ($scope, $http, $location, $route, playerService) {
    $scope.masterName = "me";
    $scope.playerName = "add";
    $scope.amIJoined = false;
    $scope.joinGame = function () {
        var data = {playerName: $scope.playerName, masterName: $scope.masterName};
        $http({method: 'post', url: 'http://uno-step2013.rhcloud.com/joinGame', data: data}).success(function () {
            $scope.amIJoined = true;
        });

        function makeGetRequest() {
            $http({method: 'get', url: 'http://uno-step2013.rhcloud.com/snapshot', params: data}).success(function (data) {
                if(data!='')
                    switchToPlayerScreen(data);
            });
        }

        var continuousRequestForFirstSnapshot = setInterval(makeGetRequest, 5000);

        function switchToPlayerScreen(data) {
            clearInterval(continuousRequestForFirstSnapshot);
            playerService.changeData(data);
            $location.url('player');
            $route.reload();
            gui.Window.get().show();
            gui.Window.get().title = $scope.playerName;
        }
    };
});
