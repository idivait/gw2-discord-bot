"use strict";
const
	Promise = require("bluebird"),
	db = Promise.promisifyAll(require("../lib/db")),
	phrases = require("../lib/phrases");

let bot_user;

function startTyping(channel) {
	return new Promise((resolve, reject) => {
		channel.startTyping();
		resolve();
	});
}

function messageReceived(message) {
	const messageAsync = Promise.promisifyAll(message);
	const channel = message.channel;

	if (message.content.match(new RegExp(`^${phrases.get("CORE_PREFIX")+phrases.get("WHOIS_WHOIS")} (.*)?$`, "i"))) {
		console.log("Whois command");
		const user = message.mentions.users.first();
		if (!user) return; // No mentions? No answer
		startTyping(channel).then(()=>{
			if (!user) throw new Error("unknown user");
			if (user && user.bot) throw new Error("bot user");
			// Get the GW2 account data by user
			return db.getAccountByUserAsync(user.id);
		})
		.then((account)=>{
			if (!account) throw new Error("unknown user");
			// Construct message
			if (user.id === message.author.id) return phrases.get("WHOIS_SELF", { account_name: account.name });
			else return phrases.get("WHOIS_KNOWN", { user: user.mention(), account_name: account.name });
		})
		.catch(err => {
			// Capture errors and construct proper fail message
			switch (err.message) {
				case "bot user":
					return phrases.get("WHOIS_BOT", { user: bot_user.mention() });
				case "unknown user":
					return phrases.get("WHOIS_UNKNOWN");
				default:
					console.log(`Error in whois command initiated by ${message.author.username}#${message.author.discriminator}: ${err.message}`);
					return;
			}
		})
		.finally(() => channel.stopTyping())
		.then(text => messageAsync.replyAsync(text));
	}
}

module.exports = bot => {
	bot.on("message", messageReceived);
	bot.on("ready", () => {
		bot_user = bot.user;
	})
};
