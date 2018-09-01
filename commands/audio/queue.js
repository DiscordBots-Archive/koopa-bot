const { Command } = require('discord.js-commando');
const { RichEmbed } = require("discord.js");

module.exports = class StopAudioCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'queue',
            aliases: ["now-playing", "n-p", "time", "song-length", "s-l", "status"],
            group: 'audio',
            memberName: 'queue',
            description: 'Shows the queue.', // Thanks NYoshi370
            examples: ['queue'],
            /*args: [
				      {
				      	key: 'link',
				      	prompt: 'If you don\'t give me a link, I\'ll be hungry and won\'t play music!',
				      	type: 'string'
				      }
			      ]*/
        });
    }

    async run(message) {
      var fetched = this.client.audio.active.get(message.guild.id);
			if(!fetched) return message.reply("there currently isn't any music playing in this server");

			let queue = fetched.queue;
			let nowPlaying = queue[0];

			var embed = new RichEmbed()
				.setTitle("Music List")
				.setColor("#b30000")
				.setTimestamp(new Date())
				.setDescription(`__**NOW PLAYING**__\n\n**${nowPlaying.songTitle}** \`[${this.getTime(fetched.dispatcher.time/1000)}/${nowPlaying.length}]\`\n*Requested by* *__${nowPlaying.requester}__*`)

			for (var i = 1; i < queue.length; i++) {
				embed.addField(queue[i].songTitle, `*Requested by __${queue[i].requester}__*`); 
			}
			return message.channel.send(embed);
    }
  
  getTime(secs) {
    var mins = secs / 60;
    var oms = mins > Math.floor(mins) && mins < Math.ceil(mins) // one more second — if mins isn't precise, add a second and floor mins
    var sec = oms ? (secs % 60) + 1 : secs % 60;
    return `${this.client.util.pad(Math.floor(mins))}:${this.client.util.pad(Math.floor(sec))}`
  }
};