exports.names = ['*banana'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function(data) {
    var name = data.from;
	bot.chat('http://i.imgur.com/NPQJBbp.gif');
};
