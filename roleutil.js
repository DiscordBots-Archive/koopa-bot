function mod(client, guild) {
  var guildConf = client.settings.ensure(guild.id, client.defaultSettings);
  return client.isId(guildConf.modRole) ? guildConf.modRole : guild.roles.filter(r => r.name == guildConf.modRole).map(r => r.id)[0];
}

function admin(client, guild) {
  var guildConf = client.settings.ensure(guild.id, client.defaultSettings);
  return client.isId(guildConf.adminRole) ? guildConf.adminRole : guild.roles.filter(r => r.name == guildConf.adminRole).map(r => r.id)[0];
}

function owner(client, guild) {
  var guildConf = client.settings.ensure(guild.id, client.defaultSettings);
  return client.isId(guildConf.ownerRole) ? guildConf.ownerRole : guild.roles.filter(r => r.name == guildConf.ownerRole).map(r => r.id)[0];
}

module.exports = {
  owner,
  admin,
  mod
}