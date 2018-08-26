const { CommandoClient } = require("discord.js-commando");
const { RichEmbed } = require("discord.js");
const path = require('path');

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
        ["admin", "Administration"]
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

client.on('ready', () => {
    console.log('Logged in!');
    client.user.setActivity('Mario Modding - YAMMS | http://mario-modding.co.nf');
});

client.login(process.env.TOKEN);