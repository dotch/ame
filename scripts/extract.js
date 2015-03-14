var csv = require('csv');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

// interesting fields
var fields = [
  30,31,45,46,
  47,48,49,50,51,52,53,54,55,56,57,58,59,
  60,61,62,63,64,65,66,67,68,69,70,71,72,
  73,74,75,76,77,78,79,80,81,82,83,84,85,
  86,87,88,89,90,91,92,93,94,95,96,97,98,
  99,100,101,102,103,104,105,106,107,108,
  109,110,111,112,113,114,115,116,117,118,
  119,120,121,122,123,124,125,126,127,128,
  129,130,131,132,133,134,135,136,137,138,
  139,140,141,142,143,144,145
];

var fieldNames = [];

function readData(file, callback) {
  console.log('reading file', file);
  var parser = csv.parse({delimiter: ','}, function(err, data){
    callback(parseData(data));
  });
  fs.createReadStream(file).pipe(parser);
}

function parseData(rawData) {
  console.log('parsing data', rawData.length);
  eyeData = {};
  if (!fieldNames.length) {
    for (var x = 0; x < fields.length; x++) {
      var key = rawData[0][fields[x]].split(" ")[0]
        .replace('EyeTrackerTimestamp','time')
        .replace('AOI[','')
        .replace(']Hit','')
        .replace('MouseEventX','cx')
        .replace('MouseEventY','cy')
        .replace('FixationPointX','x')
        .replace('FixationPointY','y');
      fieldNames.push(key);
    }
  }

  var fieldIndex = 47; // first question field
  for (var i = 1; i < rawData.length; i++) { // ignore first row
    var questionId;
    // find first question field that is not empty
    for (var j = fieldIndex; (j < fieldIndex + 10) && (j < 146); j++) {
      // check if we have a click event and are handling question right now
      if(rawData[i][26] && eyeData[questionId]) {
        eyeData[questionId].push(rawData[i]);
      }
      // check if the hitbox for any question is set
      if(rawData[i][j] !== '') { // can be 0
        questionId = rawData[0][fieldIndex].slice(4).split('_')[0];
        if (!eyeData[questionId]) {
          eyeData[questionId] = [];
        }
        eyeData[questionId].push(rawData[i]);
        fieldIndex = j;
        break;
      }
    }
  }
  return eyeData;
}

function writeData(eyeData, destFolder, id, callback) {
  console.log('writing data', Object.keys(eyeData).length);
  for (var question in eyeData) {
    var res = [];
    for (var i = 0; i < eyeData[question].length; i++) {
      var measurement = {};
      for (var j = 0; j < fields.length; j++) {
        // dont include hit box info for other questions
        if (fields[j] < 46 || eyeData[question][i][fields[j]] !== '') {
          measurement[fieldNames[j]] = eyeData[question][i][fields[j]];
        }
      }
      res.push(measurement);
    }
    mkdirp.sync(path.join(destFolder, question));
    var fd = path.join(destFolder, question, id + '.json');
    fs.writeFileSync(fd, JSON.stringify(res));
  }
  console.log('done writing');
  callback();
}

function extract(srcFile, destFolder, id, callback) {
  readData(srcFile, function(data) {
    writeData(data, destFolder, id, callback);
  });
}


module.exports = extract;
