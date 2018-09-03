exports.inhibite = (client, msg) => {
  var chn = msg.channel;
  var name = chn.name;
  return spamchannel(msg, name);
}

// Credit to NightYoshi (again)
function spamchannel(message, name) {
	var channels = [
		'end-of-server', // Mario Making Mods
		'edge-of-the-server', //sks chillzone
		'spam', // Generic Spam channel
		'dank-memes', // RHCafe
		'weegee-gallery', // (Double Cherry Studios/Mushroom Universe/Super Star Studios)
		'mecha-koopa-commands', // (Double Cherry Studios/Mushroom Universe/Super Star Studios)
		'bot-fun', // Old Mario Making Mods
		'bots', // NintenFans
		'no-mic', // Skawo's server, SMBNext, Newer DX
		'no_mic_vc', // MashiBro's server
		'memes', // MashiBro's server, Skawo's server, dev/null
		'land-of-bots', // MashiBro's server
		'voice-text', // Let Me Level With You
		'no-mic-chat', // MayroSMM
		'shitposting', // YAMMS
    'end-of-the-world', // YAMMS
		'spamhere', // TWL Mode Hacking!
		'mirage-saloon-zone', // NightYoshi Island
		'spam-bot-commands', // Game Chat Network
		'shootposting', // Super Mario Maker: Vanilla Revamped (its a meme from EddieMoron)
		'music-lab', // NightYoshi Island
		'bot-spam', // Project Pokemon
		'bot-testing', // Plexi Development
		'bot-testing-2', // Plexi Development
		'chat-bots', // Mario Unimaker
		'memes-and-shitposting', // Power Star Frenzy
		'bots-and-commands', // Power Star Frenzy
		'text-talk', // Power Star Frenzy
		'riptos-lava-toilet', // Gatete Gaming
		'bot', // Gatete Gaming
		'bot-uno', // Gatete Gaming
		'meme-madness', // Power Star Plaza
		'bot-mayhem', // Power Star Plaza
		'vc-companion', // Power Star Plaza
		'music-hub', // Power Star Plaza
		'sp500mkll', // Sonic Mania Modding
		'bot-stuff', // 1-Up World
		'waluigi-time', // 1-Up World
		'robotic-operating-buddy', // 1-Up World
		'voice-and-gaming', // 1-Up World
		'voice', // Pika
		'bot-commands', // Yukiko
		'botspam', // Pretendo
		'loss-free-zone', // Jul
		'voice-chat', // Programming server
		'memes-and-shitposts', // r/MarioMaker

		//While the following channels aren't really spam channels, they will be ignored cause they are bots that connect to other servers. If the other user can't get points, why should the user get points too?
		'megachat', // Reflect
		'phonebook', // sks Chillzone (yggwhatever)
		'your-escape-phoneline' // NightYoshi island (yggwhatever)
	];
	for (var i in channels) {
		if(name == channels[i])
			return true;
	}

	return false;
}