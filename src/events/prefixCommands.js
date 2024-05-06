const { Events, time, MessageFlags } = require('discord.js');
const emotes = require("../emotes.js");
const id = require("../id.js");
const { len, imageArray } = require('../thumbnails.js');
const { heheGen } = require('../hehe.js');
const profileModel = require("../models/profileSchema.js");
const { profile } = require('console');
const { CommandCooldown, msToMinutes } = require('discord-command-cooldown');
const ms = require('ms');
const db = require('../index.js');
const events = require('../ongoingEvents.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        //testing
        //if (message.channel.id != 1135923765906260028) return;
        if (message.channel.id != id.botChannel && 
            //bot testing channel
            message.channel.id != '1135923765906260028' &&
            //commands channel
            message.channel.id != '1129793754312757330' &&
            message.channel.id != id.eventSubChannel &&
            message.channel.id != '1191385916003065998'
            ) return;


        const prefix = '!';
        const dailyCooldown = new CommandCooldown('daily', ms('24h'));

        if (!message.content.startsWith(prefix) || 
            message.author.bot || 
            message.author.system ||
            message.channel.id == id.veriChannel || 
            message.guild == null) return;

        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase(); //single word after 

        const messageArray = message.content.split(/\s+/);
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
            message.reply("This command has been deprecated!")
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
        } else if (command == 'submit') {
            if (currUserData.nickname == null) {
                return message.reply('Please register with the bot first by using `!setname <name>`');
            }

            let eventName = messageArray[1].toLowerCase();
            const nameCheck = (currName) => {
                for (let i = 0; i < events.events.length; i++) {
                    if (currName.startsWith(events.events[i])) {
                        eventName = events.events[i].toLowerCase();
                        break;
                    }
                }
            } 
            nameCheck(eventName);
            if (messageArray[1] && events.events.includes(eventName)) {
                message.client.commands.get(`${eventName}`).execute(message);
            }
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
        } else if (command == 'permashop') {
            if (!message.member.roles.cache.has(id.modRole)) {
                return message.reply("You can only use that command if you are a mod!");
            }
            try {
                if (message.guild == null) return;
                
                const price = parseInt(messageArray[1]);
                const link = messageArray[2];
                
                message.client.commands.get('permashop').execute(message, price, link, image, hehe);
              } catch (error) {
                console.log('Error occurred with make permanent shop command', error);
              }
        } else if (command == 'decorshop') {
            if (!message.member.roles.cache.has(id.modRole)) {
                return message.reply("You can only use that command if you are a mod!");
            }
            try {
                if (message.guild == null) return;
                
                const price = parseInt(messageArray[1]);
                const achievement = messageArray[2];
                
                message.client.commands.get('decorshop').execute(message, price, achievement, image, hehe);
              } catch (error) {
                console.log('Error occurred with make decoration permanent shop command', error);
              }
        } else if (command == 'addach' || command == 'addachievement') {
            if (!message.member.roles.cache.has(id.modRole)) {
                return message.reply("You can only use that command if you are a mod!");
            } 
            try {
                if (message.guild == null) return;

                message.client.commands.get('addach').execute(message, messageArray, target, image, hehe);
            } catch(e) {
                console.log(`Error adding achievement to <@${target}>: `, e.message);
            }
        } else if (command == "edittitle") {
            if (!message.member.roles.cache.has(id.modRole)) {
                return message.reply("You can only use that command if you are a mod!");
            } 
            if (message.guild == null) return;
            try {
                message.client.commands.get('editTitle').execute(message, messageArray, image, hehe);
            } catch(e) {
                console.log("Error editing shop: " + e.message);
            }
                
        }

    }
}