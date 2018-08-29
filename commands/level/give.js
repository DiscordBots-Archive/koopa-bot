const { Command } = require('discord.js-commando');
const { RichEmbed } = require("discord.js");

module.exports = class GiveCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'give',
            aliases: ["gift"],
            group: 'level',
            memberName: 'give',
            description: 'Giv mah yer points!! The points will be subtracted from your total, so be careful!',
            examples: ['give @User 500'],
            args: [
              {
                key: "user",
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

    async run(message, { user: membre, pts: pointsToAdd }) {
      // Limited to guild owner - else you will gift your coins!
      if(membre.bot) return message.reply("bots cannot have points!");
      if(this.client.isOwner(message.author) || message.author.id == message.guild.ownerID) {
        const user = membre;

        // Get their current points.
        let userscore = this.client.getScore.get(user.id, message.guild.id);
        // It's possible to give points to a user we haven't seen, so we need to initiate defaults here too!
        if (!userscore) {
          userscore = { id: `${message.guild.id}-${user.id}`, user: user.id, guild: message.guild.id, points: 0, level: 1 }
        }
        userscore.points += pointsToAdd;

        // We also want to update their level (but we won't notify them if it changes)
        let userLevel = Math.floor((userscore.points+50) / 50)
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
        let givescore = this.client.getScore.get(message.author.id, message.guild.id);
        // It's possible to give points to a user we haven't seen, so we need to initiate defaults here too!
        if (!givescore || givescore.points < pointsToAdd) {
          return message.reply("you don't have enough points to be given to another person.");
        }
        givescore.points -= pointsToAdd;

        // We also want to update their level (but we won't notify them if it changes)
        let userLevel = Math.floor((userscore.points+50) / 50)
        userscore.level = userLevel;
        let giveLevel = Math.floor((givescore.points+50) / 50)
        givescore.level = giveLevel;

        // And we save it!
        this.client.setScore.run(userscore);
        this.client.setScore.run(givescore);

        return message.channel.send(`${user.tag} has received ${pointsToAdd} points and now stands at ${userscore.points} points.\n${message.author.tag}, instead, is at ${givescore.points}`);
      }
    }
};