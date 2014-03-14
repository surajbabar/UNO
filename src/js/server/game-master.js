var gameMaster = {};
var net = require('net');

var totalPlayers;
var totalPacks;
var observer;
var messageServer;
var proxies = [];
var players = [];
var game;

