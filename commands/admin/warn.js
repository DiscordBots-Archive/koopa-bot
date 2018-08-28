const { Command } = require('discord.js-commando');

module.exports = class WarningCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'warn',
            group: 'admin',
            memberName: 'warn',
            description: 'Warns an user',
            examples: ['warn <user> <reason>'],
            args: [
              {
                key: "member",
                prompt: "who do you want to warn?",
                type: "member"
              },
              {
                key: "reason",
                prompt: "who do you want to warn?",
                default: "No reason.",
                type: "string"
              }
            ]
        });
    }

    run(msg, { member, reason }) {
      this.client.warns.set({
        id: member.user.id,
        reason: reason,
        moderator: msg.author.id,
        time: this.client.getDateTime()
      });
      if (msg.guild.id == "481369156554326023") {
        
      } else if (msg.guild.id== "") {
        
      }
      msg.embed(this.client.warns.log(member, msg.member, reason));
    }
};