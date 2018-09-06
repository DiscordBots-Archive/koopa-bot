// const { Command } = require('discord.js-commando');
const { Command } = require('./../../classes/Command.js');

module.exports = class ReplyCommand extends Command {
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
    const guildConf = this.client.settings.ensure(msg.guild.id, this.client.defaultSettings);
    var owners = await msg.guild.members.filter(m => m.roles.has(guildConf.ownerRole)).map(m => m.user.tag);
    var admins = await msg.guild.members.filter(m => m.roles.has(guildConf.adminRole)).map(m => m.user.tag);
    var mods = await msg.guild.members.filter(m => m.roles.has(guildConf.modRole)).map(m => m.user.tag);
    console.log(`[${owners.length}], [${admins.length}], [${mods.length}]`)
    let embed = this.client.util.embed()
      .setTitle(`${msg.guild.name} Staff`)
      .setDescription(`This is the staff for ${msg.guild.name}. If you think you should be here, tell ${owners.join(", ")} ${!owners.isEmpty() ? "or" : ""} Samplasion#7901.`)
      .addField("Owner" + (owners.length > 1 ? "s" : ""), !owners.isEmpty() ? owners.join("\n") : "No owners.")
      .addField("Admin" + (admins.length > 1 ? "s" : ""), !admins.isEmpty() ? admins.join("\n") : "No admins.")
      .addField("Moderator" + (mods.length > 1 ? "s" : ""), !mods.isEmpty() ? mods.join("\n") : "No moderators.");
    msg.embed(embed);
  }
};

Array.prototype.isEmpty = function() {
  return this.length == 0 || this === undefined
}