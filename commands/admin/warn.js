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
      if (!this.client.isOwner(msg.author)
          && !msg.member.roles.has("481492274333876224")
          && !msg.member.roles.has("481492388020486171")) return msg.reply("you don't have the permission to use this!");
      if (member.user.bot) return msg.reply("you cannot warn a bot (unless someone stole its token, that is).");
      this.client.warns.set.run({
        uid: member.user.id,
        reason: reason,
        moderator: msg.author.id,
        time: this.getDateTime(),
        guild: msg.guild.id
      });
      let logs, modlogs;
      if (msg.guild.id == "481369156554326023") {
        logs = msg.guild.channels.find("name", "logs");
        modlogs = msg.guild.channels.find("name", "modlogs");
      } else if (msg.guild.id== "472214037430534167") {
        modlogs = msg.guild.channels.find("name", "koopa-logs");
        logs = msg.guild.channels.find("name", "samplasion-development");
      }
      msg.say(":ok: User warned!");
      member.send(`You **[${member.id}]** were warned by ${msg.author.tag} **[${msg.author.id}]**. Reason: \`${reason}\``);
      modlogs.send(this.client.warns.log(member, msg.member, reason));
      logs.send(`${member.user.tag} **[${member.id}]** was warned by ${msg.author.tag} **[${msg.author.id}]** for reason: \`${reason}\` in ${msg.channel}`);
    }
  
    getDateTime() {
      var date = new Date();

      var hour = date.getHours();
      hour = (hour < 10 ? "0" : "") + hour;

      var min  = date.getMinutes();
      min = (min < 10 ? "0" : "") + min;

      var sec  = date.getSeconds();
      sec = (sec < 10 ? "0" : "") + sec;

      var year = date.getFullYear();

      var month = date.getMonth() + 1;
      month = (month < 10 ? "0" : "") + month;

      var day  = date.getDate();
      day = (day < 10 ? "0" : "") + day;

      return year + "-" + month + "-" + day + "T" + hour + ":" + min + ":" + sec + "+01:00";
    }
};