exports.names = ['*ud'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function(data) {
	
    var matches = data.message.match(/^(?:[!*#\/])(\w+)\s*(.*)/);
	if (matches) {
		var cmd = matches[1];
		var uargs = matches[2];
	
	    if (!uargs) {
	            args = data.from;	                       
	    }
		request('http://api.urbandictionary.com/v0/define?term=' + encodeURIComponent(uargs), function cbfunc(error, response, body) {
			var formatted = eval('(' + body + ')');
            try {
				var def = formatted.list[0].definition;
				var tag = formatted.tags[0];
				bot.chat(def);
				console.log(tag);
            }
            catch (error) {
                    bot.chat('Dunno');
            }
		});
	}
	
};


                

                