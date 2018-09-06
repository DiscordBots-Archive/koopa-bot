const { CommandoClient, SQLiteProvider } = require("discord.js-commando");
const { RichEmbed } = require("discord.js");
const { range, random } = require("including-range-array")
const sqlite = require('sqlite');
const path = require('path');
const YTDL = require("ytdl-core");
const inhibitor = require("./point-inhibitor");
var ytdl = YTDL;
const SQLite = require("better-sqlite3");
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

const Enmap = require('enmap');

client.points = new Enmap({name: "points"});

client.settings = new Enmap({
  name: "settings",
  fetchAll: false,
  autoFetch: true,
  cloneLevel: 'deep'
});

// Just setting up a default configuration object here, to have something to insert.
const defaultSettings = {
  logChannel: "logs",
  modLogChannel: "modlogs",
  modRole: "<modroleid>",
  adminRole: "<adminroleid>",
  ownerRole: "<ownerroleid>",
  welcomeChannel: "welcome",
  welcomeEnabled: false,
  welcomeMessage: "Say hello to {{user}}, everyone in {{guild}}!"
}

client.defaultSettings = defaultSettings;

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ["roles", "Selfroles (Mario Modding-only)"],
        ["admin", "Administration"],
        ["owner", "Owner Only"],
        ["audio", "Audio & Music (HUGE thanks to NightYoshi370#5597 for his help)"],
        ["util", "Utilities"],
        ["level", "Levelling System"],
        ["fun", "Fun"]
    ])
    .registerDefaultGroups()
    .registerDefaultCommands({
        eval: false,
        help: false
    })
    .registerTypesIn(path.join(__dirname, 'types'))
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.on('guildMemberAdd', async member => {
  if (member.user.bot) return;
  
  // First, ensure the settings exist
  client.settings.ensure(member.guild.id, defaultSettings);
  
  // Then, get the welcome message using get: 
  let welcomeMessage = client.settings.get(member.guild.id, "welcomeMessage");
  
  // Our welcome message has a bit of a placeholder, let's fix that:
  welcomeMessage = welcomeMessage.replace("{{user}}", member.user.tag)
    .replace("{{guild}}", member.guild.name)
  
  // we'll send to the welcome channel.
  if (client.settings.get(member.guild.id, "welcomeEnabled")) member.guild.channels
    .find("name", client.settings.get(member.guild.id, "welcomeChannel"))
    .send(welcomeMessage)
    .catch(console.error);
  
  // YAMMS-only stuff
  if (member.guild.id == "481369156554326023") {
    var welcomechannel = member.guild.channels.find('name', 'general-talk');
    if (!welcomechannel) return;

    var role = await member.guild.roles.find(r => r.name == "Green Toad");
    if (role) member.addRole(role).catch(e => console.error(e));

    var embed = new RichEmbed()
      .setThumbnail(member.guild.iconURL)
      .setColor("#B30000")
      .setTitle(`Welcome to Mario Modding, ${member.user.username}`)
      .setDescription("Mario Modding is a board where you can talk about all sorts of Mario games modding, from the first apparition of Mario in Donkey Kong to the latest entry Super Mario Odyssey")
      .addField("Website", "http://mario-modding.co.nf", true)
      .setThumbnail("http://mario-modding.co.nf/img/favicon.ico")
      .setFooter(`Read #rules before starting`);

    welcomechannel.send(embed);
  }
  
  const loge = client.util.embed()
    .setTitle("<:mario:485883525594087454> User Joined")
    .addField("<:smwmario:486608176356261889> User", member.user.tag, true)
    .addField(":clock: Joined at", member.joinedAt, true)
  member.guild.channels
    .find("name", client.settings.get(member.guild.id, "modLogChannel"))
    .send(loge)
    .catch(console.error);
});

client.on("guildDelete", guild => {
  // When the bot leaves or is kicked, delete settings to prevent stale entries.
  client.settings.delete(guild.id);
});

client.on('ready', () => {
    console.log('Logged in!');
    client.user.setActivity('http://mario-modding.co.nf', { type: "WATCHING" });
  
  const warnTable = warns.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'warns';").get();
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

function getEXP() {
  return random(5, 2);
}

client.on("message", message => {
  if (message.author.bot) return;
  // client.dispatcher.handleMessage(message).catch(err => {client.emit("err", err)});
  
  // client.on(string, function(...args)) refers to Discord.Client,
  // not Discord.js-Commando.CommandoClient
  
  if (message.guild) {
    client.defaultPoints = {
      user: message.author.id,
      guild: message.guild.id,
      points: 0,
      level: 1
    }
    // if the channel is the guild's spam channel, return (we don't
    // want to let people level up by spamming in the spam channel)
    if (inhibitor.inhibite(client, message)) return;
    
    let key = `${message.guild.id}-${message.author.id}`
    client.points.ensure(key, client.defaultPoints);
    
    client.points.math(key, "+", getEXP(), "points")
    
    const curLevel = Math.floor((client.points.get(key, "points")+100) / 100)
    
    if (client.points.get(key, "level") < curLevel) {
      // Level up!
      var embed = client.util.embed()
        .setAuthor(message.member.displayName, message.author.displayAvatarURL)
        .setColor(message.member.highestRole.color)
        .setTitle("Felicitations!")
        .setDescription("*(sigh)*\n\nYou've leveled UP!")
        .addField("New Level", curLevel)
        .setFooter("Samplasion, why are you doing me this?")
        .setThumbnail(message.author.displayAvatarURL);
      // message.reply(`Felicitations *(sigh)*! You've leveled up to level **${curLevel}**!\nSamplasion, why are you doing me this?`);
      message.channel.send(embed)
      client.points.set(key, curLevel, "level");
    }
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
  var mario = client.emojis.get("486608176356261889")
  var note = client.emojis.get("486620721930436609")
  let embed = client.util.embed()
    .setTitle("Music Queue")
    .setDescription(`${note} Now Playing: **${data.queue[0].songTitle}** \nDuration: \`[${data.queue[0].length}]\``)
    .addField(mario + " Requester", data.queue[0].requester)
  //const playing = client.channels.get(data.queue[0].announceChannel).send(
	//	`Now Playing: **${data.queue[0].songTitle}** \`[${data.queue[0].length}]\` | Requested by: ${data.queue[0].requester}`
	//);
  const playing = client.channels.get(data.queue[0].announceChannel).send(
		embed
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

client.warns = {};
client.warns.table = warns;

client.on('messageDelete', async (message) => {
  var msg = message;
  let logs, modlogs;
  /*if (msg.guild.id == "481369156554326023") {
    logs = msg.guild.channels.find("name", "logs");
    modlogs = msg.guild.channels.find("name", "modlogs");
  } else if (msg.guild.id== "472214037430534167") {
    modlogs = msg.guild.channels.find("name", "koopa-logs");
    logs = msg.guild.channels.find("name", "samplasion-development");
  }*/
  logs = message.guild.channels
    .find("name", client.settings.get(message.guild.id, "logChannel"))
  modlogs = message.guild.channels
    .find("name", client.settings.get(message.guild.id, "modLogChannel"))
  
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
  var found = false, swea = ""
  for (var swear in spam.swears) {
    if (message.content.toLowerCase().includes(swear)) {
      found = true
      swea = swear
    }
  }
  
  //if (found) {
  //  warn(message.member, "Swearing (" + swea + ")", message.guild.members.get(client.user.id), message);
  //  message.reply("no swearing here!");
  //}
};
client.on("message", message => automod(message));

function catchAndSend(error, message) {
  console.error(error)
  message.reply(`an error occurred: \`${error}\`\nTell Samplasion#7901 for details`);
}

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
  logs = message.guild.channels
    .find("name", client.settings.get(message.guild.id, "logChannel"))
  modlogs = message.guild.channels
    .find("name", client.settings.get(message.guild.id, "modLogChannel"))

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
    member.ban({days: days, reason: reason}).catch(e=> catchAndSend(e, message));
  } else {
    member.ban(reason).catch(e=> catchAndSend(e, message));
  }
  let logs, modlogs;
  logs = message.guild.channels
    .find("name", client.settings.get(message.guild.id, "logChannel"))
  modlogs = message.guild.channels
    .find("name", client.settings.get(message.guild.id, "modLogChannel"))

	if(logs)
		logs.send(`${member.user.tag} **[${member.id}]** was ${days ? "banned for "+days+" days" : "permanently banned"} by ${msg.author.tag} **[${msg.author.id}]** for reason: \`${reason}\` in ${msg.channel}`);
  
	if(modlogs) {
		let embed = client.util.embed()
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

async function mute(member, reason, moderator, message) {
  var mutedRole = await message.guild.roles.find('name', "Muted").catch(e=> catchAndSend(e, message));
  if(message.member.roles.has()) {
		message.member.removeRole(mutedRole);
	} else {
		message.member.addRole(mutedRole);
	}
  let logs, modlogs;
  logs = message.guild.channels
    .find("name", client.settings.get(message.guild.id, "logChannel"))
  modlogs = message.guild.channels
    .find("name", client.settings.get(message.guild.id, "modLogChannel"))

	if(logs)
		logs.send(`${member.user.tag} **[${member.user.id}]** was muted by ${moderator.user.tag} **[${moderator.user.id}]** in ${message.channel} **[${message.channel.id}]**. Reason: \`${reason}\``);

	if(modlogs) {
		var embed = client.util.embed(false)
      .setTitle(`:warning: ${member.user.tag} was muted`)
      .setThumbnail(member.user.displayAvatarURL)
      .setTimestamp(Date.now())
      .addField(":pencil: Moderator", `<@${moderator.id}> (${moderator.user.tag})`)
      .addField(":biohazard: Reason", reason)

		modlogs.send(embed);
	}
  
  // member.send(`You **[${member.id}]** were warned by ${moderator.user.tag} **[${moderator.user.id}]** in ${msg.guild.name}. Reason: \`${reason}\``);
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
    if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
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

/*
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
    }).catch(console.error);
});
*/

client.login(process.env.TOKEN);