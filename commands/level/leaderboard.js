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
      let sql = this.client.scores.table;
      
      const top10 = sql.prepare("SELECT * FROM scores WHERE guild = ? ORDER BY points DESC LIMIT ?;").all(msg.guild.id, num);

      // Now shake it and show it! (as a nice embed, too!)
      const embed = new RichEmbed()
        .setTitle("Leaderboard")
        .setAuthor(this.client.user.username, this.client.user.avatarURL)
        .setDescription("Our top " + num + " of point leaders!")
        .setColor(0x00AE86);

      for(const data of top10) {
        let usr = this.client.users.get(data.user)
        embed.addField(usr.tag, `${usr.id == msg.author.id ? "**" : ""}${data.points} points (level ${data.level})${usr.id == msg.author.id ? "**" : ""}`);
      }
      return msg.embed(embed);
      
      msg.embed(embed);
    }
};