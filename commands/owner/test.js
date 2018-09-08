const { Command } = require('./../../classes/Command.js');
const Long = require("long");

module.exports = class TestCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'test',
      group: 'owner',
      memberName: 'test',
      description: 'Test command for owner(s)',
      examples: ['reply'],
      minPerms: 10
    });
  }

  run(msg) {
    let count = 0;
    let ecount = 0;
    for(let x = 0; x < 4000; x++) {
      msg.channel.send(`this is message ${x} of 3999`)
        .then(m => {
          count++;
          console.log('reached', count, ecount);
        })
        .catch(m => {
          console.error(m);
          ecount++;
          console.log('reached', count, ecount);
        });
    }
  }
};