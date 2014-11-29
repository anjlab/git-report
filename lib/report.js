require('shelljs/global');
var parseArgs = require('./parser')
var _ = require('lodash');

module.exports = function report() {
  var args = parseArgs();
  if (!args) return;

  config.silent = true;
  var json_format = '{"commit": "%H", "name": "%an", "email": "<%ae>", "date": "%ad", "message": "%s"},';
  var cmd = _.template("git log --pretty='<%= format %>'", {format: json_format});
  console.log(cmd);

  exec(cmd, function(code, output) {
    var json_output = '[' + output.slice(0,-2) + ']';
    var json = JSON.parse(json_output);
    console.log(json);
  });
}
