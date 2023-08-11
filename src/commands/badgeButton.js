const { EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const profileModel = require("../models/profileSchema.js");
const achModel = require('../models/achModel.js');
const { generateCard } = require('../generateCard.js');

async function generateAvailText(achArray) {
    let availText = ``;
        
    for (let i = 1; i < achArray.length; i++) {
        if (achArray[i]) {

            let achData;
            try {
                achData = await achModel.findOne(
                    { index: i }
                )
            } catch(e) {
                console.log("Error getting achievement when generating avail badges: " + e.message);
                continue;
            }

            availText += `\n [${i}] ${achData.name}`;
        }
    }

    return availText;
}

module.exports = {
    name: "badgeButton",
    async execute(interaction, msg, achArray, attach, backButton, image, hehe) {
        interaction.deferUpdate();

        const availText = await generateAvailText(achArray);
        
        const clearButton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('badgeCancel')
                    .setLabel('clear all badges')
                    .setStyle(ButtonStyle.Danger)
            );

        const badgeEmbed = new EmbedBuilder()
            .setColor('e4ee71')
            .setTitle("Edit Card (badges)")
            .setThumbnail(image)
            .setDescription(`Reply to this message to set your badges!
Please reply the badge number (indicated in []) in the order at which you will like your badges to appear in from right to left!
Your available badges are: 
${availText}

Please reply to this message within 3 minutes!`)
            .setFooter({text: hehe});
        
        msg.edit({embeds: [badgeEmbed], components: [clearButton, backButton], file: [attach]});


        const collector = msg.channel.createMessageCollector({ time: 180000 })
        function check(m) {
            var result = true;
            if (interaction.user.id != m.author.id) {
                result = false;
            }

            if (!m.reference) {
                result = false;
            } else if (m.reference.messageId != msg.id) {
                result = false;
            }

            return result;
        }

        

        collector.on('collect', async m => {
            if (m.author.bot) return;
            let data = [];
            let updateData;
            if (check(m)) {
                let badgesA = m.content.split(" ");
                for (let i = 0; i < 5 && i < badgesA.length; i++) {
                    badgesA[i] = Number(badgesA[i]);
                    if (isNaN(badgesA[i])) {
                        m.reply("Please only reply the *numbers* corresponding to your badges!");
                        break;
                    } else if (!achArray[badgesA[i]]) {
                        m.reply(`You do not have achievement ${badgesA[i]}! Please try again.`);
                        break;
                    } else if (data.includes(badgesA[i])) {
                        m.reply(`You have entered a duplicate badge number! The duplicate badge is ${badgesA[i]}.`);
                        break;
                    } else {
                        data.push(badgesA[i]);
                    }
                }
            }
        
            if (data.length > 0) {
                updateData = data;
            }

            if (updateData) {
                try {
                    await profileModel.findOneAndUpdate(
                        { userId: interaction.user.id },
                        { $set: {'card.activeAch': data}}
                    )
                } catch(e) {
                    console.log("Error updating achievement data: " + e.message);
                }

                collector.stop();
                badgeEmbed.setDescription("Update successful!");
                
                let currUserData = await profileModel.findOne(
                    { userId: interaction.user.id },
                );
                

                const newcanvas = await generateCard(currUserData, msg);
                attach = new AttachmentBuilder(await newcanvas.encode('png'), { name: 'card.png' });
                msg.edit({embeds: [badgeEmbed], components: [backButton], files: [attach]});
                
                
            }
        
        })



    }

    
}