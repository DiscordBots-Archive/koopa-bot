const { Command } = require('discord.js-commando');
const YTDL = require("ytdl-core");

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

    async run(message, { link }) {
      var voiceChannel = await message.member.voiceChannel;
			if (!voiceChannel) return message.reply("I think it may work better if you are in a voice channel!");

			var permissions = await voiceChannel.permissionsFor(message.client.user);
			if (!permissions.has('CONNECT')) return message.reply("I can't join voice channels. Make sure I have the proper permissions.").catch(console.error);
			if (!permissions.has('SPEAK'))	 return message.reply("I can't speak in this server. Make sure I have the proper permissions.").catch(console.error);

      // commando logic
			// if (!args[0])	return message.reply("Please specify a link");

			let validate = await YTDL.validateURL(link);
			if(!validate) return message.reply("please input a valid URL following the command");

			let info = await YTDL.getInfo(link);

			let data = this.client.audio.active.get(message.guild.id) || {};

			if (!data.connection) data.connection = await message.member.voiceChannel.join();
			if (!data.queue) data.queue = [];
			data.guildID = message.guild.id;

			data.queue.push({
				songTitle: info.title,
				requester: message.author.tag,
				url: link,
				announceChannel: message.channel.id
			});

			if (!data.dispatcher)	this.client.audio.play(this.client, this.client.audio.active, data);
			else					message.channel.send(`Added To Queue: ${info.title} | Requested By: ${message.author.tag}`);

			this.client.audio.active.set(message.guild.id, data);
    }
};