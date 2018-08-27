const { Command } = require('discord.js-commando');

module.exports = class StopAudioCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'stop',
            group: 'audio',
            memberName: 'stop',
            aliases: ["stahp"],
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

    run(message) {
      if (!message.member.voiceChannel) return message.reply("I think it may work better if you are in a voice channel!");

			if(message.guild.voiceConnection) {
				message.guild.voiceConnection.disconnect();
				return message.reply("I have stopped playing music");
			}
    }
};