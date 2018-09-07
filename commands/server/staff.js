// const { Command } = require('discord.js-commando');
const { Command } = require('./../../classes/Command.js');

module.exports = class StaffCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'staff',
      group: 'server',
      memberName: 'staff',
      description: 'Shows the staff for the current server',
      examples: ["staff"],
      guildOnly: true
    });
  }

  async run(msg) {
    var client = this.client;
    var member = msg.member;
    
    const guildConf = this.client.settings.ensure(msg.guild.id, this.client.defaultSettings);
    var mod   = client.isId(guildConf.modRole) ? guildConf.modRole : member.guild.roles.filter(r => r.name == guildConf.modRole).map(r => r.id)[0];
    var admin = client.isId(guildConf.adminRole) ? guildConf.adminRole : member.guild.roles.filter(r => r.name == guildConf.adminRole).map(r => r.id)[0];
    var owner = client.isId(guildConf.ownerRole) ? guildConf.ownerRole : member.guild.roles.filter(r => r.name == guildConf.ownerRole).map(r => r.id)[0];
    
    var owners = await msg.guild.members.filter(m => m.roles.has(owner) || m.guild.ownerID === m.id).map(m => m.user.tag);
    var admins = await msg.guild.members.filter(m => m.roles.has(admin)).map(m => m.user.tag);
    var mods = await msg.guild.members.filter(m => m.roles.has(mod)).map(m => m.user.tag);
    var staffLine = guildConf.staffLine ? `\n\n${guildConf.staffLine}` : "";
    let embed = this.client.util.embed()
      .setTitle(`${msg.guild.name} Staff`)
      .setDescription(`This is the staff for ${msg.guild.name}. If you think you should be here, tell ${owners.join(", ")}${!owners.isEmpty() && !owners.includes("Samplasion#7901") ? " or Samplasion#7901" : ""}${owners.isEmpty() && !owners.includes("Samplasion#7901") ? " Samplasion#7901" : ""}.${staffLine}`)
      .addField("Owner" + (owners.length == 1 ? "" : "s"), !owners.isEmpty() ? owners.join("\n") : "No owners.")
      .addField("Admin" + (admins.length == 1 ? "" : "s"), !admins.isEmpty() ? admins.join("\n") : "No admins.")
      .addField("Moderator" + (mods.length == 1 ? "" : "s"), !mods.isEmpty() ? mods.join("\n") : "No moderators.");
    msg.embed(embed);
  }
};

Array.prototype.isEmpty = function() {
  return this.length == 0 || this === undefined
}