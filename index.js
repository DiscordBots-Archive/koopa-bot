const { CommandoClient, SQLiteProvider } = require("discord.js-commando");
const { RichEmbed } = require("discord.js");
const sqlite = require('sqlite');
const path = require('path');
const YTDL = require("ytdl-core");
var ytdl = YTDL;
const SQLite = require("better-sqlite3");
const sql = new SQLite('./scores.sqlite');
const warns = new SQLite("./warns.sqlite");
const quotes = new SQLite("./quotes.sqlite");

//sqlite.open(path.join(__dirname, 'score.sqlite'));

// Stayin' alive
const http = require('http');
const express = require('express');
const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

// Set up the client
const client = new CommandoClient({
    commandPrefix: '!',
    unknownCommandResponse: false,
    owner: '280399026749440000',
    disableEveryone: true
});

sqlite.open(path.join(__dirname, "settings.sqlite3")).then((db) => {
    client.setProvider(new SQLiteProvider(db));
});

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['group1', 'Mario Modding'],
        ["roles", "Selfroles"],
        ["admin", "Administration"],
        ["owner", "Owner Only"],
        ["audio", "Audio & Music (HUGE shoutout to NightYoshi370#5597 for his help)"],
        ["util", "Utilities"],
        ["level", "Levelling System"]
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerTypesIn(path.join(__dirname, 'types'))
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.on('guildMemberAdd', member => {
  if (member.user.bot) return;
	var welcomechannel = member.guild.channels.find('name', 'general-talk');
	if (!welcomechannel) return;

	var embed = new RichEmbed()
    .setThumbnail(member.guild.iconURL)
		.setColor("#B30000")
		.setTitle(`Welcome to Mario Modding, ${member.user.username}`)
		.setDescription("Mario Modding is the board where you can talk about, well, Mario modding")
		.addField("Website", "http://mario-modding.co.nf", true)
		.setFooter(`Read #rules before starting`);

	welcomechannel.send(embed);
});

client.on('ready', () => {
    console.log('Logged in!');
    client.user.setActivity('http://mario-modding.co.nf', { type: "WATCHING" });
  
  // Set up the SQL points database
  // Check if the table "points" exists.
  const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'scores';").get();
  if (!table['count(*)']) {
    // If the table isn't there, create it and setup the database correctly.
    sql.prepare("CREATE TABLE scores (id TEXT PRIMARY KEY, user TEXT, guild TEXT, points INTEGER, level INTEGER);").run();
    // Ensure that the "id" row is always unique and indexed.
    sql.prepare("CREATE UNIQUE INDEX idx_scores_id ON scores (id);").run();
    sql.pragma("synchronous = 1");
    sql.pragma("journal_mode = wal");
  }

  // And then we have two prepared statements to get and set the score data.
  client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
  client.setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level) VALUES (@id, @user, @guild, @points, @level);");
  client.cleanScore = sql.prepare("DELETE FROM scores WHERE user = ? AND guild = ?");
  
  const warnTable = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'warns';").get();
  if (!warnTable['count(*)']) {
    // If the table isn't there, create it and setup the database correctly.
    warns.prepare("CREATE TABLE IF NOT EXISTS warns (userId TEXT, reason TEXT, moderator TEXT, time TEXT);").run();
    // Ensure that the "id" row is always unique and indexed.
    // warns.prepare("CREATE UNIQUE INDEX idx_scores_id ON scores (id);").run();
    warns.pragma("synchronous = 1");
    warns.pragma("journal_mode = wal");
  }
  client.warns.get = warns.prepare("SELECT * FROM warns WHERE userId = ?");
  client.warns.set = warns.prepare("INSERT INTO warns (userId, reason, moderator, time) VALUES (@id, @reason, @moderator, @time)");
});

client.on("message", message => {
  if (message.author.bot) return;
  // client.dispatcher.handleMessage(message).catch(err => {client.emit("err", err)});
  
  // client.on(string, function(...args)) refers to Discord.Client,
  // not Discord.js-Commando.CommandoClient
  let score;
  if (message.guild) {
    // if the channel is shitposting, return (we don't want to
    // let people level up by spamming in #shitposting)
    if (message.channel.name =="shitposting") return
    // get score
      score = client.getScore.get(message.author.id, message.guild.id);
      // if the user doesn't have a score, give him
      if (!score) {
        score = {
          id: `${message.guild.id}-${message.author.id}`,
          user: message.author.id,
          guild: message.guild.id,
          points: 0,
          level: 1
        }
      }
      // Increment the score
      score.points++;

      // Calculate the current level through MATH OMG HALP.
      // 1 level is 50 messages
      // 20 mins later = nah changed mah mind
      const curLevel = Math.floor((score.points+100) / 100)

      // Check if the user has leveled up, and let them know if they have
      if(score.level < curLevel) {
        // Level up!
        var embed = new RichEmbed()
          .setAuthor(message.member.displayName, message.author.displayAvatarURL)
          .setColor(message.member.highestRole.color)
          .setTitle("Felicitations!")
          .setDescription("*(sigh)*\n\nYou've leveled UP!")
          .addField("New Level", curLevel)
          .setFooter("Samplasion, why are you doing me this?")
          .setThumbnail(message.author.displayAvatarURL);
        // message.reply(`Felicitations *(sigh)*! You've leveled up to level **${curLevel}**!\nSamplasion, why are you doing me this?`);
        message.channel.send(embed)
        score.level = curLevel;
      }

      // This looks super simple because it's calling upon the prepared statement!
      client.setScore.run(score);

      // return message.reply(`You currently have ${score.points} points and are level ${score.level}! (TEST to see if points work)`);
    }
  /* Backup if /app/commands/level/points.js doesn't work
  if (message.content.startsWith("!points")) {
    var msg = message;
    var member = message.member
      var embed = new RichEmbed()
          .setAuthor(msg.member.displayName, msg.author.displayAvatarURL)
          .setColor(member.highestRole.color)
          .setTitle("Your stats")
          .addField("Points", score.points, true)
          .addField("Level", score.level, true)
  }
  */
});

client.audio = {};
client.audio.active = new Map();
client.audio.play = async (client, active, data) => {
  const playing = client.channels.get(data.queue[0].announceChannel).send(
			`Now Playing: ${data.queue[0].songTitle} | Requested by: ${data.queue[0].requester}`
		);

		const stream = YTDL(data.queue[0].url, { filter: 'audioonly' })
							.on('error', err => {
								console.log('Error occurred when streaming video:', err);
								playing.then(msg => msg.edit(`:x: Couldn't play ${data.queue[0].songTitle}.`));
								client.audio.finish(client, active, this);
							});
		data.dispatcher = await data.connection.playStream(stream)
							.on('error', err => {
								console.log('Error occurred in stream dispatcher:', err);
								client.channels.get(data.queue[0].announceChannel).send(`An error occurred while playing the song: \`${err}\``);
								client.audio.finish(client, active, this)
							});
		data.dispatcher.guildID = data.guildID;

		data.dispatcher.once('end', function() {
			client.audio.finish(client, active, this);
		});
}
client.audio.finish = (client, active, dispatcher) => {
  var fetched = active.get(dispatcher.guildID);
		fetched.queue.shift();
		if(fetched.queue.length > 0) {
			active.set(dispatcher.guildID, fetched);
			client.audio.play(client, active, fetched);
		} else {
			active.delete(dispatcher.guildID);

			var vc = client.guilds.get(dispatcher.guildID).me.voiceChannel;
			if (vc) vc.leave();
		}
}

client.on("messageReactionAdd", async (reaction, user) => {
    console.log("messageReactionAdd");
    const message = reaction.message;
    if (reaction.emoji.name !== '⭐') return;
    //if (message.author.id === user.id) return message.channel.send(`${user}, you cannot star your own messages.`);
    if (message.author.bot) return message.channel.send(`${user}, you cannot star bot messages.`);
    const starChannel = message.guild.channels.find(channel => channel.name == "starboard")
    if (!starChannel) return message.channel.send(`It appears that you do not have a \`starboard\` channel.`); 
    const fetchedMessages = await starChannel.fetchMessages({ limit: 100 });
    const stars = fetchedMessages.find(m => m.embeds[0].footer.text.startsWith('⭐') && m.embeds[0].footer.text.endsWith(message.id));
    if (stars) {
      const star = /^\⭐\s([0-9]{1,3})\s\|\s([0-9]{17,20})/.exec(stars.embeds[0].footer.text);
      const foundStar = stars.embeds[0];
      const image = message.attachments.size > 0 ? await this.extension(reaction, message.attachments.array()[0].url) : '';
      const embed = new RichEmbed()
        .setColor(foundStar.color)
        .setDescription(foundStar.description)
        .setAuthor(message.author.tag, message.author.displayAvatarURL)
        .setTimestamp()
        .setFooter(`⭐ ${parseInt(star[1])+1} | ${message.id}`)
        .setImage(image);
      const starMsg = await starChannel.fetchMessage(stars.id);
      await starMsg.edit({ embed });
    }
    if (!stars) {
      const image = message.attachments.size > 0 ? await this.extension(reaction, message.attachments.array()[0].url) : '';
      if (image === '' && message.cleanContent.length < 1) return message.channel.send(`${user}, you cannot star an empty message.`);
      const embed = new RichEmbed()
        .setColor(15844367)
        .setDescription(message.cleanContent)
        .setAuthor(message.author.tag, message.author.displayAvatarURL)
        .setTimestamp(new Date())
        .setFooter(`⭐ 1 | ${message.id}`)
        .setImage(image);
      await starChannel.send({ embed });
    }
});

client.on("messageReactionRemove", async (reaction, user) => {
    const message = reaction.message;
    // if (message.author.id === user.id) return;
    if (reaction.emoji.name !== '⭐') return;
    const starChannel = message.guild.channels.find(channel => channel.name == "starboard")
    if (!starChannel) return message.channel.send(`It appears that you do not have a \`starboard\` channel.`); 
    const fetchedMessages = await starChannel.fetchMessages({ limit: 100 });
    const stars = fetchedMessages.find(m => m.embeds[0].footer.text.startsWith('⭐') && m.embeds[0].footer.text.endsWith(reaction.message.id));
    if (stars) {
      const star = /^\⭐\s([0-9]{1,3})\s\|\s([0-9]{17,20})/.exec(stars.embeds[0].footer.text);
      const foundStar = stars.embeds[0];
      const image = message.attachments.size > 0 ? await this.extension(reaction, message.attachments.array()[0].url) : '';
      const embed = new RichEmbed()
        .setColor(foundStar.color)
        .setDescription(foundStar.description)
        .setAuthor(message.author.tag, message.author.displayAvatarURL)
        .setTimestamp()
        .setFooter(`⭐ ${parseInt(star[1])-1} | ${message.id}`)
        .setImage(image);
      const starMsg = starChannel.fetchMessage(stars.id);
    await starMsg.edit({ embed });
    if(parseInt(star[1]) - 1 == 0) return starMsg.delete(1000);
    }
});

function extension(reaction, attachment) {
  const imageLink = attachment.split('.');
  const typeOfImage = imageLink[imageLink.length - 1];
  const image = /(jpg|jpeg|png|gif)/gi.test(typeOfImage);
  if (!image) return '';
  return attachment;
}

client.scores = {};
client.scores.table = sql;
client.warns = {};
client.warns.table = warns;
client.quotes = {};
client.quotes.table = quotes;

client.on('messageDelete', async (message) => {
  let logs = message.guild.channels.find('name', 'logs');
  if (message.guild.me.hasPermission('MANAGE_CHANNELS') && !logs && (message.guild.id == "481369156554326023")) {
    message.guild.createChannel('logs', 'text');
  }
  if (message.guild.id == "472214037430534167") logs = message.guild.channels.find('name', 'koopa-logs');
  if (!message.guild.me.hasPermission('MANAGE_CHANNELS') && !logs) { 
    console.log('The logs channel does not exist and tried to create the channel but I am lacking permissions')
  }
  
  const entry = await message.guild.fetchAuditLogs({type: 'MESSAGE_DELETE'}).then(audit => audit.entries.first());
  let user = ""
  let av = ""
  if (entry.extra.channel.id === message.channel.id
      && (entry.target.id === message.author.id)
      && (entry.createdTimestamp > (Date.now() - 5000))
      && (entry.extra.count >= 1)) {
    user = "himself"
    av = entry.executor.displayAvatarURL
  } else { 
    user = message.author.tag
    av = message.author.displayAvatarURL
  }
  // logs.send(`A message was deleted in ${message.channel.name} by ${user}`);
  const embed = new RichEmbed()
        // We set the color to a nice yellow here.
        .setColor(15844367)
        .setTitle(":wastebasket: A message by " + message.author.tag + " was deleted by " + user)
        .setThumbnail(av)
        .setDescription("`" + message.cleanContent + "`") 
        .addField(":blue_book: Channel", `<#${message.channel.id}> (#${message.channel.name})`)
        .addField("🆔 Message ID", message.id)
        .setAuthor(client.user.tag, client.user.displayAvatarURL)
        .setTimestamp(Date.now() - 5000)
        .setFooter(`What a waste!`)
  logs.send(embed);
})

client.on("log", (chn, type, member, executor, reason) => {
  const embed = new RichEmbed()
        .setColor(15844367)
        .setTitle(`${member.user.tag} was ${type}ed`)
        .setThumbnail(member.user.displayAvatarURL)
        .setAuthor(client.user.tag, client.user.displayAvatarURL)
        .setTimestamp(Date.now())
  switch (type) {
    case "kick":
      embed
        .addField(":user: Moderator", `${executor.displayName} (${executor.user.tag})`)
        .addField(":biohazard: Reason", reason = null ? "No reason" : reason)
      break;
    case "ban":
      break;
    default:
      break;
  }
  chn.send(embed);
});

client.warns.log = (member, warner, reason) => {
  return new RichEmbed()
        .setColor(15844367)
        .setTitle(`:warning: ${member.user.tag} was warned`)
        .setThumbnail(member.user.displayAvatarURL)
        .setTimestamp(Date.now())
        .addField(":pencil: Moderator", `<@${warner.user.id}> (${warner.user.tag})`)
        .addField(":biohazard: Reason", reason)
}

client.getDateTime = () => {
	var date = new Date();

	var hour = date.getHours();
	hour = (hour < 10 ? "0" : "") + hour;

	var min  = date.getMinutes();
	min = (min < 10 ? "0" : "") + min;

	var sec  = date.getSeconds();
	sec = (sec < 10 ? "0" : "") + sec;

	var year = date.getFullYear();

	var month = date.getMonth() + 1;
	month = (month < 10 ? "0" : "") + month;

	var day  = date.getDate();
	day = (day < 10 ? "0" : "") + day;

	return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
}

client.login(process.env.TOKEN);