const { Command } = require('./../../classes/Command.js');
const { RichEmbed } = require("discord.js");

module.exports = class KickCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'kick',
            group: 'admin',
            memberName: 'kick',
            description: 'Kicks an user',
            examples: ['kick <user> <reason>'],
            clientPermissions: ["KICK_MEMBERS"],
            modOnly: true,
            args: [
              {
                key: "member",
                prompt: "who do you want to kick?",
                type: "member"
              },
              {
                key: "reason",
                prompt: "why do you want to kick him?",
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
      member.kick(reason);
      let logs, modlogs;
      if (msg.guild.id == "481369156554326023") {
        logs = msg.guild.channels.find("name", "logs");
        modlogs = msg.guild.channels.find("name", "modlogs");
      } else if (msg.guild.id== "472214037430534167") {
        modlogs = msg.guild.channels.find("name", "koopa-logs");
        logs = msg.guild.channels.find("name", "samplasion-development");
      }
      let embed = new RichEmbed()
        .setColor(0xff9d00)
        .setTitle(`:warning: ${member.user.tag} was kicked`)
        .setThumbnail(member.user.displayAvatarURL)
        .setTimestamp(Date.now())
        .addField(":pencil: Moderator", `<@${msg.author.id}> [${msg.author.tag}]`)
        .addField(":biohazard: Reason", reason)
      msg.say(":ok: User kicked!");
      member.send(`You **[${member.id}]** were kicked by ${msg.author.tag} **[${msg.author.id}]**. Reason: \`${reason}\``);
      modlogs.send(embed);
      logs.send(`${member.user.tag} **[${member.id}]** was kicked by ${msg.author.tag} **[${msg.author.id}]** for reason: \`${reason}\` in ${msg.channel}`);
    }
};