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
      if (!server.queue[0]) return msg.reply("you want me to skip... **_nothing_**?");
      server.skips++
      if (server.skips == 1) {
        msg.reply("vote added, but I need 1 more vote to skip the song (y'know, to be fair)");
      } else if (server.skips == 2) {
        server.skips = 0
        if (server.dispatcher) server.dispatcher.end();
      }
    }
};