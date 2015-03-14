var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('port', (process.env.PORT || 9000));

app.use(express.static(__dirname + "/public/"));

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('startEyeDataStrean', function(options) {
    console.log('start');
    transmitLoop(options.question,options.user);
  });
});

var eyeData;
var currentPos;
var interval;

function transmit() {
  if (currentPos > eyeData.length - 1) {
    clearInterval(interval);
    console.log('stop');
    return;
  }
  var data = {
    x: eyeData[currentPos].x,
    y: eyeData[currentPos].y,
    cx: eyeData[currentPos].cx,
    cy: eyeData[currentPos].cy
  };
  io.sockets.emit('frame', data);
  currentPos++;
}

function transmitLoop(question, user) {
  currentPos = 0;
  eyeData = JSON.parse(fs.readFileSync(__dirname+'/data/'+question+'/'+user+'.json', "utf8"));
  clearInterval(interval);
  interval = setInterval(transmit, 1000 / 120); //120hz
}

http.listen(app.get('port'), function() {
  console.log('listening on ' + app.get('port'));
});
