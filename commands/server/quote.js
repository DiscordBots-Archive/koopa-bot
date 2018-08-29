const { Command } = require('discord.js-commando');

module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'quote',
            group: 'group1',
            memberName: 'quote',
            description: 'Adds a message to the server quotes.',
            examples: ['quote -add <quote name> <message id>', "quote -del <quote name>", "quote -list"],
            args: [
              {
                key: "flag",
                prompt: "insert a valid flag. `-add -list -del`",
                type: "flag",
                default: ""
              },
              {
                key: 'name',
                prompt: 'insert a name gor the quote',
                type: 'string'
              },
              {
                key: 'message',
                prompt: 'What text would you like the bot to say?',
                type: 'message'
              }
            ]
        });
    }

    run(msg, { flag, name, message }) {
        switch (flag) {
          case "add":
            break;
          
        }
    }
};