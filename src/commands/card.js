const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const emotes = require("../emotes.js");
const profileModel = require("../models/profileSchema.js");
const { generateCard } = require('../generateCard.js');
const { checkPing } = require('../checkPing.js');


module.exports = {
    name: 'card',
    description: 'checks balance',
    async execute(message, target, image, hehe) {
        await checkPing(message);

        let currUserData;
        try { 
            currUserData = await profileModel.findOne({ userId: target.id });
        } catch(e) {
            console.log("Error fetching user card in !card: " + e.message);
        }
        if (!currUserData || currUserData.nickname == null) {
            return message.reply("this user has not registered~ check back later!");
        }

        const myEmbed = new EmbedBuilder()
            .setColor('e4ee71')
            .setTitle(`**${currUserData.nickname} | ${target}**`)
            .setThumbnail(image)
            .setDescription(`You have ${currUserData.petals} ${emotes.plum}

Level up to level 2 to get access to the profile card!`)
            .setFooter({text: hehe})
        if (currUserData.level == 1) {
                return message.reply({ embeds: [myEmbed], allowedMentions: { repliedUser: false }});
        }
                
        const canvas = await generateCard(currUserData, message);

        const attach = new AttachmentBuilder(await canvas.encode('png'), { name: 'card.png' });


        
        message.reply({ files: [attach],  allowedMentions: { repliedUser: false }});

    }
}