const { Command } = require('discord.js-commando');

module.exports = class PointsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'point',
            group: 'level',
            memberName: 'points',
            description: 'Know your points.',
            examples: ['points']
        });
    }

    run(message) {
        const key = `${message.guild.id}-${message.author.id}`;
        const pts = this.client.points.getProp(key, "points");
        return message.reply(`you currently have ${pts + " " + pts==1 ? "point" : "points"}, and are level ${this.client.points.getProp(key, "level")}!`);
    }
};