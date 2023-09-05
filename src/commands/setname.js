const { EmbedBuilder } = require('discord.js');
const emotes = require("../emotes.js");
const profileModel = require("../models/profileSchema.js");
const id = require("../id.js")

module.exports = {
    name: 'setname',
    description: 'changes nickname',
    async execute(message, messageArray) {
        if (message.guild == null) return;
        
        if (messageArray[1] == undefined) {
            return message.reply("Please do not set your name to nothing :(");
        }
        let name = messageArray[1];
        for(let i = 2; i < messageArray.length; i++) {
            name += " " + messageArray[i];
        }
        if (name.length > 20) {
            return message.reply('Your name is too long! Hehe cannot remember :(');
        }
        if(!name.match(/^[a-z0-9-.,'"!?:() ]+$/i)){
            return message.reply(`Please only include English characters, numbers, or '.', '-', '()', '!', or '?', ' and " `);
          }
        try {
            await profileModel.findOneAndUpdate(
                { userId: message.author.id },
                { $set: {
                    nickname: name,
                }}
            )

            let currUserData;
            currUserData = await profileModel.findOne(
                { userId: message.author.id }
            )

            if (currUserData) {
                const tempAchArray = currUserData.ach;
                tempAchArray[9] = true;
                await profileModel.findOneAndUpdate(
                    { userId: currUserData.userId },
                    { $set: { ach: tempAchArray }},
                );
            }

            if (!message.member.roles.cache.has(id.seed)) {
                let seed = await message.member.guild.roles.cache.find(role => role.id === `${id.seed}`);
                await message.member.roles.add(seed);
            }
            
            return message.reply(`You have set your nickname to ${name}!`);
        } catch(error) {
            console.log('Error occurred with setName command: ' + error.message);
        }
    }
}
        