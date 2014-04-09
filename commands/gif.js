exports.names = ['*gif'];
exports.hidden = false;
exports.enabled = true;
exports.matchStart = true;
exports.handler = function(data) {
	var u_id = 'dc6zaTOxFJmzC';
		
    var matches = data.message.match(/^(?:[!*#\/])(\w+)\s*(.*)/);
	if (matches) {
		var cmd = matches[1];
		var gifargs = matches[2];
	
	    if (!gifargs) {
		    request("http://api.giphy.com/v1/gifs/random?api_key=" + u_id, function cbfunc(error, response, body) {
		            try {
		                    var giphy = eval('(' + body + ')');
		                    var grandimage = giphy.data.image_original_url;
		                    bot.chat(grandimage);
		            }
		            catch (error) {
		                    console.log(error);
		            }
		    });
	                       
	    }
		
		else if (gifargs == ('kimmis' || 'KIMMIS' || 'Kimmis')) {
			bot.chat('http://i.imgur.com/GTgsaSS.gif')
		}
        
	   else { 
		    request("http://api.giphy.com/v1/gifs/random?api_key=" + u_id + "&tag=" + encodeURIComponent(gifargs), function cbfunc(error, response, body) {
		            try {
		                    var giphy = eval('(' + body + ')');
		                    var gimage = giphy.data.image_original_url;
		                    bot.chat(gimage);
							console.log(gifargs);
		            }
		            catch (error) {
		                    console.log(error);
		            }
		    });
		}
	}
	
};


                

                