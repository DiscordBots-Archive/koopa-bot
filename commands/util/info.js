const { Command } = require('discord.js-commando');

module.exports = class ReplyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'info',
      aliases: ["about", "bot-info"],
      group: 'util',
      memberName: 'info',
      description: 'Shows infos about the bot',
      examples: ['info']
    });
    
    this.funcs = {
      "Points": ":ok:",
      "Logging": "<:wip:487304419361161218>",
      "Administration": "<:wip:487304419361161218> 98%",
      "Permissions System": ":ok:",
      "Multi-guild flexibility\*": "<:wip:487304419361161218>"
    }
  }

  run(msg) {
    let e = this.client.util.embed()
      .setTitle("Current functionality for Koopa")
    let desc = "Here are listed the current functionalities, with their progress.\n"
    for (var fun in this.funcs) {
      desc += `\n**${fun}**: ${this.funcs[fun]}`
    }
    e.setDescription(desc)
    msg.embed(e);
  }
};