const { Command } = require('discord.js-commando');

module.exports = class PointsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'points',
            group: 'level',
            memberName: 'points',
            description: 'Know your points.',
            examples: ['points']
        });
    }

    run(message) {
        const key = `${message.guild.id}-${message.author.id}`;
        const pts = this.client.getScore.run(message.guild.id, message.author.id);
        return message.reply(`you currently have ${pts + " " + pts==1 ? "point" : "points"}, and are level ${this.client.points.getProp(key, "level")}!`);
    }
};