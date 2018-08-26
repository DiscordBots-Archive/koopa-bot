const { Command } = require('discord.js-commando');

module.exports = class StopAudioCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'stop',
            group: 'audio',
            memberName: 'stop',
            description: 'Stops the music.', // Thanks NYoshi370
            examples: ['stop'],
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
      server.queue = []; // empty the queue
      if (server.dispatcher) server.dispatcher.end();
      msg.reply("music stopped");
      server.connection.disconnect();
    }
};