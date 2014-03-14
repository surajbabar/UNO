var net = require('net');
var client = net.connect({port:8080,host:process.argv[2]},function(){
	client.write(JSON.stringify({name:'client'}));
});

client.on('data',function (data) {
	console.log(JSON.parse(data));
});
