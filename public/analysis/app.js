function getData() {
  return fetch('../data/data.json').then(function(response) {
    return response.json();
  });
}

function createPlots(data) {
  console.log(data[13]);
  var question = _.sortByAll(data[13],['backJumpsCount', 'fixationQuestionTextCount']);
  var chart = c3.generate({
    bindto: '#graph',
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
        var testIndex = question.map(function(el, index) {
          if (el.backJumpsCount === d.x && el.fixationQuestionTextCount == d.value) {
            return index;
          }
        }).filter(isFinite);
        console.log(testIndex, d.index);
        var participant = question[testIndex];
        console.log(participant.backJumpsCount === d.x && participant.fixationQuestionTextCount == d.value);
        return participant.problem ? d3.rgb('#ff0000') : d3.rgb('#00ff00');
      }
    },
    axis: {
      y: {
        padding: {
          bottom: 0
        }
      },
      x: {
        tick: {
          fit: false
        }
      }
    }
  });
}

getData().then(createPlots);
