exports.names = ['Who ', 'who ','who\'s','Who\'s'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function(data) {
    var rand = Math.random();
    if (rand < 0.05) {
        bot.chat('YM.');
    } else if (rand < 0.10) {
        bot.chat('YM!');
    } else if (rand < 0.3) {
        bot.chat('YM!!!');
    } else if (rand < 0.5) {
        bot.chat('Y!!M!!');
    } else if (rand < 0.7) {
        bot.chat('ym');
    } else if (rand < 0.9) {
        bot.chat('YM! YM! YM! YM! YM! YYYYYMMMMM!!!!!');
    } else {
        bot.chat('YM');
    }
};