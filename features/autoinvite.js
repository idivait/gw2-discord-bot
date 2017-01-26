var config = require('config'),
    phrases = require('../lib/phrases');

module.exports = function(bot){
    bot.on('guildMemberAdd', (member) => {
        setTimeout(()=>{
            bot.guilds.first().fetchMember(member.id).then((user)=>{
                if(user.voiceChannelID === config.get('autoinvite.channel') ){
                    user.addRole(config.get('autoinvite.role')).then((data)=>{
                        user.sendMessage(phrases.get("AUTO_INVITE_RESPONSE"));
                    });
                }
            });
        }, 3000);
    });
}