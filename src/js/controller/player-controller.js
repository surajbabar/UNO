var uno = angular.module('uno', []);
var net = require('net');

uno.controller('loadGame',function($scope){
    $scope.masterName = "127.0.0.1";
    $scope.playerName = "me";

})
exports.start =function(master,snapshot){

    console.log("suraj");
    window.open("../../view/player-screen.html");
}