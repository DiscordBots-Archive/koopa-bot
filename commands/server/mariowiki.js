const { Command } = require('discord.js-commando');

module.exports = class ReplyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'mario-wiki',
      group: 'server',
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

  run(msg, { query }) {
    const emed = this.client.util.embed()
      .setTitle("Mario Wiki")
      .setDescription("Search Query for \""+query+'"')
  }
};