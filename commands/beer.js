exports.names = ['*beer '];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function(data) {
	var u_id = 'cba4ca25c6a9718304ecdba46e6b5665';
	var u_secret = '9711eb3ad36bcef927795f60b2bdc77e';
	
	
    var beername = data.message.split('*beer ');
	request("http://api.untappd.com/v4/search/beer?q=" + encodeURIComponent(beername) + "&client_id=" + u_id + "&client_secret=" + u_secret, function cbfunc(error, response, body) {
		            if (!error) {
		                    var un = eval('(' + body + ')');
		                    var max = un.response.beers.count;
		                    var n = Math.floor(Math.random() * (max + 1));
		                    if (typeof (un.response.beers.items[0]) !== "undefined") {
		                            var beer = un.response.beers.items[0].beer.beer_name;
									beerinfo = un.response.beers.items[0].beer.beer_description;
									beerlabel = un.response.beers.items[0].beer.beer_label;
									brewerylabel = un.response.beers.items[0].brewery.brewery_label;
									var brew = un.response.beers.items[0].brewery.brewery_name;
									bot.chat(brew + ": " + beer);
							}
		            }
    });
};

/*
if (command == "beer") {
                        if (!args) {
                                bot.chat("/me Try *beer [name of beer]");
                        }
                        else if (args == "trending") {
                                request("http://api.untappd.com/v4/beer/trending?client_id=" + u_id + "&client_secret=" + u_secret, function cbfunc(error, response, body) {
                                        if (!error) {
                                                var un = eval('(' + body + ')');
                                                console.log(un.response.micro);
                                                var n = un.response.micro.count;
                                                if (typeof (n) !== "undefined") {
                                                        for (var i = 0; i < n; i++) {
                                                                var beerlist = [];
                                                                beerlist.push(i + ". " + un.response.micro.items[i].beer.beer_name + ' - ' + un.response.micro.items[i].brewery.brewery_name + ":beer: ");
                                                        }
                                                        bot.chat(beerlist);
                                                }
                                        }
                                });
                        }
                        else {
                                request("http://api.untappd.com/v4/search/beer?q=" + encodeURIComponent(args) + "&client_id=" + u_id + "&client_secret=" + u_secret, function cbfunc(error, response, body) {
                                        if (!error) {
                                                var un = eval('(' + body + ')');
                                                var max = un.response.beers.count;
                                                var n = Math.floor(Math.random() * (max + 1));
                                                if (typeof (un.response.beers.items[0]) !== "undefined") {
                                                        var beer = un.response.beers.items[0].beer.beer_name;
                                                        beerinfo = un.response.beers.items[0].beer.beer_description;
                                                        var brew = un.response.beers.items[0].brewery.brewery_name;
                                                        bot.chat(brew + ": " + beer);
                                                }
                                        }
                                });
                        }
                }
                if (command == "brewery") {
                        if (!args) {
                                bot.chat("/me Try *brewery Sam Adams");
                        }
                        else {
                                request("http://api.untappd.com/v4/search/brewery?q=" + encodeURIComponent(args) + "&client_id=" + u_id + "&client_secret=" + u_secret, function cbfunc(error, response, body) {
                                        if (!error) {
                                                var un = eval('(' + body + ')');
                                                var max = un.response.brewery.count;
                                                var n = Math.floor(Math.random() * (max + 1));
                                                if (typeof (un.response.brewery.items[0]) !== "undefined") {
                                                        var bre = un.response.brewery.items[0].brewery.brewery_name;
                                                        var beers = un.response.brewery.items[0].brewery.beer_count;
                                                        bot.chat(bre + " has " + beers + " beers out there!");
                                                }
                                        }
                                });
                        }
                }
                if (command == "beerinfo") {
                        bot.chat("/me " + beerinfo);
                }
                if (command == "lastbeer" || command == "lb") {
                        if (!args) {
                                args = data.name;
                                if (data.name == "De Ben") {
                                        args = "bensamra";
                                }
                                if (data.name == "Chris Rohn") {
                                        args = "chrisrohn";
                                }
                                if (data.name == "Sean Lorenz") {
                                        args = "slorenz";
                                }
                                if (data.name == "SheWentBang") {
                                        args = "jillianadel";
                                }
                                if (data.name == "shaunacon") {
                                        args = "meowsk";
                                }
                        }
                        if (args.match(/bang/i)) {
                                args = "jillianadel";
                        }
                        if (args.match(/shauna/i)) {
                                args = "meowsk";
                        }
                        request("http://api.untappd.com/v4/user/checkins/" + encodeURIComponent(args) + "?client_id=" + u_id + "&client_secret=" + u_secret, function cbfunc(error, response, body) {
                                try {
                                        var un = eval('(' + body + ')');
                                        var beer = un.response.checkins.items[0].beer.beer_name;
                                        var brewery = un.response.checkins.items[0].brewery.brewery_name;
                                        var style = un.response.checkins.items[0].beer.beer_style;
                                        beerinfo = un.response.checkins.items[0].beer.beer_description;
                                        var rating = un.response.checkins.items[0].rating_score;
                                        var loc = un.response.checkins.items[0].venue.venue_name;
                                        var comment = un.response.checkins.items[0].checkin_comment;
                                        var toasts = new Number(un.response.checkins.items[0].toasts.count);
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
                if (command == "secondlastbeer" || command == "slb") {
                        if (!args) {
                                args = data.name;
                                if (data.name == "De Ben") {
                                        args = "bensamra";
                                }
                                if (data.name == "Chris Rohn") {
                                        args = "chrisrohn";
                                }
                                if (data.name == "Sean Lorenz") {
                                        args = "slorenz";
                                }
                                if (data.name == "SheWentBang") {
                                        args = "jillianadel";
                                }
                                if (data.name == "shaunacon") {
                                        args = "meowsk";
                                }
                        }
                        if (args.match(/bang/i)) {
                                args = "jillianadel";
                        }
                        if (args.match(/shauna/i)) {
                                args = "meowsk";
                        }
                        request("http://api.untappd.com/v4/user/checkins/" + encodeURIComponent(args) + "?client_id=" + u_id + "&client_secret=" + u_secret, function cbfunc(error, response, body) {
                                try {
                                        var un = eval('(' + body + ')');
                                        var beer = un.response.checkins.items[1].beer.beer_name;
                                        var brewery = un.response.checkins.items[1].brewery.brewery_name;
                                        beerinfo = un.response.checkins.items[1].beer.beer_description;
                                        var style = un.response.checkins.items[1].beer.beer_style;
                                        var rating = un.response.checkins.items[1].rating_score;
                                        var loc = un.response.checkins.items[1].venue.venue_name;
                                        var comment = un.response.checkins.items[1].checkin_comment;
                                        var toasts = new Number(un.response.checkins.items[1].toasts.count);
                                        console.dir(un.response.checkins.items[1].toasts);
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
                                        }, 2500);
                                }
                                catch (error) {
                                        console.log(error);
                                }
                        });
                }
                if (command == "thirdlastbeer" || command == "tlb") {
                        if (!args) {
                                args = data.name;
                                if (data.name == "De Ben") {
                                        args = "bensamra";
                                }
                                if (data.name == "Chris Rohn") {
                                        args = "chrisrohn";
                                }
                                if (data.name == "Sean Lorenz") {
                                        args = "slorenz";
                                }
                                if (data.name == "SheWentBang") {
                                        args = "jillianadel";
                                }
                                if (data.name == "shaunacon") {
                                        args = "meowsk";
                                }
                        }
                        if (args.match(/bang/i)) {
                                args = "jillianadel";
                        }
                        if (args.match(/shauna/i)) {
                                args = "meowsk";
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
                if (command == "beerroll") {
                        if (!args) {
                                args = data.name;
                                if (data.name == "De Ben") {
                                        args = "bensamra";
                                }
                                if (data.name == "Chris Rohn") {
                                        args = "chrisrohn";
                                }
                                if (data.name == "Sean Lorenz") {
                                        args = "slorenz";
                                }
                                if (data.name == "SheWentBang") {
                                        args = "jillianadel";
                                }
                                if (data.name == "shaunacon") {
                                        args = "meowsk";
                                }
                        }
                        if (args.match(/bang/i)) {
                                args = "jillianadel";
                        }
                        if (args.match(/shauna/i)) {
                                args = "meowsk";
                        }
                        request("http://api.untappd.com/v4/user/checkins/" + encodeURIComponent(args) + "?client_id=" + u_id + "&client_secret=" + u_secret, function cbfunc(error, response, body) {
                                try {
                                        var un = eval('(' + body + ')');
                                        var beertext = [];
                                        var beerLength = un.response.checkins.count;
                                        console.log(beerLength);
                                        for (var i = 0; i < 8; i++) {
                                                beertext.push("\u000A" + (i + 1) + ". " + un.response.checkins.items[i].brewery.brewery_name + ' - ' + un.response.checkins.items[i].beer.beer_name);
                                        }
                                        bot.chat(beertext);
                                }
                                catch (error) {
                                        console.log(error);
                                }
                        });
                }
                if (command == "beercount") {
                        if (!args) {
                                args = data.name;
                                if (data.name == "Princess Bubbledrake") {
                                        args = "drakesmith";
                                }
                                if (data.name == "Induramatic AV") {
                                        args = "indur";
                                }
                                if (data.name == "Chris Rohn") {
                                        args = "chrisrohn";
                                }
                                if (data.name == "shaunacon") {
                                        args = "meowsk";
                                }
                                if (data.name == "De Ben") {
                                        args = "bensamra";
                                }
                                if (data.name == "Sean Lorenz") {
                                        args = "slorenz";
                                }
                                if (data.name == "SheWentBang") {
                                        args = "jillianadel";
                                }
                                if (data.name == "yosimiteben") {
                                        args = "bennyhicks";
                                }
                        }
                        if (args.match(/bang/i)) {
                                args = "jillianadel";
                        }
                        if (args.match(/shauna/i)) {
                                args = "meowsk";
                        }
                        request("http://api.untappd.com/v4/user/info/" + encodeURIComponent(args) + "?client_id=" + u_id + "&client_secret=" + u_secret, function cbfunc(error, response, body) {
                                try {
                                        var formatted = eval('(' + body + ')');
                                        var no = formatted.response.user.stats.total_beers;
                                        var ch = formatted.response.user.stats.total_checkins;
                                        var name = formatted.response.user.first_name;
                                        var created = formatted.response.user.stats.total_created_beers;
                                        var msg = name + " has logged " + no + " unique brews out of " + ch + " total beers."
                                        if (created > 0) {
                                                msg += " You also have " + created + " of your own brews out there!"
                                        }
                                        bot.chat(msg);
                                }
                                catch (error) {
                                        console.log(error);
                                        bot.chat('How about a valid username?');
                                }
                        });
                }
                if (command == "beergap") {
                        if (args) {
                                if (data.name == "De Ben") {
                                        data.name = "bensamra";
                                }
                                if (args.match(/sean/i)) {
                                        args = "slorenz";
                                }
                                if (args.match(/de ben/i)) {
                                        args = "bensamra";
                                }
                                if (args.match(/bang/i)) {
                                        args = "jillianadel";
                                }
                                request("http://api.untappd.com/v4/user/info/" + encodeURIComponent(data.name) + "?client_id=" + u_id + "&client_secret=" + u_secret, function cbfunc(error, response, body) {
                                        try {
                                                var formatted = eval('(' + body + ')');
                                                var no1 = formatted.response.user.stats.total_beers;
                                                var ch1 = formatted.response.user.stats.total_checkins;
                                                var name1 = formatted.response.user.first_name;
                                        }
                                        catch (error) {
                                                console.log(error);
                                                bot.chat('Unable to find beer gap!');
                                        }
                                        request("http://api.untappd.com/v4/user/info/" + encodeURIComponent(args) + "?client_id=" + u_id + "&client_secret=" + u_secret, function cbfunc(error, response, body) {
                                                try {
                                                        var formatted = eval('(' + body + ')');
                                                        var no2 = formatted.response.user.stats.total_beers;
                                                        var ch2 = formatted.response.user.stats.total_checkins;
                                                        var name2 = formatted.response.user.first_name;
                                                }
                                                catch (error) {
                                                        console.log(error);
                                                        bot.chat('I must be drunk');
                                                }
                                                var gap = no1 - no2;
                                                if (gap > 0) {
                                                        bot.chat(name1 + ' leads ' + name2 + ' by ' + gap + ' unique brews.');
                                                }
                                                else if (gap < 0) {
                                                        gap = Math.abs(gap);
                                                        bot.chat(name1 + ' trails ' + name2 + ' by ' + gap + ' unique brews.');
                                                }
                                                else if (gap = 0) {
                                                        bot.chat('TIE?!!?!?!');
                                                }
                                        });
                                });
                        }
                        else {
                                bot.chat("/me Try *beergap [someone's username]");
                        }

setInterval(function () {
request("http://api.untappd.com/v4/checkin/recent?access_token=9AFC9E820951A3B14FA36D98489C80DB7717E6B5&limit=1", function cbfunc(error, response, body) {
                                try {
                                        var un = eval('(' + body + ')');
                                        var all = un.response.checkins.items[0];
                                    if (lastBeerCheckIn != all.checkin_id) {
                                        var who = all.user.first_name;
                                        var beer = all.beer.beer_name;
                                        var brewery = all.brewery.brewery_name;
                                        beerinfo = all.beer.beer_description;
                                        var style = all.beer.beer_style;
                                        var rating = all.rating_score;
                                        var loc = all.venue.venue_name;
                                        var comment = all.checkin_comment;
                                        lastBeerCheckIn = all.checkin_id;
                                        var toasts = new Number(all.toasts.count);
                                        var msg1 = 'Looks like '+ who +' is currently drinking an ' + style;
                                        if (loc != undefined) {
                                                        msg1 += ' at ' + loc + '. ';
                                                }
                                        bot.chat(msg1);
                                        setTimeout(function () {
                                                var msg = beer + ' by ' + brewery + ', and they gave it a ' + rating + ' out of 5 ';
                                                if (toasts == 1) {
                                                        msg += ". " + toasts + " person toasted this! ";
                                                }
                                                if (toasts > 1) {
                                                        msg += ". " + toasts + " people toasted this! ";
                                                }
                                                if (comment.length > 1) {
                                                        msg += '"' + comment + '" ';
                                                }
                                                bot.chat(msg);
                                        }, 2500);
                                    }
                                }
                                catch (error) {
                                        console.log(error);
                                }
                        });
}, 60 * 2000);
*/