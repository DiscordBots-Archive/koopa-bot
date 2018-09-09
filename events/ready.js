const SQLite = require("better-sqlite3");
module.exports = async (client) => {
  // client.warns.table = new SQLite("./../warns.sqlite");
  console.log(`Logged in and ready to serve ${client.guilds.size} servers, ${client.channels.size} channels and ${client.users.size} users!`);
  client.user.setActivity('Mario Modding — http://mario-modding.co.nf', { type: "WATCHING" });
  /*let warns = client.warns.table;
  const warnTable = warns.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'warns';").get();
  if (!warnTable['count(*)']) {
    // If the table isn't there, create it and setup the database correctly.
    warns.prepare("CREATE TABLE IF NOT EXISTS warns (userId TEXT, reason TEXT, moderator TEXT, time TEXT, guild TEXT);").run();
    // Ensure that the "id" row is always unique and indexed.
    // warns.prepare("CREATE UNIQUE INDEX idx_warns_id ON warns (id);").run();
    warns.pragma("synchronous = 1");
    warns.pragma("journal_mode = wal");
  }
  client.warns.get = warns.prepare("SELECT * FROM warns WHERE userId = ? AND guild = ?");
  client.warns.set = warns.prepare("INSERT INTO warns (userId, reason, moderator, time, guild) VALUES (@uid, @reason, @moderator, @time, @guild)");
  client.warns.delete = warns.prepare("DELETE FROM warns WHERE userId = ? AND guild = ?");
  client.warns.drop = warns.prepare("DROP TABLE warns");*/
}