const { Command } = require('discord.js-commando');

module.exports = class ReplyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'cleanup',
      group: 'level',
      memberName: 'cleanup',
      description: 'Cleans up the `points` table from inactive or non-in-server users',
      examples: ['cleanup'],
      minPerm: 10
    });
  }
  
  hasPermission(msg) {
    if (!this.client.isOwner(msg.author)) return 'This is a table clearing utility. Honestly, I don\'t know how you would benefit from running this.';
    return true;
  }

  run(message) {
    // Let's clean up the database of all "old" users, and those who haven't been around for... say a month.
    // This will require you to add the following in the points code above: client.points.setProp(key, "lastSeen", new Date());

    // Get a filtered list (for this guild only).
    const filtered = this.client.points.filter( p => p.guild === message.guild.id );

    // We then filter it again (ok we could just do this one, but for clarity's sake...)
    // So we get only users that haven't been online for a month, or are no longer in the guild.
    const rightNow = new Date();
    const toRemove = filtered.filter(data => {
      return !message.guild.members.has(data.user) || rightNow - 2592000000 > data.lastSeen;
    });

    toRemove.forEach(data => {
      this.client.points.delete(`${message.guild.id}-${data.user}`);
    });

    message.channel.send(`I've cleaned up ${this.client.plural(toRemove.size, "old fart")}.`);
  }
};