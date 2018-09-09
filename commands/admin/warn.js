const { Command } = require('./../../classes/Command.js');

module.exports = class WarningCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'warn',
            group: 'admin',
            memberName: 'warn',
            description: 'Warns an user',
            examples: ['warn <user> <reason>'],
            minPerm: 2,
            args: [
              {
                key: "member",
                prompt: "who do you want to warn?",
                type: "member"
              },
              {
                key: "reason",
                prompt: "why do you want to warn?",
                default: "No reason.",
                type: "string"
              }
            ]
        });
    }

    run(msg, { member, reason }) {
      if (member.user.bot) return msg.reply("you cannot warn a bot (unless someone stole its token, that is).");
      if (msg.member.highestRole.position <= member.highestRole.position) {
				return msg.reply("you can't warn that user.");
			}
      try { this.client.warn(member, reason, msg.member, msg) } catch (e) { console.log(e) }
      msg.say(":ok: User warned!");
    }
};