require('shelljs/global');
var parseArgs = require('./parser')
var _ = require('lodash');
var request = require('request');

var hoursRx = /@(\d+)h(\d*)/i;
var ticketRx = /#(\d+)/i;

module.exports = function report() {
  var args = parseArgs();
  if (!args) return;

  config.silent = true;
  var json_format = '{"commit": "%H", "name": "%an", "email": "<%ae>", "date": "%ad", "message": "%s"},';
  var cmd = _.template("git log --all --pretty='<%= format %>'", {format: json_format});
  //console.log(cmd);

  exec(cmd, function(code, output) {
    var json_output = '[' + output.slice(0,-2) + ']';

    var report = _.chain(JSON.parse(json_output)).groupBy('email').map(userLog).value();

    request({
      url: 'https://www.pivotaltracker.com/services/v5/projects/1218488/stories?fields=name&filter=id:1,83536164',
      headers: {"X-TrackerToken": "232ccd8f18da589c9561ea55525c80d8"}
    }, function(error, response, body) {
      console.log(body);
    });
    console.log(JSON.stringify(report));
  });
}

function userLog(commits, email) {
  userLog = {
    user: commits[0].name,
    log: _.chain(commits).groupBy(ticketId).map(ticketHours).value()
  };

  userLog.hours = _.chain(userLog.log).map('hours').reduce(hoursSum).value();

  return userLog;
}

function ticketId(commit) {
  var match = ticketRx.exec(commit.message);
  if (match) {
    return match[1];
  }
  return 'Other'
}

function ticketHours(commits, ticketId) {
  return {
    ticket: {id: ticketId},
    hours: _.chain(commits).map(commitHours).reduce(hoursSum).value()
  };
}

function ticketInfo(id) {
  var info = {id: id}
  setTimeout(function() { info.text = 'hello'; console.log(info)} , 5000);
  return info;
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
