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
				      	label: 'string',
				      	prompt: 'If you don\'t give me a link, I\'ll be hungry and won\'t play music',
				      	type: 'role'
				      }
			      ]
        });
    }

    run(msg) {
        return msg.say('Hi, I\'m awake!');
    }
};