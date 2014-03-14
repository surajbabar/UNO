var uno = angular.module('uno', []);
var net = require('net');
var sockets = [];


uno.controller('startCtrl', function ($scope) {
    $scope.createGame = function () {
        var server = net.createServer();
        server.listen(8080);

        server.on('connection', function (socket) {
            if (sockets.length == $scope.noOfPlayers)
                return;
            sockets.push(socket);
            if (sockets.length == $scope.noOfPlayers) {
                sockets.forEach(function (clientSocket) {
                    clientSocket.write('start');
                });
                console.log('all connections got');
            }
        });
    }
});
