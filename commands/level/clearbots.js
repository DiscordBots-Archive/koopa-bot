const { Command } = require('discord.js-commando');
const { RichEmbed } = require("discord.js");

module.exports = class ClearBotsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'clear-bots',
            aliases: ["c-b"],
            group: 'level',
            memberName: 'clear-bots',
            description: 'Removes bots from the table',
            examples: ['clear-bots'],
            guildOnly: true
        });
    }
  
    hasPermission(msg) {
        if (!this.client.isOwner(msg.author)) return 'This is a table clearing utility. Honestly, I don\'t know how you would benefit from running this.';
        return true;
    }

    async run(message) {
      var nmsg = await message.say("Cleaning bots from table scores...");
      message.guild.members.forEach(m => {
        if (m.user.bot) {
          this.client.points.delete(`${message.guild.id}-${m.id}`)
        }
      });
      nmsg.edit("Done!");
    }
};