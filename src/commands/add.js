const { EmbedBuilder } = require('discord.js');
const emotes = require("../emotes.js");
const profileModel = require("../models/profileSchema.js");
const id = require("../id.js")

module.exports = {
    name: 'add',
    description: 'adds petals to target',
    async execute(message, messageArray, target, image, hehe) {
        let targetData;
        let transferAmount;

        try {
            targetData = await profileModel.findOne(
                { userId: target.id }
            );
        } catch(e) {
            console.log("Error fetching data for give: " + e.message);
        }

        if (!targetData || targetData.nickname == null) {
            return message.reply("The recipient has not registered yet! Please check again later");
        } 

        //check if number of args is correct (1 mention and 1 amount)
        if (messageArray[1] == undefined) {
            return message.reply("You need to enter an amount!");
        //check if amount came first
        } else if (Number.isInteger(Number(messageArray[1]))) {
            transferAmount = Number(messageArray[1]);
        //amount came second
        } else if (Number.isInteger(Number(messageArray[2]))) {
            transferAmount = Number(messageArray[2]);
        } else {
            return message.reply('Invalid amount!');
        }

        if (transferAmount <= 0) {
            return message.reply("Invalid amount!");
        }

        try {
            await profileModel.findOneAndUpdate(
                { userId: target.id },
                {
                    $inc: {
                        petals: transferAmount,
                    },
                }
            );

            const myEmbed = new EmbedBuilder()
                .setColor('e4ee71')
                .setTitle('**Giving plums**')
                .setThumbnail(image)
                .setDescription(`You added ${transferAmount} ${emotes.plum} to **${target}**!`)
                .setFooter({text: hehe})

            const logsChannel = await message.client.channels.cache.get(id.plumLog);
            logsChannel.send(`[MOD] ${message.author} gave ${transferAmount} to ${target}`);
            
            message.reply({ embeds: [myEmbed]});

        } catch (e) {
            console.log("Error transferring petals: " + e.message);
        }
    }
}