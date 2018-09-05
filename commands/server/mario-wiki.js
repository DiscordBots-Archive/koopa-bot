const { Command } = require('discord.js-commando');
const { post, get } = require("snekfetch");

module.exports = class ReplyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'mario-wiki',
      group: 'server',
      aliases: ["m-w"],
      memberName: 'mario-wiki',
      description: 'Searches the Mario Wiki.',
      examples: ['mario-wiki Super Mario Bros.'],
      args: [
              {
                key: 'query',
                prompt: 'What text would you like the bot to search on the Mario Wiki?',
                type: 'string',
                validate: text => {
                  if (text.length < 51) return true;
                  return 'message content must be less than or equal to 50 characters.';
                }
              }
      ]
    });
  }

  async run(msg, { query }) {
    var desc = "Search Query for \""+query+'"\n\n';
    var { body: res } = await get("https://www.mariowiki.com/api.php?action=opensearch&format=json&search="+encodeURI(query));
    console.log(res);
    var json = JSON.parse(res);
    for (var i = 0; i < json[1].length; i++) {
      desc += `[${json[1][i]}](${json[3][i]})`
    }
    const embed = this.client.util.embed()
      .setTitle("Mario Wiki")
      .setDescription(desc)
      .setFooter("Powered by the Mario Wiki • https://www.mariowiki.com/")
    msg.embed(embed);
  }
};