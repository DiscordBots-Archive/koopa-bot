const { Command } = require('discord.js-commando');
const { RichEmbed } = require("discord.js");

module.exports = class ListWarningsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'listwarns',
            aliases: ["lw"],
            group: 'admin',
            memberName: 'listwarns',
            description: 'Shows the warnings an user got',
            examples: ['listwarns <user>'],
            args: [
              {
                key: "member",
                prompt: "who do you want to warn?",
                type: "member"
              }
            ]
        });
    }

    run(msg, { member }) {
      if (!this.client.isOwner(msg.author)
          || !msg.member.roles.has("481492274333876224")
          || !msg.member.roles.has("481492388020486171")) return msg.reply("you don't have the permission to use this!");
      const warns = this.client.warns.get.all(member.user.id);
      // Now shake it and show it! (as a nice embed, too!)
      const embed = new RichEmbed()
        .setTitle("Warning List")
        .setAuthor(this.client.user.username, this.client.user.avatarURL)
        .setThumbnail(member.user.displayAvatarURL)
        .setDescription("All the warnings for user " + member.displayName)
        .setColor(15844367);

      for(const data of warns) {
        embed.addField(`Warning given by ${msg.guild.users.get(data.moderator).displayName}`, `Reason: \`${data.reason}\`\nDate: ${data.time}`);
      }
      msg.say(":ok: User warned!")
    }
};