const { EmbedBuilder } = require('discord.js');
const emotes = require("../emotes.js");
const profileModel = require("../models/profileSchema.js");

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
        try {
            await profileModel.findOneAndUpdate(
                { userId: message.author.id },
                { $set: {
                    nickname: name,
                }}
            )
            return message.reply(`You have set your nickname to ${name}!`);
        } catch(error) {
            console.log('Error occurred with setName command: ' + e.message);
        }
    }
}
        