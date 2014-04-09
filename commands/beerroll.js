exports.names = ['*beerroll'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function(data) {
	var u_id = 'cba4ca25c6a9718304ecdba46e6b5665';
	var u_secret = '9711eb3ad36bcef927795f60b2bdc77e';
	
    var matches = data.message.match(/^(?:[!*#\/])(\w+)\s*(.*)/);
	if (matches) {
		var cmd = matches[1];
		var args = matches[2];
	
	    if (!args) {
	            args = data.from;
	                       
	    }
        if (args == ("De Ben" || "de ben")) {
                args = "bensamra";
        }
        if (args == ("Chris Rohn" || "chris rohn")) {
                args = "chrisrohn";
        }
        if (args == "Sean Lorenz") {
                args = "slorenz";
        }
        if (args == "SheWentBang") {
                args = "jillianadel";
        }
        if (args == "shaunacon") {
                args = "meowsk";
		}
        if (args == ("citizenSnips" || "citizensnips")) {
                args = "heyblinkin";
		}
		
        request("http://api.untappd.com/v4/user/checkins/" + encodeURIComponent(args) + "?client_id=" + u_id + "&client_secret=" + u_secret, function cbfunc(error, response, body) {
                try {
                        var un = eval('(' + body + ')');
                        var beertext = [];
                        var beerLength = un.response.checkins.count;
						var username = un.response.checkins.items[0].user.user_name;
                        console.log(beerLength);
						bot.chat(":beers: " + username + " :beers:")
                        for (var i = 0; i < 8; i++) {
                                bot.chat((i + 1) + ". " + un.response.checkins.items[i].brewery.brewery_name + ' - ' + un.response.checkins.items[i].beer.beer_name);
                        }
                }
                catch (error) {
                        console.log(error);
                }
        });
    }
};
