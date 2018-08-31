const { RichEmbed } = require("discord.js");

module.exports = (client) => {
  client.util = {}
  client.util.embed = () => new RichEmbed();
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
  client.util.getDateTime = () => {
    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    
    var wd = client.util.weekDayAbbr(date.getDay())

    return `${wd}, `
  }
}