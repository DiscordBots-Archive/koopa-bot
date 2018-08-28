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
      this.client.warns.set.run({
        id: member.user.id,
        reason: reason,
        moderator: msg.author.id,
        time: this.client.getDateTime()
      });
      let logs, modlogs;
      if (msg.guild.id == "481369156554326023") {
        logs = msg.guild.channels.find("name", "logs");
        modlogs = msg.guild.channels.find("name", "modlogs");
      } else if (msg.guild.id== "472214037430534167") {
        modlogs = msg.guild.channels.find("name", "koopa-logs");
        logs = msg.guild.channels.find("name", "samplasion-development");
      }
      msg.say(":ok: User warned!")
      modlogs.send(this.client.warns.log(member, msg.member, reason));
      logs.send(`${member.user.tag} (ID ${member.id}) was warned by ${msg.author.tag} (ID ${msg.author.id}) for reason: \`${reason}\` in ${msg.channel}`);
    }
};