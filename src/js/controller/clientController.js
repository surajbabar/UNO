var uno = angular.module('clientController', []);
var net = require('net');

uno.service('playerService',function(){
    this.playerData = {data:'q'};
    this.setData = function(value){
        this.playerData.data = value;
    }
    this.getData = function(){
        return this.playerData.data;
    }
})

uno.controller('joinCtrl',function($scope,$location,playerService){
    $scope.masterName = "127.0.0.1";
    $scope.playerName = "me";
    window.title
    $scope.joinGame = function(){
        var client = net.connect({port: 8080, host: $scope.masterName});
        client.on('data',function(data){
            playerService.setData(data);
            $location.path('player');
        });
    }
});

uno.controller('playerCtrl',function($scope,playerService){
    $scope.name = "me";
})