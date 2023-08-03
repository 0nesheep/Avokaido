const { Events, time } = require('discord.js');
const emotes = require("../emotes.js");
const id = require("../id.js");
const { len, imageArray } = require('../thumbnails.js');
const { heheGen } = require('../hehe.js');
const profileModel = require("../models/profileSchema.js");
const { profile } = require('console');
const { CommandCooldown, msToMinutes } = require('discord-command-cooldown');
const ms = require('ms');
const db = require('../index.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        //testing
        //if (message.channel.id != 1135923765906260028) return;
        if (message.channel.id != id.botChannel && message.channel.id != '1135923765906260028') return;


        const prefix = '!';
        const dailyCooldown = new CommandCooldown('daily', ms('24h'));

        if (!message.content.startsWith(prefix) || 
            message.author.bot || 
            message.author.system ||
            message.channel.id == id.veriChannel || 
            message.guild == null) return;

        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase(); //single word after 

        const messageArray = message.content.split(" ");
        const argument = messageArray.slice(1);
        const cmd = messageArray[0];
        
        //image generator
        const random = Math.floor(Math.random() * len);
        const image = imageArray[random];

        //hehe generator
        const hehe = heheGen();

        //First mentioned user
        var target = message.mentions.users.first();
        //For no mentions
        if (target == undefined) {
            var target = message.author;
        }
        const targetName = "<@" + target + ">";

        let currUserData;
        try {
            currUserData = await profileModel.findOne({ userId: message.author.id });
            if (!currUserData) {
                currUserData = await profileModel.create({
                    userId: message.author.id,
                    serverId: message.guild.id,
                });
                console.log("created user");
            }
        } catch(e) {
            console.log(e.message);
        }

        //Regular commands////////////////////////////////////////////////////////////////
        if (command == 'help') {
            try {
                message.client.commands.get("help").execute(message, image, hehe);
            } catch (error) {
                console.log('Error occurred with help command: ' + error.message);
            }
        } else if (command == 'setname') {
            try { 
                message.client.commands.get("setname").execute(message, messageArray);
            } catch (error) {
                console.log('Error occurred with setname command: ' + error.message);
            }
            
        } else if (command == 'card') {
            if (!currUserData || currUserData.nickname == null) {
                return message.reply('Please register with the bot first by using `!setname <name>`');
            } else {
                message.client.commands.get("card").execute(message, target, image, hehe);
            }
        } else if (command =='give') {
            if (message.guild == null) {
                return message.reply("Please do not use this command in dms!")
            }
            if (!currUserData || currUserData.nickname == null) {
                return message.reply('Please register with the bot first by using `!setname <name>`');
            } else {
                message.client.commands.get("give").execute(message, messageArray, target, image, hehe);
            }
        } else if (command =='daily') {
            if (message.guild == null) {
                return message.reply("Please do not use this command in dms!")
            }
            if (currUserData.nickname == null) {
                return message.reply('Please register with the bot first by using `!setname <name>`');
            } else {
                message.client.commands.get('daily').execute(message, dailyCooldown, image, hehe);
            }
        } else if (command == 'transfer') {
            if (message.guild == null) {
                return message.reply("Please do not use this command in dms!")
            }
            if (currUserData.transferred) {
                return message.reply("You have already transferred your points!");
            }
            const avatar = message.client.users.cache.get(message.author.id).avatar;
            const identify = message.author.id;
            message.client.commands.get('transfer').execute(message, identify, image);
        } else if (command == 'editcard') {
            if (currUserData.nickname == null) {
                return message.reply('Please register with the bot first by using `!setname <name>`');
            }
            message.client.commands.get('editcard').execute(message, image, hehe);
            
        } else if (command == 'leaderboard') {
            if (currUserData.nickname == null) {
                return message.reply('Please register with the bot first by using `!setname <name>`');
            }
            message.client.commands.get('leaderboard').execute(message, image, hehe);
        }
        


        //Mod Commands///////////////////////
        if (command == 'add') {
            if (!message.member.roles.cache.has(id.modRole)) {
                return message.reply("You can only use that command if you are a mod!");
              }
            if (currUserData.nickname == null) {
                message.reply("Please register with the bot first");
            } else {
                message.client.commands.get("add").execute(message, messageArray, target, image, hehe);
            }
        }

    }
}