const { Command } = require('./../../classes/Command.js');

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'mute',
            aliases: ["unmute"],
            group: 'admin',
            memberName: 'mute',
            description: 'Mutes an user',
            detalis: "The unmute alias is only for aestetical purpose.",
            examples: ['warn @Randomguy Nonsensical speak'],
            minPerm: 2,
            args: [
              {
                key: "member",
                prompt: "who do you want to mute?",
                type: "member"
              },
              {
                key: "reason",
                prompt: "why do you want to mute?",
                default: "No reason.",
                type: "string"
              }
            ]
        });
    }

    async run(msg, { member, reason }) {
      // if (member.user.bot) return msg.reply("you cannot warn a bot (unless someone stole its token, that is).");
      if (msg.member.highestRole.position <= member.highestRole.position) {
				return msg.reply("you (and I) can't mute that user.");
			}
      var mutedRole = await msg.guild.roles.find('name', "Muted");
      if (!mutedRole) return msg.channel.send("Create a role called `Muted` with no permissions.");
      await this.client.mute(member, reason, msg.member, msg);
    }
};