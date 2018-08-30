const { Command } = require('discord.js-commando');
const { RichEmbed } = require("discord.js");
const moment = require("moment");

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
          && !msg.member.roles.has("481492274333876224")
          && !msg.member.roles.has("481492388020486171")) return msg.reply("you don't have the permission to use this!");
      const warns = this.client.warns.table.prepare("SELECT * FROM warns WHERE userId = ? AND guild = ?").all(member.id, msg.guild.id);
      // console.log(warns);
      // Now shake it and show it! (as a nice embed, too!)
      const embed = new RichEmbed()
        .setTitle("Warning List")
        .setAuthor(this.client.user.username, this.client.user.avatarURL)
        .setThumbnail(member.user.displayAvatarURL)
        .setDescription(`${warns.length == 0 ? "No" : warns.length} warnings for ${member.displayName}`)
        .setColor(15844367);

      for(const data of warns) {
        embed.addField(`Warning given by ${msg.guild.members.get(data.moderator).displayName}`, `Reason: \`${data.reason}\`\nDate: ${moment(data.time).format("ddd, MMM Do, YYYY at HH:MM:SS")}`);
      }
      msg.embed(embed)
    }
};