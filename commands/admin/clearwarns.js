const { Command } = require('discord.js-commando');

module.exports = class CleasWarningsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'clear-warns',
            aliases: ["c-w"],
            group: 'admin',
            memberName: 'clear-warns',
            description: 'Warns an user',
            examples: ['warn <user>'],
            args: [
              {
                key: "member",
                prompt: "who do you want to warn?",
                type: "member"
              }
            ]
        });
    }

    run(msg, { member }) {
      if (!this.client.isOwner(msg.author)
          && !msg.member.roles.has("481492274333876224")
          && !msg.member.roles.has("481492388020486171")) return msg.reply("you don't have the permission to use this!");
      if (member.user.bot) return msg.reply("bots don't have to be warned, so don't have warnings!");
      this.client.warns.delete.run(member.user.id, msg.guild.id);
      msg.say(":ok: User warnings cleared!");
    }
};