const Discord = require('discord.js');
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

exports.run = (client, message) => {
    // Load client secrets from a local file.
    fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), sendInfo);
    });

    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
    }

    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback for the authorized client.
     */
    function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error while trying to retrieve access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
            if (err) return console.error(err);
            console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client);
        });
    });
    }

    function sendInfo(auth) {
    const sheets = google.sheets({version: 'v4', auth});
    sheets.spreadsheets.values.get({
        spreadsheetId: '1XB4vRe538huvsMin3Bqu3kxI7X0LxUBscaW80BKBgmA',
        range: `${message.guild.id}!A1:T`,
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const rows = res.data.values;

        // gets authKey
        let serverID = message.guild.id;
        let authorID = message.author.id * 2;
        let authKey = serverID.toString() + authorID.toString();

        // checks for user's authKey to find giftee
        let giftee; 
        let found = false;
        for (check in rows) {
            if (rows[check][0] == authKey) {
                giftee = rows[check][19];
                found = true;
            }
        }

        // check to see if user is registered
        if (!found) {
            message.channel.send(":x: You don't seem to be signed up for Secret Santa!");
        } else if (!giftee) {
            message.channel.send(":hourglass: Sorry! Matching hasn't started for this server.");      
        } else {
            message.channel.send(":white_check_mark: Match found! Giftee info sent to DM's!");

            // sends giftee info
            message.author.send(`:love_letter: You've received your match!\n\nYour giftee is: **${rows[giftee][1]}**(${rows[giftee][2]})\n`);
            
            // embed with questionnaire answers
            const info = new Discord.MessageEmbed()
                .setTitle(`Info about ${rows[giftee][1]}`)
            for (let i = 3; i <= 15; i++) {
                info.addField(`\n▷ ${rows[0][i]}`, `\n\`${rows[giftee][i]}\`\n`);
            }

            message.author.send(info);
            message.author.send("\nGet your gift in by **December 25th** so we can open our gifts together! :gift: \n\nHappy Holidays!! :snowman2:");
        }
    });
    }
}