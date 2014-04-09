exports.names = ['*brewery '];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function(data) {
	var u_id = 'cba4ca25c6a9718304ecdba46e6b5665';
	var u_secret = '9711eb3ad36bcef927795f60b2bdc77e';
	
	
    var brewname = data.message.split('*brewery ');
    request("http://api.untappd.com/v4/search/brewery?q=" + encodeURIComponent(brewname) + "&client_id=" + u_id + "&client_secret=" + u_secret, function cbfunc(error, response, body) {
            if (!error) {
                    var un = eval('(' + body + ')');
                    var max = un.response.brewery.count;
                    var n = Math.floor(Math.random() * (max + 1));
                    if (typeof (un.response.brewery.items[0]) !== "undefined") {
                            var bre = un.response.brewery.items[0].brewery.brewery_name;
							brewerylabel = un.response.brewery.items[0].brewery.brewery_label;
                            var beers = un.response.brewery.items[0].brewery.beer_count;
                            bot.chat(bre + " has " + beers + " beers out there!");
                    }
            }
    });
};