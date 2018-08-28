const { Command } = require('discord.js-commando');

module.exports = class PointsLevelCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'points',
            group: 'level',
            memberName: 'points',
            description: 'Know your points',
            examples: ['points']
        });
    }

    run(message) {
      console.log(1);
      const fel = ["Great", "Fantastic", "Awesome", "I'm better"]
      const data = this.client.getScore.get(message.guild.id, message.author.id);
      let pts = data.points, lvl = data.level;
      return message.reply(`you currently have ${pts + " " + pts==1 ? "point" : "points"}, and are level ${lvl}! ${fel[Math.floor(Math.random()*fel.length)]}!`);
    }
};