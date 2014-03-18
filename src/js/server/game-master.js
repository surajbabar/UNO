var gameMaster = {};
var gameModel = require('../model/game.js').game;
var net = require('net');

var totalPlayers;
var totalPacks;
var observer;
var messageServer;
var proxies = [];
var players = [];
var game;

gameMaster.createGameMaster = function (noOfPacks, noOfPlayers) {
    var server = net.createServer();
    server.listen(8080);

//    server.on('connection', function (socket) {
//        if (sockets.length == $scope.noOfPlayers) {
//            return;
//        }
//        sockets.push(socket);
//        console.log('got '+sockets.length+' connections out of '+$scope.noOfPlayers);
//        if (sockets.length == $scope.noOfPlayers) {
//            sockets.forEach(function (clientSocket) {
//                clientSocket.write('start');
//            });
//        }
//    });
}

exports.start = function (noOfPacks,noOfPlayers) {
    console.log('mai yaha aya tha');
    gameMaster.createGameMaster(noOfPacks, noOfPlayers);
}

