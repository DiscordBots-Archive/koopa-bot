const { Command } = require('discord.js-commando');
const YTDL = require("ytdl-core");
const ytSearch = require('yt-search');

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
				      	prompt: 'if you don\'t give me a link, how could I know what music do you want to hear?',
				      	type: 'string'
				      }
			      ]
        });
    }

    async run(message, { link }) {
      var voiceChannel = await message.member.voiceChannel;
			if (!voiceChannel) return message.reply("you're not in a voice channel, *are ya*? :eyes:\nConnect to a voice channel!");

			var permissions = await voiceChannel.permissionsFor(message.client.user);
			if (!permissions.has('CONNECT')) return message.reply("I can't join voice channels. Make sure I have the proper permissions.").catch(console.error);
			if (!permissions.has('SPEAK'))	 return message.reply("I can't speak in this server. Make sure I have the proper permissions.").catch(console.error);

      // commando logic
			// if (!args[0])	return message.reply("Please specify a link");

			let validate = await YTDL.validateURL(link);
			if(!validate) {
        return message.reply("please input a valid URL following the command");
        ytSearch(link, (e, r) => {
          if (e) console.error(e);
          link = "https://youtube.com" + r.videos[0].url
        });
      }

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
			else message.channel.send(`Added to Queue: ${info.title} | Requested by: ${message.author.tag}`);

			this.client.audio.active.set(message.guild.id, data);
    }
};