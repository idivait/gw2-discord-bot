var
    Promise = require('bluebird'),
	async = require('async'),
	Autolinker = require('autolinker'),
	config = require('config'),
	gw2 = require('../lib/gw2'),
	phrases = require('../lib/phrases'),
    db = Promise.promisifyAll(require('../lib/db'))
    //lastID = '2227519'
;

var guild_id = config.has('guild.id') ? config.get('guild.id') : null;
var guild_key = config.has('guild.key') ? config.get('guild.key') : null;
var channel_name = config.has('guild.kicks_channel') ? config.get('guild.kicks_channel') : null;

module.exports = function(bot) {
	if (! (guild_id && guild_key && channel_name)) {
		console.log('kicks requires Guild ID, Guild Key, and kick channel in config');
		return;
	}
    db.getObjectAsync('lastid').then((lastID)=>{
        // Update motd every time the guild log is requested
        console.log("Kicks called. lastID = " + lastID);
        gw2.on('/v2/guild/'+guild_id+'/log?since='+lastID, (log, key, from_cache) => {
            //if (from_cache) return;
            console.log("Kicks called in function.");

            var kicks = log.filter(l => (l.type === 'kick')),
                channel = bot.channels.find('name', channel_name),
                time,
                text,
                type;

            if(kicks.length === 0) console.log("No new kicks"); return;

            kicks.reverse().forEach((kick)=>{
                time = new Date(kick.time);
                text = kick.user === kick.kicked_by ?
                    kick.user + " left the guild on " + time.toDateString()+" at "+time.toTimeString() + "." :
                    kick.user + " was kicked by " + kick.kicked_by + " on " + time.toDateString()+" at "+time.toTimeString() + ".";
                channel.sendEmbed({
                    title: kick.user === kick.kicked_by ? "Member Left" : "Member Got Kicked",
                    color: kick.user === kick.kicked_by ? 16756290 : 13369344,
                    description: text,
                    author : {
                        name : kick.user
                    }
                });
            });
            db.setObjectAsync('lastid', log[0].id).then(()=>{
                console.log("lastid updated");
            });
        });

        bot.on("ready", function() {
            gw2.keepUpdated('/v2/guild/'+guild_id+'/log?since='+lastID, guild_key, 10 * 60 * 1000); // every hour
        });
    });
};
