exports.names = ['*beerinfo'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function(data) {
	bot.chat(beerinfo);
};

