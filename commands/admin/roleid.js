const { Command } = require("discord.js-commando");

module.exports = class ChannelCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'roleid',
			aliases: ['rid', 'role'],
			group: 'admin',
			memberName: 'roleid',
			description: 'Gets information about a role.',
			guildOnly: true,

			args: [
				{
					key: 'role',
					label: 'role',
					prompt: 'enter a role',
					type: 'role'
				}
			]
		});
	}

	async run(msg, args) {
		const role = args.role;
		return msg.reply(role.id);
	}
};