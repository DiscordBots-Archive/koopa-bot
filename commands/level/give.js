const { Command } = require('discord.js-commando');
const { RichEmbed } = require("discord.js");

module.exports = class GiveCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'give',
            aliases: ["level"],
            group: 'level',
            memberName: 'give',
            description: 'Giv mah yer points!! The points will be subtracted from your total, so be careful!',
            examples: ['give @User 500'],
            args: [
              {
                key: "membre",
                prompt: "who do you want to give points to? :eyes:",
                type: "user"
              },
              {
                key: "pts",
                prompt: "how many points do you wanna give?",
                type: "integer",
                max: 10000
              }
            ],
            guildOnly: true
        });
    }

    async run(message, { membre, pts: pointsToAdd }) {
      // Limited to guild owner - else you will gift your coins!
      if(!message.author.id === message.guild.owner) {
        const user = membre;

        // Get their current points.
        let userscore = this.client.getScore.get(user.id, message.guild.id);
        // It's possible to give points to a user we haven't seen, so we need to initiate defaults here too!
        if (!userscore) {
          userscore = { id: `${message.guild.id}-${user.id}`, user: user.id, guild: message.guild.id, points: 0, level: 1 }
        }
        userscore.points += pointsToAdd;

        // We also want to update their level (but we won't notify them if it changes)
        let userLevel = Math.floor(0.1 * Math.sqrt(userscore.points));
        userscore.level = userLevel;

        // And we save it!
        this.client.setScore.run(userscore);

        return message.channel.send(`${user.tag} has received ${pointsToAdd} points and now stands at ${userscore.points} points.`);
      } else {
        const user = membre;

        // Get their current points.
        let userscore = this.client.getScore.get(user.id, message.guild.id);
        // It's possible to give points to a user we haven't seen, so we need to initiate defaults here too!
        if (!userscore) {
          userscore = { id: `${message.guild.id}-${user.id}`, user: user.id, guild: message.guild.id, points: 0, level: 1 }
        }
        userscore.points += pointsToAdd;
        
        // Get their current points.
        let givescore = this.client.getScore.get(user.id, message.guild.id);
        // It's possible to give points to a user we haven't seen, so we need to initiate defaults here too!
        if (!givescore || givescore.points < pointsToAdd) {
          return 
        }
        userscore.points -= pointsToAdd;

        // We also want to update their level (but we won't notify them if it changes)
        let userLevel = Math.floor(0.1 * Math.sqrt(userscore.points));
        userscore.level = userLevel;

        // And we save it!
        this.client.setScore.run(userscore);

        return message.channel.send(`${user.tag} has received ${pointsToAdd} points and now stands at ${userscore.points} points.`);
      }
    }
};