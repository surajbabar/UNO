var uno = angular.module('clientController');

uno.controller('gameOverCtrl', function ($scope, playerService) {
    var result = playerService.getGameResult();
    $scope.players = result.playerResults;
    $scope.obtainedResult=false;

    var getProperImage = function (card) {
        var colors = {
            "blue": "../images/blue.png",
            "red": "../images/red.png",
            "green": "../images/green.png",
            "yellow": "../images/yellow.png",
            "black": card.sign == "Wild" ? "../images/wild.png" : "../images/+4.png"
        };
        return colors[card.color] || card.color;
    };

    $scope.$watch("players.cards", function () {
        if(!$scope.obtainedResult){
            setTimeout(function(){
                $scope.obtainedResult=true;
                $scope.$apply();
            },5000);

        }

        $scope.setCardProperties = function (card) {
            return {"background-image": 'url(' + getProperImage(card) + ')'};
        };

        $scope.numberOfCardsLeft = function (player) {
            return {
                width: (player.cards.length * 85) + 'px'
            };
        };
    });

})