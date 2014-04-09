exports.names = ['*weather'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function(data) {
	var wUNDER = '3f64d292d3d95c78';
		
    var matches = data.message.match(/^(?:[!*#\/])(\w+)\s*(.*)/);
	if (matches) {
		var cmd = matches[1];
		var userlocation = matches[2];
	
	    if (!userlocation) {
	            userlocation = 90065;
	    }                   
	    
        if (userlocation == 'sl,ut') {
                userlocation = 84102;
        }
        request('http://api.wunderground.com/api/' + wUNDER + '/geolookup/conditions/forecast/q/' + encodeURIComponent(userlocation) + '.json', function cbfunc(error, response, body) {
                var formatted = eval('(' + body + ')');
                try {
                        var loc = formatted.current_observation.display_location.full;
                        var temp = Math.floor(formatted.current_observation.temp_f) * 1;
                        var cond = formatted.current_observation.weather.toLowerCase();
                        var humid = formatted.current_observation.relative_humidity;
                        if (cond.match(/rain/i)) {
                                cond = " raining on your parade";
                        }
                        if (cond.match(/partly cloudy/i)) {
                                cond = " partly sunny";
                        }
                        if (humid.substring(0, humid.length - 1) > 80) {
                                cond = " really effin humid";
                        }
                        if (temp < 38) {
                                cond = " GREAT! If you're a penguin";
                        }
                        bot.chat('/me ' + loc + ': ' + temp + 'ºF & ' + cond);
                }
                catch (error) {
                        bot.chat('How about a valid Zipcode or City, State? YOU MORON!!');
                }
        });
	}
};


                

                