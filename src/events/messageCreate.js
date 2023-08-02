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
        //if (message.channel.id != 1135923765906260028) return;


        if ( message.author.bot || message.author.system || message.guild == null ) return;

        //image generator
        const random = Math.floor(Math.random() * len);
        const image = imageArray[random];
        const chatExpCooldown = new CommandCooldown('chatExp', ms('45s'));
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
                    const currUserData = await profileModel.findOne({ userId: message.author.id });
                    if (currUserData) {
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
                        if (currLevel + 1 >= 3) {
                            //check if already has role and give petals
                            if (!message.member.roles.cache.has(id.sprout)) {
                                let sprout = await message.member.guild.roles.cache.find(role => role.id === `${id.sprout}`);
                                await message.member.roles.add(sprout);
                                try {
                                    await profileModel.findOneAndUpdate(
                                        { userId: message.author.id },
                                        { $inc: { petals: 5 } }
                                    )
                                } catch(e) {
                                    console.log("Error adding sprout role: " + e.message);
                                }
                            }

                            const updateAch = currUserData.ach;
                            if (!updateAch[12]) {
                                updateAch[12] = true;
                                try {
                                    await profileModel.findOneAndUpdate(
                                        { userId: message.author.id },
                                        { $set: {ach: updateAch} },
                                    )
                                } catch(e) {
                                    console.log("Error adding sprout achievement: " + e.message);
                                }
                            }
                        }

                        if (currLevel + 1 >= 10) {

                            //check if already has role and give petals
                            if (!message.member.roles.cache.has(id.seedling)) {
                                let seedling = await message.member.guild.roles.cache.find(role => role.id === `${id.seedling}`);
                                await message.member.roles.add(seedling);
                                try {
                                    await profileModel.findOneAndUpdate(
                                        { userId: message.author.id },
                                        { $inc: { petals: 10 } }
                                    )
                                } catch(e) {
                                    console.log("Error adding seedling role: " + e.message);
                                }
                            }
                            
                            const updateAch = currUserData.ach;
                            if (!updateAch[13]) {
                                updateAch[13] = true;
                                try {
                                    await profileModel.findOneAndUpdate(
                                        { userId: message.author.id },
                                        { $set: {ach: updateAch} },
                                    )
                                } catch(e) {
                                    console.log("Error adding seedling achievement: " + e.message);
                                }
                            }
                        }

                        if (currLevel + 1 >= 20) {

                            //check if already has role and give petals
                            if (!message.member.roles.cache.has(id.growth)) {
                                let growth = await message.member.guild.roles.cache.find(role => role.id === `${id.growth}`);
                                await message.member.roles.add(growth);
                                try {
                                    await profileModel.findOneAndUpdate(
                                        { userId: message.author.id },
                                        { $inc: { petals: 10 } }
                                    )
                                } catch(e) {
                                    console.log("Error adding growth role: " + e.message);
                                }
                            }
                            
                            const updateAch = currUserData.ach;
                            if (!updateAch[14]) {
                                updateAch[14] = true;
                                try {
                                    await profileModel.findOneAndUpdate(
                                        { userId: message.author.id },
                                        { $set: {ach: updateAch} },
                                    )
                                } catch(e) {
                                    console.log("Error adding growth achievement: " + e.message);
                                }
                            }
                        }

                        if (currLevel + 1 >= 30) {

                            //check if already has role and give petals
                            if (!message.member.roles.cache.has(id.flower)) {
                                let flower = await message.member.guild.roles.cache.find(role => role.id === `${id.flower}`);
                                await message.member.roles.add(flower);
                                try {
                                    await profileModel.findOneAndUpdate(
                                        { userId: message.author.id },
                                        { $inc: { petals: 20 } }
                                    )
                                } catch(e) {
                                    console.log("Error adding flower role: " + e.message);
                                }
                            }
                            
                            const updateAch = currUserData.ach;
                            if (!updateAch[15]) {
                                updateAch[15] = true;
                                try {
                                    await profileModel.findOneAndUpdate(
                                        { userId: message.author.id },
                                        { $set: {ach: updateAch} },
                                    )
                                } catch(e) {
                                    console.log("Error adding flower achievement: " + e.message);
                                }
                            }
                        }
                    }
                }
                    
                } catch (e) {
                    console.log('Error loading level up message: ' + e.message);
                }
            }
        }
    }

}