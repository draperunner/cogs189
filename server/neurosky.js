/** BEGIN connect to neurosky **/
var thinkgear = require('./neurosky_socket');

var client = thinkgear.createClient({ enableRawOutput: true });

var connected = false;

// bind receive data event
client.on('data', function(data){
	// if websocket server is running
	if (wss) {
		// broadcast this latest data packet to all connected clients
		wss.broadcast(data);
	}

	if (!connected) {
		console.log('[Neurosky] Connection established');
		connected = !connected;
	}
});

client.on('error', function(error) {
	console.log('[Neurosky] Unable to connect: ', error.code);
})

// initiate connection
client.connect();
/** END connect to neurosky **/

/** BEGIN start our websocket server **/
// start websocket server to broadcast
var WebSocketServer = require('ws').Server
var wss = new WebSocketServer({port: 8080});

// broadcast function (broadcasts message to all clients)
wss.broadcast = function(data) {
    for(var i in this.clients)
        this.clients[i].send(JSON.stringify(data));
};

// bind each connection
wss.on('connection', function(ws) {
    ws.on('message', function(message) {
        console.log('[Websocket][CLIENT] %s', message);
    });
		console.log('[Websocket] Listening on port 8080');
});
/** END start our websocket server **/

module.exports = {
	client: client,
	wss: wss
};
