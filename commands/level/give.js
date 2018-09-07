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
                type: "enuser"
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
      if(membre.bot) return message.reply("bots don't have points!");
      if(this.client.isOwner(message.author) || message.author.id == message.guild.ownerID) {
        const user = membre;

        // Ensure there is a points entry for this user.
        this.client.points.ensure(`${message.guild.id}-${user.id}`, this.client.defaultPoints);
        
        let userPoints = this.client.points.get(`${message.guild.id}-${user.id}`, "points");
        userPoints += pointsToAdd;

        // We also want to update their level (but we won't notify them if it changes)
        let userLevel = Math.floor((userPoints+100) / 100)

        // And we save it!
        this.client.points.set(`${message.guild.id}-${user.id}`, userPoints, "points");
        this.client.points.set(`${message.guild.id}-${user.id}`, userLevel, "level");

        return message.channel.send(`${user.tag} has received ${pointsToAdd} EXP points and now stands at ${userPoints} EXP points.`);
      } else {
        const user = membre;
        
        if (pointsToAdd < 0) return message.reply("you can't steal points!");
        
        // Ensure there is a points entry for this user.
        this.client.points.ensure(`${message.guild.id}-${message.member.id}`, this.client.defaultPoints);
        
        let givePoints = this.client.points.get(`${message.guild.id}-${message.member.id}`, "points");
        
        if (givePoints < pointsToAdd) return message.reply("you don't have enough points!");
        
        givePoints -= pointsToAdd;

        
        this.client.points.ensure(`${message.guild.id}-${user.id}`, this.client.defaultPoints);
  
        let userPoints = this.client.points.get(`${message.guild.id}-${user.id}`, "points");
        userPoints += pointsToAdd;

        // We also want to update their level (but we won't notify them if it changes)
        let userLevel = Math.floor((userPoints+100) / 100)
        let giveLevel = Math.floor((givePoints+100) / 100)

        // And we save it!
        this.client.points.set(`${message.guild.id}-${user.id}`, userPoints, "points");
        this.client.points.set(`${message.guild.id}-${user.id}`, userLevel, "level");
        this.client.points.set(`${message.guild.id}-${message.member.id}`, givePoints, "points");
        this.client.points.set(`${message.guild.id}-${message.member.id}`, giveLevel, "level");
        

        return message.channel.send(`${user.tag} has received ${pointsToAdd} EXP points and now stands at ${userPoints} EXP points.\n${message.author.tag}, instead, is at ${givePoints} EXP points`);
      }
    }
};