const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder, Events } = require('discord.js');
const profileModel = require("../models/profileSchema.js");
const achModel = require('../models/achModel.js');
const { generateCard } = require('../generateCard.js');

module.exports = {
    name: "fgButtonClick",
    async execute(interaction, msg, achArray, attach, image, hehe) {
        interaction.deferUpdate();

        const foreground = new EmbedBuilder()
            .setColor('e4ee71')
            .setTitle('**Edit Card (Foreground)**')
            .setThumbnail(image)
            .setDescription(`What would you like to change your foreground to?
Do check out the Encyclopedia if you need a reference!`                                                                                                                                                                                                                                                 )
            .setFooter({text: hehe});
        const fgButtons = new ActionRowBuilder();

        for (let i = 0; i < achArray.length; i++) {
            if (achArray[i]) {
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
                    fgButtons.addComponents(
                        new ButtonBuilder()
                            .setCustomId(`fg:${i}`)
                            .setLabel(`${achData.name}`)
                            .setStyle(ButtonStyle.Primary)  
                    )
                }
            }
        }
        msg.edit({ embeds: [foreground], components: [fgButtons], files: [attach] });
    }
}