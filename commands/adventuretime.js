exports.names = ['what time is it?','*at'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function(data) {
    var name = data.from;
	bot.chat('| (• ◡•)| (❍ᴥ❍ʋ)');
	bot.chat("It's Adventure Time!");
};
