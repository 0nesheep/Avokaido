const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder, Events } = require('discord.js');
const profileModel = require("../models/profileSchema.js");
const achModel = require('../models/achModel.js');
const { generateCard } = require('../generateCard.js');

module.exports = {
    name: 'editcard',
    description: 'allows user to edit card',
    async execute(message, image, hehe) {
        //foreground - all the foregrounds
        //style - [decor], [special]
        //future: other (fonts, bar color, whatever)
        //badges

        let currUserData;
        try {
            currUserData = await profileModel.findOne(
                { userId: message.author.id }
            )
        } catch(e) {
            console.log("Error getting currUserData in editcard: " + e.message);
        }

        const achArray = currUserData.ach;

        const menuEmbed = new EmbedBuilder()
                .setColor('e4ee71')
                .setTitle('**Edit Card**')
                .setThumbnail(image)
                .setDescription('Which part of the card do you want to edit?')
                .setFooter({text: hehe});

        const menuButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('foreground')
                    .setLabel('foreground')
                    .setStyle(ButtonStyle.Primary)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('style')
                    .setLabel('style')
                    .setStyle(ButtonStyle.Primary)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('badges')
                    .setLabel('badges')
                    .setStyle(ButtonStyle.Primary)
            )

            
            const canvas = await generateCard(currUserData);
            let attach = new AttachmentBuilder(await canvas.encode('png'), { name: 'card.png' });
            let msg = await message.reply({ embeds: [menuEmbed], components: [menuButtons], files: [attach] });
            //responses
            const collector = msg.createMessageComponentCollector();

            collector.on('collect', async (interaction) => {
                //if not button 
                if (!interaction.isButton()) return;
                if (interaction.user.id != message.author.id) return;

                if (interaction.customId == 'foreground') {
                    message.client.commands.get('fgButtonClick').execute(interaction, msg, achArray, attach, image, hehe);
                } else if (interaction.customId == 'style') {
                    message.client.commands.get('bgButtonClick').execute(interaction, msg, achArray, attach, image, hehe);
                }

                if (interaction.customId.startsWith("fg:")) {
                    for (let i = 0; i < achArray.length; i++) {
                        if (interaction.customId == `fg:${i}`) {
                            interaction.deferUpdate();
                            await profileModel.findOneAndUpdate(
                                { userId: message.author.id },
                                { $set: {'card.fg': i}},
                            )
                            try {
                                currUserData = await profileModel.findOne(
                                    { userId: message.author.id }
                                )
                            } catch(e) {
                                console.log("Error getting currUserData in editcard: " + e.message);
                            }
                            const newcanvas = await generateCard(currUserData);
                            const newattach = await new AttachmentBuilder(await newcanvas.encode('png'), { name: 'card.png' });
                            msg.edit({files: [newattach], embeds:[], components: []});
                        }
                    }
                } else if (interaction.customId.startsWith("bg:")) {

                    for (let i = 0; i < achArray.length; i++) {
                        if (interaction.customId == `bg:${i}`) {
                            interaction.deferUpdate();
                            await profileModel.findOneAndUpdate(
                                { userId: message.author.id },
                                { $set: {'card.decor': i}},
                            )
                            try {
                                currUserData = await profileModel.findOne(
                                    { userId: message.author.id }
                                )
                            } catch(e) {
                                console.log("Error getting currUserData in editcard: " + e.message);
                            }
                            const newcanvas = await generateCard(currUserData);
                            const newattach = await new AttachmentBuilder(await newcanvas.encode('png'), { name: 'card.png' });
                            msg.edit({files: [newattach], embeds:[], components: []});
                        }
                    }
                }
                
            });
        }

    
}