const { generateCard } = require('../generateCard.js');
const { checkPing } = require('../checkPing.js');
const id = require('../id.js');
const { EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const specSchema = require("../models/specModel.js");

module.exports = {
    name :"editSpecial",
    async execute(message, currUserData, image, hehe) {
        const specialIndex = currUserData.card.special;
        const menuEmbed = new EmbedBuilder()
                .setColor('e4ee71')
                .setTitle('**Edit Special Card**')
                .setThumbnail(image)
                .setDescription('Which decor would you like to swap to?')
                .setFooter({text: hehe});

        let specialData;
        try {
            specialData = await specSchema.findOne(
                { index: specialIndex }
            );
        } catch(e) {
            console.log("Error when trying to access special card info: " + e.message);
        }

        let decorButtons = [];
        let currentDecorRow = new ActionRowBuilder();
        let currCount = 0;
        let total = 0;
        for (i = 0; i < specialData.decor.length; i++) {
            const decor = specialData.decor[i];
            if (currCount > 4) {
                decorButtons.push(currentDecorRow);
                currCount = 0;
                currentDecorRow = new ActionRowBuilder();
            }

            if (decor.img != undefined) {
                currentDecorRow.addComponents(
                    new ButtonBuilder()
                        .setCustomId(`pat:${i}`)
                        .setLabel(`${decor.name}`)
                        .setStyle(ButtonStyle.Primary)  
                )
                currCount++;
                total++;
            }
        }
        if (currCount > 0) {
            decorButtons.push(currentDecorRow);
        }

        
        const returnToNonSpec = new ActionRowBuilder();
        returnToNonSpec.addComponents(
            new ButtonBuilder()
                .setCustomId('reset')
                .setLabel("return to regular card")
                .setStyle(ButtonStyle.Danger)
        )
        decorButtons.push(returnToNonSpec);

        const canvas = await generateCard(currUserData, message);
        let attach = new AttachmentBuilder(await canvas.encode('png'), { name: 'card.png' });

        let msg;
        if (total != 0) {
            msg = await message.reply({ embeds: [menuEmbed], components: decorButtons, files: [attach] });
        } else {
            foreground.setDescription("This special card has no extra decors");
            msg = await message.reply({ embeds: [menuEmbed], components: [returnToNonSpec], files: [attach]});
        }

        return msg;
    
    }
}
