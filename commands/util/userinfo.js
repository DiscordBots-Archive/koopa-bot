const { Command } = require('discord.js-commando');
const Discord = require("discord.js");

module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'userinfo',
            group: 'util',
            memberName: 'userinfo',
            aliases: ["uinfo", "ui"],
            description: 'Replies with info about user.',
            examples: ['userinfo @User', 'userinfo User'],
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
      
        var embed = new Discord.RichEmbed()
            .setColor(member.highestRole.color)
            .setTitle(`Info for user ${member.displayName} (${member.user.tag}) | ID ${member.user.id}`)
            ;
      
        return msg.embed(embed);
        
        // return msg.say(this.member = await this.guild.members.fetch(this.author););
    }
};