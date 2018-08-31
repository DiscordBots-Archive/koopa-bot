exports.inhibite = (client, msg) => {
  var chn = msg.channel;
  var name = chn.name;
  return (["meme", "dank", "shit", "spam", "end-of-server"].incContains(name))
}

Array.prototype.incContains = (str) => {
  for (var item in this) {
    if (item.includes(str)) return true;
  }
  return false;
}