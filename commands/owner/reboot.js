const { Command } = require('discord.js-commando');

module.exports = class RebootCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'reboot',
            group: 'owner',
            aliases: ["restart", "respawn"],
            memberName: 'reboot',
            description: 'Reboots the bot.',
            examples: ['reboot'],
            guildonly: true
        });
    }
  
    hasPermission(msg) {
        return this.client.isOwner(msg.author);
    }

    async run(message) {
      await message.channel.send("Koopa is respawning...");
      process.exit();
    }
};