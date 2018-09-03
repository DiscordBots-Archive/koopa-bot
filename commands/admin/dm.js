const { Command } = require('discord.js-commando');

module.exports = class DmCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'dm',
            group: 'admin', // change to whatever you need
            memberName: 'dm',
            description: 'Sends a DM to someone',
            examples: ['dm @User No'],
            userPermissions: ['MANAGE_MESSAGES'],
            args: [
                {
                    key: 'mem',
                    label: "member",
                    prompt: 'Who would you like to receive the DM?',
                    type: 'user',
                },
                {
                    key: 'text',
                    prompt: 'What text would you like the bot to say?',
                    type: 'string',
                }
            ]
        });    
    }

    run(message, { mem, text }) {
      mem.send(`Staff reply: ${text}`)
        .then(msg => message.say("DM delivered"))
        .catch(e => {
          message.say("DM not delivered: `" + e + "`");
          console.error(e)
        })
    }
};