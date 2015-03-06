var csv = require('csv');
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
  socket.on('startEyeDataStrean', function(qId) {
    console.log('start');
    transmitLoop(qId);
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
    x: eyeData[currentPos]['FixationPointX (MCSpx)'],
    y: eyeData[currentPos]['FixationPointY (MCSpx)']
  };
  io.sockets.emit('frame', data);
  currentPos++;
}

function transmitLoop(qId) {
  currentPos = 0;
  eyeData = JSON.parse(fs.readFileSync(__dirname+'/data/'+qId+'/68.json', "utf8")).data;
  clearInterval(interval);
  interval = setInterval(transmit, 1000 / 120); //120hz
}

http.listen(app.get('port'), function() {
  console.log('listening on ' + app.get('port'));
});
