const { Command } = require('discord.js-commando');

module.exports = class RebootCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'reboot',
            group: 'owner',
            aliases: ["restart"],
            memberName: 'reboot',
            description: 'Enables shitposting access.',
            examples: ['reboot'],
            guildonly: true
        });
    }
  
    hasPermission(msg) {
        return this.client.isOwner(msg.author);
    }

    run(message) {
        process.exit();
    }
};