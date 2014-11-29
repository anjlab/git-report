require('shelljs/global');

module.exports = function report() {
  exec('git log', function(code, output) {
    console.log('Exit code:', code);
    console.log('Program output:', output);
  });
}
