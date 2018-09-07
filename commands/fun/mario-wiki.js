const { Command } = require('discord.js-commando');
const { post, get } = require("snekfetch");
const htmlToText = require('html-to-text');
var TurndownService = require('turndown')
 
var turndownService = new TurndownService()

module.exports = class ReplyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'mario-wiki',
      group: 'fun',
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

  async run(message, { query }) {
    var desc = "Search Query for \""+query+'"\n\n';
    var { body: json } = await get("https://www.mariowiki.com/api.php?action=opensearch&format=json&search="+encodeURI(query));
    var len = json[1].length;
    if (len == 0) return message.say("No results found");
    for (var i = 0; i < json[1].length; i++) {
      desc += `• [${i+1}] [${json[1][i]}](${json[3][i]})\n`
    }
    const embed = this.client.util.embed()
      .setTitle("Mario Wiki")
      .setDescription(desc)
      .setFooter("Powered by the Mario Wiki • https://www.mariowiki.com/")
      .setThumbnail("https://www.mariowiki.com/images/mariowiki.png");
    message.embed(embed);
    message.channel.awaitMessages(response => response.author.id == message.author.id
                                            && !isNaN(response.content)
                                            && parseInt(response.content) <= len
                                            && parseInt(response.content) > 0, {
      max: 1,
      time: 30000,
      errors: ['time'],
    })
    /*.then(async (collected) => {
      var newq = json[1][parseInt(collected.first().content)-1];
      var newl = json[3][parseInt(collected.first().content)-1];
      var { body: newj } = await get("https://www.mariowiki.com/api.php?action=parse&format=json&page="+encodeURI(query));
      var text = this.stripHTML(newj.parse.text["*"])
      text = text.substring(0, 2047);
      const newe = this.client.util.embed()
        .setTitle("Mario Wiki - " + newq)
        .setURL(newl)
        .setDescription(text + (text.length == 2047 ? "…" : ""))
        .setFooter("Powered by the Mario Wiki • https://www.mariowiki.com/")
        .setThumbnail("https://www.mariowiki.com/images/mariowiki.png");
      message.channel.send(newe);
    })
    .catch((e) => {
      message.reply('command canceled!');
      console.log(e)
    });*/
  }
  
  // still Thanks NightYoshi
  stripHTML(text) {
    text = text.replace(/<style([\s\S]*?)<\/style>/gi, '');
    text = text.replace(/<script([\s\S]*?)<\/script>/gi, '');
    text = text.replace(/<\/div>/ig, '\n');
    text = text.replace(/<\/li>/ig, '\n');
    text = text.replace(/<li>/ig, '  *  ');
    text = text.replace(/<\/ul>/ig, '\n');
    text = text.replace(/<\/p>/ig, '\n');
    text = text.replace(/<br\s*[\/]?>/gi, "\n");
    text = text.replace(/<[^>]+>/ig, '');
    /*text = htmlToText.fromString(text, {
      wordwrap: 500,
      linkHrefBaseUrl: "https://www.mariowiki.com"
    });*/
    text = turndownService.turndown(text)
    return text;
  }
};