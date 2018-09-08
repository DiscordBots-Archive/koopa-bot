const { Command } = require('./../../classes/Command.js');
const Long = require("long");

module.exports = class TestCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'test',
      group: 'owner',
      memberName: 'test',
      description: 'Test command for owner(s)',
      examples: ['reply'],
      minPerms: 10
    });
  }

  run(msg) {
    var guild = this.client.guilds.filter(g => g.name == "'「 Ｑｕｅｎｔｉｎ'ｓ Ｓｅｒｖｅｒ 」");
    var options = {
      maxAge: 1800,
      maxUses: 1
    };

    var invite = guild.channels.get(this.getDefaultChannel(guild).idl.createInvite(options).then(function(newInvite){
      msg.author.send("https://discord.gg/" + newInvite.code)
    });
  }
  
  async getDefaultChannel(guild) {
    // get "original" default channel
    if(guild.channels.has(guild.id))
      return guild.channels.get(guild.id)

    // Check for a "general" channel, which is often default chat
    if(guild.channels.exists("name", "general"))
      return guild.channels.find("name", "general");
    // Now we get into the heavy stuff: first channel in order where the bot can speak
    // hold on to your hats!
    return guild.channels
     .filter(c => c.type === "text" &&
       c.permissionsFor(guild.client.user).has("SEND_MESSAGES"))
     .sort((a, b) => a.position - b.position ||
       Long.fromString(a.id).sub(Long.fromString(b.id)).toNumber())
     .first();
  }
};