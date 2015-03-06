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
  socket.on('loadQuestion', function(qId) {
    fs.readFile(path.join(__dirname, 'survey', qId + '_stripped.html'), 'utf8', function(err, data) {
      socket.emit('questionContent', data);
    });
  });
});

var eyeData = {};
var currentQuestion;
var currentPos;
var interval;

function transmit() {
  if (currentPos > eyeData[currentQuestion].length - 1) {
    clearInterval(interval);
    console.log('stop');
    return;
  }
  var data = {
    // eyePos = [153,154]
    // fixationPos = [45,46]
    x: eyeData[currentQuestion][currentPos][45],
    y: eyeData[currentQuestion][currentPos][46]
  }
  io.sockets.emit('frame', data);
  currentPos++;
}

function transmitLoop(qId) {
  currentQuestion = qId;
  currentPos = 0;
  clearInterval(interval);
  interval = setInterval(transmit, 1000 / 120); //120hz
}

function readData(callback) {
  parser = csv.parse({delimiter: ';'}, function(err, data){
    parseData(data);
    callback();
  });
  fs.createReadStream(__dirname+'/2012_1_TP68.csv').pipe(parser);
}

function parseData(rawData) {
  var fieldIndex = 47;
  for (var i = 1; i < rawData.length; i++) { // ignore first row
    // find first question field that is not empty
    for (var j = fieldIndex; (j < fieldIndex + 10) && (j < 146); j++) {
      if(rawData[i][j] !== '' ) { // can be 0
        var questionId = rawData[0][fieldIndex].slice(4).split('_')[0];
        if (!eyeData[questionId]) {
          eyeData[questionId] = [];
        }
        eyeData[questionId].push(rawData[i]);
        fieldIndex = j;
        break;
      }
    }
  }
  var sum = 0;
  // verification
  for (var key in eyeData) {
    console.log(key, eyeData[key].length);
    sum += eyeData[key].length;
  }
  console.log(sum);
}

readData(function() {
  console.log('data loaded');
  // transmitLoop();
  http.listen(app.get('port'), function() {
    console.log('listening on ' + app.get('port'));
  });
});
