const { Command } = require('discord.js-commando');

module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'userinfo',
            group: 'util',
            memberName: 'userinfo',
            aliases: ["uinfo", "ui"],
            description: 'Replies with info about user.',
            examples: ['userinfo @User', 'userinfo User']
        });
    }

    run(msg) {
        const args = msg.content.slice(this.client.commandPrefix.length).trim().split(/ +/g);
        args.shift();
        if (msg.mentions) {
          var user = msg.mentions.members.first();
        } else if (!args[0]) {
          var user = msg.member;
        } else {
          var user = msg.guild.members.find("name", args[0]);
        }
        
        return msg.say(`User ${user.displayName || msg.author.username} (ID: ${user.user.id}`);
    }
};