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
            examples: ["conf set welcomeMessage Welcome, {{user}}, to this server!"],
            guildOnly: true,
            args: [
              {
                key: "action",
                label: "action flag",
                prompt: "what action do you want to follow?",
                type: "string",
                default: "view",
                // oneOf: ['view', 'set', "clear", "reset", "add"],
              },
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
      this.types = {
        logChannel: "nullablestring",
        modLogChannel: "string",
        modRole: "string",
        adminRole: "string",
        ownerRole: "string",
        welcomeChannel: "string",
        welcomeEnabled: "bool",
        welcomeMessage: "string",
        staffLine: 'nullablestring',
        automod: "bool"
      }
    }

    async run(message, { action, prop, value, type }) {
      const guildConf = this.client.settings.ensure(message.guild.id, this.client.defaultSettings);
      switch (action) {
        case "view":
          //let configProps = Object.keys(guildConf).map(prop => {
          //  return `${prop}  :  ${guildConf[prop]}\n`;
          //});
          // return message.channel.send(`The following are the server's current configuration:
          // \`\`\`js\n${configProps}\n\`\`\``);
          return message.channel.send(inspect(guildConf), {code: "js"});
          break;
        case "add":
          if (!this.client.isOwner(message.author)) return message.reply("due to the nature of this action, it is restricted to the owner. Contact Samplasion#7901 if you **absolutely** need to add a key.");
          const types = ["bool", "string", "int", "nullablestring"];
          if (!types.includes(type.toLowerCase())) return message.reply(`type must be one of (${types.join(", ")})`);
          var key = prop;
          
          const response = await this.client.awaitReply(message, `[${types.join("/")}]`);
          
          if (!key) return message.reply("Please specify a key to add");
          if (guildConf[key]) return message.reply("This key already exists in the settings");

          // One the settings is modified, we write it back to the collection
          var res = value;
          switch (type) {
            case "bool":
              res = this.booleanize(res)
              break;
            case "string":
              res = this.booleanize(res)
              break;
            case "nullablestring":
              res = this.nullify(res)
              break;
            case "int":
              res = parseInt(res)
              break;
          }
          this.client.settings.set(message.guild.id, res, prop);
          message.reply(`Guild configuration item ${prop} has been changed to:\n\`${value}\``);
          break;
        case "set":
          // We can check that the key exists to avoid having multiple useless, 
          // unused keys in the config:
          if(!this.client.settings.has(message.guild.id, prop)) {
            return message.reply("This key is not in the configuration.");
          }

          if (prop in this.types && this.types[prop] == "bool") {
            if (!["true", "false", true, false].includes(value)) return message.reply(`${prop} must be one of (true, false)`);

            // Now we can finally change the value. Here we only have strings for values 
            // so we won't bother trying to make sure it's the right type and such.
            this.client.settings.set(message.guild.id, this.booleanize(value), prop);
            
          } else if (prop in this.types && this.types[prop] == "nullablestring") {

            // Now we can finally change the value. Here we only have strings for values 
            // so we won't bother trying to make sure it's the right type and such. 
            this.client.settings.set(message.guild.id, this.nullify(value), prop);

          } else {
            
            this.client.settings.set(message.guild.id, value, prop);
            
          }

          // We can confirm everything's done to the client.
          message.channel.send(`Guild configuration item ${prop} has been changed to:\n\`${value}\``);
          break;
        case "clear":
        case "reset":
          // Throw the 'are you sure?' text at them.
          const response = await this.client.awaitReply(message, `Are you sure you want to permanently clear/reset the configs? This **CANNOT** be undone. [yes/no]`);

          // If they respond with y or yes, continue.
          if (["y", "yes", "sure", "yep"].includes(response)) {

            // We delete the `key` here.
            // guildConf.delete();
            this.client.settings.set(message.guild.id, this.client.defaultSettings);
            message.reply(`The configs were successfully cleared.`);
          } else
          // If they respond with n or no, we inform them that the action has been cancelled.
          if (["n", "no", "cancel"].includes(response)) {
            message.reply("Action cancelled.");
          }
          break;
        default:
          return message.reply("unknown action, must be one of (view, reset, clear, set, add")
      }
    }
  
    booleanize(str) {
      switch (str) {
        case "false":
          return false;
        case "true":
          return true;
      }
      return true;
    } 
  
  nullify(str) {
    if (str == "null") return null
    return str
  }
};