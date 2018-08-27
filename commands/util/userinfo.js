const { Command } = require('discord.js-commando');

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
                prompt: "",
                default: "",
                type: "member"
              }
            ]
        });
    }

    async run(msg, { mem }) {
        if (!mem) {
          var member = await msg.guild.members.fetch(msg.author);
        } else {
          var member = mem;
        }
        
        return msg.say(`User ${member.displayName || msg.author.username} (ID: ${member.user.id}`);
    }
};