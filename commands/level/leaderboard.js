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
                default: 10
              }
            ]
        });
    }

    async run(message, { num }) {
      // Get a filtered list (for this guild only), and convert to an array while we're at it.
      const filtered = this.client.points.array().filter(p => p.guild === message.guild.id );

      // Sort it to get the top results... well... at the top. Y'know.
      const sorted = filtered.sort((a, b) => a.points < b.points);

      // Slice it, dice it, get the top 10 of it!
      const top10 = sorted.splice(0, num);

      // Now shake it and show it! (as a nice embed, too!)
      const embed = this.client.util.embed()
        .setTitle("Leaderboard")
        .setAuthor(this.client.user.username, this.client.user.avatarURL)
        .setDescription("Our top " + num + " of EXP point leaders!")
        //.setColor(0x00AE86);
      
      for(const data of top10) {
        embed.addField(this.client.users.get(data.user).tag, `${data.points} EXP points (level ${data.level})`);
      }
      
      return message.embed(embed);
    }
};