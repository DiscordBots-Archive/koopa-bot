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
            var author = message.author.id;
            var guild = message.guild.id;
            this.client.quotes.set.run({
              id: message,
              name: name,
              message: cnt,
              guild: guild,
              author: author
            });
            break;
          case "del":
            break;
          case "list":
            break;
          case "get":
            if (!name) return msg.reply("insert a valid name.");
            var guild = msg.guild.id;
            var quote = this.client.quotes.get.get(guild, name);
            msg.say(quote.message);
            break;
          default:
            return msg.reply("insert a valid flag");
        }
    }
};