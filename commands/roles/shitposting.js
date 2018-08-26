const { Command } = require('discord.js-commando');

module.exports = class ShitpostingRoleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'shitposting',
            group: 'roles',
            memberName: 'shitposting',
            description: 'Enables shitposting access.',
            examples: ['shitposting'],
            guildonly: true
        });
    }

    run(message) {
      var config = {};
        var shitpostRole = message.guild.roles.find('name', "Shitpost"); //Define the community role
        
    }
};