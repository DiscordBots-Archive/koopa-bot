const { Command } = require('discord.js-commando');

module.exports = class PlayAudioCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'play',
            group: 'audio',
            memberName: 'play',
            description: 'Plays the music at the given YouTube link',
            examples: ['play https://youtube.com/someVideo12'],
            args: [
				      {
				      	key: 'link',
				      	prompt: 'If you don\'t give me a link, I\'ll be hungry and won\'t play music!',
				      	type: 'string'
				      }
			      ]
        });
    }

    run(msg, { link }) {
      if(!msg.member.voiceChannel) return msg.reply("you are not in a voice channel, *are you?* :eyes:");
      if(!this.client.audio.servers[msg.guild.id]) this.client.audio.servers[msg.guild.id] = {
        queue: [],
        skips: 0
      }
      var server = this.client.audio.servers[msg.guild.id];
      server.queue.push(link);
      if(!msg.guild.voiceConnection) msg.member.voiceChannel.join().then(connection => {
        this.client.audio.play(connection, msg);
      });
    }
};