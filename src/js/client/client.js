var uno = angular.module('uno', [
    'ngRoute',
    'clientController'
]);

uno.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/join', {
                templateUrl: './join-game.html',
                controller: 'joinCtrl'
            }).
            when('/player', {
                templateUrl: './player-screen.html',
                controller: 'playerCtrl'
            }).
            when('/result', {
                templateUrl: './game-over.html',
                controller: 'gameOverCtrl'
            }).
            otherwise({
                redirectTo: '/join'
            });
    }]);