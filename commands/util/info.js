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
      "Logging": ""
    }
  }

  run(msg) {
    return msg.say('Hi, I\'m awake!');
  }
};