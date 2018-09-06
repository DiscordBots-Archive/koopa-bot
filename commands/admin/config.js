const { Command } = require('./../../classes/Command.js');
const { RichEmbed } = require("discord.js");
const { inspect } = require("util");

module.exports = class ConfigCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'config',
            aliases: ["conf", "settings", "sets"],
            group: 'admin',
            memberName: 'config',
            description: 'Changes the client configuration for the server',
            examples: ["conf welcomeMessage Welcome, {{user}}, to this server!"],
            guildOnly: true,
            args: [
              {
                key: "prop",
                label: "property",
                prompt: "what key do you want to edit?",
                type: "string",
                default: ""
              },
              {
                key: "value",
                prompt: "what should the value be?",
                type: "string",
                default: ""
              },
            ],
            minPerm: 3
        });
    }

    run(message, { prop, value }) {
      const guildConf = this.client.settings.ensure(message.guild.id, this.client.defaultSettings);
      if (!prop || prop == "" || !value || value == "") {
        //let configProps = Object.keys(guildConf).map(prop => {
        //  return `${prop}  :  ${guildConf[prop]}\n`;
        //});
        // return message.channel.send(`The following are the server's current configuration:
        // \`\`\`js\n${configProps}\n\`\`\``);
        return message.channel.send(inspect(guildConf), {code: "js"});
      }

      // We can check that the key exists to avoid having multiple useless, 
      // unused keys in the config:
      if(!this.client.settings.has(message.guild.id, prop)) {
        return message.reply("This key is not in the configuration.");
      }
      
      if (["true", "false", true, false].includes(guildConf[prop])) {
        if (!["true", "false", true, false].includes(value)) return message.reply(`${prop} must be one of (true, false)`);
        
        // Now we can finally change the value. Here we only have strings for values 
        // so we won't bother trying to make sure it's the right type and such.
        this.client.settings.set(message.guild.id, this.booleanize(value), prop);
      } else {

        // Now we can finally change the value. Here we only have strings for values 
        // so we won't bother trying to make sure it's the right type and such. 
        this.client.settings.set(message.guild.id, value, prop);
        
      }

      // We can confirm everything's done to the client.
      message.channel.send(`Guild configuration item ${prop} has been changed to:\n\`${value}\``);
    }
  
  booleanize(str) {
    switch (str) {
      case "false":
        return false;
      case "true":
      default:
        return true;
    }
  }
};