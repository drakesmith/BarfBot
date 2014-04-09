exports.names = ['*forecast'];
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
             //   if (!error && response.statusCode == 200) {
					var formatted = eval('(' + body + ')');
	                try {
	                    var loc = formatted.current_observation.display_location.full;
	                    var temp = Math.floor(formatted.current_observation.temp_f) * 1;
	                    var humid = formatted.current_observation.relative_humidity;
	                    var cond = formatted.current_observation.weather.toLowerCase();
	                    var fcast1 = formatted.forecast.txt_forecast.forecastday[1].fcttext;
						var fday1 = formatted.forecast.txt_forecast.forecastday[1].title;
	                    var fcast2 = formatted.forecast.txt_forecast.forecastday[2].fcttext;
						var fday2 = formatted.forecast.txt_forecast.forecastday[2].title;
	                    bot.chat(loc + ': ' + temp + 'ºF, ' + humid + ' humid.');
						bot.chat(fday1 + ': ' + fcast1);
						bot.chat(fday2 + ': ' + fcast2);
	                }
	                catch (error) {
	                        bot.chat('How about a valid Zipcode or City, State? YOU MORON!!');
	                }
			//	}
        });
	}
};


                

                