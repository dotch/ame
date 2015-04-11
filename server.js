var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('port', (process.env.PORT || 9000));

app.use(express.static(__dirname + "/public"));

io.on('connection', function(socket){
  console.log('a user connected');
  new transmission(socket);
});

var transmission = function(socket){
  this.socket = socket;
  var _this = this;
  this.socket.on('startEyeDataStrean', function(options) {
    console.log('start');
    _this.start(options.question,options.user);
  });
  this.socket.on('questionSelect', function(options) {
    console.log(options);
    _this.sendProblems(options.question);
  });
};
transmission.prototype.start = function(question, user) {
  this.currentPos = 0;
  this.interval = null;
  this.data = JSON.parse(fs.readFileSync(__dirname+'/data/'+question+'/'+user+'.json', "utf8"));
  clearInterval(this.interval);
  var _this = this;
  this.interval = setInterval(function(){
    _this.sendFrame();
  }, 1000 / 120); //120hz
};
transmission.prototype.stop = function() {
  clearInterval(this.interval);
  this.socket.emit('frame', {end: true});
  console.log('stop');
};
transmission.prototype.sendFrame = function() {
  if (this.currentPos > this.data.length - 1) {
    return this.stop();
  }
  var frame = {
    x: this.data[this.currentPos].x,
    y: this.data[this.currentPos].y,
    cx: this.data[this.currentPos].cx,
    cy: this.data[this.currentPos].cy
  };
  this.socket.emit('frame', frame);
  this.currentPos++;
};
transmission.prototype.sendProblems = function(question) {
  var questionData = JSON.parse(fs.readFileSync(__dirname+'/data/problems.json'))[question] || [];
  this.socket.emit('questionProblems', questionData);
};

http.listen(app.get('port'), function() {
  console.log('listening on ' + app.get('port'));
});
