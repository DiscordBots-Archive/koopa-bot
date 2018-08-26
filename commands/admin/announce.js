const { Command } = require('discord.js-commando');

module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'announce',
            group: 'admin',
            memberName: 'announce',
            description: 'Sends a message to the #announcements channel',
            examples: ['say Hi there!'],
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
        return this.client.isOwner(msg.author);
    }

    run(msg, { text }) {
        msg.delete();
        return msg.guild.channels.get("name", "announcements").send(text);
    }
};