const { Command } = require('./../../classes/Command.js');

module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'perms',
            group: 'util',
            memberName: 'perms',
            description: 'Tells you your permission level.',
            examples: ['perms'],
            args: [
              {
                key: "membre",
                label: "member",
                prompt: "who do you want me to stalk? :eyes:",
                default: "",
                type: "member"
              }
            ],
        });
    }

    async run(msg, { membre }) {
      if (!membre) {
        var member = await msg.guild.members.get(msg.author.id);
      } else {
        var member = membre;
      }
      var lvl = this.client.util.getPermLevel(member)
      const embed = this.client.util.embed()
        .setTitle(membre ? membre.displayName + "'s permission level" : "Your permission level")
        .addField("Level", lvl, true).addField("Level name", this.client.util.getPerm(lvl), true);
      return msg.embed(embed);
      // return msg.say(`Your permission level is ${this.client.util.getPermLevel(msg.member)} out of 10`);
    }
};