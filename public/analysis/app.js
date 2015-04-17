function getData() {
  return fetch('../data/data.json').then(function(response) {
    return response.json();
  });
}

function createPlots(data) {
  data.forEach(createPlot);
}

function createPlot(questionData) {
  var question = _.sortByAll(questionData,['backJumpsCount', 'fixationQuestionTextCount']);
  var chart = c3.generate({
    size: {
      height: 500,
      width: 500
    },
    data: {
      json: question,
      keys: {
        value: ['fixationQuestionTextCount'],
        x: 'backJumpsCount'
      },
      type: 'scatter',
      color: function (color, d) {
        // d will be 'id' when called for legends
        if (!d.id) { return; }
        // get the index by searching for a match on
        // backJumps and fixation count
        var index = question.map(function(el, index) {
          if (el.backJumpsCount === d.x && el.fixationQuestionTextCount == d.value) {
            return index;
          }
        }).filter(isFinite)[0];
        var participant = question[index];
        return participant.problem ? d3.rgb('#ff0000') : d3.rgb('#00ff00');
      }
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
    legend: { show: false, },
    tooltip: { show: false, },
    point: { r: 3.5 }
  });
  var headline = document.createElement('h3');
  headline.innerHTML = questionData[0].question;
  document.body.appendChild(headline);
  document.body.appendChild(chart.element);
}

getData().then(createPlots);
