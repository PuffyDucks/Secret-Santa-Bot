const config = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();

client.login(config.token);

// runs when bot turns on
client.once('ready', () => {
    // confirms bot has started in log
    console.log('lets do this')

    // sets bot activity status
    client.user.setActivity("\".s join\" to start!", { type: "PLAYING" });
});

// when message is sent
client.on('message', message => {
    // if(message.content.indexOf(config.prefix) !== 0) return;
    // const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    // const command = args.shift().toLowerCase();
    if(message.content == '.s join'){
        // combines server ID and user ID multiplied by 2
        let serverID = message.guild.id;
        let authorID = message.author.id * 2;
        let authKey = serverID.toString() + authorID.toString();
        
        // sends private message to user
        message.author.send(":heart::white_heart::heart::white_heart::heart::white_heart::heart::white_heart::heart::white_heart::heart::white_heart::heart::white_heart::heart::white_heart::heart::white_heart::heart::white_heart::heart: \n:christmas_tree: Hi! Thanks for participating in Secret Santa! :santa: \nJust fill out the forum below! \nYou'll be DM'd your giftee's info in a few days.\n\n:star2: **IMPORTANT** :star2: \nAt the bottom is your **Auth Key**. \nCopy and paste this into the forum.\n(This prevents anyone from impersonating you)\n\n:gift: <https://forms.gle/UHBi7Xpg2fFSqy717>:gift: \n:heart::white_heart::heart::white_heart::heart::white_heart::heart::white_heart::heart::white_heart::heart::white_heart::heart::white_heart::heart::white_heart::heart::white_heart::heart::white_heart::heart:");
        message.author.send("`" + authKey + "`");

        // confirmation messages to console and discord
        message.channel.send(":bell: Instructions have been sent to your DM's!")
        console.log(message.author.username + " used .s join.");
    };

    
});