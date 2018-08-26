const { CommandoClient, SQLiteProvider } = require("discord.js-commando");
const { RichEmbed } = require("discord.js");
//const sqlite = require('sqlite');
const path = require('path');
const ytdl = require("ytdl-core");

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

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['group1', 'Our First Command Group'],
        ["roles", "Roles"],
        ["admin", "Administration"],
        ["owner", "Owner Only"],
        ["audio", "Audio & Music"]
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.on('guildMemberAdd', member => {
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

client.on("messageReactionAdd", async (reaction, user) => {
    const message = reaction.message;
     // This is the first check where we check to see if the reaction is not the unicode star emote.
    if (reaction.emoji.name !== '⭐' || reaction.emoji.name !== "star") return message.send("not a star");
    // This is our final check, checking to see if message was sent by a bot.
    if (message.author.bot) return message.channel.send(`${user}, you cannot star bot messages.`);
    // Here we get the starboard channel from the guilds settings. 
    const starChannel = message.guild.channels.find("name", "starboard");
    // If there's no starboard channel, we stop the event from running any further, and tell them that they don't have a starboard channel.
    if (!starChannel) return message.channel.send(`It appears that you do not have a \`"starboard"\` channel.`); 
    // Here we fetch 100 messages from the starboard channel.
    const fetch = await starChannel.fetchMessages({ limit: 100 }); 
    // We check the messages within the fetch object to see if the message that was reacted to is already a message in the starboard,
    const stars = fetch.find(m => m.embeds[0].footer.text.startsWith('⭐') && m.embeds[0].footer.text.endsWith(message.id)); 
    // Now we setup an if statement for if the message is found within the starboard.
    if (stars) {
      // Regex to check how many stars the embed has.
      const star = /^\⭐\s([0-9]{1,3})\s\|\s([0-9]{17,20})/.exec(stars.embeds[0].footer.text);
      // A variable that allows us to use the color of the pre-existing embed.
      const foundStar = stars.embeds[0];
      // We use the this.extension function to see if there is anything attached to the message.
      const image = message.attachments.size > 0 ? extension(reaction, message.attachments.array()[0].url) : ''; 
      const embed = new RichEmbed()
        .setColor(foundStar.color)
        .setDescription(foundStar.description)
        .setAuthor(message.author.tag, message.author.displayAvatarURL)
        .setTimestamp()
        .setFooter(`⭐ ${parseInt(star[1])+1} | ${message.id}`)
        .setImage(image);
      // We fetch the ID of the message already on the starboard.
      const starMsg = await starChannel.fetchMessage(stars.id);
      // And now we edit the message with the new embed!
      await starMsg.edit({ embed }); 
    }
    // Now we use an if statement for if a message isn't found in the starboard for the message.
    if (!stars) {
      // We use the this.extension function to see if there is anything attached to the message.
      const image = message.attachments.size > 0 ? await extension(reaction, message.attachments.array()[0].url) : ''; 
      // If the message is empty, we don't allow the user to star the message.
      if (image === '' && message.cleanContent.length < 1) return message.channel.send(`${user}, you cannot star an empty message.`); 
      const embed = new RichEmbed()
        // We set the color to a nice yellow here.
        .setColor(15844367)
        // Here we use cleanContent, which replaces all mentions in the message with their
        // equivalent text. For example, an @everyone ping will just display as @everyone, without tagging you!
        // At the date of this edit (09/06/18) embeds do not mention yet.
        // But nothing is stopping Discord from enabling mentions from embeds in a future update.
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
    if (message.author.id === user.id) return;
    if (reaction.emoji.name !== '⭐') return;
    const { starboardChannel } = this.client.settings.get(message.guild.id);
    const starChannel = message.guild.channels.find(channel => channel.name == starboardChannel)
    if (!starChannel) return message.channel.send(`It appears that you do not have a \`${starboardChannel}\` channel.`); 
    const fetchedMessages = await starChannel.fetchMessages({ limit: 100 });
    const stars = fetchedMessages.find(m => m.embeds[0].footer.text.startsWith('⭐') && m.embeds[0].footer.text.endsWith(reaction.message.id));
    if (stars) {
      const star = /^\⭐\s([0-9]{1,3})\s\|\s([0-9]{17,20})/.exec(stars.embeds[0].footer.text);
      const foundStar = stars.embeds[0];
      const image = message.attachments.size > 0 ? await extension(reaction, message.attachments.array()[0].url) : '';
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

client.on('ready', () => {
    console.log('Logged in!');
    client.user.setActivity('Mario Modding - YAMMS | http://mario-modding.co.nf');
});

client.audio = {};
client.audio.servers = {};
client.audio.play = (connection, message) => {
  var server = client.audio.servers[message.guild.id];
  
  server.dispatcher = connection.playStream(ytdl(server.queue[0], { filter: "audioonly" }));
  
  server.queue.shift();
  
  server.dispatcher.on("end", () => {
    if (server.queue[0]) client.audio.play(connection, message)
    else connection.disconnect();
  });
}

client.login(process.env.TOKEN);