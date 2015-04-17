function getData() {
  return fetch('../data/data.json').then(function(response) {
    return response.json();
  });
}

function createPlots(data) {
  data.forEach(createPlot);
}

function createPlot(questionData) {
  var correctData = _.filter(questionData,'problem', false);
  var correctFixations = ['correct'].concat(_.pluck(correctData,'fixationQuestionTextCount'));
  var correctJumps = ['correct_jumps'].concat(_.pluck(correctData,'backJumpsCount'));
  var problemData = _.filter(questionData,'problem');
  var problemFixations = ['problem'].concat(_.pluck(problemData,'fixationQuestionTextCount'));
  var problemJumps = ['problem_jumps'].concat(_.pluck(problemData,'backJumpsCount'));
  var chart = c3.generate({
    size: { height: 500, width: 500 },
    data: {
      xs: {
        correct: 'correct_jumps',
        problem: 'problem_jumps'
      },
      columns: [
        correctJumps, correctFixations,
        problemJumps, problemFixations
      ],
      type: 'scatter',
    },
    axis: {
      y: {
        padding: { bottom: 0 },
        label: 'Fixations on Question Text'
      },
      x: {
        tick: { fit: false },
        label: 'Back Jumps'
      }
    },
    tooltip: { show: false, },
    point: { r: 3.5 }
  });
  var headline = document.createElement('h3');
  headline.innerHTML = questionData[0].question;
  document.body.appendChild(headline);
  document.body.appendChild(chart.element);
}

getData().then(createPlots);
