const { Command } = require('discord.js-commando');

module.exports = class SkipAudioCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'skip',
            group: 'audio',
            memberName: 'skip',
            description: 'Adds a vote (out of 2) to skip the currently playing music.',
            examples: ['play'],
            /*args: [
				      {
				      	key: 'link',
				      	prompt: 'If you don\'t give me a link, I\'ll be hungry and won\'t play music!',
				      	type: 'string'
				      }
			      ]*/
        });
    }

    run(msg, { link }) {
      if(!msg.member.voiceChannel) return msg.reply("you are not in a voice channel, *are you?* :eyes:");
      if(!this.client.audio.servers[msg.guild.id]) this.client.audio.servers[msg.guild.id] = {
        queue: []
      }
      var server = this.client.audio.servers[msg.guild.id];
      server.queue.push(link);
      if(!msg.guild.voiceConnection) msg.member.voiceChannel.join().then(connection => {
        this.client.audio.play(connection, msg);
      });
    }
};