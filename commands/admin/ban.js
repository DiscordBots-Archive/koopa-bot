const { Command } = require('discord.js-commando');
const { RichEmbed } = require("discord.js");

module.exports = class BanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ban',
            aliases: ["ban-hammer", "b-h"],
            group: 'admin',
            memberName: 'ban',
            description: 'Bans an user',
            details: "To give a reason, but not days, use ban @User \"reason\".\nTo give days, but not a reason, use ban @User \"\" days.\nTo give both, use ban @User \"reason\" days.",
            examples: ['ban <user> <reason wrapped in "s> <days (opt)>', "ban @InfamousGuy003 \"spamming in #general-talk\" 7"],
            clientPermissions: ["BAN_MEMBERS"],
            args: [
              {
                key: "member",
                prompt: "who do you want to ban?",
                type: "member"
              },
              {
                key: "reason",
                prompt: "why do you want to ban him?",
                default: "No reason.",
                type: "string"
              },
              {
                key: "days",
                prompt: "how long do you want to keep him banned?",
                type: "integer",
                default: ""
              }
            ]
        });
    }

    run(msg, { member, reason, days }) {
      if (!this.client.isOwner(msg.author)
          && !msg.member.roles.has("481492274333876224")) return msg.reply("you don't have the permission to use this!");
      if (days) {
        member.ban({days: days, reason: reason});
      } else {
        member.ban(reason);
      }
      let logs, modlogs;
      if (msg.guild.id == "481369156554326023") {
        logs = msg.guild.channels.find("name", "logs");
        modlogs = msg.guild.channels.find("name", "modlogs");
      } else if (msg.guild.id== "472214037430534167") {
        modlogs = msg.guild.channels.find("name", "koopa-logs");
        logs = msg.guild.channels.find("name", "samplasion-development");
      }
      let embed = new RichEmbed()
        .setColor(0xe00b0b)
        .setTitle(`:skull_crossbones: ${member.user.tag} was banned`)
        .setThumbnail(member.user.displayAvatarURL)
        .setTimestamp(Date.now())
        .addField(":pencil: Moderator", `<@${msg.author.id}> [${msg.author.tag}]`)
        .addField(":biohazard: Reason", reason)
        .addField(":calendar_spiral: Ban duration", days ? days + " days" : "Forever")
        .setFooter("He really deserved it!")
      msg.say(":ok: User banned!");
      member.send(`You **[${member.id}]**were ${days ? "banned for "+days+" days" : "permanently banned"} by ${msg.author.tag} **[${msg.author.id}]**. Reason: \`${reason}\``);
      modlogs.send(embed);
      logs.send(`${member.user.tag} **[${member.id}]** was ${days ? "banned for "+days+" days" : "permanently banned"} by ${msg.author.tag} **[${msg.author.id}]** for reason: \`${reason}\` in ${msg.channel}`);
    }
};