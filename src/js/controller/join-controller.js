var uno = angular.module('uno', []);
var net = require('net');
uno.controller('joinCtrl',function($scope){
    $scope.masterName = "127.0.0.1";
    $scope.playerName = "me";

    $scope.joinGame = function(){
        var client = net.connect({port: 8080, host: $scope.masterName});
        client.on('data',function(data){
            require('./player-controller.js').start(client,data);
        })
    }
})