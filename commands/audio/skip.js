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

    run(message) {
      var voiceChannel = message.member.voiceChannel;
			if (!voiceChannel) return message.reply("I think it may work better if you are in a voice channel!");

			var fetched = this.client.audio.active.get(message.guild.id);
			if(!fetched) return message.reply("there isn't any music playing in the server");

			let uservcCount = message.member.voiceChannel.members.size;
			let requiredToSkip = Math.ceil(uservcCount/2);

			if(!fetched.queue[0].voteSkips) fetched.queue[0].voteSkips = [];

			if (fetched.queue[0].voteSkips.includes(message.member.id))
				return message.reply(`you already voted to skip! ${fetched.queue[0].voteSkips.length}/${requiredToSkip} required.`)

			fetched.queue[0].voteSkips.push(message.member.id);
			
			this.client.audio.active.set(message.guild.id, fetched);
			if(fetched.queue[0].voteSkips.length >= requiredToSkip) {
				message.channel.send('Song skipped');
				return fetched.dispatcher.emit('end');
			}

			message.reply(`your vote has been added. ${fetched.queue[0].voteSkips.length}/${requiredToSkip} required`);
    }
};