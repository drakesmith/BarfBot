exports.names = ['*beertrending'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function(data) {
	var u_id = 'cba4ca25c6a9718304ecdba46e6b5665';
	var u_secret = '9711eb3ad36bcef927795f60b2bdc77e';
	            request("http://api.untappd.com/v4/beer/trending?client_id=" + u_id + "&client_secret=" + u_secret, function cbfunc(error, response, body) {
                if (!error) {
                        var un = eval('(' + body + ')');
                        console.log(un.response.micro);
                        var n = un.response.micro.count;
                        if (typeof (n) !== "undefined") {
                                for (var i = 0; i < n; i++) {
                                     /*   var beerlist = [];
                                        beerlist.push(i + '. ' + un.response.micro.items[i].beer.beer_name + ' - ' + un.response.micro.items[i].brewery.brewery_name + ':beer: ');
									*/	
										bot.chat((i+1) + '. ' + un.response.micro.items[i].beer.beer_name + ' - ' + un.response.micro.items[i].brewery.brewery_name + ':beer: ');
                                }
								//bot.chat(un.response.micro.items[1].beer.beer_name);
                               // bot.chat(beerlist);
                        }
                }
            });

};
