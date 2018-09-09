const { Command } = require('./../../classes/Command.js');
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
                prompt: "who do you want to see the warns of?",
                type: "member"
              }
            ],
          minPerms: 2
        });
    }

    run(msg, { member }) {
      // const warns = this.client.warns.table.prepare("SELECT * FROM warns WHERE userId = ? AND guild = ?").all(member.id, msg.guild.id);
      let key = `${msg.guild.id}-${member.id}`
      this.client.warns.ensure(key, []);
      const warns = this.client.warns.get(key);
      // console.log(warns);
      // Now shake it and show it! (as a nice embed, too!)
      const embed = new RichEmbed()
        .setTitle("Warning List")
        .setAuthor(this.client.user.username, this.client.user.avatarURL)
        .setThumbnail(member.user.displayAvatarURL)
        .setDescription(`${warns.length == 0 ? "No" : warns.length} warnings for ${member.displayName}`)
        .setColor(15844367);

      for(const data in warns) {
        embed.addField(`Warning given by ${msg.guild.members.get(data.moderator).displayName}`, `Reason: \`${data.reason}\`\nDate: ${data.time}`);
      }
      msg.embed(embed)
    }
};