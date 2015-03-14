var socket = io();

// dom elements
var questionSelect = document.getElementById('question');
var userSelect = document.getElementById('user');
var contentWrapper = document.getElementById('content-wrapper');
var startButton = document.getElementById('start');

// for canvas drawing
var circles = [];
var clickCircles = [];
var lines = [];
var bufferSize = 20;
var radius = 5;
var canvas = new fabric.Canvas('canvas');

startButton.addEventListener('click',function() {
  socket.emit('startEyeDataStrean', {
    question: questionSelect.value,
    user: userSelect.value
  });
  canvas.clear();
});
questionSelect.addEventListener('change',function(e) {
  canvas.clear();
  qId = e.target.value;
  var newFrame = document.createElement("iframe");
  newFrame.src = 'survey/' + e.target.value + '.html';
  newFrame.setAttribute('id','survey');
  newFrame.setAttribute('width','1264');
  newFrame.setAttribute('height','1024');
  var oldFrame = document.getElementById('survey');
  contentWrapper.replaceChild(newFrame, oldFrame);
});

socket.on('frame', function (data) {
  if (!data.x || !data.y) {
    if (data.end) {
      //canvas.clear();
    }
    return;
  }

  // draw fixation circle
  var circle = new fabric.Circle({
    left : (data.x-radius),
    top : (data.y-radius),
    radius : radius,
    fill : 'red'
  });
  canvas.add(circle);
  circles.push(circle);

  // draw saccade lines
  if (circles.length > 2) {
    var x1 = circles[circles.length-2].left + radius;
    var y1 = circles[circles.length-2].top + radius;
    var line = new fabric.Line([x1, y1, +data.x, +data.y], {
      fill: 'red',
      stroke: 'red',
      strokeWidth: 1,
      selectable: false
    });
    lines.push(line);
    canvas.add(line);
  }

  // draw click circle
  if (data.cx) {
    var clickCircle = new fabric.Circle({
      left : (data.cx-radius),
      top : (data.cy-radius),
      radius : radius,
      fill : 'blue'
    });
    canvas.add(clickCircle);
    clickCircles.push(clickCircle);
  }

  // clean up old circles and lines
  if (circles.length > bufferSize) {
    circles.shift().remove();
    lines.shift().remove();
  }
});
