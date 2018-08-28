const { Command } = require('discord.js-commando');

module.exports = class SkipAudioCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'resume',
            group: 'audio',
            memberName: 'resume',
            description: 'Adds a vote to resume the currently paused music.', // Thanks NYoshi370
            examples: ['resume'],
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
			if(!fetched) return message.reply("resuming a non-existent song is an excellent try. Oh well...");

			let uservcCount = message.member.voiceChannel.members.size;
			let requiredToRes = Math.ceil(uservcCount/2);

			if(!fetched.queue[0].voteRes) fetched.queue[0].voteRes = [];

			if (fetched.queue[0].voteRes.includes(message.member.id))
				return message.reply(`you already voted to resume! ${fetched.queue[0].voteRes.length}/${requiredToRes} required.`)

			fetched.queue[0].voteRes.push(message.member.id);
			
			this.client.audio.active.set(message.guild.id, fetched);
			if(fetched.queue[0].voteRes.length >= requiredToRes) {
				message.channel.send('Song resumed');
				fetched.dispatcher.resume();
        fetched.queue[0].voteRes = [];
        return;
			}

			message.reply(`your vote has been added. ${fetched.queue[0].voteRes.length}/${requiredToRes} required`);
    }
};