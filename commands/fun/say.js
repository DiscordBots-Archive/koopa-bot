const { Command } = require('discord.js-commando');

module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'say',
            group: 'fun',
            memberName: 'say',
            description: 'Replies with the text you provide.',
            examples: ['say Hi there!'],
            args: [
                {
                    key: 'text',
                    prompt: 'What text would you like the bot to say?',
                    type: 'string',
                    validate: text => {
                        if (text.length < 1001) return true;
                        return 'message content must be less than or equal to 1000 characters.';
                    }
                }
            ]
        });    
    }

    run(msg, { text }) {
        msg.delete();
        return msg.say(this.client.util.embed().setDescription(text).setFooter("Requested by " + this.client.util.memberTag(msg.member)));
    }
};