const { Events, time } = require('discord.js');
const emotes = require("../emotes.js");
const id = require("../id.js");
const { len, imageArray } = require('../thumbnails.js');
const { heheGen } = require('../hehe.js');
const profileModel = require("../models/profileSchema.js");
const { profile } = require('console');
const { CommandCooldown } = require("discord-command-cooldown");
const { generateFib } = require('../fib.js');
const ms = require('ms');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if ( message.author.bot || message.author.system || message.guild == null ) return;

        //image generator
        const random = Math.floor(Math.random() * len);
        const image = imageArray[random];
        const chatExpCooldown = new CommandCooldown('chatExp', ms('15s'));
        const userCooldowned = await chatExpCooldown.getUser(message.author.id);

        //hehe generator
        const hehe = heheGen();

        if (message.channel.id == id.veriChannel) {
            message.client.commands.get("verify").execute(message, image, hehe);
        } else if (!message.content.startsWith("!")) {
            if (!userCooldowned) {
                try {
                    await profileModel.findOneAndUpdate(
                        { userId: message.author.id },
                        { 
                            $inc: {
                                dream: 15,
                            }
                        }  
                    )
                    await chatExpCooldown.addUser(message.author.id);
                } catch(e) {
                    console.log('Error in adding chatExp: ' + e.message);
                }

                try {
                    const currUserData = await profileModel.findOne({ userId: message.author.id});
                    let currLevel = currUserData.level;
                    let nextLevel = generateFib(currLevel + 1);

                    if (currUserData.dream >= nextLevel) {
                        await profileModel.findOneAndUpdate(
                            { userId: message.author.id },
                            { 
                                $inc: {level: 1},
                                $set: {dream: currUserData.dream - nextLevel},
                            },
                        );

                        message.client.commands.get('levelPing').execute(message, currLevel + 1, image, hehe);
                    }
                    
                } catch (e) {
                    console.log('Error loading level up message: ' + e.message);
                }
            }
        }
    }

}