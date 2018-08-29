const { Command } = require('discord.js-commando');

module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'quote',
            group: 'group1',
            aliases: ["quotes", "q"],
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
                prompt: 'insert a name for the quote',
                type: 'string',
                default: ""
              },
              {
                key: 'mess',
                prompt: 'insert the id of the message you want quoted.',
                type: 'message',
                default: ""
              }
            ]
        });
    }

    async run(msg, { flag, name, mess }) {
        switch (flag) {
          case "add":
            if (!name || !mess) return msg.reply("insert a valid name and/or message id.");
            var message = await msg.channel.fetchMessage(mess).catch(e => console.error(e));
            var cnt = message.cleanContent;
            msg.say(cnt);
            break;
          case "del":
            break;
          case "list":
            break;
          default:
            return msg.reply("insert a valid flag");
        }
    }
};