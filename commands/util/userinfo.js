const { Command } = require('discord.js-commando');

module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'userinfo',
            group: 'util',
            memberName: 'userinfo',
            description: 'Replies with info about user.',
            examples: ['userinfo @User', 'userinfo User']
        });
    }

    run(msg) {
        const args = msg.content.slice(this.client.prefix.length).trim().split(/ +/g);
        return msg.say('Hi, I\'m awake!');
    }
};