const { Command } = require('discord.js-commando');

module.exports = class PurgeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'purge',
            aliases: ["prune", "clear"],
            group: 'admin',
            memberName: 'purge',
            description: 'Purges a channel.',
            examples: ['reply'],
            args: [
              {
                key: "amount",
                prompt: "how many messages should I purge?",
                type: "integer",
                max: 100,
                min: 0
              },
              {
                key: "user",
                prompt: "who do you want to purge the messages by? :eyes:",
                type: "user",
                default: ""
              }
            ],
            guildOnly: true
        });
    }

    run(message, { amount, user }) {
        if (!amount) return message.reply('Must specify an amount to delete!');
        if (!amount && !user) return message.reply('Must specify a user and amount, or just an amount, of messages to purge!');
        // Fetch 100 messages (will be filtered and lowered up to max amount requested)
        message.channel.fetchMessages({
          limit: 100,
        }).then((messages) => {
           if (user) {
             const filterBy = user ? user.id : this.client.user.id;
             messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
           }
           message.channel.bulkDelete(messages).catch(error => console.log(error.stack));
        });
    }
};