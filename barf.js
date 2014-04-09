var PlugAPI = require('plugapi');
var fs = require('fs');
var urban = require('urban');
path = require('path');
var config = require(path.resolve(__dirname, 'config.json'));
var lastBeerCheckIn = null;
var beerinfo = '¯\\_(ツ)_/¯';

PlugAPI.getAuth({
    username: config.botinfo.twitterUsername,
    password: config.botinfo.twitterPassword
}, function(err, auth) { // if err is defined, an error occurred, most likely incorrect login
    if(err) {
        console.log("An error occurred: " + err);
        return;
    }
    
    PlugAPI.getUpdateCode(auth, config.roomName, function(err, updateCode) {
        runBot(err, auth, updateCode);
    });
});
    
function runBot(error, auth, updateCode) {
    if(error) {
        console.log("An error occurred: " + err);
        return;
    } 
    
    initializeModules(auth, updateCode);
    
    bot.connect(config.roomName);

    bot.on('roomJoin', function(data) {    
        // Set up the room object
        room = data.room;
        
        console.log('Joined room', room);
        
        room.users.forEach(function(user) { addUserToDb(user); });

        lastRpcMessage = new Date();
    });

    bot.on('chat', function(data) {
        console.log('[CHAT] ' + data.from + ': ' + data.message);
        handleCommand(data);
    });
    
    bot.on('emote', function(data) {
        console.log('[EMTE] ' + data.from + ': ' + data.from + ' ' + data.message);
        handleCommand(data);
    });
    
    bot.on('user_join', function(data) {
        console.log('[JOIN] ' + data.username);
        
        // Add to DB
        addUserToDb(data);
        
        room.users.push(data);
        
        lastRpcMessage = new Date();
    })
    
    bot.on('user_leave', function(data) {
        console.log('User left: ', data);
        
        // Update DB
        db.run('UPDATE OR IGNORE USERS SET lastSeen = CURRENT_TIMESTAMP WHERE userid = ?', [data.id]);
        
        // Remove user from users list
        room.users.splice(_.pluck(room.users, 'id').indexOf(data.id), 1);
        
        lastRpcMessage = new Date();
    });
    
    bot.on('userUpdate', function(data) {
        console.log('User update: ', data);
        
        lastRpcMessage = new Date();
    });
    
    bot.on('curateUpdate', function(data) {
        console.log('[SNAG] ' + room.users.filter(function(user) { return user.id == data.id; })[0].username + ' snagged this song');
        
        room.curates[data.id] = true;
        
        lastRpcMessage = new Date();
    });
    
    bot.on('dj_advance', function(data) {
        console.log('New song: ', data);
        
        // Write previous song data to DB
        // But only if the last song actually existed
        if (room.media != null) {
            db.run('INSERT OR IGNORE INTO SONGS VALUES (?, ?, ?, ?, ?, ?)', [room.media.id, room.media.title, room.media.format, room.media.author, room.media.cid, room.media.duration]);
                    
            db.run('INSERT INTO PLAYS (userid, songid, upvotes, downvotes, snags, started, listeners) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)',
                [room.currentDJ, 
                room.media.id, 
                _.values(room.votes).filter(function(vote) { return vote == 1; }).length, 
                _.values(room.votes).filter(function(vote) { return vote == -1; }).length, 
                _.values(room.curates).length, 
                room.users.length]);
        }
        
        // Update room object
        room.media = data.data.media;
        room.djs = data.data.djs;
        room.votes = {};
        room.mediaStartTime = data.data.mediaStartTime;
        room.currentDJ = data.data.currentDJ;
        room.playlistID = data.data.playlistID;
        room.historyID = data.data.historyID;
        room.curates = {}; 
        room.suggested = {};
        
        // Perform automatic song metadata correction
        if (room.media != null && config.autoSuggestCorrections) {
            correctMetadata();
        }
        
        lastRpcMessage = new Date();
    });
    
    bot.on('djUpdate', function(data) {
        console.log('DJ update', data);
        room.djs = data.djs;
        
        lastRpcMessage = new Date();
    });
    
    bot.on('update_votes', function(data) {
        console.log('[VOTE] ' + _.findWhere(room.users, {id: data.id}).username
            + ' voted ' + data.vote);
        
        // Log vote
        room.votes[data.id] = data.vote;
        
        // Check if bot needs to bop
        if (room.votes[bot.getSelf().id] == null) {
            
            upvotes = _.values(room.votes).filter(function(vote) { return vote == 1; }).length;
            target = room.users.length <= 3 ? 2 : Math.ceil(Math.pow(1.1383 * (room.users.length - 3), 0.6176));
            if (upvotes >= target) {
                bot.upvote();
            }
        }
        
        lastRpcMessage = new Date();
    });
    
    function addUserToDb(user) {
        db.run('INSERT OR REPLACE INTO USERS VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)', 
        [user.id,
        user.username,
        user.language,
        user.dateJoined.replace('T', ' '),
        user.avatarID]);
    }
    
    function initializeModules(auth, updateCode) {
        // load context
        require(path.resolve(__dirname, 'context.js'))({auth: auth, updateCode: updateCode, config: config});
        
        // Allow bot to perform multi-line chat
        bot.multiLine = true;
        bot.multiLineLimit = 3;
        
        // Load commands
        try {
            fs.readdirSync(path.resolve(__dirname, 'commands')).forEach(function(file) {
                var command = require(path.resolve(__dirname, 'commands/' + file));
                commands.push({names: command.names,
                    handler: command.handler,
                    hidden: command.hidden,
                    enabled: command.enabled,
                    matchStart: command.matchStart
                })
            });
        } catch (e) {
            console.error('Unable to load command: ', e);
        }
        
        initializeDatabase();
    }
    
    function initializeDatabase() {
        db.run('CREATE TABLE IF NOT EXISTS USERS (userid VARCHAR(255) PRIMARY KEY, username VARCHAR(255), language VARCHAR(10), dateJoined TIMESTAMP, avatarID VARCHAR(255), lastSeen TIMESTAMP)');
        
        db.run('CREATE TABLE IF NOT EXISTS SONGS (id VARCHAR(255) PRIMARY KEY, title VARCHAR(255), format VARCHAR(255), author VARCHAR(255), cid VARCHAR(255), duration DOUBLE)');
        
        db.run('CREATE TABLE IF NOT EXISTS PLAYS (id INTEGER PRIMARY KEY AUTOINCREMENT, userid VARCHAR(255), songid VARCHAR(255), upvotes INTEGER, downvotes INTEGER, snags INTEGER, started TIMESTAMP, listeners INTEGER)');
        
        db.run('CREATE TABLE IF NOT EXISTS CHAT (id INTEGER PRIMARY KEY AUTOINCREMENT, message VARCHAR(255), userid VARCHAR(255), timestamp TIMESTAMP)');
    }
    
    function handleCommand(data) {
        // unescape message
        data.message = S(data.message).unescapeHTML().s;
        
        var command = commands.filter(function(cmd) { 
            var found = false;
            for (i = 0; i < cmd.names.length; i++) {
                if (!found) {
                    found = (cmd.names[i] == data.message.toLowerCase() || (cmd.matchStart && data.message.toLowerCase().indexOf(cmd.names[i]) == 0));
                }
            }
            return found;
        })[0];
        
        if (command && command.enabled) {
            //run command
            command.handler(data);
        }
    }
    
    function correctMetadata() {
        // first, see if the song exists in the db
        db.get('SELECT id FROM SONGS WHERE id = ?', [room.media.id], function(error, row) {
            if (row == null) {
                // if the song isn't in the db yet, check it for suspicious strings
                artistTitlePair = S((room.media.author + ' ' + room.media.title).toLowerCase());
                if (artistTitlePair.contains('official music video')
                  || artistTitlePair.contains('lyrics')
                  || artistTitlePair.contains('|')
                  || artistTitlePair.contains('official video')
                  || artistTitlePair.contains('[')
                  || artistTitlePair.contains('"')
                  || artistTitlePair.contains('*')
                  || artistTitlePair.contains('(HD)')
                  || artistTitlePair.contains('(HQ)')
                  || artistTitlePair.contains('1080p')
                  || artistTitlePair.contains('720p')
                  || artistTitlePair.contains(' - ')
                  || artistTitlePair.contains('full version')
                  || artistTitlePair.contains('album version')) {
                    suggestNewSongMetadata(room.media.author + ' ' + room.media.title);
                }
            }
        });
    }
    
    function suggestNewSongMetadata(valueToCorrect) {
        request('http://developer.echonest.com/api/v4/song/search?api_key=' + config.apiKeys.echoNest + '&format=json&results=1&combined=' + S(valueToCorrect).escapeHTML().stripPunctuation().s, function(error, response, body) {
            console.log('echonest body', body);
            if (error) {
                bot.chat('An error occurred while connecting to EchoNest.');
                console.log('EchoNest error', error);
            } else {
                response = JSON.parse(body).response;
                    
                room.media.suggested = {
                    author: response.songs[0].artist_name,
                    title: response.songs[0].title
                };
                
                // log
                console.log('[EchoNest] Original: "' + room.media.author + '" - "' + room.media.title + '". Suggestion: "' + room.media.suggested.author + '" - "' + room.media.suggested.title);
                
                if (room.media.author != room.media.suggested.author || room.media.title != room.media.suggested.title) {
                    bot.chat('Hey, the metadata for this song looks wrong! Suggested Artist: "' + room.media.suggested.author + '". Title: "' + room.media.suggested.title + '". Type ".fixsong yes" to use the suggested tags.');
                }
            }
        });
    }
	
	setInterval(function () {
	request("http://api.untappd.com/v4/checkin/recent?access_token=9AFC9E820951A3B14FA36D98489C80DB7717E6B5&limit=1", function cbfunc(error, response, body) {
	                                try {
	                                        var un = eval('(' + body + ')');
	                                        var all = un.response.checkins.items[0];
	                                    if (lastBeerCheckIn != all.checkin_id) {
	                                        var who = all.user.user_name;
	                                        var beer = all.beer.beer_name;
	                                        var brewery = all.brewery.brewery_name;
	                                        var beerlabel = all.beer.beer_label;
	                                        var style = all.beer.beer_style;
	                                        var rating = all.rating_score;
	                                        var loc = all.venue.venue_name;
	                                        var comment = all.checkin_comment;
	                                        lastBeerCheckIn = all.checkin_id;
	                                        var toasts = new Number(all.toasts.count);
											var beerinfo = null;
	                                        var msg1 = 'Looks like '+ who +' is currently drinking a ' + style;
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
    
    // Hack to make sure bot stays connected to plug
    // Every 15 seconds, check how much time has elapsed since the most recent RPC message.
    // If a song is playing and more than 15 seconds has passed since the expected end
    // of the song, stop the bot. If no song is playing and more than 30 minutes have passed
    // since an RPC event, stop the bot.
    if (config.stopBotOnConnectionLoss) {
        setInterval(function() {
            if (room.media != null) {
                console.log('checking ' + (new Date().getTime() - lastRpcMessage.getTime()) + ' < '
                    + ((room.media.duration * 1000) + 15000));
                if (new Date().getTime() - lastRpcMessage.getTime() > 15000 + (room.media.duration * 1000)) {
                    console.log('Suspected connection loss at ' + new Date());
                    process.exit(1);
                }
            } else {
                if (new Date().getTime() - lastRpcMessage > 1800000) {
                    console.log('Suspected connection loss at ' + new Date());
                    console.log('No song playing.');
                    process.exit(1);
                }
            }
        }, 15000);
    }
}