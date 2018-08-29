const { ArgumentType } = require('discord.js-commando');
const regex = /-([a-zA-Z0-9_]+)/;

class FlagArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'flag');
	}

	validate(value, msg) {
		if (value.match(regex)) {
      return true;
		}

		return false;
	}

	parse(value, msg) { // eslint-disable-line consistent-return
		if (value.match(regex)) {
      const flag = value.replace("-", "");
			return flag;
		}
	}
}

module.exports = FlagArgumentType;