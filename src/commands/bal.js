const { EmbedBuilder } = require('discord.js');
const emotes = require("../emotes.js");
const profileModel = require("../models/profileSchema.js");

module.exports = {
    name: 'bal',
    description: 'checks balance',
    async execute(message, target, image, hehe) {
        let currUserData;
        try { 
            currUserData = await profileModel.findOne({ userId: target.id });
        } catch(e) {
            console.log("Error fetching user bal in !bal: " + e.message);
        }
        if (!currUserData || currUserData.nickname == null) {
            return message.reply("this user has not registered~ check back later!");
        }

        const myEmbed = new EmbedBuilder()
            .setColor('e4ee71')
            .setTitle(`**${currUserData.nickname} | ${target}**`)
            .setThumbnail(image)
            .setDescription(`You have ${currUserData.petals} ${emotes.plum}`)
            .setFooter({text: hehe})
                

            message.channel.send({ embeds: [myEmbed]});
    }
}