function getData() {
  return fetch('../../data/data.json').then(function(response) {
    return response.json();
  });
}

//function createScatterPlots(data) {
//  data.forEach(createScatterPlot);
//  return data;
//}
//
//function createScatterPlot(questionData) {
//  var correctData = _.filter(questionData,'problem', false);
//  var correctFixations = ['correct'].concat(_.pluck(correctData,'fixationQuestionTextCount'));
//  var correctJumps = ['correct_jumps'].concat(_.pluck(correctData,'backJumpsCount'));
//  var problemData = _.filter(questionData,'problem');
//  var problemFixations = ['problem'].concat(_.pluck(problemData,'fixationQuestionTextCount'));
//  var problemJumps = ['problem_jumps'].concat(_.pluck(problemData,'backJumpsCount'));
//  var chart = c3.generate({
//    size: { height: 500, width: 500 },
//    data: {
//      xs: {
//        correct: 'correct_jumps',
//        problem: 'problem_jumps'
//      },
//      columns: [
//        correctJumps, correctFixations,
//        problemJumps, problemFixations
//      ],
//      type: 'scatter',
//    },
//    axis: {
//      y: {
//        padding: { bottom: 0 },
//        label: 'Fixations on Question Text'
//      },
//      x: {
//        tick: { fit: false },
//        label: 'Back Jumps'
//      }
//    },
//    tooltip: { show: false, },
//    point: { r: 3.5 }
//  });
//  var headline = document.createElement('h3');
//  headline.innerHTML = questionData[0].question;
//  document.body.appendChild(headline);
//  document.body.appendChild(chart.element);
//}

function createBarCharts(data) {
  data.forEach(function(d) {
    var headline = document.createElement('h3');
    headline.innerHTML = d[0].question;
    document.body.appendChild(headline);
    createBarChart(d, 'fixationQuestionTextCount');
    createBarChart(d, 'backJumpsCount');
  });
  return data;
}

function createBarChart(questionData, field) {
  var users = _.map(questionData, function(d){
   return d.user.slice(2);
  });
  var correctData = _.map(questionData,function(d){
    if (d.problem) {
      var nd = {};
      nd[field] = 0;
      return nd;
    };
    return d;
  });
  var correctJumps = ['correct'].concat(_.pluck(correctData,field));
  var problemData = _.map(questionData,function(d){
    if (!d.problem) {
      var nd = {};
      nd[field] = 0;
      return nd;
    };
    return d;
  });
  var problemJumps = ['problem'].concat(_.pluck(problemData,field));
  var average = _.sum(_.pluck(questionData, field)) / users.length;
  var problemTexts = _.pluck(questionData, 'problemDescription');

  var chart = c3.generate({
    size: { height: 500, width: 500 },
    data: {
      columns: [
        correctJumps,
        problemJumps
      ],
      type: 'bar',
      groups: [
        ['correct', 'problem']
      ]
    },
    axis: {
      x: {
        type: 'category',
        categories: users,
        label: 'User'
      },
      y: {
        label: field
      }
    },
    grid: {
      y: {lines: [{value: average}]}
    },
    tooltip: {
      format: {
        title: function (d) {
          return problemTexts[d];
        },
        value: function (value, ratio, id) {
        }
      }
    }
  });
  document.body.appendChild(chart.element);
}

getData()
  //.then(createScatterPlots)
  .then(createBarCharts);
