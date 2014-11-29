var Bossy = require('bossy');

module.exports = function parseArgs() {
  var definition = {
    h: {
      description: 'Show help',
      alias: 'help',
      type: 'boolean'
    },
    i: {
      description: 'Specify interval',
      alias: 'interval'
    }
  };

  var args = Bossy.parse(definition);

  if (args instanceof Error) {
      console.error(args.message);
      return;
  }

  // if (args.h || !args.i) {
  //     console.log(Bossy.usage(definition, 'git report -i <interval>'));
  //     return;
  // }

  return args;
}

