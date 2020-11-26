const config = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();

client.login(config.token);

client.once('ready', () => {
    console.log('lets do this')
    client.user.setActivity(" puffy is a whore", { type: "PLAYING" });
});

client.on('message', message => {
    if(message.content.indexOf(config.prefix) !== 0) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if(message.content == '.s join'){
        let serverID = message.guild.id;
        let authorID = message.author.id * 2;
        let authKey = serverID.toString() + authorID.toString();
        message.author.send(":heart::white_heart::heart::white_heart::heart::white_heart::heart::white_heart::heart::white_heart::heart::white_heart::heart::white_heart::heart::white_heart::heart::white_heart::heart::white_heart::heart::white_heart::heart::white_heart::heart: \n:christmas_tree: Hi! Thanks for participating in Secret Santa! :santa: \nJust fill out the forum below, and you will be sent a DM with your giftee's info soon!\n\n:star2: **IMPORTANT** :star2: Below is your **Auth Key**. \nCopy and paste this into the forum.\n(This is to prevent anyone from impersonating you)\n\n:gift: <https://forms.gle/UHBi7Xpg2fFSqy717>:gift: \n:heart::white_heart::heart::white_heart::heart::white_heart::heart::white_heart::heart::white_heart::heart::white_heart::heart::white_heart::heart::white_heart::heart::white_heart::heart::white_heart::heart::white_heart::heart::white_heart::heart:");
        message.author.send(authKey);
    };

    
});