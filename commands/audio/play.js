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
            examples: ['play https://youtube.com/someVideo12', "play some music name"],
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

      /*
			let validate = await YTDL.validateURL(link);
			if(!validate) {
        return message.reply("please input a valid URL following the command");
        ytSearch(link, (e, r) => {
          if (e) console.error(e);
          link = "https://youtube.com" + r.videos[0].url
        });
      }
      */
      /* Still thank NightYoshi */
      var lnk = ""
      let validate = await YTDL.validateURL(link);
      if(!validate) {
          await ytSearch(link, (err, res) => {
              if (err) {
                  console.error(err);
                  return message.reply("something went really wrong, tell `NightYoshi370#5597` or `Samplasion#7901`: `"+err+"`");
              }

              let videos = res.videos.slice(0, 10);

              let resp = '';
              for (var i in videos) {
                  resp += `**${parseInt(i)+1}.** ${videos[i].title} \`[${videos[i].timestamp}]\`\n`;
              }

              resp += `\n**Choose a number between** \`1-${videos.length}\` (in 30 seconds the command will be canceled)`;

              message.say(resp);

              /*
              const filter = m => !isNaN(m.content) && parseInt(m.content) < videos.length+1 && parseInt(m.content) > 0;
              const collector = message.channel.createMessageCollector(filter);

              collector.videos = videos;

              collector.once('collect', (m) => {
                link = videos[parseInt(m.content)-1].url;
              });
              */
              message.channel.awaitMessages(response => response.author.id == message.author.id
                                            && !isNaN(response.content)
                                            && parseInt(response.content) <= videos.length
                                            && parseInt(response.content) > 0, {
                max: 1,
                time: 30000,
                errors: ['time'],
              })
              .then(async (collected) => {
                message.channel.send(`Ok, I'll play **${videos[parseInt(collected.first().content)-1].title}** \`[${videos[parseInt(collected.first().content)-1].timestamp}]\``);
                lnk = "https://youtube.com/watch?v=" + videos[parseInt(collected.first().content)-1].videoId.trim();

                this.play(message, lnk)
              })
              .catch(() => {
                message.reply('command canceled!');
              });
          });
      } else {
        lnk = link
        
        this.play(message, lnk)
      }
    }
  
  async play(message, lnk) {
    let info = await YTDL.getInfo(lnk);

			let data = this.client.audio.active.get(message.guild.id) || {};

			if (!data.connection) data.connection = await message.member.voiceChannel.join();
			if (!data.queue) data.queue = [];
			data.guildID = message.guild.id;

			data.queue.push({
				songTitle: info.title,
				requester: message.author.tag,
				url: lnk,
				announceChannel: message.channel.id,
        length: this.getTime(info.length_seconds)
			});

			if (!data.dispatcher)	this.client.audio.play(this.client, this.client.audio.active, data);
			else message.channel.send(`Added to Queue: ${info.title} \`[${this.getTime(info.length_seconds / 60)}]\` | Requested by: ${message.author.tag}`);

			this.client.audio.active.set(message.guild.id, data);
  }
  
  getTime(secs) {
    return `${this.client.util.pad(Math.floor(secs / 60))}:${this.client.util.pad(Math.floor(secs % 60))}`
  }
};