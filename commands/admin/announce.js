const { Command } = require('discord.js-commando');

module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'announce',
            group: 'admin',
            memberName: 'announce',
            description: 'Sends a message to the #announcements channel',
            examples: ['say Hi there!'],
            clientPermissions: ['MANAGE_MESSAGES'],
            guildOnly: true,
            args: [
                {
                    key: 'text',
                    prompt: 'What text would you like the bot to say?',
                    type: 'string'
                }
            ]
        });    
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author) || msg.member.roles.has(msg.guild.roles.find("name", "Magikoopa").id);
    }

    async run(msg, { text }) {
        await msg.delete();
        return msg.guild.channels.find("name", "announcements").send(text);
    }
};