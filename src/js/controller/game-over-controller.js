var uno = angular.module('clientController');

uno.controller('gameOverCtrl', function ($scope, playerService) {
    var result = playerService.getGameResult();
    $scope.players = result.playerResults;

    $scope.$watch("players.cards", function () {
        $scope.numberOfCardsLeft = function (player) {
            return {
                width: (player.cards.length * 85) + 'px'
            };
        };
    });

})