require('shelljs/global');
var parseArgs = require('./parser')
var _ = require('lodash');

var hoursRx = /@(\d+)h(\d*)/i;
var ticketRx = /#(\d+)/i;

module.exports = function report() {
  var args = parseArgs();
  if (!args) return;

  config.silent = true;
  var json_format = '{"commit": "%H", "name": "%an", "email": "<%ae>", "date": "%ad", "message": "%s"},';
  var cmd = _.template("git log --pretty='<%= format %>'", {format: json_format});
  //console.log(cmd);

  exec(cmd, function(code, output) {
    var json_output = '[' + output.slice(0,-2) + ']';
    var json = JSON.parse(json_output);


    var report = _.chain(json).groupBy('email').map(userLog).value();
    console.log(JSON.stringify(report));
  });
}

function userLog(commits, email) {
  return {
    user: commits[0].name,
    log: _.chain(commits).groupBy(ticket_id).map(ticketHours).value()
  };
}

function ticket_id(commit) {
  var match = ticketRx.exec(commit.message);
  if (match) {
    return match[1];
  }
  return 'N/A'
}

function ticketInfo(id) {
  {id: id}
}

function ticketHours(commits, ticket_id) {
  return {
    ticket: ticket_id,
    hours: _.chain(commits).map(commitHours).reduce(hoursSum).value()
  };
}

function commitHours(commit) {
  var match = hoursRx.exec(commit.message);
  if (match) {
    return parseInt(match[1]) + parseInt(match[2] || 0)/60;
  }
  return 0;
}

function hoursSum(sum, hours) {
  return sum + hours;
}
