var uno = angular.module('clientController', []);
var net = require('net');
var gui = require('nw.gui');
var cardModel = require('card.js').card;

uno.service('playerService', function ($rootScope) {
    var playerData = {data: '', socket: ''};
    var result = {};
    this.changeData = function (value) {
        playerData.data = value;
        $rootScope.$broadcast('dataChanged');
    }
    this.getData = function () {
        return playerData.data;
    }
    this.setSocket = function (socket) {
        playerData.socket = socket;
    }
    this.getSocket = function () {
        return playerData.socket;
    }
    this.setGameResult = function (data) {
        result = data;
    }
    this.getGameResult = function () {
        return result;
    }
});