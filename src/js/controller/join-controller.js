angular.module('clientController').controller('joinCtrl', function ($scope, $location, $route, playerService) {
    $scope.masterName = "127.0.0.1";
    $scope.playerName = "me";
    var client;
    var firstTimeData = true;
    $scope.joinGame = function () {
        client = net.connect({port: 8080, host: $scope.masterName}, function () {
            var introduction = {type: 'introduction', playerName: $scope.playerName};
            client.write(JSON.stringify(introduction));
            gui.Window.get().hide();
        });

        function switchToPlayerScreen(data) {
            playerService.changeData(data);
            playerService.setSocket(client);
            $location.url('player');
            $route.reload();
            gui.Window.get().show();
            gui.Window.get().title = $scope.playerName;
        }

        client.on('data', function (data) {
            var message = JSON.parse(data);

            if (firstTimeData) {
                firstTimeData = false;
                switchToPlayerScreen(message);
            }
            if (message.type == 'gameResult') {
                playerService.setGameResult(message);
                gui.Window.get().hide();
                $location.url('result');
                $route.reload();
                gui.Window.get().show();
                gui.Window.get().title = "Game Result";
            }
            else {
                playerService.changeData(message);
            }
        });

    };
});
