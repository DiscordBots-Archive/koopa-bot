function getModRole(client, msg) {
  var guildConf;
  if (msg.guild) {
    guildConf = client.settings.ensure(msg.guild.id, client.defaultSettings);
  } else {
    guildConf = client.defaultSettings;
  }
  var mod = client.isId(guildConf.modRole) ? guildConf.modRole : msg.guild.roles.filter(r => r.name == guildConf.modRole).map(r => r.id)[0];
  var admin = client.isId(guildConf.adminRole) ? guildConf.adminRole : msg.guild.roles.filter(r => r.name == guildConf.adminRole).map(r => r.id)[0];
  var owner = client.isId(guildConf.ownerRole) ? guildConf.ownerRole : msg.guild.roles.filter(r => r.name == guildConf.ownerRole).map(r => r.id)[0];
}

function getAdminRole(client, msg) {
  var guildConf;
  if (msg.guild) {
    guildConf = client.settings.ensure(msg.guild.id, client.defaultSettings);
  } else {
    guildConf = client.defaultSettings;
  }
  var mod = client.isId(guildConf.modRole) ? guildConf.modRole : msg.guild.roles.filter(r => r.name == guildConf.modRole).map(r => r.id)[0];
  var admin = client.isId(guildConf.adminRole) ? guildConf.adminRole : msg.guild.roles.filter(r => r.name == guildConf.adminRole).map(r => r.id)[0];
  var owner = client.isId(guildConf.ownerRole) ? guildConf.ownerRole : msg.guild.roles.filter(r => r.name == guildConf.ownerRole).map(r => r.id)[0];
}

function getOwnerRole(client, msg) {
  var guildConf;
  if (msg.guild) {
    guildConf = client.settings.ensure(msg.guild.id, client.defaultSettings);
  } else {
    guildConf = client.defaultSettings;
  }
  var mod = client.isId(guildConf.modRole) ? guildConf.modRole : msg.guild.roles.filter(r => r.name == guildConf.modRole).map(r => r.id)[0];
  var admin = client.isId(guildConf.adminRole) ? guildConf.adminRole : msg.guild.roles.filter(r => r.name == guildConf.adminRole).map(r => r.id)[0];
  var owner = client.isId(guildConf.ownerRole) ? guildConf.ownerRole : msg.guild.roles.filter(r => r.name == guildConf.ownerRole).map(r => r.id)[0];
}