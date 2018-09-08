const { RichEmbed } = require("discord.js");

module.exports = (client) => {
  client.util.getPermLevel = (member) => {
    let guildConf;
    if (member.guild) {
      guildConf = client.settings.ensure(member.guild.id, client.defaultSettings);
    } else {
      guildConf = client.defaultSettings;
    }
    
    var perm = 0
    
    // needed
    var mod   = client.mod(client, member.guild)
    var admin = client.admin(client, member.guild)
    var owner = client.owner(client, member.guild)
    
    if (member.user.bot) return 0;
    if (client.isOwner(member.user)) return perm = 10
    else if (member.guild.ownerId == member.id || member.roles.has(owner)) return perm = 4
    else if (member.roles.has(admin)) return perm = 3
    else if (member.roles.has(mod)) return perm = 2
    else perm = 1;
    return perm;
  }
  const lvls = ["Bot", "Normal user", "Server moderator", "Server admin", "Server owner",
                "TellSamplasionForDetailsCauseIDontHaveAGoodUseForRole5 user",
                "Bot helper", "Bot support", "Bot moderator", "Bot admin", "Bot owner"];
  client.util.getPerm = (lvl) => lvls[lvl];
  
  client.isId = str => /^[0-9]{17,20}$/i.test(str)
  
  client.mod = (client, guild) => {
    var guildConf = client.settings.ensure(guild.id, client.defaultSettings);
    return client.isId(guildConf.modRole) ? guildConf.modRole : guild.roles.filter(r => r.name == guildConf.modRole).map(r => r.id)[0];
  }

  client.admin = (client, guild) => {
    var guildConf = client.settings.ensure(guild.id, client.defaultSettings);
    return client.isId(guildConf.adminRole) ? guildConf.adminRole : guild.roles.filter(r => r.name == guildConf.adminRole).map(r => r.id)[0];
  }

  client.owner = (client, guild) => {
    var guildConf = client.settings.ensure(guild.id, client.defaultSettings);
    return client.isId(guildConf.ownerRole) ? guildConf.ownerRole : guild.roles.filter(r => r.name == guildConf.ownerRole).map(r => r.id)[0];
  }
  
  client.isGuildOwner = (member) => {
    return member.roles.has(client.owner(client, member.guild));
  }
}