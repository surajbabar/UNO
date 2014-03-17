var uno = angular.module('uno', []);
var net = require('net');
var sockets = [];


uno.controller('startCtrl', function ($scope) {
    $scope.createGame = function () {
        var server = net.createServer();
        server.listen(8080);

        server.on('connection', function (socket) {
            if (sockets.length == $scope.noOfPlayers) {
                return;
            }
            sockets.push(socket);
            console.log('got '+sockets.length+' connections out of '+$scope.noOfPlayers);
            if (sockets.length == $scope.noOfPlayers) {
                sockets.forEach(function (clientSocket) {
                    clientSocket.write('start');
                });
            }
        });
    }
});
