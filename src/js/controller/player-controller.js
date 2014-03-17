var uno = angular.module('player-screen',[]);
//var net = require('net');
uno.controller('initial',function($scope){
    $scope.playerName = "me";

});

uno.controller('otherPlayers',function($scope){
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

//    console.log($scope);
});
//exports.start =function(master,snapshot,playerName){
//
//    console.log("suraj");
//}
