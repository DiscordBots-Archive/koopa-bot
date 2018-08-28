const { Command } = require('discord.js-commando'),
      { RichEmbed } = require("discord.js");

module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'points',
            aliases: ["level"],
            group: 'level',
            memberName: 'points',
            description: 'Replies with a Message.',
            examples: ['points', 'level'],
            args: [
              {
                key: "mem",
                prompt: "who do you want me to stalk? :eyes:",
                default: "",
                type: "member"
              }
            ]
        });
    }

    async run(msg, { mem }) {
      if (!mem) {
        var member = await msg.guild.members.get(msg.author.id);
      } else {
        var member = mem;
      }
      
      let score = this.client.getScore.get(member.user.id, msg.guild.id);
      var embed = new RichEmbed()
          .setAuthor(msg.member.displayName, msg.author.displayAvatarURL)
          .setColor(member.highestRole.color)
          .setTitle(mem ? mem.displayName + "'s stats" : "Your stats")
          .addField("Points", score.points, true)
          .addField("Level", score.level, true)
    }
};