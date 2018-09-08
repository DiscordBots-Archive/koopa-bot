const { Command } = require('discord.js-commando');
const { RichEmbed } = require("discord.js");

module.exports = class ScoreCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'points',
            aliases: ["level", "xp", "exp"],
            group: 'level',
            memberName: 'points',
            description: 'Know your way (to dem points)',
            examples: ['points', 'level'],
            args: [
              {
                key: "membre",
                label: "member",
                prompt: "who do you want me to stalk? :eyes:",
                default: "",
                type: "member"
              }
            ],
            guildOnly: true
        });
    }

    async run(msg, { membre }) {
      if (!membre) {
        var member = await msg.guild.members.get(msg.author.id);
      } else {
        var member = membre;
      }
      if (member.user.bot) return msg.reply("bots don't have EXP points!");
      const message = msg;
      
      let key = `${message.guild.id}-${member.id}`
      this.client.points.ensure(key, this.client.defaultPoints);
      let points = this.client.points.get(key, "points")
      let level = this.client.points.get(key, "level")
      
      var embed = this.client.util.embed()
          .setAuthor(msg.member.displayName, msg.author.displayAvatarURL)
          //.setColor(member.highestRole.color)
          .setTitle(membre ? membre.displayName + "'s stats" : "Your stats")
          .setDescription(`${membre ? membre.displayName + " needs" : "You need"} ${100 - (points % 100)} EXP points to advance level.`)
          .addField("EXP Points", `${points}`, true)
          .addField("Level", level, true)
          .setThumbnail(member.user.displayAvatarURL);
      
      msg.embed(embed);
    }
};