exports.inhibite = (client, msg) => {
  var chn = msg.channel;
  var name = chn.name;
  return (name.includes("meme")
          || name.includes("dank")
          || name.includes("shit")
          || name.includes("end-of-server")
          || name.includes("megachat")
          || name.includes("music")
          || name.includes("log"))
}