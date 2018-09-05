const { Command } = require('./../../classes/Command.js');
const { RichEmbed } = require("discord.js");

module.exports = class ConfigCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'config',
            aliases: ["conf", "settings", "sets"],
            group: 'admin',
            memberName: 'ban',
            description: 'Changes the client configuration for the s',
            examples: ["conf welcomeMessage Welcome, {{user}}, to this server!"],
            args: [
              {
                key: "prop",
                label: "property",
                prompt: "who do you want to ban?",
                type: "member"
              },
              {
                key: "value",
                prompt: "why do you want to ban him?",
                type: "string",
                default: ""
              },
            ],
            minPerm: 3
        });
    }

    run(message, { prop, value }) {
      const guildConf = this.client.settings.ensure(message.guild.id, this.client.defaultSettings);
      if (!value || value == "") {
        let configProps = Object.keys(guildConf).map(prop => {
          return `${prop}  :  ${guildConf[prop]}\n`;
        });
        message.channel.send(`The following are the server's current configuration:
        \`\`\`${configProps}\`\`\``);
      }

      // We can check that the key exists to avoid having multiple useless, 
      // unused keys in the config:
      if(!this.client.settings.has(message.guild.id, prop)) {
        return message.reply("This key is not in the configuration.");
      }

      // Now we can finally change the value. Here we only have strings for values 
      // so we won't bother trying to make sure it's the right type and such. 
      this.client.settings.set(message.guild.id, value.join(" "), prop);

      // We can confirm everything's done to the client.
      message.channel.send(`Guild configuration item ${prop} has been changed to:\n\`${value.join(" ")}\``);
    }
};