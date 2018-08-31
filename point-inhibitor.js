exports.inhibite = (client, msg) => {
  var chn = msg.channel;
  var name = chn.name;
  return (name.includes("meme") || name.inlcudes("dank") )
}