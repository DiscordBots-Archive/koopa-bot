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
        var communityRole = message.guild.roles.find('name', config.CommunityRole), //Define the community role
        modRole = message.guild.roles.find("name", config.ModRole), //Define that staff role
        mutedRole = message.guild.roles.find('name', config.MutedRole); //Define the Muted role

        return message.say('Hi, I\'m awake!');
    }
};