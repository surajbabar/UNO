var uno = angular.module('uno' , []);

uno.factory('socket', function ($rootScope) {
	var address = 'http://'+masterName;
	var socket = io.connect(address);
	console.log(address);
	return {
		on: function (eventName, callback) {
		  socket.on(eventName, function () {  
		    var args = arguments;
		    $rootScope.$apply(function () {
		      callback.apply(socket, args);
		    });
		  });
		},
		emit: function (eventName, data, callback) {
		  socket.emit(eventName, data, function () {
		    var args = arguments;
		    $rootScope.$apply(function () {
		      if (callback) {
		        callback.apply(socket, args);
		      }
		    });
		  })
		}
	};
});
