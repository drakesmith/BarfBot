exports.names = ['*thirdlastbeer', '*tlb'];
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
        if (args == ("De Ben" && "de ben")) {
                args = "bensamra";
        }
        if (args == "Chris Rohn") {
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
	                    var beer = un.response.checkins.items[2].beer.beer_name;
	                    var brewery = un.response.checkins.items[2].brewery.brewery_name;
	                    var style = un.response.checkins.items[2].beer.beer_style;
	                    beerinfo = un.response.checkins.items[2].beer.beer_description;
	                    var rating = un.response.checkins.items[2].rating_score;
	                    var loc = un.response.checkins.items[2].venue.venue_name;
	                    var comment = un.response.checkins.items[2].checkin_comment;
	                    var toasts = new Number(un.response.checkins.items[2].toasts.count);
	                    bot.chat('Hmmm looks like it was a ' + style + '!');
	                    setTimeout(function () {
	                            var msg = beer + ' by ' + brewery + ', and you gave it a ' + rating + ' out of 5 ';
	                            if (loc != undefined) {
	                                    msg += 'at ' + loc + '. ';
	                            }
	                            if (toasts == 1) {
	                                    msg += toasts + " person toasted this! ";
	                            }
	                            if (toasts > 1) {
	                                    msg += toasts + " people toasted this! ";
	                            }
	                            if (comment.length > 1) {
	                                    msg += '"' + comment + '" ';
	                            }
	                            bot.chat(msg);
	                    }, 3000);
	            }
	            catch (error) {
	                    console.log(error);
	            }
	    });
	}
	
};


                

                