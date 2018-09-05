const { Command } = require('./../../classes/Command.js');

module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'perms',
            group: 'util',
            memberName: 'perms',
            description: 'Tells you your permission level.',
            examples: ['perms']
        });
    }

    run(msg) {
        return msg.say(`Your permission level is ${this.client.util.getPermLevel(msg.member)} out of 10`);
    }
};