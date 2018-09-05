const Commando = require("discord.js-commando");

class Command extends Commando.Command {
  constructor(client, info) {
		super(client, info);
    
    this.minPerm = info.minPerm || 1;
    // this.adminOnly = info.adminOnly || this.minPerm >= 3;
    // this.modOnly = info.modOnly || this.minPerm >= 2;
	}
  
  hasPermission(msg, ownerOverride = true) {/*
    if (this.minPerm >= 3) {
      return this.client.util.getPermLevel(msg.member) >= 3;
    } else if (this.minPerm >= 2) {
      return this.client.util.getPermLevel(msg.member) >= 2;
    }
    else super.hasPermission(msg, ownerOverride)
    */
    if (msg.channel) return (this.minPerm <= this.client.util.getPermLevel(msg.member));
    else if (this.client.isOwner(msg.author)) return true
    else super.hasPermission(msg, ownerOverride)
  }
}

module.exports = {
  Command
}