const Commando = require("discord.js-commando");

class Command extends Commando.Command {
  constructor(client, info) {
		super(client, info);
    
    this.minPerm = info.minPerm || 1;
    this.adminOnly = info.adminOnly || this.minPerm >= 3;
    this.modOnly = info.modOnly || this.minPerm >= 2;
	}
  
  hasPermission(msg, ownerOverride = true) {
    if (this.adminOnly) {
      return this.client.util.getPermLevel(msg.member) >= 3;
    } else if (this.modOnly) {
      return this.client.util.getPermLevel(msg.member) >= 2;
    }
    else super.hasPermission(msg, ownerOverride)
	}
}

module.exports = {
  Command
}