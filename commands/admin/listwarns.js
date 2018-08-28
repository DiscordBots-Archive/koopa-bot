const { Command } = require('discord.js-commando');

module.exports = class ListWarningsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'listwarns',
            aliases: ["lw"],
            group: 'admin',
            memberName: 'listwarns',
            description: 'Shows the warnings an user got',
            examples: ['listwarns <user>'],
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
          || !msg.member.roles.has("481492274333876224")
          || !msg.member.roles.has("481492388020486171")) return msg.reply("you don't have the permission to use this!");
      this.client.warns.get.all(member.user.id);
      msg.say(":ok: User warned!")
    }
};