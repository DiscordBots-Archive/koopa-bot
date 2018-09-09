module.exports = async (client, member) => {
  if (member.user.bot) return;
  
  // First, ensure the settings exist
  client.settings.ensure(member.guild.id, client.defaultSettings);
  
  let automod = client.settings.get(member.guild.id, "automod");
  if (automod) {
    // client.ban(client, member, "", member.guild.members.get(member.guild.ownerID));
  }
  
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
 
    var embed = new client.util.embed()
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
}

function ban(client, member, reason, moderator, days = null) {
  if (days) {
    member.ban({days: days, reason: reason});
  } else {
    member.ban(reason);
  }
  let logs, modlogs;
  logs = member.guild.channels
    .find("name", client.settings.get(member.guild.id, "logChannel"))
  modlogs = member.guild.channels
    .find("name", client.settings.get(member.guild.id, "modLogChannel"))
 
	if(logs)
		logs.send(`${member.user.tag} **[${member.id}]** was ${days ? "banned for "+days+" days" : "permanently banned"} by ${moderator.user.tag} **[${moderator.user.id}]** for reason: \`${reason}\``);
  
	if(modlogs) {
		let embed = client.util.embed()
        .setColor(0xe00b0b)
        .setTitle(`:skull_crossbones: ${member.user.tag} was banned`)
        .setThumbnail(member.user.displayAvatarURL)
        .setTimestamp(Date.now())
        .addField(":pencil: Moderator", `<@${moderator.user.id}> [${moderator.user.tag}]`)
        .addField(":biohazard: Reason", reason)
        .addField(":calendar_spiral: Ban duration", days ? days + " days" : "Forever")
        .setFooter("He really deserved it!")
 
		modlogs.send(embed);
	}
  
  member.send(`You **[${member.id}]** were ${days ? "banned for "+days+" days" : "permanently banned"} from ${member.guild.name} by ${moderator.user.tag} **[${moderator.user.id}]**. Reason: \`${reason}\``);
}

const regs = { // I tried :D
  invite: /http(s)?:\/\/discord.gg\/\w{1,15}/i,
  pls: /pls\s+add\s+\w\(tag\)\s+\w\d{4}/i
}