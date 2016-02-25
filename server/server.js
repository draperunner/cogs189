var express = require('express');
var app = express();

app.use(express.static(__dirname + '/../client/'));
app.use(express.static(__dirname + '/../bower_components/'));

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
