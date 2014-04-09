exports.names = ['*say '];
exports.hidden = true;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function(data) {

    var say = data.message.split('*say ');
    
	bot.chat(say);

};
