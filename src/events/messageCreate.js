const { Events } = require('discord.js');
const emotes = require("../emotes.js");
const id = require("../id.js");
const { len, imageArray } = require('../thumbnails.js');
const { heheGen } = require('../hehe.js');
const profileModel = require("../models/profileSchema.js");
const { profile } = require('console');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        const prefix = '!';
        if (!message.content.startsWith(prefix) || message.author.bot || message.author.system || message.guild == null) return;

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
                message.client.commands.get("setname").execute(message, messageArray);
            
        } else if (command == 'bal') {
            if (currUserData.nickname == null) {
                message.reply('Please register with the bot first');
            } else {
                message.client.commands.get("bal").execute(message, target, image, hehe);
            }
        } else if (command =='give') {
            if (currUserData.nickname == null) {
                message.reply("Please register with the bot first");
            } else {
                message.client.commands.get("give").execute(message, messageArray, target, image, hehe);
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
        }

    }
}