var net = require('net');
var server = net.createServer();

server.on('connection',function(socket){
	socket.write(JSON.stringify({name:'raaz...'}));
	socket.on('data',function(data){
		console.log(JSON.parse(data));
	})
});

server.listen(8080,function () {
	console.log('server started on 8080');
});