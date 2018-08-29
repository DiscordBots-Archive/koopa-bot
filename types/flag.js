const { ArgumentType } = require('discord.js-commando');
const emojiRegex = new RegExp(emojiRanges.join('|'), 'g');
const regex = /<:([a-zA-Z0-9_]+):(\d+)>/;

class EmojiArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'emoji');
	}

	validate(value, msg) {
		if (value.match(regex)) {
			const emoji = msg.client.emojis.get(value.match(regex)[2]);
			if (emoji) return true;
		} else if (value.match(emojiRegex)) {
			return true;
		}

		return false;
	}

	parse(value, msg) { // eslint-disable-line consistent-return
		if (value.match(regex)) {
			const emoji = msg.client.emojis.get(value.match(regex)[2]);
			if (emoji) return emoji;
		} else if (value.match(emojiRegex)) {
			return value.match(emojiRegex)[0];
		}
	}
}

module.exports = EmojiArgumentType;