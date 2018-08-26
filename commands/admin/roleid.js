const { Command } = require("discord.js-commando");

module.exports = class ChannelCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'channel',
			aliases: ['chan'],
			group: 'util',
			memberName: 'channel',
			description: 'Gets information about a user.',
			examples: ['channel #test', 'channel test'],
			guildOnly: true,

			args: [
				{
					key: 'role',
					label: 'role',
					prompt: '>LOl',
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