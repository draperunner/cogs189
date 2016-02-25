var thinkgear = require('node-thinkgear-sockets');

var client = thinkgear.createClient({ enableRawOutput: true });

client.on('data',function(data){

    console.log(data.eSense.attention);

});

client.connect();
