const { Command } = require('discord.js-commando');

module.exports = class SkipAudioCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'pause',
            aliases: ["sh", "shh", "shhh", "shhhh"],
            group: 'audio',
            memberName: 'pause',
            description: 'Adds a vote to pause the currently playing music.', // Thanks NYoshi370
            examples: ['pause'],
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
			if(!fetched) return message.reply("pausing a non-existent song is a great move.");

			let uservcCount = message.member.voiceChannel.members.size;
			let requiredToPause = Math.ceil(uservcCount/2);

			if(!fetched.queue[0].votePause) fetched.queue[0].votePause = [];

			if (fetched.queue[0].votePause.includes(message.member.id))
				return message.reply(`you already voted to pause! ${fetched.queue[0].votePause.length}/${requiredToPause} required.`)

			fetched.queue[0].votePause.push(message.member.id);
			
			this.client.audio.active.set(message.guild.id, fetched);
			if(fetched.queue[0].votePause.length >= requiredToPause) {
				message.channel.send('Song stopped. Use '+this.client.commandPrefix+'resume to resume');
				fetched.dispatcher.pause();
        fetched.queue[0].votePause = [];
        return;
			}

			message.reply(`your vote has been added. ${fetched.queue[0].votePause.length}/${requiredToPause} required`);
    }
};