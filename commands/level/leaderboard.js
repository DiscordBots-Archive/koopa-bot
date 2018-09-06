const { Command } = require('discord.js-commando');
const { RichEmbed } = require("discord.js");

module.exports = class LeaderboardCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'leaderboard',
            aliases: ["lb"],
            group: 'level',
            memberName: 'leaderboard',
            description: 'Know your way (to dem max points)',
            examples: ['leaderboard'],
            guildOnly: true,
            args: [
              {
                key: "num",
                prompt: "how many users should this leaderboard contemplate?",
                type: "integer",
                default: 5
              }
            ]
        });
    }

    async run(msg, { num }) {
      let key = `${message.guild.id}-${message.author.id}`
      this.client.points.ensure(key, this.client.defaultPoints);

      // Now shake it and show it! (as a nice embed, too!)
      const embed = new RichEmbed()
        .setTitle("Leaderboard")
        .setAuthor(this.client.user.username, this.client.user.avatarURL)
        .setDescription("Our top " + num + " of EXP point leaders!")
        .setColor(0x00AE86);

      for(const data of top10) {
        embed.addField(msg.guild.members.get(data.user).user.tag, `${data.points} EXP points (level ${data.level})`);
      }
      return msg.embed(embed);
      
      msg.embed(embed);
      } catch (e) { console.error(e) }
    }
};