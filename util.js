const { RichEmbed } = require("discord.js");

module.exports = (client) => {
  const monthNames = ["", "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  client.util = {}
  client.util.embed = () => new RichEmbed().setColor(0x4d86e2);
  client.util.memberTag = member => `${member.displayName}#${member.user.discriminator}`;
  client.util.weekDay = (wdn) => {
    wdn += 1;
    switch(wdn) {
      case 1:
        return "Sunday"
      case 2:
        return "Monday"
      case 3:
        return "Tuesday"
      case 4:
        return "Wednesday"
      case 5:
        return "Thursday"
      case 6:
        return "Friday"
      case 7:
        return "Saturday"
    }
  }
  client.util.weekDayAbbr = (wdn) => client.util.weekDay(wdn).substr(0, 3)
  client.util.month = (wdn) => monthNames[wdn]
  client.util.monthAbbr = (wdn) => monthNames[wdn].substr(0, 3)
  client.util.getDateTime = () => {
    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = client.util.monthAbbr(date.getMonth());

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    
    var wd = client.util.weekDayAbbr(date.getDay())

    return `${wd}, ${month} ${day}, ${year} ${hour}:${min}:${sec} GMT`
  }
  client.util.pad = (n) => n < 10 ? "0"+n : ""+n
  client.util.loadBar = async (message) => {
    var bar = 10 // The lenght of the bar!
    var msg = "Loading " // The message
    var b = ""
    var fbar = "[ " // Do not change!
    var ebar = "]"
    var t = "/" // Do not change!
    var char = "| " // The chrachter if the loading bar

    message.channel.send(msg).then(async m => {

        for (var i = 0; i < bar; i++) {

            b += char

            var t = fbar + b + ebar

            await m.edit(t)

        }

        var fm = "Loaded! :tada:"

        await m.edit(fm)

    })
  }
  client.util.musicProgressBar = (now, total) => {
    var bars = 15
    var ab = Math.round((now * bars) / total)
    var a = "[["
    var i = 0, j = 0;
    while (i <= bars) {
      a += ab > i ? "▬" : ""
      i++;
    }
    a += "](http://mario-modding.co.nf)"
    while (j <= bars) {
      a += ab >= j ? "" : "▬"
      j++;
    }
    return a + "]";
  }
  client.util.getPermLevel = (member) => {
    let guildConf;
    if (member.guild) {
      guildConf = client.settings.ensure(member.guild.id, client.defaultSettings);
    } else {
      guildConf = client.defaultSettings;
    }
    
    var perm = 0
    
    // needed
    var mod = guildConf.modRole;
    var admin = guildConf.adminRole;
    
    if (member.user.bot) return 0;
    if (client.isOwner(member.user)) perm = 10
    else if (member.guild.ownerId == member.id || member.roles.has(member.guild.owner.highestRole.id)) perm = 4
    else if (member.roles.has(admin)) perm = 3
    else if (member.roles.has(mod)) perm = 2
    else perm = 1;
    return perm;
  }
  const lvls = ["Bot", "Normal user", "Server moderator", "Server admin", "Server owner",
                  "5", "Bot helper", "Bot support", "Bot moderator", "Bot admin", "Bot owner"];
  client.util.getPerm = (lvl) => lvls[lvl];
  // return this.client.isOwner(msg.author) || msg.member.roles.has("481492274333876224") || msg.member.roles.has("481492388020486171")
  client.util.changeNick = (guild, newName) => guild.members.get(client.user.id).setNickname(newName)
}