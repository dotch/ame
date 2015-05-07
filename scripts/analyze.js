var R = require('ramda');
var fs = require('fs');


function resultFilepathsForQuestion(id) {
  return fs.readdirSync(__dirname + '/../data/' + id + '/').map(function (f) {
    return __dirname + '/../data/' + id + '/' + f;
  });
}

function resultsFromFile(filepath) {
  return {
    user: filepath.split('/').pop().split('.')[0],
    question: filepath.split('/')[filepath.split('/').length - 2],
    eyeData: JSON.parse(fs.readFileSync(filepath, 'utf8'))
  };
}

function numberOfFixations(data) {
  return R.merge(data, {
    fixationCount: data.eyeData.length
  });
}

function numberOfFixationsOnQuestionText(data) {
  function questionTextHit(d) {
    return d[data.question + '_qtext'] === '1';
  }
  return R.merge(data, {
    fixationQuestionTextCount: R.pipe(
      R.filter(questionTextHit),
      R.length
    )(data.eyeData)
  });
}

function numberOfBackJumps(data) {
  function hitboxHit(frame) {
    return frame[data.question + '_qtext'] === '1' ||
      frame[data.question + '_aoptions'] === '1';
  }
  function countJumps(acc, el, idx, list) {
    if (idx > 0 &&
      el[data.question + '_qtext'] === '1' &&
      list[idx - 1][data.question + '_aoptions'] === '1') {
      return ++acc;
    }
    return acc;
  }
  return R.merge(data, {
    backJumpsCount: R.pipe(
      R.filter(hitboxHit),
      R.reduceIndexed(countJumps, 0)
    )(data.eyeData)
  });
}

function problemData(problemData) {
  return function(data) {
    return R.merge(data, {
      problem: problemData[data.question] ? !!problemData[data.question][data.user] : false,
      problemDescription: problemData[data.question] ? problemData[data.question][data.user] || '' : ''
    });
  }
}

function clean(data) {
  delete data.eyeData;
  return data;
}

var loadData = R.pipe(
  resultFilepathsForQuestion,
  R.map(resultsFromFile)
);

var extract = R.pipe(
  loadData,
  R.map(numberOfFixations),
  R.map(numberOfFixationsOnQuestionText),
  R.map(numberOfBackJumps),
  R.map(problemData(JSON.parse(fs.readFileSync(__dirname + '/../data/problems.json', 'utf8')))),
  R.map(clean)
);

var questions = ['q1', 'q2', 'q3', 'q4', 'q7', 'q8', 'q12', 'q13', 'q15', 'q16', 'q17', 'q18', 'q19', 'q20', 'q21', 'q22', 'q23'];

var result = R.map(extract, questions);
fs.writeFileSync(__dirname + '/../public/data/data.json', JSON.stringify(result));
