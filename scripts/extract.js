var csv = require('csv');
var fs = require('fs');
var path = require('path');


var eyeData = {};

// interesting fields
var fields = [
  25,26,27,28,29,30,31,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,
  60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,
  86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,
  109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,
  128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,
  151,152,153,154
];

var fieldNames = [];

function readData(callback) {
  parser = csv.parse({delimiter: ';'}, function(err, data){
    parseData(data);
    callback();
  });
  fs.createReadStream(__dirname+'/../data/TP68.csv').pipe(parser);
}

function parseData(rawData) {
  for (var x = 0; x < fields.length; x++) {
    fieldNames.push(rawData[0][fields[x]]);
  }
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

  // verification
  var sum = 0;
  for (var key in eyeData) {
    console.log(key, eyeData[key].length);
    sum += eyeData[key].length;
  }
  console.log('total', sum);
}

function writeData(data) {
  for (var question in eyeData) {
    var res = {
      question: question,
      user: 68,
      issue: false,
      data: []
    };
    for (var i = 0; i < eyeData[question].length; i++) {
      var measurement = {};
      for (var j = 0; j < fields.length; j++) {
        measurement[fieldNames[j]] = eyeData[question][i][fields[j]];
      }
      res.data.push(measurement);
    }
    // fs.mkdirSync(__dirname + '/../data/' + res.question);
    var fd = __dirname + '/../data/' + res.question + '/' + res.user + '.json';
    fs.writeFileSync(fd, JSON.stringify(res));
  }
}

readData(function(data) {
  console.log('data loaded');
  writeData(data);
});
