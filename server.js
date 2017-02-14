"use strict";

var webSocketsServerPort = 80;

var webSocketServer = require('websocket').server;
var http = require('http');

var clients = []

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url); response.writeHead(404); response.end();
});
server.listen(process.env.PORT || webSocketsServerPort  , function() {
    console.log((new Date()) + " Server is listening on port " + process.env.PORT || webSocketsServerPort);
});

var wsServer = new webSocketServer({
    httpServer: server,
    autoAcceptConnections: true
});

    var timer = setInterval(function fak(){console.log(process.env.PORT)}, 4000)

var num = 0;

wsServer.on('request', function(request) {
    console.log((new Date()) + ' Connection from origin ' + request.origin + '.');

    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');

    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            
			var msg_string = message.utf8Data
			var split = msg_string.split(":");
			
            connection.id = split[0];
            
			if(split[1] == "connected"){
				clients.push(connection)
                
                for (var i=0; i < clients.length-1; i++) {
                    split[0] = clients[i].id;
                    var concat = split.join(':');
                    console.log(concat);
                    clients[clients.length-1].sendUTF(concat);
                }
                
			}
			
			// We simply rebroadcast all the messages and let the clients handle them
			for (var i=0; i < clients.length; i++) {
                // console.log(num++);
				clients[i].sendUTF(msg_string);
			}
        }
    });
    connection.on('close', function(connection) {
        //clients.splice(index, 1);
    });

});