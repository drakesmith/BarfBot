exports.names = ['OH HAI','OHHAI','ohhai','ohai','OHAI','O HAI','o hai','Oh Hai','OH HAI!','ohai!','OHAI!'];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function(data) {
    var name = data.from;
	bot.chat('Oh...');
	bot.chat("It's " + name + "...");
	bot.chat('hai...');
};
