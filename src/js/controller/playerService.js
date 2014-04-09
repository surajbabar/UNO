var uno = angular.module('clientController', []);
var gui = require('nw.gui');
var cardModel = require('card.js').card;

uno.service('playerService', function () {
    var playerData = {data: ''};
    var playerDetails = {};
    var gameResult = {};

    this.setPlayerDetails = function (value) {
        playerDetails.playerName = value.playerName;
        playerDetails.masterName = value.masterName;
    }

    this.getPlayerDetails = function () {
        return playerDetails;
    }

    this.setData = function (value) {
        playerData.data = value;
    }

    this.getData = function () {
        return playerData.data;
    }

    this.setGameResult = function (value) {
        gameResult = value;
    }

    this.getGameResult = function () {
        return gameResult;
    }
});