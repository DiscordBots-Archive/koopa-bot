exports.inhibite = (client, msg) => {
  var chn = msg.channel;
  var name = chn.name;
  return ([""].includes(name))
}

Array.prototype.incContains = (str) => {
  for (var item in this) {
    if (item.contains(str)) return true
  }
  return false;
}