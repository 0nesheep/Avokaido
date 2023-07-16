const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder, Events } = require('discord.js');
const profileModel = require("../models/profileSchema.js");
const achModel = require('../models/achModel.js');
const { generateCard } = require('../generateCard.js');

module.exports = {
    name: "bgButtonClick",
    async execute(interaction, msg, achArray, attach, image, hehe) {
        interaction.deferUpdate();

        const background = new EmbedBuilder()
            .setColor('e4ee71')
            .setTitle('**Edit Card (style)**')
            .setThumbnail(image)
            .setDescription(`What would you like to change your style to?
Do check out the Encyclopedia if you need a reference!`                                                                                                                                                                                                                                                 )
            .setFooter({text: hehe});
        const buttonArray = [];
        let currButtons = new ActionRowBuilder();
        let count = 0;

        for (let i = 0; i < achArray.length; i++) {
            if (achArray[i]) {
                if (count >= 4) {
                    buttonArray.push(currButtons);
                    currButtons = new ActionRowBuilder();
                    console.log("new");
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
                if (achData.style.bgTop.imagePath != undefined) {
                    currButtons.addComponents(
                        new ButtonBuilder()
                            .setCustomId(`bg:${i}`)
                            .setLabel(`${achData.name}`)
                            .setStyle(ButtonStyle.Primary)  
                    )
                }
                count ++;
            }
            
        }
        msg.edit({ embeds: [background], components: buttonArray, files: [attach] });
        
    }
}