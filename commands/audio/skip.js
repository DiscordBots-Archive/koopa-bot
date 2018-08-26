const { Command } = require('discord.js-commando');

module.exports = class SkipAudioCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'skip',
            group: 'audio',
            memberName: 'skip',
            description: 'Adds a vote (out of 2) to skip the currently playing music.', // Thanks NYoshi370
            examples: ['skip'],
            /*args: [
				      {
				      	key: 'link',
				      	prompt: 'If you don\'t give me a link, I\'ll be hungry and won\'t play music!',
				      	type: 'string'
				      }
			      ]*/
        });
    }

    run(msg) {
      var server = this.client.audio.servers[msg.guild.id];
      server.skips++
      if (server.skips == 1) {
        
      } else if (server.skips == 2) {
        
      }
    }
};