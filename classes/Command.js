const Commando = require("discord.js-commando");

class Command extends Commando.Command {
  constructor(client, info) {
		super(client, info);
    
    this.adminOnly = info.adminOnly || false;
    this.modOnly = info.modOnly || false;
	}
  
  hasPermission(msg, ownerOverride = true) {
    if (this.adminOnly) {
      return this.client.isOwner(msg.author) || msg.member.roles.has("481492274333876224")
    } else if (this.modOnly) {
      return this.client.isOwner(msg.author) || msg.member.roles.has("481492274333876224") || msg.member.roles.has("481492388020486171")
    }
    else super.hasPermission(msg, ownerOverride)
	}
}

module.exports = {
  Command
}