const { Command } = require('discord.js-commando');

module.exports = class WarningCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'warn',
            group: 'admin',
            memberName: 'warn',
            description: 'Warns an user',
            examples: ['warn <user> <reason>'],
            args: [
              {
                key: "member",
                prompt: "who do you want to warn?",
                type: "member"
              },
              {
                key: "reason",
                prompt: "who do you want to warn?",
                default: "No reason.",
                type: "string"
              }
            ]
        });
    }

    run(msg, { member, reason }) {
        return msg.say("Warned " + member.user.tag + " for reason: " + reason + "\nHihihi");
    }
};