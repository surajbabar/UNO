var uno = angular.module('clientController');

var checkForUno = function (playerSummaries) {
    playerSummaries.forEach(function (summary) {
        if (summary.unoStatus)
            summary.noOfCards = "uno";
    });
    return playerSummaries;
};

var getProperImage = function (card) {
    var cardPath = '../images/COLOR/SIGN.jpg';
    cardPath = cardPath.replace('COLOR',card.color).replace('SIGN',card.sign);
    return cardPath;
};

var update = function (snapshot, $scope) {
    $scope.players = checkForUno(snapshot.playerSummaries);

    snapshot.myCards.sort(function(card1,card2){
        return card1.color > card2.color;
    });
    
    $scope.myCards = snapshot.myCards;
    if (snapshot.currentTurnLog != '' && $scope.activityLog[0] != snapshot.currentTurnLog)
        $scope.activityLog.splice(0, 0, snapshot.currentTurnLog);
    $scope.openCard = snapshot.openCard;
    $scope.status = snapshot.status;
    $scope.directionSign = snapshot.isInAscendingOrder ? "=>" : "<=";
    $scope.enable = snapshot.playerSummaries[snapshot.currentPlayerIndex] != snapshot.playerSummaries[snapshot.myPlayerIndex];
    $scope.disableDraw = snapshot.disableDraw || $scope.enable;
    $scope.drawBackground = ($scope.disableDraw == false) ? {"background-color": "green"} : {"background-color": "transparent"};
    $scope.showWarning = false;
};

uno.controller('playerCtrl', function ($scope, $http, $location, $route, playerService) {
    $scope.activityLog = [];
    var drawCardTimeout;
    var colorAfterWildCard = '';

    var playerDetails = playerService.getPlayerDetails();
    var snapshot = playerService.getData();
    update(snapshot, $scope);

    var sendPlayerAction = function (path, actionData) {
        actionData.playerName = playerDetails.playerName;
        actionData.masterName = playerDetails.masterName;
        $http({method: 'post', url: config.host + path, data: actionData});
    };

    $scope.getCardProperties = function (card) {
        var properties = {};
        properties['background-image'] = 'url(' + getProperImage(card) + ')';
        return properties;
    }

    $scope.$watch("myCards", function () {
        $scope.numberOfCards = function () {
            return {
                width: ($scope.myCards.length * 110) + 'px'
            };
        };
        $scope.showCardSign = function (card) {
            return card.color == 'black' ? '' : card.sign;
        };
        $scope.setCardProperties = function (card) {
            return $scope.getCardProperties(card);
        };
    });

    $scope.setColor = function (color) {
        $scope.openColorChooser = false;
        colorAfterWildCard = color;
    };

    $scope.playCard = function (card) {
        if (!cardModel.canFollowCard(card, snapshot)) {
            $scope.warningMessage = "you can not  play this card.";
            $scope.showWarning = true;
            return;
        }

        if (drawCardTimeout) {
            clearTimeout(drawCardTimeout);
        }

        var playedCardInfo = {card: card, color: "blue"};

        if (card.color != "black") {
            sendPlayerAction('playCard', playedCardInfo);
            return;
        }

        colorAfterWildCard = '';
        $scope.openColorChooser = true;

        var validateColorAndSend = function () {
            playedCardInfo.color = colorAfterWildCard;
            if (colorAfterWildCard == '') {
                $scope.openColorChooser = false;
                $scope.$apply();
                return;
            }
            if (snapshot.myCards.length == 2) {
                var cardIndex = snapshot.myCards.indexOf(card);
                var otherCardIndex = cardIndex == 0 ? 1 : 0;
                var otherCardColor = snapshot.myCards[otherCardIndex].color;
                if (otherCardColor == playedCardInfo.color) {
                    $scope.warningMessage = "You cannot change the running color to your last cards color ";
                    $scope.showWarning = true;
                    $scope.$apply();
                    return;
                }
            }
            sendPlayerAction('playCard', playedCardInfo);
        };
        setTimeout(validateColorAndSend, 2000);
    };

    $scope.drawCard = function () {
        if (snapshot.drawTwoRun > 0) {
            sendPlayerAction('drawTwoCard', {});
            return;
        }
        sendPlayerAction('drawCard', {});
        var sendNoAction = function () {
            sendPlayerAction('noActionAfterDraw', {});
        };
        drawCardTimeout = setTimeout(sendNoAction, 5000);
    };

    $scope.catchPlayer = function (player) {
        var playerIndex = snapshot.playerSummaries.indexOf(player);
        if (playerIndex == snapshot.myPlayerIndex)
            return;

        if (player.noOfCards != 1) {
            $scope.warningMessage = player.name + " has more than one card";
            $scope.showWarning = true;
            return;
        }
        function sendCatchAction() {
            sendPlayerAction('catchPlayer', {caughtPlayerName: player.name});
        }

        setTimeout(sendCatchAction, 1000);
    };

    $scope.declareUno = function () {
        if (snapshot.myCards.length != 1) {
            $scope.warningMessage = "you can say uno if you have only one card";
            $scope.showWarning = true;
            return;
        }
        sendPlayerAction('uno', {});
    };

    function switchToGameOverScreen(data) {
        clearInterval(continuousRequestForSnapshot);
        playerService.setGameResult(data);
        gui.Window.get().hide();
        $location.url('result');
        $route.reload();
        gui.Window.get().show();
        gui.Window.get().title = "Game Result";
    }

    var onResponse = function (data) {
        if (data == '')
            return;
        if (data.type == 'gameResult') {
            switchToGameOverScreen(data);
            return;
        }
        snapshot = data;
        update(snapshot, $scope);
    };

    function makeGetRequest() {
        var url = config.host + 'snapshot';
        $http({method: 'get', url: url, params: playerDetails}).success(onResponse);
    }

    var continuousRequestForSnapshot = setInterval(makeGetRequest, 500);
});