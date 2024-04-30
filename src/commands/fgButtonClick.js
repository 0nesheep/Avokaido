const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder, Events } = require('discord.js');
const profileModel = require("../models/profileSchema.js");
const achModel = require('../models/achModel.js');
const { generateCard } = require('../generateCard.js');

module.exports = {
    name: "fgButtonClick",
    async execute(interaction, msg, achArray, attach, backButton, image, hehe) {
        interaction.deferUpdate();

        const foreground = new EmbedBuilder()
            .setColor('e4ee71')
            .setTitle('**Edit Card (Foreground)**')
            .setThumbnail(image)
            .setDescription(`What would you like to change your foreground to?
Do check out the Encyclopedia if you need a reference!`                                                                                                                                                                                                                                                 )
            .setFooter({text: hehe});
        const buttonArray = [];
        let currButtons = new ActionRowBuilder();
        let total = 0;
        let count = 0;

        for (let i = 0; i < achArray.length; i++) {
            if (achArray[i]) {
                if (count > 4) {
                    buttonArray.push(currButtons);
                    currButtons = new ActionRowBuilder();
                    count = 0;
                }
                let achData;
                try {
                    achData = await achModel.findOne(
                        { index: i }
                    )
                } catch(e) {
                    console.log("Error getting achievement when generating fg buttons: " + e.message);
                    continue;
                }
                if (achData.fg.fgTop.imagePath != undefined) {
                    currButtons.addComponents(
                        new ButtonBuilder()
                            .setCustomId(`fg:${i}`)
                            .setLabel(`${achData.name}`)
                            .setStyle(ButtonStyle.Primary)  
                    )
                    total ++;
                    count ++;
                }
            }
        }
        if (count > 0) {
            buttonArray.push(currButtons);
        }
        const clearfg = new ActionRowBuilder();
        clearfg.addComponents(
            new ButtonBuilder()
                .setCustomId('fgCancel')
                .setLabel("clear foreground")
                .setStyle(ButtonStyle.Danger)
        )
        buttonArray.push(clearfg);
        buttonArray.push(backButton);
        if (total != 0) {
            msg.edit({ embeds: [foreground], components: buttonArray, files: [attach] });
        } else {
            foreground.setDescription("You do not have any available foregrounds!");
            msg.edit({ embeds: [foreground], components: [backButton], files: [attach]});
        }
    }
}