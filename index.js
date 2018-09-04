const { CommandoClient, SQLiteProvider } = require("discord.js-commando");
const { RichEmbed } = require("discord.js");
const sqlite = require('sqlite');
const path = require('path');
const YTDL = require("ytdl-core");
const inhibitor = require("./point-inhibitor");
var ytdl = YTDL;
const SQLite = require("better-sqlite3");
const sql = new SQLite('./scores.sqlite');
const warns = new SQLite("./warns.sqlite");

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
    invite: "https://invite.gg/modmario",
    disableEveryone: true
});

sqlite.open(path.join(__dirname, "settings.sqlite3")).then((db) => {
    client.setProvider(new SQLiteProvider(db));
});

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['server', 'Mario Modding'],
        ["roles", "Selfroles"],
        ["admin", "Administration"],
        ["owner", "Owner Only"],
        ["audio", "Audio & Music (HUGE thanks to NightYoshi370#5597 for his help)"],
        ["util", "Utilities"],
        ["level", "Levelling System"],
        ["fun", "Fun"]
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerTypesIn(path.join(__dirname, 'types'))
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.on('guildMemberAdd', async member => {
  if (member.user.bot) return;
	var welcomechannel = member.guild.channels.find('name', 'general-talk');
	if (!welcomechannel) return;
  
  var role = await member.guild.roles.find(r => r.name == "Green Toad");
  member.addRole().catch(e => console.error(e));

	var embed = new RichEmbed()
    .setThumbnail(member.guild.iconURL)
		.setColor("#B30000")
		.setTitle(`Welcome to Mario Modding, ${member.user.username}`)
		.setDescription("Mario Modding is a board where you can talk about all sorts of Mario games modding, from the first apparition of Mario in Donkey Kong to the latest entry Super Mario Odyssey")
		.addField("Website", "http://mario-modding.co.nf", true)
    .setThumbnail("http://mario-modding.co.nf/img/favicon.ico")
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
    warns.prepare("CREATE TABLE IF NOT EXISTS warns (userId TEXT, reason TEXT, moderator TEXT, time TEXT, guild TEXT);").run();
    // Ensure that the "id" row is always unique and indexed.
    // warns.prepare("CREATE UNIQUE INDEX idx_warns_id ON warns (id);").run();
    warns.pragma("synchronous = 1");
    warns.pragma("journal_mode = wal");
  }
  client.warns.get = warns.prepare("SELECT * FROM warns WHERE userId = ? AND guild = ?");
  client.warns.set = warns.prepare("INSERT INTO warns (userId, reason, moderator, time, guild) VALUES (@uid, @reason, @moderator, @time, @guild)");
  client.warns.delete = warns.prepare("DELETE FROM warns WHERE userId = ? AND guild = ?");
  client.warns.drop = warns.prepare("DROP TABLE warns");
});

client.on('error', console.error);

client.on("message", message => {
  if (message.author.bot) return;
  // client.dispatcher.handleMessage(message).catch(err => {client.emit("err", err)});
  
  // client.on(string, function(...args)) refers to Discord.Client,
  // not Discord.js-Commando.CommandoClient
  let score;
  if (message.guild) {
    // if the channel is the guild's spam channel, return (we don't
    // want to let people level up by spamming in the spam channel)
    if (inhibitor.inhibite(client, message)) return;
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
		`Now Playing: **${data.queue[0].songTitle}** \`[${data.queue[0].length}]\` | Requested by: ${data.queue[0].requester}`
	);

	const stream = YTDL(data.queue[0].url, { filter: 'audioonly' })
						.on('error', err => {
							console.error('Error occurred when streaming video:', err);
							playing.then(msg => msg.edit(`:x: Couldn't play ${data.queue[0].songTitle}. What a drag!`));
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
    if (message.author.id === user.id) return message.channel.send(`${user}, you cannot star your own messages.`);
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
        .setAuthor(message.author.tag + " in #" + message.channel.name, message.author.displayAvatarURL)
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
        .setAuthor(message.author.tag + " in #" + message.channel.name, message.author.displayAvatarURL)
        .setTimestamp(new Date())
        .setFooter(`⭐ 1 | ${message.id}`)
        .setImage(image);
      await starChannel.send({ embed });
    }
});

client.on("messageReactionRemove", async (reaction, user) => {
    const message = reaction.message;
    if (message.author.id === user.id) return;
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
        .setAuthor(message.author.tag + " in #" + message.channel.name, message.author.displayAvatarURL)
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

client.on('messageDelete', async (message) => {
  var msg = message;
  let logs, modlogs;
  if (msg.guild.id == "481369156554326023") {
    logs = msg.guild.channels.find("name", "logs");
    modlogs = msg.guild.channels.find("name", "modlogs");
  } else if (msg.guild.id== "472214037430534167") {
    modlogs = msg.guild.channels.find("name", "koopa-logs");
    logs = msg.guild.channels.find("name", "samplasion-development");
  }
  
  const entry = await message.guild.fetchAuditLogs({type: 'MESSAGE_DELETE'}).then(audit => audit.entries.first());
  let user = ""
  let av = ""
  if (entry.extra.channel.id === message.channel.id
      && (entry.target.id === message.author.id)
      && (entry.createdTimestamp > (Date.now() - 5000))
      && (entry.extra.count >= 1)) {
    user = entry.executor.tag
    av = entry.executor.displayAvatarURL
  } else { 
    user = "himself"
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
  modlogs.send(embed);
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

require("./util.js")(client);

var spam = {}
spam.stroke = []
spam.repeat = []
spam.swears = ["shit", "fuck", "cunt", "turd", "kys", "kunt", "faggot"]
var automod = async message => {
  if (message.author.bot) return;
    var now = Math.floor(Date.now());
		spam.stroke.push({
			"time": now,
			"author": message.author.id
		});
		spam.repeat.push({
			"message": message.content,
			"author": message.author.id
		});
  
  // Check how many times the same message has been sent.
		var msgMatch = 0;
		for (var i = 0; i < spam.repeat.length; i++) {
			if (spam.repeat[i].message == message.content && (spam.repeat[i].author == message.author.id)) {
				msgMatch++;
			}
		}

		// Check matched count
		if (msgMatch == 10) {
			warn(message.member, 'Sending spam in #'+message.channel.name, message.guild.members.get(client.user.id), message);
			message.reply("spamming isn't allowed");
		} else if (msgMatch == 13) {
      var mod = await message.guild.members.get(client.user.id)
		  ban(message.author, 'Sending spam in #'+message.channel.name, mod, message);
    }

		var matched = 0;

		for (var i = 0; i < spam.stroke.length; i++) {
			if (spam.stroke[i].time > now - 1000) {
				matched++;
				if (matched == 8) {
					warn(message.member, 'Sending spam in #'+message.channel.name, message.guild.members.get(client.user.id), message);
					message.reply("spamming isn't allowed");
				} else if (matched == 11) {
          var mod = await message.guild.members.get(client.user.id)
					ban(message.author, 'Sending spam in #'+message.channel.name, mod, message);
				}
			}

			if (spam.repeat.length >= 200)
				spam.repeat.shift();
		}
  var found = false
  for (var swear in spam.swears)
    if (message.content.toLowerCase().includes(swear))
      found = true
  
  if (found) {
    warn(message.member, "Swearing", message.guild.members.get(client.user.id), message);
    message.reply("no swearing here!");
  }
};
client.on("message", message => automod(message));

function warn(member, reason, moderator, message) {
  var msg = message;
	client.warns.set.run({
    uid: member.user.id,
    reason: reason,
    moderator: msg.author.id,
    time: client.util.getDateTime(),
    guild: msg.guild.id
  });
  let logs, modlogs;
  if (msg.guild.id== "472214037430534167") {
    modlogs = msg.guild.channels.find("name", "koopa-logs");
    logs = msg.guild.channels.find("name", "samplasion-development");
  } else {
    logs = msg.guild.channels.find("name", "logs");
    modlogs = msg.guild.channels.find("name", "modlogs");
  }

	if(logs)
		logs.send(`${member.user.tag} **[${member.user.id}]** was warned by ${moderator.user.tag} **[${moderator.user.id}]** in ${message.channel} **[${message.channel.id}]**. Reason: \`${reason}\``);

	if(modlogs) {
		var embed = client.util.embed() // Master is MessageEmbed
			.setColor(15844367)
      .setTitle(`:warning: ${member.user.tag} was warned`)
      .setThumbnail(member.user.displayAvatarURL)
      .setTimestamp(Date.now())
      .addField(":pencil: Moderator", `<@${moderator.id}> (${moderator.user.tag})`)
      .addField(":biohazard: Reason", reason)

		modlogs.send(embed);
	}
  
  member.send(`You **[${member.id}]** were warned by ${moderator.user.tag} **[${moderator.user.id}]** in ${msg.guild.name}. Reason: \`${reason}\``);
}

function ban(member, reason, moderator, message, days = null) {
  var msg = message;
	if (days) {
    member.ban({days: days, reason: reason});
  } else {
    member.ban(reason);
  }
  let logs, modlogs;
  if (msg.guild.id== "472214037430534167") {
    modlogs = msg.guild.channels.find("name", "koopa-logs");
    logs = msg.guild.channels.find("name", "samplasion-development");
  } else {
    logs = msg.guild.channels.find("name", "logs");
    modlogs = msg.guild.channels.find("name", "modlogs");
  }

	if(logs)
		logs.send(`${member.user.tag} **[${member.id}]** was ${days ? "banned for "+days+" days" : "permanently banned"} by ${msg.author.tag} **[${msg.author.id}]** for reason: \`${reason}\` in ${msg.channel}`);
  
	if(modlogs) {
		let embed = new RichEmbed()
        .setColor(0xe00b0b)
        .setTitle(`:skull_crossbones: ${member.user.tag} was banned`)
        .setThumbnail(member.user.displayAvatarURL)
        .setTimestamp(Date.now())
        .addField(":pencil: Moderator", `<@${msg.author.id}> [${msg.author.tag}]`)
        .addField(":biohazard: Reason", reason)
        .addField(":calendar_spiral: Ban duration", days ? days + " days" : "Forever")
        .setFooter("He really deserved it!")

		modlogs.send(embed);
	}
  
  member.send(`You **[${member.id}]** were ${days ? "banned for "+days+" days" : "permanently banned"} from ${msg.guild.name} by ${moderator.user.tag} **[${moderator.user.id}]**. Reason: \`${reason}\``);
}

client.warn = warn;
client.ban = ban;

const rawEvents = {
    MESSAGE_REACTION_ADD: 'messageReactionAdd',
    MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
    MESSAGE_DELETE: "messageDelete"
};

// Uncached msgRAdd and msgRRemove event
client.on('raw', packet => {
    // We don't want this to run on unrelated packets
    if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE',
         "MESSAGE_DELETE"].includes(packet.t)) return;
    console.log(packet)
    // Grab the channel to check the message from
    const channel = client.channels.get(packet.d.channel_id);
    // There's no need to emit if the message is cached, because the event will fire anyway for that
    if (channel.messages.has(packet.d.message_id)) return;
    // Since we have confirmed the message is not cached, let's fetch it
    channel.fetchMessage(packet.d.message_id).then(message => {
        // Emojis can have identifiers of name:id format, so we have to account for that case as well
        const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
        // This gives us the reaction we need to emit the event properly, in top of the message object
        const reaction = message.reactions.get(emoji);
        // Check which type of event it is before emitting
        if (packet.t === 'MESSAGE_REACTION_ADD') {
            client.emit('messageReactionAdd', reaction, client.users.get(packet.d.user_id));
        }
        if (packet.t === 'MESSAGE_REACTION_REMOVE') {
            client.emit('messageReactionRemove', reaction, client.users.get(packet.d.user_id));
        }
    });
});

// Raw msgDelete
client.on("raw", packet => {
    // We don't want this to run on unrelated packets
    if (!["MESSAGE_DELETE"].includes(packet.t)) return;
    console.log(packet)
    // Grab the channel to check the message from
    const channel = client.channels.get(packet.d.channel_id);
    // There's no need to emit if the message is cached, because the event will fire anyway for that
    if (channel.messages.has(packet.d.message_id)) return;
    // Since we have confirmed the message is not cached, let's fetch it
    channel.fetchMessage(packet.d.id).then(message => {
        // Emojis can have identifiers of name:id format, so we have to account for that case as well
        const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
        // This gives us the reaction we need to emit the event properly, in top of the message object
        // Check which type of event it is before emitting
        if (packet.t === "MESSAGE_DELETE") {
            client.emit("messageDelete", message)
        }
    });
});

client.login(process.env.TOKEN);