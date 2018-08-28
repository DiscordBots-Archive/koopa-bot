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
            examples: ['points', 'level']
        });
    }

    run(msg) {
        var embed = new RichEmbed()
          .setAuthor(message.member.displayName, message.author.displayIconURL)
          .setTitle("Felicitations!")
          .setDescription("*(sigh)*\n\nYou've leveled UP!")
          .addField("New Level", curLevel)
          .setFooter("Samplasion, why are you doing me this?");
    }
};