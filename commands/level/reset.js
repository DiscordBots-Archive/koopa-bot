const { Command } = require('discord.js-commando');

module.exports = class ReplyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'reset',
      group: 'level',
      memberName: 'reset',
      description: 'Resets the leaderboard',
      examples: ['reset']
    });
  }

  run(msg) {
    msg.guild.members.forEach(user => {
         // And we save it!
        this.client.points.set(`${msg.guild.id}-${user.id}`, this.client.defaultPoints);
    });
  }
};