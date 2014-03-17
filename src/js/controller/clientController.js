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

uno.controller('joinCtrl',function($scope,$location,$route,playerService){
    $scope.masterName = "127.0.0.1";
    $scope.playerName = "me";
    var client;
    $scope.joinGame = function () {
        client = net.connect({port: 8080, host: $scope.masterName});
        client.on('data', function (data) {
            playerService.setData(data);
            $location.url('player');
            $route.reload();
        });
    };
});

uno.controller('playerCtrl',function($scope,playerService){
    console.log(playerService.getData());
    $scope.players=[{name:"suraj",noOfCards:5},{name:"mritunjay",noOfCards:5},{name:"suraj",noOfCards:5},{name:"mritunjay",noOfCards:5}];
    $scope.activityLog="sdgsxdfghjkjhgf";
    $scope.myCards=[{color:"red",sign:"4"},{color:"red",sign:"4"},{color:"red",sign:"4"},{color:"red",sign:"4"},{color:"red",sign:"4"}];
    var update = function(snapshot){
        $scope.activityLog=$scope.activityLog+'\n'+snapshot.currentTurnLog;
        $scope.openCard=snapshot.openCard;
        $scope.hint=snapshot.hint;

    }
    for(var i=0;i<15;i++){
        update({currentTurnLog:"sadf",openCard:{sign:'32'},hint:"play a red or 3"});
    }
})