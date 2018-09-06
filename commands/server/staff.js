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
    var owners = msg.guild.members.filter(m => m.roles.has(guildConf.ownerRole)).map(m => m.user.tag)
    var pwners = owners.join(", ")
    let embed = this.client.util.embed()
      .setTitle(`${msg.guild.name} Staff`)
      .setDescription(`This is the staff for ${msg.guild.name}. If you think you should be here, tell ${pwners} or Samplasion#7901.`)
      .addField("Owner" + (owners.length > 1 ))
      .addField()
      .addField();
  }
};