var questionTexts = {
  'q1': 'Wie beurteilen Sie ganz allgemein die heutige wirtschaftliche Lage in Deutschland?',
  'q2': 'Und was glauben Sie, wie wird die allgemeine wirtschaftliche Lage in Deutschland in einem Jahr sein?',
  'q3': 'Alles in allem - wie zufrieden sind Sie mit den demokratischen Einrichtungen in unserem Land?',
  'q4': 'Wie zufrieden sind Sie mit der Krankenversicherung, der Arbeitslosen- und Rentenversicherung in der Bundesrepublik, also mit dem, was man das „Netz der sozialen Sicherung“ nennt?',
  'q7': 'Stellen Sie sich vor, der Bundestag berät ein Gesetz, dass Sie für ungerecht oder schädlich halten. Was meinen Sie, wie wahrscheinlich ist es, dass Sie, allein oder mit anderen zusammen, versuchen würden, etwas dagegen zu unternehmen?',
  'q8': 'Wenn Sie politisch in einer Sache, die Ihnen wichtig ist, Einfluss nehmen, Ihren Standpunkt zur Geltung bringen wollten: Welche der folgenden Möglichkeiten würden Sie dann nutzen, was davon käme für Sie in Frage?',
  'q12': 'Inwieweit fänden Sie es für sich persönlich akzeptabel, Abstriche von Ihrem Lebensstandard zu machen, um die Umwelt zu schützen?',
  'q13': 'Glauben Sie, dass man eine Familie braucht, um wirklich glücklich zu sein, oder glauben Sie, man kann alleine genauso glücklich leben?',
  'q15': 'Wie oft waren Sie insgesamt in den letzten 12 Monaten über Nacht nicht zu Hause, weil Sie im Urlaub waren oder auf Besuch bei Freunden, Verwandten usw.?',
  'q16': 'Mit wie vielen Menschen haben Sie im Durchschnitt an einem normalen Wochentag Kontakt? Wir meinen Kontakte mit einzelnen Personen, also wenn Sie mit jemandem reden oder diskutieren. Dies kann persönlich, telefonisch, brieflich oder über das Internet sein. Zählen Sie nur die Menschen, die Sie kennen, und denken Sie bitte auch an die, mit denen Sie zusammenwohnen.',
  'q17': 'An wie vielen Tagen sehen Sie im Allgemeinen in einer Woche – also an den 7 Tagen von Montag bis Sonntag  – fern?',
  'q18': 'An wie vielen Tagen sehen Sie im Allgemeinen in einer Woche Nachrichtensendungen von ARD oder ZDF?',
  'q19': 'An wie vielen Tagen sehen Sie im Allgemeinen in einer Woche Nachrichtensendungen der privaten Fernsehsender?',
  'q20': 'Wie oft nutzen Sie im Allgemeinen das Internet, um sich über Politik zu informieren?',
  'q21': 'Wie oft würden andere Leute bei passender Gelegenheit versuchen, Sie zu übervorteilen oder aber versuchen, sich Ihnen gegenüber fair zu verhalten? Andere Leute würden ...',
  'q22': 'Ganz allgemein, was meinen Sie: Kann man Menschen vertrauen oder kann man im Umgang mit Menschen nicht vorsichtig genug sein? Man kann ...',
  'q23': 'Inwieweit achten Sie auf gesundheitsbewusste Ernährung?'
};

function getData() {
  return fetch('../../data/data.json').then(function (response) {
    return response.json().then(function (data) {
      return _.map(_.flatten(data), function (d) {
        // fixations and backjumps in relation to question length.
        d.fixationsRelative = d.fixationQuestionTextCount / questionTexts[d.question].length;
        d.backJumpsRelative = d.backJumpsCount / questionTexts[d.question].length;
        return d;
      });
    });
  });
}

function createBarCharts(data) {
  var userData = _.groupBy(data, 'user');
  _.forEach(userData, function (value, key) {
    var headline = document.createElement('h3');
    headline.innerHTML = key;
    document.body.appendChild(headline);
    createBarChart(value, 'fixationsRelative');
    createBarChart(value, 'backJumpsCount');
  });
  return data;
}

function createBarChart(questionData, field) {
  var questions = _.map(questionData, function (d) {
    return d.question.slice(1);
  });
  var correctData = _.map(questionData, function (d) {
    if (d.problem) {
      var nd = {};
      nd[field] = 0;
      return nd;
    }
    return d;
  });
  var correctJumps = ['correct'].concat(_.pluck(correctData, field));
  var problemData = _.map(questionData, function (d) {
    if (!d.problem) {
      var nd = {};
      nd[field] = 0;
      return nd;
    }
    return d;
  });
  var problemJumps = ['problem'].concat(_.pluck(problemData, field));
  var average = _.sum(_.pluck(questionData, field)) / questions.length;
  var problemTexts = _.pluck(questionData, 'problemDescription');
  var chart = c3.generate({
    size: {height: 500, width: 500},
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
        categories: questions,
        label: 'Question'
      },
      y: {label: field}
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
  .then(createBarCharts);
