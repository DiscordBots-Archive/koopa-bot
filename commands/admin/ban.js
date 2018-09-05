const Command = require('./../../classes/Command.js');
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
            examples: ['`ban <user> <reason wrapped in "s> <days (opt)>`', "ban @InfamousGuy003 \"spamming in #general-talk\" 7"],
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
            ],
            adminOnly: true
        });
    }

    run(msg, { member, reason, days }) {
      //if (!this.client.isOwner(msg.author)
      //    && !msg.member.roles.has("481492274333876224")) return msg.reply("you don't have the permission to use this!");
      var d = days ? days : null
      this.client.ban(member, reason, msg.member, msg, days);
      msg.say(":ok: User banned!");
    }
};