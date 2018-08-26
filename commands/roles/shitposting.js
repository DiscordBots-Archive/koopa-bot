const { Command } = require('discord.js-commando');

module.exports = class ShitpostingRoleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'shitposting',
            group: 'roles',
            aliases: ["shitpost", "sp"],
            memberName: 'shitposting',
            description: 'Enables shitposting access.',
            examples: ['shitposting'],
            clientPermissions: ['MANAGE_ROLES'],
            guildonly: true
        });
    }

    run(message) {
      var config = {};
        var shitpostRole = message.guild.roles.find('name', "Shitposting"); //Define the sp role
        if (!shitpostRole) return message.reply("an error occurred while running the command: `Role \"Shitposting\" not found`\nYou shouldn't ever receive an error like this.\nPlease contact Samplasion#7901.");
        var t = "";
        if (message.member.roles.has(shitpostRole.id)) {
          message.member.removeRole(shitpostRole);
          t = "removed from";
        } else {
          message.member.addRole(shitpostRole);
          t = "added to"
        }
      message.channel.send(":ok_hand: Shitpost role "+t+" your roles.");
    }
};