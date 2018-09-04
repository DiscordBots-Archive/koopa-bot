const { Command } = require('discord.js-commando');

module.exports = class PurgeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'purge',
            aliases: ["prune", "clear"],
            group: 'admin',
            memberName: 'purge',
            description: 'Purges a channel.',
            examples: ['reply']
        });
    }

    run(msg) {
        return msg.say('Hi, I\'m awake!');
    }
};