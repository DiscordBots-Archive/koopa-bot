const { Command } = require('discord.js-commando');

module.exports = class MegachatRoleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'mega-chat',
            group: 'roles',
            aliases: ["m-c"],
            memberName: 'megachat',
            description: 'Enables megachat access.',
            examples: ['megachat'],
            clientPermissions: ['MANAGE_ROLES'],
            guildonly: true
        });
    }

    run(message) {
      var config = {};
        var shitpostRole = message.guild.roles.find('name', "Megachat"); //Define the sp role
        if (!shitpostRole) return message.reply("an error occurred while running the command: `Role \"Megachat\" not found`\nYou shouldn't ever receive an error like this.\nPlease contact Samplasion#7901.");
        var t = "";
        if (message.member.roles.has(shitpostRole.id)) {
          message.member.removeRole(shitpostRole);
          t = "removed from";
        } else {
          message.member.addRole(shitpostRole);
          t = "added to"
        }
      message.channel.send(":ok_hand: Megachat role "+t+" your roles.");
    }
};