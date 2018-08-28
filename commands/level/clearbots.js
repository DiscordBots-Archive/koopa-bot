const { Command } = require('discord.js-commando');
const { RichEmbed } = require("discord.js");

module.exports = class ScoreCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'points',
            aliases: ["level"],
            group: 'level',
            memberName: 'points',
            description: 'Know your way (to dem points)',
            examples: ['points', 'level'],
            args: [
              {
                key: "membre",
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
      const message = msg;
      
      let score = this.client.getScore.get(member.user.id, msg.guild.id);
      if (!score) {
        score = {
          id: `${message.guild.id}-${message.author.id}`,
          user: message.author.id,
          guild: message.guild.id,
          points: 0,
          level: 1
        }
      }
      var embed = new RichEmbed()
          .setAuthor(msg.member.displayName, msg.author.displayAvatarURL)
          .setColor(member.highestRole.color)
          .setTitle(membre ? membre.displayName + "'s stats" : "Your stats")
          .addField("Points", score.points, true)
          .addField("Level", score.level, true)
          .setThumbnail(member.user.displayAvatarURL);
      
      msg.embed(embed);
    }
};