var extract = require('./extract');
var async = require('async');
var fs = require('fs');

var srcFolder = __dirname + '/../data/raw/';
var destFolder = __dirname + '/../data/';
var files = fs.readdirSync(srcFolder).filter(function(f) {
  return f.indexOf('.csv') !== -1;
}).slice(29);

async.eachSeries(files, function(file, callback) {
  var id = file.split('_').pop().split('.')[0];
  file = srcFolder + file;
  extract(file, destFolder, id, function() {
    callback();
  });
}, function() {
  console.log('allDone');
});
