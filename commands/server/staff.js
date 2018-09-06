const { Command } = require('classes/Command.js');

module.exports = class ReplyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'reply',
      group: 'server',
      memberName: 'reply',
      description: 'Replies with a Message.',
      examples: ['reply']
    });
  }

  run(msg) {
    const guildConf = this.client.settings.ensure(msg.guild.id, this.client.defaultSettings);
    var owners = msg.guild.members.filter(m => m.roles.has(guildConf.ownerRole)).map(m => m.user.tag);
    var admins = msg.guild.members.filter(m => m.roles.has(guildConf.adminRole)).map(m => m.user.tag);
    var mods = msg.guild.members.filter(m => m.roles.has(guildConf.modRole)).map(m => m.user.tag);
    let embed = this.client.util.embed()
      .setTitle(`${msg.guild.name} Staff`)
      .setDescription(`This is the staff for ${msg.guild.name}. If you think you should be here, tell ${owners.join(", ")} or Samplasion#7901.`)
      .addField("Owner" + (owners.length > 1 ? "s" : ""), owners ? owners.join("\n") : "No owners.")
      .addField("Admin" + (admins.length > 1 ? "s" : ""), admins ? admins.join("\n") : "No admins.")
      .addField("Moderator" + (mods.length > 1 ? "s" : ""), mods ? mods.join("\n") : "No moderators.");
    msg.embed(embed);
  }
};