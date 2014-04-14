var uno = angular.module('clientController');


uno.controller('gameOverCtrl', function ($scope, playerService) {
    var result = playerService.getGameResult();

    result.playerResults.sort(function(playerResult1,playerResult2){
        if(playerResult1.points > playerResult2.points)
            return 1;
        return -1;

    });
    $scope.players = result.playerResults;
    $scope.obtainedResult = false;


    var getProperImage = function (card) {
        var cardPath = '../images/COLOR/SIGN.jpg';
        cardPath = cardPath.replace('COLOR',card.color).replace('SIGN',card.sign);
        return cardPath;
    };

    $scope.$watch("players", function () {
        if (!$scope.obtainedResult) {
            setTimeout(function () {
                $scope.obtainedResult = true;
                $scope.$apply();
            }, 0000);

        }

        $scope.setCardProperties = function (card) {
            return {"background-image": 'url(' + getProperImage(card) + ')'};
        };

        $scope.numberOfCardsLeft = function (player) {
            return {
                width: (player.cards.length * 85) + 'px'
            };
        };

        $scope.numberOfPlayers = function (players) {
            return {
                height: (players.size * 150) + 'px'
            };
        };
    });
});