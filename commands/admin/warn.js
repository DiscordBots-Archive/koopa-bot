const { Command } = require('discord.js-commando');
const Discord = require("discord.js");
const sqlite = require('sqlite');

sqlite.open("./../warns.sqlite3");

module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'warn',
            group: 'admin',
            memberName: 'warn',
            description: 'Warns an user',
            examples: ['warn @Molest Guy#0666 being annoying'],
            clientPermissions: ['MANAGE_MESSAGES'],
            guildOnly: true,
            args: [
                {
                    key: 'user',
                    prompt: 'who would you like to warn?',
                    type: 'member'
                },
                {
                    key: 'reason',
                    prompt: null,
                    default: 'No Reason.',
                    type: 'string'
                }
            ]
        });    
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author) || msg.member.roles.has(msg.guild.roles.find("name", "Magikoopa").id);
    }

    async run(msg, { user, reason }) {
      var warnuser = user

			sqlite.get(`SELECT * FROM warns WHERE userId ="${warnuser}"`).then(row => {
				sqlite.run("INSERT INTO warns (userId, reason, moderator, time) VALUES (?, ?, ?, ?)", [memberping.id, arg1, message.author.id, getDateTime()]).then(() => {
						if(logschannel)
							logschannel.send(`${warnuser.user.tag} **[${memberping.id}]** was warned by ${message.author.tag} **[${message.author.id}]** for ${arg1} at ${message.createdAt} in ${message.channel}`);

						if(modlogschannel) {
							var embed = new Discord.RichEmbed() // Master is MessageEmbed
								.setTitle("User Warned")
								.setColor("#ff0000")
								.setTimestamp(new Date())
								.addField("Warned User:", `${username}, ID: ${warnuser.user.id}`)
								.addField("Reason:", arg1)
								.addField("Moderator:", `${message.author}, ID: ${message.author.id}`)
								.addField("Time:", message.createdAt)
								.addField("Channel:", message.channel);

							modlogschannel.send(embed);
						}
					message.channel.send(`***${warnuser.user.tag} was warned!***`)
					warnuser.send(`You have been warned in ${message.guild.name} by ${message.author.username} for: ${arg1}.`)
				});
			}).catch(() => {
				sqlite.run("CREATE TABLE IF NOT EXISTS warns (userId TEXT, reason TEXT, moderator TEXT, time TEXT)").then(() => {
					sqlite.run("INSERT INTO warns (userId, reason, moderator, time) VALUES (?, ?, ?, ?)", [memberping.id, arg1, message.author.id, getDateTime()]).then(() => {
						if(logschannel)
							logschannel.send(`${memberping.user.tag} **[${memberping.id}]** was warned by ${message.author.tag} **[${message.author.id}]** for ${arg1} at ${message.createdAt} in ${message.channel}`);

						if(modlogschannel) {
							var embed = new Discord.RichEmbed() // Master is MessageEmbed
								.setTitle("User Warned")
								.setColor("#ff0000")
								.setTimestamp(new Date())
								.addField("Warned User:", `${username}, ID: ${warnuser.user.id}`)
								.addField("Reason:", arg1)
								.addField("Moderator:", `${message.author}, ID: ${message.author.id}`)
								.addField("Time:", message.createdAt)
								.addField("Channel:", message.channel);

							modlogschannel.send(embed);
						}
						message.channel.send(`***${warnuser.user.tag} was warned!***`)
						warneduser.send(`You have been warned in ${message.guild.name} by ${message.author.username} for: ${arg1}.`)
					});
				}).catch(error => {
					console.error(error);
				});
			});
    }
};