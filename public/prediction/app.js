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

function createTable(data) {
  var source   = $("#table-template").html();
  var template = Handlebars.compile(source);
  var html = template({
    data: data
  });
  var div = document.createElement('table');
  div.innerHTML = html;
  $(div).tablesorter();
  document.body.appendChild(div);
}

function predict(data) {
  var indicators = [
    'fixationsRelative',
    'backJumpsCount'
  ];
  var userData = _.groupBy(data, 'user');

  // individual
  indicators.forEach(function(indicator) {
    var verdicts = [];
    for (var i = 0.5; i < 1.6; i += 0.1) {
      var res = _.reduce(userData, function(result, data) {
        return predictUser(result, data, indicator, i);
      }, {
        data: 0,
        positives: 0,
        negatives: 0,
        truePositives: 0,
        falsePositives: 0,
        trueNegatives: 0,
        falseNegatives: 0
      });
      verdicts.push(formatResult(res, i.toFixed(2)+'*'+indicator));
    }
    //console.table(verdicts);
    createTable(verdicts);
  });

  // combined
  var verdicts = [];
  for (var i = 0; i < 2.1; i += 0.01) {
    for (var j = 0; j < 2.1; j += 0.01) {
      var res = _.reduce(userData, function(result, data) {
        return predictUser(result, data, 'fixationsRelative', i, 'backJumpsCount', j);
      }, {
        data: 0,
        positives: 0,
        negatives: 0,
        truePositives: 0,
        falsePositives: 0,
        trueNegatives: 0,
        falseNegatives: 0
      });
      verdicts.push(formatResult(res, i.toFixed(2) + '*fixationsR && ' + j.toFixed(2) +'*backJumps'));
    }
  }
  var filteredVerdicts = _.filter(verdicts, function(d) {
    return d['true-positive-rate'] > 0.75 &&
      d['false-positive-rate'] < 0.4 &&
      d['mcc'] > 0.26;
  });
  createTable(filteredVerdicts);
  //createTable(verdicts);

  return data;
}

function formatResult(res, indicator) {
  return {
    'indicator': indicator,
    'true-positive-rate': +(res.truePositives / res.positives).toFixed(4),
    'false-positive-rate': +(res.falsePositives / res.negatives).toFixed(4),
    // F1 score
    'f1': +(2 * res.truePositives / (2*res.truePositives + res.falsePositives + res.falseNegatives)).toFixed(4),
    // Matthews correlation coefficient
    'mcc': +((res.truePositives*res.trueNegatives - res.falsePositives*res.falseNegatives) /
    Math.sqrt( (res.truePositives+res.falsePositives)*(res.truePositives+res.falseNegatives)*(res.trueNegatives+res.falsePositives)*(res.trueNegatives+res.falseNegatives))).toFixed(4)
  }
}

function predictUser(acc, userdata, field, factor, field2, factor2) {
  var questions = _.map(userdata, function (d) {
    return d.question.slice(1);
  });
  // bail on incomplete participant
  if (questions.length !== Object.keys(questionTexts).length) {
    //console.log(questions.length);
    return acc;
  }

  // actual
  var partition = _.partition(userdata, function (d) {
    return d.problem;
  });
  var positives = partition[0].length;
  var negatives = partition[1].length;

  // prediction
  var average = _.sum(_.pluck(userdata, field)) / questions.length;
  if (field2) {
    var average2 = _.sum(_.pluck(userdata, field2)) / questions.length;
  }
  var prediction = _.partition(userdata, function (data) {
    if (field2) {
      return data[field] > factor * average && data[field2] > factor2 * average2;
    }
    return data[field] > factor * average;
  });
  var predictedPositives = prediction[0];
  var predictedNegatives = prediction[1];

  var falsePositives = _.filter(predictedPositives, 'problem', false).length;
  var truePositives = _.filter(predictedPositives, 'problem').length;
  var trueNegatives = _.filter(predictedNegatives, 'problem', false).length;
  var falseNegatives = _.filter(predictedNegatives, 'problem').length;

  acc.positives += positives;
  acc.negatives += negatives;
  acc.data += userdata.length;
  acc.truePositives += truePositives;
  acc.falsePositives += falsePositives;
  acc.trueNegatives += trueNegatives;
  acc.falseNegatives += falseNegatives;
  return acc;
}

getData()
  .then(predict);